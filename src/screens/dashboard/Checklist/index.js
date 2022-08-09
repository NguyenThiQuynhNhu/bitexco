//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import Toast from "react-native-easy-toast";

import { MyIcon } from "../../../theme/icons";
import ErrorContent from "../../../components/common/ErrorContent";
import ListData from "../../../components/Checklist/List/ListData";

import ImageProgress from "../../../components/common/ImageProgress";

//style
import colors from "../../../theme/colors";
import fontSize from "../../../theme/fontsize";
import NavBar from "../../../components/common/NavBar";

import moment from "moment";

import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
} from "../../../actions/dashboardChecklist";
import Strings from "../../../utils/languages";

// create a component
class DashboardChecklist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: props.navigation.state.params.startDate,
      endDate: props.navigation.state.params.endDate,
      towerId: props.navigation.state.params.towerId,
      systemId: props.navigation.state.params.systemId,
    };
  }
  componentDidMount() {
    this.props.resetStateByKey({ key: "initList", path: "", value: true });
  }

  componentWillReceiveProps(nextProps) {
    const {
      rowPerPage,
      isRefreshing,
      initList,
      errorResponse,
      refreshDataHandle,
    } = this.props;
    if (nextProps.isRefreshing && nextProps.isRefreshing !== isRefreshing) {
      const data = {
        towerId: this.state.towerId,
        systemId: this.state.systemId,
        currentPage: nextProps.currentPage + 1,
        rowPerPage,
        dateFrom: moment(this.state.startDate).format("DD/MM/YYYY"),
        dateTo: moment(this.state.endDate).format("DD/MM/YYYY"),
      };
      this.props.loadDataHandle(data);
    }

    if (nextProps.initList && nextProps.initList !== initList) {
      const data = {
        towerId: this.state.towerId,
        systemId: this.state.systemId,
        currentPage: nextProps.currentPage + 1,
        rowPerPage,
        dateFrom: moment(this.state.startDate).format("DD/MM/YYYY"),
        dateTo: moment(this.state.endDate).format("DD/MM/YYYY"),
      };
      this.props.loadDataHandle(data);
    }

    if (nextProps.errorResponse && nextProps.errorResponse !== errorResponse) {
      if (!nextProps.errorResponse.hasError) {
        refreshDataHandle();
      }
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
      refreshDataHandle,
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
            const data = {
              towerId: this.state.towerId,
              systemId: this.state.systemId,
              currentPage: this.props.currentPage + 1,
              rowPerPage: this.props.rowPerPage,
              dateFrom: moment(this.state.startDate).format("DD/MM/YYYY"),
              dateTo: moment(this.state.endDate).format("DD/MM/YYYY"),
            };
            this.props.loadDataHandle(data);
          }
        }}
        navigation={this.props.navigation}
      />
    );
  }

  render() {
    //console.log( this.props.navigation.state.params.towerImageUrl)
    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity
              style={{ paddingVertical: 10 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <MyIcon name="arrow" size={22} color="black" />
            </TouchableOpacity>
          }
          body={
            <View style={{ justifyContent: "center" }}>
              <Text
                style={{
                  color: "black",
                  alignSelf: "center",
                  fontSize: fontSize.medium,
                  fontWeight: "bold",
                }}
              >
                {this.props.navigation.state.params.towerName.toLocaleUpperCase()}{" "}
                > CHECKLIST
              </Text>
            </View>
          }
          rightView={
            <View style={{ paddingRight: 5, paddingTop: 5 }}>
              <ImageProgress
                style={{
                  height: 30,
                  width: 30,
                }}
                circle={true}
                resizeMode="stretch"
                source={{
                  uri: this.props.navigation.state.params.towerImageUrl,
                }}
              />
            </View>
          }
        />

        <View
          style={{
            flexDirection: "row",
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.grayBorder,
          }}
        >
          <Text style={{ fontSize: fontSize.medium, color: "#111" }}>
            Kỳ báo cáo:{" "}
            {moment(this.props.navigation.state.params.startDate).format(
              "DD-MM-YYYY"
            )}{" "}
            ->{" "}
          </Text>

          <Text style={{ fontSize: fontSize.medium, color: "#111" }}>
            {moment(this.props.navigation.state.params.endDate).format(
              "DD-MM-YYYY"
            )}
          </Text>
        </View>

        {this._renderContent()}

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
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({
  initList: state.dashboardChecklist.initList,
  currentPage: state.dashboardChecklist.currentPage,
  rowPerPage: state.dashboardChecklist.rowPerPage,
  emptyData: state.dashboardChecklist.emptyData,
  outOfStock: state.dashboardChecklist.outOfStock,
  isLoading: state.dashboardChecklist.isLoading,
  data: state.dashboardChecklist.data,
  error: state.dashboardChecklist.error,
  isRefreshing: state.dashboardChecklist.isRefreshing,
  isApplySearchKey: state.dashboardChecklist.isApplySearchKey,
  searchKey: state.dashboardChecklist.searchKey,
  createStatus: state.dashboardChecklist.createStatus,
  canNavigate: true, //state.requestDetail.data == null,
  language: state.app.language,
  user: state.auth.user,
  statusId: state.dashboardChecklist.statusId,
  errorResponse: state.requestDetail.errorResponse,
  towerId: state.auth.user.towerId,
  statusSelected: state.dashboardChecklist.statusSelected,
  dataVendor: state.vendor.data,
});

const mapActionToState = {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(DashboardChecklist);
