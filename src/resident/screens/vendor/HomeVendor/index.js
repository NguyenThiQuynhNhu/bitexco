//import liraries
import React, { Component } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";
import Toast, { DURATION } from "react-native-easy-toast";
import Swiper from "../../../components/common/Swiper";
import ImageProgress from "../../../components/common/ImageProgress";
import Device, { Screen } from "../../../utils/device";
import IconText from "../../../components/common/IconText";
import ErrorContent from "../../../components/common/ErrorContent";
import colors from "../../../theme/colors";
import FontSize from "../../../theme/fontsize";
import {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
  updateStatusVendorHandle,
} from "../../../actions/vendorDetail";
import { navVendorInfo } from "../../../actions/nav";
import { MyIcon } from "../../../theme/icons";
import { default_image } from "../../../theme/images";
import Strings from "../../../utils/languages";
import responsive from "../../../../resources/responsive";
import fontsize from "../../../theme/fontsize";

// create a component
class VendorDetail extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      itemFromList: props.navigation.state.params,
      showSwiper: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { id } = this.props.navigation.state.params;
    if (
      nextProps.isRefreshing &&
      this.props.isRefreshing !== nextProps.isRefreshing
    ) {
      this.props.loadDataHandle({
        towerId: id,
        langId: this.props.language == "vi" ? 1 : 2,
      });
    }
    if (
      nextProps.initComponent &&
      this.props.initComponent !== nextProps.initComponent
    ) {
      this.props.loadDataHandle({
        towerId: id,
        langId: this.props.language == "vi" ? 1 : 2,
      });
    }
    if (
      nextProps.errorUpdate &&
      this.props.errorUpdate !== nextProps.errorUpdate
    ) {
      if (nextProps.errorUpdate.hasError) {
        this.refs.toast.show(
          `Xảy ra lỗi  ${nextProps.errorUpdate.statusText}`,
          DURATION.LENGTH_LONG
        );
      } else {
        this.refs.toast.show(
          `${
            this.props.data.typeId == 20 ? "Rời khỏi" : "Tham gia"
          } thành công`,
          DURATION.LENGTH_LONG
        );
      }
    }
  }

  componentDidMount() {
    this.props.resetStateByKey({ key: "initComponent", path: "", value: true });
  }

  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }

  renderVendorNews(newsData) {
    if (newsData.length > 0) {
      const pageData = newsData.map((o, index) => (
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            this.props.navigation.navigate("newsDetail", {
              item: {
                towerName: this.props.data.towerName,
                id: o.id,
                towerId: this.props.data.id,
                dateCreate: o.dateCreate,
                title: o.shortDescription,
              },
              type: 1,
            });
          }}
        >
          <View key={index} style={{ flexDirection: "row" }}>
            <ImageProgress
              style={{
                height: responsive.h(100),
                width: responsive.h(100),
              }}
              source={{ uri: o.imageUrl }}
            />

            <View
              style={{
                flex: 1,
                marginLeft: responsive.w(10),
                paddingVertical: responsive.h(10),
              }}
            >
              <Text
                lineBreakMode="tail"
                numberOfLines={2}
                style={{ fontWeight: "bold" }}
              >
                {o.shortDescription}
              </Text>
              <Text
                style={{
                  marginTop: responsive.h(5),
                  color: colors.gray1,
                  fontStyle: "italic",
                }}
              >
                {moment(o.dateCreate).format("DD/MM/YYYY HH:mm")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ));
      if (Platform.OS === "ios") {
        return (
          <Swiper
            autoplay
            autoplayTimeout={2}
            style={{ height: responsive.h(100) }}
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
            paginationStyle={{ bottom: responsive.h(5) }}
            showsButtons={false}
          >
            {pageData}
          </Swiper>
        );
      }
      return (
        <Swiper
          style={{ height: responsive.h(100) }}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          paginationStyle={{ bottom: responsive.h(5) }}
          showsButtons={false}
        >
          {pageData}
        </Swiper>
      );
    }
    return null;
  }

  renderIcon = (id) => {
    switch (id) {
      case 1:
        return (icon = "message-square");
      case 2:
        return (icon = "file-text");
      case 3:
        return (icon = "search2");
      default:
        return (icon = "info");
    }
  };

  renderMenuItem = (item, index) => {
    const widthItem = Screen.width * (1 / 3) - responsive.h(2.5);
    const { id, functionName, status } = item.item;
    const filter = { ...this.props.data };
    let icon = this.renderIcon(id);

    return (
      <TouchableOpacity
        onPress={() => {
          if (this.props.data.typeId !== 20) {
            return this.refs.toastWarning.show(
              `Vui lòng tham gia nhà cung cấp`,
              DURATION.LENGTH_LONG
            );
          }
          switch (id) {
            case 1:
              return this.props.navigation.navigate("vendorRequest", {
                from: "vendorDetail",
                filter,
              });
            case 2:
              return this.props.navigation.navigate("vendorNews", {
                from: "vendorDetail",
                filter,
              });
            case 3:
              return this.props.navigation.navigate("fee", {
                from: "vendorDetail",
                filter: this.state.itemFromList,
              });
            default:
              break;
          }
        }}
      >
        <IconText
          key={index}
          wrapperStyle={{
            justifyContent: "center",
            alignItems: "center",
            width: widthItem,
            height: responsive.h(100),
            borderColor: colors.grayBorder,
            borderWidth: 1,
            borderTopWidth: 0,
            borderBottomWidth: 1,
          }}
          attribute={{
            style: {
              textAlign: "center",
              marginHorizontal: responsive.w(20),

              fontSize: responsive.h(fontsize.medium),
              marginTop: responsive.h(10),
              color: colors.gray1,
            },
          }}
          size={responsive.h(30)}
          color={colors.gray1}
          icon={icon}
          text={functionName}
        />
      </TouchableOpacity>
    );
  };

  update = ({ towerId, statusId }) => {
    if (statusId !== 20) {
      Alert.alert(
        "Thông báo",
        "Bạn có chắc chắn muốn rời khỏi nhà cung cấp ?",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Đồng ý",
            onPress: () =>
              this.props.updateStatusVendorHandle({ towerId, statusId }),
          },
        ],
        { cancelable: true }
      );
    } else {
      return this.props.updateStatusVendorHandle({ towerId, statusId });
    }
  };

  render() {
    const {
      isLoading,
      data,
      error,
      navVendorInfo,
      updateStatusVendorHandle,
    } = this.props;
    if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
      );
    }
    if (data) {
      const {
        id,
        typeId,
        towerName,
        hotline,
        address,
        logo,
        banner,
        towerFunctions,
        newsNewest,
      } = this.props.data;
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ ...Device.defaultMarginTop(), flex: 1 }}
        >
          <View style={styles.container}>
            {/* Header */}
            <View
              style={{
                paddingBottom: responsive.h(10),
                backgroundColor: "#fff",
              }}
            >
              <ImageProgress
                source={{ uri: banner }}
                style={{
                  width: Screen.width,
                  height: responsive.h(200),
                }}
              />
              <View style={{ bottom: 0, alignItems: "center" }}>
                <View
                  style={{
                    marginTop: responsive.h(-50),
                    borderColor: colors.grayBorder,
                    borderRadius: responsive.h(5),
                    borderWidth: 4,
                    backgroundColor: "#fff",
                  }}
                >
                  <ImageProgress
                    source={{ uri: logo }}
                    style={{
                      width: responsive.h(100),
                      height: responsive.h(100),
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: responsive.h(fontsize.medium),
                    marginVertical: responsive.h(10),
                  }}
                >
                  {towerName}
                </Text>
                <Text
                  style={{
                    fontSize: responsive.h(14),
                  }}
                >
                  {address}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  marginTop: responsive.h(10),
                  marginLeft: responsive.w(10),
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center",

                  backgroundColor: "rgba(77, 77, 77,0.5)",
                  width: responsive.h(50),
                  height: responsive.h(50),
                  borderRadius: responsive.h(25),
                }}
                onPress={() => this.props.navigation.goBack()}
              >
                <MyIcon name="arrow" size={responsive.h(20)} color="#fff" />
              </TouchableOpacity>
            </View>
            {/* Menu */}
            <View
              style={{
                borderColor: colors.grayBorder,
                backgroundColor: "#fff",
                padding: responsive.h(20),
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.update({ towerId: id, statusId: typeId == 20 ? 10 : 20 })
                }
              >
                <IconText
                  wrapperStyle={{
                    marginHorizontal: responsive.w(20),
                    alignItems: "center",
                  }}
                  attribute={{
                    style: {
                      color: typeId == 20 ? colors.appTheme : colors.gray1,
                    },
                  }}
                  size={responsive.h(20)}
                  color={typeId == 20 ? colors.appTheme : colors.gray1}
                  icon="tick"
                  text={
                    typeId == 20
                      ? Strings.detailVendor.leave
                      : Strings.detailVendor.join
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("vendorInfo", {
                    towerId: id,
                    towerName,
                  })
                }
              >
                <IconText
                  wrapperStyle={{
                    marginHorizontal: responsive.h(20),
                    alignItems: "center",
                  }}
                  attribute={{
                    style: {
                      color: colors.appTheme,
                    },
                  }}
                  size={responsive.h(20)}
                  color={colors.appTheme}
                  icon="info"
                  text={Strings.detailVendor.info}
                />
              </TouchableOpacity>

              <IconText
                wrapperStyle={{
                  marginHorizontal: responsive.w(20),
                  alignItems: "center",
                }}
                attribute={{
                  style: {
                    color: colors.appTheme,
                  },
                }}
                size={responsive.h(20)}
                color={colors.appTheme}
                icon="three-dot"
                text={Strings.detailVendor.more}
              />
            </View>
            {/* Slide News */}
            {newsNewest.length !== 0 && (
              <View
                style={{
                  height: responsive.h(120),
                  borderBottomWidth: 10,
                  borderTopWidth: 10,
                  borderColor: colors.grayBorder,
                }}
              >
                {this.renderVendorNews(newsNewest)}
              </View>
            )}

            {/* funcionMenu */}
            <View>
              <FlatList
                data={towerFunctions || []}
                renderItem={this.renderMenuItem}
                keyExtractor={(item, index) => `${index}`}
                horizontal={false}
                numColumns={3}
                scrollEnabled={false}
              />
            </View>
            <Spinner
              visible={this.props.isLoading}
              textContent={"Đang tải dữ liệu..."}
              textStyle={{
                color: "#FFF",
                fontSize: responsive.h(fontsize.small),
              }}
            />
            <Toast
              ref="toast"
              style={{
                backgroundColor: colors.toast.success,
                opacity: 1,
                borderRadius: responsive.h(5),
                padding: responsive.h(10),
              }}
              position={Platform.OS == "ios" ? "bottom" : "center"}
            />
            <Toast
              ref="toastWarning"
              style={{
                backgroundColor: colors.toast.warning,
                opacity: 1,
                borderRadius: responsive.h(5),
                padding: responsive.h(10),
              }}
              position={Platform.OS == "ios" ? "bottom" : "center"}
            />
          </View>
        </ScrollView>
      );
    }
    return <View />;
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  dot: {
    width: responsive.h(5),
    height: responsive.h(5),
    marginHorizontal: responsive.w(5),
    borderRadius: responsive.h(7),
    backgroundColor: "rgb(206, 209, 212)",
  },
  activeDot: {
    width: responsive.h(5),
    height: responsive.h(5),
    marginHorizontal: responsive.w(5),
    borderRadius: responsive.h(7),
    backgroundColor: "rgb(105, 109, 116)",
  },
});

//make this component available to the app
const mapStateToProps = (state) => ({
  initComponent: state.vendorDetail.initComponent,
  isLoading: state.vendorDetail.isLoading,
  data: state.vendorDetail.data,
  error: state.vendorDetail.error,
  isRefreshing: state.vendorDetail.isRefreshing,
  errorUpdate: state.vendorDetail.errorUpdate,
  language: state.app.language,
});

const mapActionToState = {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  navVendorInfo,
  updateStatusVendorHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(VendorDetail);
