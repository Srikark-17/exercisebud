import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { AuthContext } from "../../../hooks/AuthContext";
import * as SecureStore from "expo-secure-store";
import { HP, WP } from "../../../config/responsive";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome6,
} from "@expo/vector-icons";

const AccountScreen = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);
  const [name, setName] = React.useState();
  const [uid, setUID] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    const getSecureStorage = async () => {
      const storedName = await SecureStore.getItemAsync("name");
      const storedUID = await SecureStore.getItemAsync("token");
      setName(storedName);
      setUID(storedUID);

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
      const user = await response.json().then((data) => data.document);
      setUser(user);
    };

    getSecureStorage();
  }, [name]);

  return (
    <View>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.settingFirstContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.uuid}>UUID: {user?._id}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate("Leaderboard")}
      >
        <View style={styles.accountOption}>
          <MaterialIcons name="leaderboard" size={26} color="#aeaeae" />
          <Text style={styles.accountOptionText}>Leaderboard</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate("Fitness")}
      >
        <View style={styles.accountOption}>
          <FontAwesome6 name="dumbbell" size={26} color="#aeaeae" />
          <Text style={styles.accountOptionText}>Personalized Fitness</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate("Reset Password")}
      >
        <View style={styles.accountOption}>
          <MaterialCommunityIcons name="lock-reset" size={26} color="#aeaeae" />
          <Text style={styles.accountOptionText}>Reset Password</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => signOut()} activeOpacity={1}>
        <View style={styles.accountOption}>
          <FontAwesome6 name="power-off" size={26} color="#d14249" />
          <Text style={styles.signOutText}>Log Out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: HP(4),
    fontWeight: "800",
    paddingTop: HP(8),
    color: "#000",
    alignSelf: "center",
  },
  settingFirstContainer: {
    borderBottomWidth: 2,
    paddingLeft: WP(5),
    paddingBottom: HP(2),
    marginTop: HP(5),
    width: WP(90),
    alignSelf: "center",
    borderBottomColor: "#dedede",
  },
  name: {
    fontSize: HP(2.5),
    fontWeight: "800",
    color: "#000",
    marginBottom: HP(2),
  },
  uuid: {
    fontSize: HP(2),
    fontWeight: "800",
    color: "#aeaeae",
  },
  accountOption: {
    width: WP(90),
    alignSelf: "center",
    alignItems: "center",
    gap: 20,
    marginTop: HP(5),
    paddingRight: WP(10),
    flexDirection: "row",
    paddingLeft: WP(5),
    paddingBottom: HP(1),
    borderBottomWidth: 1,
    borderBottomColor: "#aeaeae",
  },
  accountOptionText: {
    fontSize: HP(2),
    color: "#aeaeae",
    fontWeight: "800",
  },
  signOutText: {
    fontSize: HP(2),
    color: "#d14249",
    fontWeight: "800",
  },
});
