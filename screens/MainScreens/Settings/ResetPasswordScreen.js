import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { HP, WP } from "../../../config/responsive";

const ResetPasswordScreen = ({ navigation }) => {
  const [prevPassword, setPrevPassword] = React.useState();
  const [newPassword, setNewPassword] = React.useState();

  const handleSubmit = async () => {
    if (prevPassword != newPassword) {
      let name;

      const getSecureStorage = async () => {
        name = await SecureStore.getItemAsync("name");
      };

      getSecureStorage();

      const response = await fetch(
        `https://us-east-2.aws.data.mongodb-api.com/app/data-dvjag/endpoint/data/v1/action/updateOne`,
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
            update: {
              $set: {
                password: newPassword,
              },
            },
          }),
        }
      );
      if (response.ok) {
        Alert.alert("Password Reset", "Your password was successfully reset!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Password Reset",
          "Your password was not successfully reset. Try again later!",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } else {
      Alert.alert(
        "Incorrect Password",
        "The new password and the previous password are the same. The passwords need to be different.",
        [{ text: "OK", onPress: () => console.log("") }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <View>
        <Text style={styles.inputLabel}>Previous Password</Text>
        <View style={styles.textInput}>
          <TextInput
            placeholder="Current Password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            style={styles.textColor}
            placeholderTextColor="#999"
            textContentType="password"
            onChangeText={(password) => setPrevPassword(password)}
          />
        </View>
        <Text style={styles.inputLabel}>New Password</Text>
        <View style={styles.textInput}>
          <TextInput
            placeholder="New Password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            style={styles.textColor}
            placeholderTextColor="#999"
            textContentType="password"
            onChangeText={(password) => setNewPassword(password)}
          />
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleSubmit()}>
          <View style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;

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
    marginBottom: HP(7),
    marginTop: HP(8),
  },
  textColor: {
    color: "#000",
    width: WP(80),
    height: HP(5),
  },
  textInput: {
    paddingLeft: WP(3.84),
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: WP(85),
    height: HP(7),
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#4169E1",
    marginBottom: HP(4),
  },
  inputLabel: {
    fontSize: HP(1.8),
    fontWeight: "600",
    marginBottom: HP(2),
  },
  resetButton: {
    borderRadius: 12,
    marginTop: HP(2.37),
    backgroundColor: "#4169E1",
    height: HP(7.11),
    shadowOffset: { width: WP(0), height: HP(0.24) },
    shadowColor: "black",
    shadowOpacity: 0.25,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: {
    fontSize: HP(2.2),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
