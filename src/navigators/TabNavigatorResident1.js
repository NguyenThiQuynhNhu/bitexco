import React from 'react';
import { TabBarBottom, TabBarTop, createBottomTabNavigator } from 'react-navigation';
import { Image, Text, View } from 'react-native';
import { MyIcon } from '../theme/icons';
import colors from '../theme/colors';
import Strings from '../utils/languages';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';


//Vendor

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
export default createBottomTabNavigator({
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
      gesturesEnabled: false,
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let iconTab;
        switch (routeName) {
          case 'distable':
          return <Image
            resizeMode='contain'
            style={{ width: '100%', height: '100%' }}
            source={{ uri: screenProps.towerLogoUrl }} />
          case 'payment':
            return <Icon name="thanh-ton-01" size={25} color={tintColor} />
            iconTab = "message"
            break;
          case 'requests':
            return <Icon name="phn-nh-01" size={25} color={tintColor} />
            iconTab = "message-square"
            break;
          case 'home':
            return <Icon name="trang-ch-01" size={25} color={tintColor} />
            iconTab = "home"
            break;
          case 'schedule':
            return <Icon name="calendar2" size={25} color={tintColor} />
            iconTab = "call"
            break;
          case 'utility':
            iconTab = "tin-ch-01"
            break;
          default: break;
        }
        return (
          <MyIcon name={iconTab} size={25} color={tintColor} />
        );
      },
    }),
    swipeEnabled: false,
    lazy: true,
    initialRouteName: 'home',
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',

    tabBarOptions: {
      style: { backgroundColor: '#fff' },
      showLabel: false,
      activeTintColor: colors.red,
      inactiveTintColor: '#757574',
      //activeBackgroundColor: '#f1d32e',
      keyboardHidesTabBar: true,
      style: {
        borderTopColor: '#e8e8e8'
      }
    },
  }
);