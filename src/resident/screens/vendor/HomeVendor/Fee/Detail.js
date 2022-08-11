//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import { MyIcon } from "../../../../theme/icons";
import ListItem from "../../../../components/fee/Detail/ListItem";
import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
} from "../../../../actions/feeDetail";
import ErrorContent from "../../../../components/common/ErrorContent";
import colors from "../../../../theme/colors";
import Strings from "../../../../utils/languages";
import responsive from "../../../../../resources/responsive";

// create a component
class FeeDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: `${Strings.fee.contractNo} ${params.name}`,
      headerBackTitle: null,
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: colors.appTheme,
        elevation: 0,
        borderBottomColor: "transparent",
        borderBottomWidth: 0,
      },
      headerRight: (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={params.onResponse}
            style={{
              flexDirection: "row",
              paddingVertical: responsive.h(20),
              paddingHorizontal: responsive.h(10),
              alignItems: "center",
            }}
          >
            <MyIcon name="filter" size={responsive.h(20)} color="black" />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    const id = this.props.navigation.state.params.id;
    if (nextProps.initList && this.props.initList !== nextProps.initList) {
      this.props.loadDataHandle({
        id,
      });
    }
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing
    ) {
      this.props.loadDataHandle({
        id,
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
    return <ListItem item={item} />;
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
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: colors.grayBorder }} />
        )}
        refreshing={isRefreshing}
        onRefresh={() => this.props.refreshDataHandle()}
        data={data || []}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderItem}
        ListFooterComponent={this.renderFooter}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <BarChart xAxisData={this.getxAxisData(this.props.FeesFiltered)} yAxisData={this.getyAxisData(this.props.FeesFiltered)} /> */}
        {this.renderContent()}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",

    backgroundColor: "#fff",
  },
});
const mapStateToProps = (state) => ({
  initList: state.feeDetail.initList,
  currentPage: state.feeDetail.currentPage,
  rowPerPage: state.feeDetail.rowPerPage,
  emptyData: state.feeDetail.emptyData,
  outOfStock: state.feeDetail.outOfStock,
  isLoading: state.feeDetail.isLoading,
  data: state.feeDetail.data,
  error: state.feeDetail.error,
  isRefreshing: state.feeDetail.isRefreshing,
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
)(FeeDetail);
