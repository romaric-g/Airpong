import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";


interface Props {
  title: string,
  onPress: () => void
}

const NormalButton = ({title, onPress}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#FFA8A8" : "#EE8383",
        },
        styles.wrapperCustom,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Arciform",
    textAlign: "center"
  },
  wrapperCustom: {
    borderRadius: 15,
    paddingTop: 15,
    paddingRight: 50,
    paddingBottom: 15,
    paddingLeft: 50,
    width: 300,
  },
});

export default NormalButton;
