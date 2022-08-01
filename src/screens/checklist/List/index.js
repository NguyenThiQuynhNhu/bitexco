//import liraries
import React, { Component } from "react";
import {
  Picker,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  TextInput,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  RefreshControl,
  ScrollView,
  Item,
  Modal,
} from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import Toast, { DURATION } from "react-native-easy-toast";
import FCM, { FCMEvent } from "react-native-fcm";

//components
import ImageProgress from "../../../components/common/ImageProgress";
import ListAutoHideHeader from "../../../components/common/ListAutoHideHeader";
import { MyIcon } from "../../../theme/icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconText from "../../../components/common/IconText";
import SearchBar from "../../../components/common/SearchBar";
import ErrorContent from "../../../components/common/ErrorContent";
import Device from "../../../utils/device";
import ListData from "../../../components/Checklist/List/ListData";
import ButtonFilter from "../../../components/Checklist/List/ButtonFilter";
import ButtonDateFilter from "../../../components/statistics/ButtonFilter";

//style
import colors from "../../../theme/colors";
import fontSize from "../../../theme/fontsize";

const Devices = require("react-native-device-detection");
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";

import NavBar from "../../../resident/components/common/NavBar";

//data
import firebase from "firebase";
import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  onSubmitEditing,
  onChangeText,
  onClearText,
  onFilter,
  onClearFilter,
} from "../../../actions/checklist";
import {
  converStatusToColor,
  converStatusToString,
} from "../../../utils/request";
import Strings from "../../../utils/languages";
import PrimaryButton from "../../../components/common/PrimaryButton";

import Button from "../../../components/common/Button";
import CircleView from "../../../components/common/CircleView";
import responsive from "../../../resources/responsive";

