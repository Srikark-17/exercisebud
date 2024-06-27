import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { HP, WP } from "../../../config/responsive";
import DropdownComponent from "../../../components/Dropdown";

const PersonalizedList = ({ navigation }) => {
  const [height, setHeight] = React.useState();
  const [weight, setWeight] = React.useState();
  const [diet, setDiet] = React.useState();
  const [exerciseIntensity, setExerciseIntensity] = React.useState();
  const [purpose, setPurpose] = React.useState("");
  const [accessToEquipment, setAccessToEquipment] = React.useState("");
  const [step, setStep] = React.useState(1);
  const [name, setName] = React.useState("");
  const [currentUser, setCurrentUser] = React.useState(null);
  const [recommendation, setRecommendation] = React.useState(null);
  const API_KEY = "sk-proj-f0yDjqu9WLjTF9wPs0FJT3BlbkFJrrVJ6Jw6UGxr7cBCsUFn";

  const options = [
    { label: "None", value: "none" },
    { label: "Light", value: "light" },
    { label: "Moderate", value: "moderate" },
    { label: "Vigorous", value: "vigorous" },
    { label: "Extreme", value: "extreme" },
  ];

  const equipmentOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  function isWithinWeek(isoString, baseDate = new Date()) {
    const targetDate = new Date(isoString);
    const timeDiff = Math.abs(targetDate - baseDate);
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }

  useEffect(() => {
    const getSecureStorage = async () => {
      const storedName = await SecureStore.getItemAsync("name");
      setName(storedName);
    };

    getSecureStorage();

    const checkLastUpdatedForm = async () => {
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
            filter: { name: name },
          }),
        }
      );
      const user = await response.json().then((data) => data.document);
      setCurrentUser(user);

      if (user?.lastUpdatedForm) {
        if (isWithinWeek(user.lastUpdatedForm)) {
          setStep(1);
        }
      }
    };

    checkLastUpdatedForm();

    if (step === 1) {
      const prevLogs = currentUser?.entries;
      if (currentUser.recommendations) {
      } else {
      }
      const generateRecommendations = async () => {
        const sortArrayByDate = (array) => {
          return array.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
          });
        };

        const newEntries = sortArrayByDate(prevLogs);

        const myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "Bearer sk-proj-f0yDjqu9WLjTF9wPs0FJT3BlbkFJrrVJ6Jw6UGxr7cBCsUFn"
        );
        myHeaders.append("Access-Control-Request-Headers", "*");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content: `As a Personal Trainer, you are tasked to generate a comprehensive 4-week workout plan that is specifically designed to help the client achieve a particular fitness goal, which is ${newEntries[0].purpose}. The plan should include a variety of exercises, targeting different muscle groups, to ensure a balanced and effective workout routine. It should also consider the client's current fitness level, specific needs, diet, and available fitness equipment. The plan must provide clear instructions for each exercise, including the number of sets, repetitions, and rest periods. Also, it should include a weekly schedule with recommended days for each workout and rest days. Lastly, provide tips on proper form to avoid injuries and ensure the effectiveness of each exercise. ONLY PROVIDE THE PLAN AND NOTHING ELSE. NO TEXT BEFORE OR AFTER. NO CLIENT PROFILE. Here is the user information which will be given in an array of objects containing their previous and current information: ${newEntries}`,
            },
          ],
          response_format: {
            type: "text",
          },
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch("https://api.openai.com/v1/chat/completions", requestOptions)
          .then((response) => response.text())
          .then((result) =>
            setRecommendation(result.choices[0].message.content)
          )
          .catch((error) => console.error(error));
      };
      generateRecommendations();

      const now = new Date();
      const setRecommendation = async () => {
        try {
          await fetch(
            `https://us-east-2.aws.data.mongodb-api.com/app/data-dvjag/endpoint/data/v1/action/updateOneupdateOne`,
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
                  $addToSet: {
                    recommendations: {
                      date: now.toISOString(),
                      recommendation: recommendation,
                    },
                  },
                },
                upsert: true,
              }),
            }
          );
        } catch (error) {
          console.error("Error setting recommendation:", error);
        }
      };
    }
  }, []);

  const handleSubmit = async () => {
    const now = new Date();
    if ((height = "")) {
      Alert.alert(
        "Missing Information",
        "You did not enter in your height. Please try again!",
        [{ text: "OK", onPress: () => console.log("") }]
      );
      return;
    } else if ((weight = "")) {
      Alert.alert(
        "Missing Information",
        "You did not enter in your weight. Please try again!",
        [{ text: "OK", onPress: () => console.log("") }]
      );
      return;
    } else if ((diet = "")) {
      Alert.alert(
        "Missing Information",
        "You did not enter in your diet. Please try again!",
        [{ text: "OK", onPress: () => console.log("") }]
      );
      return;
    } else if ((purpose = "")) {
      Alert.alert(
        "Missing Information",
        "You did not enter in your exercise purpose. Please try again!",
        [{ text: "OK", onPress: () => console.log("") }]
      );
      return;
    } else if ((intensity = "")) {
      Alert.alert(
        "Missing Information",
        "You did not enter in your exercise intensity. Please try again!",
        [{ text: "OK", onPress: () => console.log("") }]
      );
      return;
    }

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
            $addToSet: {
              entries: {
                height: height,
                weight: weight,
                bmi:
                  (parseFloat(weight) /
                    parseFloat(height) /
                    parseFloat(height)) *
                  703,
                diet: diet,
                exerciseIntensity: exerciseIntensity,
                purpose: purpose,
                accessToEquipment: accessToEquipment,
                date: now.toISOString(),
              },
            },
            $set: {
              lastUpdatedForm: now.toISOString(),
            },
          },
          upsert: true,
        }),
      }
    );
    if (response.ok) {
      setStep(step + 1);
    } else {
      Alert.alert(
        "Uploading Information",
        "Your information was not successfully uploaded. Try again later!",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  };

  const handleExerciseIntensityValueChange = (value) => {
    setExerciseIntensity(value);
  };

  const handleAccessToEquipmentValueChange = (value) => {
    setAccessToEquipment(value);
  };

  return (
    <View style={styles.container}>
      {step == 0 ? (
        <>
          <Text style={styles.title}>Personalized Fitness</Text>
          <Text style={styles.description}>
            Fill out this form to get insights on how to take your fitness to
            the next level.
          </Text>
          <ScrollView>
            <Text style={styles.inputLabel}>Height (in.)</Text>
            <View style={styles.textInput}>
              <TextInput
                placeholder="64"
                style={styles.textColor}
                placeholderTextColor="#999"
                onChangeText={(height) => setHeight(height)}
              />
            </View>
            <Text style={styles.inputLabel}>Weight (lbs.)</Text>
            <View style={styles.textInput}>
              <TextInput
                placeholder="137"
                style={styles.textColor}
                placeholderTextColor="#999"
                onChangeText={(weight) => setWeight(weight)}
              />
            </View>
            <Text style={styles.inputLabel}>Exercise Intensity</Text>
            <DropdownComponent
              onValueChange={handleExerciseIntensityValueChange}
              data={options}
            />
            <Text style={styles.inputLabel}>Diet</Text>
            <View style={styles.textInput}>
              <TextInput
                placeholder="Vegetarian"
                style={styles.textColor}
                placeholderTextColor="#999"
                onChangeText={(diet) => setDiet(diet)}
              />
            </View>
            <Text style={styles.inputLabel}>
              Do you have access to equipment?
            </Text>
            <DropdownComponent
              onValueChange={handleAccessToEquipmentValueChange}
              data={equipmentOptions}
            />
            <Text style={styles.inputLabel}>Purpose</Text>
            <View style={styles.textInput}>
              <TextInput
                placeholder="To be satisfied with my physical appearance"
                style={styles.textColor}
                placeholderTextColor="#999"
                onChangeText={(purpose) => setPurpose(purpose)}
              />
            </View>
            <TouchableOpacity activeOpacity={1} onPress={() => handleSubmit()}>
              <View style={styles.generateRecommendationsButton}>
                <Text style={styles.generateRecommendationsButtonText}>
                  Generate Recommendations
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </>
      ) : (
        <>
          <Text style={styles.title}>Recommendations</Text>
          {/* TODO: add recommendations */}
          {/* TODO: add meditation button */}
        </>
      )}
    </View>
  );
};

export default PersonalizedList;

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
    marginBottom: HP(2),
    marginTop: HP(8),
  },
  description: {
    marginBottom: HP(5),
    color: "#aeaeae",
    textAlign: "center",
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
    width: WP(88),
    height: HP(8),
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#4169E1",
    marginBottom: HP(4),
  },
  inputLabel: {
    fontSize: HP(2.3),
    fontWeight: "600",
    marginBottom: HP(2),
  },
  generateRecommendationsButton: {
    borderRadius: 12,
    marginTop: HP(2.37),
    backgroundColor: "#4169E1",
    height: HP(9),
    shadowOffset: { width: WP(0), height: HP(0.24) },
    shadowColor: "black",
    marginBottom: HP(15),
    shadowOpacity: 0.25,
    alignItems: "center",
    justifyContent: "center",
  },
  generateRecommendationsButtonText: {
    fontSize: HP(2.5),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
