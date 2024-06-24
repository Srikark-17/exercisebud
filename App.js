import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import HomeScreen from "./screens/MainScreens/HomeScreen";
import SplashScreen from "./screens/AuthScreens/SplashScreen";
import LoginScreen from "./screens/AuthScreens/LoginScreen";
import AccountScreen from "./screens/MainScreens/AccountScreen";
import RegisterScreen from "./screens/AuthScreens/RegisterScreen";

// import "firebase/firestore";
import { HP } from "./config/responsive";
import { AuthContext } from "./hooks/AuthContext";
import LeaderboardScreen from "./screens/MainScreens/LeaderboardScreen";
import AddFriendsScreen from "./screens/MainScreens/Friends/AddFriendScreen";
import { AppState } from "react-native";
import PersonalizedList from "./screens/MainScreens/Fitness/PersonalizedList";
import Meditation from "./screens/MainScreens/Fitness/Meditation";

// let firebaseConfig = Firebasekeys;
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

const inactiveColor = "#8E8E8E";
const themecolor = "#2B2D2F";
const tabcolor = "#4169E1";
const Tab = createBottomTabNavigator();
const Auth = createNativeStackNavigator();
const Leaderboard = createNativeStackNavigator();
const Fitness = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      sceneAnimationEnabled="true"
      activeColor={tabcolor}
      inactiveColor={inactiveColor}
      barStyle={{ backgroundColor: `${themecolor}`, height: HP(15) }}
      shifting={true}
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              size={26}
              color={focused ? tabcolor : inactiveColor}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="leaderboard"
              size={26}
              color={focused ? tabcolor : inactiveColor}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Fitness"
        component={FitnessNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              name="dumbbell"
              size={26}
              color={focused ? tabcolor : inactiveColor}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account"
              size={26}
              color={focused ? tabcolor : inactiveColor}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function LeaderboardNavigator() {
  return (
    <Leaderboard.Navigator
      initialRouteName="LeaderboardScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Leaderboard.Screen
        name="LeaderboardScreen"
        component={LeaderboardScreen}
        options={{}}
      />
      <Leaderboard.Screen
        name="Add Friend"
        component={AddFriendsScreen}
        options={{}}
      />
    </Leaderboard.Navigator>
  );
}

function FitnessNavigator() {
  return (
    <Fitness.Navigator
      initialRouteName="PersonalizedList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Fitness.Screen
        name="PersonalizedList"
        component={PersonalizedList}
        options={{}}
      />
      <Fitness.Screen name="Meditation" component={Meditation} options={{}} />
    </Fitness.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Auth.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Auth.Screen name="Splash" component={SplashScreen} options={{}} />
      <Auth.Screen name="Login" component={LoginScreen} options={{}} />
      <Auth.Screen name="Register" component={RegisterScreen} options={{}} />
    </Auth.Navigator>
  );
}

export default function App2() {
  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState(
    appState.current
  );

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            testTaken: action.testTaken,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            userToken: action.token,
            testTaken: action.testTaken,
            isLoading: false,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            userToken: null,
            testTaken: false,
            isLoading: false,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      userToken: null,
      testTaken: false,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        console.log(e);
      }

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        await SecureStore.setItemAsync("userToken", data.token);
        await SecureStore.setItemAsync("email", data.email);
        await SecureStore.setItemAsync("name", data.name);
        dispatch({ type: "SIGN_IN", token: data.token });
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("name");
        await SecureStore.deleteItemAsync("email");
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async (data) => {
        await SecureStore.setItemAsync("userToken", data.token);
        await SecureStore.setItemAsync("name", data.name);
        await SecureStore.setItemAsync("email", data.email);
        dispatch({
          type: "SIGN_IN",
          token: data.token,
        });
      },
    }),
    []
  );

  React.useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      _handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState != "active") {
      console.log("hi");
      const now = new Date();
      let name;

      const getSecureStorage = async () => {
        name = await SecureStore.getItemAsync("name");
      };

      getSecureStorage();

      const apiKey =
        "bu0vFJtWdhjfvMo6Pc7JcSMUhM7gMTydozsFORUm8TglQhOxOoA4HwqVhvczt5Wd";
      const apiUrl =
        "https://us-east-2.aws.data.mongodb-api.com/app/data-dvjag/endpoint/data/v1/action/";

      const updateStatus = async () => {
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
              filter: { name: name },
              update: {
                $set: {
                  lastActive: now.toISOString(),
                },
              },
              upsert: true,
            }),
          });
        } catch (error) {
          console.error(`Error updating user status:`, error);
        }
      };
      updateStatus();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {state.userToken === null ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <Stack.Screen name="Home" component={MainTabs} />
          )}
        </Stack.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
