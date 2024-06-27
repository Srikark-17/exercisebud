import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { HP } from "../config/responsive";

const WebV = () => {
  const [selectedVideoLink, setSelectedVideoLink] = useState();

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBqyaSjw1ez30WzJqbCd2yCuAzR_WXTkSw&type=video&q=quick exercise videos&part=snippet&maxResults=30",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        const ytResult = JSON.parse(result);
        const vidArray = ytResult.items;
        const randomIndex = Math.floor(Math.random() * vidArray.length);
        const randomObject = vidArray[randomIndex];
        setSelectedVideoLink(
          `https://www.youtube.com/embed/${randomObject.id.videoId}/`
        );
      })
      .catch((error) => console.error(error));
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
