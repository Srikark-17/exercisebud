import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React from "react";
import * as SecureStore from "expo-secure-store";
import { HP, WP } from "../../config/responsive";
import { Fontisto } from "@expo/vector-icons";
import WebV from "../../components/WebView";

const motivations = [
  "\"The only one who can tell you “you can't win” is you and you don't have to listen.\"",
  '"Your doubts are whispers, your dreams are roars. Let the roar drown out the whispers."',
  '"Challenges are not stop signs, they are stepping stones. Keep your eyes on the prize, not your feet."',
  '"Failure is not falling down, it\'s staying down. Get up, dust yourself off, and keep moving forward."',
  '"The world needs your unique spark. Don\'t dim your light to fit in, burn bright and illuminate the path for others."',
  '"Progress over perfection. Every step, no matter how small, takes you closer to your goals. Celebrate the journey, not just the destination."',
];

const HomeScreen = () => {
  const [name, setName] = React.useState("");
  const [showNotification, setShowNotification] = React.useState(false);
  const [stepStats, setStepStats] = React.useState({});
  const [notifications, setNotifications] = React.useState([]);
  const motivation = React.useState(
    motivations[parseInt(Math.round(Math.random() * 5))]
  );

  React.useEffect(() => {
    const getSecureStorage = async () => {
      const storedName = await SecureStore.getItemAsync("name");
      setName(storedName);
    };

    getSecureStorage();

    const retrieveNotifications = async () => {
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
        filter: { friend_name: name },
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

        if (result.documents) {
          setNotifications(result.documents);
        }
      } catch (error) {
        console.error(error);
      }
    };

    retrieveNotifications();

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
      if (user) {
        setStepStats(user.stepStats);
      }
    };
    retrieveData();
  }, [name]);

  const handleRequest = async (type, notification) => {
    const apiKey =
      "bu0vFJtWdhjfvMo6Pc7JcSMUhM7gMTydozsFORUm8TglQhOxOoA4HwqVhvczt5Wd";
    const apiUrl =
      "https://us-east-2.aws.data.mongodb-api.com/app/data-dvjag/endpoint/data/v1/action/";

    // Step 1: Remove notification from notifications state
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n._id !== notification._id)
    );

    // Step 2: Delete document from requests collection
    try {
      await fetch(`${apiUrl}deleteOne`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
          "Access-Control-Request-Headers": "*",
        },
        body: JSON.stringify({
          dataSource: "Cluster0",
          database: "xbud",
          collection: "requests",
          filter: { _id: { $oid: notification._id } },
        }),
      });
    } catch (error) {
      console.error("Error deleting request:", error);
    }

    if (type === "accept") {
      // Step 3: Add to friends key in each user document
      const updateFriends = async (userId, friendId, friendName) => {
        try {
          await fetch(`${apiUrl}updateOne`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": apiKey,
              "Access-Control-Request-Headers": "*",
            },
            body: JSON.stringify({
              dataSource: "Cluster0",
              database: "xbud",
              collection: "users",
              filter: { _id: { $oid: userId } },
              update: {
                $addToSet: {
                  friends: { id: friendId, name: friendName },
                },
              },
              upsert: true,
            }),
          });
        } catch (error) {
          console.error("Error updating friends:", error);
        }
      };

      // Update for the current user
      await updateFriends(
        notification.user_id,
        notification.friend_id,
        notification.friend_name
      );

      // Update for the friend
      await updateFriends(
        notification.friend_id,
        notification.user_id,
        notification.user_name
      );
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      {showNotification && notifications.length != 0 ? (
        <View style={styles.notificationsContainer}>
          {notifications.map((notification) => (
            <View key={notification} style={styles.notification}>
              <Text style={styles.notificationText}>
                Friend Request from {notification.user_name}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => handleRequest("accept", notification)}
                  activeOpacity={1}
                >
                  <View style={styles.acceptButton}>
                    <Text style={styles.buttonText}>Accept</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRequest("decline", notification)}
                  activeOpacity={1}
                >
                  <View style={styles.declineButton}>
                    <Text style={styles.buttonText}>Decline</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : showNotification && notifications.length == 0 ? (
        <View style={styles.notificationsContainer}>
          <View style={styles.notification}>
            <Text style={styles.noNotificationText}>No Notifications!</Text>
          </View>
        </View>
      ) : (
        <></>
      )}
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <View style={styles.introTopContainer}>
            <Text style={styles.title}>Good Afternoon, {name}</Text>
            {notifications.length != 0 && (
              <View style={styles.newNotifications} />
            )}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowNotification(!showNotification)}
            >
              <Fontisto name="bell" size={24} color="#aeaeae" />
            </TouchableOpacity>
          </View>
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
  introTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationsContainer: {
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    position: "absolute",
    zIndex: 1000000,
    top: HP(20),
    left: WP(45),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    width: WP(50),
    elevation: 5,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  notification: {
    borderBottomColor: "#aeaeae",
    borderBottomWidth: 1,
    paddingHorizontal: WP(3),
    width: WP(50),
    paddingVertical: HP(1),
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    fontWeight: "600",
  },
  noNotificationText: {
    fontWeight: "600",
    paddingVertical: HP(1),
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: HP(3),
    gap: 10,
  },
  acceptButton: {
    paddingVertical: HP(1),
    paddingHorizontal: HP(2),
    backgroundColor: "#32CD32",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  declineButton: {
    paddingVertical: HP(1),
    paddingHorizontal: HP(2),
    backgroundColor: "#c6131b",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: "600",
    color: "#ffffff",
  },
  title: {
    fontSize: HP(3.5),
    fontWeight: "800",
    width: WP(80),
    color: "#000",
  },
  newNotifications: {
    width: WP(2),
    backgroundColor: "#ff0000",
    position: "absolute",
    left: WP(83.3),
    zIndex: 100000,
    bottom: HP(4.84),
    height: HP(1),
    borderRadius: 10,
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
