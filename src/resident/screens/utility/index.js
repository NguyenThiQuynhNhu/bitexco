//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { MyIcon } from "../../theme/icons";
import NavBar from "../../components/common/NavBar";
import fontsize from "../../theme/fontsize";
import { banner_utility } from "../../theme/images";
import colors from "../../theme/colors";
import { Screen } from "../../utils/device";
import Strings from "../../utils/languages";
import {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
} from "../../actions/utilities";
import {
  loadDataHandle as loadDataHandleBasic,
  refreshDataHandle2 as refreshDataHandleBasic,
  resetStateByKey as resetStateByKeyBasic,
  deleteServicedHandle,
} from "../../actions/utilitiesServicesBasic";
import {
  loadDataHandle as loadDataHandleEx,
  refreshDataHandle2 as refreshDataHandleEx,
  resetStateByKey as resetStateByKeyEx,
  deleteServiceExdHandle,
} from "../../actions/utilitiesServicesExtension";
import ErrorContent from "../../components/common/ErrorContent";
import ImageProgress from "../../components/common/ImageProgress";
import { default_user } from "../../theme/images";
import _ from "lodash";
import ListItem from "../utility/services/ServiceBasic/ListItem";
import ListItemEx from "../utility/services/ServiceExtension/ListItem";
import Spinner from "react-native-loading-spinner-overlay";
import Toast, { DURATION } from "react-native-easy-toast";
// create a component

const Banner = ({ text, onPress }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Image
        source={banner_utility}
        style={{ width: "100%", height: 100 }}
        resizeMode="stretch"
      />
      <TouchableOpacity
        onPress={onPress}
        style={{
          alignItems: "center",
          paddingVertical: 10,
          width: "50%",
          backgroundColor: "rgba(255, 255, 255,0.8)",
          borderRadius: 45,
          position: "absolute",
        }}
      >
        <Text>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Group = ({ text, onPress }) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        backgroundColor: "rgba(255, 255, 255,0.8)",
        borderRadius: 45,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{ alignItems: "center", width: "50%", position: "absolute" }}
      >
        <Text
          style={{
            fontSize: fontsize.small,
            color: colors.appTheme,
            fontWeight: "bold",
          }}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

class UtilityScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);

    this.state = {
      utilities: [
        {
          id: 0,
          name: "GYM",
        },
        {
          id: 1,
          name: "Sân Tennis",
        },
        {
          id: 2,
          name: "P.Công cộng",
        },
        {
          id: 3,
          name: "Sân cầu lông",
        },
      ],
      services: [
        {
          id: 0,
          name: "Cây xanh",
        },
        {
          id: 1,
          name: "Vệ sinh",
        },
        {
          id: 2,
          name: "Kỹ thuật",
        },
        {
          id: 3,
          name: "Quảng cáo",
        },
      ],
      basic: true,
    };
  }
  componentDidMount() {
    this.props.loadDataHandle({
      towerId: this.props.towerId,
      langId: this.props.langId,
    });
    //basic
    this.props.refreshDataHandleBasic();
    //ex
    this.props.refreshDataHandleEx();
    //this.props.resetStateByKeyEx({ key: 'initList', path: '', value: true });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
      this.props.loadDataHandle({
        towerId: nextProps.towerId,
        langId: this.props.langId,
      });
    }

    //basic
    if (
      nextProps.isRefreshingBasic &&
      nextProps.isRefreshingBasic !== this.props.isRefreshingBasic
    ) {
      const data = {
        towerId: this.props.towerId,
        statusId: 0,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPageBasic + 1,
        rowPerPage: this.props.rowPerPageBasic,
        serviceId: 0,
      };
      this.props.loadDataHandleBasic(data);
    }
    if (
      nextProps.errorDeBasic &&
      nextProps.errorDeBasic !== this.props.errorDeBasic
    ) {
      if (!nextProps.errorDeBasic.hasError) {
        //this.props.navigation.goBack();
        // this.refs.toast.show('Hủy thành công!', DURATION.LENGTH_LONG);
        this.props.refreshDataHandleBasic();
      } else {
        this.refs.toast.show(
          nextProps.errorDeBasic.message,
          DURATION.LENGTH_LONG
        );
      }
    }
    // if (nextProps.initListBasic && nextProps.initListBasic !== this.props.initListBasic) {

    //     const data = {
    //         towerId: this.props.towerId,
    //         keyword: this.state.isApplySearchKey ? this.state.searchKey : '',
    //         currentPage: nextProps.currentPageBasic + 1,
    //         rowPerPage: this.props.rowPerPageBasic,
    //         serviceId: 0
    //     };
    //     this.props.loadDataHandleBasic(data);
    // }
    if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
      this.props.refreshDataHandleBasic();
      this.props.refreshDataHandleEx();
    }
    //ex

    if (
      nextProps.isRefreshingEx &&
      nextProps.isRefreshingEx !== this.props.isRefreshingEx
    ) {
      const data = {
        towerId: this.props.towerId,
        statusId: 0,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPageEx + 1,
        rowPerPage: this.props.rowPerPageEx,
        langId: this.props.langId,
        serviceId: 0,
      };
      this.props.loadDataHandleEx(data);
    }
    if (nextProps.errorDeEx && nextProps.errorDeEx !== this.props.errorDeEx) {
      if (!nextProps.errorDeEx.hasError) {
        //this.props.navigation.goBack();
        // this.refs.toast.show('Hủy thành công!', DURATION.LENGTH_LONG);
        this.props.refreshDataHandleEx();
      } else {
        this.refs.toast.show(nextProps.errorDeEx.message, DURATION.LENGTH_LONG);
      }
    }
    // if (nextProps.initListEx && nextProps.initListEx !== this.props.initListEx) {
    //     const data = {
    //         towerId: this.props.towerId,
    //         statusId: 0,
    //         keyword: this.state.isApplySearchKey ? this.state.searchKey : '',
    //         currentPage: nextProps.currentPageEx + 1,
    //         rowPerPage: this.props.rowPerPageEx,
    //         langId: this.props.langId,
    //         serviceId: 0
    //     };
    //     console.log('Ex2')
    //     this.props.loadDataHandleEx(data);
    // }
  }

  renderItem = ({ item, index }) => {
    const { id, logo, name, typeId } = item;
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.canNav
            ? typeId === 0
              ? this.props.navigation.navigate("basicDetail", item)
              : this.props.navigation.navigate("services", item)
            : null
        }
        style={{
          margin: 10,
          width: Screen.width / 3 - 20,
          //height: Screen.width / 3,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: "#fff200",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
        >
          <ImageProgress
            //circle={true}
            source={{ uri: logo }}
            style={{
              width: 25,
              height: 24,
              backgroundColor: "transparent",
            }}
          />
        </View>
        <Text
          style={{
            marginTop: 10,
            fontFamily: "Inter-SemiBold",
            fontSize: 14,
            fontWeight: "600",
            fontStyle: "normal",
            letterSpacing: 0,
            textAlign: "center",
            color: "#000000",
          }}
        >
          {name}
        </Text>
      </TouchableOpacity>
    );
  };
  renderContent() {
    const { initComponent, isLoading, error, data, emptyData } = this.props;
    const type = this.state.basic ? 0 : 1;
    if (
      emptyData ||
      (data && data.filter((o) => o.typeId == type).length == 0)
    ) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() =>
            this.props.loadDataHandle({
              towerId: this.props.towerId,
              langId: this.props.langId,
            })
          }
        />
      );
    }
    if (initComponent || isLoading) {
      return (
        <View
          style={{
            paddingVertical: 20,
          }}
        >
          <ActivityIndicator animating size="small" />
        </View>
      );
    } else if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() =>
            this.props.loadDataHandle({
              towerId: this.props.towerId,
              langId: this.props.langId,
            })
          }
        />
      );
    } else {
      if (data) {
        const utilities = data.filter((o) => o.typeId == 0);
        const services = data.filter((o) => o.typeId == 1);

        return (
          <ScrollView style={{}} showsVerticalScrollIndicator={false}>
            <FlatList
              style={{ alignSelf: "center", marginBottom: 10 }}
              scrollEnabled={false}
              data={this.state.basic ? utilities : services}
              renderItem={this.renderItem}
              numColumns={3}
            />
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#282828",
                marginBottom: 0,
                marginHorizontal: 20,
              }}
            >
              {this.state.basic
                ? Strings.setting.utilityRegister
                : Strings.setting.serviceRegister}
            </Text>
            {this.state.basic
              ? this.renderContentBasic()
              : this.renderContentEx()}
          </ScrollView>
        );
        // } else {
        //     return (
        //         <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        //             <FlatList
        //                 style={{ alignSelf: 'center', marginBottom: 20 }}
        //                 scrollEnabled={false}
        //                 data={services}
        //                 renderItem={this.renderItem}
        //                 numColumns={3}
        //             />
        //         </ScrollView>
        //     )
        // }
      }
    }
  }
  deleteService(id) {
    Alert.alert("Thông báo", "Bạn có chắc chắn muốn hủy phiếu!", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          return this.props.deleteServicedHandle({
            bookingId: id,
            description: "Hủy phiếu",
          });
        },
      },
    ]);
  }
  renderContentBasic() {
    const {
      data,
      emptyDataBasic,
      errorBasic,
      initListBasic,
      dataBasic,
      isRefreshingBasic,
      isLoadingBasic,
    } = this.props;
    if (!data && data.length == 0) return null;
    if (isLoadingBasic) {
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
    if (emptyDataBasic) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => this.props.refreshDataHandleBasic()}
        />
      );
    }
    if (errorBasic && errorBasic.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => this.props.refreshDataHandleBasic()}
        />
      );
    }
    return (
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        refreshing={isRefreshingBasic}
        //onRefresh={() => this.props.refreshDataHandleBasic()}
        data={dataBasic}
        //style={{height: Screen.height - 380}}
        //ItemSeparatorComponent={() => <View style={{ backgroundColor: colors.grayBorder, height: 1 }} />}
        renderItem={this.renderItemBasic}
        ListFooterComponent={this.renderFooter}
        onEndReachedThreshold={0.5}
        numColumns={2}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        onEndReached={() => {
          if (
            !this.onEndReachedCalledDuringMomentum &&
            !this.props.outOfStockBasic &&
            this.props.currentPageBasic > 0 &&
            !this.props.isLoadingBasic
          ) {
            const data = {
              towerId: this.props.towerId,
              statusId: 0,
              keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
              currentPage: this.props.currentPageBasic + 1,
              rowPerPage: this.props.rowPerPageBasic,
              serviceId: 0,
            };
            this.props.loadDataHandleBasic(data);
          }
        }}
      />
    );
  }
  renderItemBasic = ({ item }) => {
    return (
      <ListItem
        item={item}
        deleteService={(id) => this.deleteService(id)}
        //onPress={() => this.props.canNavigate ? this.props.navigation.navigate('serviceBasicDetailResident', item) : null
        onPress={() =>
          this.props.navigation.navigate("serviceBasicDetailResident", item)
        }
      />
    );
  };
  renderContentEx() {
    const {
      data,
      emptyDataEx,
      errorEx,
      initListEx,
      dataEx,
      isRefreshingEx,
      outOfStockEx,
      refreshDataHandleEx,
      loadDataHandleEx,
      isLoadingEx,
    } = this.props;
    if (!data && data.length == 0) return null;
    // if (isLoadingEx) {
    //     //('initList')
    //     return (
    //         <View
    //             style={{
    //                 paddingVertical: 20,
    //             }}
    //         >
    //             <ActivityIndicator animating size="small" />
    //         </View>
    //     )
    // }
    if (emptyDataEx) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => {
            this.props.refreshDataHandleEx(),
              this.setState({ dataStatus: this.props.dataStatus });
          }}
        />
      );
    }
    if (errorEx && errorEx.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => {
            this.props.refreshDataHandleEx(),
              this.setState({ dataStatus: this.props.dataStatus });
          }}
        />
      );
    }
    return (
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        refreshing={isRefreshingEx}
        //onRefresh={() => this.props.refreshDataHandleEx()}
        data={dataEx}
        //ItemSeparatorComponent={() => <View style={{ backgroundColor: colors.grayBorder, height: 1 }} />}
        renderItem={this.renderItemEx}
        numColumns={2}
        //style={{height: Screen.height - 380}}
        ListFooterComponent={this.renderFooter}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        onEndReached={() => {
          if (
            !this.onEndReachedCalledDuringMomentum &&
            !this.props.outOfStockEx &&
            this.props.currentPageEx > 0 &&
            !this.props.isLoadingEx
          ) {
            const data = {
              towerId: this.props.towerId,
              statusId: 0,
              keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
              currentPage: this.props.currentPageEx + 1,
              rowPerPage: this.props.rowPerPageEx,
              serviceId: 0,
            };
            this.props.loadDataHandleEx(data);
          }
        }}
      />
    );
  }
  renderItemEx = ({ item }) => {
    return (
      <ListItemEx
        item={item}
        deleteService={(id) => this.deleteServiceEx(id)}
        onPress={() =>
          this.props.navigation.navigate("serviceExtensionDetailResident", item)
        }
      />
    );
  };
  deleteServiceEx(id) {
    Alert.alert("Thông báo", "Bạn có chắc chắn muốn hủy phiếu!", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          return this.props.deleteServiceExdHandle({
            bookingId: id,
            description: "Hủy phiếu",
          });
        },
      },
    ]);
  }
  render() {
    //console.log(this.props)
    const { user } = this.props;
    const uri = user ? { uri: user.photoUrl } : default_user;

    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("profile")}
              style={{ padding: 10 }}
            >
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
          }
          body={
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 20,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "black",
              }}
            >
              {Strings.tabbar.utility}
            </Text>
          }
          rightView={
            <TouchableOpacity style={{ padding: 10 }}>
              <MyIcon size={20} name="search" color="transparent" />
            </TouchableOpacity>
          }
        />

        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginTop: -10,
            alignItems: "center",
            padding: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => this.basicClick()}
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
                color: !this.state.basic ? "#c8c8c8" : "#3d3d3d",
              }}
            >
              {Strings.serviceBasic.title}
            </Text>
            <View
              style={{
                marginTop: 5,
                borderRadius: 45,
                minWidth: 25,
                minHeight: 25,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: !this.state.basic ? "#fff" : "#f8fbf5",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: 13,
                  fontWeight: "500",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "center",
                  color: !this.state.basic ? "#c8c8c8" : "#a3cd80",
                }}
              >
                {!this.props.data
                  ? "0"
                  : this.props.data.filter((o) => o.typeId == 0).length}
              </Text>
            </View>
            <View
              style={{
                width: Platform.basic ? 64 : 44,
                height: 3,
                borderRadius: 4,
                backgroundColor: !this.state.basic ? "#fff" : "#a3cd80",
                marginTop: 5,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.exClick()}
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
                color: this.state.basic ? "#c8c8c8" : "#3d3d3d",
              }}
            >
              {Strings.serviceExtension.title}
            </Text>
            <View
              style={{
                marginTop: 5,
                borderRadius: 45,
                minWidth: 25,
                minHeight: 25,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: this.state.basic ? "#fff" : "#f8fbf5",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: 13,
                  fontWeight: "500",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "center",
                  color: this.state.basic ? "#c8c8c8" : "#a3cd80",
                }}
              >
                {!this.props.data
                  ? "0"
                  : this.props.data.filter((o) => o.typeId == 1).length}
              </Text>
            </View>
            <View
              style={{
                width: Platform.isPad ? 64 : 44,
                height: 3,
                borderRadius: 4,
                backgroundColor: this.state.basic ? "#fff" : "#a3cd80",
                marginTop: 5,
              }}
            />
          </TouchableOpacity>
        </View> */}
        <View>
          <ScrollView
            horizontal
            contentContainerStyle={{
              flex: 1,
              height: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => this.basicClick()}
              style={{
                width: 120,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Bold",
                    fontSize: 14,
                    paddingLeft: 20,
                    fontWeight: "bold",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    color: "#3d3d3d",
                    paddingHorizontal: 10,
                    textAlign: "center",
                    paddingVertical: 10,
                  }}
                >
                  {Strings.serviceBasic.title}
                </Text>
                <View
                  style={{
                    borderRadius: 22 / 2,
                    width: 22,
                    height: 22,
                    justifyContent: "center",
                    backgroundColor: "#ffe800",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: 13,
                      fontWeight: "500",
                      fontStyle: "normal",
                      letterSpacing: 0,
                      textAlign: "center",
                      color: "#3d3d3d",
                    }}
                  >
                    {!this.props.data
                      ? "0"
                      : this.props.data.filter((o) => o.typeId == 0).length}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  // width: Platform.basic ? 64 : 44,
                  width: "130%",
                  height: 3,
                  borderRadius: 4,
                  backgroundColor: this.state.basic
                    ? colors.appTheme
                    : "#f1f1f1",
                  marginTop: 5,
                  paddingHorizontal: 20,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.exClick()}
              style={{
                // flex: 1,
                // justifyContent: "center",
                // alignItems: "center",
                width: 120,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Bold",
                    fontSize: 14,
                    fontWeight: "bold",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    color: "#3d3d3d",
                    paddingHorizontal: 10,
                    textAlign: "center",
                    paddingVertical: 10,
                  }}
                >
                  {Strings.serviceExtension.title}
                </Text>
                <View
                  style={{
                    borderRadius: 22 / 2,
                    width: 22,
                    height: 22,
                    justifyContent: "center",
                    backgroundColor: "#ffe800",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: 13,
                      fontWeight: "500",
                      fontStyle: "normal",
                      letterSpacing: 0,
                      textAlign: "center",
                      color: "#3d3d3d",
                    }}
                  >
                    {!this.props.data
                      ? "0"
                      : this.props.data.filter((o) => o.typeId == 1).length}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  // width: Platform.isPad ? 64 : 44,
                  width: this.state.basic ? "150%" : "130%",
                  height: 3,
                  borderRadius: 4,
                  backgroundColor: !this.state.basic
                    ? colors.appTheme
                    : "#f1f1f1",
                  marginTop: 5,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#fff",
              }}
              disabled={true}
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: 14,
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  color: this.state.type == 3 ? "#3d3d3d" : "#c8c8c8",
                  paddingHorizontal: 20,
                  textAlign: "center",
                  paddingVertical: 10,
                  color: "#fff",
                }}
              >
                {}
              </Text>
              <View
                style={{
                  // width: Platform.isPad ? 64 : 44,
                  width: this.state.type == 3 ? "200%" : "130%",
                  height: 3,
                  borderRadius: 4,
                  backgroundColor:
                    this.state.type == 3 ? colors.appTheme : "#f1f1f1",
                  marginTop: 5,
                }}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
        {this.renderContent()}
        <Toast
          ref="toast"
          style={{
            backgroundColor: colors.toast.success,
            opacity: 1,
            borderRadius: 5,
            padding: 10,
          }}
        />
        <Spinner
          visible={this.props.isLoadingDeBasic || this.props.isLoadingDeEx}
          color={colors.primaryKeyColor}
        />
      </View>
    );
  }
  basicClick() {
    this.setState({ basic: true }),
      this.props.loadDataHandle({
        towerId: this.props.towerId,
        langId: this.props.langId,
      });
    this.props.refreshDataHandleBasic();
  }

  exClick() {
    this.setState({ basic: false }),
      this.props.loadDataHandle({
        towerId: this.props.towerId,
        langId: this.props.langId,
      });
    this.props.refreshDataHandleEx();
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
  },
});

