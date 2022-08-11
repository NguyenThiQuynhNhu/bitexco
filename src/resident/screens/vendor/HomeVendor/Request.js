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
import _ from "lodash";
import Toast, { DURATION } from "react-native-easy-toast";
import ListItem from "../../../components/Request/List/ListItem";
import ListData from "../../../components/Request/List/ListData";
import ButtonFilter from "../../../components/Request/List/ButtonFilter";
//components
import ImageProgress from "../../../components/common/ImageProgress";
import ListAutoHideHeader from "../../../components/common/ListAutoHideHeader";
import { MyIcon } from "../../../theme/icons";
import IconText from "../../../components/common/IconText";
import SearchBar from "../../../components/common/SearchBar";
import ErrorContent from "../../../components/common/ErrorContent";
import Device from "../../../utils/device";

//style
import colors from "../../../theme/colors";
import fontSize from "../../../theme/fontsize";
import Strings from "../../../utils/languages";
//data
import firebase from "firebase";
import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  onSubmitEditing,
  onChangeText,
  onClearText,
} from "../../../actions/vendorRequest";
import {
  converStatusToColor,
  converStatusToString,
} from "../../../utils/request";
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
      status: 0,
    };
  }
  componentDidMount() {
    this.props.resetStateByKey({ key: "initList", path: "", value: true });
  }
  componentWillReceiveProps(nextProps) {
    const towerId = this.props.navigation.state.params.filter.id;
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing
    ) {
      const data = {
        towerId,
        statusId: this.state.status,
        keyword: nextProps.isApplySearchKey ? nextProps.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
      };
      this.props.loadDataHandle(data);
    }
    if (nextProps.initList && nextProps.initList !== this.props.initList) {
      const data = {
        towerId,
        statusId: 0,
        keyword: nextProps.isApplySearchKey ? nextProps.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
      };
      this.props.loadDataHandle(data);
    }
    if (
      nextProps.createStatus &&
      this.props.createStatus !== nextProps.createStatus
    ) {
      this.refs.toast.show(
        Strings.createRequest.creatSucessAlert,
        DURATION.LENGTH_LONG
      );
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
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
          <Text>{Strings.app.loading}</Text>
        </View>
      );
    }
    if (emptyData) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => refreshDataHandle()}
        />
      );
    }
    if (error && error.hasError) {
      return <ErrorContent title={Strings.app.error} />;
    }
    return (
      <ListData
        refreshing={isRefreshing}
        onRefresh={() => refreshDataHandle()}
        data={data}
        renderItem={this.renderItem}
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
            const towerId = this.props.navigation.state.params.filter.id;
            const data = {
              towerId,
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
  renderItem = ({ item }) => {
    return (
      <ListItem
        item={item}
        onPress={() =>
          this.props.canNavigate
            ? this.props.navigation.navigate("requestDetail", item)
            : null
        }
      />
    );
  };
  render() {
    const {
      searchKey,
      onSubmitEditing,
      onClearText,
      onChangeText,
      screenProps,
    } = this.props;
    return (
      <View style={styles.container}>
        <View
          style={{
            ...Device.defaultNavBarStyle(),
            backgroundColor: colors.appTheme,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{
              flexDirection: "row",
              paddingVertical: responsive.h(20),
              paddingHorizontal: responsive.h(10),
              paddingRight: 0,
              alignItems: "center",
            }}
          >
            <MyIcon name="arrow" size={responsive.h(20)} color="#fff" />
          </TouchableOpacity>
          <SearchBar
            value={searchKey}
            onChangeText={(searchKey) => onChangeText({ searchKey })}
            onSubmitEditing={onSubmitEditing}
            onClearText={onClearText}
            style={{
              flex: 1,
              margin: Platform.OS == "ios" ? responsive.h(5) : responsive.h(10),
              marginHorizontal: responsive.h(10),
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
              value={5}
              currentValue={this.state.status}
              onSelectedChange={this._onSelectedChange}
            />
          </ScrollView>
        </View>
        {this._renderContent()}
        <TouchableOpacity
          onPress={() =>
            this.props.screenProps
              ? this.props.screenProps.navigation.navigate("requestCreate")
              : this.props.navigation.navigate("requestCreate")
          }
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
        <Toast ref="toast" />
      </View>
    );
  }
  _onSelectedChange = (value) => {
    if (value == this.state.status) {
      this.setState({ status: 0 }, () => this.props.refreshDataHandle());
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
  initList: state.vendorRequest.initList,
  currentPage: state.vendorRequest.currentPage,
  rowPerPage: state.vendorRequest.rowPerPage,
  emptyData: state.vendorRequest.emptyData,
  outOfStock: state.vendorRequest.outOfStock,
  isLoading: state.vendorRequest.isLoading,
  data: state.vendorRequest.data,
  error: state.vendorRequest.error,
  isRefreshing: state.vendorRequest.isRefreshing,
  isApplySearchKey: state.vendorRequest.isApplySearchKey,
  searchKey: state.vendorRequest.searchKey,
  createStatus: state.vendorRequest.createStatus,
  canNavigate: state.requestDetail.data == null,
});

const mapActionToState = {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  onSubmitEditing,
  onChangeText,
  onClearText,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(ReuqestList);
