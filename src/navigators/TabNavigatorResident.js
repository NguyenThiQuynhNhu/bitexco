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
import responsive from "../resources2/responsive";
import DistableScreen from "../resident/screens/Distable";
const Devices = require("react-native-device-detection");
// const DeviceInfo = require('react-native-device-info');
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
        switch (routeName) {
          case "distable":
            // console.log(DeviceInfo)
            return (
              <View
                style={{
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  // top: -1 / 10,
                  bottom: 28,
                }}
              >
                <View
                  style={{
                    width: Devices.isTablet ? 60 : Screen.width / 5 - 20,
                    height: Devices.isTablet ? 60 : Screen.width / 5 - 20,
                    backgroundColor: "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: Devices.isTablet ? -75 : -60,
                  }}
                >
                  <Image
                    source={require("../resources2/Tabbar/icontabbar.png")}
                  />
                </View>
                <Text
                  style={{
                    ...styles.text,
                    color: tintColor,
                    position: "absolute",
                    top: Devices.isTablet ? -15 : -10,
                  }}
                >
                  {Strings.tabbar.notification}
                </Text>
              </View>
            );
          case "payment":
            iconTab = "message";
            badge = screenProps.badge.badgePaymentR;
            text = Strings.tabbar.payment;
            return (
              <View>
                <View style={styles.MainView}>
                  <View
                    style={{
                      position: "absolute",
                      top: Devices.isTablet ? -50 : -40,
                    }}
                  >
                    <MyIcon
                      name={iconTab}
                      size={Devices.isTablet ? 30 : 26}
                      color={tintColor}
                    />
                    {badge !== 0 && (
                      <View style={styles.IconBadge1}>
                        <Text
                          style={{
                            color: "white",
                            fontSize: Devices.isTablet ? 12 : 10,
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
                      position: "absolute",
                      top: -15,
                    }}
                  >
                    {text}
                  </Text>
                </View>
              </View>
            );
            break;
          case "requests":
            // return <IconBadgeNotification tintColor={tintColor} />;
            iconTab = "message-square";
            badge = screenProps.badge.badgeRequestR;
            text = Strings.tabbar.request;
            return (
              <View>
                <View style={styles.MainView}>
                  <View
                    style={{
                      position: "absolute",
                      top: Devices.isTablet ? -50 : -40,
                    }}
                  >
                    <MyIcon
                      name={iconTab}
                      size={Devices.isTablet ? 30 : 26}
                      color={tintColor}
                    />
                    {badge !== 0 && (
                      <View style={styles.IconBadge1}>
                        <Text
                          style={{
                            color: "white",
                            fontSize: Devices.isTablet ? 12 : 10,
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
                      position: "absolute",
                      top: -15,
                    }}
                  >
                    {text}
                  </Text>
                </View>
              </View>
            );
            break;
          case "home":
            iconTab = "home11";
            badge = screenProps.badge.badgeNotifyR;
            return (
              <View>
                <View style={styles.MainView}>
                  <ImageBackground
                    source={require("../resources2/Tabbar/tabbar.png")}
                    style={styles.image}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: Devices.isTablet ? -50 : -40,
                    }}
                  >
                    <MyIcon
                      name={iconTab}
                      size={Devices.isTablet ? 30 : 26}
                      color={tintColor}
                    />
                    {badge !== 0 && (
                      <View style={styles.IconBadge1}>
                        <Text
                          style={{
                            color: "white",
                            fontSize: Devices.isTablet ? 12 : 10,
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
                      position: "absolute",
                      top: -15,
                    }}
                  >
                    {Strings.tabbar.home}
                  </Text>
                </View>
              </View>
            );
            break;
          case "schedule":
            iconTab = "calendar2";
            badge = 0;
            break;

          case "utility":
            iconTab = "ic_tab_tien_ich";
            badge = 0;
            text = Strings.tabbar.utility;
            return (
              <View>
                <View style={styles.MainView}>
                  <View
                    style={{
                      position: "absolute",
                      top: Devices.isTablet ? -50 : -40,
                    }}
                  >
                    <MyIcon
                      name={iconTab}
                      size={Devices.isTablet ? 30 : 26}
                      color={tintColor}
                    />
                    {badge !== 0 && (
                      <View style={styles.IconBadge1}>
                        <Text
                          style={{
                            color: "white",
                            fontSize: Devices.isTablet ? 12 : 10,
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
                      position: "absolute",
                      top: -15,
                    }}
                  >
                    {text}
                  </Text>
                </View>
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
        marginTop: Platform.OS == "android" ? 30 : 0,
        height: Platform.isPad || Platform.OS == "ios" ? 25 : 40,
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
    minWidth: Devices.isTablet ? 15 : 12,
    minHeight: Devices.isTablet ? 15 : 12,
    backgroundColor: "#e24444",
    alignItems: "center",
    justifyContent: "center",
  },
  MainView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    //flex: 1,
    //flexDirection: "column"
  },
  image: {
    width: Screen.width,
    height: responsive.h(90),
    position: "absolute",
    bottom: Devices.isTablet ? -60 : -20,
    left: -(Screen.width / 10),
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
