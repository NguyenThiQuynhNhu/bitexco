import React from "react";
import { Text } from "react-native";
import { connect } from "react-redux";

import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
} from "react-navigation";
import { createReduxContainer } from "react-navigation-redux-helpers";

// import * as Animatable from 'react-native-animatable';

import Device from "../utils/device";

import Strings from "../utils/languages";

//auth
import TabNavigatorResident from "../navigators/TabNavigatorResident";

import SplashScreen from "../screens/auth/Splash";
import LoginScreen from "../screens/auth/Login";
import RequestCreate from "../screens/request/RequestCreate";
import RequestCreateComplete from "../screens/request/RequestCreate/CreateComplete";
import RequestDetail from "../screens/request/Detail";
import RequestAssignEmployee from "../screens/request/Edit/RequestAssignEmployee";
import RequestUpdateStatus from "../screens/request/Edit/RequestUpdateStatus";
import RequestComplete from "../screens/request/Edit/RequestComplete";

import VendorDictionary from "../screens/request/RequestCreate/ListVendor";
import DepDictionary from "../screens/request/RequestCreate/ListDep";
import EmpDictionary from "../screens/request/RequestCreate/ListEmployee";
import GroupDictionary from "../screens/request/RequestCreate/ListGroup";
import ApartmentDictionary from "../screens/request/RequestCreate/ListApartment";

import StatusDictionary from "../screens/request/RequestCreate/ListStatus";
import ContractDictionary from "../screens/request/RequestCreate/ListContract";
import ServiceExtensionDetail from "../screens/services/ServiceExtension/Detail";
import ServiceExtensionDetailAssignEmployee from "../screens/services/ServiceExtension/AssignEmployee";
import ServiceExtensionDetailUpdateStatus from "../screens/services/ServiceExtension/UpdateStatus";
import Setting from "../screens/profile/Setting";
import DrawerScreen from "./DrawerNavigator";
import DrawerMainResident from "./ResidentHomeNavigator";
import Forward from "../screens/request/Forward";
import ServiceBasicDetail from "../screens/services/serviceBasic/Detail";
import ChecklistDetail from "../screens/checklist/Detail";
import ShiftList from "../screens/shifts";
import ChangeShift from "../screens/shifts/ChangeShift";
import ShiftChoice from "../screens/shifts/ShiftChoice";
import ListSource from "../screens/checklist/Detail/ListDataSelected";
import ListProperty from "../screens/checklist/Detail/ListProperty";

import ChecklistStatusScreen from "../screens/checklist/List/ListStatus";

import TickedList from "../screens/ticked";
import colors from "../theme/colors";

import ProposalScreen from "../screens/proposal/List";
import ProposalDetailScreen from "../screens/proposal/Detail";
import ProposalStatusScreen from "../screens/proposal/List/ListStatus";

import ChecklistScreen from "../screens/checklist/List";
import MaintenanceScreen from "../screens/maintenance/List";
import PropertiesScreen from "../screens/checklist/Detail/property";
import HistoryScreen from "../screens/checklist/Detail/history2";

import RequestScreen from "../screens/request/List";

import NotificationScreen from "../screens/notification/List";
import NotificationTypeScreen from "../screens/notification/List/ListStatus";
import DeviceInfoScreen from "../screens/test/deviceInfo";
import SettingScreen from "../screens/profile/Setting";

import GeneralStatisticsScreen from "../screens/statistics/general";
import EmployeeStatisticsScreen from "../screens/statistics/employee";
import GroupsStatisticsScreen from "../screens/statistics/groups";
import ReportGroupsProgressScreen from "../screens/statistics/groupsProgress";
import SurveyStatisticScreen from "../screens/statistics/survey";
import SurveyChartScreen from "../screens/statistics/survey/chart";

import ServiceBasic from "../screens/services/serviceBasic";
import ServiceExtension from "../screens/services/ServiceExtension";

import DashboardScreen from "../screens/dashboard/List";
import DashboardLevel2Screen from "../screens/dashboard/Level2";
import DashboardChecklistScreen from "../screens/dashboard/Checklist";

import WaterScreen from "../screens/water/List";
import BlockListScreen from "../screens/dictionary/ListBlock";
import FloorListScreen from "../screens/dictionary/ListFloor";
import WaterDetailScreen from "../screens/water/Create";

import ElectricDetailScreen from "../screens/electric/Create";
import ElectricScreen from "../screens/electric/List";

