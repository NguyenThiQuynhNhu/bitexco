//import liraries
import React, { Component, useCallback } from "react";
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
  Linking,
  RefreshControl
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import FCM, {
  FCMEvent,
  NotificationType,
  WillPresentNotificationResult,
  RemoteNotificationResult,
} from "react-native-fcm";
import * as mineTypes from "react-native-mime-types";
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
import Svg, { Path } from 'react-native-svg';
import { getPath, getPathUp } from './theme/path';
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

import ImagePicker from "react-native-image-picker";

// icon

export const IconText = ({ style, icon, text }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", ...style }}>
      <MyIcon name={icon} size={responsive.h(20)} color="#0890fe" />
      <Text
        style={{
          fontFamily: "OpenSans-Regular",
          fontSize: responsive.h(11),
          fontWeight: "normal",
          fontStyle: "normal",
          letterSpacing: 0,
          textAlign: "left",
          color: "#282828",
          marginLeft: responsive.h(5),
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
      this.props.getProfile({ type: "re", langId: this.props.langId, towers: this.props.user.towers });
    }
    if (
      nextProps.departmentId &&
      nextProps.departmentId !== this.props.departmentId
    ) {
      this.props.getProfile({ type: "re", langId: this.props.langId, towers: this.props.user.towers });
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

    this.props.getProfile({ type: "re", langId: this.props.langId, towers: this.props.user.towers });
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
                  this.props.navigation.navigate("serviceBasicDetailResident", {
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
    });
    this.props.getProfile({ type: "re", langId: this.props.langId, towers: this.props.user.towers });
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
          backgroundColor: "#fff",
          borderRadius: responsive.h(12),
          backgroundColor: "#ffffff",
          width: (Screen.width - responsive.h(40)) / 2,
          marginBottom: responsive.h(10),
          marginRight: responsive.h(10),
          // margin: responsive.h(10),
          // marginRight: index % 2 != 0 ? 0 : 10,
          borderWidth: 0.5,
          borderColor: "#d2d2d2",
          borderBottomWidth: 2,
          padding: responsive.h(7),
          justifyContent: 'space-between'
        }}
      >
        <View>
          <ImageProgress
            style={{
              height: responsive.h(126),
              width: '100%',
              borderRadius: responsive.h(12),
            }}
            source={{ uri: imageUrl }}
          />
          <Text
            lineBreakMode="tail"
            numberOfLines={2}
            style={{
              flexDirection: "row",
              fontFamily: "Inter-Bold",
              fontWeight: '500',
              fontSize: responsive.h(14),
              textAlign: "left",
              color: "#000000",
              maxWidth: responsive.w(160),
              paddingVertical: responsive.h(10),
            }}
          >
            {title}
          </Text>
        </View>
        <View
          style={{
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
                fontSize: responsive.h(11),
                fontWeight: "normal",
                fontStyle: "normal",
                textAlign: "left",
                color: "#6f6f6f",
              }}
            >
              {moment(dateCreate).format("DD/MM/YYYY HH:mm")}
            </Text>
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
          borderLeftWidth: responsive.w(5),
          borderLeftColor: "#e31818",
          borderColor: colors.grayBorder,
          borderWidth: responsive.h(1),
        }}
      >
        <ImageProgress
          circle={true}
          source={{ uri: user ? user.photoUrl : "" }}
          style={{ height: responsive.h(50), width: responsive.h(50) }}
        />
        <View style={{ flex: 1, marginLeft: responsive.h(20) }}>
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
          <Text
            style={{
              fontSize: responsive.h(fontsize.micro),
              color: colors.gray1,
            }}
          >
            {time}
          </Text>
          <Text
            style={{
              fontSize: responsive.h(fontsize.micro),
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
          borderBottomWidth: responsive.h(0.5),
          borderTopColor: colors.grayBorder,
          borderTopWidth: responsive.h(0.5),
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
          {name}
        </Text>
      </TouchableOpacity>
    );
  };
  renderNews() {
    const {
      dataNotify,
      isRefreshingNotify,
      refreshDataHandle,
      emptyDataNotify,
      errorNotify,
    } = this.props;
    if (emptyDataNotify) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => {
            this.props.getProfile({ type: "re", langId: this.props.langId, towers: this.props.user.towers }),
              this.props.refreshDataHandle();
          }}
        />
      );
    }
    if (errorNotify && errorNotify.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => {
            this.props.getProfile({ type: "re", langId: this.props.langId, towers: this.props.user.towers }),
              this.props.refreshDataHandle();
          }}
        />
      );
    }
    if (dataNotify) {
      var dataNotifyTop4 = dataNotify.slice(0, 4);
      return (
        <FlatList
          refreshing={isRefreshingNotify}
          onRefresh={() => {
            refreshDataHandle(),
              this.props.getProfile({
                type: "re",
                langId: this.props.langId,
                towers: this.props.user.towers
              });
          }}
          data={dataNotifyTop4 || []}
          keyExtractor={(item, index) => `${index}`}
          renderItem={this.renderItem}
          // onEndReachedThreshold={0.5}
          numColumns={2}
          contentContainerStyle={{
            marginTop: responsive.h(10),
            marginHorizontal: responsive.h(15),
            backgroundColor: "white",
          }}
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
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          ListFooterComponent={this.renderFooter}
        />
      )
    }

  }
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
            paddingVertical: responsive.h(20),
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
            this.props.getProfile({ type: "re", langId: this.props.langId, towers: this.props.user.towers }),
              this.props.refreshDataHandle();
          }}
        />
      );
    }

    const { banner, fees } = data;
    return (
      <View style={{ flex: 1, backgroundColor: "white", }}>
        {/* {!_.isNil(fees) &&
          !_.isNil(fees.amountIncurred) &&
          this.rednerItemFee(fees)} */}
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
            alignItems: "center",
            padding: responsive.h(15),
            paddingBottom: responsive.h(5)
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontWeight: '500',
              fontSize: responsive.h(20),
              textAlign: "left",
              color: "#000000",
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
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  paddingHorizontal: responsive.h(5),
                  marginTop: responsive.h(10),
                  letterSpacing: 0,
                  paddingBottom: responsive.h(10),
                  fontSize: responsive.h(15),
                  color: "#afaeae",
                }}
              >
                {Strings.home.moreNews}
              </Text>
              <MyIcon
                name="arrow-right"
                size={responsive.h(15)}
                color="#afaeae"
                style={{}}
              />
            </View>
          </TouchableOpacity>
        </View>
        {this.renderNews()}
      </View>
    );
  }
  renderBanner() {
    const {
      data
    } = this.props;
    if (data && data.banner && (data.banner.filter(i => i.header)).length > 0) {
      const pageData = data.banner.map(
        (o, index) =>
          data.banner[index].isDisplay &&
          data.banner[index].header && (
            <TouchableOpacity
              key={index}
              onPress={() =>
                Linking.canOpenURL(data.banner[index].link)
                  .then((supported) => {
                    if (!supported) {
                      console.log("Can't handle url: " + data.banner[index].link);
                    } else {
                      return Linking.openURL(`${data.banner[index].link}`);
                    }
                  })
                  .catch((err) => console.error("An error occurred", err))
              }
            >
              <ImageProgress
                resizeMode='cover'
                source={{ uri: data.banner[index].imageLink }}
                style={{
                  height: responsive.h(180),
                  width: "100%",
                }}
              />
            </TouchableOpacity>
          )
      );
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              borderRadius: responsive.h(20),
              backgroundColor: "#ffffff",
              height: responsive.h(180),
            }}
          >
            <Swiper
              dot={<View style={styles.dot} />}
              activeDot={<View style={styles.activeDot} />}
              autoplay={true}
              autoplayTimeout={5}
              paginationStyle={{ bottom: responsive.h(5) }}
              showsButtons={false}
            >
              {data.banner.length > 0 ? (
                pageData
              ) : (
                <Image
                  style={{
                    height: responsive.h(180),
                    width: "100%",
                  }}
                  source={default_baner}
                />
              )}
            </Swiper>
          </View>
        </View>
      );
    }
    return null
  }
  renderBannerBottom() {
    const {
      data,
    } = this.props;
    console.log("data get2", this.props);
    if (data && data.banner && (data.banner.filter(i => i.footer)).length > 0) {
      return (
        <FlatList
          data={data.banner || []}
          horizontal
          keyExtractor={(item, index) => `${index}`}
          ListEmptyComponent={
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text>{Strings.app.emptyData}</Text>
            </View>
          }
          renderItem={({ item }) =>
            item.isDisplay &&
            item.footer && (
              <View
                style={{
                  padding: responsive.h(15),
                  backgroundColor: "#ffff",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-SemiBold",
                    fontWeight: '500',
                    fontSize: responsive.h(20),
                    textAlign: "left",
                    color: "#000000",
                    marginBottom: responsive.h(15),
                  }}
                >
                  {item.title}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.canOpenURL(item.link)
                      .then((supported) => {
                        if (!supported) {
                          console.log("Can't handle url: " + item.link);
                        } else {
                          return Linking.openURL(`${item.link}`);
                        }
                      })
                      .catch((err) => console.error("An error occurred", err))
                  }
                >
                  <Image
                    source={{ uri: item.imageLink }}
                    style={{
                      height: responsive.h(180),
                      width: Screen.width - responsive.h(30),
                      alignSelf: "center",
                    }}
                  />

                  {/* <ImageProgress
                source={{ uri: data.banner[index].imageLink }}
                style={{
                  height: responsive.h(180),
                  width: "100%",
                }}
              /> */}
                </TouchableOpacity>
              </View>
            )
          }
        />
      );
    }
    return null
  }

  renderFooter = () => {
    if (!this.props.isLoadingNotify || this.props.isRefreshingNotify)
      return null;
    return (
      <View
        style={{
          paddingVertical: responsive.h(20),
        }}
      >
        <ActivityIndicator animating size="small" />
      </View>
    );
  };
  renderMenu() {
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
        name: Strings.profile.settinglanguage,
        icon: icons.language,
      },

      {
        id: 9,
        name: Strings.home.accountManagement,
        icon: icons.personSt,
      },
    ];
    const { user, badge } = this.props;
    {/* menu */ }
    return (
      <View
        style={{
          backgroundColor: "white",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontWeight: '500',
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
            marginTop: responsive.h(10),
            marginBottom: responsive.h(20),
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
                      this.props.navigation.navigate("building")
                      break;
                    case 8:
                      this.props.navigation.navigate("settingResident")
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
                  borderBottomWidth: responsive.h(2),
                  borderRightWidth: responsive.w(2),
                  borderColor: "#f5f5f5",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    paddingVertical: responsive.h(7),
                    paddingHorizontal: responsive.h(25),
                  }}
                >
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
                      fontFamily: "Inter-Regular",
                      fontWeight: '500',
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
              borderLeftWidth: responsive.w(2),
              borderTopWidth: responsive.h(2),
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
        <View
          style={{
            marginTop: responsive.h(10),
            height: responsive.h(20),
            backgroundColor: "#f5f5f5",
            width: '100%'
          }}
        />
      </View>
    )
  }
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
        name: Strings.profile.settinglanguage,
        icon: icons.language,
      },
      {
        id: 8,
        name: Strings.login.changePass,
        icon: icons.person,
      },
      {
        id: 9,
        name: Strings.home.accountManagement,
        icon: icons.personSt,
      },
    ];
    const { user, badge, isLoading } = this.props;
    const uri = user ? { uri: user.photoUrl } : default_user;
    const d = getPath(Screen.width, 70, 70, 0);
    return (

      <View style={styles.container}>
        <NavBar
          body={
            <View
              style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                height: '100%',
                width: '100%',
                paddingTop: Platform.isPad || Platform.OS === 'android' ? responsive.h(10) : 0
              }}
            >
              {/* trái */}
              <View style={{
                flexDirection: "row",
                flex: 1
              }}>
                <TouchableOpacity
                  onPress={() => this._onAttachment()}
                  style={{
                    paddingHorizontal: responsive.h(15),
                    paddingRight: 10
                  }}
                >
                  <ImageProgress
                    style={{
                      height: responsive.h(50),
                      width: responsive.h(50),
                    }}
                    circle={true}
                    resizeMode="stretch"
                    type="0"
                    source={user && !_.isNil(user.photoUrl) ? uri : default_user}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    justifyContent: "center",
                    height: responsive.h(50),
                    minHeight: responsive.h(50)
                  }}
                >
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: responsive.h(16),
                      fontFamily: "Inter-Bold",
                      fontWeight: '600',
                      textAlign: "left",
                      color: "black",
                    }}
                  >
                    {user ? user.fullName : ""}
                  </Text>
                  <View style={{ display: "flex", flexDirection: "row", marginTop: responsive.h(2) }}>
                    <MyIcon
                      name="call"
                      color="black"
                      size={responsive.h(14)}
                      style={{
                        marginRight: responsive.h(3),
                        marginVertical: responsive.h(3),
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: "Inter-Bold",
                        fontWeight: '600',
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
              {/* phải */}
              <View style={{ flexDirection: "row", height: '100%', flex: 1, justifyContent: 'flex-end' }}>
                {this.props.data && this.props.data.rules.length > 0 ? (
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: responsive.h(5),
                      paddingVertical: responsive.h(5),
                    }}
                    onPress={() =>
                      this.setState({
                        showAction: true,
                        rules: this.props.data.rules,
                      })
                    }
                  >
                    <MyIcon
                      name="ic_quy_dinh1"
                      color="black"
                      size={responsive.h(22)}
                    />
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={{
                    paddingHorizontal: responsive.h(15),
                    paddingVertical: responsive.h(5),
                  }}
                  onPress={() =>
                    this.props.navigation.navigate("notificationResident")
                  }
                >
                  <View>
                    <MyIcon
                      name="home2"
                      color="black"
                      size={responsive.h(22)}
                      style={{}}
                    />
                    <View style={styles.IconBadge}>
                      <Text
                        style={{
                          color: "white",
                          fontSize: responsive.h(10),
                        }}
                      >
                        {badge.badgeNotifyR > 99 ? "99+" : badge.badgeNotifyR}
                      </Text>
                    </View>
                  </View>

                </TouchableOpacity>
              </View>
            </View>
          }
        />

        <ScrollView style={{ backgroundColor: "#fff", marginTop: -responsive.h(10) }} contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                this.loadData(),
                  this.props.refreshDataHandle();
              }}
            />
          }
        >
          <UpdateVersion version={this.props.version} />
          {this.renderBanner()}
          {this.renderMenu()}
          {this.renderContent()}
          {this.renderBannerBottom()}
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
                  height: responsive.h(300),
                  width: responsive.h(300),
                  backgroundColor: "#6A961F",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: responsive.h(20),
                  padding: responsive.h(20),
                }}
              >
                <Image
                  style={{
                    height: responsive.h(150),
                    width: responsive.h(150),
                  }}
                  source={require("../resources/survey.png")}
                />
                <Text style={{ fontFamily: "OpenSans-Bold", color: "#fff" }}>
                  {Strings.surveyDetail.titleModal}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: responsive.h(20),
                    alignSelf: "center",
                    marginBottom: responsive.h(10),
                    borderTopWidth: responsive.h(1),
                    borderColor: "#fff",
                    paddingTop: responsive.h(10),
                  }}
                >
                  <TouchableOpacity
                    style={{
                      padding: responsive.h(5),
                      borderRadius: responsive.h(5),
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      borderWidth: responsive.h(5),
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
                      marginLeft: responsive.h(50),
                      padding: responsive.h(5),
                      borderRadius: responsive.h(5),
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
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response showImagePicker = ', response);
      if (response.didCancel) {
        // console.log('User cancelled photo picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
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
        this.props.updateProfile({ image, fullName: this.props.user.fullName });
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
    fontSize: responsive.h(30),
    fontWeight: "bold",
  },
  dot: {
    width: responsive.h(5),
    height: responsive.h(5),
    marginHorizontal: responsive.h(5),
    borderRadius: responsive.h(7),
    backgroundColor: "rgb(206, 209, 212)",
  },
  activeDot: {
    width: responsive.h(5),
    height: responsive.h(5),
    marginHorizontal: responsive.h(5),
    borderRadius: responsive.h(7),
    backgroundColor: "rgb(105, 109, 116)",
  },
  IconBadge: {
    top: -responsive.h(7),
    right: -responsive.h(3),
    position: "absolute",
    borderRadius: responsive.h(45),
    minWidth: responsive.h(14),
    minHeight: responsive.h(14),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0000",
  },
  IconBadge1: {
    top: 0,
    right: 0,
    position: "absolute",
    borderRadius: 45,
    minWidth: responsive.h(12),
    minHeight: responsive.h(12),
    backgroundColor: "#e24444",
    alignItems: "center",
    justifyContent: "center",
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
