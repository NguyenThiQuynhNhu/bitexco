import React from "react";
import { ImageBackground, View, StatusBar, SafeAreaView, Platform } from "react-native";
import responsive from "../../../resources/responsive";
import colors from "../../theme/colors";
import Device, {Screen} from "../../utils/device";

const NavBar = ({ leftButton, body, rightView, style }) => (
  <ImageBackground
    source={require("../../../resources/bgHeader.png")}
    style={{
      marginTop: -2,
      marginBottom: responsive.h(10),
      height: responsive.h(110),
      justifyContent: "center",
      alignItems: "center",
      width: Screen.width,
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
        marginTop: Platform.OS == "ios" ? 0 : StatusBar.currentHeight,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        width: Screen.width,
        //...Device.defaultNavBarStyle(),
        ...style,
      }}
    >
      <View
        style={{
          backgroundColor: "transparent",
          flexDirection: "row",
          justifyContent: "space-between",
          width: Screen.width,
          //alignItems: "center",
        }}
      >
        <View style={{ justifyContent: "center" }}>{leftButton}</View>
        <View
          style={{
            justifyContent: "center", flex: 1
          }}
        >
          {body}
        </View>
        <View style={{ justifyContent: "center" }}>{rightView}</View>
      </View>
    </View>
  </ImageBackground>
);

export default NavBar;
