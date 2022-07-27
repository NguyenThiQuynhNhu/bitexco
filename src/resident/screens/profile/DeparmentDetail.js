import React, { Component } from "react";
import { connect } from "react-redux";
import Toast, { DURATION } from "react-native-easy-toast";

import { Icon } from "react-native-elements";

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
} from "react-native";

import Color from "../../theme/colors";
import { flag_en, flag_vn } from "../../theme/images";
import colors from "../../theme/colors";
import LanguageItem from "../../components/profile/LanguageItem";
import {
  loadDataHandle,
  updateDepartmentDefault,
  onValueChange,
} from "../../actions/departmentDetail";
import { MyIcon } from "../../theme/icons";
import Strings from "../../utils/languages";
import ImageProgress from "../../components/common/ImageProgress";
import ErrorContent from "../../components/common/ErrorContent";
import CheckBox from "../../components/common/CheckBox";
import PrimaryButton from "../../components/common/PrimaryButton";
import fontsize from "../../theme/fontsize";
import NavBar from "../../components/common/NavBar";
import responsive from "../../../resources/responsive";
class DepartmentScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      language: props.language,
      value: 1,
    };
  }
  componentDidMount() {
    this.props.loadDataHandle();
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errorProgress &&
      nextProps.errorProgress !== this.props.errorProgress
    ) {
      if (nextProps.errorProgress.hasError) {
        this.refs.toast.show(Strings.message.saveError, DURATION.LENGTH_LONG);
      } else {
        this.refs.toast.show(Strings.message.saveSuccess, DURATION.LENGTH_LONG);
      }
    }
  }

  renderItem = ({ item, index }) => {
    const { address, id, items, logo, name, hotline } = item;
    return (
      <View
        style={{
          flex: 1,
          borderRadius: 16,
          backgroundColor: "#ffffff",
          borderWidth: 1,
          marginHorizontal: 20,
          marginVertical: 10,
          borderColor: "#e5e5e5",
        }}
      >
        <View style={{ flexDirection: "row", padding: 10 }}>
          <ImageProgress
            circle
            source={{ uri: logo }}
            style={{ height: 48, width: 48 }}
          />
          <View style={{ flex: 1, marginLeft: 10, justifyContent: "center" }}>
            <Text
              style={{
                color: colors.appTheme,
                fontFamily: "Inter-Bold",
                fontSize: 15,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                marginVertical: responsive.h(10),
                fontFamily: "Inter-Bold",
                fontSize: 14,
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#3d3d3d",
              }}
            >
              Hotline: {hotline}
            </Text>

            {/* <Text style={{ marginTop: 10 }}>{address}</Text> */}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            display: "flex",
          }}
        >
          <MyIcon
            name="place1"
            color="#fece1c"
            size={responsive.h(15)}
            style={{ lineHeight: 24, marginLeft: 10 }}
          />
          <Text
            style={{
              fontFamily: "Inter-Medium",
              fontSize: 14,
              fontWeight: "500",
              fontStyle: "normal",
              lineHeight: 24,
              letterSpacing: 0,
              textAlign: "left",
              color: "#3d3d3d",
              marginHorizontal: 10,
            }}
          >
            {Strings.setting.towerAddress}: {address}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <MyIcon
              name="place1"
              color="#fece1c"
              size={responsive.h(15)}
              style={{ lineHeight: 24 }}
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
                marginHorizontal: 10,
              }}
            >
              {Strings.department.code}
            </Text>
          </View>

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
            {Strings.department.default}
          </Text>
        </View>

        <FlatList
          scrollEnabled={false}
          data={items}
          ItemSeparatorComponent={() => (
            <View
              style={{
                marginHorizontal: 10,
                height: 1,
                backgroundColor: colors.gray2,
              }}
            />
          )}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => {
            const { id, name, isDefault } = item;
            return (
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 10,
                  marginBottom: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 14,
                    paddingLeft: responsive.w(25),
                    fontWeight: "500",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#3d3d3d",
                  }}
                >
                  {name}
                </Text>
                <CheckBox
                  value={isDefault}
                  onValueChange={() =>
                    this.props.onValueChange({ id, value: !isDefault })
                  }
                />
              </View>
            );
          }}
        />
      </View>
    );
  };
  render() {
    const { data, isLoading, error, initComponent, user } = this.props;
    if (initComponent || isLoading) {
      <View
        style={{
          paddingVertical: 20,
        }}
      >
        <ActivityIndicator animating size="small" />
      </View>;
    } else if (error && error.hasError) {
      <ErrorContent
        title={Strings.app.error}
        onTouchScreen={() => this.props.loadDataHandle()}
      />;
    } else if (data == null) {
      <ErrorContent title={Strings.app.emptyData} />;
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <NavBar
            body={
              <View>
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
                  {Strings.setting.departmentInfo}
                </Text>
              </View>
            }
            leftButton={
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{ padding: 10 }}
              >
                <MyIcon name="arrow" color="black" size={20} />
              </TouchableOpacity>
            }
          />
          <FlatList
            //ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
            data={data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => `${index}`}
          />
          <PrimaryButton
            onPress={this.onSubmit}
            text={Strings.department.save}
            style={{
              marginBottom: 30,
              alignSelf: "center",
              padding: 10,
              width: "50%",
              backgroundColor: "#afaeae",
              height: 46,
              borderRadius: 20,
            }}
          />
          <Modal
            visible={this.props.progressing}
            onRequestClose={() => {}}
            transparent={true}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: colors.appOverView,
              }}
            >
              <ActivityIndicator />
            </View>
          </Modal>
          <Toast
            ref="toast"
            style={{
              backgroundColor: this.props.errorProgress.hasError
                ? colors.toast.error
                : colors.toast.success,
            }}
          />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <NavBar
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ padding: 10 }}
            >
              <MyIcon name="arrow" color="black" size={20} />
            </TouchableOpacity>
          }
          body={
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
              {Strings.setting.departmentInfo}
            </Text>
          }
        />
        <View
          style={{
            paddingVertical: 20,
          }}
        >
          <ActivityIndicator animating size="small" />
        </View>
      </View>
    );
  }

  onSubmit = () => {
    this.props.data.forEach((element) => {
      element.items.forEach((o) => {
        if (o.isDefault) {
          return this.props.updateDepartmentDefault({
            towerId: element.id,
            departmentId: o.id,
          });
        }
      });
    });
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
    paddingVertical: 10,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  initComponent: state.departmentDetail.initComponent,
  data: state.departmentDetail.data,
  error: state.departmentDetail.error,
  errorProgress: state.departmentDetail.errorProgress,
  language: state.app.language,
  isLoading: state.departmentDetail.isLoading,
  progressing: state.departmentDetail.progressing,
});
const mapActionToState = {
  loadDataHandle,
  onValueChange,
  updateDepartmentDefault,
};

export default connect(
  mapStateToProps,
  mapActionToState
)(DepartmentScreen);
