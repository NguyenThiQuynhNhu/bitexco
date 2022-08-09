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
  Modal,
  KeyboardAvoidingView,
} from "react-native";

import { MyIcon } from "../../../theme/icons";
import { connect } from "react-redux";
import fontsize from "../../../theme/fontsize";
import responsive from "../../../resources/responsive";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  progressHandle,
  goListTaiSan,
} from "../../../actions/checklist_dangthuchien_khachhang";
import {
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
import { ChuyenTrang, getDate, getDateApi } from "../../../utils/Common";
import ActionSheet from "../../../components/common/ActionSheet";
import DateTimePicker from "react-native-modal-datetime-picker";

import TuNgayPicker from "react-native-modal-datetime-picker";
import DenNgayPicker from "react-native-modal-datetime-picker";
import Swipeable from "react-native-swipeable";
import ErrorContent from "../../../components/common/ErrorContent";
import Strings from "../../../utils/languages";
import moment from "moment";

import NavBar from "../../../resident/components/common/NavBar";

class index extends Component {
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
    //this.props.resetStateByKey({ key: 'initList', path: '', value: true })
    this.props.CheckListStatusName({ IsCustomer: true }).then((data) => {
      data.push({ id: 0, name: "Tất cả" });
      //console.log(data)
      //console.log(data[0])
      this.setState(
        {
          actionDataStatusName: data,
          //statusId: data[0].id,
          //statusName: data[0].name,
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
    //console.log(this.props.user)
  }
  componentWillReceiveProps(nextProps) {
    //console.log(this.state)
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
        //password:this.props.user.password,
        StatusId: this.state.statusId,
        StatusName: this.state.statusName,
        tuNgay: getDateApi(this.props.utils.tuNgay),
        denNgay: getDateApi(this.props.utils.denNgay),
        BuildingId: this.props.user.towerId,
      };
      this.props.loadDataHandle(data);
    }
    if (nextProps.initList && nextProps.initList !== this.props.initList) {
      const data = {
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
        username: this.props.user.username,
        employeeId: this.props.user.id,
        StatusId: this.state.statusId,
        StatusName: this.state.statusName,
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
            style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}
          >
            <Text />
          </TouchableOpacity>,
        ]}
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          //   shadowColor: "rgba(0, 0, 0, 0.1)",
          //   elevation: 2,
          //   shadowOffset: {
          //     width: 0,
          //     height: 4,
          //   },
          //   shadowRadius: 10,
          //   shadowOpacity: 1,
          height: responsive.h(168),
          width: responsive.w(182),
          marginBottom: responsive.h(35),
          borderWidth: 0.5,
          borderColor: "#e1e1e1",
          borderBottomWidth: 2,
          marginHorizontal: 10,
          padding: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => this.item_click(item)}
          style={{
            flex: 1,
            // alignItems: "center",
            borderRadius: 12,
            marginBottom: responsive.h(35),
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              maxWidth: responsive.w(150),
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 41,
                height: 41,
                // backgroundColor:colors.gray1,
                borderRadius: 41 / 2,
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
                    fontSize: responsive.h(16),
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
                color: "#000",
                fontFamily: "Inter-Regular",
                fontsize: responsive.h(15),
                maxWidth: responsive.w(90),
              }}
              numberOfLines={2}
              lineBreakMode="tail"
            >
              {`MS: ${item.apartmentName}`}
            </Text>
          </View>

          <View
            style={{
              marginVertical: responsive.h(10),
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
                {item.statusName}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
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
            margin: 10,
            fontSize: responsive.h(16),
            color: "black",
            textAlign: "center",
            fontFamily: "Inter-Medium",
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  renderActionSheetStatusName = ({ item }) => {
    //console.log('item', item)
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
              // this.props.onChangeDateName(item.Name)
              // this.props.onChangetuNgay(item.DateFrom)
              // this.props.onChangedenNgay(item.DateTo)
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
            margin: 10,
            fontSize: responsive.h(16),
            color: "black",
            textAlign: "center",
            fontFamily: "Inter-Medium",
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  renderCreateNote(item) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : ""}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0,0.3)",
        }}
      >
        {/* <CommentView
                    title="Phản hồi"
                    onChangeText={(description) => this.setState({ description })}
                    onYes={() => this._onCreate(item)}
                    onClose={() => this.setState({ showModal: false, modalView: null })}
                /> */}
      </KeyboardAvoidingView>
    );
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
    } = this.props;
    if (initList) {
      return (
        <View
          style={{
            paddingVertical: 20,
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
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        refreshing={isRefreshing}
        onRefresh={() => refreshDataHandle()}
        data={data}
        ItemSeparatorComponent={() => (
          <View style={{ backgroundColor: colors.grayBorder, height: 1 }} />
        )}
        renderItem={this.renderItem}
        contentContainerStyle={{
          marginVertical: responsive.h(10),
        }}
        // ListFooterComponent={this.renderFooter}
        // onEndReachedThreshold={0.5}
        // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
        // onEndReached={() => {
        //     if (!this.onEndReachedCalledDuringMomentum && !this.props.outOfStock && this.props.currentPage > 0 && !this.props.isLoading) {
        //         const data = {
        //             keyword: this.state.isApplySearchKey ? this.state.searchKey : '',
        //             currentPage: this.props.currentPage + 1,
        //             rowPerPage: this.props.rowPerPage
        //         };
        //         this.props.loadDataHandle(data);
        //     }
        // }}
      />
    );
  }
  item_click(item) {
    this.props.goListTaiSan(item);
  }
  renderActionSheetItemStatus = ({ item }) => {
    const { id, name, isUpdateTime, employeeId } = item;

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ showActionStatus: false }, () => {
            var dataSend = {
              id: this.state.item.id,
              statusId: id,
              statusName: name,
              employeeId: employeeId,
            };

            // console.log('HandOverChangeStatus Khach Hang',dataSend)
            // return

            this.props
              .HandOverChangeStatus(dataSend)
              .then((data) => {
                if (data.status === 1) {
                  if (!isUpdateTime) {
                    setTimeout(() => {
                      show("Thành công!");
                      this.props.refreshDataHandle();
                    }, 500);
                  }
                } else {
                  setTimeout(() => {
                    show(data.message);
                  }, 500);
                }
              })
              .then(() => {
                if (isUpdateTime) {
                  //nếu rơi vào trạng thái đang còn lỗi thì cập nhật lại thời gia dự kiến hoàn thành tiếp theo
                  this._showDateTimePicker();
                }
              });
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
            fontFamily: "Inter-Bold",
            fontSize: responsive.h(fontsize.medium),
            fontWeight: "500",
          }}
        >
          {name}
        </Text>
      </TouchableOpacity>
    );
  };
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  _handleDatePicked = (date) => {
    this.setState(
      {
        nam: date.getFullYear(),
        thang:
          (date.getMonth() + 1).toString().length === 1
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1,
        ngay:
          date.getDate().toString().length === 1
            ? "0" + date.getDate()
            : date.getDate(),
        gio:
          date.getHours().toString().length === 1
            ? "0" + date.getHours()
            : date.getHours(),
        phut:
          date.getMinutes().toString().length === 1
            ? "0" + date.getMinutes()
            : date.getMinutes(),
        giay:
          date.getSeconds().toString().length === 1
            ? "0" + date.getSeconds()
            : date.getSeconds(),
      },
      () => {
        this._hideDateTimePicker();

        var data = {
          Id: this.state.item.Id,
          FinishDate:
            this.state.ngay + "/" + this.state.thang + "/" + this.state.nam,
        };
        // console.log(data)
        // return

        this.props.HandOverFinishDate(data).then((data) => {
          if (data.status === 1) {
            setTimeout(() => {
              show("Thành công!");
              this.props.refreshDataHandle();
            }, 500);
          } else {
            setTimeout(() => {
              show(data.message);
            }, 500);
          }
        });
      }
    );
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavBar
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ paddingVertical: 10 }}
            >
              <MyIcon size={20} name="arrow" color="black" />
            </TouchableOpacity>
          }
          body={
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
              Bàn giao khách hàng
            </Text>
          }
          rightView={
            <TouchableOpacity style={{ paddingVertical: 10 }}>
              <MyIcon size={20} name="search" color="black" />
            </TouchableOpacity>
          }
        />
        {/* <TouchableOpacity
          onPress={() => this.setState({ showActionStatusName: true })}
          style={{
            backgroundColor: colors.white,
            paddingVertical: 10,
            paddingHorizontal: 10,
            alignItems: "center",
            justifyContent: "center",

            flexDirection: "row",
            marginTop: -20,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: fontsize.medium,
              textAlign: "center",
              fontFamily: "Inter-Bold",
            }}
          >
            {this.state.statusName}
          </Text>

          <Icon
            style={{ fontSize: fontsize.medium, marginHorizontal: 10 }}
            name="filter-list"
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 5,
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
              paddingVertical: 10,
              flex: 1,
              backgroundColor: colors.NoColor,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              borderRadius: 12,
              backgroundColor: "#ffffff",
              shadowColor: "rgba(0, 0, 0, 0.1)",
              elevation: 2,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowRadius: 10,
              shadowOpacity: 1,
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: fontsize.medium,
                fontWeight: "500",
              }}
            >
              {this.props.utils.Name}
            </Text>
            <Icon
              style={{ fontSize: fontsize.larg, marginLeft: 5 }}
              name="arrow-drop-down"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ isTuNgayPickerVisible: true })}
            style={{
              paddingVertical: 10,
              flex: 1,
              backgroundColor: colors.NoColor,
              alignItems: "center",
              borderRadius: 12,
              backgroundColor: "#ffffff",
              shadowColor: "rgba(0, 0, 0, 0.1)",
              elevation: 2,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowRadius: 10,
              shadowOpacity: 1,
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
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
              paddingVertical: 10,
              flex: 1,
              backgroundColor: colors.NoColor,
              alignItems: "center",
              borderRadius: 12,
              backgroundColor: "#ffffff",
              shadowColor: "rgba(0, 0, 0, 0.1)",
              elevation: 2,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowRadius: 10,
              shadowOpacity: 1,
              marginHorizontal: 10,
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
        </View> */}

        {/* {this._renderContent()} */}
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => this.setState({ showActionStatusName: true })}
            style={{
              backgroundColor: colors.white,
              paddingVertical: 10,
              paddingHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
              // borderBottomWidth: 0.5,
              // borderBottomColor: colors.appTheme,
              flexDirection: "row",
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
              {this.state.statusName}
            </Text>

            <Icon
              style={{ fontSize: fontsize.medium, marginHorizontal: 10 }}
              name="filter-list"
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginHorizontal: 10,
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
                paddingVertical: 10,
                flex: 1,
                backgroundColor: colors.NoColor,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                borderRadius: 12,
                backgroundColor: "#ffffff",
                //   shadowColor: "rgba(0, 0, 0, 0.1)",
                //   elevation: 2,
                //   shadowOffset: {
                //     width: 0,
                //     height: 4,
                //   },
                //   shadowRadius: 10,
                //   shadowOpacity: 1,
                marginHorizontal: 10,
                borderWidth: 0.5,
                borderColor: "#dcdcdc",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(fontsize.medium),
                  fontWeight: "500",
                }}
              >
                {this.props.utils.Name}
              </Text>
              <Icon
                style={{ fontSize: fontsize.larg, marginLeft: 5 }}
                name="arrow-drop-down"
                type="MaterialIcons"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setState({ isTuNgayPickerVisible: true })}
              style={{
                paddingVertical: 10,
                flex: 1,
                backgroundColor: colors.NoColor,
                alignItems: "center",
                borderRadius: 12,
                backgroundColor: "#ffffff",
                //   shadowColor: "rgba(0, 0, 0, 0.1)",
                //   elevation: 2,
                //   shadowOffset: {
                //     width: 0,
                //     height: 4,
                //   },
                //   shadowRadius: 10,
                //   shadowOpacity: 1,
                marginHorizontal: 10,
                borderWidth: 0.5,
                borderColor: "#dcdcdc",
              }}
            >
              <Text
                style={{
                  ontFamily: "Inter-Bold",
                  fontSize: responsive.h(fontsize.medium),
                  fontWeight: "500",
                }}
              >
                {getDate(this.props.utils.tuNgay)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setState({ isDenNgayPickerVisible: true })}
              style={{
                paddingVertical: 10,
                flex: 1,
                backgroundColor: colors.NoColor,
                alignItems: "center",
                borderRadius: 12,
                backgroundColor: "#ffffff",
                marginHorizontal: 10,

                borderWidth: 0.5,
                borderColor: "#dcdcdc",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(fontsize.medium),
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
              height: 15,
              width: "100%",
              marginVertical: 10,
            }}
          />

          {this._renderContent()}
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
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            cancelTextIOS="Huỷ"
            confirmTextIOS="Xác nhận"
            titleIOS="Chọn thời gian"
            mode="date"
            locale="vi_VN" //https://gist.github.com/jacobbubu/1836273
          />

          <TuNgayPicker
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
          />

          <DenNgayPicker
            date={new Date(this.props.utils.denNgay)}
            isVisible={this.state.isDenNgayPickerVisible}
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
            cancelTextIOS="Huỷ"
            confirmTextIOS="Xác nhận"
            titleIOS="Chọn thời gian"
            mode="date"
            locale="vi_VN" //https://gist.github.com/jacobbubu/1836273
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
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          cancelTextIOS="Huỷ"
          confirmTextIOS="Xác nhận"
          titleIOS="Chọn thời gian"
          mode="date"
          locale="vi_VN" //https://gist.github.com/jacobbubu/1836273
        />

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          cancelTextIOS="Huỷ"
          confirmTextIOS="Xác nhận"
          titleIOS="Chọn thời gian"
          mode="date"
          locale="vi_VN" //https://gist.github.com/jacobbubu/1836273
        />

        <TuNgayPicker
          date={new Date(this.props.utils.tuNgay)}
          isVisible={this.state.isTuNgayPickerVisible}
          onConfirm={(date) => {
            //console.log(date)
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
        />

        <DenNgayPicker
          date={new Date(this.props.utils.denNgay)}
          isVisible={this.state.isDenNgayPickerVisible}
          onConfirm={(date) => {
            //console.log(date)
            this.setState({ isDenNgayPickerVisible: false });
            this.props.onChangedenNgay(date);
            setTimeout(() => {
              this.props.refreshDataHandle();
            }, 500);
          }}
          onCancel={() => {
            this.setState({ isDenNgayPickerVisible: false });
          }}
          cancelTextIOS="Huỷ"
          confirmTextIOS="Xác nhận"
          titleIOS="Chọn thời gian"
          mode="date"
          locale="vi_VN" //https://gist.github.com/jacobbubu/1836273
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
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.auth.user,
  building: state.auth.towerId,
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  initList: state.checklist_dangthuchien_khachhang.initList,
  currentPage: state.checklist_dangthuchien_khachhang.currentPage,
  rowPerPage: state.checklist_dangthuchien_khachhang.rowPerPage,
  emptyData: state.checklist_dangthuchien_khachhang.emptyData,
  outOfStock: state.checklist_dangthuchien_khachhang.outOfStock,
  isLoading: state.checklist_dangthuchien_khachhang.isLoading,
  data: state.checklist_dangthuchien_khachhang.data,
  error: state.checklist_dangthuchien_khachhang.error,
  isRefreshing: state.checklist_dangthuchien_khachhang.isRefreshing,
  isApplySearchKey: state.checklist_dangthuchien_khachhang.isApplySearchKey,
  searchKey: state.checklist_dangthuchien_khachhang.searchKey,
  errorResponse: state.checklist_dangthuchien_khachhang.errorResponse,
  canNavigate: state.servicesBasicDetail.data == null,
  language: state.app.language == "vi" ? 1 : 2,
  utils: state.utils,
});

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
