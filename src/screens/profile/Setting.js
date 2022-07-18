import React, { Component } from 'react';
import { connect } from 'react-redux';
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
  TouchableWithoutFeedback
} from 'react-native';

import fontsize from '../../theme/fontsize';
import Color from '../../theme/colors';
import { flag_en, flag_vn } from '../../theme/images';
import colors from '../../theme/colors';
import LanguageItem from '../../components/profile/LanguageItem';
import { resetStateByKey } from '../../actions/app';
import { MyIcon } from '../../theme/icons';
import Strings from '../../utils/languages';
import NavBar from '../../resident/components/common/NavBar';



class SettingScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: Strings.setting.language.toLocaleUpperCase(),
    headerBackTitle: null,
    headerTintColor: '#fff',
    headerStyle: {
      backgroundColor: colors.appTheme,
      elevation: 0,
      borderBottomColor: 'transparent',
      borderBottomWidth: 0
    },
  })

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
    this.props.resetStateByKey({ key: value })
  }



  render() {
    const languageValue = this.props.language == 'vi' ? 0 : 1
    const leftButton = (
      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={() => this.props.navigation.goBack(null)}
      >
        <MyIcon
          name="arrow"
          size={22}
          color="#fff"
        />
      </TouchableOpacity>
    )
    return (
      <View style={styles.container}>
        <NavBar leftButton={leftButton}
          body={<Text style={{
            alignSelf: 'center', fontFamily: "Inter-Bold",
            fontSize: 20,
            fontWeight: "bold",
            fontStyle: "normal",
            letterSpacing: 0,
            textAlign: "center",
            color: "#ffffff"
          }}>{Strings.profile.setting}</Text>}
          rightView={
            <View style={{ padding: 10 }}>
              <MyIcon
                name="arrow"
                size={22}
                color={colors.appTheme}
              />
            </View>
          }
        />
        <ScrollView style={{ borderTopRightRadius: 20, marginTop: -20 }}>

          <Text style={{ marginLeft: 10, marginVertical: 10, fontFamily: "Inter-Bold",
                    fontSize: 20,
                    fontWeight: "bold",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    color: "#282828" }}>{Strings.setting.language}</Text>

          <View style={{ backgroundColor: 'white' }}>
            <LanguageItem value={1} currentValue={languageValue} text="ENGLISH" icon={flag_en} onValueChange={this.onLanguageValueChange} />
            <LanguageItem value={0} currentValue={languageValue} text="TIẾNG VIỆT" icon={flag_vn} onValueChange={this.onLanguageValueChange} />
          </View>
        </ScrollView>
      </View>

    );
  }

  onLanguageValueChange = (value) => {
    this.props.resetStateByKey({ language: value == 0 ? 'vi' : 'en' })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10
  }
});

const mapStateToProps = state => ({
  user: state.auth.user,
  enableVibrate: state.app.enableVibrate,
  enableSound: state.app.enableSound,
  enableNotification: state.app.enableNotification,
  language: state.app.language,
  isLoading: state.auth.isLoading
});
const mapActionToState = {
  resetStateByKey
};

export default connect(mapStateToProps, mapActionToState)(SettingScreen);
