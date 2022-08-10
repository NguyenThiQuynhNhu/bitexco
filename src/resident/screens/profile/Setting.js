import React, { Component } from "react";
import { connect } from "react-redux";
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
} from "react-native";

import FontSize from "../../theme/fontsize";
import Color from "../../theme/colors";
import { flag_en, flag_vn } from "../../theme/images";
import colors from "../../theme/colors";
import LanguageItem from "../../components/profile/LanguageItem";
import { resetStateByKey } from "../../actions/app";
import { MyIcon } from "../../theme/icons";
import Strings from "../../utils/languages";
import NavBar from "../../components/common/NavBar";
import { getProfile } from "../../actions/auth";
import fontsize from "../../theme/fontsize";
import responsive from "../../../resources/responsive";
class SettingScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      enableSound: props.enableSound,
      enableVibrate: props.enableVibrate,
      enableNotification: props.enableNotification,
      language: props.language,
      value: 0,
    };
  }

  onValueChange(key, value) {
    this.props.resetStateByKey({ key, path: "", value });
  }

  render() {
    const languageValue = this.props.language == "vi" ? 0 : 1;
    return (
      <View style={styles.container}>
        <ScrollView>
          <NavBar
            leftButton={
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{ paddingVertical: responsive.h(10) }}
              >
                <MyIcon name="arrow" color="#fff" size={responsive.h(20)} />
              </TouchableOpacity>
            }
            body={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(20),
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "center",
                  color: "#ffffff",
                }}
              >
                <Text
                  style={{
                    fontSize: responsive.h(fontsize.medium),
                    color: "#fff",
                  }}
                >
                  {Strings.setting.language}
                </Text>
              </View>
            }
            rightView={
              <View style={{ paddingVertical: responsive.h(10) }}>
                <MyIcon
                  name="arrow"
                  size={responsive.h(22)}
                  color={colors.appTheme}
                />
              </View>
            }
          />
          <Text
            style={{
              marginLeft: responsive.w(10),
              marginVertical: responsive.h(10),
              fontFamily: "Inter-Bold",
              fontSize: responsive.h(14),
              fontWeight: "bold",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "center",
              color: "#ffffff",
            }}
          >
            {Strings.setting.language}
          </Text>

          <View style={{ backgroundColor: "white" }}>
            <LanguageItem
              value={1}
              currentValue={languageValue}
              text="ENGLISH"
              icon={flag_en}
              onValueChange={this.onLanguageValueChange}
            />
            <LanguageItem
              value={0}
              currentValue={languageValue}
              text="TIẾNG VIỆT"
              icon={flag_vn}
              onValueChange={this.onLanguageValueChange}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  onLanguageValueChange = (value) => {
    this.props.resetStateByKey({
      key: "language",
      value: value == 0 ? "vi" : "en",
    });
    this.props.getProfile({ type: "re", langId: value == 0 ? 1 : 0 });
  };
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
  enableVibrate: state.app.enableVibrate,
  enableSound: state.app.enableSound,
  enableNotification: state.app.enableNotification,
  language: state.app.language,
  isLoading: state.auth.isLoading,
});
const mapActionToState = {
  resetStateByKey,
  getProfile,
};

export default connect(
  mapStateToProps,
  mapActionToState
)(SettingScreen);