import ShiftChangeScreen from "../screens/shiftChange/List";
import ShiftChangeDetailScreen from "../screens/shiftChange/Detail";
import GasScreen from "../screens/gas/List";
import GasDetailScreen from "../screens/gas/Create";
import UnitsGasListScreen from "../screens/dictionary/ListUnitsGas";
import CheckList_KhachHang from "../screens/bangiaokhachhang/checklist/index";
import DangThucHien_TaiSan_KhachHang from "../screens/bangiaokhachhang/checklist/DangThucHien_TaiSan";
import NhomListScreen from "../screens/dictionary/ListNhom";
import TangListScreen from "../screens/dictionary/ListTang";
import CheckList_NoiBo from "../screens/bangiaonoibo/checklist/index";
import DangThucHien_TaiSan from "../screens/bangiaonoibo/checklist/DangThucHien_TaiSan";
import HandOverMore from "../screens/bangiaonoibo/checklist/HandOverMore";
import Notification_Bangiao from "../screens/notification/notification_bangiao/index";
import Notification_Bangiao_Detail from "../screens/notification/notification_bangiao/Detail";
import ChecklistOfflineScreen from "../screens/checklistOffline/List";
import ChecklistOfflineDetailScreen from "../screens/checklistOffline/Detail";
import MainScreen from "../navigators/TabNavigatorResident";
import HomeScreen from "../resident/Home";
import ProfileScreen from "../resident/screens/profile";
import NotificationResidentScreen from "../resident/screens/notification";
import NewsDetail from "../resident/screens/notification/Detail";
import RequestDetailResident from "../resident/screens/request/Detail";
import RequestCreateResident from "../resident/screens/request/RequestCreate";
import PaymentScreen from "../resident/screens/payment/Detail";
import PaymentHistoryScreen from "../resident/screens/payment/History";
import EwalletScreen from "../resident/screens/ewallet";
import UtilitiesBasicDetail from "../resident/screens/utility/BasicDetail";
import UtilitiesBasicBooking from "../resident/screens/utility/BasicBooking";
import ServicesScreen from "../resident/screens/utility/Services";
import ServicesDetailScreen from "../resident/screens/utility/ServicesDetail";
import ServiceExtensionScreen from "../resident/screens/utility/services/ServiceExtension";
import ServiceExtensionDetailScreen from "../resident/screens/utility/services/ServiceExtension/Detail";
import SettingResident from "../resident/screens/profile/Setting";
import DeparmentDetailScreen from "../resident/screens/profile/DeparmentDetail";
import ServiceBasicScreen from "../resident/screens/utility/services/ServiceBasic";
import ServiceBasicDetailScreen from "../resident/screens/utility/services/ServiceBasic/Detail";
import ZoneDictionary from "../resident/screens/utility/ListZone";
import HotlineScreen from "../resident/screens/vendor/HomeVendor/hotline";
import RuleDetailScreen from "../resident/screens/RuleDetail";
import ChangePassScreen from "../resident/screens/profile/changePass";
import HandoverScheduleScreen from "../resident/screens/handoverSchedule/index";
import BuildingScreen from "../screens/building";
import SurveyScreen from "../resident/screens/profile/survey/index";
import SurveyDetailScreen from "../resident/screens/profile/survey/Detail";
import CarCardScreen from "../resident/screens/profile/carCard";
import CarCardCreateScreen from "../resident/screens/profile/carCard/carCardCreate";
import ListTypeCar from "../resident/screens/profile/carCard/ListTypeCar";
import NewsEm from "../screens/news";
import DeparmentDetail from "../resident/screens/profile/DeparmentDetail";
import BuildingDetailScreen from "../screens/building/detail";

import RequestResidentScreen from "../resident/screens/request/List";

import NotificationResidenScreen from "../resident/screens/notification";

import UtilityResidentScreen from "../resident/screens/utility";

