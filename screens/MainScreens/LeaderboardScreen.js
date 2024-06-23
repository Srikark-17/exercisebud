import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { HP, WP } from "../../config/responsive";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const getSecureStorage = async () => {
      const storedName = await SecureStore.getItemAsync("name");
      setName(storedName);
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
        collection: "requests",
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
            name: userDoc.name,
            steps: userDoc.stepStats.yearly,
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <ScrollView style={styles.leaderboardContainer}>
        {leaderboard.length > 1 ? (
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
              Add a friend to begin your leaderboard. Go to the{" "}
              <MaterialIcons name="groups" size={26} color="#aeaeae" /> {"  "}{" "}
              icon and click the{" "}
              <AntDesign size={24} name="plus" color="#aeaeae" />
              icon.
            </Text>
          </View>
        )}
      </ScrollView>
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
    marginBottom: HP(8),
    marginTop: HP(13),
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
});
