import React, { Component } from 'react';
import { createMaterialTopTabNavigator, createAppContainer, TabBarBottom, TabBarTop, TabNavigator, DrawerNavigator } from 'react-navigation';
import { Image, Text, View, Platform } from 'react-native';
import { MyIcon } from '../theme/icons';
import colors from '../theme/colors';
import Strings from '../utils/languages';
import ChecklistDetail from '../screens/checklist/Detail/content';
import PropertiesScreen from '../screens/checklist/Detail/property';
import HistoryScreen from '../screens/checklist/Detail/history2';
import { Screen } from '../utils/device';
const Navigator = createMaterialTopTabNavigator(
  {
    checklist: {
        screen: ChecklistDetail,
        tabBarOptions: {
            visible: true
        },
    },
    properties: {
        screen: PropertiesScreen,
        tabBarOptions: {
            visible: true
        },
    },
    history: {
        screen: HistoryScreen,
        tabBarOptions: {
            visible: true
        },
    }
  },
  {
      defaultNavigationOptions: ({ navigation }) => ({
          tabBarLabel: ({ tintColor }) => {
              const { routeName } = navigation.state;
              let iconTab;
              const count = 0
              switch (routeName) {
                  case 'checklist':
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
                  case 'history':
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
                  case 'properties':
                      {
                          return (

                              <Text style={{ fontFamily: "Inter-SemiBold",
                              fontSize: 14,
                              fontWeight: "600",
                              fontStyle: "normal",
                              letterSpacing: 0,
                              textAlign: "center", paddingVertical: 7, color: tintColor }}>Tài sản</Text>

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
              backgroundColor: '#fff',
              marginTop: -15, marginBottom: 10,
          },
          showIcon: false,
          showLabel: true,
          upperCaseLabel: true
      }
  })

  export default TabChecklistDetal = createAppContainer(Navigator)