import PaymenttResidentScreen from "../resident/screens/payment";
export const Navigator = createStackNavigator(
  {
    splash: {
      screen: SplashScreen,
    },
    login: {
      screen: LoginScreen,
    },
    drawer: {
      screen: DrawerScreen,
    },
    drawerResident: {
      screen: DrawerMainResident,
    },
    requestDetail: {
      screen: RequestDetail,
    },
    requestAssignEmployee: {
      screen: RequestAssignEmployee,
    },
    requestUpdateStatus: {
      screen: RequestUpdateStatus,
    },
    requestCreate: {
      screen: RequestCreate,
    },
    requestCreateComplete: {
      screen: RequestCreateComplete,
    },
    requestComplete: {
      screen: RequestComplete,
    },
    requestForward: {
      screen: Forward,
    },
    vendorDictionary: {
      screen: VendorDictionary,
    },
    contractDictionary: {
      screen: ContractDictionary,
    },
    depDictionary: {
      screen: DepDictionary,
    },
    empDictionary: {
      screen: EmpDictionary,
    },
    statusDictionary: {
      screen: StatusDictionary,
    },
    setting: {
      screen: Setting,
      navigationOptions: {
        title: Strings.profile.setting,
      },
    },
    serviceExtensionDetail: {
      screen: ServiceExtensionDetail,
    },
    serviceExtensionDetailAssignEmployee: {
      screen: ServiceExtensionDetailAssignEmployee,
    },
    serviceExtensionDetailUpdateStatus: {
      screen: ServiceExtensionDetailUpdateStatus,
    },
    serviceBasicDetail: {
      screen: ServiceBasicDetail,
    },
    groupDictionary: {
      screen: GroupDictionary,
    },
    apartmentDictionary: {
      screen: ApartmentDictionary,
    },
    checklistDetail: {
      screen: ChecklistDetail,
    },
    shiftList: {
      screen: ShiftList,
    },
    changeShift: {
      screen: ChangeShift,
    },
    shiftChoice: {
      screen: ShiftChoice,
    },
    tickedList: {
      screen: TickedList,
    },
    depSource: {
      screen: ListSource,
    },
    propertyList: {
      screen: ListProperty,
    },
    proposal: { screen: ProposalScreen },

    checklist: { screen: ChecklistScreen },

    maintenance: { screen: MaintenanceScreen },

    requests: { screen: RequestScreen },

    checklistStatus: { screen: ChecklistStatusScreen },

    proposalDetail: { screen: ProposalDetailScreen },

    notification: { screen: NotificationScreen },

    proposalStatus: { screen: ProposalStatusScreen },

    notificationType: { screen: NotificationTypeScreen },

    deviceInfo: { screen: DeviceInfoScreen },

    setting: { screen: SettingScreen },

    generalStatistics: { screen: GeneralStatisticsScreen },
    employeeStatistics: { screen: EmployeeStatisticsScreen },
    groupsStatistics: { screen: GroupsStatisticsScreen },
    reportGroupsProgress: { screen: ReportGroupsProgressScreen },
    reportSurvey: { screen: SurveyStatisticScreen },
    serviceBasic: { screen: ServiceBasic },
    serviceExtension: { screen: ServiceExtension },
    dashboard: { screen: DashboardScreen },
    dashboardLevel2: { screen: DashboardLevel2Screen },
    dashboardChecklist: { screen: DashboardChecklistScreen },
    water: { screen: WaterScreen },
    blockList: { screen: BlockListScreen },
    floorList: { screen: FloorListScreen },
    waterDetail: { screen: WaterDetailScreen },

    electric: { screen: ElectricScreen },
    electricDetail: { screen: ElectricDetailScreen },
    shiftChange: { screen: ShiftChangeScreen },
    shiftChangeDetail: { screen: ShiftChangeDetailScreen },

    gas: { screen: GasScreen },
    gasDetail: { screen: GasDetailScreen },
    unitList: { screen: UnitsGasListScreen },
    CheckList_KhachHang: {
      screen: CheckList_KhachHang,
    },
    DangThucHien_TaiSan_KhachHang: {
      screen: DangThucHien_TaiSan_KhachHang,
    },
    NhomListScreen: {
      screen: NhomListScreen,
    },
    TangListScreen: {
      screen: TangListScreen,
    },
    CheckList_NoiBo: {
      screen: CheckList_NoiBo,
    },
    DangThucHien_TaiSan: {
      screen: DangThucHien_TaiSan,
    },
    HandOverMore: {
      screen: HandOverMore,
    },
    Notification_Bangiao: {
      screen: Notification_Bangiao,
    },
    Notification_Bangiao_Detail: {
      screen: Notification_Bangiao_Detail,
    },
    ChecklistOfflineScreen: {
      screen: ChecklistOfflineScreen,
    },
    checklisOfflinetDetail: {
      screen: createBottomTabNavigator(
        {
          checklist: {
            screen: ChecklistOfflineDetailScreen,
            tabBarOptions: {
              visible: true,
            },
          },
          // properties: {
          //     screen: PropertiesScreen,
          //     tabBarOptions: {
          //         visible: true
          //     },
          // },
          // history: {
          //     screen: HistoryScreen,
          //     tabBarOptions: {
          //         visible: true
          //     },
          // }
        },
        {
          defaultNavigationOptions: ({ navigation }) => ({
            tabBarLabel: ({ tintColor }) => {
              const { routeName } = navigation.state;
              let iconTab;
              const count = 0;
              switch (routeName) {
                // case 'properties':
                //     {
                //         return (
                //             <Text style={{ fontSize: 14, paddingVertical: 15, color: tintColor, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>TÀI SẢN</Text>
                //         )
                //     }
                //     break;
                // case 'history':
                //     {
                //         return (
                //             <Text style={{ fontSize: 14, paddingVertical: 15, color: tintColor, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>LỊCH SỬ</Text>
                //         )
                //     }
                case "checklist": {
                  return (
                    <Text
                      style={{
                        fontSize: 14,
                        paddingVertical: 15,
                        color: tintColor,
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                      }}
                    >
                      NỘI DUNG
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
          tabBarPosition: "bottom",
          tabBarOptions: {
            activeTintColor: colors.appTheme,
            inactiveTintColor: "#000",
            backgroundColor: "#fff",
            indicatorStyle: {
              backgroundColor: colors.appTheme,
              height: 3,
            },

            style: {
              backgroundColor: "#fff",
            },
            showIcon: false,
            showLabel: true,
            upperCaseLabel: true,
            visible: false,
          },
          backBehavior: "none",
        }
      ),
    },
    main: {
      screen: MainScreen,
    },
    home: { screen: HomeScreen },
    profile: {
      screen: ProfileScreen,
    },
    newsDetail: {
      screen: NewsDetail,
    },

    requestDetailResident: {
      screen: RequestDetailResident,
    },

    requestCreateResident: {
      screen: RequestCreateResident,
    },

    paymentDetail: {
      screen: PaymentScreen,
    },

    paymentHistory: {
      screen: PaymentHistoryScreen,
    },

    ewallet: {
      screen: EwalletScreen,
    },

    basicDetail: {
      screen: UtilitiesBasicDetail,
    },

    basicBooking: {
      screen: UtilitiesBasicBooking,
    },

    services: {
      screen: ServicesScreen,
    },

    servicesDetail: {
      screen: ServicesDetailScreen,
    },

    serviceExtensionResident: {
      screen: ServiceExtensionScreen,
    },

    serviceExtensionDetailResident: {
      screen: ServiceExtensionDetailScreen,
    },

    settingResident: {
      screen: SettingResident,
      navigationOptions: {
        title: Strings.profile.setting,
      },
    },

    department: { screen: DeparmentDetail },

    serviceBasicResident: {
      screen: ServiceBasicScreen,
    },

    serviceBasicDetailResident: {
      screen: ServiceBasicDetailScreen,
    },
    zoneDictionary: {
      screen: ZoneDictionary,
    },
    hotline: {
      screen: HotlineScreen,
    },
    ruleDetail: { screen: RuleDetailScreen },
    changePass: { screen: ChangePassScreen },
    // handoverSchedule: { screen: HandoverScheduleScreen },
    notificationResident: { screen: NotificationResidentScreen },
    building: { screen: BuildingScreen },
    survey: { screen: SurveyScreen },
    surveyDetail: { screen: SurveyDetailScreen },
    surveyChartReport: { screen: SurveyChartScreen },
    carCardList: { screen: CarCardScreen },
    carCardCreate: { screen: CarCardCreateScreen },
    listTypeCar: { screen: ListTypeCar },
    listNewsEm: { screen: NewsEm },
    builđingDetail : { screen: BuildingDetailScreen},

    requestsResiden : { screen: RequestResidentScreen},
    notificationResident : { screen: NotificationResidenScreen},
    utilityResident : { screen: UtilityResidentScreen},
    paymentResident : { screen: PaymenttResidentScreen},
  },
  {
    initialRouteName: "splash",
    headerMode: "none",
    cardStyle: { shadowColor: "transparent" },
  }
);
export const AppNavigator = createAppContainer(Navigator);

const mapStateToProps = (state) => ({
  state: state.nav,
});

const AppContainer = createReduxContainer(AppNavigator);
const AppWithNavigationState = connect(mapStateToProps)(AppContainer);

export default AppWithNavigationState;
