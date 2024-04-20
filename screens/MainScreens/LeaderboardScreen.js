import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { HP, WP } from "../../config/responsive";

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = React.useState(true);

  useEffect(() => {
    const getLeaderboard = async () => {
      const response = await fetch(
        `https://us-east-2.aws.data.mongodb-api.com/app/data-dvjag/endpoint/data/v1/action/findOne`,
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
            collection: "leaderboard",
            filter: {
              id: "65e94955a5030c42486f3097",
            },
          }),
        }
      );

      if (!response.ok) {
        console.log(response);
        return;
      }

      let user = await response.json().then((data) => data.document);
      setLeaderboard(user.leadership);
    };

    getLeaderboard();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Global Leaderboard</Text>
      <ScrollView style={styles.leaderboardContainer}>
        <View style={styles.leaderboardGold}>
          <Text style={styles.boldText}>Srikar</Text>
          <Text style={styles.boldText}>8723</Text>
        </View>
        <View style={styles.leaderboardSilver}>
          <Text style={styles.boldText}>Satya</Text>
          <Text style={styles.boldText}>7326</Text>
        </View>
        <View style={styles.leaderboardBronze}>
          <Text style={styles.boldText}>Vihaan</Text>
          <Text style={styles.boldText}>2341</Text>
        </View>
        <View style={styles.leaderboardNormal}>
          <Text style={styles.boldText}>Vedant</Text>
          <Text style={styles.boldText}>1237</Text>
        </View>
        <View style={styles.leaderboardNormal}>
          <Text style={styles.boldText}>Rohan</Text>
          <Text style={styles.boldText}>785</Text>
        </View>
        <View style={styles.leaderboardNormal}>
          <Text style={styles.boldText}>Sashank</Text>
          <Text style={styles.boldText}>385</Text>
        </View>
        <View style={styles.leaderboardNormal}>
          <Text style={styles.boldText}>Preetham</Text>
          <Text style={styles.boldText}>248</Text>
        </View>
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
});
