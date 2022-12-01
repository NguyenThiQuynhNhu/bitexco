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
import { getRequestStatusTotal } from "../../../actions/request";
import { getRequestStatusTotal as getRequestStatusTotalResident } from "../../../resident/actions/request";
import {
  refreshDataHandle as refreshDataHandleExResident,
} from "../../../resident/actions/utilitiesServicesExtension";
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
        <NavBar
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                padding: responsive.h(10), paddingHorizontal: responsive.h(12)
              }}
            >
              <MyIcon name="arrow" color="#000" size={responsive.h(20)} />
            </TouchableOpacity>
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
                {Strings.setting.language}
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
        <ScrollView
          style={{
            marginTop: responsive.h(-10),
          }}
        >
          {/* <Text
            style={{
              marginLeft: responsive.h(10),
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
          </Text> */}

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
    console.log('onLanguageValueChange')
    
    this.props.resetStateByKey({
      key: "language",
      value: value == 0 ? "vi" : "en",
      language: value == 0 ? "vi" : "en",
    });
    if(this.props.auth.type == 'em'){
      this.props.getRequestStatusTotal({ towerId: this.props.user.towerId, langId: value == 0 ? 1 : 2 });
    }
    if(this.props.auth.type == 're'){
      this.props.getRequestStatusTotalResident({ towerId: this.props.user.towerId, langId: value == 0 ? 1 : 2 });
      this.props.getProfile({ type: "re", langId: value == 0 ? 1 : 0, towers: this.props.user.towers });
      this.props.refreshDataHandleExResident()
    }
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
  auth: state.auth,
  enableVibrate: state.app.enableVibrate,
  enableSound: state.app.enableSound,
  enableNotification: state.app.enableNotification,
  language: state.app.language,
  isLoading: state.auth.isLoading,
});
const mapActionToState = {
  resetStateByKey,
  getProfile,
  getRequestStatusTotal,
  getRequestStatusTotalResident,
  refreshDataHandleExResident
};

export default connect(
  mapStateToProps,
  mapActionToState
)(SettingScreen);
