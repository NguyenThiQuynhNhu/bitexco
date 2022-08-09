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
  FlatList,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";
import _ from "lodash";
import PrimaryButton from "../../components/common/PrimaryButton";
import colors from "../../theme/colors";
import { logo } from "../../theme/images";
import { Screen } from "../../utils/device";
import Strings from "../../resident/utils/languages";
import { navHome } from "../../actions/nav";
import fontsize from "../../theme/fontsize";
import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
} from "../../actions/building";
import ImageProgress from "../../components/common/ImageProgress";
import NavBar from "../../resident/components/common/NavBar";
import { MyIcon } from "../../theme/icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  getOtpCodeHaveType,
  loginUser,
  changePhone,
  loginUserByPass,
  getOtpCodeNoType,
  setTypeResident,
  setTypeVendor,
  loginUserByPassVendor,
  loginUserByPassResident,
} from "../../actions/auth";
// create a component
class BuildingScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      password: "",
      otpCode: "",
      isPass: false,
      isRegister: false,
      passwordRetype: "",
      choiceType: false,
      //isType: false
    };
  }
  componentDidMount() {
    this.props.resetStateByKey({ key: "initList", path: "", value: true });
  }
  async componentWillReceiveProps(nextProps) {
    const { isRefreshing, initList, refreshDataHandle } = this.props;
    if (nextProps.isRefreshing && nextProps.isRefreshing !== isRefreshing) {
      if (this.props.navigation.state.params) {
        this.props.loadDataHandle(this.props.navigation.state.params);
      }
    }
    if (nextProps.initList && nextProps.initList !== initList) {
      if (this.props.navigation.state.params) {
        await this.props.loadDataHandle(this.props.navigation.state.params);
        // if(nextProps.data.length == 1){
        //     await this._onSelect(nextProps.data[0])
        // }
      }
    }
  }
  // componentWillUnmount() {
  //     console.log('componentWillUnmount')
  //     this.props.resetStateByKey({ key: 'state' })
  // }
  _onSelect(item) {
    this.props.navigation.navigate("login", {
      phoneNumber: this.props.navigation.state.params.phoneNumber,
      password: this.props.navigation.state.params.password,
    });
    this.props.loginUserByPass({
      phoneNumber: this.props.navigation.state.params.phoneNumber,
      password: this.props.navigation.state.params.password,
      idNew: item.id,
    });
    //this.props.loginUserByPass({phoneNumber: this.props.navigation.state.params.phoneNumber, password: this.props.navigation.state.params.password, connectString: this.props.auth.connectString})
  }
  renderItem = ({ item, index }) => {
    const { building_Name, logo, building_Address, hotline } = item;
    return (
      <TouchableOpacity
        onPress={() => this._onSelect(item)}
        style={{
          flex: 1,
          marginHorizontal: 20,
          marginBottom: 10,
          marginTop: 10,
          borderRadius: 10,
          backgroundColor: "#ffffff",
          shadowColor: "rgba(0, 0, 0, 0.08)",
          elevation: 2,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowRadius: 12,
          shadowOpacity: 1,
        }}
      >
        <View style={{ flexDirection: "row", padding: 10 }}>
          <ImageProgress
            circle
            source={{ uri: logo }}
            style={{ height: 70, width: 70 }}
          />
          <View style={{ flex: 1, marginLeft: 10, justifyContent: "center" }}>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 16,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: colors.appTheme,
              }}
            >
              {building_Name}
            </Text>
            {hotline == "" || hotline == null ? null : (
              <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
                <Icon
                  name="phone"
                  size={20}
                  color="gray"
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 14,
                    fontWeight: "500",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#3d3d3d",
                  }}
                >
                  {hotline}
                </Text>
              </View>
            )}
            {building_Address == "" || building_Address == null ? null : (
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Icon
                  name="card-bulleted-outline"
                  size={20}
                  color="gray"
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 14,
                    fontWeight: "500",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#3d3d3d",
                  }}
                >
                  {building_Address}
                </Text>
              </View>
            )}

            {/* <Text style={{ marginVertical: 10, fontSize: fontsize.small }}>Hotline: {hotline}</Text>
                <Text style={{fontSize: fontsize.small}}>{Strings.setting.towerAddress}: {building_Address}</Text> */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const { isLoading, data } = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
        }}
      >
        <NavBar
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
                  fontSize: 20,
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "center",
                  color: "black",
                }}
              >
                {Strings.login.listBuilding}
              </Text>
            </View>
          }
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ paddingVertical: 10 }}
            >
              <MyIcon name="arrow" color="black" size={20} />
            </TouchableOpacity>
          }
        />

        <FlatList
          //ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
          style={{ marginTop: -10 }}
          data={data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
  },
});
const mapStateToProps = (state) => ({
  initList: state.building.initList,
  isLoading: state.building.isLoading,
  error: state.building.error,
  emptyData: state.building.emptyData,
  data: state.building.data,
  isRefreshing: state.building.isRefreshing,
  auth: state.auth,
});
const mapActionToProps = {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  loginUserByPass,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(BuildingScreen);
