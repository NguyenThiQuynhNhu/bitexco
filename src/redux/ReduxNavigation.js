import React, { Fragment, Component } from "react";
import {
  BackHandler,
  Alert,
  View,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import AppWithNavigationState from "../navigators/AppNavigators";
import Strings from "../utils/languages";
import Strings1 from "../resident/utils/languages";
import colors from "../theme/colors";
import Device from "../utils/device";
import ModalLogOut from "../components/common/ModalLogOut";
import LinearGradient from "react-native-linear-gradient";
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
    //console.log('nav',this.props)
    return (
      <Fragment>
        <View style={{ flex: 1, backgroundColor: '#fff', border: 0 }}>
          <View style={{
            flex: 1, border: 0
          }}>
            <AppWithNavigationState screenProps={{ towerLogoUrl: this.props.towerLogoUrl, badge: this.props.badge }}
              state={nav}
              dispatch={dispatch} />

            {/* <ModalLogOut /> */}
            {isLoading && <View style={{ position: 'absolute', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appOverView }}>
              <ActivityIndicator animating size="small" color={colors.appTheme} />
            </View>}

          </View>
        </View>
      </Fragment>
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
});

const mapStateToProps = (state) => ({
  nav: state.nav,
  towerLogoUrl: state.auth.user ? state.auth.user.towerLogoUrl : "",
  isLoading: state.app.isLoading,
  message: state.notification.message,
  language: state.app.language,
  badge: state.badge,
});

export default connect(mapStateToProps)(ReduxNavigation);
