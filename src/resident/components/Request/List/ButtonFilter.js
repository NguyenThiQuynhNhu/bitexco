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
  converStatusToColorService,
} from "../../../utils/request";
import colors from "../../../theme/colors";
import { concat } from "lodash";
import responsive from "../../../../resources/responsive";
// create a component
const ButtonFilter = (props) => {
  const {
    onSelectedChange,
    value,
    currentValue,
    textColor,
    style,
    title,
    total,
    statusKey,
  } = props;
  const text = title ? title : converStatusToString(value);
  const number = total && total > 0 ? total : 0;
  const color = statusKey
    ? converStatusToColor(statusKey)
    : converStatusToColorService(value);
  //console.log(props)
  return (
    <TouchableOpacity onPress={() => onSelectedChange(value)}>
      <View
        style={{
          alignItems: "center",
          minWidth: Platform.isPad ? Screen.width / 4 : Screen.width / 4,
          //paddingVertical: 1.5,
          paddingHorizontal: responsive.h(5),
          flexDirection: "column",
          justifyContent: "center",
          // marginBottom: responsive.h(10),
          marginVertical: responsive.h(10),
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
            color: value !== currentValue ? "#c8c8c8" : colors.appTheme,
          }}
        >
          {text}
        </Text>
        <View
          style={{
            //right: -7,
            //position: 'absolute',
            marginTop: responsive.h(2.4),
            borderRadius: responsive.h(45),
            minWidth: responsive.h(20),
            minHeight: responsive.h(20),
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
        {/* <View style={{
                    width: Platform.isPad ? 64 : 44,
                    height: 3,
                    borderRadius: 4,
                    backgroundColor: value !== currentValue ? '#fff' : '#a3cd80',
                    marginTop: 2.5
                }}>

                </View> */}
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
