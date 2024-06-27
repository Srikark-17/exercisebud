import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { HP, WP } from "../../config/responsive";
import { AntDesign } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const LeaderboardScreen = ({ navigation }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [name, setName] = useState("");
  const [showFriends, setShowFriends] = useState(false);

  useEffect(() => {
    const getSecureStorage = async () => {
      const storedName = await SecureStore.getItemAsync("name");
      setName(storedName);
      if (storedName) {
        await fetchFriendsData(storedName);
      }
    };

    getSecureStorage();

    const getLeaderboard = async () => {
      const myHeaders = new Headers();
      myHeaders.append(
        "api-key",
        "bu0vFJtWdhjfvMo6Pc7JcSMUhM7gMTydozsFORUm8TglQhOxOoA4HwqVhvczt5Wd"
      );
      myHeaders.append("Access-Control-Request-Headers", "*");
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        dataSource: "Cluster0",
        database: "xbud",
        collection: "users",
        filter: { name: name },
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://us-east-2.aws.data.mongodb-api.com/app/data-dvjag/endpoint/data/v1/action/find",
          requestOptions
        );
        const result = await response.json();

        if (result.documents && result.documents.length > 0) {
          const userDoc = result.documents[0];
          const userData = {
            name: "You",
            steps: userDoc.stepStats?.yearly || 0,
          };

          let leaderboardData = [userData];

          if (userDoc.friends && userDoc.friends.length > 0) {
            const friendsData = userDoc.friends.map((friend) => ({
              name: friend.name,
              steps: friend.stepStats?.yearly || 0,
            }));
            leaderboardData = [...leaderboardData, ...friendsData];
          }

          // Sort leaderboard data by steps in descending order
          leaderboardData.sort((a, b) => b.steps - a.steps);
          setLeaderboard(leaderboardData);
        } else {
          setLeaderboard([]);
        }
      } catch (error) {
        console.error(error);
        setLeaderboard([]);
      }
    };

    getLeaderboard();
  }, [name]);

  const getLeaderboardItemStyle = (index) => {
    switch (index) {
      case 0:
        return styles.leaderboardGold;
      case 1:
        return styles.leaderboardSilver;
      case 2:
        return styles.leaderboardBronze;
      default:
        return styles.leaderboardNormal;
    }
  };

  const fetchFriendsData = async (name) => {
    try {
      const response = await fetch(
        "https://us-east-2.aws.data.mongodb-api.com/app/data-dvjag/endpoint/data/v1/action/findOne",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key":
              "bu0vFJtWdhjfvMo6Pc7JcSMUhM7gMTydozsFORUm8TglQhOxOoA4HwqVhvczt5Wd",
            "Access-Control-Request-Headers": "*",
          },
          body: JSON.stringify({
            dataSource: "Cluster0",
            database: "xbud",
            collection: "users",
            filter: { name: name },
          }),
        }
      );

      const result = await response.json();

      if (result.document && result.document.friends) {
        setFriendsData(result.document.friends);
      }
    } catch (error) {
      console.error("Error fetching friends data:", error);
    }
  };

  const getRelativeTime = (lastActiveTime) => {
    const now = moment();
    const then = moment(lastActiveTime);
    const diff = moment.duration(now.diff(then));

    if (diff.asMinutes() < 1) {
      return "Just Now";
    } else if (diff.asHours() < 1) {
      return `${Math.floor(diff.asMinutes())} Minutes Ago`;
    } else if (diff.asDays() < 1) {
      return `${Math.floor(diff.asHours())} Hours Ago`;
    } else {
      return then.format("MMM Do");
    }
  };

  console.log(leaderboard);

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => setShowFriends(false)}
          activeOpacity={1}
        >
          <View
            style={
              !showFriends ? styles.activeContainer : styles.inactiveContainer
            }
          >
            <Text style={styles.toggleText}>Leaderboard</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowFriends(true)}
          activeOpacity={1}
        >
          <View
            style={
              showFriends ? styles.activeContainer : styles.inactiveContainer
            }
          >
            <Text style={styles.toggleText}>Friends</Text>
          </View>
        </TouchableOpacity>
      </View>
      {!showFriends ? (
        <>
          <Text style={styles.title}>Leaderboard</Text>
          <ScrollView style={styles.leaderboardContainer}>
            {leaderboard.length >= 1 ? (
              leaderboard.map((item, index) => (
                <View key={index} style={getLeaderboardItemStyle(index)}>
                  <Text style={styles.boldText}>{item.name}</Text>
                  <Text style={styles.boldText}>{item.steps}</Text>
                </View>
              ))
            ) : (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.noFriendsText}>
                  Add a friend to begin your leaderboard. Press "Friends" and
                  click the <AntDesign size={24} name="plus" color="#aeaeae" />{" "}
                  icon.
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={styles.topContainer}>
            <View />
            <Text style={styles.friendsTitle}>Friends</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Add Friend")}
              activeOpacity={1}
            >
              <AntDesign size={24} name="plus" color="#aeaeae" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.leaderboardContainer}>
            {friendsData.map((friend) => (
              <View key={friend.id} style={styles.leaderboardNormal}>
                <Text style={styles.boldText}>{friend.name}</Text>
                {friend.lastActive && (
                  <Text style={styles.minuteText}>
                    Last seen {getRelativeTime(friend.lastActive)}
                  </Text>
                )}
              </View>
            ))}
            {friendsData.length == 0 && (
              <Text style={styles.noFriendsText}>
                You have not added any of your friends. Press the plus icon
                above to add your friends!
              </Text>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: WP(5),
    backgroundColor: "#fff",
    height: HP(100),
  },
  title: {
    fontSize: HP(3.5),
    fontWeight: "800",
    marginVertical: HP(3),
    alignSelf: "center",
    color: "#000",
    marginBottom: HP(7),
    marginTop: HP(6),
  },
  leaderboardGold: {
    paddingHorizontal: WP(5),
    paddingVertical: HP(3),
    width: WP(90),
    borderRadius: 5,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d4af37",
    marginBottom: HP(2),
  },
  leaderboardSilver: {
    paddingHorizontal: WP(5),
    paddingVertical: HP(3),
    width: WP(90),
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: HP(2),
    backgroundColor: "#c0c0c0",
  },
  leaderboardBronze: {
    paddingHorizontal: WP(5),
    paddingVertical: HP(3),
    width: WP(90),
    borderRadius: 5,
    display: "flex",
    marginBottom: HP(2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#CD7F32",
  },
  leaderboardNormal: {
    paddingHorizontal: WP(5),
    paddingVertical: HP(3),
    width: WP(90),
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: HP(2),
    backgroundColor: "#cecece",
  },
  boldText: {
    fontWeight: "800",
    color: "#ffffff",
  },
  noFriendsText: {
    fontSize: HP(2),
    textAlign: "center",
    color: "#000",
    fontWeight: "600",
  },
  topContainer: {
    display: "flex",
    height: HP(10),
    marginBottom: HP(4),
    flexDirection: "row",
    marginTop: HP(3.5),
    alignItems: "center",
    justifyContent: "space-between",
  },
  friendsTitle: {
    fontSize: HP(3.5),
    fontWeight: "800",
    alignSelf: "center",
    color: "#000",
  },
  toggleContainer: {
    borderRadius: 10,
    backgroundColor: "#aeaeae",
    marginLeft: "auto",
    marginTop: HP(8),
    marginRight: "auto",
    flexDirection: "row",
  },
  activeContainer: {
    paddingVertical: HP(1.5),
    width: WP(27),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4169E1",
  },
  inactiveContainer: {
    paddingVertical: HP(1.5),
    width: WP(27),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#aeaeae",
  },
  toggleText: {
    fontWeight: "600",
    color: "#ffffff",
  },
});
