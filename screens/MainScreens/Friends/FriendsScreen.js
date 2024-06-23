import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { HP, WP } from "../../../config/responsive";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import * as SecureStore from "expo-secure-store";

const FriendsScreen = ({ navigation }) => {
  const [friendsData, setFriendsData] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchUserIdAndFriends = async () => {
      try {
        const storedName = await SecureStore.getItemAsync("name");
        setName(storedUserId);

        if (storedName) {
          await fetchFriendsData(storedName);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserIdAndFriends();
  }, []);

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

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View />
        <Text style={styles.title}>Friends</Text>
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
      </ScrollView>
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: WP(5),
    backgroundColor: "#fff",
    height: HP(100),
    paddingTop: HP(10),
  },
  topContainer: {
    display: "flex",
    height: HP(10),
    marginBottom: HP(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: HP(3.5),
    fontWeight: "800",
    alignSelf: "center",
    color: "#000",
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
  minuteText: {
    fontWeight: "800",
    color: "#ffffff",
    width: WP(30),
  },
});
