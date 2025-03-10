import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { HP, WP } from "../../../config/responsive";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const AddFriendScreen = ({ navigation }) => {
  const [name, setName] = useState();
  const [friends, setFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [searchValue, setSearchValue] = useState();

  useEffect(() => {
    const getSecureStorage = async () => {
      const storedName = await SecureStore.getItemAsync("name");
      setName(storedName);
    };
    getSecureStorage();
  }, []);

  useEffect(() => {
    const retrieveCurrentUser = async () => {
      if (!name) return;

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
      if (user) {
        setCurrentUser(user);
      }
    };

    retrieveCurrentUser();
  }, [name]);

  useEffect(() => {
    const retrieveData = async () => {
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
          let filteredFriends = result.documents.filter((user) => {
            if (currentUser && user._id === currentUser._id) {
              return false;
            }

            if (
              currentUser &&
              currentUser.friends &&
              currentUser.friends.some((friend) => friend._id === user._id)
            ) {
              return false;
            }

            return true;
          });

          setFriends(filteredFriends);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (currentUser) {
      retrieveData();
    }
  }, [currentUser]);

  const addFriend = async (friend) => {
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
      document: {
        user_id: currentUser._id,
        friend_id: friend._id,
        user_name: name,
        friend_name: friend.name,
      },
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      await fetch(
        "https://us-east-2.aws.data.mongodb-api.com/app/data-dvjag/endpoint/data/v1/action/insertOne",
        requestOptions
      );
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  const getFilteredFriends = () => {
    if (!searchValue) return friends;
    return friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Your Friend</Text>
      <Text style={styles.description}>
        Select your friend below or search to find their name.
      </Text>
      <View style={styles.searchBar}>
        <Feather name="search" color="#aeaeae" size={24} />
        <TextInput
          placeholder="Search..."
          style={styles.textInput}
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>
      <ScrollView>
        <View style={styles.availableFriendsContainer}>
          {getFilteredFriends().length > 0 ? (
            getFilteredFriends().map((friend) => {
              return (
                <View key={friend._id} style={styles.availableFriend}>
                  <Text style={styles.availableFriendName}>{friend.name}</Text>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => addFriend(friend)}
                  >
                    <View style={styles.addFriendButton}>
                      <Text style={styles.addFriendText}>Add Friend</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text style={styles.noFriendsText}>No friends found</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AddFriendScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: WP(5),
    backgroundColor: "#fff",
    height: HP(100),
    paddingTop: HP(10),
  },
  title: {
    fontSize: HP(3.5),
    fontWeight: "800",
    alignSelf: "center",
    color: "#000",
    marginBottom: HP(3),
  },
  description: {
    fontSize: HP(2),
    width: WP(75),
    textAlign: "center",
    alignSelf: "center",
    color: "#000",
  },
  searchBar: {
    borderRadius: 10,
    width: WP(80),
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginLeft: "auto",
    marginTop: HP(5),
    marginRight: "auto",
    borderWidth: 1,
    backgroundColor: "#f3f3f3",
    paddingHorizontal: WP(3),
    paddingVertical: HP(1),
  },
  textInput: {
    width: WP(60),
    backgroundColor: "#f3f3f3",
    paddingVertical: HP(1),
  },
  availableFriendsContainer: {
    marginTop: HP(3),
    alignItems: "center",
    gap: 20,
    width: "100%",
    justifyContent: "center",
    marginBottom: HP(10),
  },
  availableFriend: {
    paddingVertical: HP(2),
    width: WP(80),
    paddingHorizontal: WP(5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  availableFriendName: {
    fontWeight: "600",
    fontSize: HP(2.3),
  },
  addFriendButton: {
    borderRadius: 10,
    backgroundColor: "#32CD32",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: WP(3),
    paddingVertical: HP(1.5),
  },
  addFriendText: {
    fontWeight: "600",
    color: "#ffffff",
  },
  noFriendsText: {
    fontSize: HP(2),
    color: "#666",
    textAlign: "center",
    marginTop: HP(3),
  },
});
