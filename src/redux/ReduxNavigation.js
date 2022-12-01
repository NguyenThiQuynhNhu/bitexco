import React, { Fragment, Component, useState, useEffect } from "react";
import {
  BackHandler,
  Alert,
  View,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  Keyboard,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { NavigationActions, StackActions } from "react-navigation";
import AppWithNavigationState from "../navigators/AppNavigators";
import Strings from "../utils/languages";
import Strings1 from "../resident/utils/languages";
import colors from "../theme/colors";
import Device from "../utils/device";
import ModalLogOut from "../components/common/ModalLogOut";
import LinearGradient from "react-native-linear-gradient";
import ImageProgress from "../components/common/ImageProgress";
import { MyIcon } from "../resident/theme/icons";
import { Screen } from "../../src/utils/device";
import Svg, { Path } from "react-native-svg";
import { getPath, getPathUp } from "../resident/theme/path";
import responsive from "../resources/responsive";
const { width, height } = Dimensions.get("window");
const d = getPath(width, 65, 55, 0);
const d1 = getPath(width, 70, 55, 0);
const Devices = require("react-native-device-detection");
const heightMenu = Devices.isIphoneX || Devices.isTablet ? responsive.h(65) : responsive.h(65)
Tab = (props) => {
  const { nav, dispatch, badge, dataMenus, isLoading, towerLogoUrl, type ='' } = props;
  console.log('reduxNavigation', props)
  const [showTab, setShowTab] = useState(true);
  const [showMenu, checkNavShowMenu] = useState(true);
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    //điều kiện hiện menu theo trang
    if (nav == 'notificationResident' || 
    nav == 'requestsResiden' || 
    nav == 'utilityResident' || 
    nav == 'home' || 
    nav == 'paymentResident' || 
    nav == 'requestCreateResident' || 
    nav == 'paymentDetail' || 
    nav == 'serviceBasicResident' || 
    nav == 'serviceExtensionResident' || 
    nav == 'settingResident' || 
    nav == 'survey' || 
    nav == 'paymentHistory') {
      checkNavShowMenu(true)
    } else (
      checkNavShowMenu(false)
    )
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, [nav]);
  const _keyboardDidShow = () => {
    setShowTab(false);
  };

  const _keyboardDidHide = () => {
    setShowTab(true);
  };
  return (

    <Fragment style={{backgroundColor: '#fff'}}>
      <View style={{ flex: 1, backgroundColor: '#fff', border: 0 }}>
        <View style={{
          flex: 1, border: 0,
          marginBottom: showMenu && showTab && (type == 're') ? heightMenu : 0,
        }}>
          <AppWithNavigationState screenProps={{ towerLogoUrl: towerLogoUrl, badge: badge }}
            state={nav}
            dispatch={dispatch} />
          {isLoading && <View style={{ position: 'absolute', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appOverView }}>
            <ActivityIndicator animating size="small" color={colors.appTheme} />
          </View>}

        </View>

      </View>

      {showMenu && showTab && (type == 're') &&
        <View style={{
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: Platform.OS == 'ios' ? 10 : 0,
          height: 0,
          height: showMenu && showTab && (type == 're') ? heightMenu : 0,
          width: Screen.width,
          display: showMenu && showTab && (type == 're') ? 'flex' : 'none',
          flexDirection: 'row', alignItems: 'flex-end',
        }}>
          <Svg style={{ ...styles.Svg, display: showMenu && showTab && (type == 're') ? 'flex' : 'none' }} width={width} height={65}>
            <Path
              fill={"#none"}
              stroke="#DDDDDD"
              strokeWidth={1}
              {...{ d }}
            />
          </Svg>
          <TouchableOpacity style={{ ...styles.MainView, display: showMenu && showTab && (type == 're') ? 'flex' : 'none' }}
            onPress={() => {
              let resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'home' })],
              });
              dispatch(resetAction)
            }}>
            <View style={{}}>
              <MyIcon
                name={"trang-ch-01"}
                size={responsive.h(26)}
                color={nav == 'home' ? colors.appTheme : colors.gray1}
              />
            </View>
            <Text
              style={{
                ...styles.text,
                color: nav == 'home' ? colors.appTheme : colors.gray1,
              }}
            >
              {Strings1.tabbar.home}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ ...styles.MainView, display: showMenu && showTab && (type == 're') ? 'flex' : 'none' }}
            onPress={() => {
              let resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'requestsResiden' })],
              });
              dispatch(resetAction)
            }}>
            <View style={{}}>
              <MyIcon
                name={'phn-nh-01'}
                size={responsive.h(26)}
                color={nav == 'requestsResiden' ? colors.appTheme : colors.gray1}
              />
              {badge.badgeRequestR !== 0 && (
                <View style={styles.IconBadge1}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: responsive.h(12),
                    }}
                  >
                    {badge.badgeRequestR > 99 ? "99+" : badge.badgeRequestR}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                ...styles.text,
                color: nav == 'requestsResiden' ? colors.appTheme : colors.gray1,
              }}
            >
              {Strings1.tabbar.request}
            </Text>
          </TouchableOpacity>

          <View style={{ ...styles.MainView, display: showMenu && showTab && (type == 're') ? 'flex' : 'none', backgroundColor: 'transparent', justifyContent: 'flex-end' }}>
            <View
              style={{
                width: 53,
                height: 53,
                borderRadius: 30,
                //backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: -22,
                display: showMenu && showTab && (type == 're') ? 'flex' : 'none'
              }}
            >
              <ImageProgress
                source={{ uri: towerLogoUrl }}
                circle={true}
                style={{ width: 52, height: 52 }}
              />
            </View>

            <View style={{ height: 5, width: '100%', backgroundColor: '#fff' }} />
          </View>
          <TouchableOpacity style={{ ...styles.MainView, display: showMenu && showTab && (type == 're') ? 'flex' : 'none' }}
            onPress={() => {
              let resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'paymentResident' })],
              });
              dispatch(resetAction)
            }}>
            <View style={{}}>
              <MyIcon
                name={'thanh-ton-01'}
                size={responsive.h(26)}
                color={nav == 'paymentResident' ? colors.appTheme : colors.gray1}
              />
              {badge.badgePaymentR !== 0 && (
                <View style={styles.IconBadge1}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: responsive.h(12),
                    }}
                  >
                    {badge.badgePaymentR > 99 ? "99+" : badge.badgePaymentR}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                ...styles.text,
                color: nav == 'paymentResident' ? colors.appTheme : colors.gray1,
              }}
            >
              {Strings1.tabbar.payment}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ ...styles.MainView, display: showMenu && showTab && (type == 're') ? 'flex' : 'none' }}
            onPress={() => {
              let resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'utilityResident' })],
              });
              dispatch(resetAction)
            }}>
            <View style={{}}>
              <MyIcon
                name={'tin-ch-01'}
                size={responsive.h(26)}
                color={nav == 'utilityResident' ? colors.appTheme : colors.gray1}
              />
              {/* {badge.badgePaymentR !== 0 && (
                <View style={styles.IconBadge1}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: responsive.h(12),
                    }}
                  >
                    {badge.badgePaymentR > 99 ? "99+" : badge.badgePaymentR}
                  </Text>
                </View>
              )} */}
            </View>
            <Text
              style={{
                ...styles.text,
                color: nav == 'utilityResident' ? colors.appTheme : colors.gray1,
              }}
            >
              {Strings1.tabbar.utility}
            </Text>
          </TouchableOpacity>
        </View>
      }
    </Fragment>
  );

}
class ReduxNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backPress: false,
      isConnected: true,
    };
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
    this.onCheckNetwork = this.onCheckNetwork.bind(this);
  }

  componentWillMount() {
    Strings.setLanguage(this.props.language);
    Strings1.setLanguage(this.props.language);
    // NetInfo.isConnected.addEventListener(
    //     'connectionChange',
    //     this.handleConnectionChange
    // )
    // if (Platform.OS === 'android') {
    //     this.onCheckNetwork()
    // }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.message && nextProps.message !== this.props.message) {
      //console.log('componentWillReceiveProps', nextProps.message)
      this.notification.show({
        title: "You pressed it!",
        message: "The notification has been triggered",
        onPress: () => Alert.alert("Alert", "You clicked the notification!"),
      });
    }
    if (this.props.language !== nextProps.language) {
      Strings.setLanguage(nextProps.language);
      Strings1.setLanguage(nextProps.language);
    }
  }
  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.onBackPress.bind(this)
    );
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.onBackPress.bind(this)
    );
  }

  onBackPress() {
    const { dispatch, nav } = this.props;
    const routeNameCurrent = this.getCurrentRouteName(nav);
    if (routeNameCurrent === "home" || routeNameCurrent === "vendors") {
      if (routeNameCurrent === "home") {
        Alert.alert("Xác nhận", "Bạn có muốn thoát ứng dụng?", [
          { text: "HUỶ", onPress: () => undefined },
          { text: "OK", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  }
  render() {
    const { nav, dispatch, isLoading } = this.props;
    console.log('nav',this.props)
    return (
      // <Fragment>
      //   <View style={{ flex: 1, backgroundColor: '#fff', border: 0 }}>
      //     <View style={{
      //       flex: 1, border: 0
      //     }}>
      //       <AppWithNavigationState screenProps={{ towerLogoUrl: this.props.towerLogoUrl, badge: this.props.badge }}
      //         state={nav}
      //         dispatch={dispatch} />

      //       {/* <ModalLogOut /> */}
      //       {isLoading && <View style={{ position: 'absolute', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appOverView }}>
      //         <ActivityIndicator animating size="small" color={colors.appTheme} />
      //       </View>}

      //     </View>
      //   </View>
      // </Fragment>
      <Tab nav={nav.routes[nav.routes.length - 1].routeName}
        dispatch={dispatch}
        onPress={(routeName) => this.navigationActions(routeName)}
        badge={this.props.badge}
        dataMenus={this.props.dataMenus}
        towerLogoUrl={this.props.towerLogoUrl}
        isLoading={isLoading}
        type={this.props.auth.type}
      />
    );
  }
  async onCheckNetwork() {
    await NetInfo.isConnected
      .fetch()
      .then()
      .done((isConnected) => this.setState({ isConnected }));
  }
  handleConnectionChange(isConnected) {
    this.setState({ isConnected: isConnected });
  }
  getCurrentRouteName(navState) {
    if (Object.prototype.hasOwnProperty.call(navState, "index")) {
      return this.getCurrentRouteName(navState.routes[navState.index]);
    }
    return navState.routeName;
  }
}

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
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
    height: 60,
    marginTop: 5,
    backgroundColor: '#fff'
  },
  container: {
    //flex: 1,
    //flexDirection: "column"
  },
  Svg: {
    width: width,
    height: 65,
    position: "absolute",
    backgroundColor: '#fff'
    //bottom: Devices.isTablet ? -60 : -20,
    //left: Platform.isPad ? -(Screen.width / 10 - responsive.h(8.5)) : 0,
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

const mapStateToProps = (state) => ({
  nav: state.nav,
  towerLogoUrl: state.auth.user ? state.auth.user.towerLogoUrl : "",
  isLoading: state.app.isLoading,
  message: state.notification.message,
  language: state.app.language,
  badge: state.badge,
  user: state.auth.user,
  auth: state.auth,
});

export default connect(mapStateToProps)(ReduxNavigation);
