//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  FlatList,
} from "react-native";
import { WebView } from "react-native-webview";
import { connect } from "react-redux";
import moment from "moment";
import Toast, { DURATION } from "react-native-easy-toast";
import {
  loadDataHandle,
  resetStateByKey,
  createBookingHandle,
  onValueChange,
} from "../../actions/utilitiesBasicBooking";
import ErrorContent from "../../components/common/ErrorContent";
import PrimaryButton from "../../components/common/PrimaryButton";
import colors from "../../theme/colors";
import ImageProgress from "../../components/common/ImageProgress";
import NavBar from "../../components/common/NavBar";
import fontsize from "../../theme/fontsize";
import { MyIcon } from "../../theme/icons";
import BookingBasicModal from "./BookingBasicModal";
import Strings from "../../utils/languages";
import { Screen } from "../../utils/device";
import DateTimePicker from "react-native-modal-datetime-picker";
import Spinner from "react-native-loading-spinner-overlay";
import Lookup from "../../components/Request/RequestCreate/Lookup";
import IconButton from "../../../components/common/IconButton";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// create a component
class BasicBookingScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      spaceMainCode: "",
      isLoadingWeb: false,
      amountPeople: 1,
      dateBook: moment(),
      isShowTime: false,
      serviceId: 0,
      dateLimited: moment(),
      maximumAmountPeople: 1,
      deposit: 0,
      zoneName: "",
      content: "",
      zoneTimeId: 0,
      isLoadDesign: false,
      zoneSelected: {
        id: 0,
        name: "",
      },
    };
  }

  componentDidMount() {
    const {
      id,
      zoneId,
      dateLimited,
      maximumAmountPeople,
      zoneName,
      deposit,
    } = this.props.navigation.state.params.data;

    this.setState({
      dateLimited,
      serviceId: id,
      maximumAmountPeople,
      zoneName,
      deposit,
      zoneSelected: { id: zoneId, name: zoneName },
    });

    this.props.resetStateByKey({
      key: "zoneSelected",
      path: "",
      value: { id: zoneId, name: zoneName },
    });

    this.props.loadDataHandle({
      towerId: this.props.towerId,
      serviceId: id,
      dateBook: moment(this.state.dateBook).format("DD/MM/YYYY"),
      zoneId,
      langId: this.props.langId,
    });

    setTimeout(() => {
      this.setState({ isLoadDesign: true });
    }, 500);
  }
  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errorProgress &&
      nextProps.errorProgress !== this.props.errorProgress
    ) {
      if (nextProps.errorProgress.hasError) {
        this.refs.toast.show(nextProps.errorProgress.message, 1500);
      } else {
        this.setState({ showModal: false }, () => {
          this.refs.toast.show(
            Strings.message.bookSuccess,
            DURATION.LENGTH_LONG
          );
          this.props.navigation.goBack();
          this.props.navigation.navigate("serviceBasicResident");
        });
      }
    } else {
      if (nextProps.zoneSelected.id !== this.props.zoneSelected.id) {
        this.setState({ zoneSelected: nextProps.zoneSelected }, () => {
          this._onLoadZoneTime(this.state.dateBook);
        });
      }
    }
  }

  renderItem = ({ item, index }) => {
    const { id, name, amountEmpty, description, isAvailable, isSelect } = item;

    const sizeWidth = (Screen.width - 65) / 3;
    const sizeHeight = Screen.width / 3 - 50;
    if (isAvailable)
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.onValueChange({ id, value: !isSelect });
          }}
          style={{
            margin: 5,
            marginVertical: 10,
            borderBottomWidth: 5,
            width: sizeWidth,
            height: sizeHeight,
            justifyContent: "center",
            alignItems: "center",
            borderColor: isSelect ? colors.appTheme : colors.gray2,
            borderBottomColor: isSelect ? colors.appTheme : colors.gray2,
            borderWidth: 1,
            padding: 5,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 14,
              fontWeight: "normal",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
              color: "#282828",
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: fontsize.micro,
              color: "#282828",
            }}
          >
            {description}
          </Text>
        </TouchableOpacity>
      );
    else {
      return (
        <View
          style={{
            margin: 5,
            marginVertical: 10,
            borderBottomWidth: 5,
            width: sizeWidth,
            height: sizeHeight,
            justifyContent: "center",
            alignItems: "center",
            borderColor: colors.red,
            borderBottomColor: colors.red,
            borderWidth: 1,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 14,
              fontWeight: "normal",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
              color: "#282828",
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: fontsize.micro,
              color: "#282828",
            }}
          >
            {description}
          </Text>
        </View>
      );
    }
  };

  renderContent() {
    const {
      initComponent,
      isLoading,
      error,
      data,
      createBookingHandle,
      zoneSelected,
    } = this.props;

    const { content, serviceId } = this.state;

    const { deposit, zoneName } = this.props.navigation.state.params.data;
    if (initComponent || isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator animating />
        </View>
      );
    } else if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => this._onLoadZoneTime(this.state.dateBook)}
        />
      );
    } else if (data) {
      const { name } = this.props.navigation.state.params.name;
      return (
        <KeyboardAwareScrollView>
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <Lookup
              fielName={Strings.serviceBasicBooking.position}
              textTile={{
                fontFamily: "Inter-Medium",
                fontSize: 14,
                fontWeight: "500",
                fontStyle: "normal",
                lineHeight: 24,
                letterSpacing: 0,
                textAlign: "left",
                color: "#282828",
              }}
              textInf={{
                fontFamily: "Inter-Regular",
                fontSize: 14,
                fontWeight: "normal",
                fontStyle: "normal",
                lineHeight: 21,
                letterSpacing: 0,
                textAlign: "left",
                color: "#282828",
              }}
              text={
                zoneSelected.id != 0
                  ? zoneSelected.name
                  : Strings.serviceBasicBooking.zoneSelect
              }
              onPress={() =>
                this.props.navigation.navigate("zoneDictionary", {
                  towerId: this.props.user.towerId,
                  serviceId,
                })
              }
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: 14,
                  fontWeight: "500",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#282828",
                }}
              >
                {Strings.serviceBasicBooking.deposit}
              </Text>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <Text
                  style={{
                    marginRight: 10,
                    fontFamily: "Inter-SemiBold",
                    fontSize: 14,
                    fontWeight: "600",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#ff3d00",
                  }}
                >
                  {deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 11,
                    fontWeight: "normal",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "right",
                    color: "#6f6f6f",
                  }}
                >
                  VNĐ
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: 14,
                  fontWeight: "500",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#282828",
                }}
              >
                {Strings.serviceBasicBooking.amountPeople}
              </Text>

              <View
                style={{
                  //flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  backgroundColor: "#f8fff2",
                  borderRadius: 12,
                  elevation: 3,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this._onDownAmount();
                  }}
                >
                  <View
                    style={{
                      width: 50,
                      height: 40,
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: 5,
                    }}
                  >
                    <Text style={{ fontSize: fontsize.larg, color: "#fff200" }}>
                      -
                    </Text>
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    width: 50,
                    height: 40,
                    paddingTop: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-SemiBold",
                      fontSize: 16,
                      fontWeight: "600",
                      fontStyle: "normal",
                      letterSpacing: 0,
                      textAlign: "center",
                      color: colors.appTheme,
                    }}
                  >
                    {this.state.amountPeople}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    this._onUpAmount();
                  }}
                >
                  <View
                    style={{
                      width: 50,
                      height: 40,
                      paddingTop: 5,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontsize.larg,
                        color: "#fff200",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      +
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => this.setState({ isShowTime: true })}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 14,
                    fontWeight: "500",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#282828",
                  }}
                >
                  {Strings.serviceBasicBooking.dateBook} (*)
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    borderRadius: 8,
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: "#cbcbcb",
                    padding: 10,
                  }}
                >
                  {this.props.language == "en" ? (
                    <Text
                      style={{
                        fontFamily: "Inter-Regular",
                        marginRight: 10,
                        fontSize: 14,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: "#282828",
                      }}
                    >
                      {moment(this.state.dateBook).format("MM/DD/YYYY")}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "Inter-Regular",
                        marginRight: 10,
                        fontSize: 14,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: "#282828",
                      }}
                    >
                      {moment(this.state.dateBook).format("DD/MM/YYYY")}
                    </Text>
                  )}
                  <MyIcon
                    name="calendar"
                    size={20}
                    color="rgba(0, 0, 0, 0.54)"
                  />
                </View>
              </View>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "flex-start",
                marginBottom: 20,
                //borderBottomColor: colors.gray2,
                //borderBottomWidth: 1
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: 14,
                  fontWeight: "500",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#282828",
                }}
              >
                {Strings.serviceBasicBooking.time} (*)
              </Text>
              <DateTimePicker
                cancelTextIOS={Strings.app.cancel}
                titleIOS={Strings.createRequest.at}
                confirmTextIOS={Strings.app.chose}
                //minimumDate={new Date()}
                //maximumDate={new Date(this.state.dateLimited)}
                mode="date"
                isVisible={this.state.isShowTime}
                onConfirm={(time) => {
                  this.setState({ isShowTime: false, dateBook: time }, () => {
                    this._onLoadZoneTime(time);
                  });
                }}
                onCancel={() => {
                  this.setState({ isShowTime: false });
                }}
              />

              <FlatList
                style={{ alignSelf: "center" }}
                scrollEnabled={false}
                data={data}
                keyExtractor={(index) => `${index}`}
                renderItem={this.renderItem}
                numColumns={3}
              />
            </View>

            <View
              style={{
                //borderBottomWidth: 1,
                //borderColor: colors.grayBorder,

                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 14,
                    fontWeight: "500",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#282828",
                  }}
                >
                  {Strings.serviceBasicBooking.message}
                </Text>
                <Text style={{ color: "gray" }}>{content.length}/ 500</Text>
              </View>

              <TextInput
                maxLength={500}
                underline={false}
                multiline
                underlineColorAndroid="transparent"
                style={{
                  marginTop: 10,
                  width: "100%",
                  flex: 1,
                  height: 100,
                  padding: 5,
                  textAlignVertical: Platform.OS === "ios" ? "auto" : "top",
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  borderRadius: 8,
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#cbcbcb",
                  fontFamily: "Inter-Regular",
                  fontSize: 14,
                }}
                placeholder={Strings.serviceBasicBooking.messagePlaceholder}
                placeholderTextColor="#6b6b6b"
                value={this.state.content}
                onChangeText={(content) => {
                  this.setState({ content });
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      );
    }
  }

  _onUpAmount() {
    if (this.state.amountPeople < this.state.maximumAmountPeople)
      this.setState({ amountPeople: this.state.amountPeople + 1 });
  }

  _onDownAmount() {
    if (this.state.amountPeople > 1)
      this.setState({ amountPeople: this.state.amountPeople - 1 });
  }

  _onLoadZoneTime(time) {
    const { serviceId, zoneSelected } = this.state;
    this.props.loadDataHandle({
      towerId: this.props.towerId,
      serviceId,
      dateBook: moment(time).format("DD/MM/YYYY"),
      zoneId: zoneSelected.id,
      langId: this.props.langId,
    });
  }

  _onSubmit() {
    const {
      amountPeople,
      dateBook,
      zoneSelected,
      serviceId,
      deposit,
      content,
    } = this.state;

    const data = this.props.data;

    const listSelected = data.filter((o) => o.isSelect);

    if (listSelected.length == 0) {
      return this.refs.toast.show(
        `${Strings.serviceBasicBooking.messageChoice}`,
        DURATION.LENGTH_LONG
      );
    }

    this.props.createBookingHandle({
      dateBook: moment(dateBook).format("DD/MM/YYYY"),
      langId: this.props.langId,
      serviceId,
      zoneId: zoneSelected.id,
      towerId: this.props.user.towerId,
      towerName: this.props.user.towerName,
      apartmentId: this.props.user.spaceMainId,
      apartmentName: this.props.user.spaceMainCode,
      amountDeposit: deposit,
      description: content,
      amountPeople,
      zoneTimes: listSelected,
      serviceName: this.props.navigation.state.params.name,
    });
  }

  render() {
    if (!this.state.isLoadDesign) {
      <View style={styles.container}>
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
                alignSelf: "center",
                color: "black",
                fontSize: fontsize.larg,
              }}
            >
              {this.props.navigation.state.params.name}
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
      </View>;
    }

    const { navigation, isProgress } = this.props;
    return (
      <View style={styles.container}>
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
                fontFamily: "Inter-SemiBold",
                fontSize: 18,
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "black",
              }}
            >
              {this.props.navigation.state.params.name}
            </Text>
          }
          // rightView = {
          //     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          //         <TouchableOpacity
          //             onPress={() => {
          //                 this._onSubmit();
          //             }}
          //             style={{ flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 10, alignItems: 'center' }}
          //         >
          //             <Icon name="send" color="#fff" size={30} />
          //         </TouchableOpacity>
          //     </View>
          // }
          // rightView={<IconButton materialIcon="send" color="#fff" size={24}
          //     onPress={this._onSubmit}
          // />}
          rightView={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  this._onSubmit();
                }}
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <MyIcon name="paperplane" color="black" size={24} />
              </TouchableOpacity>
            </View>
          }
        />
        {this.renderContent()}
        <Spinner
          visible={this.props.isProgress}
          color={colors.primaryKeyColor}
        />
        <Toast
          ref="toast"
          style={{
            backgroundColor:
              this.props.errorProgress && this.props.errorProgress.hasError
                ? colors.toast.warning
                : colors.toast.success,
            opacity: 1,
            borderRadius: 5,
            padding: 10,
          }}
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

//make this component available to the app
const mapStateToProps = (state) => ({
  user: state.auth.user,
  towerId: state.auth.user.towerId,
  langId: state.app.language == "vi" ? 1 : 2,
  data: state.utilitiesBasicBooking.data,
  isLoading: state.utilitiesBasicBooking.isLoading,
  error: state.utilitiesBasicBooking.error,
  initComponent: state.utilitiesBasicBooking.initComponent,
  errorProgress: state.utilitiesBasicBooking.errorProgress,
  isProgress: state.utilitiesBasicBooking.isProgress,
  zoneSelected: state.utilitiesBasicBooking.zoneSelected,
});
const mapActionToProps = {
  loadDataHandle,
  resetStateByKey,
  createBookingHandle,
  onValueChange,
};
export default connect(
  mapStateToProps,
  mapActionToProps
)(BasicBookingScreen);
