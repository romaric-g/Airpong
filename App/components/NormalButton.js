import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";

const NormalButton = (text) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#FFA8A8" : "#EE8383",
        },
        styles.wrapperCustom,
      ]}
    >
      <Text style={styles.text}>{text.title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
  wrapperCustom: {
    borderRadius: 15,
    paddingTop: 20,
    paddingRight: 50,
    paddingBottom: 20,
    paddingLeft: 50,
  },
});

export default NormalButton;
