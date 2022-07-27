import React from "react";
import { ImageBackground, View, StatusBar } from "react-native";
import responsive from "../../../resources/responsive";
import colors from "../../theme/colors";
import Device from "../../utils/device";

const NavBar = ({ leftButton, body, rightView, style }) => (
  <ImageBackground
    source={require("../../../resources/bgHeader.png")}
    style={{ marginTop: -2, marginBottom: 10, height: responsive.h(102) }}
  >
    <StatusBar
      barStyle="light-content"
      backgroundColor="transparent"
      translucent={true}
    />
    <View
      style={{
        marginTop: Platform.OS == "ios" ? 0 : StatusBar.currentHeight,
        backgroundColor: "transparent",
        height: 50,
        justifyContent: "center",
        //...Device.defaultNavBarStyle(),
        ...style,
      }}
    >
      <View
        style={{
          height: responsive.h(80),
          backgroundColor: "transparent",
          marginHorizontal: responsive.h(15),
          //   flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ justifyContent: "center" }}>{leftButton}</View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            //...Device.defaultPaddingTop(),
          }}
        >
          {body}
        </View>
        <View style={{ justifyContent: "center" }}>{rightView}</View>
      </View>
      {/* <View
        style={{
          height: 50,
          backgroundColor: "#ffffff",
          borderTopRightRadius: 25,
        }}
      /> */}
    </View>
  </ImageBackground>
);

export default NavBar;
