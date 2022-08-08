//import liraries
import React, { Component } from "react";
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Modal,
  Image,
  SectionList,
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import FCM, {
  FCMEvent,
  NotificationType,
  WillPresentNotificationResult,
  RemoteNotificationResult,
} from "react-native-fcm";
import ImageProgress from "./components/common/ImageProgress";
import NavBar from "./components/common/NavBar";
import UpdateVersion from "../components/common/UpdateVersion";
import { MyIcon } from "./theme/icons";
import fontsize from "./theme/fontsize";
import _ from "lodash";
import ErrorContent from "./components/common/ErrorContent";
import { Screen } from "./utils/device";
import colors from "./theme/colors";
import { AddItemToList } from "./actions/notification";
import {
  getProfile,
  postFCMToken,
  delFCMTokenEmployee,
  checkVersion,
  updateProfile,
} from "./actions/auth";
import { loadDataHandle } from "./actions/vendorHome";
import {
  loadDataHandle as loadDataHandleNotify,
  resetStateByKey,
  refreshDataHandle,
  onSubmitEditing,
  onChangeText,
  onClearText,
} from "./actions/news";
import { loadBadge } from "../actions/badge";
import Strings from "./utils/languages";
import ActionSheet from "./components/common/ActionSheet";
import Icon from "react-native-vector-icons/FontAwesome";
import { default_user, default_baner } from "./theme/images";
import Swiper from "react-native-swiper";
import { color } from "react-native-reanimated";
//
import { checkAnswerSurvey } from "./actions/surveyDetail";
import { refreshDataHandle as refreshDataHandleCar } from "../resident/actions/carCard";
import {
  refreshDataHandle as refreshDataHandleServicesBasic,
  loadDataHandle as loadDataHandleBasic,
} from "../resident/actions/utilitiesServicesBasic";
import {
  refreshDataHandle as refreshDataHandleServicesExtension,
  loadDataHandle as loadDataHandleEx,
} from "../resident/actions/utilitiesServicesExtension";
import { loadDataHandle as loadDataHandleSurvey } from "../resident/actions/survey";
// import {
//     loadDataHandle as loadStatusRequest
// } from '../actions/home';

import responsive from "../resources/responsive";
import { icons } from "../resources/icons";

import * as ImagePicker from "react-native-image-picker";

// icon

