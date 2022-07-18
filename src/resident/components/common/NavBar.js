import React from "react";
import { ImageBackground, View } from "react-native";
import responsive from "../../../resources2/responsive";

import colors from "../../theme/colors";
import Device from "../../utils/device";

const NavBar = ({ leftButton, body, rightView, style }) => (
  <ImageBackground
    source={require("../../../resources2/bgHeader.png")}
    style={{
      width: "100%",
      height: responsive.h(80),
    }}
  >
    <View
      style={{
        ...Device.defaultNavBarStyle(),
        // backgroundColor: colors.appTheme,
        // marginBottom: -15,
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
