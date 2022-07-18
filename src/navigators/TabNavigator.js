import React, { Component } from 'react';
import { createMaterialTopTabNavigator, createAppContainer, TabBarBottom, TabBarTop, TabNavigator, DrawerNavigator } from 'react-navigation';
import { Image, Text, View, Platform } from 'react-native';
import { MyIcon } from '../theme/icons';
import colors from '../theme/colors';
import Strings from '../utils/languages';
import Content from '../screens/request/Detail/Content';
import Contact from '../screens/request/Detail/Contact';
import History from '../screens/request/Detail/History';

const Navigator = createMaterialTopTabNavigator(
  {
      Content: {
          screen: Content
      },
      History: {
          screen: History
      },
      Contact: {
          screen: Contact
      }
  },
  {
      defaultNavigationOptions: ({ navigation }) => ({
          tabBarLabel: ({ tintColor }) => {
              const { routeName } = navigation.state;
              let iconTab;
              const count = 0
              switch (routeName) {
                  case 'Content':
                      {
                          return (
                              <Text style={{ fontFamily: "Inter-SemiBold",
                              fontSize: 14,
                              fontWeight: "600",
                              fontStyle: "normal",
                              letterSpacing: 0,
                              textAlign: "center", paddingVertical: 7, color: tintColor }}>{Strings.detailRequest.tabContent}</Text>
                          )
                      }
                      break;
                  case 'History':
                      {
                          return (
                              <Text style={{ fontFamily: "Inter-SemiBold",
                              fontSize: 14,
                              fontWeight: "600",
                              fontStyle: "normal",
                              letterSpacing: 0,
                              textAlign: "center", paddingVertical: 7, color: tintColor }}>{Strings.detailRequest.tabHistory}</Text>
                          )

                      }
                  case 'Contact':
                      {
                          return (

                              <Text style={{ fontFamily: "Inter-SemiBold",
                              fontSize: 14,
                              fontWeight: "600",
                              fontStyle: "normal",
                              letterSpacing: 0,
                              textAlign: "center", paddingVertical: 7, color: tintColor }}>{Strings.detailRequest.tabContact}</Text>

                          )

                      }
                  default: break;
              }
              return (
                  <MyIcon name={iconTab} size={24} color={tintColor} />
              );
          }
      }),
    //   tabBarComponent: TabBarTop,
      
      tabBarPosition: 'top',
      tabBarOptions: {
          activeTintColor: '#282828',
          inactiveTintColor: '#c8c8c8',
          backgroundColor: '#fff',
          indicatorStyle: {
              backgroundColor: '#a3cd80',
              height: 3,
              borderRadius: 2
          },

          style: {
              backgroundColor: '#fff'
          },
          showIcon: false,
          showLabel: true,
          upperCaseLabel: true
      }
  })

  export default TabRequestDetail = createAppContainer(Navigator)