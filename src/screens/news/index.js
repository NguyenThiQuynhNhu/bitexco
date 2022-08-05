//import liraries
import React, { Component } from "react";
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Modal,
  Image,
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import FCM, {
  FCMEvent,
  NotificationType,
  WillPresentNotificationResult,
  RemoteNotificationResult,
} from "react-native-fcm";
import ImageProgress from "../../components/common/ImageProgress";
import NavBar from "../../resident/components/common/NavBar";
import { MyIcon } from "../../theme/icons";
import fontsize from "../../theme/fontsize";
import _ from "lodash";
import ErrorContent from "../../components/common/ErrorContent";
import { Screen } from "../../utils/device";
import colors from "../../theme/colors";
import { AddItemToList } from "../../resident/actions/notification";
import {
  getProfile,
  postFCMToken,
  delFCMTokenEmployee,
} from "../../resident/actions/auth";
import { loadDataHandle } from "../../resident/actions/vendorHome";
import {
  loadDataHandle as loadDataHandleNotify,
  resetStateByKey,
  refreshDataHandle,
  onSubmitEditing,
  onChangeText,
  onClearText,
} from "../../resident/actions/news";
// import { loadBadge } from '../../resident/actions/badge';
import Strings from "../../utils/languages";
import ActionSheet from "../../components/common/ActionSheet";
import Icon from "react-native-vector-icons/FontAwesome";
import { default_user, default_baner } from "../../theme/images";
import Swiper from "react-native-swiper";
import { color } from "react-native-reanimated";
import { titleStyle } from "../../theme/styles";
//
import { checkAnswerSurvey } from "../../resident/actions/surveyDetail";
// import {
//     loadDataHandle as loadStatusRequest
// } from '../actions/home';

