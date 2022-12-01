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
  Alert,
} from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import Toast, { DURATION } from "react-native-easy-toast";

//components
import ImageProgress from "../../../components/common/ImageProgress";
import ListAutoHideHeader from "../../../components/common/ListAutoHideHeader";
import { MyIcon } from "../../../theme/icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconText from "../../../components/common/IconText";
import SearchBar from "../../../components/common/SearchBar";
import InputNumber from "../../../components/common/InputNumber";
import ErrorContent from "../../../components/common/ErrorContent";
import Device from "../../../utils/device";
import ListData from "../../../components/Water/List/ListData";
//style
import colors from "../../../theme/colors";
import fontSize from "../../../theme/fontsize";
import NavBar from "../../../resident/components/common/NavBar";
const Devices = require("react-native-device-detection");
import Strings from "../../../utils/languages";
import PrimaryButton from "../../../components/common/PrimaryButton";
import CircleView from "../../../components/common/CircleView";
import responsive from "../../../resources/responsive";

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
  onSetItem,
} from "../../../actions/water";
import { deleteHandle } from "../../../actions/waterDetail";


// create a component
class WaterList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockSelected: null,
      floorSelected: null,
      searchKey: new Date().getMonth() + 1,
      searchKey2: new Date().getFullYear(),
      isApplySearchKey: false,
      filter: [
        {
          statusId: 0,
          isFilter: false,
        },
        {
          statusId: 1,
          isFilter: false,
        },
        {
          statusId: 2,
          isFilter: false,
        },
      ],
      statusId: -1,
      showFilter: false,
      showAction: false,

      methodProcess: [
        {
          id: 1,
          name: "Ghi chỉ số",
        },
        {
          id: 2,
          name: "Xoá",
        },
        {
          id: -1,
          name: "Bỏ qua",
        },
      ],
      moduleId: 0,
      action: {
        id: 0,
        name: "",
      },
    };
  }
  componentDidMount() {
    this.props.resetStateByKey({ key: "initList", path: "", value: true });
  }

  componentWillReceiveProps(nextProps) {
    const {
      isMine,
      towerId,
      rowPerPage,
      isRefreshing,
      initList,
      createStatus,
      errorResponse,
      refreshDataHandle,
      blockSelected,
    } = this.props;
    if (nextProps.isRefreshing && nextProps.isRefreshing !== isRefreshing) {
      const data = {
        floorId:
          this.state.floorSelected === null ? 0 : this.state.floorSelected.id,
        year: this.state.searchKey2,
        month: this.state.searchKey,
        towerId,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
      };
      this.props.loadDataHandle(data);
    }

    if (nextProps.initList && nextProps.initList !== initList) {
      const data = {
        towerId,
        floorId:
          this.state.floorSelected === null ? 0 : this.state.floorSelected.id,
        year: this.state.searchKey2,
        month: this.state.searchKey,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
      };
      this.props.loadDataHandle(data);
    }

    if (nextProps.errorResponse && nextProps.errorResponse !== errorResponse) {
      if (!nextProps.errorResponse.hasError) {
        refreshDataHandle();
      }
    }

    if (
      nextProps.processError &&
      nextProps.processError !== this.props.processError
    ) {
      if (nextProps.processError.status === 200) {
        this.refs.toast.show(Strings.message.saveSuccess, DURATION.LENGTH_LONG);
      } else {
        if (nextProps.processError.hasError) {
          this.refs.toast.show(
            nextProps.processError.statusText,
            DURATION.LENGTH_LONG
          );
        }
      }
    }

    if (
      nextProps.towerId != towerId ||
      // nextProps.blockSelected !== blockSelected ||
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
      blockSelected,
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
        onRefresh={() => refreshDataHandle()}
        data={data || []}
        onPress={() => {
          this.setState({ showAction: true });
        }}
        canNavigate={this.props.canNavigate}
        onEndReachedThreshold={0.5}
        navigation={this.props.navigation}
      />
    );
  }

  onPress() {
    this.setState({ showAction: true });
  }

  render() {
    const {
      onSubmitEditing,
      onClearText,
      onChangeText,
      navigation,
      resetStateByKey,
      onFilter,
      onClearFilter,
      user,
      searchKey,
      searchKey2,
    } = this.props;
    const { blockSelected, floorSelected, showFilter, statusId } = this.state;

    return (
      <View style={styles.container}>
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
            <View style={{ justifyContent: "center" }}>
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
                {Strings.electric.navTitleWater}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: responsive.h(14),
                  fontWeight: "500",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "center",
                  color: "#df2027",
                  marginBottom: responsive.h(10),
                }}
              >
                {this.props.user.towerName} - {Strings.electric.period}: {searchKey}/{searchKey2}
              </Text>
            </View>
          }
          // rightView={<TouchableOpacity
          //     onPress={() => this.setState({ showFilter: true })}
          //     style={{ padding: responsive.h(10) }}
          // >
          //     <MyIcon
          //         name="search"
          //         size={25}
          //         color="#fff"

          //     />
          // </TouchableOpacity>}
        />
        <View style={{ }}>
          <View
            style={{
              backgroundColor: "#fff",
              justifyContent: "space-between",
              padding: responsive.h(15),
              marginHorizontal: responsive.h(20),
              marginTop: responsive.h(10),
              borderRadius: responsive.h(20),
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: "rgba(0, 0, 0, 0.08)"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                height: responsive.h(40),
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: responsive.h(16),
                  fontWeight: "600",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#282828",
                }}
              >
                {Strings.electric.time}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  height: responsive.h(40),
                  justifyContent: "space-between",
                  width: "60%",
                }}
              >
                <View style={{ flex: 0.5 }}>
                  <InputNumber
                    value={this.state.searchKey.toString()}
                    placeholder={Strings.electric.month}
                    style={{ width: "90%", height: "100%" }}
                    onChangeText={(searchKey) => {
                      this.setState({ searchKey }, () => {
                        if (searchKey.length === 0) {
                          if (this.state.isApplySearchKey) {
                            this.setState({
                              searchKey: "",
                              isApplySearchKey: false,
                            });
                          }
                        }
                      });
                    }}
                  />
                </View>

                <View style={{ flex: 0.5 }}>
                  <InputNumber
                    value={this.state.searchKey2.toString()}
                    placeholder={Strings.electric.year}
                    style={{ width: "100%", height: "100%" }}
                    onChangeText={(searchKey2) => {
                      this.setState({ searchKey2 }, () => {
                        if (searchKey2.length === 0) {
                          if (this.state.isApplySearchKey) {
                            this.setState({
                              searchKey2: "",
                              isApplySearchKey: false,
                            });
                          }
                        }
                      });
                    }}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("blockList", {
                  id: user.towerId,
                  onSelected: (blockSelected) =>
                    this.setState({
                      blockSelected,
                      floorSelected: null,
                      statusId: blockSelected.id,
                    }),
                })
              }
              style={{
                marginTop: responsive.h(10),
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: responsive.h(16),
                  fontWeight: "600",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#282828",
                }}
              >
                {Strings.electric.block}
              </Text>
              <View
                style={{
                  width: "60%",
                  padding: responsive.h(10),
                  marginTop: responsive.h(10),
                  borderRadius: responsive.h(8),
                  borderWidth: 1,
                  borderColor: "#cbcbcb",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-SemiBold",
                    fontWeight: "600",
                    color: this.state.blockSelected ? "#282828" : "#a0a0a0",
                    fontSize: responsive.h(14),
                  }}
                >
                  {this.state.blockSelected
                    ? this.state.blockSelected.name
                    : blockSelected
                    ? blockSelected.name
                    : `${Strings.common.choose} ${Strings.electric.block}`}
                </Text>
                <MyIcon name="arrow-down" size={responsive.h(14)} color={colors.gray1} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("floorList", {
                  id: user.towerId,
                  blockSelected,
                  onSelected: (floorSelected) =>
                    this.setState({
                      floorSelected,
                      statusId: floorSelected.id,
                    }),
                })
              }
              style={{
                marginTop: responsive.h(10),
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: responsive.h(16),
                  fontWeight: "600",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#282828",
                }}
              >
                {Strings.electric.floor}
              </Text>
              <View
                style={{
                  width: "60%",
                  padding: responsive.h(10),
                  marginTop: responsive.h(10),
                  borderRadius: responsive.h(8),
                  borderWidth: 1,
                  borderColor: "#cbcbcb",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-SemiBold",
                    fontWeight: "600",
                    color: this.state.floorSelected ? "#282828" : "#a0a0a0",
                    fontSize: responsive.h(14),
                  }}
                >
                  {this.state.floorSelected
                    ? this.state.floorSelected.name
                    : floorSelected
                    ? floorSelected.name
                    : `${Strings.common.choose} ${Strings.electric.floor}`}
                </Text>
                <MyIcon name="arrow-down" size={14} color={colors.gray1} />
              </View>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                marginTop: responsive.h(20),
                justifyContent: "center",
              }}
            >
              <PrimaryButton
                text={Strings.electric.unfiltered}
                onPress={() =>
                  this.setState(
                    {
                      searchKey: new Date().getMonth() + 1,
                      searchKey2: new Date().getFullYear(),
                      isApplySearchKey: false,
                      showFilter: false,
                      blockSelected: null,
                      floorSelected: null,
                      statusId: -1,
                    },
                    () => onClearFilter()
                  )
                }
              />
              <PrimaryButton
                visible={
                  this.props.floorSelected !== null || floorSelected !== null
                }
                onPress={() =>
                  this.setState(
                    {
                      showFilter: false,
                      isApplySearchKey: this.state.searchKey.length !== 0,
                    },
                    () =>
                      onFilter({
                        blockSelected,
                        floorSelected,
                        searchKey: this.state.searchKey,
                        searchKey2: this.state.searchKey2,
                      })
                  )
                }
                text={Strings.electric.filter}
                style={{ marginLeft: 10, fontWeight: "bold" }}
              />
            </View>
          </View>
        </View>

        {this._renderContent()}

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

  renderActionMenu() {
    const { methodProcess } = this.state;
    return (
      <FlatList
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: colors.grayBorder }} />
        )}
        data={methodProcess}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderItemMenu}
        onEndReachedThreshold={0.5}
        style={{ marginTop: 50 }}
      />
    );
  }

  renderItemMenu = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          switch (item.id) {
            case -1: //Bỏ qua
              this.setState({ showAction: false });
              break;

            case 1: //Cập nhật, thêm
              this.setState({ showAction: false }, () => {
                this.props.navigation.navigate("waterDetail", {
                  data: this.props.itemSelected,
                });
              });
              break;

            case 2: //Xoá
              this.setState({ showAction: false }, () => {
                let deleteRequest = {
                  id: this.props.itemSelected.id,
                  indexId: this.props.itemSelected.indexId,
                  month: this.props.searchKey,
                  year: this.props.searchKey2,
                };

                Alert.alert("Thông báo", "Bạn có chắc chắn muốn xoá không?", [
                  {
                    text: "Bỏ qua",
                    onPress: () => console.warn("NO Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Xoá",
                    onPress: () => this.props.deleteHandle(deleteRequest),
                  },
                ]);
              });
              break;

            default:
              break;
          }
        }}
        style={{ alignItems: "center" }}
      >
        <Text
          style={{
            margin: 10,
            color: item.id === -1 ? "red" : colors.blue,
            fontSize: fontSize.larg,
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  _onSelectedChange = (value) => {
    if (value == this.state.statusId) {
      this.setState({ statusId: 0 }, () => this.props.refreshDataHandle());
    } else {
      this.setState({ statusId: value }, () => this.props.refreshDataHandle());
    }
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: responsive.h(10),
  },
});
const mapStateToProps = (state) => ({
  initList: state.water.initList,
  currentPage: state.water.currentPage,
  rowPerPage: state.water.rowPerPage,
  emptyData: state.water.emptyData,
  outOfStock: state.water.outOfStock,
  isLoading: state.water.isLoading,
  data: state.water.data,
  error: state.water.error,
  isRefreshing: state.water.isRefreshing,
  isApplySearchKey: state.water.isApplySearchKey,
  searchKey: state.water.searchKey,
  searchKey2: state.water.searchKey2,
  createStatus: state.water.createStatus,
  canNavigate: true, //state.requestDetail.data == null,
  language: state.app.language,
  isMine: state.water.isMine,
  user: state.auth.user,
  statusId: state.water.statusId,
  //errorResponse: state.waterDetail.errorResponse,
  towerId: state.auth.user.towerId,
  blockSelected: state.water.blockSelected,
  floorSelected: state.water.floorSelected,
  itemSelected: state.water.itemSelected,
  processError: state.waterDetail.processError,
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
  onSetItem,

  deleteHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(WaterList);
