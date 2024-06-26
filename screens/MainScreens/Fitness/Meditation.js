import React, { useState, useEffect } from "react";
import {
  Animated,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  LayoutAnimation,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HP, WP } from "../../../config/responsive";

const ANIMATION_DURATION = 4000;
const ANIMATION_ROTATION_DURATION = 8000;

const Meditation = ({ navigation }) => {
  const [animationValue] = useState(new Animated.Value(0));
  const [isBreathingIn, setIsBreathingIn] = useState(true);

  useEffect(() => {
    const animate = () => {
      Animated.parallel([
        Animated.timing(animationValue, {
          toValue: isBreathingIn ? 1 : 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: isBreathingIn ? 1 : 0,
          duration: ANIMATION_ROTATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setIsBreathingIn(!isBreathingIn);
      });
    };

    animate();
  }, [animationValue, isBreathingIn]);

  const interpolatedScale = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });
  const interpolatedDilation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.1],
  });
  const interpolatedRotate = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const breathingText = isBreathingIn ? "Breathe In" : "Breathe Out";

  return (
    <View style={styles.container}>
      <View style={styles.closeButton}>
        <TouchableOpacity activeOpacity={1} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Animated.Image
          source={require("../../../assets/flower.png")}
          style={[
            styles.image,
            {
              transform: [
                { scale: interpolatedDilation },
                { scale: interpolatedScale },
                { rotate: interpolatedRotate },
              ],
            },
          ]}
        />
        <View style={styles.textOverlay}>
          <Text style={styles.text}>{breathingText}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: HP(5),
    left: WP(2),
  },
  closeText: {
    fontSize: 20,
    color: "white",
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: WP(40),
    height: HP(25),
  },
  textOverlay: {
    position: "absolute",
    width: WP(52),
    height: HP(33),
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: HP(3),
    fontWeight: "600",
    color: "white",
  },
});

export default Meditation;
