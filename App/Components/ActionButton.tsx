import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

interface Props {
    text: string,
    onTouchStart?: () => void,
    onTouchEnd?: () => void,
}

const ActionButton = ({ text, onTouchStart, onTouchEnd }: Props) => {
  return (
    <Pressable
        onPressIn={onTouchStart}
        onPressOut={onTouchEnd}
        style={({ pressed }) => [
            {
            backgroundColor: pressed ? "#FFA8A8" : "#efefef",
            },
            styles.actionbutton,
        ]}
    >
      <Text style={{ color: "#000", fontFamily: "Arciform" }}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  actionbutton: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 50,
  },
});

export default ActionButton;
