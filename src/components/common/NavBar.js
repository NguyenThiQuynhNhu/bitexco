import React from "react";
import { Text, View, Platform, StatusBar, SafeAreaView } from "react-native";
import colors from "../../theme/colors";
import Device from "../../utils/device";
import LinearGradient from "react-native-linear-gradient";

const NavBar = ({
  leftButton,
  body,
  rightView,
  backgroundColor,
  style,
  backgroundColor2,
}) => {
  return (
    <View
      style={{
        ...style,
      }}
    >
      <SafeAreaView
        style={{ flex: 0, backgroundColor: "transparent", border: 0 }}
      />
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View
        style={{
          //flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
        }}
      >
        <View style={{ justifyContent: "center" }}>{leftButton}</View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          {body}
        </View>
        <View style={{ justifyContent: "center" }}>{rightView}</View>
      </View>
    </View>
  );
};

export default NavBar;
