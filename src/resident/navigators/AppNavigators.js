import React, { Fragment } from 'react';
import {
    BackHandler,
    Alert,
    Platform,
    Text,
    View,
    NetInfo,
    SafeAreaView,
    StatusBar,
    DeviceEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import {  createStackNavigator, createAppContainer } from 'react-navigation';
import { createReduxContainer } from 'react-navigation-redux-helpers'


import NetworkStatusModal from '../components/common/NetworkStatusModal';
import Notification from 'react-native-in-app-notification';
// import * as Animatable from 'react-native-animatable';

import { createNavigationReducer } from 'react-navigation-redux-helpers';

//import  SafeAreaView  from 'react-native-safe-area-view'

import Strings from '../utils/languages';
import colors from '../theme/colors';
import Device from '../utils/device'

//// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
// const middleware = createReactNavigationReduxMiddleware(
//     "root",
//     state => state.nav,
// );

//const addListener = createReduxBoundAddListener("root");

//auth
import SplashScreen from '../screens/auth/Splash';
import LoginScreen from '../screens/auth/Login';
import MainScreen from '../navigators/TabNavigator';
import RequestCreate from '../screens/request/RequestCreate';
import RequestDetail from '../screens/request/Detail';
import VendorDetail from '../screens/vendor/HomeVendor';
import VendorInfo from '../screens/vendor/Info';
import VendorNews from '../screens/vendor/HomeVendor/News';
import VendorRequest from '../screens/vendor/HomeVendor/Request';
import NewsDetail from '../screens/notification/Detail';
import VendorDictionary from '../screens/request/RequestCreate/ListVendor';
import Fee from '../screens/vendor/HomeVendor/Fee';
import FeeDetail from '../screens/vendor/HomeVendor/Fee/Detail';
import Setting from '../screens/profile/Setting';
import PaymentScreen from '../screens/payment/Detail';
import ProfileScreen from '../screens/profile';
import DeparmentDetailScreen from '../screens/profile/DeparmentDetail';
import RuleDetailScreen from '../screens/RuleDetail';
import PaymentHistoryScreen from '../screens/payment/History';
import ServicesScreen from '../screens/utility/Services';
import ServicesDetailScreen from '../screens/utility/ServicesDetail';
import ServiceExtensionScreen from '../screens/utility/services/ServiceExtension';
import ServiceExtensionDetailScreen from '../screens/utility/services/ServiceExtension/Detail';
import ServiceBasicScreen from '../screens/utility/services/ServiceBasic';
import ServiceBasicDetailScreen from '../screens/utility/services/ServiceBasic/Detail';
import UtilitiesBasicDetail from '../screens/utility/BasicDetail';
import UtilitiesBasicBooking from '../screens/utility/BasicBooking';
import ZoneDictionary from '../screens/utility/ListZone';
import EwalletScreen from '../screens/ewallet';
import HotlineScreen from '../screens/vendor/HomeVendor/hotline';

export const Navigator = createStackNavigator({
    splash: {
        screen: SplashScreen
    },
    login: {
        screen: LoginScreen
    },
    main: {
        screen: MainScreen
    },
    requestDetail: {
        screen: RequestDetail
    },
    requestCreate: {
        screen: RequestCreate
    },

    vendorDictionary: {
        screen: VendorDictionary
    },
    vendorDetail: {
        screen: VendorDetail
    },
    vendorInfo: {
        screen: VendorInfo
    },
    vendorNews: {
        screen: VendorNews
    },
    vendorRequest: {
        screen: VendorRequest
    },
    fee: {
        screen: Fee
    },
    feeDetail: {
        screen: FeeDetail,
        navigationOptions: {
            title: Strings.detailVendor.fee
        }
    },
    newsDetail: {
        screen: NewsDetail
    },
    setting: {
        screen: Setting,
        navigationOptions: {
            title: Strings.profile.setting
        }
    },
    paymentDetail: {
        screen: PaymentScreen
    },
    profile: {
        screen: ProfileScreen,
    },
    department: { screen: DeparmentDetailScreen },

    ruleDetail: { screen: RuleDetailScreen },

    paymentHistory: {
        screen: PaymentHistoryScreen
    },
    services: {
        screen: ServicesScreen
    },
    servicesDetail: {
        screen: ServicesDetailScreen
    },
    serviceExtension: {
        screen: ServiceExtensionScreen
    },
    serviceExtensionDetail: {
        screen: ServiceExtensionDetailScreen
    },
    serviceBasic: {
        screen: ServiceBasicScreen
    },
    serviceBasicDetail: {
        screen: ServiceBasicDetailScreen
    },
    basicDetail: {
        screen: UtilitiesBasicDetail
    },
    basicBooking: {
        screen: UtilitiesBasicBooking
    },
    zoneDictionary: {
        screen: ZoneDictionary
    },
    ewallet: {
        screen: EwalletScreen
    },
    hotline: {
        screen: HotlineScreen
    }
},
    {
        initialRouteName: 'splash',
        headerMode: 'none',
        cardStyle: { shadowColor: 'transparent' }, // < == this
    },
    {
        navigationOptions: {
            gesturesEnabled: false,
            header: null
        }
    }
);


export const AppNavigator = createAppContainer(Navigator)


const mapStateToProps = state => ({
    state: state.nav,
});

const AppContainer = createReduxContainer(AppNavigator);
const AppWithNavigationState = connect(mapStateToProps)(AppContainer)

export default AppWithNavigationState
