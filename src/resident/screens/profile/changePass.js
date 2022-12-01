import React, { Component } from "react";
import { connect } from "react-redux";
import Toast, { DURATION } from "react-native-easy-toast";
import {
  Alert,
  ScrollView,
  View,
  Text,
  Switch,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
} from "react-native";

import Color from "../../theme/colors";
import { flag_en, flag_vn } from "../../theme/images";
import colors from "../../theme/colors";
import LanguageItem from "../../components/profile/LanguageItem";
import { changePass } from "../../../actions/auth";
import { MyIcon } from "../../theme/icons";
import Strings from "../../utils/languages";
import ImageProgress from "../../components/common/ImageProgress";
import ErrorContent from "../../components/common/ErrorContent";
import CheckBox from "../../components/common/CheckBox";
import PrimaryButton from "../../components/common/PrimaryButton";
import fontsize from "../../theme/fontsize";
import NavBar from "../../components/common/NavBar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Screen } from "../../utils/device";
import { getProfile } from "../../actions/auth";
import responsive from "../../../resources/responsive";
class ChangePassScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      password: "",
      passwordRetype: "",
    };
  }
  componentDidMount() {
    this.props.navigation.dispatch({ type: "CHANGEPASS_START" });
  }
  async componentWillReceiveProps(nextProps) {
    // console.log(this.props)
    // console.log(nextProps)
    if (nextProps.error && nextProps.error !== this.props.error) {
      if (nextProps.error.hasError) {
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
    if (
      !nextProps.isLoading &&
      nextProps.content == "CHANGEPASS_SUCCESS" &&
      nextProps.content !== this.props.content
    ) {
      await Alert.alert(Strings.message.alert, "Thành công");
      await this.props.getProfile({ type: "re", langId: this.props.langId, towers: this.props.user.towers });
      await this.props.navigation.goBack();
    }
  }

  _onChange = () => {
    const { phoneNumber, password, passwordRetype } = this.state;
    console.log("this.state", phoneNumber);
    if (
      phoneNumber.length == 0 ||
      password.length == 0 ||
      passwordRetype.length == 0
    ) {
      Alert.alert(Strings.tabbar.notification, Strings.login.notify1);
    } else if (password !== passwordRetype) {
      Alert.alert(Strings.tabbar.notification, Strings.login.notify2);
    } else {
      this.props.changePass({ phoneNumber, password });
    }
  };

  render() {
    const { phoneNumber, password, passwordRetype } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <NavBar
          leftButton={
            this.props.user &&
            this.props.user.isChangePass && (
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{
                  padding: responsive.h(10), paddingHorizontal: responsive.h(12)
                }}
              >
                <MyIcon name="arrow" color="black" size={responsive.h(20)} />
              </TouchableOpacity>
            )
          }
          body={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(20),
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "black",
                }}
              >
                {Strings.login.changePass}
              </Text>
            </View>
          }
          rightView={
            <TouchableOpacity
              style={{ padding: responsive.h(10), paddingHorizontal: responsive.h(12) }}
            >
              <MyIcon name="arrow" color="transparent" size={responsive.h(20)} />
            </TouchableOpacity>
          }
        />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            //justifyContent: 'center',
            padding: responsive.h(20),
          }}
        >
          {/* <MyIcon
              name="profile"
              size={100}
              color={colors.appTheme}
              style={{marginTop: 20, marginBottom: 20}}
          /> */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: responsive.h(0.5),
              borderColor: "#cccccc",
              marginBottom:
                Platform.OS === "ios" ? responsive.h(20) : responsive.h(10),
            }}
          >
            <TextInput
              style={{
                flex: 1,
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(16),
                fontWeight: "normal",
                fontStyle: "normal",
                padding: responsive.h(5),
                letterSpacing: 0,
                textAlign: "left",
                color: "#262626",
              }}
              autoCapitalize="none"
              autoFocus={false}
              keyboardType="phone-pad"
              autoCorrect={false}
              maxLength={15}
              value={phoneNumber}
              onChangeText={(text) => this.setState({ phoneNumber: text })}
              placeholder={Strings.login.phone}
              placeholderTextColor="#666666"
              underlineColorAndroid="transparent"
              //onSubmitEditing={onSubmitEditing}
            />
            <MyIcon name="phone" size={responsive.h(18)} color="#666666" />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 0.5,
              borderColor: "#cccccc",
              marginBottom:
                Platform.OS === "ios" ? responsive.h(20) : responsive.h(10),
            }}
          >
            <TextInput
              style={{
                flex: 1,
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(16),
                fontWeight: "normal",
                padding: responsive.h(5),

                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#262626",
              }}
              autoCapitalize="none"
              autoFocus={false}
              //keyboardType="phone-pad"
              autoCorrect={false}
              //maxLength={15}
              value={password}
              onChangeText={(password) => this.setState({ password: password })}
              placeholder={Strings.login.passwordNew}
              placeholderTextColor="#666666"
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              //onSubmitEditing={onSubmitEditing}
            />
            <MyIcon name="password2" size={responsive.h(18)} color="#666666" />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 0.5,
              borderColor: "#cccccc",
              marginBottom:
                Platform.OS === "ios" ? responsive.h(20) : responsive.h(10),
            }}
          >
            <TextInput
              style={{
                flex: 1,
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(16),
                fontWeight: "normal",
                fontStyle: "normal",
                padding: responsive.h(5),

                letterSpacing: 0,
                textAlign: "left",
                color: "#262626",
              }}
              autoCapitalize="none"
              autoFocus={false}
              //keyboardType="phone-pad"
              autoCorrect={false}
              //maxLength={15}
              value={passwordRetype}
              onChangeText={(passwordRetype) =>
                this.setState({ passwordRetype: passwordRetype })
              }
              placeholder={Strings.login.passwordRetypeNew}
              placeholderTextColor="#666666"
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              //onSubmitEditing={onSubmitEditing}
            />
            <MyIcon name="password2" size={responsive.h(18)} color="#666666" />
          </View>
          <TouchableOpacity
            style={{
              marginTop: responsive.h(50),
              borderRadius: responsive.h(45),
              width: Screen.width * 0.8,
              height: responsive.h(40),
              backgroundColor: colors.appTheme,
              justifyContent: "center",
            }}
            onPress={() => this._onChange()}
          >
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(18),
                fontWeight: "600",
                fontStyle: "normal",
                lineHeight: responsive.h(28),
                letterSpacing: 0,
                textAlign: "center",
                color: "#ffffff",
              }}
            >
              {Strings.login.button1}
            </Text>
          </TouchableOpacity>
          {this.props.user && !this.props.user.isChangePass && (
            <Text
              style={{
                color: "red",
                fontStyle: "italic",
                marginHorizontal: responsive.h(20),
                marginVertical: responsive.h(40),
              }}
            >
              Đây là yêu cầu bắt buộc từ Ban quản lý tòa nhà. Vui lòng đổi mật
              khẩu để sử dụng các tiện ích khác!
            </Text>
          )}
        </View>
        {this.props.isLoading && <ActivityIndicator />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: responsive.h(10),
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  language: state.app.language,
  isLoading: state.auth.isLoading,
  error: state.auth.error,
  content: state.auth.content,
  langId: state.app.language == "vi" ? 1 : 2,
});
const mapActionToState = {
  changePass,
  getProfile,
};

export default connect(
  mapStateToProps,
  mapActionToState
)(ChangePassScreen);
