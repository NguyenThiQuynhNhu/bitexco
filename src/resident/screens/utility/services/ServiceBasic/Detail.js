//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import Toast, { DURATION } from "react-native-easy-toast";
import LinearGradient from "react-native-linear-gradient";
import Lightbox from "react-native-lightbox";
import moment from "moment";
import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  feedbackHandle,
  ratingHandle,
} from "../../../../actions/utilitiesServicesBasicDetail";
import ErrorContent from "../../../../components/common/ErrorContent";
import ImageProgress from "../../../../components/common/ImageProgress";
import fontsize from "../../../../theme/fontsize";
import colors from "../../../../theme/colors";
import { MyIcon } from "../../../../theme/icons";
import { default_image } from "../../../../theme/images";
import {
  converStatusToColor,
  converStatusToString,
  myFromNow,
} from "../../../../utils/serviceBasic";
import VendorInfo from "../../../../components/Request/Detail/VendorInfo";
import ImageGallery from "../../../../components/Request/Detail/ImageGallery";
import { Screen } from "../../../../utils/device";
import Strings from "../../../../utils/languages";
import NavBar from "../../../../components/common/NavBar";
import CommentView from "./CommentView";
import fontSize from "../../../../theme/fontsize";
import responsive from "../../../../../resources/responsive";
// create a component
class ServiceBasicDetailScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      // itemfromList: props.navigation.state.params,
      isShowModal: false,
      content: "",
      showAction: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errorResponse &&
      nextProps.errorResponse !== this.props.errorResponse
    ) {
      if (nextProps.errorResponse.hasError) {
        this.refs.toast.show(Strings.message.saveError, DURATION.LENGTH_LONG);
      } else {
        this.refs.toast.show(
          Strings.detailRequest.feedbackSuccess,
          DURATION.LENGTH_LONG
        );
      }
    }
    if (
      nextProps.errorProgress &&
      nextProps.errorProgress !== this.props.errorProgress
    ) {
      if (nextProps.errorProgress.hasError) {
        this.refs.toast.show(Strings.message.saveError, DURATION.LENGTH_LONG);
      } else {
        this.props.loadDataHandle({
          id: this.props.navigation.state.params.id,
          langId: this.props.langId,
        });
        this.refs.toast.show(
          Strings.detailRequest.rateSuccess,
          DURATION.LENGTH_LONG
        );
      }
    }
  }
  componentDidMount() {
    this.props.loadDataHandle({
      id: this.props.navigation.state.params.id,
      langId: this.props.langId,
    });
    //this.props.loadDataHandle({ id: 22, langId: this.props.langId })
  }
  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }

  renderStar(active, rate) {
    return (
      <MyIcon
        name="star"
        size={20}
        color={colors.appTheme}
        style={active ? styles.iconStarActive : styles.iconStarDeactive}
      />
    );
  }

  renderRateView(ratingMark) {
    const listStar = [];
    for (let i = 0; i < 5; i += 1) {
      const active = i < ratingMark;
      listStar.push(this.renderStar(active, i + 1));
    }
    return listStar;
  }

  renderItemChat = ({ item }) => {
    const {
      dateActive,
      description,
      statusName,
      statusId,
      userName,
      avatarUrl,
      ratingMark,
      isCustomer,
    } = item;
    return (
      <View
        style={{
          // borderRadius: 16,
          padding: 10,
          backgroundColor: "#ffffff",
          // shadowColor: "rgba(0, 0, 0, 0.08)",
          // elevation: 2,
          // shadowOffset: {
          //   width: 0,
          //   height: 4,
          // },
          // shadowRadius: 12,
          // shadowOpacity: 1,
          marginHorizontal: 20,
          marginVertical: responsive.h(10),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ImageProgress
              source={{
                uri: `${
                  isCustomer
                    ? this.props.user.photoUrl
                    : avatarUrl || default_image
                }`,
              }}
              circle={true}
              style={{
                height: 32,
                width: 32,
              }}
            />
            {isCustomer ? null : (
              <View
                style={{
                  marginRight: 5,
                  marginVertical: responsive.h(5),
                  backgroundColor: colors.gray1,
                  borderRadius: 15,
                }}
              >
                <Text
                  style={{
                    margin: 2,
                    marginHorizontal: 5,
                    fontSize: fontsize.micro,
                    color: "#fff",
                    fontFamily: "Inter-Regular",
                  }}
                >
                  BQL
                </Text>
              </View>
            )}
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(14),
                textAlign: "left",
                paddingLeft: 10,
                color: "#505050",
              }}
            >
              {isCustomer ? this.props.user.fullName : userName}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#fff5eb",
              borderRadius: 15,
              paddingHorizontal: responsive.w(10),
              backgroundColor: "#feefef",
              borderRadius: 15,
              height: responsive.h(24),
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                margin: 5,
                marginHorizontal: 10,
                fontSize: responsive.h(14),
                color: converStatusToColor(statusId),
                fontFamily: "Inter-Regular",
              }}
            >
              {converStatusToString(statusId)}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: responsive.h(11),
            color: colors.gray1,
            fontFamily: "Inter-Regular",
            paddingLeft: responsive.w(45),
          }}
        >
          {moment(dateActive).format("DD/MM/YYYY HH:mm")}
        </Text>
        {ratingMark === 0 || ratingMark === undefined ? (
          <View />
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {this.renderRateView(ratingMark)}
          </View>
        )}
        <Text
          style={{
            fontFamily: "Inter-Medium",
            fontSize: responsive.h(15),
            textAlign: "left",
            color: "#505050",
            marginTop: 10,
          }}
        >
          {description}
        </Text>
      </View>
    );
  };

  renderItemZone({ item }) {
    return (
      <View
        style={{
          marginVertical: responsive.h(5),
          backgroundColor: colors.grayBorder,
          borderRadius: 15,
          height: responsive.h(24),
          width: responsive.w(102),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#808182",
            fontFamily: "Inter-SemiBold",
            fontSize: responsive.h(14),
          }}
        >
          {item}
        </Text>
      </View>
    );
  }

  renderContent() {
    const { error, data, initComponent } = this.props;
    if (initComponent) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          {/* <ActivityIndicator /> */}
        </View>
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
    if (data == null) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
      );
    } else if (data) {
      const { seviceBasic, historys } = this.props.data;

      const {
        apartmentId,
        dateBook,
        dateCreate,
        dateOfProcess,
        departmentId,
        departmentName,
        description,
        employeeName,
        id,
        lastComment,
        logo,
        price,
        rating,
        ratingComment,
        residentId,
        serviceName,
        statusId,
        statusName,
        towerId,
        zoneTimes,
        zoneName,
        amount,
      } = seviceBasic;
      return (
        <ScrollView style={{ borderTopRightRadius: 20 }}>
          <View style={{ flex: 1 }}>
            {/* Thông tin nha cung cap */}
            <View
              style={{
                borderRadius: 16,
                backgroundColor: "#ffffff",
                marginHorizontal: 20,
                marginBottom: 20,
                marginTop: 5,
                borderWidth: 1,
                borderBottomWidth: 2,
                borderColor: "#eaeaea",
                borderBottomColorColor: "#eaeaea",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <ImageProgress
                  circle={true}
                  style={{
                    height: 90,
                    width: 90,
                  }}
                  source={{ uri: logo }}
                />
                <View
                  style={{ flex: 1, justifyContent: "center", marginLeft: 20 }}
                >
                  <View
                    style={{
                      alignItems: "flex-start",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        marginRight: 10,
                        marginVertical: responsive.h(5),
                        paddingHorizontal: responsive.w(10),
                        backgroundColor: "#feefef",
                        borderRadius: 15,
                        height: responsive.h(24),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          margin: 5,
                          marginHorizontal: 10,
                          fontSize: responsive.h(14),
                          color: converStatusToColor(statusId),
                          fontFamily: "Inter-Regular",
                        }}
                      >
                        {converStatusToString(statusId)}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      marginVertical: responsive.h(5),
                      fontFamily: "Inter-SemiBold",
                      fontSize: responsive.h(14),
                      textAlign: "left",
                      color: "#afaeae",
                      maxWidth: responsive.w(200),
                    }}
                  >
                    {employeeName} - {departmentName}
                  </Text>
                </View>
              </View>
              {/* Nội dung */}
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                  paddingHorizontal: 10,
                  marginTop: 10,
                  marginVertical: responsive.h(5),
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textTitle}>
                  {Strings.serviceBasicBooking.amountPeople}
                </Text>
                <Text style={{ ...styles.textInfo, marginLeft: 5 }}>
                  {amount}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                  paddingHorizontal: 10,
                  marginVertical: responsive.h(5),
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textTitle}>
                  {Strings.serviceBasicBooking.dateBook}
                </Text>
                <Text style={{ ...styles.textInfo, marginLeft: 5 }}>
                  {moment(dateBook).format("DD/MM/YYYY")}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                  paddingHorizontal: 10,
                  marginVertical: responsive.h(5),
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textTitle}>
                  {Strings.serviceBasicBooking.deposit}
                </Text>
                <Text
                  style={{
                    ...styles.textInfo,
                    color: "#9b9b9b",
                    marginLeft: 5,
                  }}
                >
                  {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  <Text
                    style={{
                      fontFamily: "Inter",
                      fontSize: 11,
                      textAlign: "right",
                      color: "#9b9b9b",
                    }}
                  >
                    VNĐ
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  marginBottom: 10,
                  paddingHorizontal: 10,
                  marginVertical: responsive.h(5),
                }}
              >
                <Text style={styles.textTitle}>
                  {Strings.serviceBasicBooking.time}
                </Text>
                <FlatList
                  style={{ alignSelf: "flex-start", marginTop: 5 }}
                  scrollEnabled={false}
                  data={zoneTimes}
                  keyExtractor={(index) => `${index}`}
                  renderItem={this.renderItemZone}
                  numColumns={2}
                  horizontal={false}
                />
              </View>
              {description ? (
                <View
                  style={{
                    marginBottom: 15,
                    paddingHorizontal: 5,
                    marginLeft: 5,
                  }}
                >
                  <Text style={styles.textTitle}>
                    {Strings.serviceBasicBooking.message}
                  </Text>
                  <Text
                    style={{
                      ...styles.textInfo,
                      marginLeft: 5,
                      fontStyle: "italic",
                      marginTop: 5,
                    }}
                  >
                    {description}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* <View
              style={{
                marginHorizontal: 20,
                height: 1,
                backgroundColor: "#d4d4d4",
              }}
            /> */}
            {/* Chat */}
            <View>
              <FlatList
                data={historys || []}
                keyExtractor={(item, index) => `${index}`}
                renderItem={(item) => this.renderItemChat(item)}
                ItemSeparatorComponent={() => {
                  return (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#f5f5f5",
                        marginHorizontal: 10,
                      }}
                    />
                  );
                }}
              />
            </View>
            <Modal
              onRequestClose={() => null}
              transparent={true}
              visible={this.state.isShowModal}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : ""}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0,0.3)",
                }}
              >
                <CommentView
                  onChangeText={(text) => this.setState({ content: text })}
                  onYes={() =>
                    this._onResponseSuccess({
                      bookingId: id,
                      description: this.state.content,
                      isCustomer: true,
                      typeService: 0,
                      towerName: this.props.user.towerName,
                      apartmentName: this.props.user.spaceMainCode,
                      departmentId,
                    })
                  }
                  onClose={() => this.setState({ isShowModal: false })}
                />
              </KeyboardAvoidingView>
            </Modal>

            <Spinner
              visible={this.props.isLoadingReponse}
              textContent={Strings.app.progressing}
              textStyle={{ color: "#FFF", fontSize: fontsize.small }}
            />
          </View>
        </ScrollView>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ paddingVertical: 10 }}
            >
              <MyIcon name="arrow" color="black" size={20} />
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
              {this.props.data && this.props.data.seviceBasic.serviceName}
            </Text>
          }
          rightView={
            <TouchableOpacity
              onPress={() => this.setState({ isShowModal: true })}
              style={{ paddingVertical: 10 }}
            >
              <MyIcon name="reply" color="black" size={20} />
              {/* <Text style={{ color: '#fff' }}>{Strings.detailRequest.feedback}</Text> */}
            </TouchableOpacity>
          }
        />
        {this.renderContent()}

        <Spinner
          visible={this.props.isLoading}
          overlayColor="rgba(255, 255, 255, 0.05)"
          color={colors.appTheme}
          textContent={Strings.app.loading}
          textStyle={{ color: colors.appTheme, fontSize: fontsize.small }}
        />
        <Toast
          ref="toast"
          style={{
            backgroundColor:
              this.props.errorResponse && this.props.errorResponse.hasError
                ? colors.toast.warning
                : colors.toast.success,
          }}
        />
      </View>
    );
  }

  _onResponseSuccess = (requestData) => {
    if (this.state.content.length !== 0) {
      this.setState({ isShowModal: false }, () =>
        this.props.feedbackHandle(requestData)
      );
    } else {
      this.refs.toast.show(
        Strings.detailRequest.typeContent,
        DURATION.LENGTH_LONG
      );
    }
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  linearGradient: {
    width: "90%",
    borderRadius: 5,
    backgroundColor: colors.primaryKeyColor,
  },
  cardView: {
    borderRadius: 5,
    flexDirection: "row",
    margin: 5,
    padding: 2,
    borderColor: "#fafafa",
    borderWidth: 1,
    backgroundColor: "white",
  },
  iconStarDeactive: {
    margin: 5,
    opacity: 0.5,
  },
  iconStarActive: {
    margin: 5,
  },
  wrapperTextIcon: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  swiperImage: {
    margin: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: responsive.h(15),
    fontWeight: "500",
    // textAlign: "right",
    color: "#3d3d3d",
  },
  textInfo: {
    fontFamily: "Inter-SemiBold",
    fontSize: responsive.h(15),
    fontWeight: "600",
    // textAlign: "right",
    color: "#282828",
  },
});
const mapStateToProps = (state) => ({
  user: state.auth.user,
  initComponent: state.utilitiesServicesBasicDetail.initComponent,
  data: state.utilitiesServicesBasicDetail.data,
  isLoading: state.utilitiesServicesBasicDetail.isLoading,
  errorResponse: state.utilitiesServicesBasicDetail.errorResponse,
  errorProgress: state.utilitiesServicesBasicDetail.errorProgress,
  error: state.utilitiesServicesBasicDetail.error,
  langId: state.app.language == "vi" ? 1 : 2,
});

const mapActionToProps = {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  feedbackHandle,
  ratingHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(ServiceBasicDetailScreen);
