import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import NormalButton from "../Components/NormalButton";
import NormalButtonWhite from "../Components/NormalButtonWhite";

const Room = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.gametitle}>Airpong</Text>
      <Text style={styles.name}>Valentin</Text>
      <Text style={styles.vs}>vs</Text>
      <Text style={styles.name}>Romaric</Text>

      <View style={styles.launchbutton}>
        <NormalButtonWhite title="Lancer la partie" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EE8383",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    height: "100%",
    paddingTop: 120,
    paddingBottom: 120,
  },
  gametitle: {
    color: "#fff",
    fontSize: 30,
    position: "absolute",
    top: 20,
    left: 20,
  },
  name: {
    color: "#fff",
    fontSize: 45,
  },
  launchbutton: {
      position: "absolute",
      bottom: 50
  },
  vs:{
      color: "#fff",
      fontSize: 24,
  }
});

export default Room;
