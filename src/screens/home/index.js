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
import { converStatusToColor2 } from "../../resident/utils/serviceBasic";
import { resetStateByKey as resetRequest } from "../../actions/request";
import { checkVersion } from "../../resident/actions/auth";
import { color } from "react-native-reanimated";
import responsive from "../../resources/responsive";
import { icons } from "../../resources/icons";

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
    console.log(this.props);
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
    this.props.getRequestStatusTotal({ towerId: this.props.user.towerId });
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
      } catch (error) {}
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

  renderItemMenu = ({ item, index }) => {
    const { id, name, icon, myIcon } = item;
    const size = Screen.width / 4;
    return (
      <TouchableOpacity
        style={{
          width: (Screen.width - 50) / 3,
          height: Screen.width / 3,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          paddingVertical: Platform.isPad ? 40 : 20,
          paddingHorizontal: 10,
          //height: (Screen.height - 180) / 3,
          marginHorizontal: 5,
          marginVertical: 5,
          borderRadius: 20,
          backgroundColor: "#ffffff",
          shadowColor: "rgba(0, 0, 0, 0.08)",
          elevation: 2,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowRadius: 12,
          shadowOpacity: 1,
        }}
        onPress={() => {
          switch (id) {
            case 1: {
              return this.props.navigation.navigate("shiftList");
            }
            case 2: {
              return this.props.navigation.navigate("requests");
            }
            case 3: {
              return this.props.navigation.navigate("checklist", {
                isMaintenance: 0,
              });
            }
            case 4: {
              return this.props.navigation.navigate("proposal");
            }
            case 5: {
              return this.props.navigation.navigate("checklist", {
                isMaintenance: 1,
              });
            }
            case 6: {
              return this.props.navigation.navigate("notification");
            }
            case 7: {
              return this.props.navigation.navigate("electric");
            }
            case 8: {
              return this.props.navigation.navigate("water");
            }
            case 9: {
              //return this.props.navigation.navigate('water')
              this.openPanel();
              break;
            }
            case 10: {
              //this.closePanel();
              return this.props.navigation.navigate("shiftChange");
            }
            case 13: {
              return this.props.navigation.navigate("gas");
            }
            case 14: {
              return this.props.navigation.navigate("CheckList_NoiBo");
            }
            case 15: {
              return this.props.navigation.navigate("CheckList_KhachHang");
            }
            case 16: {
              return this.props.navigation.navigate("HandOverMore");
            }
            case 17: {
              return this.props.navigation.navigate("Notification_Bangiao");
            }
            case 18: {
              return this.props.navigation.navigate("ChecklistOfflineScreen");
            }
            case 19: {
              return this.props.navigation.navigate("serviceExtension");
            }
            case 20: {
              return this.props.navigation.navigate("serviceBasic");
            }
            case 21: {
              return this.props.navigation.navigate("listNewsEm");
            }
            default:
              break;
          }
        }}
      >
        <View
          style={{
            flex: 1,
            width: (Screen.width - 50) / 3,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {icon ? (
              <Icon
                name={icon}
                size={Platform.isPad ? 90 : 50}
                color={colors.appTheme}
              />
            ) : (
              <MyIcon
                name={myIcon}
                size={Platform.isPad ? 90 : 50}
                color={colors.appTheme}
              />
            )}
            <Text
              style={{
                marginTop: 5,
                fontSize: Platform.isPad ? 20 : 14,
                color: "#000",
                fontWeight: "bold",
                textAlign: "center",
                fontFamily: "Inter-SemiBold",
              }}
            >
              {name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderMenuStatusServicesBasic(menus) {
    return (
      <FlatList
        horizontal={false}
        scrollEnabled={false}
        data={menus}
        renderItem={({ item }) => {
          const { statusId, total, statusName, statusKey } = item;
          return (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("serviceBasic", {
                  idStatus: statusId,
                });
              }}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 2.5,
              }}
            >
              <View
                style={{
                  borderRadius: 15,
                  height: 25,
                  width: 25,
                  backgroundColor: converStatusToColor2(statusId),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 12, margin: 2, color: "#fff" }}>
                  {total}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => `${index}`}
      />
    );
  }
  renderMenuStatusServicesExtension(menus) {
    return (
      <FlatList
        horizontal={false}
        scrollEnabled={false}
        data={menus}
        renderItem={({ item }) => {
          const { statusId, total, statusName, statusKey } = item;
          return (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("serviceExtension", {
                  idStatus: statusId,
                });
              }}
              style={{
                marginVertical: 2.5,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  borderRadius: 15,
                  height: 25,
                  width: 25,
                  backgroundColor: converStatusToColor2(statusId),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 12, margin: 2, color: "#fff" }}>
                  {total}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => `${index}`}
      />
    );
  }
  renderMenuStatusRequest(menus) {
    return (
      <FlatList
        horizontal={true}
        scrollEnabled={false}
        data={menus}
        renderItem={({ item }) => {
          const { id, name, total, colorCode } = item;
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
                marginVertical: 20,
                marginHorizontal: 35,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {total !== 0 ? (
                <View
                  style={{
                    borderRadius: 15,
                    height: 17,
                    width: 17,
                    backgroundColor: "#e7bd23",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 12, margin: 2, color: "black" }}>
                    {total}
                  </Text>
                </View>
              ) : null}
              {/* <View
                style={{
                  borderRadius: 15,
                  height: 17,
                  width: 17,
                  backgroundColor: "#e7bd23",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 12, margin: 2, color: "black" }}>
                  {total}
                </Text>
              </View> */}
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => `${index}`}
      />
    );
  }

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

  render() {
    const { menus, menusMore } = this.state;
    const { user } = this.props;
    const fullName = user !== null ? user.name : "";
    const towerName = user !== null ? user.towerName : "";
    const photoUrl = user ? user.photoUrl : "";
    console.log(this.props.dataVendor);
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
      {
        id: 4,
        name: Strings.home.shift,
        icon: icons.shift,
      },
      {
        id: 5,
        name: Strings.home.checkList,
        icon: icons.checkList,
      },
      {
        id: 6,
        name: Strings.home.proposalForm,
        icon: icons.proposalForm,
      },
      {
        id: 7,
        name: Strings.home.checkingDaily,
        icon: icons.checkingDaily,
      },
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
            // height: 250,
            flex: 1,
          }}
          resizeMode="cover"
        >
          <NavBar
            // backgroundColor2={"#E5E5E5"}
            leftButton={
              //   <IconButton
              //     materialIcon="menu"
              //     size={28}
              //     color="#fff"
              //   />
              <TouchableOpacity
                onPress={() => this.props.navigation.openDrawer()}
              >
                <MyIcon name="iconNavigationMenu24Px" size={22} color="black" />
              </TouchableOpacity>
            }
            // body={<Text style={titleStyle}>TRANG CHỦ</Text>}

            rightView={
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("notification")}
                >
                  <MyIcon name="thng-bo-01" size={22} color="black" />
                  {this.props.badgeNotify !== 0 && (
                    <View style={styles.IconBadge}>
                      <Text style={{ color: "white", fontSize: 10 }}>
                        {this.props.badgeNotify > 99
                          ? "99+"
                          : this.props.badgeNotify}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            }
          />
          {user && (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => this._onAttachment()}
                style={{
                  height: 55,
                  width: 55,
                  borderRadius: 30,
                  borderWidth: 5,
                  margin: 20,
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
                  style={{ height: 50, width: 50 }}
                />
              </TouchableOpacity>

              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text
                  style={{
                    fontsize: responsive.h(18),
                    fontFamily: "Inter-Bold",
                    color: "black",
                  }}
                >
                  {fullName}
                </Text>
                <View style={{ flexDirection: "row", display: "flex" }}>
                  <MyIcon
                    name="profile1"
                    size={12}
                    color="black"
                    style={{
                      marginTop: 4,
                      marginRight: 5,
                    }}
                  />
                  <Text
                    style={{
                      fontsize: 14,
                      fontFamily: "Inter-Medium",
                      color: "black",
                    }}
                  >
                    {towerName}
                  </Text>
                </View>
                {/* <Text
                style={{
                  color: "black",
                  fontFamily: "OpenSans-Regular",
                  fontSize: 20,
                }}
              >
                {towerName}
              </Text> */}
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("requests");
              this.props.resetRequest({
                key: "isMine",
                path: "",
                value: !this.props.isMine,
              });
            }}
            style={{
              width: Screen.width - 20,
              flexDirection: "row",
              backgroundColor: "#fe494f",
              borderRadius: 14,
              padding: 15,
              height: 90,
              alignSelf: "center",
              marginBottom: 30,
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <TouchableOpacity
              style={{
                // maxWidth: 80,
                justifyContent: "center",
              }}
            >
              <View>
                <MyIcon
                  name="yu-cu-mi-01"
                  size={28}
                  color="#fff"
                  style={{
                    marginHorizontal: 20,
                  }}
                />
                <Text
                  style={{
                    color: "#ffff",
                    fontsize: 12,
                    fontFamily: "Inter-Regular",
                    textAlign: "center",
                    paddingTop: 5,
                  }}
                >
                  Yêu cầu mới
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View>
                <MyIcon
                  name="x-l-01"
                  size={28}
                  color="#fff"
                  style={{ marginHorizontal: 20 }}
                />
                <Text
                  style={{
                    color: "#ffff",
                    fontsize: 12,
                    fontFamily: "Inter-Regular",
                    textAlign: "center",
                    paddingTop: 5,
                  }}
                >
                  Xử lý
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View>
                <MyIcon
                  name="hon-thnh-01"
                  size={28}
                  color="#fff"
                  style={{ marginHorizontal: 20 }}
                />
                <Text
                  style={{
                    color: "#ffff",
                    fontsize: 12,
                    fontFamily: "Inter-Regular",
                    textAlign: "center",
                    paddingTop: 5,
                  }}
                >
                  Hoàn thành
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View>
                <MyIcon
                  name="-ng-01"
                  size={28}
                  color="#fff"
                  style={{ marginHorizontal: 20 }}
                />
                <Text
                  style={{
                    color: "#ffff",
                    fontsize: 12,
                    fontFamily: "Inter-Regular",
                    textAlign: "center",
                    paddingTop: 5,
                  }}
                >
                  Đã đóng
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                position: "absolute",
                top: -10,
              }}
            >
              {this.renderMenuStatusRequest(menus.request.dataStatus)}
            </View>

            {/* <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MyIcon
                  name={menus.request.myIcon}
                  size={Platform.isPad ? 90 : 50}
                  color={"#fff"}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontFamily: "Inter-SemiBold",
                    marginVertical: 15,
                  }}
                >
                  {menus.request.name}
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 7,
                    paddingHorizontal: 20,
                    borderWidth: 1,
                    borderColor: "#fff",
                    borderRadius: 20,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  }}
                  onPress={() => {
                    this.props.navigation.navigate("requests");
                    this.props.resetRequest({
                      key: "isMine",
                      path: "",
                      value: !this.props.isMine,
                    });
                  }}
                >
                  <Text style={{ color: "#fff" }}>Của tôi</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flex: 0.5,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  padding: 5,
                  marginRight: 20,
                }}
              >
                {this.renderMenuStatusRequest(menus.request.dataStatus)}
              </View>
            </View> */}
          </TouchableOpacity>
        </ImageBackground>
        <View
          style={{
            flex: 2,
            marginHorizontal: 10,
          }}
        >
          {this.props.user.towerId != null ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              {/* <View
                style={{
                  width: Screen.width - 20,
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "space-between",
                  marginBottom: 10,
                  //   flex: 1,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: Screen.width / 2 - 15,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    padding: 20,
                  }}
                  onPress={() => {
                    this.props.navigation.navigate("serviceExtension");
                  }}
                >
                  <View
                    style={{
                      flex: 0.5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MyIcon
                      name1="Layer55png"
                      name={menus.servicesEx.myIcon}
                      size={Platform.isPad ? 90 : 50}
                      color={colors.appTheme}
                    />
                    <Text
                      style={{
                        marginTop: 15,
                        fontSize: 16,
                        color: "#000",
                        fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Inter-SemiBold",
                      }}
                    >
                      {menus.servicesEx.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                  >
                    {this.renderMenuStatusServicesExtension(
                      menus.servicesEx.dataStatus
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: Screen.width / 2 - 15,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    padding: 20,
                  }}
                  onPress={() => {
                    this.props.navigation.navigate("serviceBasic");
                  }}
                >
                  <View
                    style={{
                      flex: 0.5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MyIcon
                      name={menus.servicesBa.myIcon}
                      size={Platform.isPad ? 90 : 50}
                      color={colors.appTheme}
                    />
                    <Text
                      style={{
                        marginTop: 15,
                        fontSize: 16,
                        color: "#000",
                        fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Inter-SemiBold",
                      }}
                    >
                      {menus.servicesBa.name}
                    </Text>
                  </View>
                  <View style={{ flex: 0.5, alignItems: "flex-end" }}>
                    {this.renderMenuStatusServicesBasic(
                      menus.servicesBa.dataStatus
                    )}
                  </View>
                </TouchableOpacity>
              </View> */}
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
                  marginVertical: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("serviceExtension")
                  }
                  style={{
                    width: 160,
                    height: 60,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 10,
                  }}
                >
                  <View
                    style={{
                      marginVertical: 10,
                      marginHorizontal: 10,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        height: 38,
                        width: 38,
                        backgroundColor: "#e9e9e9",
                        borderRadius: 19,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MyIcon name="utility" color="black" size={22} />
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Inter-Bold",
                        textTransform: "uppercase",
                        color: "black",
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                      }}
                    >
                      {Strings.home.service}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 160,
                    height: 60,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 10,
                  }}
                  onPress={() => this.props.navigation.navigate("ServiceBasic")}
                >
                  <View
                    style={{
                      marginVertical: 10,
                      marginHorizontal: 10,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        height: 38,
                        width: 38,
                        backgroundColor: "#e9e9e9",
                        borderRadius: 19,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MyIcon name="ic_tab_tien_ich" color="black" size={22} />
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Inter-Bold",
                        textTransform: "uppercase",
                        color: "black",
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                      }}
                    >
                      {Strings.home.extension}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <FlatList
                data={listMenuItem}
                renderItem={({ item }) => (
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
                            isMaintenance: 1,
                          });
                          break;
                        case 6:
                          this.props.navigation.navigate("requests");
                          break;
                        case 7:
                          this.props.navigation.navigate("proposal");
                          break;
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
              <Image
                source={require("../../resources/bitexco.png")}
                style={{ marginVertical: 20 }}
              />
              {/* <FlatList
                //scrollEnabled={false}
                data={menus.more}
                renderItem={this.renderItemMenu}
                horizontal={false}
                numColumns={3}
              /> */}
            </ScrollView>
          ) : (
            <Text>Vui lòng chọn toà nhà</Text>
          )}

          {/* <View style={{ flex: 1 }}>
                        {this.renderContent()}
                    </View> */}

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
        {/* <SwipeablePanel
                    fullWidth
                    isActive={this.state.swipeablePanelActive}
                    onClose={this.closePanel}
                    onPressCloseButton={this.closePanel}
                    //closeOnTouchOutside={true}
                    style={{ padding: 10 }}
                    //showCloseButton={true}
                >
					<FlatList
                        data={menusMore}
                        renderItem={this.renderItemMenu}
                        horizontal={false}
                        numColumns={3}
                        />
				</SwipeablePanel> */}
      </View>
      // </ImageBackground>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  IconBadge: {
    top: -5,
    right: 5,
    position: "absolute",
    borderRadius: 45,
    minWidth: 12,
    minHeight: 12,
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
};
export default connect(
  mapStateToProps,
  mapActionToState
)(HomeScreen);
