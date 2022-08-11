import React from "react";
import {
  TabBarBottom,
  TabBarTop,
  createBottomTabNavigator,
} from "react-navigation";
import { Image, Text, View } from "react-native";
import { MyIcon } from "../theme/icons";
import colors from "../theme/colors";
import Strings from "../utils/languages";
import { connect } from "react-redux";

//Vendor

import RequestScreen from "../screens/request/List";

import Notification from "../screens/notification";

import HomeScreen from "../Home";

import UtilityScreen from "../screens/utility";

import PaymentScreen from "../screens/payment";

export default createBottomTabNavigator(
  {
    notification: { screen: Notification },
    requests: { screen: RequestScreen },
    home: { screen: HomeScreen },
    payment: { screen: PaymentScreen },
    utility: { screen: UtilityScreen },
  },
  {
    //animationEnabled: false,
    defaultNavigationOptions: ({ navigation, screenProps }) => ({
      gesturesEnabled: false,
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let iconTab;
        switch (routeName) {
          case "home":
            //console.log(navigation.state)
            return (
              <Image
                style={{ width: "100%", height: 30 }}
                source={{ uri: screenProps.towerLogoUrl }}
              />
            );
          case "payment":
            iconTab = "message";
            break;
          case "requests":
            // return <IconBadgeNotification tintColor={tintColor} />;
            iconTab = "message-square";
            break;
          case "notification":
            iconTab = "home";
            break;
          case "utility":
            iconTab = "ic_tab_tien_ich";
            break;
          default:
            break;
        }
        return <MyIcon name={iconTab} size={24} color={tintColor} />;
      },
    }),
    swipeEnabled: false,
    lazy: true,
    initialRouteName: "home",
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",

    tabBarOptions: {
      style: { backgroundColor: "#fff" },
      showLabel: false,
      activeTintColor: colors.red,
      inactiveTintColor: "#757574",
      //activeBackgroundColor: '#f1d32e',
      keyboardHidesTabBar: true,
      style: {
        borderTopColor: "#e8e8e8",
      },
    },
  }
);
