import React, { Component } from "react";
import {
  createMaterialTopTabNavigator,
  createAppContainer,
  TabBarBottom,
  TabBarTop,
  TabNavigator,
  DrawerNavigator,
} from "react-navigation";
import { Image, Text, View, Platform } from "react-native";
import { MyIcon } from "../theme/icons";
import colors from "../theme/colors";
import Strings from "../utils/languages";
import Content from "../screens/request/Detail/Content";
import Contact from "../screens/request/Detail/Contact";
import History from "../screens/request/Detail/History";
import responsive from "../resources/responsive";

const Navigator = createMaterialTopTabNavigator(
  {
    Content: {
      screen: Content,
    },
    History: {
      screen: History,
    },
    Contact: {
      screen: Contact,
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarLabel: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let iconTab;
        const count = 0;
        switch (routeName) {
          case "Content":
            {
              return (
                <Text
                  style={{
                    fontFamily: "Inter-SemiBold",
                    fontSize: responsive.h(16),
                    fontWeight: "600",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "center",
                    paddingVertical: 7,
                    color: "#222222",
                  }}
                >
                  {Strings.detailRequest.tabContent}
                </Text>
              );
            }
            break;
          case "History": {
            return (
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: responsive.h(16),
                  fontWeight: "600",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "center",
                  paddingVertical: 7,
                  color: "#222222",
                }}
              >
                {Strings.detailRequest.tabHistory}
              </Text>
            );
          }
          case "Contact": {
            return (
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: responsive.h(16),
                  letterSpacing: 0,
                  textAlign: "center",
                  paddingVertical: 7,
                  color: "#222222",
                }}
              >
                {Strings.detailRequest.tabContact}
              </Text>
            );
          }
          default:
            break;
        }
        return <MyIcon name={iconTab} size={24} color={tintColor} />;
      },
    }),
    //   tabBarComponent: TabBarTop,

    tabBarPosition: "top",
    tabBarOptions: {
      activeTintColor: "#282828",
      inactiveTintColor: "#c8c8c8",
      backgroundColor: "#fff",
      indicatorStyle: {
        backgroundColor: "#df2027",
        height: 3,
        borderRadius: 2,
      },

      style: {
        backgroundColor: "#fff",
      },
      showIcon: false,
      showLabel: true,
      upperCaseLabel: true,
    },
  }
);

export default (TabRequestDetail = createAppContainer(Navigator));
