import React from "react";
import { View, StyleSheet, Button } from "react-native";

const NormalButton = (text) => {
  return <Button title={text.title} style={styles.NormalButton} />;
};

const styles = StyleSheet.create({
  NormalButton: {
    backgroundColor: "red",
  },
});

export default NormalButton;
