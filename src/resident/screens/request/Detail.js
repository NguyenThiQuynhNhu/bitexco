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
} from "react-native";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import Toast, { DURATION } from "react-native-easy-toast";
import LinearGradient from "react-native-linear-gradient";
import Lightbox from "react-native-lightbox";
import moment from "moment";
import {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
  closeRequestHandle,
  ratingHandle,
} from "../../actions/requestDetail";
import ErrorContent from "../../components/common/ErrorContent";
import ImageProgress from "../../components/common/ImageProgress";
import fontsize from "../../theme/fontsize";
import colors from "../../theme/colors";
import { MyIcon } from "../../theme/icons";
import { default_image } from "../../theme/images";
import {
  converStatusToColor,
  converStatusToString,
  myFromNow,
} from "../../utils/request";
import VendorInfo from "../../components/Request/Detail/VendorInfo";
import ImageGallery from "../../components/Request/Detail/ImageGallery";
import { Screen } from "../../utils/device";
import Strings from "../../utils/languages";
import NavBar from "../../components/common/NavBar";
import CommentView from "./CommentView";
import FeedbackView from "./FeedbackView";
import responsive from "../../../resources/responsive";

// create a component
class RequestDetailScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      itemfromList: props.navigation.state.params,
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
        this.props.loadDataHandle({ requestId: this.state.itemfromList.id });
        this.refs.toast.show(
          Strings.detailRequest.rateSuccess,
          DURATION.LENGTH_LONG
        );
      }
    }
  }
  componentDidMount() {
    this.props.navigation.setParams({ onResponse: this._onResponse });
    this.props.loadDataHandle({ requestId: this.state.itemfromList.id });
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

  renderItemChat = ({ item, index }) => {
    //console.log(this.props.user);
    const {
      dateActive,
      content,
      statusName,
      statusId,
      userName,
      avatarUrl,
      ratingMark,
      isCustomer,
      statusKey,
    } = item;
    return (
      // <View
      //   style={{
      //     flexDirection: "row",
      //     borderRadius: 12,
      //     backgroundColor: "#ffffff",
      //     marginHorizontal: 20,
      //     marginBottom: 10,
      //     padding: 10,
      //     borderTopWidth: 0.5,
      //     borderTopColor: "#d4d4d4",
      //   }}
      // >
      //   <ImageProgress
      //     source={{
      //       uri: `${
      //         isCustomer ? this.props.user.photoUrl : avatarUrl || default_image
      //       }`,
      //     }}
      //     circle={true}
      //     style={{
      //       height: 32,
      //       width: 32,
      //     }}
      //   />

      //   <View
      //     style={{
      //       width: Screen.width - 102,
      //       justifyContent: "center",
      //       marginLeft: 10,
      //     }}
      //   >
      //     <View
      //       style={{
      //         flex: 1,
      //         alignItems: "center",
      //         flexDirection: "row",
      //         justifyContent: "space-between",
      //       }}
      //     >
      //       {isCustomer ? (
      //         <View />
      //       ) : (
      //         <View
      //           style={{
      //             marginRight: 5,
      //             marginVertical: 5,
      //             backgroundColor: colors.gray1,
      //             borderRadius: 15,
      //           }}
      //         >
      //           <Text
      //             style={{
      //               margin: 2,
      //               marginHorizontal: 5,
      //               fontSize: fontsize.micro,
      //               color: "#fff",
      //             }}
      //           >
      //             BQL
      //           </Text>
      //         </View>
      //       )}
      //       <Text
      //         style={{
      //           fontWeight: "bold",
      //           fontFamily: "Inter-SemiBold",
      //           flex: 0.8,
      //         }}
      //       >
      //         {isCustomer ? this.props.user.fullName : userName}
      //       </Text>
      //       <View
      //         style={{
      //           marginLeft: 10,
      //           marginVertical: 5,
      //           padding: 5,
      //           borderRadius: 16,
      //           backgroundColor: "#fff5eb",
      //         }}
      //       >
      //         <Text
      //           style={{
      //             fontFamily: "Inter-Regular",
      //             fontSize: 14,
      //             fontWeight: "normal",
      //             fontStyle: "normal",
      //             letterSpacing: 0,
      //             textAlign: "center",
      //             color: converStatusToColor(statusKey),
      //           }}
      //         >
      //           {statusName}
      //         </Text>
      //       </View>
      //     </View>
      //     {ratingMark === 0 || ratingMark === undefined ? (
      //       <View />
      //     ) : (
      //       <View
      //         style={{
      //           flexDirection: "row",
      //           alignItems: "center",
      //           justifyContent: "center",
      //         }}
      //       >
      //         {this.renderRateView(ratingMark)}
      //       </View>
      //     )}
      //     <Text
      //       style={{
      //         marginTop: -5,
      //         fontFamily: "Inter-Regular",
      //         fontSize: 12,
      //         fontWeight: "normal",
      //         fontStyle: "normal",
      //         letterSpacing: 0,
      //         textAlign: "left",
      //         color: "#7d8895",
      //       }}
      //     >
      //       {moment(dateActive).format("DD/MM/YYYY HH:mm")}
      //     </Text>
      //     <Text
      //       style={{
      //         marginTop: 10,
      //         fontFamily: "Inter-Regular",
      //         fontSize: 14,
      //         fontWeight: "normal",
      //         fontStyle: "normal",
      //         letterSpacing: 0,
      //         textAlign: "left",
      //         color: "#000000",
      //       }}
      //     >
      //       {content}
      //     </Text>
      //   </View>
      // </View>
      <View
        style={{
          borderRadius: 16,
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
          marginHorizontal: 10,
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
          {content}
        </Text>
      </View>
    );
  };

  renderContent() {
    const { error, emptyData } = this.props;
    if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
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
    if (this.props.data) {
      const {
        id,
        title,
        content,
        statusId,
        contractName,
        userActive,
        dateRequest,
        resultContent,
        imageAdmin,
        imageCustormer,
        historyContent,
        departmentName,
        statusName,
        statusKey,
      } = this.props.data;
      const { logo, towerName } = this.state.itemfromList;
      //console.log(this.props.data);
      return (
        <ScrollView style={{ borderTopRightRadius: 20, marginVertical: 10 }}>
          <View style={{ flex: 1, borderTopRightRadius: 20, marginTop: -20 }}>
            {/* Thông tin nha cung cap */}
            <VendorInfo
              data={{
                logo: this.props.user.photoUrl,
                towerName,
                statusId,
                contractName,
                departmentName,
                userActive,
                statusName,
                statusKey,
                userName: this.props.user.fullName,
                date: moment(dateRequest).format("DD/MM/YYYY HH:mm"),
              }}
            />
            {/* Nội dung */}
            <View style={{ marginHorizontal: 20 }}>
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: 16,
                  fontWeight: "600",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#282828",
                }}
              >
                {this.props.navigation.state.params.title}
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  fontFamily: "Inter-Regular",
                  fontSize: 13,
                  fontWeight: "normal",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#3d3d3d",
                }}
              >
                {content}
              </Text>
            </View>
            {/* Hình người dùng gửi */}

            {imageCustormer.length !== 0 && (
              <View
                style={{
                  //borderColor: colors.grayBorder,
                  //borderTopWidth: 10,
                  //borderBottomWidth: 10,
                  marginTop: -10,
                  marginHorizontal: 20,
                }}
              >
                <ImageGallery title="" data={imageCustormer} />
              </View>
            )}

            {/* Hình BQL phản hồi */}
            {imageAdmin.length !== 0 && (
              <View
                style={{
                  // borderColor: colors.grayBorder,
                  // borderTopWidth: imageCustormer.length != 0 ? 0 : 10,
                  // borderBottomWidth: 10,
                  // marginHorizontal: -10,
                  // paddingLeft: 10,
                  // paddingBottom: 10
                  marginTop: imageCustormer.length != 0 ? 20 : 0,
                  marginHorizontal: imageCustormer.length != 0 ? 20 : 0,
                }}
              >
                <ImageGallery
                  title={Strings.detailRequest.imagesAdmin}
                  data={imageAdmin}
                />
              </View>
            )}

            <FlatList
              //ItemSeparatorComponent={() => <View style={{ height: 10, backgroundColor: '#fff' }} />}
              data={historyContent || []}
              keyExtractor={(item, index) => `${index}`}
              renderItem={(item) => this.renderItemChat(item)}
              contentContainerStyle={{
                marginTop: 10,
              }}
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
                {this.props.data.statusKey === "hoan_thanh" ? (
                  <FeedbackView
                    onSubmit={({ rate, description }) =>
                      this.setState({ isShowModal: false }, () =>
                        this.props.ratingHandle({
                          id,
                          rating: rate,
                          content: description,
                          keyTrangThai: "dong",
                        })
                      )
                    }
                    onClose={() => this.setState({ isShowModal: false })}
                  />
                ) : (
                  <CommentView
                    onChangeText={(text) => this.setState({ content: text })}
                    onYes={() =>
                      this._onResponseSuccess({
                        request: {
                          id,
                          //statusId: 13,
                          content: this.state.content,
                        },
                        userName: this.props.user.fullName,
                      })
                    }
                    onClose={() => this.setState({ isShowModal: false })}
                  />
                )}
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
                padding: 10,
                width: Screen.width - 124,
                fontFamily: "Inter-Bold",
                fontSize: 18,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "black",
              }}
              numberOfLines={2}
              lineBreakMode="tail"
            >
              {this.props.navigation.state.params.title}
            </Text>
          }
          rightView={
            this.props.data &&
            this.props.data.statusKey !== "dong" && (
              <TouchableOpacity
                onPress={() => this.setState({ isShowModal: true })}
                style={{ paddingVertical: 10 }}
              >
                <MyIcon name="reply" color="black" size={20} />
                {/* <Text style={{ color: '#fff' }}>{this.props.data.statusKey !== 'hoan_thanh' ? Strings.detailRequest.feedback : Strings.detailRequest.rating}</Text> */}
              </TouchableOpacity>
            )
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
        <Toast ref="toast" style={{ backgroundColor: colors.toast.success }} />
      </View>
    );
  }

  _onResponseSuccess = (requestData) => {
    if (this.state.content.length !== 0) {
      this.setState({ isShowModal: false }, () =>
        this.props.closeRequestHandle(requestData)
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
});
const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.requestDetailResident.data,
  isLoading: state.requestDetailResident.isLoading,
  errorResponse: state.requestDetailResident.errorResponse,
  errorProgress: state.requestDetailResident.errorProgress,
  error: state.requestDetailResident.error,
  emptyData: state.requestDetailResident.emptyData,
});

const mapActionToProps = {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
  closeRequestHandle,
  ratingHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(RequestDetailScreen);