export const IconText = ({ style, icon, text }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", ...style }}>
      <MyIcon name={icon} size={20} color="#0890fe" />
      <Text
        style={{
          fontFamily: "OpenSans-Regular",
          fontSize: 11,
          fontWeight: "normal",
          fontStyle: "normal",
          letterSpacing: 0,
          textAlign: "left",
          color: "#282828",
          marginLeft: 5,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

// create a component
class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);

    this.state = {
      showAction: false,
      //isShowModal: this.props.isSurvey ? false : true,
      isShowModal: false,
      rules: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
      this.props.getProfile({ type: "re", langId: this.props.langId });
    }
    if (
      nextProps.departmentId &&
      nextProps.departmentId !== this.props.departmentId
    ) {
      this.props.getProfile({ type: "re", langId: this.props.langId });
    }
    if (
      nextProps.initListNotify &&
      nextProps.initListNotify !== this.props.initListNotify
    ) {
      //console.log('1.')
      const data = {
        towerId: this.props.towerId,
        keyword: nextProps.isApplySearchKeyNotify
          ? nextProps.searchKeyNotify
          : "",
        currentPage: nextProps.currentPageNotify + 1,
        rowPerPage: this.props.rowPerPageNotify,
        typeNews: 1,
      };
      this.props.loadDataHandleNotify(data);
      this.loadData();
    }
    if (
      nextProps.isRefreshingNotify &&
      nextProps.isRefreshingNotify !== this.props.isRefreshingNotify &&
      !nextProps.isLoadingNotify
    ) {
      //console.log('2.')
      const data = {
        towerId: this.props.towerId,
        keyword: nextProps.isApplySearchKeyNotify
          ? nextProps.searchKeyNotify
          : "",
        currentPage: nextProps.currentPageNotify + 1,
        rowPerPage: this.props.rowPerPageNotify,
        typeNews: 1,
      };
      this.props.loadDataHandleNotify(data);
    }
    if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
      this.props.refreshDataHandle();
    }
  }

  async loadData() {
    this.props.getProfile({ type: "re", langId: this.props.langId });
    this.props.loadBadge({
      towerId: this.props.towerId,
      keyword: "",
      currentPage: 1,
      rowPerPage: 20,
      typeNews: 1,
      statusId: 0,
      langId: this.props.langId,
      departmentId: this.props.departmentId,
    });
    const request = {
      towerId: this.props.towerId,
    };
    this.props.checkVersion();
    await this.props.loadDataHandleSurvey({
      TowerID: this.props.towerId,
    });
    await setTimeout(() => {
      if (
        this.props.dataSurvey.filter(
          (item) =>
            item.isActive &&
            !item.isReply &&
            new Date(item.dateTo) >= new Date()
        ).length > 0
      ) {
        this.setState({ isShowModal: true });
      } else {
        this.setState({ isShowModal: false });
      }
    }, 500);
    // this.props.loadStatusRequest(request);
  }

  async componentDidMount() {
    this.props.resetStateByKey({ key: "initList", value: true });
    FCM.getFCMToken().then((token) => {
      this.props.postFCMToken(token, "resident");
      this.props.delFCMTokenEmployee(token);
    });

    await this.loadData();

    this.unsubscribe = FCM.on(FCMEvent.Notification, (notif) => {
      console.log("Notification", notif);
      if (notif.CountUnread) {
        FCM.setBadgeNumber(Number(notif.CountUnread));
        // FCM.presentLocalNotification({
        //     priority: "high",
        //     lights: true,
        //     //status: 'notif.status',
        //     channel: 'car_status',
        //     number: Number(notif.CountUnread),

        // });
      }
      this.props.refreshDataHandleCar();
      // this.props.refreshDataHandleServicesBasic()
      setTimeout(() => {
        this.props.refreshDataHandleServicesBasic();
        this.props.refreshDataHandleServicesExtension();
        const dataBaSic = {
          towerId: this.props.towerId,
          statusId: 0,
          keyword: "",
          currentPage: 1,
          rowPerPage: 20,
          serviceId: 0,
        };
        this.props.loadDataHandleBasic(dataBaSic);
        const dataEx = {
          towerId: this.props.towerId,
          statusId: 0,
          keyword: "",
          currentPage: 1,
          rowPerPage: 20,
          serviceId: 0,
          langId: this.props.langId,
        };
        this.props.loadDataHandleEx(dataEx);
      }, 500);

      //
      this.props.loadBadge({
        towerId: this.props.towerId,
        keyword: "",
        currentPage: 1,
        rowPerPage: 20,
        typeNews: 1,
        statusId: 0,
        langId: this.props.langId,
        departmentId: this.props.departmentId,
      });

      if (notif.actionId == "10") {
        this.props.checkAnswerSurvey(false);
        this.setState({ isShowModal: true });
      }
      const itemData = notif.item ? JSON.parse(notif.item) : null;
      if (notif && Platform.OS === "android" && !notif.local_notification) {
        FCM.presentLocalNotification({
          body: notif.body,
          priority: "high",
          title: notif.title,
          sound: "default",
          large_icon: "icon", // Android only
          icon: "icon",
          show_in_foreground: true,
          vibrate: 300,
          lights: true,
          //status: 'notif.status',
          channel: "car_status",
          actionId: notif.actionId,
          itemData: notif && notif.item ? JSON.parse(notif.item) : null,
          // //number: 100,
          content_available: true,
          //number: Number(notif.CountUnread),
        });
      }
      // Tạo notification Local khi app đang chế độ foreground
      if (
        Platform.OS === "ios" &&
        notif._notificationType === NotificationType.WillPresent &&
        !notif.local_notification
      ) {
        // this notification is only to decide if you want to show the notification when user if in foreground.
        // usually you can ignore it. just decide to show or not.
        notif.finish(WillPresentNotificationResult.All);
        this.props.AddItemToList(itemData);
        return;
      }
      if (
        Platform.OS === "ios" &&
        notif._notificationType === NotificationType.NotificationResponse &&
        !notif.local_notification
      ) {
        //console.log(NotificationType.NotificationResponse)
        // this notification is only to decide if you want to show the notification when user if in foreground.
        // usually you can ignore it. just decide to show or not.
        //vì ở chế độ này set number chạy 2 lần nên phải trừ bớt 1
        notif.finish(WillPresentNotificationResult.All);
        //console.log(notif)
        if (notif.opened_from_tray) {
          if (notif.itemData) {
            switch (notif.actionId) {
              case "1": //Yêu cầu
                setTimeout(() => {
                  this.props.navigation.navigate(
                    "requestDetailResident",
                    notif.itemData
                  );
                }, 500);
                break;

              case "2": //Tin tức
                setTimeout(() => {
                  this.props.navigation.navigate("newsDetail", {
                    item: {
                      id: itemData.linkid,
                      towerId: itemData.towerId,
                      towerName: itemData.towerName,
                    },
                    type: 1,
                  });
                }, 500);
                break;

              case "3": //Tiện ích
                setTimeout(() => {
                  this.props.navigation.navigate("serviceBasicDetail", {
                    id: notif.itemData.id,
                  });
                }, 500);
                break;

              case "4": //Dịch vụ
                setTimeout(() => {
                  this.props.navigation.navigate(
                    "serviceExtensionDetailResident",
                    { id: notif.itemData.id }
                  );
                }, 500);
                break;
              case "9": //Dịch vụ
                setTimeout(() => {
                  this.props.navigation.navigate("handoverSchedule", {
                    date: item.dateHandover,
                  });
                }, 500);
                break;
              case "10": //Khảo sát
                setTimeout(() => {
                  this.props.navigation.navigate("surveyDetail", {
                    id: notif.itemData.id,
                    name: notif.itemData.title,
                  });
                }, 500);
                break;
              case "13": //Thẻ xe
                setTimeout(() => {
                  this.props.navigation.navigate("carCardList");
                }, 500);
                break;
              case "14": //Thẻ xe
                setTimeout(() => {
                  this.props.navigation.navigate("carCardList");
                }, 500);
                break;
            }
          } else {
            switch (notif.actionId) {
              case "1": //Yêu cầu
                setTimeout(() => {
                  this.props.navigation.navigate(
                    "requestDetailResident",
                    itemData
                  );
                }, 500);
                break;

              case "2": //Tin tức
                setTimeout(() => {
                  this.props.navigation.navigate("newsDetail", {
                    item: {
                      id: itemData.linkid,
                      towerId: itemData.towerId,
                      towerName: itemData.towerName,
                    },
                    type: 1,
                  });
                }, 500);
                break;

              case "3": //Tiện ích
                setTimeout(() => {
                  this.props.navigation.navigate("serviceBasicDetail", {
                    id: itemData.id,
                  });
                }, 500);
                break;

              case "4": //Dịch vụ
                setTimeout(() => {
                  this.props.navigation.navigate(
                    "serviceExtensionDetailResident",
                    { id: itemData.id }
                  );
                }, 500);
                break;
              case "9": //Dịch vụ
                setTimeout(() => {
                  this.props.navigation.navigate("handoverSchedule", {
                    date: item.dateHandover,
                  });
                }, 500);
                break;
              case "10": //Khảo sát
                setTimeout(() => {
                  this.props.navigation.navigate("surveyDetail", {
                    id: itemData.id,
                    name: itemData.title,
                  });
                }, 500);
                break;
              case "13": //Thẻ xe
                setTimeout(() => {
                  this.props.navigation.navigate("carCardList");
                }, 500);
                break;
              case "14": //Thẻ xe
                setTimeout(() => {
                  this.props.navigation.navigate("carCardList");
                }, 500);
                break;
            }
          }
        }
        return;
      }
      if (notif.opened_from_tray) {
        if (notif.itemData) {
          switch (notif.actionId) {
            case "1": //Yêu cầu
              setTimeout(() => {
                this.props.navigation.navigate(
                  "requestDetailResident",
                  notif.itemData
                );
              }, 500);
              break;

            case "2": //Tin tức
              setTimeout(() => {
                this.props.navigation.navigate("newsDetail", {
                  item: {
                    id: itemData.linkid,
                    towerId: itemData.towerId,
                    towerName: itemData.towerName,
                  },
                  type: 1,
                });
              }, 500);
              break;

            case "3": //Tiện ích
              setTimeout(() => {
                this.props.navigation.navigate("serviceBasicDetail", {
                  id: notif.itemData.id,
                });
              }, 500);
              break;

            case "4": //Dịch vụ
              setTimeout(() => {
                this.props.navigation.navigate(
                  "serviceExtensionDetailResident",
                  { id: notif.itemData.id }
                );
              }, 500);
              break;
            case "9": //Dịch vụ
              setTimeout(() => {
                this.props.navigation.navigate("handoverSchedule", {
                  date: item.dateHandover,
                });
              }, 500);
              break;
            case "10": //Khảo sát
              setTimeout(() => {
                this.props.navigation.navigate("surveyDetail", {
                  id: notif.itemData.id,
                  name: notif.itemData.title,
                });
              }, 500);
              break;
            case "13": //Thẻ xe
              setTimeout(() => {
                this.props.navigation.navigate("carCardList");
              }, 500);
              break;
            case "14": //Thẻ xe
              setTimeout(() => {
                this.props.navigation.navigate("carCardList");
              }, 500);
              break;
          }
        } else {
          switch (notif.actionId) {
            case "1": //Yêu cầu
              setTimeout(() => {
                this.props.navigation.navigate(
                  "requestDetailResident",
                  itemData
                );
              }, 500);
              break;

            case "2": //Tin tức
              setTimeout(() => {
                this.props.navigation.navigate("newsDetail", {
                  item: {
                    id: itemData.linkid,
                    towerId: itemData.towerId,
                    towerName: itemData.towerName,
                  },
                  type: 1,
                });
              }, 500);
              break;

            case "3": //Tiện ích
              setTimeout(() => {
                this.props.navigation.navigate("serviceBasicDetail", {
                  id: itemData.id,
                });
              }, 500);
              break;

            case "4": //Dịch vụ
              setTimeout(() => {
                this.props.navigation.navigate(
                  "serviceExtensionDetailResident",
                  { id: itemData.id }
                );
              }, 500);
              break;
            case "9": //Dịch vụ
              setTimeout(() => {
                this.props.navigation.navigate("handoverSchedule", {
                  date: item.dateHandover,
                });
              }, 500);
              break;
            case "10": //Khảo sát
              setTimeout(() => {
                this.props.navigation.navigate("surveyDetail", {
                  id: itemData.id,
                  name: itemData.title,
                });
              }, 500);
              break;
            case "13": //Thẻ xe
              setTimeout(() => {
                this.props.navigation.navigate("carCardList");
              }, 500);
              break;
            case "14": //Thẻ xe
              setTimeout(() => {
                this.props.navigation.navigate("carCardList");
              }, 500);
              break;
          }
        }
      }
      if (Platform.OS === "ios") {
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData);
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All);
            break;
        }
      }
      {
        /*const itemData = JSON.parse(notif.item);
            // Tạo notification Local khi app đang chế độ foreground
            if (Platform.OS === 'ios' && notif._notificationType === NotificationType.WillPresent && !notif.local_notification) {
                notif.finish(WillPresentNotificationResult.All)
                this.props.AddItemToList(itemData)
                return;
            }
            if (notif.opened_from_tray) {
                switch (notif.actionId) {
                    case "1"://Yêu cầu
                        setTimeout(() => {
                            this.props.navigation.navigate('requestDetailResident', itemData)
                        }, 500)
                        break;

                    case "2"://Tin tức
                        setTimeout(() => {
                            this.props.navigation.navigate('newsDetail', { item: itemData, type: itemData.typeId })
                        }, 500)
                        break;

                    case "3"://Tiện ích
                        setTimeout(() => {
                            this.props.navigation.navigate('serviceBasicDetail', { id: itemData.id });
                        }, 500)
                        break;

                    case "4"://Dịch vụ
                        setTimeout(() => {
                            this.props.navigation.navigate('serviceExtensionDetailResident', { id: itemData.id });
                        }, 500);
                        break;
                    case "9"://Dịch vụ
                        setTimeout(() => {
                            this.props.navigation.navigate('handoverSchedule', { date: item.dateHandover })
                        }, 500);
                        break;
                    case "10"://Khảo sát
                        setTimeout(() => {
                            this.props.navigation.navigate('surveyDetail', { id: itemData.id, name: itemData.title })
                        }, 500);
                        break;
                }
            } else if (Platform.OS === 'android' && !notif.local_notification) {
                //console.log("Platform.OS === android");

                FCM.presentLocalNotification({
                    vibrate: 500,
                    title: "Hello",
                    body: "Test Notification",
                    big_text: "i am large, i am large, i am large, i am large,",
                    show_in_foreground: true,
                    number: 10
                });

                if (notif.actionId === 2)
                    this.props.AddItemToList(itemData);
            }

            if (Platform.OS === 'ios') {
                switch (notif._notificationType) {
                    case NotificationType.Remote:
                        notif.finish(RemoteNotificationResult.NewData)
                        break;
                    case NotificationType.NotificationResponse:
                        notif.finish();
                        break;
                    case NotificationType.WillPresent:
                        notif.finish(WillPresentNotificationResult.All)
                        break;
                }
            } */
      }
    });
    this.props.getProfile({ type: "re", langId: this.props.langId });
  }
  // componentWillUnmount() {
  //   this.props.resetStateByKey({ key: "state" });
  // }
  renderItem = ({ item }) => {
    const {
      id,
      dateCreate,
      imageUrl,
      shortDescription,
      totalRead,
      title,
    } = item;
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("newsDetail", {
            item: {
              ...item,
              towerId: this.props.towerId,
              title: title,
              towerName: this.props.user.towerName,
            },
            type: 1,
          })
        }
        style={{
          borderRadius: 12,
          backgroundColor: "#ffffff",
          shadowColor: "rgba(0, 0, 0, 0.1)",
          elevation: 2,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowRadius: 14,
          shadowOpacity: 1,
          marginHorizontal: 10,
          marginBottom: 10,
          width: responsive.w(182),
          height: responsive.h(216),
        }}
      >
        <View>
          <ImageProgress
            style={{
              height: responsive.h(126),
              width: responsive.w(174),
              borderRadius: responsive.h(12),
            }}
            source={{ uri: imageUrl }}
          />
          <Text
            lineBreakMode="tail"
            numberOfLines={2}
            style={{
              flexDirection: "row",
              fontFamily: "Inter-SemiBold",
              fontSize: responsive.h(14),
              fontWeight: "bold",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
              color: "#000000",
              maxWidth: responsive.w(150),
              paddingTop: responsive.h(10),
              paddingLeft: responsive.w(10),
            }}
          >
            {title}
          </Text>
          <View
            style={{
              padding: 10,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <IconText icon="ic_luot_xem" text={totalRead} />
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 11,
                  fontWeight: "normal",
                  fontStyle: "normal",
                  lineHeight: 22,
                  textAlign: "left",
                  color: "#6f6f6f",
                }}
              >
                {moment(dateCreate).format("DD/MM/YYYY HH:mm")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  rednerItemFee(fees) {
    const { user } = this.props;
    const { amountIncurred, amountPaid, isPaid, time, title } = fees;

    if (isPaid) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("paymentDetail", { time })
        }
        style={{
          flexDirection: "row",
          // padding: 10,
          borderLeftWidth: 5,
          borderLeftColor: "#e31818",
          borderColor: colors.grayBorder,
          borderWidth: 1,
        }}
      >
        <ImageProgress
          circle={true}
          source={{ uri: user ? user.photoUrl : "" }}
          style={{ height: 50, width: 50 }}
        />
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text>{title}</Text>
          <Text style={{ color: "red", fontWeight: "bold" }}>
            {amountIncurred.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
            VNĐ
          </Text>
        </View>
        <View
          style={{
            width: "30%",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Text style={{ fontSize: fontsize.micro, color: colors.gray1 }}>
            {time}
          </Text>
          <Text
            style={{
              fontSize: fontsize.micro,
              color: isPaid ? colors.blue : colors.red,
            }}
          >
            {isPaid ? Strings.payment.paidStatus : Strings.payment.unpaidStatus}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  renderActionSheetItem = ({ item }) => {
    const { id, name } = item;
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({ showAction: false }, () =>
            setTimeout(
              () => this.props.navigation.navigate("ruleDetail", { ...item }),
              600
            )
          )
        }
        style={{
          borderBottomColor: colors.grayBorder,
          borderBottomWidth: 0.5,
          borderTopColor: colors.grayBorder,
          borderTopWidth: 0.5,
          alignItems: "center",
        }}
      >
        <Text
          style={{ margin: 10, color: colors.blue, fontSize: fontsize.larg }}
        >
          {name}
        </Text>
      </TouchableOpacity>
    );
  };
  renderContent() {
    const {
      isLoading,
      data,
      error,
      initComponent,
      user,
      dataNotify,
      isRefreshingNotify,
      refreshDataHandle,
      emptyDataNotify,
      errorNotify,
    } = this.props;
    //console.log(this.props)
    if (initComponent) {
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
    if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => {
            this.props.getProfile({ type: "re", langId: this.props.langId }),
              this.props.refreshDataHandle();
          }}
        />
      );
    }
    if (emptyDataNotify) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => {
            this.props.getProfile({ type: "re", langId: this.props.langId }),
              this.props.refreshDataHandle();
          }}
        />
      );
    }
    const { banner, fees } = data;
    return (
      <View style={{ flex: 1 }}>
        {!_.isNil(fees) &&
          !_.isNil(fees.amountIncurred) &&
          this.rednerItemFee(fees)}
        {/* <ScrollView style={{ marginTop: 10}} showsVerticalScrollIndicato={false}> */}

        {/* <FlatList
                    keyExtractor={(item, index) => `${index}`}
                    scrollEnabled={false}
                    data={data.newsNewest}
                    renderItem={this.renderItem}
                    ListEmptyComponent={<View style={{ justifyContent: 'center', alignItems: 'center' }}><Text>{Strings.app.emptyData}</Text></View>}
                /> */}
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            backgroundColor: "white",

            maxHeight: responsive.h(550),
            // marginHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "OpenSans-Bold",
              fontSize: fontsize.medium,
              fontWeight: "bold",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
              color: "#000000",
              marginTop: 10,
              marginBottom: 10,
              paddingHorizontal: 20,
            }}
          >
            {Strings.home.titleNews1}
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("listNewsEm")}
          >
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-between",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "OpenSans-Regular",
                  paddingHorizontal: 5,
                  marginTop: 10,
                  letterSpacing: 0,
                  marginBottom: 10,
                  fontsize: fontsize.medium,
                  color: "#afaeae",
                }}
              >
                {Strings.home.moreNews}
              </Text>
              <MyIcon
                name="arrow-right"
                size={14}
                color="#afaeae"
                style={{
                  marginTop: 12,
                  letterSpacing: 0,
                  marginBottom: 10,
                  marginRight: 10,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        {errorNotify && errorNotify.hasError ? (
          <ErrorContent
            title={Strings.app.error}
            onTouchScreen={() => refreshDataHandle()}
          />
        ) : (
          <FlatList
            refreshing={isRefreshingNotify}
            onRefresh={() => {
              refreshDataHandle(),
                this.props.getProfile({
                  type: "re",
                  langId: this.props.langId,
                });
            }}
            data={dataNotify || []}
            keyExtractor={(item, index) => `${index}`}
            renderItem={this.renderItem}
            // onEndReachedThreshold={0.5}
            numColumns={2}
            onEndReached={() => {
              if (
                !this.onEndReachedCalledDuringMomentum &&
                !this.props.outOfStockNotify &&
                this.props.currentPageNotify > 0 &&
                !this.props.isLoadingNotify
              ) {
                const data = {
                  towerId: this.props.towerId,
                  keyword: this.props.isApplySearchKeyNotify
                    ? this.props.searchKeyNotify
                    : "",
                  currentPage: this.props.currentPageNotify + 1,
                  rowPerPage: this.props.rowPerPageNotify,
                  typeNews: 1,
                };
                this.props.loadDataHandleNotify(data);
              }
            }}
            contentContainerStyle={{
              backgroundColor: "white",
            }}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            ListFooterComponent={this.renderFooter}
          />
        )}
        {/* </ScrollView> */}
      </View>
    );
  }
  renderBanner() {
    const {
      isLoading,
      data,
      error,
      initComponent,
      user,
      dataNotify,
      isRefreshingNotify,
      refreshDataHandle,
      emptyDataNotify,
      errorNotify,
    } = this.props;
    console.log(this.props);
    if (initComponent) {
      return (
        <View>
          <ActivityIndicator animating size="small" />
        </View>
      );
    }
    if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => {
            this.props.getProfile({ type: "re", langId: this.props.langId }),
              this.props.refreshDataHandle();
          }}
        />
      );
    }
    if (emptyDataNotify) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => {
            this.props.getProfile({ type: "re", langId: this.props.langId }),
              this.props.refreshDataHandle();
          }}
        />
      );
    }
    const { banner } = data;
    const pageData = data.newsNewest.map((o, index) => (
      // <TouchableOpacity
      //   onPress={() =>
      //     this.props.navigation.navigate("newsDetail", {
      //       item: {
      //         ...o,
      //         towerId: this.props.towerId,
      //         title: o.shortDescription,
      //         towerName: this.props.user.towerName,
      //       },
      //       type: 1,
      //     })
      //   }
      // >
      <ImageProgress
        source={{ uri: data.banner.link }}
        style={{
          height: responsive.h(180),
          width: "100%",
        }}
      />

      // </TouchableOpacity>
    ));

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            borderRadius: 20,
            backgroundColor: "#ffffff",
            shadowColor: "rgba(0, 0, 0, 0.1)",
            elevation: 2,
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowRadius: 20,
            shadowOpacity: 1,
            height: responsive.h(180),
            // marginHorizontal: 20,
          }}
        >
          <Swiper
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
            autoplay={true}
            autoplayTimeout={5}
            paginationStyle={{ bottom: 5 }}
            showsButtons={false}
          >
            {data !== undefined || data.length === 0 ? (
              <Image
                style={{
                  height: responsive.h(180),
                  width: "100%",
                }}
                source={default_baner}
              />
            ) : (
              pageData
            )}
          </Swiper>
        </View>
        {/* {!_.isNil(fees) &&
          !_.isNil(fees.amountIncurred) &&
          this.rednerItemFee(fees)} */}
      </View>
    );
  }

  renderFooter = () => {
    if (!this.props.isLoadingNotify || this.props.isRefreshingNotify)
      return null;
    return (
      <View
        style={{
          paddingVertical: 20,
        }}
      >
        <ActivityIndicator animating size="small" />
      </View>
    );
  };
  // renderListMenu = ({ item }) => {
  //   return (
  //     <TouchableOpacity
  //       onPress={() => {
  //         switch (item.id) {
  //           case 1:
  //             break;
  //           case 2:
  //             break;
  //           case 3:
  //             break;
  //           case 4:
  //             break;
  //           case 5:
  //             break;
  //           case 6:
  //             break;
  //           case 7:
  //             break;
  //           case 8:
  //             break;
  //           case 9:
  //             break;
  //         }
  //       }}
  //       style={{
  //         height: responsive.h(130),
  //         width: responsive.w(128),
  //         alignItems: "center",
  //         borderBottomWidth: 2,
  //         borderRightWidth: 2,
  //         borderColor: "#f5f5f5",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <View
  //         style={{
  //           paddingVertical: responsive.h(7),
  //           paddingHorizontal: responsive.w(25),
  //         }}
  //       >
  //         {/* <MyIcon
  //           name={item.icon}
  //           size={responsive.h(34)}
  //           style={{ alignSelf: "center" }}
  //         /> */}
  //         <Image
  //           source={item.icon}
  //           style={{
  //             // height: responsive.h(40),
  //             // width: responsive.w(40),
  //             alignSelf: "center",
  //             marginVertical: responsive.h(10),
  //           }}
  //         />
  //         <Text
  //           style={{
  //             color: "black",
  //             fontSize: responsive.h(14),
  //             fontFamily: "OpenSans-Regular",
  //             fontStyle: "normal",
  //             fontWeight: "700",
  //             maxWidth: responsive.w(70),
  //             textAlign: "center",
  //           }}
  //         >
  //           {item.name}
  //         </Text>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  render() {
    const listMenuItem = [
      {
        id: 1,
        name: Strings.home.projectInformation,
        icon: icons.infoProject,
      },
      {
        id: 2,
        name: Strings.home.registeredUtility,
        icon: icons.utils,
      },
      {
        id: 3,
        name: Strings.home.registeredService,
        icon: icons.registeredService,
      },
      {
        id: 4,
        name: Strings.home.survey,
        icon: icons.survey,
      },
      {
        id: 5,
        name: Strings.home.carCard,
        icon: icons.card,
      },
      {
        id: 6,
        name: Strings.home.contact,
        icon: icons.contact,
      },
      {
        id: 7,
        name: Strings.home.buildingList,
        icon: icons.towerList,
      },
      {
        id: 8,
        name: Strings.home.roleChange,
        icon: icons.person,
      },
      {
        id: 9,
        name: Strings.home.accountManagement,
        icon: icons.personSt,
      },
    ];
    console.log("props", this.props);
    console.log(this.state);
    const { user, badge } = this.props;
    const uri = user ? { uri: user.photoUrl } : default_user;

    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <View style={{ padding: 10, flexDirection: "row" }}>
              <TouchableOpacity onPress={() => this._onAttachment()}>
                <ImageProgress
                  style={{
                    height: 40,
                    width: 40,
                  }}
                  circle={true}
                  resizeMode="stretch"
                  type="0"
                  source={user && !_.isNil(user.photoUrl) ? uri : default_user}
                />
              </TouchableOpacity>

              <View style={{ marginLeft: 10, justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: responsive.h(16),
                    fontFamily: "OpenSans-Bold",

                    fontWeight: "bold",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "black",
                  }}
                >
                  {user ? user.fullName : ""}
                </Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <MyIcon
                    name="call"
                    color="black"
                    size={12}
                    style={{
                      marginRight: responsive.w(3),
                      marginVertical: responsive.h(3),
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "bold",
                      fontStyle: "normal",
                      letterSpacing: 0,
                      textAlign: "left",
                      color: "black",
                      fontSize: responsive.h(14),
                    }}
                  >
                    {user ? user.phoneNumber : ""}
                  </Text>
                </View>
              </View>
            </View>
          }
          rightView={
            <View>
              <View style={{ flexDirection: "row" }}>
                {this.props.data && this.props.data.rules.length > 0 ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        showAction: true,
                        rules: this.props.data.rules,
                      })
                    }
                  >
                    <MyIcon name="ic_quy_dinh1" color="black" size={20} />
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("notificationResident")
                  }
                >
                  <MyIcon
                    name="home2"
                    color="black"
                    size={20}
                    style={{ paddingHorizontal: 10 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          }
        />
        <ScrollView style={{ backgroundColor: "#f5f5f5" }}>
          <UpdateVersion version={this.props.version} />
          {this.renderBanner()}
          <View
            style={{
              marginBottom: responsive.h(20),
              backgroundColor: "white",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                textAlign: "center",
                fontSize: responsive.h(20),
                color: "black",
                paddingTop: responsive.h(20),
                backgroundColor: "white",
              }}
            >
              {Strings.home.categories}
            </Text>
            <Image
              source={require("../resources/line.png")}
              height={responsive.h(5)}
              style={{
                alignSelf: "center",
                marginTop: 10,
                marginBottom: 20,
              }}
            />
            <SafeAreaView>
              <FlatList
                data={listMenuItem}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      switch (item.id) {
                        case 1:
                          this.props.navigation.navigate("department");
                          break;
                        case 2:
                          this.props.navigation.navigate(
                            "serviceBasicResident"
                          );
                          break;
                        case 3:
                          this.props.navigation.navigate(
                            "serviceExtensionResident"
                          );
                          break;
                        case 4:
                          this.props.navigation.navigate("survey");
                          break;
                        case 5:
                          this.props.navigation.navigate("carCardList");
                          break;
                        case 6:
                          this.props.navigation.navigate("hotline");
                          break;
                        case 7:
                          this.props.navigation.navigate("building");
                          break;
                        case 8:
                          break;
                        case 9:
                          this.props.navigation.navigate("profile");
                          break;
                      }
                    }}
                    style={{
                      height: responsive.h(130),
                      width: responsive.w(128),
                      alignItems: "center",
                      borderBottomWidth: 2,
                      borderRightWidth: 2,
                      borderColor: "#f5f5f5",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        paddingVertical: responsive.h(7),
                        paddingHorizontal: responsive.w(25),
                      }}
                    >
                      {/* <MyIcon
                      name={item.icon}
                      size={responsive.h(34)}
                      style={{ alignSelf: "center" }}
                    /> */}
                      {/* <Image
                        source={item.icon}
                        style={{
                          // height: responsive.h(40),
                          // width: responsive.w(40),
                          alignSelf: "center",
                          marginVertical: responsive.h(10),
                        }}
                      /> */}
                      <MyIcon
                        name={item.icon}
                        size={responsive.h(31)}
                        color="black"
                        style={{
                          alignSelf: "center",
                          marginVertical: responsive.h(10),
                        }}
                      />
                      <Text
                        style={{
                          color: "black",
                          fontSize: responsive.h(14),
                          fontFamily: "Inter-SemiBold",
                          maxWidth: responsive.w(70),
                          textAlign: "center",
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderLeftWidth: 2,
                  borderTopWidth: 2,
                  borderColor: "#f5f5f5",
                  maxWidth: responsive.w(385),
                  Width: responsive.w(385),
                  maxHeight: responsive.h(391),
                  alignSelf: "center",
                  marginVertical: responsive.h(10),
                  backgroundColor: "white",
                }}
                scrollEnabled={false}
              />
            </SafeAreaView>
          </View>
          {this.renderContent()}
          <View
            style={{
              marginBottom: 10,
              backgroundColor: "white",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Bold",
                fontSize: fontsize.medium,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#000000",
                marginTop: 10,
                marginBottom: 10,
                paddingHorizontal: 20,
              }}
            >
              {Strings.home.help}
            </Text>
            <Image
              source={require("../resources/banner.png")}
              style={{
                height: responsive.h(160),
                width: responsive.w(380),
                alignSelf: "center",
              }}
            />
          </View>

          <Modal
            animationType="slide"
            transparent
            visible={
              this.props.user &&
              this.props.user.isChangePass != undefined &&
              this.props.user.isChangePass == true &&
              this.state.isShowModal
            }
            onRequestClose={() => console.log("onClose Modal")}
          >
            <View
              style={{
                flex: 1,
                // backgroundColor: colors.appOverView,.
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 300,
                  width: 300,
                  backgroundColor: "#6A961F",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <Image
                  style={{ height: 150, width: 150 }}
                  source={require("../resources/survey.png")}
                />
                <Text style={{ fontFamily: "OpenSans-Bold", color: "#fff" }}>
                  {Strings.surveyDetail.titleModal}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 20,
                    alignSelf: "center",
                    marginBottom: 10,
                    borderTopWidth: 1,
                    borderColor: "#fff",
                    paddingTop: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      padding: 5,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      borderWidth: 1,
                      borderColor: colors.appTheme,
                      color: colors.appTheme,
                    }}
                    onPress={() => this.setState({ isShowModal: false })}
                  >
                    <Text>{Strings.surveyDetail.cancal}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("survey"),
                        this.setState({ isShowModal: false });
                    }}
                    style={{
                      marginLeft: 50,
                      padding: 5,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: colors.appTheme,
                    }}
                  >
                    <Text style={{ color: "#fff" }}>
                      {Strings.surveyDetail.agree}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <ActionSheet
            onClose={() => this.setState({ showAction: false })}
            visible={this.state.showAction}
            data={this.state.rules}
            renderItem={this.renderActionSheetItem}
          />
        </ScrollView>
      </View>
      //         <View style={styles.container}>
      //     <Svg height={50} width={Screen.width/5}>
      //       <Path
      //         d="M-17.5 378.5C31.5 32.5 302.5 463 375 89C447.5 -285 375 644 375 644H0C0 644 -66.5 724.5 -17.5 378.5Z" // put your path here
      //         fill="blue"
      //         stroke="blue"
      //       />
      //     </Svg>
      //     <View style={{backgroundColor: 'blue', flex: 1}}>
      //     </View>
      //   </View>
    );
  }
  _onAttachment = () => {
    const options = {
      quality: 1.0,
      maxWidth: 512,
      maxHeight: 512,
      storageOptions: {
        skipBackup: true,
      },
      title: Strings.createRequest.takeAPhoto,
      takePhotoButtonTitle: Strings.createRequest.chooseAnImage,
      chooseFromLibraryButtonTitle: Strings.createRequest.SelectFromGallery,
      cancelButtonTitle: Strings.createRequest.cancel,
      permissionDenied: {
        title: Strings.createRequest.access,
        text: Strings.createRequest.access2,
        reTryTitle: Strings.createRequest.retry,
        okTitle: Strings.createRequest.allow,
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("Response showImagePicker = ", response);
      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const image = {
          data: response.data,
          uri: response.uri,
          type:
            Platform.OS === "ios"
              ? mineTypes.lookup(response.uri)
              : response.type,
          fileName: response.fileName,
        };
        this.props.updateProfile({
          image,
          fullName: this.props.user.fullName,
        });
      }
    });
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  dot: {
    width: 5,
    height: 5,
    marginHorizontal: 5,
    borderRadius: 7,
    backgroundColor: "rgb(206, 209, 212)",
  },
  activeDot: {
    width: 5,
    height: 5,
    marginHorizontal: 5,
    borderRadius: 7,
    backgroundColor: "rgb(105, 109, 116)",
  },
  IconBadge: {
    top: -7,
    right: 8,
    position: "absolute",
    borderRadius: 45,
    minWidth: 20,
    minHeight: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0000",
  },
});

