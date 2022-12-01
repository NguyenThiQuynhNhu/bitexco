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
import ErrorContent from "../../components/common/ErrorContent";
import ImageProgress from "../../components/common/ImageProgress";
import NavBar from "../../resident/components/common/NavBar";
import { MyIcon } from "../../theme/icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  loadDataHandle as loadDataHandleBuilding,
} from "../../resident/actions/departmentDetail";
import responsive from "../../resources/responsive";
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
    this.props.loadDataHandleBuilding();
  }
  async componentWillReceiveProps(nextProps) {
  }
  // componentWillUnmount() {
  //     console.log('componentWillUnmount')
  //     this.props.resetStateByKey({ key: 'state' })
  // }
  _onSelect(item) {
  }
  renderItem = ({ item, index }) => {
    const { name, logo } = item;
    return (
      <TouchableOpacity
        onPress={() => this._onSelect(item)}
        style={{
          flex: 1,
          marginHorizontal: responsive.h(20),
          marginBottom: responsive.h(10),
          marginTop: responsive.h(10),
          borderRadius: responsive.h(12),
          backgroundColor: "#ffffff",
          borderWidth: 0.5,
          borderColor: "#eaeaea",
        }}
      >
        <View style={{ flexDirection: "row", padding: responsive.h(10) }}>
          <ImageProgress
            circle
            source={{ uri: logo }}
            style={{ height: responsive.h(70), width: responsive.h(70) }}
          />
          <View style={{ flex: 1, marginLeft: responsive.h(10), justifyContent: "center" }}>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: fontsize.medium,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: colors.appTheme,
              }}
            >
              {name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const { isLoading, data } = this.props;
    console.log(this.props)
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
                  fontSize: responsive.h(20),
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
              style={{ padding: responsive.h(10) }}
            >
              <MyIcon name="arrow" color="black" size={responsive.h(20)} />
            </TouchableOpacity>
          }
          rightView={
            <TouchableOpacity
              style={{ padding: responsive.h(10), paddingHorizontal: responsive.h(12) }}
            >
              <MyIcon name="arrow" color="transparent" size={responsive.h(20)} />
            </TouchableOpacity>
          }
        />
        {this.renderContent()}
      </View>
    );
  }
  renderContent() {
    const { data, isLoading, error, initComponent, user } = this.props;
    if (initComponent || isLoading) {
      return <View
        style={{
          paddingVertical: responsive.h(20),
        }}
      >
        <ActivityIndicator animating size='small' />
      </View>;
    } else if (error && error.hasError) {
      return <ErrorContent
        title={Strings.app.error}
        onTouchScreen={() => this.props.loadDataHandle()}
      />;
    } else if (data == null || (data != null && data.length == 0)) {
      return <ErrorContent title={Strings.app.emptyData} />;
    } else {
      return (
        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `${index}`}
        />
      );
    }
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
  // initList: state.building.initList,
  // isLoading: state.building.isLoading,
  // error: state.building.error,
  // emptyData: state.building.emptyData,
  // data: state.building.data,
  // isRefreshing: state.building.isRefreshing,
  initComponent: state.departmentDetail.initComponent,
  data: state.departmentDetail.data,
  error: state.departmentDetail.error,
  errorProgress: state.departmentDetail.errorProgress,
  language: state.app.language,
  isLoading: state.departmentDetail.isLoading,
  auth: state.auth,
});
const mapActionToProps = {
  loadDataHandleBuilding
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(BuildingScreen);
