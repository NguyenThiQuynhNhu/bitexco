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
  SafeAreaView,
  StatusBar
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
  demo,
  getOtpCodeHaveType,
  loginUser,
  changePhone,
  resetStateByKey,
  loginUserByPass,
  getOtpCodeNoType,
  setTypeResident,
  setTypeVendor,
  loginUserByPassVendor,
  loginUserByPassResident,
  signIn,
} from "../../actions/auth";
import { loadDataHandle as getBuilding } from "../../actions/building";
import axios from "axios";
import { get, helper, post } from "../../services/helper";
import { checkVersion } from "../../resident/actions/auth";
import UpdateVersion from "../../components/common/UpdateVersion";
const Devices = require("react-native-device-detection");
import LinearGradient from "react-native-linear-gradient";
import responsive from "../../resources/responsive";
// create a component
class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber:
        this.props.navigation.state.params &&
          this.props.navigation.state.params.phoneNumber
          ? this.props.navigation.state.params.phoneNumber
          : this.props.user,
      password:
        this.props.navigation.state.params &&
          this.props.navigation.state.params.password
          ? this.props.navigation.state.params.password
          : this.props.pass,
      otpCode: "",
      isPass: true,
      isRegister: false,
      passwordRetype: "",
      choiceType: false,
      isLoading: false,
      //isType: false
    };
  }
  componentDidMount() {
    this.props.checkVersion();
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps &&
      nextProps.error &&
      nextProps.error.hasError &&
      this.props.error !== nextProps.error
    ) {
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
          message = nextProps.error.message;
          break;
      }
      Alert.alert("Thông báo", message);
    }
  }
  // componentWillUnmount() {
  //     console.log('componentWillUnmount')
  //     this.props.resetStateByKey({ key: 'state' })
  // }
  renderBody() {
    const {
      navHome,
      getOtpCode,
      changePhone,
      loginUser,
      loginUserByPass,
      type,
    } = this.props;
    //console.log('this.props', this.props)
    const {
      phoneNumber,
      otpCode,
      isPass,
      password,
      isType,
      passwordRetype,
      isRegister,
    } = this.state;
    switch (this.props.content) {
      case "LOGIN":
        return (
          <BodyContent
            onSubmitEditing={() => getOtpCodeNoType(this.state.phoneNumber)}
            placeholderInput={Strings.login.phone}
            title={Strings.login.title}
            titleRegister="Đăng ký tài khoản!"
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
            onPress={() => loginUser({ phoneNumber, type, otpCode })}
            onFulfill={(code) =>
              loginUser({ phoneNumber, type, otpCode: code })
            }
          />
        );
      case "SELECT_TYPE":
        return (
          <BodyContent
            isType={true}
            settingText
            isLoginByPass={isPass}
            // showIcon={false}
            //textButton={Strings.login.button2}
            // placeholderInput={Strings.login.code}
            title="Vui lòng chọn loại người dùng mà bạn muốn sử dụng!"
            changePhone={() => {
              this.setState({ choiceType: false }),
                changePhone({ phoneNumber, otpCode });
            }}
            onPressResident={this._onRequestOTPResident}
            onPressVendor={this._onRequestOTPVendor}
            choiceType={this.state.choiceType}
            // onPress={() => loginUser({ phoneNumber, otpCode })}
            onFulfill={(code) =>
              this.setState({ choiceType: true, otpCode: code })
            }
          />
        );
      default:
        return <ActivityIndicator />;
    }
  }
  render() {
    const { isLoading } = this.props;
    console.log("this.props", this.props);
    return (
      <View>
        {
          Platform.OS != 'ios' &&
          <SafeAreaView
            style={{ flex: 0, backgroundColor: "transparent", border: 0 }}
          />
        }
        {
          Platform.OS != 'ios' &&
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent={true}
          />
        }

        <UpdateVersion version={this.props.version} />
        <Image
          source={require("../../resources/bitexcoGroup.png")}
          style={{
            width: Screen.width,
            height: responsive.h(300),
            // position: "absolute",
            // resizeMode: "stretch",
            // top: 0,
            marginBottom: responsive.h(10),
          }}
        />

        <View
          style={{
            width: Screen.width,
            height: Screen.height,
            // justifyContent: "center",
            // alignItems: "center",
          }}
        >
          {/* <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={20}> */}
          <View
            style={{
              width: Screen.width,
              justifyContent: "center",
              alignItems: "center",
              marginTop: responsive.h(30),
            }}
          >
            {/* <Image
                  source={logo}
                  style={{
                    width: Devices.isTablet ? 180 : 160,
                    height: Devices.isTablet ? 180 : 160,
                    resizeMode: "contain",
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: colors.appTheme,
                    marginBottom: 40,
                  }}
                /> */}

            {isLoading || this.state.isLoading ? (
              <ActivityIndicator />
            ) : (
              this.renderBody()
            )}
          </View>
          {/* </KeyboardAvoidingView> */}
        </View>
        {/* <View style={{
                    width: Screen.width,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 20,
                }}>
                    <Text style={{
                        fontFamily: "OpenSans-Regular",
                        fontSize: 10,
                        color: "#a0a0a0",
                        textAlign: 'center'
                    }}>Version 1.0 </Text>
                    <Text style={{
                        fontFamily: "OpenSans-Regular",
                        fontSize: 10,
                        color: "#a0a0a0",
                        textAlign: 'center'
                    }}>© 2021 DIP Vietnam. All rights reserved.</Text>
                </View> */}

        {/* <View>
                    <ImageBackground source={require('../../resources/Vector.png')} style={{
                        width: Screen.width,
                        height: Devices.isTablet ? 712 : 412, resizeMode: "contain"
                    }}>
                    </ImageBackground>
                    <UpdateVersion version={this.props.version} />
                    <KeyboardAwareScrollView style={{ top: Devices.isTablet ? -(712/2) : -240 }}>

                        <View
                            style={{
                                minHeight: Devices.isTablet ? Screen.height - 450: Screen.height -300,
                                flex: 1,
                                backgroundColor: '#fff',
                                justifyContent: 'space-between',
                            }}
                        >

                            <Image
                                source={logo}
                                style={{
                                    width: Devices.isTablet ? 180 : 160,
                                    height: Devices.isTablet ? 180 : 160,
                                    resizeMode: 'contain'
                                }}
                            />
                            <View style={{ flex: 1, justifyContent: 'center', marginBottom: 5 }}>
                                {(isLoading || this.state.isLoading) ? <ActivityIndicator /> : this.renderBody() }
                            </View>
                            <Text style={{
                                fontFamily: "OpenSans-Regular",
                                fontSize: 10,
                                color: "#a0a0a0"
                            }}>Version 1.3 </Text>
                            <Text style={{
                                fontFamily: "OpenSans-Regular",
                                fontSize: 10,
                                color: "#a0a0a0"
                            }}>© 2021 DIP Vietnam. All rights reserved.</Text>
                        </View>
                    </KeyboardAwareScrollView>
                </View> */}
      </View>
    );
  }

  _onRequestOTP = () => {
    const { phoneNumber, password } = this.state;
    //console.log('phoneNumber', phoneNumber)
    if (phoneNumber.length == 0) {
      Alert.alert(Strings.tabbar.notification, Strings.login.emptyPhone);
    } else {
      this.props.getOtpCodeNoType(phoneNumber);
    }
  };
  _onRequestOTPResident = () => {
    const { phoneNumber, password, isPass, otpCode } = this.state;
    if (phoneNumber.length == 0) {
      Alert.alert(Strings.tabbar.notification, Strings.login.emptyPhone);
    }
    // else if(otpCode.length == 0){
    //     Alert.alert(Strings.tabbar.notification, Strings.login.emptyOtp);
    // }
    else {
      this.props.setTypeResident(this.props.typeList);
      if (isPass) {
        this.props.loginUserByPassResident({
          phoneNumber,
          password,
          type: "re",
          idNew: this.props.idNew,
        });
      } else {
        if (otpCode.length == 0) {
          Alert.alert(Strings.tabbar.notification, Strings.login.emptyOtp);
        } else {
          this.props.loginUser({ phoneNumber, type: "re", otpCode: otpCode });
        }
      }
    }
  };
  _onRequestOTPVendor = () => {
    const { phoneNumber, password, isPass, otpCode } = this.state;
    //console.log('phoneNumber', phoneNumber)
    if (phoneNumber.length == 0) {
      Alert.alert(Strings.tabbar.notification, Strings.login.emptyPhone);
    }
    // else if(otpCode.length == 0){
    //     Alert.alert(Strings.tabbar.notification, Strings.login.emptyOtp);
    // }
    else {
      this.props.setTypeVendor(this.props.typeList);
      if (isPass) {
        this.props.loginUserByPassVendor({
          phoneNumber,
          password,
          type: "em",
          idNew: this.props.idNew,
        });
      } else {
        if (otpCode.length == 0) {
          Alert.alert(Strings.tabbar.notification, Strings.login.emptyOtp);
        } else {
          this.props.loginUser({ phoneNumber, type: "em", otpCode: otpCode });
        }
      }
    }
  };
  goCase = () => {
    //console.log(this.state.isPass)
    let value = this.state.isPass == true ? false : true;
    this.setState({ isPass: value });
  };
  _onLoginBypass = async () => {
    this.setState({ isLoading: true });
    const { phoneNumber, password } = this.state;
    //console.log('this.state', phoneNumber)
    //if(helper.URL_API == 'https://apimyhome.dip.vn/api'){
    const isPersonal =
      helper.URL_API == "https://apimyhome.dip.vn/api" ? false : true;
    if (phoneNumber.length == 0 || password.length == 0) {
      Alert.alert(Strings.tabbar.notification, Strings.login.emptyPass);
      this.setState({ isLoading: false });
    } else {
      try {
        let ret = await axios.post(
          `${helper.URL_API}/User/GetBuilding?isPersonal=${isPersonal}`,
          {
            userName: phoneNumber,
            password: password,
          }
        );
        //console.log(ret);
        if (ret !== undefined && ret !== null) {
          if (ret.status == 200) {
            if (ret.data.length > 0) {
              // if (ret.data.length == 1) {
              //   this.setState({ isLoading: false });
              //   this.props.loginUserByPass({
              //     phoneNumber: phoneNumber,
              //     password: password,
              //     idNew: ret.data[0].id,
              //   });
              // } else {
              //   //console.log(this.state.isLoading)
              //   this.setState({ isLoading: false });
              //   this.props.navigation.navigate("building", {
              //     phoneNumber,
              //     password,
              //   });
              // }
              this.setState({ isLoading: false });
              this.props.loginUserByPass({
                phoneNumber: phoneNumber,
                password: password,
                idNew: ret.data[0].id,
              });
            } else {
              this.setState({ isLoading: false });
              Alert.alert(
                "Thông báo",
                "Số điện thoại hoặc mật khẩu không đúng!"
              );
            }
          } else {
            this.setState({ isLoading: false });
            //
            switch (ret.status.message) {
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
                message = ret.status.message;
                break;
            }
            Alert.alert("Thông báo", message);
          }
        } else {
          this.setState({ isLoading: false });
          //
          switch (ret.status.message) {
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
              message = ret.status.message;
              break;
          }
          Alert.alert("Thông báo", message);
        }
      } catch (error) {
        console.log(error);
        this.setState({ isLoading: false });
        //
        switch (ret.status.message) {
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
            message = ret.status.message;
            break;
        }
        Alert.alert("Thông báo", message);
      }

      //this.props.loginUserByPass({phoneNumber, password})
    }
    // }else{
    //     if (phoneNumber.length == 0 || password.length == 0) {
    //         Alert.alert(Strings.tabbar.notification, Strings.login.emptyPass);
    //     } else {
    //         this.props.loginUserByPass({phoneNumber, password})
    //     }
    // }
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
  yinyang: {},
  yinyangMain: {
    width: responsive.h(100),
    height: responsive.h(100),
    borderColor: "red",
    borderTopWidth: responsive.h(2),
    borderLeftWidth: responsive.h(2),
    borderBottomWidth: responsive.h(50),
    borderRightWidth: responsive.h(2),
    borderRadius: responsive.h(50),
  },
  yinyangBefore: {
    position: "absolute",
    top: responsive.h(24),
    left: 0,
    borderColor: "red",
    borderWidth: responsive.h(24),
    borderRadius: responsive.h(30),
  },
  yinyangAfter: {
    position: "absolute",
    top: responsive.h(24),
    right: responsive.h(2),
    backgroundColor: "red",
    borderColor: "white",
    borderWidth: responsive.h(25),
    borderRadius: responsive.h(30),
  },
});
const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading,
  error: state.auth.error,
  content: state.auth.content,
  type: state.auth.type,
  typeList: state.auth.typeList,
  connectString: state.auth.connectString,
  idNew: state.auth.idNew,
  version: state.version.version,
  pass: state.user.pass,
  user: state.user.user
});
const mapActionToProps = {
  navHome,
  getOtpCodeHaveType,
  changePhone,
  loginUser,
  resetStateByKey,
  loginUserByPass,
  getOtpCodeNoType,
  setTypeResident,
  setTypeVendor,
  loginUserByPassResident,
  loginUserByPassVendor,
  signIn,
  demo,
  getBuilding,
  checkVersion,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(LoginScreen);
