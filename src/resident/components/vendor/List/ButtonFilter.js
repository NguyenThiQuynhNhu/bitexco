//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import responsive from "../../../../resources/responsive";
import colors from "../../../theme/colors";
import fontSize from "../../../theme/fontsize";
import { converTypeToString } from "../../../utils/vendor";

// create a component
const ButtonFilter = (props) => {
  const { onSelectedChange, value, currentValue } = props;
  const active = value == currentValue;
  text = converTypeToString(value);
  return (
    <TouchableOpacity onPress={() => onSelectedChange(value)}>
      <View
        style={{
          marginLeft: responsive.h(10),
          borderRadius: responsive.h(45),
          padding: responsive.h(5),
          paddingHorizontal: responsive.h(10),

          backgroundColor: active ? colors.blue : colors.gray2,
        }}
      >
        <Text
          style={{
            color: active ? "#fff" : "#8c8c8c",
            fontSize: responsive.h(fontSize.medium),
          }}
        >
          {text}
        </Text>
      </View>
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
export default ButtonFilter;
