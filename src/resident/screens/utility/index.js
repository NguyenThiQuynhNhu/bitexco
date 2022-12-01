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
import responsive from "../../../resources/responsive";
// create a component

const Banner = ({ text, onPress }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Image
        source={banner_utility}
        style={{ width: "100%", height: responsive.h(100) }}
        resizeMode="stretch"
      />
      <TouchableOpacity
        onPress={onPress}
        style={{
          alignItems: "center",
          paddingVertical: responsive.w(10),
          width: "50%",
          backgroundColor: "rgba(255, 255, 255,0.8)",
          borderRadius: responsive.h(45),
          position: "absolute",
        }}
      >
        <Text
          style={{
            fontSize: responsive.h(14),
          }}
        >
          {text}
        </Text>
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
        height: responsived.h(50),
        backgroundColor: "rgba(255, 255, 255,0.8)",
        borderRadius: responsive.h(45),
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{ alignItems: "center", width: "50%", position: "absolute" }}
      >
        <Text
          style={{
            fontSize: responsive.h(fontsize.small),
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
          margin: responsive.h(10),
          width: Screen.width / 3 - responsive.w(20),
          //height: Screen.width / 3,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: responsive.h(40),
            height: responsive.h(40),
            backgroundColor: colors.appTheme,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: responsive.h(5),
          }}
        >
          <ImageProgress
            //circle={true}
            source={{ uri: logo }}
            style={{
              width: responsive.h(25),
              height: responsive.h(25),
              backgroundColor: "transparent",
            }}
          />
        </View>
        <Text
          style={{
            marginTop: responsive.h(10),
            fontFamily: "Inter-Regular",
            fontSize: responsive.h(14),
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
            paddingVertical: responsive.h(20),
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
              style={{ alignSelf: "center", margin: responsive.h(10) }}
              scrollEnabled={false}
              data={this.state.basic ? utilities : services}
              renderItem={this.renderItem}
              numColumns={3}
            />
            <View
              style={{
                height: responsive.h(15),
                backgroundColor: "#f5f5f5",
                width: "100%",
                marginBottom: responsive.h(10),
              }}
            />
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(16),
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#282828",
                marginHorizontal: responsive.h(10),
                marginVertical: responsive.h(10),
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
            paddingVertical: responsive.h(20),
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
        data={dataBasic}
        contentContainerStyle={{
          marginTop: responsive.h(10),
          marginLeft: responsive.h(10),
        }}
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
        data={dataEx}
        contentContainerStyle={{
          marginTop: responsive.h(10),
          marginLeft: responsive.h(10),
        }}
        renderItem={this.renderItemEx}
        numColumns={2}
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
              style={{
                padding: responsive.h(10),
              }}
              onPress={() => this.props.navigation.navigate("profile")}
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
          }
          body={
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(20),
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
            <TouchableOpacity
              style={{
                paddingHorizontal: responsive.h(20),
              }}
            >
              <MyIcon
                size={responsive.h(20)}
                name="search"
                color="transparent"
              />
            </TouchableOpacity>
          }
        />

        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
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
            <TouchableOpacity
              onPress={() => this.basicClick()}
              style={{
                justifyContent: 'center',
                paddingVertical: responsive.h(10)
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
                    fontSize: responsive.h(14),
                    fontWeight: "bold",
                    color: "#3d3d3d",
                    textAlign: "center",
                    marginLeft: responsive.h(20),
                  }}
                >
                  {Strings.serviceBasic.title}
                </Text>
                <View
                  style={{
                    borderRadius: responsive.h(22),
                    width: responsive.h(22),
                    height: responsive.h(22),
                    justifyContent: "center",
                    backgroundColor: "#fff5eb",
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: responsive.h(10)
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: responsive.h(13),
                      fontWeight: "500",
                      fontStyle: "normal",
                      letterSpacing: 0,
                      color: "#3d3d3d",
                    }}
                  >
                    {!this.props.data
                      ? "0"
                      : this.props.data.filter((o) => o.typeId == 0).length}
                  </Text>
                </View>
              </View>

              {/* <View
                style={{
                  width: "100%",
                  height: 3,
                  borderRadius: responsive.h(4),
                  backgroundColor: this.state.basic
                    ? colors.appTheme
                    : "#f1f1f1",
                }}
              /> */}
              <View
                style={{
                  backgroundColor: this.state.basic
                    ? colors.appTheme
                    : "#f1f1f1",
                  width: '100%',
                  height: responsive.h(3),
                  borderRadius: 4,
                  position: 'absolute',
                  bottom: 0,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.exClick()}
              style={{
                justifyContent: 'center',
                paddingVertical: responsive.h(10)
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
                    fontSize: responsive.h(14),
                    fontWeight: "bold",
                    fontStyle: "normal",
                    color: "#3d3d3d",
                    textAlign: "center",
                    marginLeft: responsive.h(20),
                  }}
                >
                  {Strings.serviceExtension.title}
                </Text>
                <View
                  style={{
                    borderRadius: responsive.h(22),
                    width: responsive.h(22),
                    height: responsive.h(22),
                    justifyContent: "center",
                    backgroundColor: "#fff5eb",
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: responsive.h(10)
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: responsive.h(13),
                      fontWeight: "500",
                      fontStyle: "normal",
                      letterSpacing: 0,
                      color: "#3d3d3d",
                    }}
                  >
                    {!this.props.data
                      ? "0"
                      : this.props.data.filter((o) => o.typeId == 1).length}
                  </Text>
                </View>
              </View>

              {/* <View
                style={{
                  width: '100%',
                  height: 3,
                  borderRadius: responsive.h(4),
                  backgroundColor: !this.state.basic
                    ? colors.appTheme
                    : "#f1f1f1",
                }}
              /> */}
              <View
                style={{
                  backgroundColor: !this.state.basic
                    ? colors.appTheme
                    : "#f1f1f1",
                  width: '100%',
                  height: responsive.h(3),
                  borderRadius: 4,
                  position: 'absolute',
                  bottom: 0,
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
            borderRadius: responsive.h(5),
            padding: responsive.h(10),
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
