//import liraries
import React, { Component } from "react";
import {
  Picker,
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
  Item,
  Switch,
  StatusBar,
} from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import Toast, { DURATION } from "react-native-easy-toast";
import FCM, { FCMEvent } from "react-native-fcm";

//components
import ImageProgress from "../../../components/common/ImageProgress";
import ListAutoHideHeader from "../../../components/common/ListAutoHideHeader";
import { MyIcon } from "../../../theme/icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconText from "../../../components/common/IconText";
import SearchBar from "../../../components/common/SearchBar";
import ErrorContent from "../../../components/common/ErrorContent";
import Device from "../../../utils/device";
import ListData from "../../../components/Request/List/ListData";
import ButtonFilter from "../../../resident/components/Request/List/ButtonFilter";
//style
import colors from "../../../theme/colors";
import fontSize from "../../../theme/fontsize";

import NavBar from "../../../resident/components/common/NavBar";

//data
import firebase from "firebase";
import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  onSubmitEditing,
  onChangeText,
  onClearText,
  onFilter,
  onClearFilter,
} from "../../../actions/request";
import {
  converStatusToColor,
  converStatusToString,
  converTypeToSource,
} from "../../../utils/request";
import Strings from "../../../utils/languages";
import PrimaryButton from "../../../components/common/PrimaryButton";
import CircleView from "../../../components/common/CircleView";

import ButtonDateFilter from "../../../components/statistics/ButtonFilter";
import responsive from "../../../resources/responsive";

