//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MyIcon } from "../../theme/icons";
import colors from "../../theme/colors";
import FontSize from "../../theme/fontsize";
import { Screen } from "../../utils/device";
import responsive from "../../../resources/responsive";
// create a component
const LanguageItem = (props) => {
  const iconSize = Screen.width * 0.1;
  const { icon, text, value, currentValue, onValueChange } = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: responsive.h(15),
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: colors.grayBorder,
      }}
      onPress={() => onValueChange(value)}
    >
      <Image source={icon} style={{ width: iconSize, height: iconSize }} />

      <Text
        style={{
          flex: 1,
          marginLeft: responsive.h(15),
          fontSize: responsive.h(FontSize.medium),
          color: "black",
        }}
      >
        {text}
      </Text>

      {value == currentValue && (
        <MyIcon name="check" size={responsive.h(20)} color={colors.blue} />
      )}
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});

//make this component available to the app
export default LanguageItem;
