import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Platform,
  LogBox,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { HP, WP } from "../../config/responsive";
import { Fontisto } from "@expo/vector-icons";
import WebV from "../../components/WebView";
import {
  initialize,
  requestPermission,
  readRecords,
} from "react-native-health-connect";
import AppleHealthKit from "react-native-health";

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
  const [hasPermissions, setHasPermission] = React.useState(false);
  const { Permissions } = AppleHealthKit.Constants;
  const [androidPermissions, setAndroidPermissions] = useState([]);

  LogBox.ignoreAllLogs();

  React.useEffect(() => {
    const getSecureStorage = async () => {
      const storedName = await SecureStore.getItemAsync("name");
      setName(storedName);
    };

    getSecureStorage();

    if (Platform.OS === "ios") {
      const permissions = {
        permissions: {
          read: [Permissions.Steps],
          write: [],
        },
      };

      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log("Error getting permissions");
          return;
        }
        setHasPermission(true);
      });
    } else {
      const init = async () => {
        const isInitialized = await initialize();
        if (!isInitialized) {
          console.log("Failed to initialize Health Connect");
          return;
        }
        const grantedPermissions = await requestPermission([
          { accessType: "read", recordType: "Steps" },
        ]);
        setAndroidPermissions(grantedPermissions);
      };
      init();
    }

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

    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n._id !== notification._id)
    );

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
          filter: {
            $or: [
              { _id: { $oid: notification._id } },
              {
                friend_name: notification.friend_name,
                user_name: notification.user_name,
              },
              {
                user_name: notification.friend_name,
                friend_name: notification.user_name,
              },
            ],
          },
        }),
      });
    } catch (error) {
      console.error("Error deleting request:", error);
    }

    if (type === "accept") {
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

  const postStepsToDatabase = async (stepsData) => {
    const apiKey =
      "bu0vFJtWdhjfvMo6Pc7JcSMUhM7gMTydozsFORUm8TglQhOxOoA4HwqVhvczt5Wd";
    const url =
      "https://us-east-2.aws.data.mongodb-api.com/app/data-dvjag/endpoint/data/v1/action/updateOne";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          dataSource: "Cluster0",
          database: "xbud",
          collection: "users",
          filter: { name: name },
          update: {
            $set: {
              stepStats: stepsData,
            },
          },
          upsert: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${JSON.stringify(response)}`);
      }

      setStepStats(stepsData);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  useEffect(() => {
    if (Platform.OS !== "ios" || !hasPermissions) {
      return;
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const yearAgo = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );

    const getStepsForPeriod = async (startDate, periodName) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
      };

      return new Promise((resolve, reject) => {
        AppleHealthKit.getStepCount(options, (err, results) => {
          if (err) {
            console.log(`Error getting the steps for ${periodName}`);
            reject(err);
          } else {
            resolve(results.value);
          }
        });
      });
    };

    const fetchAllSteps = async () => {
      try {
        const weeklySteps = await getStepsForPeriod(weekAgo, "week");
        const monthlySteps = await getStepsForPeriod(monthAgo, "month");
        const yearlySteps = await getStepsForPeriod(yearAgo, "year");

        const stepsData = {
          weekly: Math.floor(weeklySteps / 7.0),
          monthly: Math.floor(monthlySteps / 30.0),
          yearly: Math.floor(yearlySteps / 365.0),
        };

        postStepsToDatabase(stepsData);
      } catch (error) {
        console.error("Error fetching steps:", error);
      }
    };

    fetchAllSteps();
  }, [hasPermissions]);

  const hasAndroidPermission = (recordType) => {
    return androidPermissions.some((perm) => perm.recordType === recordType);
  };

  useEffect(() => {
    if (!hasAndroidPermission("Steps") || Platform.OS !== "android") {
      return;
    }

    const getHealthData = async () => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const yearAgo = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );

      const getStepsForPeriod = async (startDate, endDate, periodName) => {
        const timeRangeFilter = {
          operator: "between",
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        };

        try {
          const steps = await readRecords("Steps", { timeRangeFilter });
          const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0);
          console.log(`${periodName.toUpperCase()} STEPS >>> ${totalSteps}`);
          return totalSteps;
        } catch (error) {
          console.error(`Error getting steps for ${periodName}:`, error);
          return 0;
        }
      };

      try {
        const weeklySteps = await getStepsForPeriod(weekAgo, now, "week");
        const monthlySteps = await getStepsForPeriod(monthAgo, now, "month");
        const yearlySteps = await getStepsForPeriod(yearAgo, now, "year");

        const stepsData = {
          weekly: weeklySteps,
          monthly: monthlySteps,
          yearly: yearlySteps,
        };

        console.log("Steps Data:", stepsData);
        setStepStats(stepsData);
        postStepsToDatabase(stepsData);
      } catch (error) {
        console.error("Error fetching steps:", error);
      }
    };

    getHealthData();
  }, [androidPermissions]);

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
      {stepStats ? (
        <>
          <Text style={styles.stepsTitle}>Step Stats</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.stepsRow}>
              <Text style={styles.stepsText}>Week</Text>
              <Text style={styles.stepsText}>{stepStats.weekly} steps/day</Text>
            </View>
            <View style={styles.stepsRow}>
              <Text style={styles.stepsText}>Month</Text>
              <Text style={styles.stepsText}>
                {stepStats.monthly} steps/day
              </Text>
            </View>
            <View style={styles.stepsRow}>
              <Text style={styles.stepsText}>Year</Text>
              <Text style={styles.stepsText}>{stepStats.yearly} steps/day</Text>
            </View>
          </View>
        </>
      ) : (
        <></>
      )}
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
