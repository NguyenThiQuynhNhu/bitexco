import React from "react";
import {
  TabBarBottom,
  TabBarTop,
  createBottomTabNavigator,
} from "react-navigation";
import {
  Image,
  View,
  StyleSheet,
  ImageBackground,
  Text,
  Platform,
  Dimensions,
} from "react-native";
import { MyIcon } from "../resident/theme/icons";
import colors from "../resident/theme/colors";
import fonts from "../theme/fontFamily";
import ImageProgress from "../components/common/ImageProgress";
import Strings from "../resident/utils/languages";
// import { connect } from 'react-redux';

import { Screen } from "../../src/utils/device";
//Vendor

import RequestScreen from "../resident/screens/request/List";

import Notification from "../resident/screens/notification";

import HomeScreen from "../resident/Home";

import UtilityScreen from "../resident/screens/utility";

import PaymentScreen from "../resident/screens/payment";
import HandoverScheduleScreen from "../resident/screens/handoverSchedule";
import { color } from "react-native-reanimated";
import { app } from "firebase";
import responsive from "../resources/responsive";
import DistableScreen from "../resident/screens/Distable";
import Svg, { Path } from "react-native-svg";
import { getPath, getPathUp } from "../resident/theme/path";
const Devices = require("react-native-device-detection");
// const DeviceInfo = require('react-native-device-info');
const { width, height } = Dimensions.get("window");
export default createBottomTabNavigator(
  {
    home: { screen: HomeScreen },
    requests: { screen: RequestScreen },
    // notification: { screen: Notification },
    distable: { screen: DistableScreen },
    payment: { screen: PaymentScreen },
    utility: { screen: UtilityScreen },
    //schedule: { screen: HandoverScheduleScreen },
  },
  {
    //animationEnabled: false,
    defaultNavigationOptions: ({ navigation, screenProps }) => ({
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        if (navigation.state.routeName === "distable") {
          return null;
        }
        defaultHandler();
      },
      gesturesEnabled: false,
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let iconTab;
        let text;
        const d = getPath(width, 65, 55, 0);
        const d1 = getPath(width, 70, 55, 0);
        switch (routeName) {
          case "distable":
            // console.log(DeviceInfo)

            return (
              <View
                style={{
                  // padding: 1,
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  //backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: Platform.isPad ? -25 : -17,
                  elevation: 1
                }}
              >
                <View style={{ ...styles.MainView, position: 'absolute', height: 5, bottom: -35, backgroundColor: '#fff' }} />
                <ImageProgress
                  source={{ uri: screenProps.towerLogoUrl }}
                  circle={true}
                  style={{ width: 53, height: 53 }}
                />

              </View>
            );

          case "payment":
            iconTab = "thanh-ton-01";
            badge = screenProps.badge.badgePaymentR;
            text = Strings.tabbar.payment;
            return (
              <View style={styles.MainView}>
                <View style={{}}>
                  <MyIcon
                    name={iconTab}
                    size={responsive.h(26)}
                    color={tintColor}
                  />
                  {badge !== 0 && (
                    <View style={styles.IconBadge1}>
                      <Text
                        style={{
                          color: "white",
                          fontSize: responsive.h(12),
                        }}
                      >
                        {badge > 99 ? "99+" : badge}
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={{
                    ...styles.text,
                    color: tintColor,
                  }}
                >
                  {text}
                </Text>
              </View>
            );
            break;
          case "requests":
            // return <IconBadgeNotification tintColor={tintColor} />;
            iconTab = "phn-nh-01";
            badge = screenProps.badge.badgeRequestR;
            text = Strings.tabbar.request;
            return (
              <View style={styles.MainView}>
                <View style={{}}>
                  <MyIcon
                    name={iconTab}
                    size={responsive.h(26)}
                    color={tintColor}
                  />
                  {badge !== 0 && (
                    <View style={styles.IconBadge1}>
                      <Text
                        style={{
                          color: "white",
                          fontSize: responsive.h(12),
                        }}
                      >
                        {badge > 99 ? "99+" : badge}
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={{
                    ...styles.text,
                    color: tintColor,
                  }}
                >
                  {text}
                </Text>
              </View>
            );
            break;
          case "home":
            iconTab = "trang-ch-01";
            badge = screenProps.badge.badgeNotifyR;
            return (
              <Svg style={styles.Svg} width={width} height={65}>
                <Path
                  fill={"#none"}
                  stroke="#DDDDDD"
                  strokeWidth={1}
                  {...{ d }}
                />
                <View style={styles.MainView}>
                  <View style={{}}>
                    <MyIcon
                      name={iconTab}
                      size={responsive.h(26)}
                      color={tintColor}
                    />
                    {/* {badge !== 0 && (
                      <View style={styles.IconBadge1}>
                        <Text
                          style={{
                            color: "white",
                            fontSize: responsive.h(12),
                          }}
                        >
                          {badge > 99 ? "99+" : badge}
                        </Text>
                      </View>
                    )} */}
                  </View>
                  <Text
                    style={{
                      ...styles.text,
                      color: tintColor,
                    }}
                  >
                    {Strings.tabbar.home}
                  </Text>
                </View>
              </Svg>
            );
            break;
          case "schedule":
            iconTab = "calendar2";
            badge = 0;
            break;

          case "utility":
            iconTab = "tin-ch-01";
            badge = 0;
            text = Strings.tabbar.utility;
            return (
              <View style={styles.MainView}>
                <View style={{}}>
                  <MyIcon
                    name={iconTab}
                    size={responsive.h(26)}
                    color={tintColor}
                  />
                  {badge !== 0 && (
                    <View style={styles.IconBadge1}>
                      <Text
                        style={{
                          color: "white",
                          fontSize: responsive.h(12),
                        }}
                      >
                        {badge > 99 ? "99+" : badge}
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={{
                    ...styles.text,
                    color: tintColor,
                  }}
                >
                  {text}
                </Text>
              </View>
            );
            break;
          default:
            break;
        }
        // return (
        //   <View style={{ justifyContent: 'flex-end', alignItems: 'center', marginBottom: 10, backgroundColor: '#000', }}>
        //     <MyIcon name={iconTab} size={Platform.isPad ? 30: 26} color={tintColor} />
        //     <Text style={{ ...styles.text, color: tintColor }}>
        //       {text}
        //     </Text>
        //     {badge !== 0 &&
        //       <View style={styles.IconBadge}>
        //         <Text style={{ color: 'white', fontSize: 10 }}>{badge > 99 ? '99+' : badge}</Text>
        //       </View>
        //     }
        //   </View>

        // );
      },
    }),
    swipeEnabled: false,
    lazy: true,
    initialRouteName: "home",
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",

    tabBarOptions: {
      //style: { backgroundColor: '#fff' },
      showLabel: false,
      activeTintColor: colors.appTheme,
      inactiveTintColor: colors.gray1,
      //activeBackgroundColor: '#f1d32e',
      keyboardHidesTabBar: true,

      tabStyle: {
        // backgroundColor: colors.appTheme,
      },
      style: {
        // marginTop: Platform.OS == "android" ? 30 : 0,
        // height: Platform.isPad || Platform.OS == "ios" ? 25 : 40,
        height: 65,
        borderTopWidth: 0,
      },
    },
    // navigationOptions: ({ navigation }) => ({
    //   tabBarOnPress: (scene, jumpToIndex) => {
    //     console.log('onPress:', scene.route);
    //     //jumpToIndex(scene.index);
    //   },
    // }),
  }
);
const styles = StyleSheet.create({
  IconBadge: {
    top: -21,
    right: 10,
    position: "absolute",
    borderRadius: 45,
    minWidth: 12,
    minHeight: 12,
    backgroundColor: "#e24444",
    alignItems: "center",
    justifyContent: "center",
    padding: 1,
  },
  IconBadge1: {
    top: 0,
    right: 0,
    position: "absolute",
    borderRadius: 45,
    minWidth: responsive.h(12),
    minHeight: responsive.h(12),
    backgroundColor: "#e24444",
    alignItems: "center",
    justifyContent: "center",
  },
  MainView: {
    justifyContent: "center",
    alignItems: "center",
    width: width / 5,
    height: 65,
    marginTop: 5,
    backgroundColor: '#fff'
  },
  container: {
    //flex: 1,
    //flexDirection: "column"
  },
  Svg: {
    width: width,
    height: 70,
    position: "absolute",
    //bottom: Devices.isTablet ? -60 : -20,
    left: Platform.isPad ? -(Screen.width / 10 - responsive.h(8.5)) : 0,
    //bottom: 0
  },
  text: {
    fontFamily: fonts.appTheme,
    fontSize: responsive.h(12),
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
  },
});
