//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MyIcon } from "../../../theme/icons";
import colors from "../../../theme/colors";
import fontsize from "../../../theme/fontsize";
import responsive from "../../../resources/responsive";
// create a component
const Lookup = ({
  fielName,
  text,
  onPress,
  visible = true,
  borderBottom = true,
  colorText = colors.appTheme,
}) => {
  return (
    <View
      pointerEvents={visible ? "auto" : "none"}
    >
      <TouchableOpacity style={[styles.container]} onPress={onPress}>
        <Text
          style={{
            color: visible ? "#282828" : "gray",
            fontFamily: "Inter-Bold",
            fontSize: responsive.h(16),
            fontWeight: "bold",
            fontStyle: "normal",
            textAlign: "left",
            marginRight: responsive.h(10),
            flex: 0.4,
          }}
        >
          {fielName}
        </Text>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",

            borderRadius: responsive.h(8),
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#cbcbcb",
            padding: responsive.h(5),
            flex: 0.55,
          }}
        >
          <Text
            style={{
              color: visible ? "#282828" : "gray",
              fontFamily: "Inter-SemiBold",
              fontSize: responsive.h(14),
              fontWeight: "600",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
            }}
          >
            {text}
          </Text>
          <MyIcon
            size={responsive.h(14)}
            color={visible ? "rgba(0, 0, 0, 0.54)" : colors.grayBorder}
            name="arrow-down"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
    borderTopRightRadius: 20,
  },
});

//make this component available to the app
export default Lookup;
