import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { HP, WP } from "../../config/responsive";

const FriendsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <ScrollView style={styles.leaderboardContainer}>
        <View style={styles.leaderboardNormal}>
          <Text style={styles.boldText}>Satya</Text>
          <Text style={styles.minuteText}>Last Seen 17 Minutes Ago</Text>
        </View>
        <View style={styles.leaderboardNormal}>
          <Text style={styles.boldText}>Vihaan</Text>
          <Text style={styles.minuteText}>Last Seen 43 Minutes Ago</Text>
        </View>
        <View style={styles.leaderboardNormal}>
          <Text style={styles.boldText}>Vedant</Text>
          <Text style={styles.minuteText}>Last Seen 1 Hour Ago</Text>
        </View>
        <View style={styles.leaderboardNormal}>
          <Text style={styles.boldText}>Rohan</Text>
          <Text style={styles.minuteText}>Last Seen 2 Hours Ago</Text>
        </View>
        <View style={styles.leaderboardNormal}>
          <Text style={styles.boldText}>Sashank</Text>
          <Text style={styles.minuteText}>Last Seen 4 Hours Ago</Text>
        </View>
        <View style={styles.leaderboardNormal}>
          <Text style={styles.boldText}>Preetham</Text>
          <Text style={styles.minuteText}>Last Seen 6 Hours Ago</Text>
        </View>
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
  minuteText: {
    fontWeight: "800",
    color: "#ffffff",
    width: WP(30),
  },
});
