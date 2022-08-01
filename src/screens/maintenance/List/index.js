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
import ListData from "../../../components/Checklist/List/ListData";
import ButtonFilter from "../../../components/Checklist/List/ButtonFilter";
//style
import colors from "../../../theme/colors";
import fontSize from "../../../theme/fontsize";

import moment from "moment";

import NavBar from "../../../resident/components/common/NavBar"; //data
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
} from "../../../actions/maintenance";
import Strings from "../../../utils/languages";
import PrimaryButton from "../../../components/common/PrimaryButton";

// create a component
class MaintenanceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusSelected: null,
      searchKey: "",
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
        {
          statusId: 3,
          isFilter: false,
        },
        {
          statusId: 4,
          isFilter: false,
        },
      ],
      status: -1,
      showFilter: false,
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
      statusSelected,
    } = this.props;
    if (nextProps.isRefreshing && nextProps.isRefreshing !== isRefreshing) {
      const data = {
        statusId: this.state.status,
        towerId,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage,
        departmentId: nextProps.statusSelected
          ? nextProps.statusSelected.id
          : 0,
        date: moment(new Date()).format("DD/MM/YYYY"),
      };
      this.props.loadDataHandle(data);
    }

    if (nextProps.initList && nextProps.initList !== initList) {
      const data = {
        statusId: -1,
        towerId,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage,
        departmentId: statusSelected ? statusSelected.id : 0,
        date: moment(new Date()).format("DD/MM/YYYY"),
      };
      this.props.loadDataHandle(data);
    }

    if (nextProps.createStatus && createStatus !== nextProps.createStatus) {
      this.refs.toast.show("Tạo yêu cầu thành công", DURATION.LENGTH_LONG);
    }

    if (nextProps.errorResponse && nextProps.errorResponse !== errorResponse) {
      if (!nextProps.errorResponse.hasError) {
        refreshDataHandle();
      }
    }

    if (
      nextProps.towerId != towerId ||
      // nextProps.statusSelected !== statusSelected ||
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
      statusSelected,
    } = this.props;
    if (initList) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator />
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
              statusId: this.props.statusId,
              towerId,
              keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
              currentPage: this.props.currentPage + 1,
              rowPerPage: this.props.rowPerPage,
              departmentId: statusSelected ? statusSelected.id : 0,
              date: moment(new Date()).format("DD/MM/YYYY"),
            };
            this.props.loadDataHandle(data);
          }
        }}
        navigation={this.props.navigation}
      />
    );
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
    const { statusSelected, showFilter } = this.state;

    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <MyIcon name="arrow" size={20} color="#fff" />
            </TouchableOpacity>
          }
          body={
            <View style={{ justifyContent: "center" }}>
              <Text
                style={{
                  color: "#fff",
                  alignSelf: "center",
                  fontSize: fontSize.medium,
                  fontWeight: "bold",
                }}
              >
                DANH SÁCH KIỂM TRA ĐỊNH KỲ
              </Text>
              <Text
                style={{
                  color: "#fff",
                  alignSelf: "center",
                  fontSize: fontSize.small,
                  fontWeight: "bold",
                }}
              >
                {navigation.state.params
                  ? navigation.state.params.title
                  : "Tất cả"}
              </Text>
            </View>
          }
          rightView={
            <TouchableOpacity
              onPress={() => this.setState({ showFilter: true })}
              style={{ padding: 10 }}
            >
              <MyIcon name="search" size={30} color="#fff" />
            </TouchableOpacity>
          }
        />

        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              backgroundColor: "#fff",
            }}
          >
            <ButtonFilter
              value={0}
              currentValue={this.state.status}
              onSelectedChange={this._onSelectedChange}
              style={{ paddingHorizontal: 5 }}
            />
            <ButtonFilter
              value={1}
              currentValue={this.state.status}
              onSelectedChange={this._onSelectedChange}
            />
            <ButtonFilter
              value={2}
              currentValue={this.state.status}
              onSelectedChange={this._onSelectedChange}
            />
            <ButtonFilter
              value={3}
              currentValue={this.state.status}
              onSelectedChange={this._onSelectedChange}
            />
            <ButtonFilter
              value={4}
              currentValue={this.state.status}
              onSelectedChange={this._onSelectedChange}
            />
          </ScrollView>
        </View>

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
            <View
              style={{
                width: "90%",
                margin: 20,
                alignSelf: "center",
                padding: 10,
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
                  this.props.navigation.navigate("checklistStatus", {
                    id: user.towerId,
                    onSelected: (statusSelected) =>
                      this.setState({
                        statusSelected,
                        status: statusSelected.id,
                      }),
                  })
                }
                style={{
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 5,
                  backgroundColor: colors.gray2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>
                  {this.props.statusSelected
                    ? this.props.statusSelected.name
                    : statusSelected
                    ? statusSelected.name
                    : "Chọn trạng thái"}
                </Text>
                <MyIcon name="arrow-down" size={20} color={colors.gray1} />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "center",
                }}
              >
                <PrimaryButton
                  text="Bỏ lọc"
                  onPress={() =>
                    this.setState(
                      {
                        searchKey: "",
                        isApplySearchKey: false,
                        showFilter: false,
                        statusSelected: null,
                        status: -1,
                      },
                      () => onClearFilter()
                    )
                  }
                />
                <PrimaryButton
                  visible={
                    this.state.searchKey !== "" ||
                    this.props.statusSelected !== null ||
                    statusSelected !== null
                  }
                  onPress={() =>
                    this.setState(
                      {
                        showFilter: false,
                        isApplySearchKey: this.state.searchKey.length !== 0,
                      },
                      () => onFilter({ statusSelected })
                    )
                  }
                  text="Lọc dữ liệu"
                  style={{ marginLeft: 10 }}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => this.setState({ showFilter: false })}
              style={{
                borderRadius: 45,
                backgroundColor: colors.appTheme,
                padding: 10,
                position: "absolute",
                top: 5,
                right: 5,
              }}
            >
              <MyIcon name="no" color="#fff" size={10} />
            </TouchableOpacity>
          </View>
        )}
        <Toast
          ref="toast"
          style={{
            backgroundColor: colors.toast.success,
            opacity: 1,
            borderRadius: 5,
            padding: 10,
          }}
        />
      </View>
    );
  }

  _onSelectedChange = (value) => {
    if (value == this.state.status) {
      this.setState({ status: -1 }, () => this.props.refreshDataHandle());
    } else {
      this.setState({ status: value }, () => this.props.refreshDataHandle());
    }
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({
  initList: state.maintenance.initList,
  currentPage: state.maintenance.currentPage,
  rowPerPage: state.maintenance.rowPerPage,
  emptyData: state.maintenance.emptyData,
  outOfStock: state.maintenance.outOfStock,
  isLoading: state.maintenance.isLoading,
  data: state.maintenance.data,
  error: state.maintenance.error,
  isRefreshing: state.maintenance.isRefreshing,
  isApplySearchKey: state.maintenance.isApplySearchKey,
  searchKey: state.maintenance.searchKey,
  createStatus: state.maintenance.createStatus,
  canNavigate: true, //state.requestDetail.data == null,
  language: state.app.language,
  isMine: state.maintenance.isMine,
  user: state.auth.user,
  statusId: state.maintenance.statusId,
  errorResponse: state.checklistDetail.errorResponse,
  towerId: state.auth.user.towerId,
  statusSelected: state.maintenance.statusSelected,
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
)(MaintenanceList);
