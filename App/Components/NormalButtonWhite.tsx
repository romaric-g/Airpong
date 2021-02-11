import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";


interface Props {
  title: string,
  onPress?: () => void
}

const NormalButtonWhite = ({title, onPress}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#efefef" : "#fff",
        },
        styles.wrapperCustom,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "#202020",
    fontSize: 20,
  },
  wrapperCustom: {
    borderRadius: 15,
    paddingTop: 15,
    paddingRight: 80,
    paddingBottom: 15,
    paddingLeft: 80,
  },
});

export default NormalButtonWhite;