// create a component
class ChecklistList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMaintenance: props.navigation.state.params.isMaintenance,
      statusSelected: null,
      searchKey: "",
      isApplySearchKey: false,
      filter: [
        {
          statusId: 0,
          isFilter: false,
        },
        {
          statusId: 1,
          isFilter: false,
        },
        {
          statusId: 2,
          isFilter: false,
        },
        {
          statusId: 3,
          isFilter: false,
        },
        {
          statusId: 4,
          isFilter: false,
        },
      ],
      status: -1,
      showFilter: false,
      isShowPopupCustomDate: false,
      selectedButton: 1,
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      txtStartDate: moment().format("YYYY-MM-DD"),
      txtEndDate: moment().format("YYYY-MM-DD"),
      isStartDate: true,
    };
    //console.log(props.navigation.state.params)
  }
  componentDidMount() {
    //console.log('check')
    this.props.resetStateByKey({ key: "initList", path: "", value: true });
  }

  componentWillReceiveProps(nextProps) {
    //console.log('nextProps', nextProps)
    const {
      isMine,
      towerId,
      rowPerPage,
      isRefreshing,
      initList,
      createStatus,
      errorResponse,
      refreshDataHandle,
      statusSelected,
    } = this.props;
    if (nextProps.isRefreshing && nextProps.isRefreshing !== isRefreshing) {
      const data = {
        statusId: this.state.status,
        towerId,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage,
        departmentId: nextProps.statusSelected
          ? nextProps.statusSelected.id
          : 0,
        dateFrom: moment(this.state.startDate).format("DD/MM/YYYY"),
        dateTo: moment(this.state.endDate).format("DD/MM/YYYY"),
      };
      //console.log('nhu')
      this.props.loadDataHandle(data, this.state.isMaintenance);
    }

    if (nextProps.initList && nextProps.initList !== initList) {
      const data = {
        statusId: -1,
        towerId,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage,
        departmentId: statusSelected ? statusSelected.id : 0,
        dateFrom: moment(this.state.startDate).format("DD/MM/YYYY"),
        dateTo: moment(this.state.endDate).format("DD/MM/YYYY"),
      };
      //console.log('nhu1')
      this.props.loadDataHandle(data, this.state.isMaintenance);
    }

    if (nextProps.createStatus && createStatus !== nextProps.createStatus) {
      this.refs.toast.show("Tạo yêu cầu thành công", DURATION.LENGTH_LONG);
    }

    if (nextProps.errorResponse && nextProps.errorResponse !== errorResponse) {
      if (!nextProps.errorResponse.hasError) {
        refreshDataHandle();
      }
    }

    if (
      nextProps.towerId != towerId ||
      // nextProps.statusSelected !== statusSelected ||
      nextProps.isMine !== isMine
    ) {
      refreshDataHandle();
    }
  }

  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }

  _renderContent() {
    const {
      emptyData,
      error,
      initList,
      data,
      isRefreshing,
      outOfStock,
      refreshDataHandle,
      loadDataHandle,
      isLoading,
      statusSelected,
    } = this.props;
    //console.log(data)
    //console.log('check', this.props.navigation)
    if (initList) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator color={colors.appTheme} />
        </View>
      );
    }

    if (emptyData) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
      );
    }
    if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
      );
    }
    return (
      <ListData
        refreshing={isRefreshing}
        onRefresh={() => refreshDataHandle()}
        data={data || []}
        canNavigate={this.props.canNavigate}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        onEndReached={() => {
          if (
            !this.onEndReachedCalledDuringMomentum &&
            !this.props.outOfStock &&
            this.props.currentPage > 0
          ) {
            const towerId = this.props.user.towerId;
            const data = {
              isMine: this.props.isMine,
              statusId: this.props.statusId,
              towerId,
              keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
              currentPage: this.props.currentPage + 1,
              rowPerPage: this.props.rowPerPage,
              departmentId: statusSelected ? statusSelected.id : 0,
              dateFrom: moment(this.state.startDate).format("DD/MM/YYYY"),
              dateTo: moment(this.state.endDate).format("DD/MM/YYYY"),
            };
            //console.log(data)
            this.props.loadDataHandle(data, this.state.isMaintenance);
          }
        }}
        navigation={this.props.navigation}
      />
    );
  }

  render() {
    const {
      searchKey,
      onSubmitEditing,
      onClearText,
      onChangeText,
      navigation,
      resetStateByKey,
      onFilter,
      onClearFilter,
      user,
    } = this.props;
    const { statusSelected, showFilter, selectedButton } = this.state;
    //console.log('prop',this.props )

    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <MyIcon name="arrow" size={22} color="black" />
            </TouchableOpacity>
          }
          body={
            <View style={{ justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: 18,
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "center",
                  color: "black",
                }}
              >
                {this.state.isMaintenance ? "Kiểm tra định kỳ" : "Checklist"}
              </Text>
            </View>
          }
          rightView={
            <TouchableOpacity
              onPress={() => this.setState({ showFilter: true })}
              style={{ padding: 10 }}
            >
              <MyIcon name="search" size={25} color="black" />
            </TouchableOpacity>
          }
        />

        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              backgroundColor: "#fff",
              marginHorizontal: 10,
              marginVertical: 5,
            }}
          >
            <ButtonFilter
              value={0}
              currentValue={this.state.status}
              onSelectedChange={this._onSelectedChange}
              style={{
                borderRightWidth: 1,
                borderColor: colors.grayBorder,
                width: responsive.w(90),
              }}
            />
            <ButtonFilter
              value={1}
              currentValue={this.state.status}
              onSelectedChange={this._onSelectedChange}
              style={{
                borderRightWidth: 1,
                borderColor: colors.grayBorder,
                width: responsive.w(130),
              }}
            />
            <ButtonFilter
              value={2}
              currentValue={this.state.status}
              onSelectedChange={this._onSelectedChange}
              style={{
                borderRightWidth: 1,
                borderColor: colors.grayBorder,
                width: responsive.w(90),
              }}
            />
            <ButtonFilter
              value={3}
              currentValue={this.state.status}
              onSelectedChange={this._onSelectedChange}
              style={{
                borderRightWidth: 1,
                borderColor: colors.grayBorder,
                width: responsive.w(90),
              }}
            />
            <ButtonFilter
              value={4}
              currentValue={this.state.status}
              onSelectedChange={this._onSelectedChange}
              style={{
                borderRightWidth: 1,
                borderColor: colors.grayBorder,
                width: responsive.w(70),
              }}
            />
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              backgroundColor: "#fff",
              //borderBottomWidth: 1,
              borderBottomColor: colors.grayBorder,
              paddingVertical: 10,
            }}
          >
            <ButtonDateFilter
              value={selectedButton == 1}
              text="Hôm nay"
              onPress={() => this.setActive(1)}
            />
            <ButtonDateFilter
              value={selectedButton == 2}
              text="Hôm qua"
              onPress={() => this.setActive(2)}
            />
            {/* <ButtonDateFilter value={selectedButton == 3} text="Tuần này" onPress={() => this.setActive(3)} />
                            <ButtonDateFilter value={selectedButton == 4} text="Tuần trước" onPress={() => this.setActive(4)} /> */}
            <ButtonDateFilter
              value={selectedButton == 5}
              text="Tháng này"
              onPress={() => this.setActive(5)}
            />
            <ButtonDateFilter
              value={selectedButton == 6}
              text="Tuỳ chỉnh"
              onPress={() => this.setActive(6)}
            />
          </ScrollView>
        </View>

        {this._renderContent()}

        <Modal
          transparent={true}
          visible={this.state.isShowPopupCustomDate}
          onRequestClose={() => null}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: colors.appOverView,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginHorizontal: 15,
                borderRadius: 5,
                flexDirection: "column",
                width: Devices.isTablet ? "50%" : "90%",
              }}
            >
              <View style={{ padding: 12, paddingVertical: 15, height: 160 }}>
                <Text style={{ textAlign: "center", fontSize: 17 }}>
                  TÙY CHỈNH THỜI GIAN
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 0,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {/* <Image source={Icons.calendar} style={{ height: 30, width: 30, marginRight: 5 }} /> */}
                    <TouchableOpacity
                      onPress={() => this._showDateTimePicker(true)}
                      bordered
                      dark
                      style={{
                        borderRadius: 0,
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 5,
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{ fontSize: fontSize.medium, color: "#111" }}
                      >
                        {moment(this.state.txtStartDate).format("DD-MM-YYYY")}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this._showDateTimePicker(false)}
                      bordered
                      dark
                      style={{
                        borderRadius: 0,
                        flex: 1,
                        padding: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{ fontSize: fontSize.medium, color: "#111" }}
                      >
                        {moment(this.state.txtEndDate).format("DD-MM-YYYY")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* <View><Text style={{margin:5,flex:0.3}}>-</Text></View> */}
                </View>
                <View style={{ padding: 5 }}>
                  <Button
                    text="OK"
                    style={{ padding: 10 }}
                    onPress={this.customTime}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={() => this.setState({ isShowPopupCustomDate: false })}
                style={{
                  borderColor: colors.grayBorder,
                  borderTopWidth: 1,
                  paddingVertical: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "red" }}>ĐÓNG</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={(date) => this._handleDatePicked(date)}
              onCancel={this._hideDateTimePicker}
            />
          </View>
        </Modal>

        {showFilter && (
          <View
            style={{
              ...Device.defaultMarginTop(),
              height: "100%",
              width: "100%",
              position: "absolute",
              backgroundColor: colors.appOverView,
            }}
          >
            <View
              style={{
                width: "90%",
                margin: 20,
                alignSelf: "center",
                padding: 10,
                backgroundColor: "#fff",
                justifyContent: "space-between",
              }}
            >
              <SearchBar
                value={this.state.searchKey}
                onChangeText={(searchKey) => {
                  this.setState({ searchKey }, () => {
                    if (searchKey.length === 0) {
                      if (this.state.isApplySearchKey) {
                        this.setState(
                          { searchKey: "", isApplySearchKey: false },
                          () => this.props.refreshDataHandle()
                        );
                      }
                    }
                  });
                }}
                onSubmitEditing={() =>
                  this.setState(
                    { isApplySearchKey: true, showFilter: false },
                    () => this.props.refreshDataHandle()
                  )
                }
                onClearText={() => {
                  const isApplySearchKeyOld = this.state.isApplySearchKey;
                  this.setState(
                    { searchKey: "", isApplySearchKey: false },
                    () => {
                      if (isApplySearchKeyOld) {
                        this.props.refreshDataHandle();
                      }
                    }
                  );
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("checklistStatus", {
                    id: user.towerId,
                    onSelected: (statusSelected) =>
                      this.setState({
                        statusSelected,
                        status: statusSelected.id,
                      }),
                  })
                }
                style={{
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 5,
                  backgroundColor: colors.gray2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>
                  {this.props.statusSelected
                    ? this.props.statusSelected.name
                    : statusSelected
                    ? statusSelected.name
                    : "Chọn trạng thái"}
                </Text>
                <MyIcon name="arrow-down" size={20} color={colors.gray1} />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "center",
                }}
              >
                <Button
                  text="Bỏ lọc"
                  onPress={() =>
                    this.setState(
                      {
                        searchKey: "",
                        isApplySearchKey: false,
                        showFilter: false,
                        statusSelected: null,
                        status: -1,
                      },
                      () => onClearFilter()
                    )
                  }
                />
                <Button
                  visible={
                    this.state.searchKey !== "" ||
                    this.props.statusSelected !== null ||
                    statusSelected !== null
                  }
                  onPress={() =>
                    this.setState(
                      {
                        showFilter: false,
                        isApplySearchKey: this.state.searchKey.length !== 0,
                      },
                      () => onFilter({ statusSelected })
                    )
                  }
                  text="Lọc dữ liệu"
                  style={{ marginLeft: 10 }}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => this.setState({ showFilter: false })}
              style={{
                borderRadius: 45,
                backgroundColor: colors.appTheme,
                padding: 10,
                position: "absolute",
                top: 5,
                right: 5,
              }}
            >
              <MyIcon name="no" color="#fff" size={10} />
            </TouchableOpacity>
          </View>
        )}
        <Toast
          ref="toast"
          style={{
            backgroundColor: colors.toast.success,
            opacity: 1,
            borderRadius: 5,
            padding: 10,
          }}
        />
      </View>
    );
  }

  _showDateTimePicker(type) {
    this.setState({ isDateTimePickerVisible: true, isStartDate: type });
  }
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    if (this.state.isStartDate) {
      this.setState({ txtStartDate: moment(date).format("YYYY-MM-DD") });
    } else {
      this.setState({ txtEndDate: moment(date).format("YYYY-MM-DD") });
    }
    this._hideDateTimePicker();
  };

  customTime = () => {
    this.setState(
      {
        isShowPopupCustomDate: false,
        startDate: this.state.txtStartDate,
        endDate: this.state.txtEndDate,
      },
      () => {
        this.props.refreshDataHandle();
      }
    );
  };

  _onSelectedChange = (value) => {
    if (value == this.state.status) {
      this.setState({ status: -1 }, () => this.props.refreshDataHandle());
    } else {
      this.setState({ status: value }, () => this.props.refreshDataHandle());
    }
  };

  setActive(id) {
    let option = null;
    switch (id) {
      case 1: {
        //hôm nay
        option = {
          selectedButton: id,
          endDate: moment().format("YYYY-MM-DD"),
          startDate: moment().format("YYYY-MM-DD"),
        };
        break;
      }
      case 2: {
        //hôm qua
        option = {
          selectedButton: id,
          endDate: moment()
            .add(-1, "days")
            .format("YYYY-MM-DD"),
          startDate: moment()
            .add(-1, "days")
            .format("YYYY-MM-DD"),
        };
        break;
      }
      case 3: {
        //tuần này
        var curr = new Date(); // get current date
        var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6

        var firstday = new Date(curr.setDate(first)).toUTCString();
        var lastday = new Date(curr.setDate(last)).toUTCString();

        option = {
          selectedButton: id,
          endDate: moment(lastday).format("YYYY-MM-DD"),
          startDate: moment(firstday).format("YYYY-MM-DD"),
        };
        break;
      }
      case 4: {
        //tuần trước
        var curr = new Date(); // get current date
        var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6

        var firstday = new Date(curr.setDate(first)).toUTCString();
        var lastday = new Date(curr.setDate(last)).toUTCString();

        option = {
          selectedButton: id,
          startDate: moment(firstday)
            .add(-1, "weeks")
            .format("YYYY-MM-DD"),
          endDate: moment(lastday)
            .add(-1, "weeks")
            .format("YYYY-MM-DD"),
        };
        break;
      }

      case 5: {
        //tháng này
        option = {
          selectedButton: id,
          startDate: moment().format("YYYY-MM-01"),
          endDate: moment().format("YYYY-MM-") + moment().daysInMonth(),
        };
        break;
      }

      case 6: {
        //tuỳ chọn
        option = {
          selectedButton: id,
          isShowPopupCustomDate: true,
        };
        break;
      }
    }
    return this.setState(option, () => {
      if (id !== 6) {
        this.props.refreshDataHandle();
      }
    });
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({
  initList: state.checklist.initList,
  currentPage: state.checklist.currentPage,
  rowPerPage: state.checklist.rowPerPage,
  emptyData: state.checklist.emptyData,
  outOfStock: state.checklist.outOfStock,
  isLoading: state.checklist.isLoading,
  data: state.checklist.data,
  error: state.checklist.error,
  isRefreshing: state.checklist.isRefreshing,
  isApplySearchKey: state.checklist.isApplySearchKey,
  searchKey: state.checklist.searchKey,
  createStatus: state.checklist.createStatus,
  canNavigate: true, //state.requestDetail.data == null,
  language: state.app.language,
  isMine: state.checklist.isMine,
  user: state.auth.user,
  statusId: state.checklist.statusId,
  errorResponse: state.requestDetail.errorResponse,
  towerId: state.auth.user.towerId,
  statusSelected: state.checklist.statusSelected,
});

const mapActionToState = {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  onSubmitEditing,
  onChangeText,
  onClearText,
  onFilter,
  onClearFilter,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(ChecklistList);