//make this component available to the app
const mapStateToProps = (state) => ({
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  langId: state.app.language == "vi" ? 1 : 2,
  data: state.utilities.data,
  emptyData: state.utilities.emptyData,
  isLoading: state.utilities.isLoading,
  error: state.utilities.error,
  initComponent: state.utilities.initComponent,
  //canNav: state.utilities.data == null,
  canNav: true,
  user: state.auth.user,
  //basic
  initListBasic: state.utilitiesServicesBasic.initList,
  currentPageBasic: state.utilitiesServicesBasic.currentPage,
  rowPerPageBasic: state.utilitiesServicesBasic.rowPerPage,
  emptyDataBasic: state.utilitiesServicesBasic.emptyData,
  outOfStockBasic: state.utilitiesServicesBasic.outOfStock,
  isLoadingBasic: state.utilitiesServicesBasic.isLoading,
  dataBasic: state.utilitiesServicesBasic.data,
  errorBasic: state.utilitiesServicesBasic.error,
  isRefreshingBasic: state.utilitiesServicesBasic.isRefreshing2,
  isApplySearchKeyBasic: state.utilitiesServicesBasic.isApplySearchKey,
  searchKeyBasic: state.utilitiesServicesBasic.searchKey,
  language: state.app.language,
  isLoadingDeBasic: state.utilitiesServicesBasic.isLoadingDe,
  errorDeBasic: state.utilitiesServicesBasic.errorDe,
  //ex
  initListEx: state.utilitiesServicesExtension.initList,
  currentPageEx: state.utilitiesServicesExtension.currentPage,
  rowPerPageEx: state.utilitiesServicesExtension.rowPerPage,
  emptyDataEx: state.utilitiesServicesExtension.emptyData,
  outOfStockEx: state.utilitiesServicesExtension.outOfStock,
  isLoadingEx: state.utilitiesServicesExtension.isLoading,
  dataEx: state.utilitiesServicesExtension.data,
  errorEx: state.utilitiesServicesExtension.error,
  isRefreshingEx: state.utilitiesServicesExtension.isRefreshing2,
  isApplySearchKeyEx: state.utilitiesServicesExtension.isApplySearchKey,
  searchKeyEx: state.utilitiesServicesExtension.searchKey,
  isLoadingDeEx: state.utilitiesServicesExtension.isLoadingDe,
  errorDeEx: state.utilitiesServicesExtension.errorDe,
});
const mapActionToProps = {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
  //basic
  loadDataHandleBasic,
  resetStateByKeyBasic,
  refreshDataHandleBasic,
  deleteServicedHandle,
  //Ex
  loadDataHandleEx,
  resetStateByKeyEx,
  refreshDataHandleEx,
  deleteServiceExdHandle,
};
export default connect(
  mapStateToProps,
  mapActionToProps
)(UtilityScreen);
