import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import { Screen } from "../../../utils/device";
import Strings from "../../../utils/languages";
import NavBar from "../../../components/common/NavBar";
import fontsize from "../../../theme/fontsize";
import colors from "../../../theme/colors";
import { MyIcon } from "../../../theme/icons";
import moment from "moment";
import ErrorContent from "../../../components/common/ErrorContent";
import Toast, { DURATION } from "react-native-easy-toast";
import Spinner from "react-native-loading-spinner-overlay";
//
import {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
  deleteCarCardHandle,
  requestStopCarCardHandle,
} from "../../../actions/carCard";
class ListItem extends PureComponent {
  render() {
    const { item, onPress, deleteCard, type, requestStopCard } = this.props;
    const {
      isMonthlyTicket,
      cardID,
      cardHolder,
      registrationDate,
      typeID,
      typeName,
      licencePlate,
      carColor,
      typeCarName,
      isConfirm,
      isRequest,
    } = item;
    return (
      <TouchableOpacity
        style={{
          marginBottom: 10,
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
        onPress={onPress}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              borderRadius: 45,
              height: 40,
              width: 40,
              backgroundColor: "#fff200",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <MyIcon name="file-text" size={20} color={colors.appTheme} />
          </View>
          <View
            style={{ flex: 1, justifyContent: "space-between", margin: 10 }}
          >
            <Text
              lineBreakMode="tail"
              numberOfLines={2}
              style={{
                flexDirection: "row",
                width: Screen.width - 110,
                fontFamily: "Inter-SemiBold",
                fontSize: 14,
                fontWeight: "600",
                color: "#282828",
                flex: 1,
              }}
            >
              {licencePlate}_{cardHolder}
            </Text>
            <Text
              lineBreakMode="tail"
              numberOfLines={2}
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 12,
                color: "#6f6f6f",
                flex: 1,
                marginTop: 5,
              }}
            >
              {typeName}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: 5,
              }}
            >
              <Text
                lineBreakMode="tail"
                numberOfLines={2}
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                  color: "#6f6f6f",
                  flex: 1,
                }}
              >
                {typeCarName} - {carColor}
              </Text>
            </View>
            <Text
              lineBreakMode="tail"
              numberOfLines={2}
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 12,
                color: isConfirm ? colors.appTheme : "red",
                flex: 1,
                marginTop: 5,
              }}
            >
              {isConfirm
                ? Strings.carCard.approvedText
                : Strings.carCard.cancelledText}
              <Text
                lineBreakMode="tail"
                numberOfLines={2}
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                  color: "red",
                  flex: 1,
                  marginTop: 5,
                  fontStyle: "italic",
                }}
              >
                {isRequest && ` (${Strings.carCard.cardHasBeenSentText})`}
              </Text>
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingTop: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 11,
                  color: "#6f6f6f",
                }}
              >
                {moment(registrationDate).format("DD/MM/YYYY HH:mm")}
              </Text>
            </View>
          </View>
          {!isConfirm && (
            <TouchableOpacity
              style={{
                borderRadius: 45,
                height: 40,
                width: 40,
                backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
              onPress={() => deleteCard(item.cardID)}
            >
              <MyIcon name="x" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        {isMonthlyTicket && isRequest && (
          <TouchableOpacity
            style={{
              borderRadius: 5,
              backgroundColor: "#ff4800",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
            onPress={() => requestStopCard(item.cardID, false)}
          >
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 14,
                color: "#fff",
              }}
            >
              {Strings.carCard.deleteTheRequestText}
            </Text>
          </TouchableOpacity>
        )}
        {isMonthlyTicket && !isRequest && (
          <TouchableOpacity
            style={{
              borderRadius: 5,
              backgroundColor: colors.appTheme,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
            onPress={() => requestStopCard(item.cardID, true)}
          >
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 14,
                color: "#fff",
              }}
            >
              {Strings.carCard.requestCancelCardText}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }
}
class ListItem3 extends PureComponent {
  render() {
    const { item, onPress, deleteCard, type } = this.props;
    const {
      cardID,
      cardHolder,
      registrationDate,
      typeID,
      typeName,
      licencePlate,
      carColor,
      typeCarName,
      isConfirm,
      isRequest,
    } = item;
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          marginBottom: 10,
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
        onPress={onPress}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              borderRadius: 45,
              height: 40,
              width: 40,
              backgroundColor: "#fff200",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <MyIcon name="file-text" size={20} color={colors.appTheme} />
          </View>
          <View
            style={{ flex: 1, justifyContent: "space-between", margin: 10 }}
          >
            <Text
              lineBreakMode="tail"
              numberOfLines={2}
              style={{
                flexDirection: "row",
                width: Screen.width - 110,
                fontFamily: "Inter-SemiBold",
                fontSize: 14,
                fontWeight: "600",
                color: "#282828",
                flex: 1,
              }}
            >
              {licencePlate}_{cardHolder}
            </Text>
            <Text
              lineBreakMode="tail"
              numberOfLines={2}
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 12,
                color: "#6f6f6f",
                flex: 1,
                marginTop: 5,
              }}
            >
              {typeName}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: 5,
              }}
            >
              <Text
                lineBreakMode="tail"
                numberOfLines={2}
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                  color: "#6f6f6f",
                  flex: 1,
                }}
              >
                {typeCarName} - {carColor}
              </Text>
            </View>
            <Text
              lineBreakMode="tail"
              numberOfLines={2}
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 12,
                color: "red",
                flex: 1,
                marginTop: 5,
              }}
            >
              {Strings.carCard.cancelledText}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingTop: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 11,
                  color: "#6f6f6f",
                }}
              >
                {moment(registrationDate).format("DD/MM/YYYY HH:mm")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
class CarCardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 1,
    };
  }
  componentDidMount() {
    this.props.resetStateByKey({ key: "initList", path: "", value: true });
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing
    ) {
      const data = {
        departmentID: this.props.user.spaceMainId,
      };
      this.props.loadDataHandle(data);
    }
    if (nextProps.initList && nextProps.initList !== this.props.initList) {
      const data = {
        departmentID: this.props.user.spaceMainId,
      };
      this.props.loadDataHandle(data);
    }
    if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
      this.props.refreshDataHandle();
    }

    if (nextProps.errorDe && nextProps.errorDe !== this.props.errorDe) {
      if (!nextProps.errorDe.hasError) {
        //this.props.navigation.goBack();
        this.props.refreshDataHandle();
      } else {
        this.refs.toast.show(nextProps.errorDe.message, DURATION.LENGTH_LONG);
      }
    }

    if (nextProps.errorStop && nextProps.errorStop !== this.props.errorStop) {
      if (!nextProps.errorStop.hasError) {
        //this.props.navigation.goBack();
        this.props.refreshDataHandle();
      } else {
        this.refs.toast.show(nextProps.errorStop.message, DURATION.LENGTH_LONG);
      }
    }
  }
  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }
  deleteCard(id) {
    Alert.alert(Strings.carCard.alert, Strings.carCard.alertHuyThe, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          return this.props.deleteCarCardHandle({ CardID: id });
        },
      },
    ]);
  }
  requestStopCard(id, isStop) {
    Alert.alert(
      Strings.carCard.alert,
      isStop
        ? Strings.carCard.cardCancellationWarningText
        : Strings.carCard.alertThuHoiHuyThe,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            return this.props.requestStopCarCardHandle({
              CardID: id,
              departmentID: this.props.user.spaceMainId,
              IsStop: isStop,
            });
          },
        },
      ]
    );
  }
  renderItem1 = ({ item }) => {
    if (item.isMonthlyTicket) {
      return (
        <ListItem
          type={this.state.type}
          item={item}
          deleteCard={(id) => this.deleteCard(id)}
          requestStopCard={(id, isStop) => this.requestStopCard(id, isStop)}
          onPress={() => this.props.navigation.navigate("carCardCreate", item)}
        />
      );
    }
    return null;
  };
  renderItem2 = ({ item }) => {
    if (!item.isMonthlyTicket && !item.isApproval) {
      return (
        <ListItem
          type={this.state.type}
          item={item}
          deleteCard={(id) => this.deleteCard(id)}
          requestStopCard={(id, isStop) => this.requestStopCard(id, isStop)}
          onPress={() => this.props.navigation.navigate("carCardCreate", item)}
        />
      );
    }
    return null;
  };
  renderItem3 = ({ item }) => {
    if (!item.isMonthlyTicket && item.isStop) {
      return (
        <ListItem3
          type={this.state.type}
          item={item}
          deleteCard={(id) => this.deleteCard(id)}
          onPress={() => this.props.navigation.navigate("carCardCreate", item)}
        />
      );
    }
    return null;
  };
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
        onRefresh={() => this.props.refreshDataHandle()}
        data={data}
        renderItem={
          this.state.type == 1
            ? this.renderItem2
            : this.state.type == 2
            ? this.renderItem1
            : this.renderItem3
        }
        onEndReachedThreshold={0.5}
        style={{ paddingHorizontal: 10, marginTop: 7 }}
      />
    );
  }
  render() {
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
                padding: 10,
                width: Screen.width - 124,
                fontFamily: "Inter-Bold",
                fontSize: 18,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "black",
              }}
              numberOfLines={2}
              lineBreakMode="tail"
            >
              {Strings.carCard.title}
            </Text>
          }
          rightView={
            <TouchableOpacity style={{ padding: 10 }}>
              <MyIcon name="reply" color="black" size={20} />
            </TouchableOpacity>
          }
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginVertical: 10,
            alignItems: "center",
            padding: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => this.setState({ type: 1 })}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 14,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: this.state.type == 1 ? "#3d3d3d" : "#c8c8c8",
              }}
            >
              {Strings.carCard.registrationCardText}
            </Text>
            <View
              style={{
                width: Platform.basic ? 64 : 44,
                height: 3,
                borderRadius: 4,
                backgroundColor: this.state.type == 1 ? "#a3cd80" : "#fff",
                marginTop: 5,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ type: 2 })}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 14,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: this.state.type == 2 ? "#3d3d3d" : "#c8c8c8",
              }}
            >
              {Strings.carCard.activityCardText}
            </Text>
            <View
              style={{
                width: Platform.isPad ? 64 : 44,
                height: 3,
                borderRadius: 4,
                backgroundColor: this.state.type == 2 ? "#a3cd80" : "#fff",
                marginTop: 5,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ type: 3 })}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 14,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: this.state.type == 3 ? "#3d3d3d" : "#c8c8c8",
              }}
            >
              {Strings.carCard.cancellationCardText}
            </Text>
            <View
              style={{
                width: Platform.isPad ? 64 : 44,
                height: 3,
                borderRadius: 4,
                backgroundColor: this.state.type == 3 ? "#a3cd80" : "#fff",
                marginTop: 5,
              }}
            />
          </TouchableOpacity>
        </View>
        {this._renderContent()}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("carCardCreate")}
          style={{
            backgroundColor: colors.appTheme,
            width: 50,
            height: 50,
            borderRadius: 35,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 20,
            right: 20,
          }}
        >
          <MyIcon name="plus" size={20} color="#fff" />
        </TouchableOpacity>
        <Toast
          ref="toast"
          style={{
            backgroundColor: colors.toast.warning,
            opacity: 1,
            borderRadius: 5,
            padding: 10,
          }}
        />
        <Spinner
          visible={this.props.isLoadingDe || this.props.isLoadingStop}
          color={colors.primaryKeyColor}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
const mapStateToProps = (state) => ({
  user: state.auth.user,
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  data: state.carCard.data,
  isLoading: state.carCard.isLoading,
  error: state.carCard.error,
  emptyData: state.carCard.emptyData,
  initList: state.carCard.initList,
  isRefreshing: state.carCard.isRefreshing,

  errorDe: state.carCardCreate.errorDe,
  isLoadingDe: state.carCardCreate.isLoadingDe,
  errorStop: state.carCardCreate.errorStop,
  isLoadingStop: state.carCardCreate.isLoadingStop,
});

const mapActionToProps = {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
  deleteCarCardHandle,
  requestStopCarCardHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(CarCardScreen);
