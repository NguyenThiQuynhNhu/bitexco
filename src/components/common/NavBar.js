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
        // backgroundColor: backgroundColor ? backgroundColor : colors.appTheme,
        // ...Device.defaultNavBarStyle(),
        // marginBottom: -30,
        ...style,
        height: 50,
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
          //   backgroundColor: colors.appTheme,
          marginHorizontal: 10,
          //flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 30,
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
      <View
        style={{
          height: 50,
          //   backgroundColor: backgroundColor2 ? backgroundColor2 : "#ffffff",
          borderTopRightRadius: 30,
        }}
      />
      {/* <View style={{
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    {body}
                </View>
                <View style={{
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    flexDirection: 'row',
                    justifyContent: 'space-between', //...Device.defaultMarginTop()
                }}>
                    <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 5  }}>
                        {leftButton}
                    </View>
                    <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 5  }}>
                        {rightView}
                    </View>
                </View> */}
    </View>
  );
};

export default NavBar;
