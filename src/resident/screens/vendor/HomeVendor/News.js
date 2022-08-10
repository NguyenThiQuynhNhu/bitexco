//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import ImageProgress from "../../../components/common/ImageProgress";
import FontSize from "../../../theme/fontsize";
import moment from "moment";
import "moment/locale/vi";
import { default_image } from "../../../theme/images";
import SearchBar from "../../../components/common/SearchBar";
import Device from "../../../utils/device";
import Colors from "../../../theme/colors";
import { MyIcon } from "../../../theme/icons";
import Strings from "../../../utils/languages";
import {
  onSubmitEditing,
  onChangeText,
  onClearText,
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
} from "../../../actions/vendorNews";
import ErrorContent from "../../../components/common/ErrorContent";
import ListItem from "../../../components/news/ListItem";
import responsive from "../../../../resources/responsive";
// create a component

class NewsScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      searchKey: "",
      isApplySearchKey: false,
    };
    moment.locale(props.language);
  }
  componentDidMount() {
    this.props.resetStateByKey({ key: "initList", value: true });
  }
  componentWillReceiveProps(nextProps) {
    const {
      isApplySearchKey,
      searchKey,
      rowPerPage,
      initList,
      isRefreshing,
    } = this.props;
    if (nextProps.initList !== this.props.initList && nextProps.initList) {
      const data = {
        towerId: this.props.navigation.state.params.filter.id,
        keyword: nextProps.isApplySearchKey ? nextProps.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage,
        typeNews: 1,
      };
      this.props.loadDataHandle(data);
    }
    if (
      nextProps.isRefreshing !== isRefreshing &&
      !nextProps.isLoading &&
      nextProps.isRefreshing
    ) {
      const data = {
        towerId: this.props.navigation.state.params.filter.id,
        keyword: nextProps.isApplySearchKey ? nextProps.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage,
        typeNews: 1,
      };
      this.props.loadDataHandle(data);
    }
  }
  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }
  renderItem = ({ item }) => {
    return (
      <ListItem
        item={item}
        onPress={() =>
          this.props.navigation.navigate("newsDetail", { item, type: 1 })
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
  _renderContent() {
    const {
      emptyData,
      error,
      initList,
      data,
      isRefreshing,
      outOfStock,
      refreshDataHandle,
      isLoading,
    } = this.props;
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
        refreshing={isRefreshing}
        onRefresh={() => refreshDataHandle()}
        data={data}
        keyExtractor={(item, index) => index}
        renderItem={this.renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          const {
            isApplySearchKey,
            searchKey,
            currentPage,
            outOfStock,
            rowPerPage,
          } = this.props;
          if (
            !this.onEndReachedCalledDuringMomentum &&
            !outOfStock &&
            currentPage > 0
          ) {
            const data = {
              towerId: this.props.navigation.state.params.filter.id,
              keyword: isApplySearchKey ? searchKey : "",
              currentPage: currentPage + 1,
              rowPerPage,
              typeNews: 1,
            };
            this.props.loadDataHandle(data);
          }
        }}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        ListFooterComponent={this.renderFooter}
      />
    );
  }
  render() {
    const {
      searchKey,
      initList,
      data,
      isRefreshing,
      outOfStock,
      refreshDataHandle,
      isLoading,
      onChangeText,
      onSubmitEditing,
      onClearText,
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
              paddingHorizontal: responsive.w(10),
              paddingRight: 0,
              alignItems: "center",
            }}
          >
            <MyIcon name="arrow" size={responsive.h(20)} color="black" />
          </TouchableOpacity>
          <SearchBar
            value={searchKey}
            onChangeText={(searchKey) => onChangeText({ searchKey })}
            onSubmitEditing={onSubmitEditing}
            onClearText={onClearText}
            style={{
              flex: 1,
              margin: Platform.OS == "ios" ? responsive.h(5) : responsive.h(10),
              marginHorizontal: 10,
            }}
          />
        </View>
        {this._renderContent()}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
  },
});

const mapStateToProps = (state) => ({
  isLoading: state.vendorNews.isLoading,
  data: state.vendorNews.data,
  initList: state.vendorNews.initList,
  isRefreshing: state.vendorNews.isRefreshing,
  currentPage: state.vendorNews.currentPage,
  rowPerPage: state.vendorNews.rowPerPage,
  emptyData: state.vendorNews.emptyData,
  outOfStock: state.vendorNews.outOfStock,
  error: state.vendorNews.error,
  isApplySearchKey: state.vendorNews.isApplySearchKey,
  searchKey: state.vendorNews.searchKey,
  language: state.app.language,
});
const mapActionToProps = {
  onSubmitEditing,
  onChangeText,
  onClearText,
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(NewsScreen);
