//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  TextInput,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  RefreshControl,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import _, { concat } from "lodash";
import Toast, { DURATION } from "react-native-easy-toast";

//components
import ImageProgress from "../../../components/common/ImageProgress";
import ListAutoHideHeader from "../../../components/common/ListAutoHideHeader";
import { MyIcon } from "../../../theme/icons";
import IconText from "../../../components/common/IconText";
import SearchBar from "../../../components/common/SearchBar";
import ErrorContent from "../../../components/common/ErrorContent";
import ListItem from "./ListItem";
import ButtonFilter from "../../../components/Request/List/ButtonFilter";
//style
import colors from "../../../theme/colors";
import fontsize from "../../../theme/fontsize";
const Devices = require("react-native-device-detection");
//data
import firebase from "firebase";
import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  onSubmitEditing,
  onChangeText,
  onClearText,
  demo,
} from "../../../actions/request";
import {
  converStatusToColor,
  converStatusToString,
} from "../../../utils/request";
import Strings from "../../../utils/languages";
import NavBar from "../../../components/common/NavBar";
import { default_user } from "../../../theme/images";
import responsive from "../../../../resources/responsive";

// create a component
class ReuqestList extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      searchKey: "",
      isApplySearchKey: false,
      filter: [
        {
          statusId: 1,
          isFilter: false,
        },
        {
          statusId: 2,
          isFilter: false,
        },
        {
          statusId: 3,
          isFilter: false,
        },
        {
          statusId: 5,
          isFilter: false,
        },
      ],
      status: 0,
      isShowSearch: false,
      dataStatus: this.props.dataStatus,
      // dataStatus:[
      //     {
      //         colorCode: "#FF8080",
      //         colorInt: -32640,
      //         currentValue: 0,
      //         id: 1,
      //         name: "Yêu cầu mới",
      //         statusKey: "moi",
      //         total: 7,
      //         total2: 3
      //     },
      //     {
      //         colorCode: "#FFC080",
      //         colorInt: -16256,
      //         currentValue: 0,
      //         id: 2,
      //         name: "Đang xử lý",
      //         total: 0,
      //         total2: 0,
      //     },
      //     {
      //         colorCode: "#80FF80",
      //         colorInt: -8323200,
      //         currentValue: 0,
      //         id: 3,
      //         name: "Đã hoàn thành",
      //         statusKey: "hoan_thanh",
      //         total: 4,
      //         total2: 2
      //     }
      // ]
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
        towerId: this.props.towerId,
        statusId: this.state.status,
        keyword: nextProps.isApplySearchKey ? nextProps.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
      };
      this.props.loadDataHandle(data);
      setTimeout(() => {
        this.props.dataStatus.forEach((element) => {
          element.currentValue = this.state.status;
        });
        this.setState({ dataStatus: this.props.dataStatus });
      }, 500);
    }
    if (nextProps.initList && nextProps.initList !== this.props.initList) {
      const data = {
        towerId: this.props.towerId,
        statusId: 0,
        keyword: nextProps.isApplySearchKey ? nextProps.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
      };
      this.props.loadDataHandle(data);
    }
    if (
      nextProps.errorCreate &&
      this.props.errorCreate !== nextProps.errorCreate
    ) {
      if (!nextProps.errorCreate.hasError) {
        this.props.refreshDataHandle();
        this.setState({ dataStatus: this.props.dataStatus });
        this.refs.toast.show(
          Strings.createRequest.creatSucessAlert,
          DURATION.LENGTH_LONG
        );
      }
    }
    if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
      this.props.refreshDataHandle();
      this.setState({ dataStatus: this.props.dataStatus });
    }
  }
  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
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
            paddingVertical: responsive.h(20),
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
          onTouchScreen={() => {
            this.props.refreshDataHandle(),
              this.setState({ dataStatus: this.props.dataStatus });
          }}
        />
      );
    }
    if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => {
            this.props.refreshDataHandle(),
              this.setState({ dataStatus: this.props.dataStatus });
          }}
        />
      );
    }
    return (
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        refreshing={isRefreshing}
        onRefresh={() => this._onRefresh()}
        //onRefresh={() => this.setState({dataStatus: this.props.dataStatus}), () => this.props.refreshDataHandle()}
        data={data}
        contentContainerStyle={{
          marginTop: responsive.h(10),
          marginLeft: responsive.h(10),
        }}
        //ItemSeparatorComponent={() => <View style={{ backgroundColor: colors.grayBorder, height: 1 }} />}
        renderItem={this.renderItem}
        ListFooterComponent={this.renderFooter}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        numColumns={2}
        onEndReached={() => {
          if (
            !this.onEndReachedCalledDuringMomentum &&
            !this.props.outOfStock &&
            this.props.currentPage > 0 &&
            !this.props.isLoading
          ) {
            const data = {
              towerId: this.props.towerId,
              statusId: this.state.status,
              keyword: this.props.isApplySearchKey ? this.props.searchKey : "",
              currentPage: this.props.currentPage + 1,
              rowPerPage: this.props.rowPerPage,
            };
            this.props.loadDataHandle(data);
          }
        }}
      />
    );
  }
  async _onRefresh() {
    await this.props.refreshDataHandle();
    setTimeout(() => {
      this.props.dataStatus.forEach((element) => {
        element.currentValue = this.state.status;
        //ar.push(element)
      });
      this.setState({ dataStatus: this.props.dataStatus });
    }, 500);
  }
  renderItem = ({ item }) => {
    return (
      <ListItem
        item={item}
        onPress={() =>
          this.props.canNavigate
            ? this.props.navigation.navigate("requestDetailResident", item)
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
  render() {
    const {
      searchKey,
      onSubmitEditing,
      onClearText,
      onChangeText,
      user,
    } = this.props;
    const { isShowSearch, dataStatus } = this.state;
    const uri = user ? { uri: user.photoUrl } : default_user;
    return (
      <View style={styles.container}>
        {isShowSearch ? (
          <NavBar
            body={
              <SearchBar
                autofocus={true}
                value={searchKey}
                onChangeText={(searchKey) => onChangeText({ searchKey })}
                onSubmitEditing={onSubmitEditing}
                onClearText={() =>
                  this.setState({ isShowSearch: false }, onClearText)
                }
                style={{
                  // flex: 1,
                  // margin:
                  //   Platform.OS == "ios" ? responsive.h(15) : responsive.h(20),
                  // marginHorizontal: responsive.h(10),
                  paddingHorizontal: responsive.h(10),
                }}
              />
            }
            rightView={
              <TouchableOpacity
                onPress={() =>
                  this.setState({ isShowSearch: false }, onClearText)
                }
              >
                <Text style={{ color: "#fff" }}>{Strings.app.cancel}</Text>
              </TouchableOpacity>
            }
          />
        ) : (
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
                    height: responsive.h(40),
                    width: responsive.h(40),
                  }}
                  circle={true}
                  resizeMode="stretch"
                  type="0"
                  source={user && !_.isNil(user.photoUrl) ? uri : default_user}
                />
              </TouchableOpacity>
            }
            // body={<Text style={{ alignSelf: 'center', color: '#fff', fontSize: fontsize.larg }}>PHẢN ÁNH</Text>}
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
                {Strings.tabbar.request}
              </Text>
            }
            rightView={
              <TouchableOpacity
                style={{
                  padding: responsive.h(10),
                }}
                onPress={() => this.setState({ isShowSearch: true })}
              >
                <MyIcon size={responsive.h(24)} name="search" color="black" />
              </TouchableOpacity>
            }
          />
        )}
        <View
          style={{
            marginHorizontal: responsive.h(10),
            marginVertical: responsive.h(10),
          }}
        >
          <FlatList
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: 1,
                  backgroundColor: colors.grayBorder,
                  marginVertical: responsive.h(10),
                }}
              />
            )}
            data={dataStatus}
            keyExtractor={(item, index) => `${index}`}
            horizontal={true}
            //pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            //legacyImplementation={false}
            style={{
              marginTop: responsive.h(-15),
            }}
            renderItem={(item) => {
              return (
                <View>
                  <ButtonFilter
                    value={item.item.id}
                    currentValue={item.item.currentValue}
                    title={item.item.name}
                    total={item.item.total2}
                    color={item.item.colorCode}
                    statusKey={item.item.statusKey}
                    onSelectedChange={this._onSelectedChange}
                  />
                </View>
              );
            }}
            onEndReachedThreshold={0.5}
          />
        </View>
        <View
          style={{
            backgroundColor: "#f5f5f5",
            height: responsive.h(15),
            width: "100%",
          }}
        />
        {this._renderContent()}
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("requestCreateResident")
          }
          style={{
            backgroundColor: "#ff2121",
            width: responsive.h(48),
            height: responsive.h(48),
            borderRadius: responsive.h(35),
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: Devices.isTablet ? responsive.h(150) : responsive.h(60),
            right: responsive.h(20),
          }}
        >
          <MyIcon name="plus" size={responsive.h(20)} color="#fff" />
        </TouchableOpacity>
        <Toast
          ref="toast"
          style={{
            backgroundColor: colors.toast.success,
            opacity: 1,
            borderRadius: responsive.h(5),
            padding: responsive.h(10),
          }}
        />
      </View>
    );
  }
  _onSelectedChange = async (value) => {
    //console.log('valuenhucute')
    if (value == this.state.status) {
      const ar = [];
      await this.props.dataStatus.forEach((element) => {
        element.currentValue = 0;
        ar.push(element);
      });
      await this.setState({ dataStatus: ar });
      this.setState({ status: 0 }, () => this.props.refreshDataHandle());
    } else {
      const ar = [];
      await this.props.dataStatus.forEach((element) => {
        element.currentValue = value;
        ar.push(element);
      });
      await this.setState({ dataStatus: ar });
      this.setState({ status: value }, () => this.props.refreshDataHandle());
    }
    // const ar = [];
    // await this.state.dataStatus.forEach(element => {
    //     element.currentValue = value
    //     ar.push(element)
    // });

    // this.props.demo(value, this.props.dataStatus)
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  initList: state.requestResident.initList,
  currentPage: state.requestResident.currentPage,
  rowPerPage: state.requestResident.rowPerPage,
  emptyData: state.requestResident.emptyData,
  outOfStock: state.requestResident.outOfStock,
  isLoading: state.requestResident.isLoading,
  data: state.requestResident.data,
  error: state.requestResident.error,
  isRefreshing: state.requestResident.isRefreshing,
  isApplySearchKey: state.requestResident.isApplySearchKey,
  searchKey: state.requestResident.searchKey,
  errorCreate: state.requestCreateResident.error,
  canNavigate: state.requestCreateResident.data == null,
  language: state.app.language,
  user: state.auth.user,
  dataStatus: state.drawer.data,
});

const mapActionToState = {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  onSubmitEditing,
  onChangeText,
  onClearText,
  demo,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(ReuqestList);
