//import liraries
import React, { Component } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import firebase from "firebase";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";
import _ from "lodash";
import PrimaryButton from "../../components/common/PrimaryButton";
import colors from "../../theme/colors";
import { logo } from "../../theme/images";
import { BodyContent } from "../../components/Login/BodyContent";
import { Screen } from "../../utils/device";
import Strings from "../../utils/languages";
import { navHome } from "../../actions/nav";
import FontSize from "../../theme/fontsize";
import {
  getOtpCode,
  loginUser,
  changePhone,
  resetStateByKey,
  loginUserByPass,
  signIn,
} from "../../actions/auth";
import responsive from "../../../resources/responsive";
import fontsize from "../../theme/fontsize";

// create a component
class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      password: "",
      passwordRetype: "",
      otpCode: "",
      isPass: false,
      isRegister: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.error &&
      this.props.error !== nextProps.error &&
      nextProps.error.hasError
    ) {
      let message = "";
      switch (nextProps.error.message) {
        case "CODE_OTP_INVALID":
          message = Strings.message.CODE_OTP_INVALID;
          break;
        case "DATA_NOT_FOUND":
          message = Strings.message.DATA_NOT_FOUND;
          break;
        case "INVALID_ACCESS":
          message = Strings.message.INVALID_ACCESS;
          break;
        case "RESIDENTS_NOT_IN_THE_BUILDING":
          message = Strings.message.RESIDENTS_NOT_IN_THE_BUILDING;
          break;
        case "PASS_INVALID":
          message = Strings.message.PASS_INVALID;
          break;

        default:
          message = Strings.message.RESIDENTS_NOT_IN_THE_BUILDING;
          break;
      }

      Alert.alert(Strings.message.alert, message);
    }
  }
  renderBody() {
    const { navHome, getOtpCode, changePhone, loginUser } = this.props;
    const {
      phoneNumber,
      otpCode,
      isPass,
      password,
      passwordRetype,
      isRegister,
    } = this.state;
    switch (this.props.content) {
      case "LOGIN":
        return (
          <BodyContent
            onSubmitEditing={() => getOtpCode(this.state.phoneNumber)}
            placeholderInput={Strings.login.phone}
            title={Strings.login.title}
            titleRegister={Strings.login.titleRegister}
            textButton={Strings.login.button1}
            onPress={this._onRequestOTP}
            onPressByPass={this._onLoginBypass}
            onPressRegister={this._onRegister}
            onChangePhone={(text) => this.setState({ phoneNumber: text })}
            onChangePassword={(password) =>
              this.setState({ password: password })
            }
            onChangePasswordRetype={(passwordRetype) =>
              this.setState({ passwordRetype: passwordRetype })
            }
            isPass={isPass}
            goCase={this.goCase}
            valuePhone={phoneNumber}
            valuePass={password}
            valuePasswordRetype={passwordRetype}
            isRegister={isRegister}
            goRegister={this.goRegister}
          />
        );
      case "VERIFY":
        return (
          <BodyContent
            isCode={true}
            settingText
            showIcon={false}
            textButton={Strings.login.button2}
            placeholderInput={Strings.login.code}
            title={Strings.login.title2}
            changePhone={() => changePhone({ phoneNumber, otpCode })}
            reSendOtpCode={() => getOtpCode(this.state.phoneNumber)}
            phoneNumber={this.state.phoneNumber}
            onPress={() => loginUser({ phoneNumber, otpCode })}
            onFulfill={(code) => loginUser({ phoneNumber, otpCode: code })}
          />
        );
      default:
        return <ActivityIndicator />;
    }
  }
  render() {
    const { isLoading, content } = this.props;
    return (
      <KeyboardAwareScrollView>
        <View
          style={{
            height: Screen.height,
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image
            source={logo}
            style={{
              width: responsive.h(200),
              height: responsive.h(200),
            }}
          />
          <View style={{ flex: 1, justifyContent: "center" }}>
            {!isLoading ? this.renderBody() : <ActivityIndicator />}
          </View>
          {content === "LOGIN" ? (
            <Text
              style={{
                marginBottom: responsive.h(10),
                fontSize: responsive.h(fontsize.micro),
              }}
            >
              © 2021 DIP Vietnam. All rights reserved.
            </Text>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    );
  }
  _onRequestOTP = () => {
    const { phoneNumber } = this.state;
    if (phoneNumber.length == 0) {
      Alert.alert(Strings.tabbar.notification, Strings.login.emptyPhone);
    } else {
      this.props.getOtpCode(phoneNumber);
    }
  };
  goCase = () => {
    let value = this.state.isPass == true ? false : true;
    this.setState({ isPass: value });
  };
  _onLoginBypass = () => {
    const { phoneNumber, password } = this.state;
    if (phoneNumber.length == 0 || password.length == 0) {
      Alert.alert(Strings.tabbar.notification, Strings.login.emptyPass);
    } else {
      this.props.loginUserByPass({ phoneNumber, password });
    }
  };
  _onRegister = () => {
    const { phoneNumber, password, passwordRetype } = this.state;
    if (
      phoneNumber.length == 0 ||
      password.length == 0 ||
      passwordRetype.length == 0
    ) {
      Alert.alert(Strings.tabbar.notification, Strings.login.notify1);
    } else if (password !== passwordRetype) {
      Alert.alert(Strings.tabbar.notification, Strings.login.notify2);
    } else {
      this.props.signIn({ phoneNumber, password });
    }
  };
  goRegister = () => {
    let value = this.state.isRegister == true ? false : true;
    this.setState({ isRegister: value });
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
  },
});
const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading,
  error: state.auth.error,
  content: state.auth.content,
});
const mapActionToProps = {
  navHome,
  getOtpCode,
  changePhone,
  loginUser,
  resetStateByKey,
  loginUserByPass,
  signIn,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(LoginScreen);
