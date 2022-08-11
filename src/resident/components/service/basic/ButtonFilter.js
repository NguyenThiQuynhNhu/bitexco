//import liraries
import React, { Component } from "react";
import { Screen } from "../../../utils/device";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import fontSize from "../../../theme/fontsize";
import {
  converStatusToColor,
  converStatusToString,
} from "../../../utils/serviceBasic";
import colors from "../../../theme/colors";
import responsive from "../../../../resources/responsive";

// create a component
const ButtonFilter = (props) => {
  const {
    onSelectedChange,
    value,
    currentValue,
    textColor,
    style,
    total,
  } = props;
  const text = converStatusToString(value);
  const number = total && total > 0 ? total : 0;
  const color = converStatusToColor(value);
  return (
    <TouchableOpacity onPress={() => onSelectedChange(value)}>
      <View
        style={{
          alignItems: "center",
          minWidth: Platform.isPad ? Screen.width / 4 : Screen.width / 4,
          //paddingVertical: 5,
          paddingHorizontal: responsive.h(10),
          marginTop: responsive.h(10),
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: value !== currentValue ? "Inter-Regular" : "Inter-Bold",
            fontSize: responsive.h(13),
            fontWeight: value !== currentValue ? "normal" : "bold",
            fontStyle: "normal",
            letterSpacing: 0,
            textAlign: "center",
            color: value !== currentValue ? "#c8c8c8" : "#3d3d3d",
          }}
        >
          {text}
        </Text>
        <View
          style={{
            //right: -7,
            //position: 'absolute',
            marginTop: responsive.h(2.5),
            borderRadius: responsive.h(45),
            minWidth: responsive.h(20),
            minHeight: 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: value !== currentValue ? "#fff" : "#fff5eb",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-Medium",
              fontSize: responsive.h(13),
              fontWeight: "500",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "center",
              color: value !== currentValue ? "#c8c8c8" : color,
            }}
          >
            {number > 99 ? "99+" : number}
          </Text>
        </View>
        <View
          style={{
            width: Platform.isPad ? responsive.h(64) : responsive.h(44),
            height: 3,
            borderRadius: responsive.h(4),
            backgroundColor: value !== currentValue ? "#fff" : "#a3cd80",
            marginTop: responsive.h(2.5),
          }}
        />
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
