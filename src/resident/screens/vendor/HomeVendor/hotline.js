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
  Linking,
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/vi";

import Strings from "../../../utils/languages";
import {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
} from "../../../actions/hotline";
import ErrorContent from "../../../components/common/ErrorContent";
import NavBar from "../../../components/common/NavBar";
import fontsize from "../../../theme/fontsize";
import IconButton from "../../../components/common/IconButton";
import ImageProgress from "../../../components/common/ImageProgress";
import { MyIcon } from "../../../theme/icons";
import colors from "../../../theme/colors";
import responsive from "../../../../resources/responsive";

// create a component

class HotlineListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.navigation.state.params,
      searchKey: "",
      isApplySearchKey: false,
    };
    moment.locale("vi");
  }

  componentDidMount() {
    this.props.resetStateByKey({ key: "state" });
    this.props.resetStateByKey({ key: "initList", value: true });
  }

  componentWillReceiveProps(nextProps) {
    const { type } = this.state;
    if (nextProps.initList && nextProps.initList !== this.props.initList) {
      const data = {
        towerId: this.props.user.towerId,
      };
      this.props.loadDataHandle(data);
    }
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing &&
      !nextProps.isLoading
    ) {
      const data = {
        towerId: this.props.user.towerId,
      };
      this.props.loadDataHandle(data);
    }
  }

  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }

  renderItem = ({ item }) => {
    const { id, displayName, phone } = item;
    const { towerLogoUrl } = this.props.user;
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          padding: responsive.h(15),
          // borderWidth: 0.5,
          // borderColor: "rgb(206, 209, 212)",
          // backgroundColor: "#fff",
          margin: responsive.h(20),
          // borderRadius: 10,
          // shadowColor: "rgba(0, 0, 0, 0.1)",
          // elevation: 2,
          // shadowOffset: {
          //   width: 0,
          //   height: 4,
          // },
          // shadowRadius: 10,
          // shadowOpacity: 1,
          borderRadius: responsive.h(12),
          borderWidth: 0.5,
          borderColor: "#eaeaea",

          borderBottomWidth: 2,
        }}
        onPress={() => {
          Linking.canOpenURL(`tel:${phone}`)
            .then((supported) => {
              if (!supported) {
                //this.refs.toast.show('Số điện thoại không đúng!Vui lòng kiểm tra lại', DURATION.LENGTH_LONG);
              } else {
                return Linking.openURL(`tel:${phone}`);
              }
            })
            .catch((error) => {
              //this.refs.toast.show('Xảy ra lỗi! Vui lòng thử lại.', DURATION.LENGTH_LONG);
            });
        }}
      >
        <ImageProgress
          circle={true}
          style={{
            height: responsive.h(60),
            width: responsive.h(60),
          }}
          source={{ uri: towerLogoUrl }}
        />

        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              marginLeft: responsive.h(10),
            }}
          >
            <Text numberOfLines={4} lineBreakMode="tail">
              <Text
                style={{
                  fontSize: responsive.h(fontsize.medium),
                  fontWeight: "bold",
                  color: colors.appTheme,
                }}
              >
                {displayName}
              </Text>
            </Text>
            <Text
              style={{
                color: colors.gray1,
                fontSize: responsive.h(fontsize.medium),
                marginTop: responsive.h(5),
              }}
            >
              {phone}
            </Text>
          </View>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: responsive.h(25),
              padding: responsive.h(10),
              backgroundColor: colors.appTheme,
              width: responsive.h(45),
              height: responsive.h(45),
              opacity: 0.6,
            }}
          >
            <MyIcon name="call1" size={responsive.h(20)} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
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
    const { searchKey } = this.state;
    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <MyIcon name="arrow" color="black" size={responsive.h(20)} />
            </TouchableOpacity>
          }
          body={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
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
                  textAlign: "center",
                  color: "black",
                }}
              >
                {Strings.department.titleHoline}
              </Text>
            </View>
          }
        />

        {this.renderContent()}
      </View>
    );
  }
  renderContent() {
    const {
      emptyData,
      error,
      initList,
      data,
      isRefreshing,
      outOfStock,
      refreshDataHandle,
      isLoading,
      type,
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
        data={data || []}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderItem}
        onEndReachedThreshold={0.5}
        style={{ marginTop: responsive.h(-15) }}
        onEndReached={() => {
          if (
            !this.onEndReachedCalledDuringMomentum &&
            !this.props.outOfStock &&
            this.props.currentPage > 0
          ) {
            const data = {
              towerId: user.towerId,
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
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

const mapStateToProps = (state) => ({
  data: state.hotline.data,
  isLoading: state.hotline.isLoading,
  initList: state.hotline.initList,
  isRefreshing: state.hotline.isRefreshing,
  currentPage: state.hotline.currentPage,
  rowPerPage: state.hotline.rowPerPage,
  emptyData: state.hotline.emptyData,
  outOfStock: state.hotline.outOfStock,
  error: state.hotline.error,
  isApplySearchKey: state.hotline.isApplySearchKey,
  searchKey: state.hotline.searchKey,
  user: state.auth.user,
});
const mapActionToProps = {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(HotlineListScreen);
