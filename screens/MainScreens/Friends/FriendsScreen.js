import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { HP, WP } from "../../../config/responsive";
import { AntDesign } from "@expo/vector-icons";

const FriendsScreen = ({ navigation }) => {
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
  plus: {
    fontSize: HP(1.4),
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
