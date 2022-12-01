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
          borderRadius: responsive.h(16),
          backgroundColor: "#ffffff",
          borderWidth: responsive.h(1),
          marginHorizontal: responsive.h(20),
          marginVertical: responsive.h(10),
          borderColor: "#e5e5e5",
        }}
      >
        <View style={{ flexDirection: "row", padding: responsive.h(10) }}>
          <ImageProgress
            circle
            source={{ uri: logo }}
            style={{ height: responsive.h(50), width: responsive.h(50) }}
          />
          <View
            style={{
              flex: 1,
              marginLeft: responsive.h(10),
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: colors.appTheme,
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(15),
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                marginTop: responsive.h(2),
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(14),
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
            alignItems: 'center'
          }}
        >
          <MyIcon
            name="location"
            color="black"
            size={responsive.h(15)}
            style={{
              lineHeight: responsive.h(24),
              marginLeft: responsive.h(10),
            }}
          />
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: responsive.h(14),
              fontWeight: "500",
              fontStyle: "normal",
              lineHeight: responsive.h(24),
              letterSpacing: 0,
              textAlign: "left",
              color: "#3d3d3d",
              marginHorizontal: responsive.h(10),
            }}
          >
            {Strings.setting.towerAddress}: {address}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: responsive.h(10),
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: 'center', flex: 0.8 }}>
            <MyIcon
              name="cn-h"
              color="black"
              size={responsive.h(15)}
              style={{ lineHeight: responsive.h(24) }}
            />
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(14),
                fontWeight: "500",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#3d3d3d",
                marginHorizontal: responsive.h(10),
              }}
            >
              {Strings.department.code}
            </Text>
          </View>

          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: responsive.h(14),
              fontWeight: "500",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: 'center',
              color: "#3d3d3d",
              flex: 0.25,
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
                marginHorizontal: responsive.h(10),
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
                  paddingHorizontal: responsive.h(10),
                  marginBottom: responsive.h(10),
                  justifyContent: "space-between",

                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-SemiBold",
                    fontSize: responsive.h(14),
                    paddingLeft: responsive.h(25),
                    fontWeight: "500",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#3d3d3d",
                    flex: 0.8
                  }}
                >
                  {name}
                </Text>
                <CheckBox
                  styles={{ flex: 0.25, alignItems: 'center' }}
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
  renderContent(){
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
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
              marginBottom: responsive.h(30),
              alignSelf: "center",
              padding: 10,
              width: "50%",
              backgroundColor: "#afaeae",
              height: responsive.h(46),
              borderRadius: responsive.h(20),
            }}
          />
          <Modal
            visible={this.props.progressing}
            onRequestClose={() => { }}
            transparent={true}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: colors.appOverView,
              }}
            >
              <ActivityIndicator animating size='large'/>
            </View>
          </Modal>
          <Toast
            ref="toast"
            position='center'
            style={{
              backgroundColor: this.props.errorProgress.hasError
                ? colors.toast.error
                : colors.toast.success,
            }}
          />
        </View>
      );
    }
  }
  render() {
    const { data, isLoading, error, initComponent, user } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <NavBar
          body={
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
                {Strings.setting.departmentInfo}
              </Text>
          }
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ padding: responsive.h(10), paddingHorizontal: responsive.h(12) }}
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
    paddingVertical: responsive.h(10),
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
