//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import colors from "../../theme/colors";
import responsive from "../../../resources/responsive";

// create a component
const PrimaryButton = ({ text, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    borderRadius: responsive.h(5),
    paddingHorizontal: responsive.h(20),
    paddingVertical: responsive.h(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.appTheme,
    //borderRadius: 24,
  },
  text: {
    fontFamily: "Inter-SemiBold",
    fontSize: responsive.h(18),
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
  },
});
PrimaryButton.propTypes = {
  style: PropTypes.object,
};
//make this component available to the app
export default PrimaryButton;
