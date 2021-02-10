import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import NormalButton from "../components/NormalButton";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.gametitle}>Airpong</Text>

      <View style={styles.container2}>
        <NormalButton title="Lancer la partie" />

        <Text>ou</Text>

        <TextInput placeholder="Rentrer un code ami" />

        <Text>Votre code ami : 85468</Text>
      </View>

      <TextInput placeholder="Votre nom" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 120,
    marginBottom: 120,
  },
  container2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 75,
    marginBottom: 75,
  },
  gametitle: {
    color: "#FF6C6C",
    fontSize: 90,
  },
});

export default Home;
