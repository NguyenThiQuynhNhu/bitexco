//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";
import BannerInfo from "../../../../components/vendor/BannerInfo";
import colors from "../../../../theme/colors";
import ErrorContent from "../../../../components/common/ErrorContent";
import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
} from "../../../../actions/fee";
import ListItem from "../../../../components/fee/ListItem";
import RowItem from "../../../../components/common/RowItem";
import fontsize from "../../../../theme/fontsize";
import Strings from "../../../../utils/languages";
import responsive from "../../../../../resources/responsive";

// create a component
class Fee extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: Strings.detailVendor.fee,
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: colors.appTheme,
      elevation: 0,
      borderBottomColor: "transparent",
      borderBottomWidth: 0,
    },
  });
  constructor(props) {
    super(props);
    this.state = {
      vendorInfo: props.navigation.state.params.filter,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.initList && this.props.initList !== nextProps.initList) {
      this.props.loadDataHandle({
        towerId: this.state.vendorInfo.id,
      });
    }
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing
    ) {
      this.props.loadDataHandle({
        towerId: this.state.vendorInfo.id,
      });
    }
  }
  componentDidMount() {
    this.props.resetStateByKey({ key: "initList", path: "", value: true });
  }
  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }
  renderItem = ({ item, index }) => {
    return (
      <ListItem
        language={this.props.language}
        item={item}
        onPress={() =>
          this.props.canNavigate
            ? this.props.navigation.navigate("feeDetail", item)
            : null
        }
      />
    );
  };
  renderContent() {
    const { data, isRefreshing, error, emptyData } = this.props;
    // const { emptyData, error, initList, data, isRefreshing, outOfStock, refreshDataHandle, loadDataHandle, isLoading } = this.props;
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
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={() => this.props.refreshDataHandle()}
        data={data}
        keyExtractor={(item, index) => index}
        renderItem={this.renderItem}
        ListFooterComponent={this.renderFooter}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <BannerInfo data={this.state.vendorInfo} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: responsive.h(10),
            borderTopWidth: 1,
            backgroundColor: "#fff",
            borderTopColor: colors.grayBorder,
          }}
        >
          <Text style={{ fontSize: responsive.h(14) }}>
            {Strings.fee.total}
          </Text>
          <Text
            style={{
              color: colors.appTheme,
              fontSize: responsive.h(fontsize.medium),
            }}
          >
            {`${this.props.total}`
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: responsive.w(10),
            flex: 1,
          }}
        >
          <RowItem
            title={Strings.fee.detail.toLocaleUpperCase()}
            styleTitle={{ fontSize: fontsize.medium }}
            value={`${Strings.fee.unit}: VNĐ`}
          />
          {this.renderContent()}
        </View>
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
  initList: state.fee.initList,
  currentPage: state.fee.currentPage,
  rowPerPage: state.fee.rowPerPage,
  emptyData: state.fee.emptyData,
  outOfStock: state.fee.outOfStock,
  isLoading: state.fee.isLoading,
  data: state.fee.data,
  error: state.fee.error,
  isRefreshing: state.fee.isRefreshing,
  total: state.fee.total,
  canNavigate: state.feeDetail.data.length == 0,
  language: state.app.language,
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
)(Fee);
