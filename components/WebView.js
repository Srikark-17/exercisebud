import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { HP } from "../config/responsive";

const youtubeVideoLinks = [
  "https://youtube.com/embed/KrY2Kv_BYKo", // Video 1
  "https://youtube.com/embed/KrY2Kv_BYKo", // Video 2 (replace with another video)
  "https://youtube.com/embed/KrY2Kv_BYKo", // Video 3 (replace with another video)
];

const WebV = () => {
  const [selectedVideoLink, setSelectedVideoLink] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * youtubeVideoLinks.length);
    setSelectedVideoLink(youtubeVideoLinks[randomIndex]);
  }, []); // Empty dependency array ensures random selection occurs only once

  return (
    <WebView
      style={styles.webView}
      javaScriptEnabled={true}
      source={{ uri: selectedVideoLink }}
    />
  );
};

const styles = StyleSheet.create({
  webView: {
    width: "90%",
    height: HP(35),
    alignSelf: "center",
    borderRadius: 20,
  },
});

export default WebV;