const mapStateToProps = (state) => ({
  departmentId: state.auth.user ? state.auth.user.spaceMainId : 0,
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  initComponent: state.vendorHome.initComponent,
  data: state.vendorHome.data,
  isLoading: state.vendorHome.isLoading,
  error: state.vendorHome.error,
  language: state.app.language,
  user: state.auth.user,
  badge: state.badge,
  //departmentId: state.auth.user ? state.auth.user.spaceMainId : 0,
  langId: state.app.language == "vi" ? 1 : 2,
  isLoadingChangeUser: state.auth.isLoading,
  dataNotify: state.news.data,
  isLoadingNotify: state.news.isLoading,
  initListNotify: state.news.initList,
  isRefreshingNotify: state.news.isRefreshing,
  currentPageNotify: state.news.currentPage,
  rowPerPageNotify: state.news.rowPerPage,
  emptyDataNotify: state.news.emptyData,
  outOfStockNotify: state.news.outOfStock,
  errorNotify: state.news.error,
  isApplySearchKeyNotify: state.news.isApplySearchKey,
  searchKeyNotify: state.news.searchKey,
  connectString: state.auth.connectString,
  isSurvey: state.auth.isSurvey,
  dataSurvey: state.survey.data,
  version: state.version.version,
});

const mapActionToState = {
  loadDataHandle,
  AddItemToList,
  getProfile,
  postFCMToken,
  loadBadge,
  loadDataHandleNotify,
  resetStateByKey,
  refreshDataHandle,
  delFCMTokenEmployee,
  checkAnswerSurvey,
  refreshDataHandleCar,
  refreshDataHandleServicesBasic,
  refreshDataHandleServicesExtension,
  loadDataHandleBasic,
  loadDataHandleEx,
  loadDataHandleSurvey,
  checkVersion,
  updateProfile,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(HomeScreen);
