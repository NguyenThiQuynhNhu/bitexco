//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { connect } from "react-redux";

//style
import colors from "../../../theme/colors";
import fontsize from "../../../theme/fontsize";
import { Screen } from "../../../utils/device";
import Strings from "../../../utils/languages";
import { color } from "react-native-reanimated";
import { converDateToByString, converStatusToByString } from "../../../utils/handover";
import responsive from "../../../resources/responsive";
//
import { show } from "../../../utils/Toast";
import ImageProgress from "../../../components/common/ImageProgress";
import ActionSheet from "../../../components/common/ActionSheet";
import DateTimePicker from "react-native-modal-datetime-picker";
import DatePicker from 'react-native-date-picker'
import TuNgayPicker from "react-native-modal-datetime-picker";
import DenNgayPicker from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import NavBar from "../../../resident/components/common/NavBar";
import { MyIcon } from "../../../theme/icons";
import { resetStateByKeyEwalle } from "../../../resident/actions/paymentHistory";
import Swipeable from "react-native-swipeable";
import Toast, { DURATION } from "react-native-easy-toast";
import moment from "moment";
import ErrorContent from "../../../components/common/ErrorContent";
//
import { getDate, getDateTime, getDateApi } from "../../../utils/Common";
//data
import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  progressHandle,
  goListTaiSan,
  HandOverStatus,
  HandOverChangeStatus,
  HandOverFinishDate,
  CheckListStatusName,
} from "../../../actions/checklist_dangthuchien";
import {
  onChangetuNgay,
  onChangedenNgay,
  loadDate,
  onChangeDateName,
} from "../../../actions/utils";
// create a component
class index extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: Strings.profile.setting,
    headerBackTitle: null,
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: colors.appTheme,
      elevation: 0,
      borderBottomColor: "transparent",
      borderBottomWidth: 0,
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      showAction: false,
      actionData: [
        { id: 1, name: "Bàn giao" },
        { id: 2, name: "Chuyển trạng thái" },
      ],

      showActionStatus: false,
      actionDataStatus: [],

      searchKey: "",
      isApplySearchKey: false,
      status: 0,
      isShowSearch: false,
      showModal: false,
      modalView: null,
      item: {},

      isDateTimePickerVisible: false,
      nam: 0,
      thang: 0,
      ngay: 0,
      gio: 0,
      phut: 0,
      giay: 0,

      isTuNgayPickerVisible: false,
      isDenNgayPickerVisible: false,
      showActionDate: false,
      statusId: 0,
      statusName: "Tất cả",
      showActionStatusName: false,
      actionDataStatusName: [
        // {Id:2,Name:'chờ bàn giao'},
        // {Id:3,Name:'Chuyển nhà thầu xử lý'},
        // {Id:9,Name:'Nhà thầu đã sửa chữa xong'},
      ],
    };
  }
  componentDidMount() {
    // load danh sách trạng thái để filter trước rồi mới load dữ liệu chính
    this.props.CheckListStatusName({ isCustomer: false }).then((data) => {
      data.push({ id: 0, name: "Tất cả" });
      this.setState(
        {
          actionDataStatusName: data,
          // statusId:data[0].id,
          // statusName:data[0].name,
        },
        () => {
          this.props.resetStateByKey({
            key: "initList",
            path: "",
            value: true,
          });
        }
      );
    });
  }
  componentWillReceiveProps(nextProps) {
    // console.log('this ',this)

    if (
      nextProps.errorResponse &&
      nextProps.errorResponse !== this.props.errorResponse
    ) {
      if (!nextProps.errorResponse.hasError) {
        this.props.refreshDataHandle();
      }
    }
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing
    ) {
      const data = {
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
        username: this.props.user.fullName,
        employeeId: this.props.user.id,
        StatusId: this.state.statusId,
        tuNgay: getDateApi(this.props.utils.tuNgay),
        denNgay: getDateApi(this.props.utils.denNgay),
        // tuNgay:this.props.utils.tuNgay,
        // denNgay:this.props.utils.denNgay,
        BuildingId: this.props.user.towerId,
      };
      this.props.loadDataHandle(data);
    }
    if (nextProps.initList && nextProps.initList !== this.props.initList) {
      const data = {
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
        username: this.props.user.fullName,
        employeeId: this.props.user.id,
        StatusId: this.state.statusId,
        tuNgay: getDateApi(this.props.utils.tuNgay),
        denNgay: getDateApi(this.props.utils.denNgay),
        BuildingId: this.props.user.towerId,
      };
      this.props.loadDataHandle(data);
    }
    if (
      nextProps.errorCreate &&
      this.props.errorCreate !== nextProps.errorCreate
    ) {
      if (!nextProps.errorCreate.hasError) {
        this.props.refreshDataHandle();
        this.refs.toast.show("Tạo yêu cầu thành công", DURATION.LENGTH_LONG);
      }
    }
    if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
      this.props.refreshDataHandle();
    }
    if (
      nextProps.errorResponse &&
      this.props.errorResponse !== nextProps.errorResponse
    ) {
      this.setState({ showModal: false, modalView: null }, () => {
        if (nextProps.errorResponse && nextProps.errorResponse.hasError) {
          this.refs.toast.show(
            nextProps.errorResponse.message,
            DURATION.LENGTH_LONG
          );
        } else {
          this.refs.toast.show("Phản hồi thành công", DURATION.LENGTH_LONG);
        }
      });
    }
  }
  componentWillUnmount() {
    // this.props.resetStateByKey({ key: 'state' });
    this.props.resetStateByKey({ key: "state" });
  }

  _renderContent() {
    console.log(this.props)
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => this.setState({ showActionStatusName: true })}
          style={{
            backgroundColor: colors.white,
            paddingVertical: responsive.h(10),
            paddingHorizontal: responsive.h(10),
            alignItems: "center",
            justifyContent: "center",
            // borderBottomWidth: 0.5,
            // borderBottomColor: colors.appTheme,
            flexDirection: "row",
            marginTop: -responsive.h(20),
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: responsive.h(16),
              textAlign: "center",
              fontFamily: "Inter-Bold",
            }}
          >
            {converStatusToByString(this.state.statusName)}
          </Text>

          <Icon
            style={{ fontSize: fontsize.medium, marginHorizontal: responsive.h(10), }}
            name="filter-list"
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginHorizontal: responsive.h(10),
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (this.props.utils.date.length <= 0) {
                this.props.loadDate();
              }
              this.setState({ showActionDate: true });
            }}
            style={{
              paddingVertical: responsive.h(10),
              flex: 1,
              backgroundColor: colors.NoColor,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              borderRadius: responsive.h(12),
              backgroundColor: "#ffffff",
              marginHorizontal: responsive.h(10),
              borderWidth: 0.5,
              borderColor: "#dcdcdc",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: fontsize.medium,
                fontWeight: "500",
              }}
            >
              {converDateToByString(this.props.utils.Name)}
            </Text>
            <Icon
              style={{ fontSize: fontsize.larg, marginLeft: responsive.h(5), }}
              name="arrow-drop-down"
              type="MaterialIcons"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ isTuNgayPickerVisible: true })}
            style={{
              paddingVertical: responsive.h(10),
              flex: 1,
              backgroundColor: colors.NoColor,
              alignItems: "center",
              borderRadius: responsive.h(12),
              backgroundColor: "#ffffff",
              marginHorizontal: responsive.h(10),
              borderWidth: 0.5,
              borderColor: "#dcdcdc",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: fontsize.medium,
                fontWeight: "500",
              }}
            >
              {getDate(this.props.utils.tuNgay)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ isDenNgayPickerVisible: true })}
            style={{
              paddingVertical: responsive.h(10),
              flex: 1,
              backgroundColor: colors.NoColor,
              alignItems: "center",
              borderRadius: responsive.h(12),
              backgroundColor: "#ffffff",
              marginHorizontal: responsive.h(10),

              borderWidth: 0.5,
              borderColor: "#dcdcdc",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: fontsize.medium,
                fontWeight: "500",
              }}
            >
              {getDate(this.props.utils.denNgay)}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: "#f5f5f5",
            height: responsive.h(15),
            width: "100%",
            marginVertical: responsive.h(10),
          }}
        />

        {this._renderContentContent()}
        <ActionSheet
          title="Tuỳ chọn"
          visible={this.state.showAction}
          data={this.state.actionData}
          renderItem={this.renderActionSheetItem}
          closeAction={() => this.setState({ showAction: false })}
        />
        <ActionSheet
          title="Chọn trạng thái"
          visible={this.state.showActionStatus}
          data={this.state.actionDataStatus}
          renderItem={this.renderActionSheetItemStatus}
          closeAction={() => this.setState({ showActionStatus: false })}
        />
        {/* <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          cancelTextIOS="Huỷ"
          confirmTextIOS="Xác nhận"
          titleIOS="Chọn thời gian"
          mode="date"
          locale="vi_VN" //https://gist.github.com/jacobbubu/1836273
        /> */}

        {/* <TuNgayPicker
          date={new Date(this.props.utils.tuNgay)}
          isVisible={this.state.isTuNgayPickerVisible}
          onConfirm={(date) => {
            this.setState({ isTuNgayPickerVisible: false });
            this.props.onChangetuNgay(date);
            setTimeout(() => {
              this.props.refreshDataHandle();
            }, 500);
          }}
          onCancel={() => {
            this.setState({ isTuNgayPickerVisible: false });
          }}
          cancelTextIOS="Huỷ"
          confirmTextIOS="Xác nhận"
          titleIOS="Chọn thời gian"
          mode="date"
          locale="vi_VN" //https://gist.github.com/jacobbubu/1836273
        /> */}
        <DatePicker
          modal
          mode="date"
          open={this.state.isTuNgayPickerVisible}
          onConfirm={(date) => {
            this.setState({ isTuNgayPickerVisible: false });
            this.props.onChangetuNgay(date);
            setTimeout(() => {
              this.props.refreshDataHandle();
            }, 500);
          }}
          onCancel={() => {
            this.setState({ isTuNgayPickerVisible: false });
          }}
          confirmText={'Ok'}
          title={`${Strings.common.choose} ${Strings.handover.time}`}
          cancelText={Strings.handover.cancel}
          date={new Date(this.props.utils.tuNgay)}
          locale={this.props.language == 1 ? "vi_VN" : 'en_US'}
        />
        <DatePicker
          modal
          mode="date"
          date={new Date(this.props.utils.denNgay)}
          open={this.state.isDenNgayPickerVisible}
          onConfirm={(date) => {
            this.setState({ isDenNgayPickerVisible: false });
            this.props.onChangedenNgay(date);
            setTimeout(() => {
              this.props.refreshDataHandle();
            }, 500);
          }}
          onCancel={() => {
            this.setState({ isDenNgayPickerVisible: false });
          }}
          confirmText={'Ok'}
          title={`${Strings.common.choose} ${Strings.handover.time}`}
          cancelText={Strings.handover.cancel}
          locale={this.props.language == 1 ? "vi_VN" : 'en_US'}//https://gist.github.com/jacobbubu/1836273
        />
        <ActionSheet
          title="Chọn thời gian"
          visible={this.state.showActionDate}
          data={this.props.utils.date}
          renderItem={this.renderActionSheetDate}
          closeAction={() => this.setState({ showActionDate: false })}
        />
        <ActionSheet
          title="Chọn trạng thái"
          visible={this.state.showActionStatusName}
          data={this.state.actionDataStatusName}
          renderItem={this.renderActionSheetStatusName}
          closeAction={() => this.setState({ showActionStatusName: false })}
        />
      </View>
      // <DangThucHien />
    );
  }
  _renderContentContent() {
    const {
      emptyData,
      error,
      initList,
      data,
      isRefreshing,
      refreshDataHandle,
    } = this.props;
    if (initList) {
      return (
        <View
          style={{
            paddingVertical: responsive.h(20),
          }}
        >
          <ActivityIndicator animating size="small" />
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
      <View>
        <FlatList
          keyExtractor={(item, index) => `${index}`}
          refreshing={isRefreshing}
          onRefresh={() => refreshDataHandle()}
          data={data}
          //ItemSeparatorComponent={() => <View style={{ backgroundColor: colors.grayBorder, height: 1 }} />}
          renderItem={this.renderItem}
          numColumns={2}
          contentContainerStyle={{
            marginTop: responsive.h(10),
            marginLeft: responsive.h(10),
          }}
        />
      </View>
    );
  }
  renderItem = ({ item }) => {
    return (
      <Swipeable
        rightActionActivationDistance={50}
        rightButtons={[
          <TouchableOpacity
            onPress={() =>
              this.setState({
                showModal: true,
                modalView: this.renderCreateNote(item),
              })
            }
            style={{ flex: 1, justifyContent: "center", paddingLeft: responsive.h(10), }}
          >
            <Text />
          </TouchableOpacity>,
        ]}
        style={{
          backgroundColor: "#fff",
          borderRadius: responsive.h(12),
          backgroundColor: "#ffffff",
          width: (Screen.width - responsive.h(30)) / 2,
          marginBottom: responsive.h(10),
          marginRight: responsive.h(10),
          borderWidth: 0.5,
          borderColor: "#d2d2d2",
          borderBottomWidth: 2,
          padding: responsive.h(10),
        }}
      >
        <TouchableOpacity
          onPress={() => this.item_click(item)}
          style={{
            flex: 1,
            borderRadius: responsive.h(12),
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: 'flex-start',
              maxWidth: responsive.w(150),
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: responsive.h(45),
                height: responsive.h(45),
                // backgroundColor:colors.gray1,
                borderRadius: responsive.h(25),
                backgroundColor: "#e1e1e1",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* lấy ra ký tự đầu và ký tự cuối của mã căn hộ */}
              <View
                style={{

                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",

                }}
              >
                <Text
                  style={{
                    fontSize: responsive.h(14),
                    fontFamily: "Inter-Regular",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  {(item.id + "".charAt(0)).toUpperCase()}
                </Text>
              </View>
            </View>

            <Text
              style={{
                flex: 1,
                color: "#000",
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(15),
                marginLeft: responsive.h(10)
                //maxWidth: responsive.w(90),
              }}
              numberOfLines={2}
              lineBreakMode="tail"
            >
              {`MS: ${item.apartmentName}`}
            </Text>
          </View>

          <View
            style={{
              marginTop: responsive.h(10),
            }}
          >
            {/* <Text style={{ color: colors.gray1 }}>Khu <Text style={{ color: colors.appTheme,fontWeight:'bold' }}>{item.khu}</Text></Text> */}
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(14),
                color: "#6f6f6f",
                paddingBottom: responsive.h(5),
              }}
            >
              {moment(item.dateHandoverFrom).format("HH:mm - DD/MM/YYYY ")}
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(14),
                color: "#6f6f6f",
                paddingBottom: responsive.h(5),
              }}
            >
              {moment(item.dateHandoverTo).format("HH:mm - DD/MM/YYYY ")}
            </Text>

            <View>
              <Text
                style={{
                  fontSize: responsive.h(15),
                  color: "#f53b3b",
                  fontFamily: "Inter-Regular",
                  maxWidth: responsive.w(135),
                  paddingTop: responsive.h(5),
                }}
                lineBreakMode="tail"
                numberOfLines={2}
              >
                {converStatusToByString(item.statusName)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };
  renderActionSheetStatusName = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState(
            {
              showActionStatusName: false,
              statusName: item.name,
              statusId: item.id,
            },
            () => {
              setTimeout(() => {
                this.props.refreshDataHandle();
              }, 500);
            }
          );
        }}
        style={{
          borderBottomColor: colors.grayBorder,
          borderBottomWidth: 0.5,
          borderTopColor: colors.grayBorder,
          borderTopWidth: 0.5,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            margin: responsive.h(10),
            color: "black",
            fontSize: responsive.h(16),
            textAlign: "center",
            fontFamily: "Inter-Medium",
          }}
        >
          {converStatusToByString(item.name)}
        </Text>
      </TouchableOpacity>
    );
  };
  renderActionSheetDate = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ showActionDate: false }, () => {
            this.props.onChangeDateName(item.name);
            this.props.onChangetuNgay(item.dateFrom);
            this.props.onChangedenNgay(item.dateTo);
            setTimeout(() => {
              this.props.refreshDataHandle();
            }, 500);
          });
        }}
        style={{
          borderBottomColor: colors.grayBorder,
          borderBottomWidth: 0.5,
          borderTopColor: colors.grayBorder,
          borderTopWidth: 0.5,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            margin: responsive.h(10),
            fontSize: responsive.h(16),
            color: "black",
            textAlign: "center",
            fontFamily: "Inter-Medium",
          }}
        >
          {converDateToByString(item.name)}
        </Text>
      </TouchableOpacity>
    );
  };
  item_click(item) {
    this.props.goListTaiSan(item);
  }

  render() {
    const { searchKey } = this.state;
    const { isShowSearch } = this.state;
    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ padding: responsive.h(10), }}
            >
              <MyIcon size={responsive.h(20)} name="arrow" color="black" />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(18),
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "black",
              }}
            >
              {Strings.handover.navTitleInternal}
            </Text>
          }
          rightView={
            <TouchableOpacity style={{ padding: responsive.h(10), }}>
              <MyIcon size={responsive.h(24)} name="search" color="transparent" />
            </TouchableOpacity>
          }
        />

        {this._renderContent()}
        <Toast
          ref="toast"
          style={{
            backgroundColor:
              this.props.errorResponse && this.props.errorResponse.hasError
                ? colors.toast.warning
                : colors.toast.success,
            opacity: 1,
            borderRadius: responsive.h(5),
            padding: responsive.h(10),
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
  },
});
const mapStateToProps = (state) => ({
  user: state.auth.user,
  building: state.auth.building,
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  initList: state.checklist_dangthuchien.initList,
  currentPage: state.checklist_dangthuchien.currentPage,
  rowPerPage: state.checklist_dangthuchien.rowPerPage,
  emptyData: state.checklist_dangthuchien.emptyData,
  outOfStock: state.checklist_dangthuchien.outOfStock,
  isLoading: state.checklist_dangthuchien.isLoading,
  data: state.checklist_dangthuchien.data,
  error: state.checklist_dangthuchien.error,
  isRefreshing: state.checklist_dangthuchien.isRefreshing,
  isApplySearchKey: state.checklist_dangthuchien.isApplySearchKey,
  searchKey: state.checklist_dangthuchien.searchKey,
  errorResponse: state.checklist_dangthuchien.errorResponse,
  canNavigate: state.servicesBasicDetail.data == null,
  language: state.app.language == "vi" ? 1 : 2,
  utils: state.utils,
});

// const mapActionToState = dispatch => ({
//     loadDataHandle,
//     refreshDataHandle,
//     resetStateByKey,
//     progressHandle
// })

const mapActionToState = {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  progressHandle,
  goListTaiSan,
  HandOverStatus,
  HandOverChangeStatus,
  HandOverFinishDate,

  onChangetuNgay,
  onChangedenNgay,
  onChangeDateName,
  loadDate,
  CheckListStatusName,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(index);