export const IconText = ({ style, icon, text }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", ...style }}>
      <MyIcon name={icon} size={20} color="#0890fe" />
      <Text
        style={{
          fontFamily: "OpenSans-Regular",
          fontSize: 11,
          fontWeight: "normal",
          fontStyle: "normal",
          letterSpacing: 0,
          textAlign: "left",
          color: "#282828",
          marginLeft: 5,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

// create a component
class NewsScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);

    this.state = {
      showAction: false,
      isShowModal: this.props.isSurvey ? false : true,
      rules: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.initListNotify &&
      nextProps.initListNotify !== this.props.initListNotify
    ) {
      //console.log('1.')
      const data = {
        towerId: this.props.towerId,
        keyword: nextProps.isApplySearchKeyNotify
          ? nextProps.searchKeyNotify
          : "",
        currentPage: nextProps.currentPageNotify + 1,
        rowPerPage: this.props.rowPerPageNotify,
        typeNews: 1,
      };
      this.props.loadDataHandleNotify(data);
    }
    if (
      nextProps.isRefreshingNotify &&
      nextProps.isRefreshingNotify !== this.props.isRefreshingNotify &&
      !nextProps.isLoadingNotify
    ) {
      //console.log('2.')
      const data = {
        towerId: this.props.towerId,
        keyword: nextProps.isApplySearchKeyNotify
          ? nextProps.searchKeyNotify
          : "",
        currentPage: nextProps.currentPageNotify + 1,
        rowPerPage: this.props.rowPerPageNotify,
        typeNews: 1,
      };
      this.props.loadDataHandleNotify(data);
    }
    if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
      this.props.refreshDataHandle();
    }
  }

  componentDidMount() {
    this.props.resetStateByKey({ key: "initList", value: true });
  }
  // componentWillUnmount() {
  //   this.props.resetStateByKey({ key: "state" });
  // }
  renderItem = ({ item }) => {
    const {
      id,
      dateCreate,
      imageUrl,
      shortDescription,
      totalRead,
      title,
    } = item;
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("newsDetail", {
            item: {
              ...item,
              towerId: this.props.towerId,
              title: title,
              towerName: this.props.user.towerName,
            },
            type: 1,
          })
        }
        style={{
          borderRadius: 12,
          backgroundColor: "#ffffff",
          shadowColor: "rgba(0, 0, 0, 0.1)",
          elevation: 2,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowRadius: 14,
          shadowOpacity: 1,
          marginHorizontal: 20,
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <ImageProgress
            style={{
              height: Screen.width / 4,
              width: Screen.width / 4,
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12,
            }}
            source={{ uri: imageUrl }}
          />

          <View
            style={{
              padding: 10,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Text
              lineBreakMode="tail"
              numberOfLines={2}
              style={{
                flexDirection: "row",
                flex: 1,
                width: Screen.width - 60 - Screen.width / 4,
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#000000",
              }}
            >
              {title}
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <IconText icon="ic_luot_xem" text={totalRead} />
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 11,
                  fontWeight: "normal",
                  fontStyle: "normal",
                  lineHeight: 22,
                  textAlign: "left",
                  color: "#6f6f6f",
                }}
              >
                {moment(dateCreate).format("DD/MM/YYYY HH:mm")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderContent() {
    const {
      isLoading,
      data,
      error,
      initComponent,
      user,
      dataNotify,
      isRefreshingNotify,
      refreshDataHandle,
      emptyDataNotify,
      errorNotify,
    } = this.props;

    if (errorNotify && errorNotify.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => {
            this.props.getProfile({ type: "re", langId: this.props.langId }),
              this.props.refreshDataHandle();
          }}
        />
      );
    }
    if (emptyDataNotify) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => {
            this.props.getProfile({ type: "re", langId: this.props.langId }),
              this.props.refreshDataHandle();
          }}
        />
      );
    }
    return (
      <FlatList
        refreshing={isRefreshingNotify}
        onRefresh={() => {
          refreshDataHandle(),
            this.props.getProfile({ type: "re", langId: this.props.langId });
        }}
        data={dataNotify || []}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderItem}
        // onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (
            !this.onEndReachedCalledDuringMomentum &&
            !this.props.outOfStockNotify &&
            this.props.currentPageNotify > 0 &&
            !this.props.isLoadingNotify
          ) {
            const data = {
              towerId: this.props.towerId,
              keyword: this.props.isApplySearchKeyNotify
                ? this.props.searchKeyNotify
                : "",
              currentPage: this.props.currentPageNotify + 1,
              rowPerPage: this.props.rowPerPageNotify,
              typeNews: 1,
            };
            this.props.loadDataHandleNotify(data);
          }
        }}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        ListFooterComponent={this.renderFooter}
      />
    );
  }
  renderFooter = () => {
    if (!this.props.isLoadingNotify || this.props.isRefreshingNotify)
      return null;
    return (
      <View
        style={{
          paddingVertical: 20,
        }}
      >
        <ActivityIndicator animating size="small" />
      </View>
    );
  };
  render() {
    console.log(this.state);
    const { user, badge } = this.props;
    const uri = user ? { uri: user.photoUrl } : default_user;
    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <MyIcon name="arrow" size={20} color="black" />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 20,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "black",
              }}
            >
              Tin tức
            </Text>
          }
        />
        {this.renderContent()}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffd9",
  },
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  dot: {
    width: 5,
    height: 5,
    marginHorizontal: 5,
    borderRadius: 7,
    backgroundColor: "rgb(206, 209, 212)",
  },
  activeDot: {
    width: 5,
    height: 5,
    marginHorizontal: 5,
    borderRadius: 7,
    backgroundColor: "rgb(105, 109, 116)",
  },
  IconBadge: {
    top: -7,
    right: 8,
    position: "absolute",
    borderRadius: 45,
    minWidth: 20,
    minHeight: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0000",
  },
});

const mapStateToProps = (state) => ({
  departmentId: state.auth.user ? state.auth.user.spaceMainId : 0,
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  initComponent: state.vendorHome.initComponent,
  data: state.vendorHome.data,
  isLoading: state.vendorHome.isLoading,
  error: state.vendorHome.error,
  language: state.app.language,
  user: state.auth.user,
  badge: state.badge,
  //departmentId: state.auth.user ? state.auth.user.spaceMainId : 0,
  langId: state.app.language == "vi" ? 1 : 2,
  isLoadingChangeUser: state.auth.isLoading,
  dataNotify: state.news.data,
  isLoadingNotify: state.news.isLoading,
  initListNotify: state.news.initList,
  isRefreshingNotify: state.news.isRefreshing,
  currentPageNotify: state.news.currentPage,
  rowPerPageNotify: state.news.rowPerPage,
  emptyDataNotify: state.news.emptyData,
  outOfStockNotify: state.news.outOfStock,
  errorNotify: state.news.error,
  isApplySearchKeyNotify: state.news.isApplySearchKey,
  searchKeyNotify: state.news.searchKey,
  connectString: state.auth.connectString,
  isSurvey: state.auth.isSurvey,
});

const mapActionToState = {
  loadDataHandle,
  AddItemToList,
  getProfile,
  postFCMToken,
  loadDataHandleNotify,
  resetStateByKey,
  refreshDataHandle,
  delFCMTokenEmployee,
  checkAnswerSurvey,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(NewsScreen);
