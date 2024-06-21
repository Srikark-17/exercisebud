import { ScrollView, StyleSheet, Text, View, StatusBar } from "react-native";
import React from "react";
import * as SecureStore from "expo-secure-store";
import { HP, WP } from "../../config/responsive";
import WebV from "../../components/WebView";

const HomeScreen = () => {
  const motivations = [
    "\"The only one who can tell you “you can't win” is you and you don't have to listen.\"",
    '"Your doubts are whispers, your dreams are roars. Let the roar drown out the whispers."',
    '"Challenges are not stop signs, they are stepping stones. Keep your eyes on the prize, not your feet."',
    '"Failure is not falling down, it\'s staying down. Get up, dust yourself off, and keep moving forward."',
    '"The world needs your unique spark. Don\'t dim your light to fit in, burn bright and illuminate the path for others."',
    '"Progress over perfection. Every step, no matter how small, takes you closer to your goals. Celebrate the journey, not just the destination."',
  ];

  const [name, setName] = React.useState("");
  const [stepStats, setStepStats] = React.useState({});
  const motivation = React.useState(
    motivations[parseInt(Math.round(Math.random() * 5))]
  );

  React.useEffect(() => {
    const getSecureStorage = async () => {
      const storedName = await SecureStore.getItemAsync("name");
      setName(storedName);
    };

    getSecureStorage();
    // TODO: Adam, add the retrieval function here and the function where you update the step data in mongo
    const retrieveData = async () => {
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
            collection: "users",
            filter: {
              name: name,
            },
          }),
        }
      );

      if (!response.ok) {
        console.log(response);
        return;
      }
      const user = await response.json().then((data) => {
        return data.document;
      });

      setStepStats(user.stepStats);
    };
    retrieveData();
  }, [name]);

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.title}>Good Afternoon, {name}</Text>
          <Text style={styles.motivation}>{motivation}</Text>
        </View>
        <View style={styles.videoContainer}>
          <Text style={styles.videoTitle}>Exercise of the Day</Text>
        </View>
      </View>
      <WebV />
      <Text style={styles.stepsTitle}>Step Stats</Text>
      <View style={styles.stepsContainer}>
        <View style={styles.stepsRow}>
          <Text style={styles.stepsText}>Week</Text>
          <Text style={styles.stepsText}>{stepStats?.weekly} steps/day</Text>
        </View>
        <View style={styles.stepsRow}>
          <Text style={styles.stepsText}>Month</Text>
          <Text style={styles.stepsText}>{stepStats?.monthly} steps/day</Text>
        </View>
        <View style={styles.stepsRow}>
          <Text style={styles.stepsText}>Year</Text>
          <Text style={styles.stepsText}>{stepStats?.yearly} steps/day</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: WP(5),
    paddingTop: HP(15),
  },
  introContainer: {
    height: HP(10),
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: HP(2),
  },
  title: {
    fontSize: HP(4),
    fontWeight: "800",
    color: "#000",
  },
  motivation: {
    color: "#AEAEAE",
  },
  videoContainer: {
    height: "auto",
    marginTop: HP(8),
  },
  videoTitle: {
    fontSize: HP(3.5),
    fontWeight: "800",
    marginBottom: HP(3),
    color: "#000",
  },
  stepsTitle: {
    fontSize: HP(3.5),
    fontWeight: "800",
    marginVertical: HP(3),
    color: "#000",
    paddingLeft: WP(5),
  },
  stepsContainer: {
    width: WP(90),
    padding: HP(2),
    alignSelf: "center",
    backgroundColor: "#4169E1",
    opacity: 0.5,
    alignItems: "center",
    justifyContent: "center",
    gap: HP(3.5),
    paddingVertical: HP(6),
    borderRadius: 20,
  },
  stepsRow: {
    width: WP(75),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepsText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