// create a component
class ReuqestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      depSelected: null,
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
      //status: 0,
      status:
        this.props.navigation.state.params != undefined &&
        this.props.navigation.state.params.idStatus != undefined
          ? this.props.navigation.state.params.idStatus
          : 0,
      typeId: 0,
      showFilter: false,
      dataStatus: this.props.dataStatus,
    };
  }
  componentDidMount() {
    this.props.resetStateByKey({ key: "initList", path: "", value: true });
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.isMine
    )
      this._onValueChangeSwitch();
  }

  async componentWillReceiveProps(nextProps) {
    const {
      isMine,
      towerId,
      rowPerPage,
      isRefreshing,
      initList,
      createStatus,
      errorResponse,
      refreshDataHandle,
      depSelected,
    } = this.props;
    if (nextProps.isRefreshing && nextProps.isRefreshing !== isRefreshing) {
      const data = {
        isMine: nextProps.isMine,
        statusId: this.state.status,
        typeId: this.state.typeId,
        towerId,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage,
        departmentId: nextProps.depSelected ? nextProps.depSelected.id : 0,
        langId: this.props.langId
      };
      await this.props.loadDataHandle(data);
      //console.log('2pp', this.props)
      setTimeout(() => {
        //const ar = [];
        this.props.dataStatus.forEach((element) => {
          element.currentValue = this.state.status;
          //ar.push(element)
        });
        this.setState({ dataStatus: this.props.dataStatus });
      }, 500);
    }

    if (nextProps.initList && nextProps.initList !== initList) {
      const data = {
        isMine: nextProps.isMine,
        statusId: this.state.status,
        typeId: 0,
        towerId,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage,
        departmentId: depSelected ? depSelected.id : 0,
        langId: this.props.langId
      };
      await this.props.loadDataHandle(data);
      setTimeout(() => {
        //const ar = [];
        this.props.dataStatus.forEach((element) => {
          element.currentValue = this.state.status;
          //ar.push(element)
        });
        this.setState({ dataStatus: this.props.dataStatus });
      }, 500);
      // setTimeout(() => {
      //     this.setState({dataStatus: this.props.dataStatus})
      // }, 5000);
    }

    if (nextProps.createStatus && createStatus !== nextProps.createStatus) {
      this.refs.toast.show(Strings.message.saveSuccess, DURATION.LENGTH_LONG);
    }

    if (nextProps.errorResponse && nextProps.errorResponse !== errorResponse) {
      if (!nextProps.errorResponse.hasError) {
        await refreshDataHandle();
        // setTimeout(() => {
        //     this.setState({dataStatus: this.props.dataStatus})
        // }, 5000);
      }
    }

    if (
      nextProps.towerId != towerId ||
      // nextProps.depSelected !== depSelected ||
      nextProps.isMine !== isMine
    ) {
      refreshDataHandle();
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
      depSelected,
    } = this.props;
    if (initList) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator color={colors.appTheme} />
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
      <ListData
        refreshing={isRefreshing}
        onRefresh={() => this._onRefresh()}
        //onRefresh={() => this.setState({dataStatus: this.props.dataStatus}), () => this.props.refreshDataHandle()}
        data={data || []}
        canNavigate={this.props.canNavigate}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        onEndReached={() => {
          if (
            !this.onEndReachedCalledDuringMomentum &&
            !this.props.outOfStock &&
            this.props.currentPage > 0
          ) {
            const towerId = this.props.user.towerId;
            const data = {
              isMine: this.props.isMine,
              statusId: this.state.status,
              typeId: this.state.typeId,
              towerId,
              keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
              currentPage: this.props.currentPage + 1,
              rowPerPage: this.props.rowPerPage,
              departmentId: depSelected ? depSelected.id : 0,
              langId: this.props.langId
            };
            this.props.loadDataHandle(data);
          }
        }}
        navigation={this.props.navigation}
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
  async _onValueChangeSwitch() {
    await this.props.resetStateByKey({
      key: "isMine",
      path: "",
      value: !this.props.isMine,
    });
    this.props.dataStatus.forEach((element) => {
      element.currentValue = this.state.status;
      //ar.push(element)
    });
    setTimeout(() => {
      this.setState({ dataStatus: this.props.dataStatus });
    }, 500);
  }
  render() {
    const {
      searchKey,
      onSubmitEditing,
      onClearText,
      onChangeText,
      navigation,
      resetStateByKey,
      onFilter,
      onClearFilter,
      user,
    } = this.props;
    const { depSelected, showFilter, typeId, dataStatus } = this.state;

    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <NavBar
          leftButton={
            <TouchableOpacity
              style={{ padding: responsive.h(10) }}
              onPress={() => this.props.navigation.goBack()}
            >
              <MyIcon name="arrow" size={responsive.h(22)} color="black" />
            </TouchableOpacity>
          }
          body={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Bold",
                    fontSize: responsive.h(20),
                    fontWeight: "bold",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    // textAlign: "center",
                    color: "black",
                  }}
                >
                  {Strings.request.title}
                </Text>
                <Text
                  style={{
                    color: "#df2027",
                    alignSelf: "center",
                    fontSize: responsive.h(15),
                    fontFamily: "Inter-Regular",
                  }}
                >
                  {Strings.request.source}: {converTypeToSource(typeId)}
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginLeft: responsive.h(60),
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: responsive.h(14),
                    color: "black",
                  }}
                >
                  {Strings.request.mine}
                </Text>
                <Switch
                  value={this.props.isMine}
                  onValueChange={() => this._onValueChangeSwitch()}
                  style={{
                    transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }],
                  }}
                  thumbColor="black"
                  trackColor="#fffff"
                  backgroundColor="ffff"
                />
              </View>
            </View>
          }
          rightView={
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => this.setState({ showFilter: true })}
                  style={{ padding: responsive.h(10) }}
                >
                  <MyIcon name="search" size={responsive.h(26)} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          }
        />

        <View style={{}}>
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
            contentContainerStyle={{}}
            data={dataStatus}
            keyExtractor={(item, index) => `${index}`}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={(item) => {
              return (
                <ButtonFilter
                  value={item.item.id}
                  currentValue={item.item.currentValue}
                  title={item.item.name}
                  total={item.item.total}
                  color={item.item.colorCode}
                  statusKey={item.item.statusKey}
                  onSelectedChange={this._onSelectedChange}
                  style={{ paddingBottom: responsive.h(10), paddingTop: responsive.h(5) }}
                />
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

        {showFilter && (
          <View
            style={{
              ...Device.defaultMarginTop(),
              height: "100%",
              width: "100%",
              position: "absolute",
              backgroundColor: colors.appOverView,
            }}
          >
            {/* <StatusBar hidden /> */}
            <View
              style={{
                marginTop: responsive.h(40),
                width: "90%",
                marginHorizontal: responsive.h(20),
                alignSelf: "center",
                padding: responsive.h(10),
                backgroundColor: "#fff",
                justifyContent: "space-between",
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
                  this.setState(
                    { isApplySearchKey: true, showFilter: false },
                    () => this.props.refreshDataHandle()
                  )
                }
                onClearText={() => {
                  const isApplySearchKeyOld = this.state.isApplySearchKey;
                  this.setState(
                    { searchKey: "", isApplySearchKey: false },
                    () => {
                      if (isApplySearchKeyOld) {
                        this.props.refreshDataHandle();
                      }
                    }
                  );
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("depDictionary", {
                    id: user.towerId,
                    onSelected: (depSelected) => this.setState({ depSelected }),
                  })
                }
                style={{
                  padding: responsive.h(10),
                  marginTop: responsive.h(10),
                  borderRadius: responsive.h(5),
                  backgroundColor: colors.gray2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: responsive.h(fontSize.small) }}>
                  {this.props.depSelected
                    ? this.props.depSelected.name
                    : depSelected
                    ? depSelected.name
                    : Strings.common.choose + " " + Strings.common.department }
                </Text>
                <MyIcon
                  name="arrow-down"
                  size={responsive.h(20)}
                  color={colors.gray1}
                />
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: responsive.h(10),
                  marginLeft: -responsive.h(10),
                }}
              >
                <ButtonDateFilter
                  value={typeId == 0}
                  text={Strings.request.all}
                  onPress={() => this.setTypeActive(0)}
                />
                <ButtonDateFilter
                  value={typeId == 1}
                  text={Strings.request.fromResidents}
                  onPress={() => this.setTypeActive(1)}
                />
                <ButtonDateFilter
                  value={typeId == 2}
                  text={Strings.request.operatingWord}
                  onPress={() => this.setTypeActive(2)}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: responsive.h(20),
                  justifyContent: "center",
                }}
              >
                <PrimaryButton
                  text={Strings.request.unfiltered}
                  onPress={() =>
                    this.setState(
                      {
                        searchKey: "",
                        isApplySearchKey: false,
                        showFilter: false,
                        depSelected: null,
                      },
                      () => onClearFilter()
                    )
                  }
                />
                <PrimaryButton
                  // visible={this.state.searchKey !== '' || this.props.depSelected !== null || depSelected !== null}
                  onPress={() =>
                    this.setState(
                      {
                        showFilter: false,
                        isApplySearchKey: this.state.searchKey.length !== 0,
                      },
                      () => onFilter({ depSelected })
                    )
                  }
                  text={Strings.request.filter}
                  style={{ marginLeft: responsive.h(10) }}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => this.setState({ showFilter: false })}
              style={{
                borderRadius: responsive.h(45),
                backgroundColor: colors.appTheme,
                padding: responsive.h(10),
                position: "absolute",
                top: responsive.h(30),
                right: responsive.h(5),
              }}
            >
              <MyIcon name="no" color="#fff" size={responsive.h(10)} />
            </TouchableOpacity>
          </View>
        )}
        {this.props.idNew == 3 ? null : (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("requestCreate")}
            style={{
              backgroundColor: colors.appTheme,
              width: responsive.h(50),
              height: responsive.h(50),
              borderRadius: responsive.h(35),
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: responsive.h(100),
              right: responsive.h(20),
            }}
          >
            <MyIcon name="plus" size={responsive.h(20)} color="#fff" />
          </TouchableOpacity>
        )}

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
    if (value == this.state.status) {
      await this.setState({ status: 0 }, () => this.props.refreshDataHandle());
      const ar = [];
      await this.props.dataStatus.forEach((element) => {
        element.currentValue = 0;
        ar.push(element);
      });
      await this.setState({ dataStatus: ar });
    } else {
      await this.setState({ status: value }, () =>
        this.props.refreshDataHandle()
      );
      const ar = [];
      await this.props.dataStatus.forEach((element) => {
        element.currentValue = value;
        ar.push(element);
      });
      await this.setState({ dataStatus: ar });
    }
  };

  setTypeActive(typeId) {
    this.setState({ typeId });
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({
  initList: state.request.initList,
  currentPage: state.request.currentPage,
  rowPerPage: state.request.rowPerPage,
  emptyData: state.request.emptyData,
  outOfStock: state.request.outOfStock,
  isLoading: state.request.isLoading,
  data: state.request.data,
  error: state.request.error,
  isRefreshing: state.request.isRefreshing,
  isApplySearchKey: state.request.isApplySearchKey,
  searchKey: state.request.searchKey,
  createStatus: state.requestCreate.error,
  canNavigate: true, //state.requestDetail.data == null,
  language: state.app.language,
  isMine: state.request.isMine,
  user: state.auth.user,
  statusId: state.request.statusId,
  errorResponse: state.requestDetail.errorResponse,
  towerId: state.auth.user.towerId,
  depSelected: state.request.depSelected,
  dataStatus: state.drawer.data,
  idNew: state.auth.idNew,
  langId: state.app.language == 'vi' ? 1 : 2,
});

const mapActionToState = {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  onSubmitEditing,
  onChangeText,
  onClearText,
  onFilter,
  onClearFilter,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(ReuqestList);
