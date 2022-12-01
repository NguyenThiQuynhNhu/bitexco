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
  ScrollView,
  SafeAreaView,
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
import responsive from "../../../../resources/responsive";
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
          flexDirection: "row",
          marginBottom: responsive.h(10),
          borderRadius: responsive.h(12),
          backgroundColor: "#ffffff",
          borderWidth: 0.5,
          borderColor: "#d2d2d2",
          borderBottomWidth: 2,
          // shadowColor: "rgba(0, 0, 0, 0.1)",
          // elevation: 2,
          // shadowOffset: {
          //   width: 0,
          //   height: 4,
          // },
          // shadowRadius: 10,
          // shadowOpacity: 1,
          marginHorizontal: responsive.h(10),
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
              borderRadius: responsive.h(45),
              height: responsive.h(40),
              width: responsive.h(40),
              backgroundColor: "#fff200",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: responsive.h(10),
            }}
          >
            <MyIcon
              name="file-text"
              size={responsive.h(20)}
              color={colors.appTheme}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              margin: responsive.h(10),
            }}
          >
            <Text
              lineBreakMode="tail"
              numberOfLines={2}
              style={{
                flexDirection: "row",
                width: Screen.width - responsive.w(110),
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(14),
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
                fontSize: responsive.h(12),
                color: "#6f6f6f",
                flex: 1,
                marginTop: responsive.h(5),
              }}
            >
              {typeName}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: responsive.h(5),
              }}
            >
              <Text
                lineBreakMode="tail"
                numberOfLines={2}
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: responsive.h(12),
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
                fontSize: responsive.h(12),
                color: isConfirm ? colors.appTheme : "red",
                flex: 1,
                marginTop: responsive.h(5),
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
                  fontSize: responsive.h(12),
                  color: "red",
                  flex: 1,
                  marginTop: responsive.h(5),
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
                paddingTop: responsive.h(5),
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: responsive.h(11),
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
                borderRadius: responsive.h(45),
                height: responsive.h(40),
                width: responsive.h(40),
                backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center",
                marginRight: responsive.h(10),
              }}
              onPress={() => deleteCard(item.cardID)}
            >
              <MyIcon name="x" size={responsive.h(20)} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        {isMonthlyTicket && isRequest && (
          <TouchableOpacity
            style={{
              borderRadius: responsive.h(5),
              backgroundColor: "#ff4800",
              justifyContent: "center",
              alignItems: "center",
              padding: responsive.h(10),
              margin: responsive.h(10),
            }}
            onPress={() => requestStopCard(item.cardID, false)}
          >
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(14),
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
              borderRadius: responsive.h(5),
              backgroundColor: colors.appTheme,
              justifyContent: "center",
              alignItems: "center",
              padding: responsive.h(10),
              margin: responsive.h(10),
            }}
            onPress={() => requestStopCard(item.cardID, true)}
          >
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(14),
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
          marginBottom: responsive.h(10),
          borderRadius: responsive.h(12),
          backgroundColor: "#ffffff",
          borderWidth: 0.5,
          borderColor: "#d2d2d2",
          borderBottomWidth: 2,
          marginHorizontal: responsive.h(10),
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
              borderRadius: responsive.h(45),
              height: responsive.h(40),
              width: responsive.h(40),
              backgroundColor: "#fff200",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: responsive.h(10),
            }}
          >
            <MyIcon
              name="file-text"
              size={responsive.h(20)}
              color={colors.appTheme}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              margin: responsive.h(10),
            }}
          >
            <Text
              lineBreakMode="tail"
              numberOfLines={2}
              style={{
                flexDirection: "row",
                width: Screen.width - 110,
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(14),
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
                fontSize: responsive.h(12),
                color: "#6f6f6f",
                flex: 1,
                marginTop: responsive.h(5),
              }}
            >
              {typeName}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: responsive.h(5),
              }}
            >
              <Text
                lineBreakMode="tail"
                numberOfLines={2}
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: responsive.h(12),
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
                fontSize: responsive.h(12),
                color: "red",
                flex: 1,
                marginTop: responsive.h(5),
              }}
            >
              {Strings.carCard.cancelledText}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingTop: responsive.h(5),
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: responsive.h(11),
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
    } else
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
      );
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
    } else
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
      );
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
    } else
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
      );
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
            paddingVertical: responsive.h(20),
          }}
        >
          <ActivityIndicator animating size="small" />
        </View>
      );
    }
    if (emptyData) return (
      <ErrorContent
        title={Strings.app.emptyData}
        onTouchScreen={() => this.props.refreshDataHandle()}
      />
    )

    if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
      );
    }
    if (data) {
      let data1 = data.filter(i => i.isMonthlyTicket);
      let data2 = data.filter(i => !i.isMonthlyTicket && !i.isApproval);
      let data3 = data.filter(i => !i.isMonthlyTicket && i.isStop);
      if (this.state.type == 1 && data1.length == 0) {
        return (
          <ErrorContent
            title={Strings.app.emptyData}
            onTouchScreen={() => this.props.refreshDataHandle()}
          />
        )
      }
      if (this.state.type == 3 && data2.length == 0) {
        return (
          <ErrorContent
            title={Strings.app.emptyData}
            onTouchScreen={() => this.props.refreshDataHandle()}
          />
        )
      }
      if (this.state.type == 2 && data3.length == 0) {
        return (
          <ErrorContent
            title={Strings.app.emptyData}
            onTouchScreen={() => this.props.refreshDataHandle()}
          />
        )
      }
      return (
        <FlatList
          keyExtractor={(item, index) => `${index}`}
          refreshing={isRefreshing}
          onRefresh={() => this.props.refreshDataHandle()}
          data={data}
          renderItem={
            this.state.type == 1
              ? this.renderItem1
              : this.state.type == 2
                ? this.renderItem3
                : this.renderItem2
          }
          onEndReachedThreshold={0.5}
          style={{
            flex: 1,
            paddingHorizontal: responsive.h(10),
            marginTop: responsive.h(7),
          }}
          contentContainerStyle={{
            marginTop: responsive.h(10),
          }}
        />
      );
    }

  }
  render() {
    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                padding: responsive.h(10), paddingHorizontal: responsive.h(12)
              }}
            >
              <MyIcon name="arrow" color="black" size={responsive.h(20)} />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(20),
                fontWeight: "bold",
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
            <TouchableOpacity
              style={{ padding: responsive.h(10), paddingHorizontal: responsive.h(12) }}
            >
              <MyIcon name="arrow" color="transparent" size={responsive.h(20)} />
            </TouchableOpacity>
          }
        />
        <View style={{}}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
            }}
          >
            <View
              style={{
                backgroundColor: "#f1f1f1",
                width: Screen.width,
                height: responsive.h(3),
                borderRadius: 4,
                position: 'absolute',
                bottom: 0,
              }}
            />
            <TouchableOpacity onPress={() => this.setState({ type: 1 })}>
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(14),
                  paddingLeft: responsive.h(20),
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  color: "#3d3d3d",
                  paddingHorizontal: responsive.h(20),
                  textAlign: "center",
                  paddingVertical: responsive.h(10),
                }}
              >
                {Strings.carCard.registrationCardText}
              </Text>
              <View
                style={{
                  width: '100%',
                  height: responsive.h(3),
                  borderRadius: 4,
                  backgroundColor:
                    this.state.type == 1 ? colors.appTheme : "#f1f1f1",
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setState({ type: 2 })}
              style={{}
              }
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(14),
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  color: "#3d3d3d",
                  paddingHorizontal: responsive.h(20),
                  textAlign: "center",
                  paddingVertical: responsive.h(10),
                }}
              >
                {Strings.carCard.activityCardText}
              </Text>
              <View
                style={{
                  backgroundColor:
                    this.state.type == 2 ? colors.appTheme : "#f1f1f1",
                  width: '100%',
                  height: responsive.h(3),
                  borderRadius: 4,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setState({ type: 3 })}
              style={{}}
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(14),
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  color: "#3d3d3d",
                  paddingHorizontal: responsive.h(20),
                  textAlign: "center",
                  paddingVertical: responsive.h(10),
                }}
              >
                {Strings.carCard.cancellationCardText}
              </Text>
              <View
                style={{
                  backgroundColor:
                    this.state.type == 3 ? colors.appTheme : "#f1f1f1",
                  width: '100%',
                  height: responsive.h(3),
                  borderRadius: 4,
                }}
              />
            </TouchableOpacity>

          </ScrollView>
        </View>
        {this._renderContent()}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("carCardCreate")}
          style={{
            backgroundColor: colors.appTheme,
            width: responsive.h(50),
            height: responsive.h(50),
            borderRadius: responsive.h(35),
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: responsive.h(20),
            right: responsive.h(20),
          }}
        >
          <MyIcon name="plus" size={responsive.h(20)} color="#fff" />
        </TouchableOpacity>
        <Toast
          ref="toast"
          style={{
            backgroundColor: colors.toast.warning,
            opacity: 1,
            borderRadius: responsive.h(5),
            padding: responsive.h(10),
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

