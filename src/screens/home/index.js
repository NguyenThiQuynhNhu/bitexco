import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import * as mineTypes from "react-native-mime-types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NavBar from "../../components/common/NavBar";
import UpdateVersion from "../../components/common/UpdateVersion";
import IconButton from "../../components/common/IconButton";
import { titleStyle } from "../../theme/styles";
import { Screen } from "../../utils/device";
import colors from "../../theme/colors";
import fontsize from "../../theme/fontsize";
import { MyIcon } from "../../theme/icons";
import Strings from "../../utils/languages";

import { loadDataHandle, setProps, loadBadge } from "../../actions/home";
import { getRequestStatusTotal, getVendorsList } from "../../actions/request";
import { getServicesExtensionStatusTotal } from "../../actions/servicesExtension";
import { getServicesBasicStatusTotal } from "../../actions/servicesBasic";
import ErrorContent from "../../components/common/ErrorContent";
import FCM, {
  FCMEvent,
  NotificationType,
  WillPresentNotificationResult,
  RemoteNotificationResult,
} from "react-native-fcm";
import { postFCMToken, delFCMTokenResident } from "../../actions/auth";
import ImageProgress from "../../components/common/ImageProgress";
import { default_baner } from "../../theme/images";
import SwipeablePanel from "rn-swipeable-panel";
import ImagePicker from "react-native-image-picker";
import { converStatusToColor2 } from "../../resident/utils/serviceBasic";
import { converIcon } from "../../resident/utils/request";
import { resetStateByKey as resetRequest } from "../../actions/request";
import { checkVersion } from "../../resident/actions/auth";
import { color } from "react-native-reanimated";
import responsive from "../../resources/responsive";
import { icons } from "../../resources/icons";
import {
  getProfile
} from '../../actions/auth';
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUnnormal: props.user ? props.user.isUnnormal : false,
      menus: {
        request: {
          id: 2,
          name: "Công việc",
          myIcon: "layers",
          dataStatus: this.props.dataStatus,
        },
        servicesEx: {
          id: 19,
          name: "Dịch vụ",
          myIcon: "utility",
          dataStatus: this.props.dataStatusServicesExtension,
        },
        servicesBa: {
          id: 20,
          name: "Tiện ích",
          myIcon: "ic_tab_tien_ich",
          dataStatus: this.props.dataStatusServicesBasic,
        },
        more: [
          // {
          //     id: 21,
          //     name: 'Tin tức',
          //     icon: 'newspaper'
          // },
          {
            id: 7,
            name: "Điện",
            myIcon: "electric",
          },
          {
            id: 8,
            name: "Nước",
            myIcon: "water",
          },
          {
            id: 13,
            name: "Gas",
            myIcon: "gas",
          },
          {
            id: 1,
            name: "Ca trực",
            icon: "calendar-clock",
          },
          {
            id: 3,
            name: "Checklist",
            icon: "clipboard-check-outline",
          },
          {
            id: 4,
            name: "Phiếu đề xuất",
            icon: "message-settings-variant",
          },
          {
            id: 5,
            name: "Kiểm tra định kỳ",
            icon: "settings-box",
          },
          {
            id: 14,
            name: "Bàn giao nội bộ",
            icon: "home",
          },
          {
            id: 15,
            name: "Bàn giao khách hàng",
            icon: "home-account",
          },
        ],
      },
      menusMore: [
        {
          id: 10,
          name: "ds đổi ca",
          icon: "calendar-clock",
        },
        {
          id: 11,
          name: "Nhận ca",
          icon: "layers",
        },
        {
          id: 12,
          name: "Bàn giao ca",
          myicon: "clipboard-check-outline",
        },
      ],
      swipeablePanelActive: false,
      dataStt: 0,
    };
  }

  async componentDidMount() {
    this.props.getProfile({ type: 'em', langId: this.props.langId, towers: this.props.user.towers });
    this.props.checkVersion();
    FCM.getFCMToken().then((token) => {
      this.props.postFCMToken(token, "vendor");
      this.props.delFCMTokenResident(token);
    });
    const request = {
      towerId: this.props.user.towerId,
    };
    this.props.loadDataHandle(request);
    this.props.loadBadge();
    this.props.getRequestStatusTotal({ towerId: this.props.user.towerId, langId: this.props.langId });
    this.props.getServicesBasicStatusTotal({
      towerId: this.props.user.towerId,
    });
    this.props.getServicesExtensionStatusTotal({
      towerId: this.props.user.towerId,
    });
    this.unsubscribe = FCM.on(FCMEvent.Notification, (notif) => {
      console.log("Notification", notif);
      if (notif.CountUnread) {
        FCM.setBadgeNumber(Number(notif.CountUnread));
      }
      this.props.loadBadge();
      const itemData = notif.item ? JSON.parse(notif.item) : null;

      try {
        if (notif.title.includes("bất thường")) {
          this.setState({ isUnnormal: true });
        }
      } catch (error) { }
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
        notif._notificationType === NotificationType.WillPresent
      ) {
        // this notification is only to decide if you want to show the notification when user if in foreground.
        // usually you can ignore it. just decide to show or not.
        // console.log('nhu 1');
        notif.finish(WillPresentNotificationResult.All);
        //this.props.AddItemToList(itemData)
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
          switch (notif.actionId) {
            case "1": //Yêu cầu
              setTimeout(() => {
                this.props.navigation.navigate("requestDetail", {
                  id: itemData.requestId,
                });
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
                this.props.navigation.navigate("serviceExtensionDetail", {
                  id: itemData.id,
                });
              }, 500);
              0;
              break;

            case "5": //Checklist
              setTimeout(() => {
                this.props.navigation.navigate("checklistDetail", {
                  id: itemData.id,
                });
              }, 500);
              break;

            case "6": //Proposal
              setTimeout(() => {
                this.props.navigation.navigate("proposalDetail", {
                  id: itemData.id,
                });
              }, 500);
              break;
          }
        }
        return;
      }
      if (notif.opened_from_tray) {
        // console.log('nhu 2');
        // console.log(itemData);

        switch (notif.actionId) {
          case "1": //Yêu cầu
            setTimeout(() => {
              this.props.navigation.navigate("requestDetail", {
                id: itemData.requestId,
              });
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
              this.props.navigation.navigate("serviceExtensionDetail", {
                id: itemData.id,
              });
            }, 500);
            0;
            break;

          case "5": //Checklist
            setTimeout(() => {
              this.props.navigation.navigate("checklistDetail", {
                id: itemData.id,
              });
            }, 500);
            break;

          case "6": //Proposal
            setTimeout(() => {
              this.props.navigation.navigate("proposalDetail", {
                id: itemData.id,
              });
            }, 500);
            break;
        }

        // if (notif.actionId == 1) {
        //     setTimeout(() => {
        //         this.props.navigation.navigate('requestDetail', { id: itemData.requestId, departmentId: itemData.departmentId, title: itemData.title })
        //     }, 500)
        // }
        //Tin tức
        // else if (notif.actionId == 2) {
        //     setTimeout(() => {
        //         this.props.navigation.navigate('newsDetail', { item: itemData, type: itemData.typeId })
        //     }, 500)
        // }
      }

      if (Platform.OS === "ios") {
        // console.log('nhu 4');
        //optional
        //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
        //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
        //notif._notificationType is available for iOS platfrom
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
            // this type of notificaiton will be called only when you are in foreground.
            // if it is a remote notification, don't do any app logic here. Another notification callback will be triggered with type NotificationType.Remote
            break;
        }
      }
    });
    const menus = await {
      request: {
        id: 2,
        name: "Công việc",
        myIcon: "layers",
        dataStatus: this.props.dataStatus,
      },
      servicesEx: {
        id: 19,
        name: "Dịch vụ",
        myIcon: "utility",
        dataStatus: this.props.dataStatusServicesExtension,
      },
      servicesBa: {
        id: 20,
        name: "Tiện ích",
        myIcon: "ic_tab_tien_ich",
        dataStatus: this.props.dataStatusServicesBasic,
      },
      more: [
        // {
        //     id: 21,
        //     name: 'Tin tức',
        //     icon: 'newspaper'
        // },
        {
          id: 7,
          name: "Điện",
          myIcon: "electric",
        },
        {
          id: 8,
          name: "Nước",
          myIcon: "water",
        },
        {
          id: 13,
          name: "Gas",
          myIcon: "gas",
        },
        {
          id: 1,
          name: "Ca trực",
          icon: "calendar-clock",
        },
        {
          id: 3,
          name: "Checklist",
          icon: "clipboard-check-outline",
        },
        {
          id: 4,
          name: "Phiếu đề xuất",
          icon: "message-settings-variant",
        },
        {
          id: 5,
          name: "Kiểm tra định kỳ",
          icon: "settings-box",
        },
        {
          id: 14,
          name: "Bàn giao nội bộ",
          icon: "home",
        },
        {
          id: 15,
          name: "Bàn giao khách hàng",
          icon: "home-account",
        },
      ],
    };
    await this.setState({ menus: menus });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing
    ) {
      const request = {
        towerId: this.props.user.towerId,
      };
      this.props.loadDataHandle(request);
    }
    if (
      nextProps.dataStatus != this.props.dataStatus ||
      nextProps.dataStatusServicesExtension !=
      this.props.dataStatusServicesExtension ||
      nextProps.dataStatusServicesBasic != this.props.dataStatusServicesBasic
    ) {
      const menus = {
        request: {
          id: 2,
          name: "Công việc",
          myIcon: "layers",
          dataStatus: this.props.dataStatus,
        },
        servicesEx: {
          id: 19,
          name: "Dịch vụ",
          myIcon: "utility",
          dataStatus: this.props.dataStatusServicesExtension,
        },
        servicesBa: {
          id: 20,
          name: "Tiện ích",
          myIcon: "ic_tab_tien_ich",
          dataStatus: this.props.dataStatusServicesBasic,
        },
        more: [
          // {
          //     id: 21,
          //     name: 'Tin tức',
          //     icon: 'newspaper'
          // },
          {
            id: 7,
            name: "Điện",
            myIcon: "electric",
          },
          {
            id: 8,
            name: "Nước",
            myIcon: "water",
          },
          {
            id: 13,
            name: "Gas",
            myIcon: "gas",
          },
          {
            id: 1,
            name: "Ca trực",
            icon: "calendar-clock",
          },
          {
            id: 3,
            name: "Checklist",
            icon: "clipboard-check-outline",
          },
          {
            id: 4,
            name: "Phiếu đề xuất",
            icon: "message-settings-variant",
          },
          {
            id: 5,
            name: "Kiểm tra định kỳ",
            icon: "settings-box",
          },
          {
            id: 14,
            name: "Bàn giao nội bộ",
            icon: "home",
          },
          {
            id: 15,
            name: "Bàn giao khách hàng",
            icon: "home-account",
          },
        ],
      };
      this.setState({ menus: menus });
    }
  }
  componentWillUpdate(nextProps) {
    if (this.props.isMine !== nextProps.isMine) {
      this.props.getRequestStatusTotal({
        towerId: nextProps.user !== null ? nextProps.user.towerId : -1,
        isMine: nextProps.isMine,
        langId: this.props.langId
      });
    }
  }
  componentWillUnmount() {
    this.props.setProps({ key: "state" });
  }

  openPanel = () => {
    this.setState({ swipeablePanelActive: true });
  };

  closePanel = () => {
    this.setState({ swipeablePanelActive: false });
  };

  renderContent = () => {
    const { emptyData, error, data, isRefreshing, isLoading } = this.props;
    if (isLoading && !isRefreshing) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator color={colors.appTheme} />
        </View>
      );
    }
    if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() =>
            this.props.setProps({ isRefreshing: true, data: [] })
          }
        />
      );
    }
    if (emptyData) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() =>
            this.props.setProps({ isRefreshing: true, data: [] })
          }
        />
      );
    }
    return (
      <View
        style={{
          borderColor: colors.gray2,
          borderTopWidth: 10,
        }}
      >
        <FlatList
          refreshing={isRefreshing}
          onRefresh={() =>
            this.props.setProps({ isRefreshing: true, data: [] })
          }
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: colors.grayBorder }} />
          )}
          data={data || []}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    );
  };
  renderItem = ({ item, index }) => {
    const {
      id,
      title,
      system,
      imageUrl,
      employeeName,
      status,
      dateAction,
      typeId,
      departmentId,
      statusId,
      stepApproved,
      stepTotalApprove,
      typeName,
      total,
      isMaintenance,
    } = item;
    return index === 0 ? (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            marginBottom: 10,
            paddingLeft: 10,
            paddingTop: 10,
            fontWeight: "bold",
          }}
        >
          CÔNG VIỆC ({total})
        </Text>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => {
            this.props.navigation.navigate("checklistDetail", { id: item.id });
          }}
        >
          <View
            style={{
              flex: 1,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <ImageProgress
              circle={true}
              style={{
                height: 80,
                width: 80,
              }}
              source={{ uri: imageUrl }}
            />

            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                marginLeft: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ fontSize: fontsize.larg, fontWeight: "bold" }}
                  numberOfLines={2}
                >
                  {title}
                </Text>

                <View
                  style={{
                    borderRadius: 45,
                    height: 24,
                    width: 24,
                    backgroundColor: colors.appBackround,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: colors.appTheme }}
                    numberOfLines={2}
                    lineBreakMode="tail"
                  >
                    {typeName}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ marginVertical: 5 }}
                  numberOfLines={2}
                  lineBreakMode="tail"
                >
                  {system}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ marginVertical: 5 }} numberOfLines={1}>
                  {employeeName}
                </Text>
                {statusId === 2 ? (
                  <Text style={{ color: colors.appTheme }} numberOfLines={1}>
                    {stepApproved} / {stepTotalApprove}
                  </Text>
                ) : null}
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ color: colors.gray1 }}
                  numberOfLines={2}
                  lineBreakMode="tail"
                >
                  {moment(dateAction).format("DD/MM/YYYY")}
                  {isMaintenance ? " - (KTĐK)" : ""}
                </Text>
                <Text style={{ color: colors.appTheme }} numberOfLines={1}>
                  {status}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => {
          this.props.navigation.navigate("checklistDetail", { id: item.id });
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <ImageProgress
            circle={true}
            style={{
              height: 100,
              width: 100,
            }}
            source={{ uri: imageUrl }}
          />

          <View
            style={{ flex: 1, justifyContent: "space-between", marginLeft: 10 }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: fontsize.larg, fontWeight: "bold" }}
                numberOfLines={2}
              >
                {title}
              </Text>

              <View
                style={{
                  borderRadius: 45,
                  height: 24,
                  width: 24,
                  backgroundColor: colors.appBackround,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: colors.appTheme }}
                  numberOfLines={2}
                  lineBreakMode="tail"
                >
                  {typeName}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ marginVertical: 5 }}
                numberOfLines={2}
                lineBreakMode="tail"
              >
                {system}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ marginVertical: 5 }} numberOfLines={1}>
                {employeeName}
              </Text>
              {statusId === 2 ? (
                <Text style={{ color: colors.appTheme }} numberOfLines={1}>
                  {stepApproved} / {stepTotalApprove}
                </Text>
              ) : null}
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ color: colors.gray1 }}
                numberOfLines={2}
                lineBreakMode="tail"
              >
                {moment(dateAction).format("DD/MM/YYYY")}
                {isMaintenance ? " - (KTĐK)" : ""}
              </Text>
              <Text style={{ color: colors.appTheme }} numberOfLines={1}>
                {status}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderMenuStatusRequest(menus) {
    console.log('menus', this.props.dataStatus)
    return (
      <FlatList
        horizontal={true}
        scrollEnabled={false}
        data={this.props.dataStatus}
        renderItem={({ item }) => {
          const { id, name, total, colorCode, statusKey } = item;
          return (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.dispatch({
                  type: "ON_STATUS_CHANGE",
                  payload: id,
                });
                this.props.navigation.navigate("requests", { idStatus: id });
              }}
              style={{
                width: (Screen.width - responsive.h(20)) / 4,
                alignItems: 'center',
                justifyContent: "center",
              }}
            >

              <MyIcon
                name={converIcon(statusKey)}
                size={responsive.h(33)}
                color="#fff"
                style={{}}
              />
              <Text
                style={{
                  color: "#ffff",
                  fontSize: responsive.h(14),
                  fontFamily: "Inter-SemiBold",
                  textAlign: "center",
                  marginTop: responsive.h(10),
                }}
              >
                {name}
              </Text>
              {total !== 0 ? (
                <View
                  style={{
                    borderRadius: responsive.h(15),
                    height: responsive.h(17),
                    width: responsive.h(17),
                    backgroundColor: colorCode,
                    alignItems: "center",
                    justifyContent: "center",
                    position: 'absolute',
                    top: 0,
                    right: ((Screen.width - responsive.h(40)) / 8) - responsive.h(20)
                  }}
                >
                  <Text style={{ fontSize: responsive.h(12), color: "black" }}>
                    {total}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => `${index}`}
      />
    );
  }

  render() {
    const { menus, menusMore } = this.state;
    const { user } = this.props;
    const fullName = user !== null ? user.name : "";
    const towerName = user !== null ? user.towerName : "";
    const photoUrl = user ? user.photoUrl : "";
    //console.log('responsive.w(128)', responsive.w(128));
    console.log(user);
    const listMenuItem = [
      {
        id: 1,
        name: Strings.home.electric,
        icon: icons.electric,
      },
      {
        id: 2,
        name: Strings.home.water,
        icon: icons.water,
      },
      {
        id: 3,
        name: Strings.home.gas,
        icon: icons.gas,
      },
      // {
      //   id: 4,
      //   name: Strings.home.shift,
      //   icon: icons.shift,
      // },
      // {
      //   id: 5,
      //   name: Strings.home.checkList,
      //   icon: icons.checkList,
      // },
      // {
      //   id: 6,
      //   name: Strings.home.proposalForm,
      //   icon: icons.proposalForm,
      // },
      // {
      //   id: 7,
      //   name: Strings.home.checkingDaily,
      //   icon: icons.checkingDaily,
      // },
      {
        id: 8,
        name: Strings.home.internalHandover,
        icon: icons.internalHandover,
      },
      {
        id: 9,
        name: Strings.home.customerHandover,
        icon: icons.customerHandover,
      },
    ];
    return (
      // <ImageBackground resizeMode='cover' source={default_baner} style={{ width: '100%', height: '100%' }} >
      <View style={{ flex: 1 }}>
        <UpdateVersion version={this.props.version} />
        <ImageBackground
          source={require("../../resources/bgMenu.png")}
          style={{
            //flex: 1,
            //paddingHorizontal: responsive.h(15)
          }}
          resizeMode="cover"
        >
          <NavBar
            // backgroundColor2={"#E5E5E5"}
            leftButton={
              <TouchableOpacity
                onPress={() => this.props.navigation.openDrawer()}
                style={{paddingHorizontal: responsive.h(15)}}
              >
                <MyIcon name="iconNavigationMenu24Px" size={responsive.h(28)} color="black" />
              </TouchableOpacity>
            }

            rightView={
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("notification")}
                style={{
                  alignSelf: 'flex-end',
                  paddingHorizontal: responsive.h(15)
                }}
              >
                <MyIcon name="thng-bo-01" size={responsive.h(28)} color="black" />
                {this.props.badgeNotify != 0 && (
                  <View style={styles.IconBadge}>
                    <Text style={{ color: "white", fontSize: responsive.h(10) }}>
                      {this.props.badgeNotify > 99
                        ? "99+"
                        : this.props.badgeNotify}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            }
          />
          {user && (
            <View style={{ flexDirection: "row", marginVertical: responsive.h(5), paddingHorizontal: responsive.h(15) }}>
              <View
                //onPress={() => this._onAttachment()}
                style={{
                  height: responsive.h(50),
                  width: responsive.h(50),
                  borderRadius: responsive.h(30),
                  borderWidth: 5,
                  borderColor: "rgba(255,255,255,0.4)",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: this.props.isLoading
                    ? "#fff"
                    : "transparent",
                }}
              >
                <ImageProgress
                  source={{ uri: photoUrl }}
                  circle={true}
                  style={{ height: responsive.h(50), width: responsive.h(50) }}
                />
              </View>

              <View style={{ flex: 1, justifyContent: "center", marginLeft: responsive.h(10) }}>
                <Text
                  style={{
                    fontSize: responsive.h(16),
                    fontFamily: "Inter-Bold",
                    fontWeight: '600',
                    color: "black",
                    marginBottom: responsive.h(5)
                  }}
                >
                  {fullName}
                </Text>
                <View style={{ flexDirection: "row", alignItems: 'center', display: "flex" }}>
                  <MyIcon
                    name="profile1"
                    size={responsive.h(11)}
                    color="black"
                    style={{
                      marginRight: responsive.h(5),
                    }}
                  />
                  <Text
                    style={{
                      fontSize: responsive.h(14),
                      fontFamily: "Inter-Medium",
                      fontWeight: '500',
                      color: "black",
                    }}
                  >
                    {towerName}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View
            style={{
              backgroundColor: "#fe494f",
              //borderRadius: responsive.h(14),
              padding: responsive.h(15),
              paddingHorizontal: responsive.h(10),
              marginTop: responsive.h(15),
              marginBottom: responsive.h(25)
            }}
          >
            {this.renderMenuStatusRequest(menus.request.dataStatus)}
          </View>
        </ImageBackground>
        <View
          style={{
            flex: 2,
            //marginHorizontal: responsive.h(15),
          }}
        >
          {this.props.user.towerId != null ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontWeight: '400',
                  textAlign: "center",
                  fontSize: responsive.h(20),
                  color: "black",
                  marginTop: responsive.h(20),
                  backgroundColor: "white",
                }}
              >
                {Strings.home.functionalCategories}
              </Text>
              <Image
                source={require("../../resources/line.png")}
                height={responsive.h(5)}
                style={{
                  alignSelf: "center",
                  marginTop: 10,
                }}
              />
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginVertical: responsive.h(20),
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("serviceExtension")
                  }
                  style={{
                    width: Screen.width/2,
                    //height: responsive.h(60),
                    backgroundColor: "#f5f5f5",
                    //borderRadius: responsive.h(10),
                    justifyContent: "center",
                    borderWidth: 0.5,
                    borderColor: '#e9e9e9'
                  }}
                >
                  <View
                    style={{
                      marginVertical: responsive.h(10),
                      marginHorizontal: responsive.h(10),
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        height: responsive.h(40),
                        width: responsive.h(40),
                        backgroundColor: "#e9e9e9",
                        borderRadius: responsive.h(20),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MyIcon name="utility" color="black" size={responsive.h(22)} />
                    </View>
                    <Text
                      style={{
                        fontSize: responsive.h(16),
                        fontFamily: "Inter-Bold",
                        fontWeight: '600',
                        color: "black",
                        paddingVertical: responsive.h(10),
                        paddingHorizontal: responsive.h(10),
                      }}
                    >
                      {Strings.home.extension.toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: Screen.width/2,
                    //height: responsive.h(60),
                    backgroundColor: "#f5f5f5",
                    //borderRadius: responsive.h(10),
                    justifyContent: "center",
                    borderWidth: 0.5,
                    borderColor: '#e9e9e9'
                  }}
                  onPress={() => this.props.navigation.navigate("serviceBasic")}
                >
                  <View
                    style={{
                      margin: responsive.h(10),
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        height: responsive.h(40),
                        width: responsive.h(40),
                        backgroundColor: "#e9e9e9",
                        borderRadius: responsive.h(20),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MyIcon name="ic_tab_tien_ich" color="black" size={responsive.h(22)} style={{marginLeft: 3}} />
                    </View>
                    <Text
                      style={{
                        fontSize: responsive.h(16),
                        fontFamily: "Inter-Bold",
                        fontWeight: '600',
                        textTransform: "uppercase",
                        color: "black",
                        paddingVertical: responsive.h(10),
                        paddingHorizontal: responsive.h(10),
                      }}
                    >
                      {Strings.home.service.toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <FlatList
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={{
                  justifyContent: "center",
                  borderTopWidth: 2,
                  borderLeftWidth: 2,
                  borderColor: "#f5f5f5",
                  //maxWidth: responsive.w(385),
                  Width: responsive.w(385),
                  maxHeight: responsive.h(391),
                  alignSelf: "center",
                  marginVertical: responsive.h(10),
                  backgroundColor: "white",
                }}
                scrollEnabled={false}
                data={listMenuItem}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      switch (item.id) {
                        case 1:
                          this.props.navigation.navigate("electric");
                          break;
                        case 2:
                          this.props.navigation.navigate("water");
                          break;
                        case 3:
                          this.props.navigation.navigate("gas");
                          break;
                        case 4:
                          this.props.navigation.navigate("shiftChange");
                          break;
                        case 5:
                          this.props.navigation.navigate("checklist", {
                            isMaintenance: 0,
                          });
                          break;
                        case 6:
                          this.props.navigation.navigate("proposal");
                          break;
                        case 7:
                          this.props.navigation.navigate("checklist", {
                            isMaintenance: 1,
                          });
                        case 8:
                          this.props.navigation.navigate("CheckList_NoiBo");
                          break;
                        case 9:
                          this.props.navigation.navigate("CheckList_KhachHang");
                          break;
                      }
                    }}
                    style={{
                      height: responsive.h(130),
                      width: ((Screen.width - responsive.h(15))/3) -8,
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
                        paddingHorizontal: responsive.h(25),
                      }}
                    >
                      <MyIcon
                        name={item.icon}
                        size={responsive.h(40)}
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
                          fontFamily: "Inter-Medium",
                          maxWidth: responsive.w(70),
                          textAlign: "center",
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
              <View
                style={{
                  marginVertical: responsive.h(15),

                }}
              >
                <Image
                resizeMode='stretch'
                  source={require("../../resources/bitexco.png")}
                  style={{ width: '100%', height: responsive.h(180) }}
                />
              </View>
            </ScrollView>
          ) : (
            <Text>Vui lòng chọn toà nhà</Text>
          )}

          {/* <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('dashboard')}
                        style={{
                            backgroundColor: (this.props.user !== null ? this.props.user.isUnnormal : false) ? 'red' : colors.appTheme,
                            width: 50,
                            height: 50,
                            borderRadius: 35,
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            bottom: 20,
                            right: 20
                        }}>

                        <Icon name='lock-pattern' size={ 30 } color='#fff' />
                    </TouchableOpacity> */}
        </View>
        
      </View>
      // </ImageBackground>
    );
  }
  _onAttachment = () => {
    // if (this.props.images && _.size(this.props.images) < 5) {
    const options = {
      quality: 1.0,
      maxWidth: 512,
      maxHeight: 512,
      storageOptions: {
        skipBackup: true,
      },
      title: "Chọn hình ảnh",
      takePhotoButtonTitle: "Chụp ảnh...",
      chooseFromLibraryButtonTitle: "Chọn ảnh từ thư viện...",
      cancelButtonTitle: "Bỏ qua",
      permissionDenied: {
        title: "Cấp quyền truy cập",
        text: "Cho phép ứng dụng chụp ảnh và chọn từ thư viên ảnh...",
        reTryTitle: "Thử lại",
        okTitle: "Cho phép",
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

        // const source = { uri: response.uri, data: response.data };
        // You can also display the image using data:
        // const source = { uri: `data:image/jpeg;base64,${response.data}` };
        this.setState({ images: [...this.state.images, image] });
        //this.props.addImageToList(image);
      }
    });
    // } else {
    //     Toast.show({
    //         text: 'Bạn chỉ chọn được tối đa 5 hình',
    //         position: 'bottom',
    //         type: 'warning',
    //         duration: 2000
    //     });
    // }
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  IconBadge: {
    top: responsive.h(-5),
    right: responsive.w(20),
    position: "absolute",
    borderRadius: responsive.w(45),
    minWidth: responsive.w(12),
    minHeight: responsive.w(12),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0000",
  },
});

const mapStateToProps = (state) => ({
  emptyData: state.home.emptyData,
  isLoading: state.home.isLoading,
  data: state.home.data,
  error: state.home.error,
  isRefreshing: state.home.isRefreshing,
  user: state.auth.user,
  canNavigate: true, //state.requestDetail.data == null,
  language: state.app.language,
  badgeNotify: state.badge.badgeNotifyR,
  dataStatus: state.drawer.data,
  dataStatusServicesBasic: state.drawer.dataStatusServiecBasic,
  dataStatusServicesExtension: state.drawer.dataStatusSeviceExtension,
  isMine: state.request.isMine,
  version: state.version.version,
  langId: state.app.language == 'vi' ? 1 : 2,
});

const mapActionToState = {
  loadDataHandle,
  postFCMToken,
  setProps,
  loadBadge,
  delFCMTokenResident,
  getRequestStatusTotal,
  getServicesExtensionStatusTotal,
  getServicesBasicStatusTotal,
  resetRequest,
  checkVersion,
  getProfile
};
export default connect(
  mapStateToProps,
  mapActionToState
)(HomeScreen);
