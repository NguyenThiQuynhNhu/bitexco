//import liraries
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";

//components
//import ImageProgress from '../../components/common/ImageProgress';

import SearchBar from "../../../components/common/SearchBar";
import ErrorContent from "../../../components/common/ErrorContent";
import Device from "../../../utils/device";

import ButtonFilter from "../../../components/vendor/List/ButtonFilter";
import ListItem from "./ListItem";
//style
import colors from "../../../theme/colors";
//data

import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
} from "../../../actions/vendor";
import { getProfile } from "../../../actions/auth";
import FCM, { FCMEvent } from "react-native-fcm";
import Strings from "../../../utils/languages";
import { AddItemToList } from "../../../actions/notification";
import responsive from "../../../../resources/responsive";

// create a component
class ListDataVendor extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      type: 20,
      isApplySearchKey: false,
      searchKey: "",
    };
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.initList && this.props.initList !== nextProps.initList) {
      this.props.loadDataHandle({
        langId: this.props.language == "vi" ? 1 : 2,
        typeId: this.state.type,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
      });
    }
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing
    ) {
      this.props.loadDataHandle({
        langId: this.props.language == "vi" ? 1 : 2,
        typeId: this.state.type,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
      });
    }
  }
  componentDidMount() {
    this.unsubscribe = FCM.on(FCMEvent.Notification, (notif) => {
      console.log("Notification", notif);
      const itemData = JSON.parse(notif.item);

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

      if (notif.opened_from_tray) {
        //Yêu cầu
        if (notif.actionId == 1) {
          setTimeout(() => {
            this.props.navigation.navigate("requestDetail", itemData);
          }, 500);
        }
        //Tin tức
        else if (notif.actionId == 2) {
          setTimeout(() => {
            this.props.navigation.navigate("newsDetail", {
              item: itemData,
              type: itemData.typeId,
            });
          }, 500);
        }
      } else if (Platform.OS === "android" && !notif.local_notification) {
        FCM.presentLocalNotification({
          vibrate: 500,
          title: notif.title,
          body: notif.body,
          actionId: notif.actionId,
          item: notif.item,
          sound: "default",
          priority: "high",
          show_in_foreground: true,
        });
        this.props.AddItemToList(itemData);
      }

      if (Platform.OS === "ios") {
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
    this.props.getProfile();
    this.props.resetStateByKey({ key: "initList", path: "", value: true });
  }
  renderItem = ({ item, index }) => {
    return (
      <ListItem
        item={item}
        onPress={() =>
          this.props.canNavigate
            ? this.props.navigation.navigate("vendorDetail", item)
            : null
        }
      />
    );
  };
  renderFooter = () => {
    if (!this.props.isLoading || this.props.isRefreshing) return null;
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

  renderContent() {
    const { data, isRefreshing, error, emptyData } = this.props;

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
        refreshing={isRefreshing}
        onRefresh={() => this.props.refreshDataHandle()}
        data={data}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (
            !this.onEndReachedCalledDuringMomentum &&
            !this.props.outOfStock &&
            this.props.currentPage > 0 &&
            !this.props.isLoading
          ) {
            const data = {
              langId: this.props.language == "vi" ? 1 : 2,
              typeId: this.state.type,
              keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
              currentPage: this.props.currentPage + 1,
              rowPerPage: this.props.rowPerPage,
            };
            this.props.loadDataHandle(data);
          }
        }}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        ListFooterComponent={this.renderFooter}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            ...Device.defaultNavBarStyle(),
            backgroundColor: colors.appTheme,
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
              this.setState({ isApplySearchKey: true }, () =>
                this.props.refreshDataHandle()
              )
            }
            onClearText={() => {
              const isApplySearchKeyOld = this.state.isApplySearchKey;
              this.setState({ searchKey: "", isApplySearchKey: false }, () => {
                if (isApplySearchKeyOld) {
                  this.props.refreshDataHandle();
                }
              });
            }}
            style={{
              flex: 1,
              margin: Platform.OS == "ios" ? responsive.h(5) : responsive.h(10),
              marginHorizontal: responsive.w(10),
            }}
          />
        </View>
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              backgroundColor: "#fff",
              borderBottomWidth: 1,
              borderBottomColor: colors.grayBorder,
              paddingVertical: responsive.h(10),
            }}
          >
            <ButtonFilter
              value={20}
              currentValue={this.state.type}
              onSelectedChange={this._onSelectedChange}
            />
            <ButtonFilter
              value={10}
              currentValue={this.state.type}
              onSelectedChange={this._onSelectedChange}
            />
            <ButtonFilter
              value={0}
              currentValue={this.state.type}
              onSelectedChange={this._onSelectedChange}
            />
          </ScrollView>
        </View>
        {this.renderContent()}
      </View>
    );
  }
  componentWillUnmount() {
    this.unsubscribe.remove();
    this.props.resetStateByKey({ key: "state" });
  }
  _onSelectedChange = (type) => {
    this.setState({ type }, () => this.props.refreshDataHandle());
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({
  initList: state.vendor.initList,
  currentPage: state.vendor.currentPage,
  rowPerPage: state.vendor.rowPerPage,
  emptyData: state.vendor.emptyData,
  outOfStock: state.vendor.outOfStock,
  isLoading: state.vendor.isLoading,
  data: state.vendor.data,
  error: state.vendor.error,
  isRefreshing: state.vendor.isRefreshing,
  canNavigate: state.vendorDetail.data == null,
  language: state.app.language,
});

const mapActionToState = {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  AddItemToList,
  getProfile,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(ListDataVendor);
