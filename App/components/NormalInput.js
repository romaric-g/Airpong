import React from "react";
import { StyleSheet, TextInput } from "react-native";

const NormalInput = (text) => {
  return (
    <TextInput style={styles.input} placeholder={text.placeholder} />
  );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: "#FFE1E1",
        borderRadius: 15,
        paddingTop: 20,
        paddingRight: 50,
        paddingBottom: 20,
        paddingLeft: 50,
      },
});

export default NormalInput;
