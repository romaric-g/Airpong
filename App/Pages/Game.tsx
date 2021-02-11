import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const Game = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.score}>8 - 6</Text>
        <Text style={styles.names}>Valentin - Romaric</Text>
      </View>

      <View style={styles.buttonwrapper}>
        <View style={styles.wrap1}>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#FFA8A8" : "#EE8383",
              },
              styles.smash,
            ]}
          >
            <Text style={{ color: "#fff" }}>SMASH</Text>
          </Pressable>
        </View>
        <View style={styles.wrap2}>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#FFA8A8" : "#efefef",
              },
              styles.actionbutton1,
            ]}
          >
            <Text style={{ color: "#000" }}>REVERS</Text>
          </Pressable>
        </View>
        <View style={styles.wrap3}>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#FFA8A8" : "#efefef",
              },
              styles.actionbutton2,
            ]}
          >
            <Text style={{ color: "#000" }}>COUP DROIT</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    height: "100%",
    paddingTop: 120,
    paddingBottom: 120,
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
  },
  score: {
    fontSize: 48,
  },
  names: {
    fontSize: 20,
  },
  smash: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  actionbutton1: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  actionbutton2: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  wrap1: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-start"
  },
  wrap2: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  wrap3: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  buttonwrapper:{
    flex: 1,
    alignItems: "center"
  }
});

export default Game;
