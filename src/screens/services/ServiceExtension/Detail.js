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
  Linking,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import Toast, { DURATION } from "react-native-easy-toast";
import moment from "moment";
import {
  loadDataHandle,
  resetStateByKey,
  updateRequestHandle,
} from "../../../actions/servicesExtensionDetail";
import ErrorContent from "../../../components/common/ErrorContent";
import ImageProgress from "../../../components/common/ImageProgress";
import fontsize from "../../../theme/fontsize";
import colors from "../../../theme/colors";
import { MyIcon } from "../../../theme/icons";
import { default_image } from "../../../theme/images";
import {
  converStatusToColor,
  converStatusToString,
  converStatusToColorService,
} from "../../../utils/request";
import Strings from "../../../utils/languages";
import ActionSheet from "../../../components/common/ActionSheet";
import { Screen } from "../../../utils/device";

import NavBar from "../../../resident/components/common/NavBar";
import responsive from "../../../resources/responsive";
// create a component
class ServiceExtensionDetailScreen extends Component {
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
      title: "",
      statusId: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errorResponse &&
      nextProps.errorResponse !== this.props.errorResponse
    ) {
      if (nextProps.errorResponse.hasError) {
        this.refs.toast.show(
          `Xảy ra lỗi  ${nextProps.errorResponse.message}`,
          DURATION.LENGTH_LONG
        );
      } else {
        this.props.loadDataHandle({
          id: this.props.navigation.state.params.id,
          langId: this.props.langId,
        });
        this.refs.toast.show("Xử lý thành công", DURATION.LENGTH_LONG);
      }
    }
    if (
      nextProps.errorProgress &&
      nextProps.errorProgress !== this.props.errorProgress
    ) {
      if (nextProps.errorProgress.hasError) {
        this.refs.toast.show(
          `Xảy ra lỗi  ${nextProps.errorProgress.message}`,
          DURATION.LENGTH_LONG
        );
      } else {
        this.props.loadDataHandle({
          id: this.props.navigation.state.params.id,
          langId: this.props.langId,
        });
        this.refs.toast.show("Đánh giá thành công", DURATION.LENGTH_LONG);
      }
    }
  }
  componentDidMount() {
    this.props.loadDataHandle({
      id: this.props.navigation.state.params.id,
      langId: this.props.langId,
    });
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
      dateCreate,
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
          borderRadius: 16,
          padding: 10,
          backgroundColor: "#ffffff",
          //   shadowColor: "rgba(0, 0, 0, 0.08)",
          //   elevation: 2,
          //   shadowOffset: {
          //     width: 0,
          //     height: 4,
          //   },
          //   shadowRadius: 12,
          //   shadowOpacity: 1,
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <ImageProgress
            source={{ uri: `${avatarUrl || default_image}` }}
            circle={true}
            style={{
              height: 32,
              width: 32,
            }}
          />

          <View
            style={{
              justifyContent: "center",
              flex: 1,
              marginLeft: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {isCustomer ? null : (
                <View
                  style={{
                    marginRight: 5,
                    marginVertical: 5,
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
                  fontSize: responsive.h(15),
                  textAlign: "left",
                  flex: 0.8,
                  color: "#292929",
                }}
              >
                {userName}
              </Text>
              <View
                style={{
                  backgroundColor: "#fff5eb",
                  borderRadius: responsive.h(15),
                  height: responsive.h(30),
                  width: responsive.w(126),
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: fontsize.micro,
                    textAlign: "center",

                    color: converStatusToColorService(statusId),
                  }}
                >
                  {statusName}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: responsive.h(11),
                color: colors.gray1,
                fontFamily: "Inter-Regular",
                marginTop: responsive.h(5),
              }}
            >
              {moment(dateCreate).format("DD/MM/YYYY HH:mm")}
            </Text>
          </View>
        </View>
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
            fontSize: 13,
            textAlign: "left",
            color: "#3d3d3d",
            marginTop: 10,
          }}
        >
          {description}
        </Text>
      </View>
    );
  };
  renderActionSheetItem = ({ item }) => {
    const { moduleId, moduleName, moduleCode } = item;

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ showAction: false }, () => {
            switch (moduleCode) {
              //Hoàn thành
              case "hoan_thanh":
                return this.setState({
                  isShowModal: true,
                  moduleId,
                  statusId: 3,
                  title: Strings.detailRequest.complete,
                });
              //Tiếp nhận

              case "TN":
                return this.setState({
                  isShowModal: true,
                  moduleId,
                  statusId: 2,
                  title: Strings.detailRequest.inform,
                });
              //Giao việc cho nhân viên
              case "giao_viec":
              //Đổi Nhân Viên Thực Hiện
              case "doi_nhan_vien":
                return this.props.navigation.navigate(
                  "serviceExtensionDetailAssignEmployee",
                  { title: moduleName }
                );
              //Đổi Trạng Thái Yêu Cầu
              case "doi_trang_thai":
                return this.props.navigation.navigate(
                  "serviceExtensionDetailUpdateStatus"
                );

              default:
                break;
            }
          });
        }}
        style={{
          borderBottomColor: colors.grayBorder,
          borderBottomWidth: 0.5,
          borderTopColor: colors.grayBorder,
          borderTopWidth: 0.5,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            margin: 10,
            fontSize: responsive.h(16),
            color: "black",
            textAlign: "center",
            fontFamily: "Inter-Medium",
          }}
        >
          {moduleName}
        </Text>
      </TouchableOpacity>
    );
  };
  renderContent() {
    const { showAction } = this.state;
    const { error, data, initComponent } = this.props;
    if (initComponent) {
      return null;
    }
    if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error + " hoặc phiếu yêu cầu không còn tồn tại"}
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
      const { seviceBasic, historys, methodProcess } = this.props.data;
      const { content } = this.state;
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
        amount,
        totalPrice,
        residentName,
        residentPhone,
      } = seviceBasic;
      console.log("data", seviceBasic);
      return (
        <ScrollView style={{ borderTopRightRadius: 20 }}>
          <View style={{ flex: 1, borderTopRightRadius: 20 }}>
            {/* Thông tin nha cung cap */}
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                marginHorizontal: 10,
                paddingVertical: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  //paddingTop: 20,
                  backgroundColor: "#fff",
                  borderTopRightRadius: 20,
                  maxWidth: responsive.w(360),
                }}
              >
                <ImageProgress
                  // circle={true}
                  style={{
                    height: 51,
                    width: 51,
                    borderRadius: 51 / 2,
                    // marginTop: 8,
                  }}
                  source={{ uri: this.props.navigation.state.params.avatar }}
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    marginHorizontal: 10,
                    height: responsive.h(80),
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Bold",
                      fontSize: responsive.h(15),
                      fontWeight: "600",
                      textAlign: "left",
                      color: "#292929",
                    }}
                    // numberOfLines={1}
                    // lineBreakMode="tail"
                  >
                    {residentName}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.call(residentPhone);
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          marginVertical: 0,
                          fontFamily: "Inter-SemiBold",
                          fontSize: responsive.h(13),
                          fontWeight: "500",
                          textAlign: "left",
                          color: "#292929",
                          paddingVertical: 10,
                        }}
                      >
                        {residentPhone}
                      </Text>
                      {/* <View
                      style={{
                        borderRadius: 16,
                        backgroundColor: converStatusToColorService(statusId),
                        paddingHorizontal: 20,
                        alignItems: "center",
                        marginVertical: 5,
                        justifyContent: "center",
                        paddingVertical: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Inter-SemiBold",
                          fontSize: 15,
                          fontWeight: "600",
                          fontStyle: "normal",
                          letterSpacing: 0,
                          textAlign: "center",
                        }}
                      >
                        {converStatusToString(statusId)}
                      </Text>
                    </View> */}
                    </View>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      fontSize: responsive.h(14),
                      letterSpacing: 0,
                      textAlign: "left",
                      color: "#888888",
                    }}
                    numberOfLines={1}
                  >
                    {/* {employeeName} -  */}
                    {departmentName}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#fff5eb",
                  borderRadius: responsive.h(15),
                  justifyContent: "center",
                  height: responsive.h(30),
                  alignItems: "center",
                  width: responsive.w(126),
                  marginVertical: responsive.h(30),
                }}
              >
                <Text
                  style={{
                    margin: 5,
                    fontFamily: "Inter-Regular",
                    paddingHorizontal: 10,
                    fontSize: fontsize.micro,
                    color: converStatusToColorService(statusId),
                  }}
                >
                  {employeeName}
                </Text>
              </View>
            </View>

            {/* {description ? (
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 13,
                  textAlign: "left",
                  color: "#3d3d3d",
                  marginHorizontal: 20,
                  marginTop: 15,
                }}
              >
                {description}
              </Text>
            ) : null}
            Nội dung */}
            <View
              style={{
                borderRadius: 16,
                backgroundColor: "#ffffff",
                // shadowColor: "rgba(0, 0, 0, 0.1)",
                // elevation: 2,
                // shadowOffset: {
                //   width: 0,
                //   height: 4,
                // },
                // shadowRadius: 10,
                // shadowOpacity: 1,
                margin: 10,
                paddingVertical: responsive.h(20),
                paddingHorizontal: responsive.w(15),
                borderWidth: 0.5,
                borderColor: "#d2d2d2",
                borderBottomWidth: 2,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <ImageProgress
                  style={{
                    height: responsive.h(86),
                    width: responsive.w(86),
                  }}
                  source={{ uri: logo }}
                />
                <View
                  style={{
                    justifyContent: "center",
                    marginHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-SemiBold",
                      fontSize: responsive.h(18),
                      fontWeight: "600",
                      textAlign: "left",
                      color: "#292929",
                    }}
                  >
                    {this.props.data && this.props.data.seviceBasic.serviceName}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                  marginTop: 15,
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textTitle}>
                  {Strings.serviceExtension.amount}
                </Text>
                <Text style={{ ...styles.textInfo, marginLeft: 5 }}>
                  {amount}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textTitle}>
                  {Strings.serviceExtension.dateCreate}
                </Text>
                <Text style={{ ...styles.textInfo }}>
                  {moment(dateCreate).format("DD/MM/YYYY")} vào lúc{" "}
                  {moment(dateCreate).format("HH:mm")}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textTitle}>
                  {Strings.serviceExtension.dateBook}
                </Text>
                <Text style={{ ...styles.textInfo }}>
                  {moment(dateBook).format("DD/MM/YYYY")}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textTitle}>
                  {Strings.serviceExtension.price}
                </Text>
                <Text
                  style={{
                    ...styles.textInfo,
                    color: "#ff624d",
                  }}
                >
                  {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  <Text
                    style={{
                      fontFamily: "Inter",
                      fontSize: responsive.h(11),
                      textAlign: "right",
                      color: "#292929",
                    }}
                  >
                    VNĐ
                  </Text>
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textTitle}>
                  {Strings.serviceExtension.totalPrice}
                </Text>
                <Text
                  style={{
                    ...styles.textInfo,
                    color: "#ff624d",
                    marginLeft: 5,
                  }}
                >
                  {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  <Text
                    style={{
                      fontFamily: "Inter",
                      fontSize: responsive.h(11),
                      textAlign: "right",
                      color: "#292929",
                    }}
                  >
                    VNĐ
                  </Text>
                </Text>
              </View>
            </View>
            {/* Chat */}
            <View>
              <FlatList
                data={historys || []}
                keyExtractor={(item, index) => `${index}`}
                renderItem={(item) => this.renderItemChat(item)}
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
                {/* <LinearGradient
                  colors={[colors.appTheme, "#fff"]}
                  style={styles.linearGradient}
                >
                  <View
                    style={{
                      borderRadius: 16,
                    }}
                  >
                    <View
                      style={{
                        padding: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "Inter-SemiBold",
                          fontSize: 18,
                          fontWeight: "600",
                          fontStyle: "normal",
                          letterSpacing: 0,
                          textAlign: "center",
                        }}
                      >
                        {this.state.title}
                      </Text>
                    </View>

                    <View>
                      <TextInput
                        autoFocus
                        autoCorrect={false}
                        style={{
                          backgroundColor: "#fff",
                          height: 100,
                          borderRadius: 8,
                          borderWidth: 1,
                          margin: 10,
                          marginLeft: 10,
                          borderColor: colors.grayBorder,
                          textAlignVertical: "top",
                          fontFamily: "Inter-Regular",
                          fontSize: 14,
                        }}
                        underlineColorAndroid="transparent"
                        multiline={true}
                        placeholder={Strings.app.description}
                        onChangeText={(content) => this.setState({ content })}
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 20,
                        alignSelf: "center",
                        marginBottom: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => this.setState({ isShowModal: false })}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 25,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#ffffff",
                          borderStyle: "solid",
                          borderWidth: 1,
                          borderColor: colors.appTheme,
                        }}
                      >
                        <MyIcon name="x" size={30} color={colors.appTheme} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          marginLeft: 50,
                          height: 50,
                          width: 50,
                          borderRadius: 25,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: colors.appTheme,
                        }}
                        onPress={() =>
                          this.setState({ isShowModal: false }, () => {
                            this.props.updateRequestHandle({
                              bookingId: id,
                              statusId: this.state.statusId,
                              description: content,
                              towerName: this.props.user.towerName,
                              employeeName: this.props.user.fullName,
                              serviceName,
                            });
                          })
                        }
                      >
                        <MyIcon name="check" size={30} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient> */}
                <LinearGradient
                  colors={["#fff", "#cecece"]}
                  style={styles.linearGradient}
                >
                  <View
                    style={{
                      borderRadius: 16,
                    }}
                  >
                    <View
                      style={{
                        padding: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.appTheme,
                        borderTopRightRadius: 16,
                        borderTopLeftRadius: 16,
                        height: responsive.h(55),
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "Inter-SemiBold",
                          fontSize: 16,
                          fontWeight: "600",
                          fontStyle: "normal",
                          letterSpacing: 0,
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}
                      >
                        {this.state.title}
                      </Text>
                    </View>
                    <View>
                      <TextInput
                        autoFocus
                        autoCorrect={false}
                        style={{
                          backgroundColor: "#fff",
                          height: 100,
                          borderRadius: 8,
                          borderWidth: 1,
                          padding: 10,
                          margin: 20,
                          borderColor: colors.grayBorder,
                          textAlignVertical: "top",
                          fontFamily: "Inter-Regular",
                          fontSize: 14,
                        }}
                        underlineColorAndroid="transparent"
                        multiline={true}
                        placeholder={Strings.app.description}
                        onChangeText={(content) => this.setState({ content })}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 20,
                        alignSelf: "center",
                        marginBottom: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => this.setState({ isShowModal: false })}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 25,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#ffffff",
                          borderStyle: "solid",
                          borderWidth: 1,
                          borderColor: colors.gray1,
                        }}
                      >
                        <MyIcon name="x" size={30} color={colors.gray1} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          marginLeft: 50,
                          height: 50,
                          width: 50,
                          borderRadius: 25,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: colors.appTheme,
                        }}
                        onPress={() =>
                          this.setState({ isShowModal: false }, () => {
                            this.props.updateRequestHandle({
                              bookingId: id,
                              statusId: this.state.statusId,
                              description: content,
                              towerName: this.props.user.towerName,
                              employeeName: this.props.user.fullName,
                              serviceName,
                            });
                          })
                        }
                      >
                        <MyIcon name="check" size={30} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
              </KeyboardAvoidingView>
            </Modal>
            <Spinner
              visible={this.props.isLoadingReponse}
              textContent={Strings.app.progressing}
              textStyle={{ color: "#FFF", fontSize: fontsize.small }}
            />

            <ActionSheet
              visible={showAction}
              data={methodProcess}
              renderItem={this.renderActionSheetItem}
              closeAction={() => this.setState({ showAction: false })}
            />
          </View>
        </ScrollView>
      );
    }
  }

  call(phone) {
    Linking.canOpenURL(`tel: ${phone}`)
      .then((supported) => {
        if (!supported) {
          this.refs.toast.show(
            `Số điện thoại không đúng!Vui lòng kiểm tra lại.`,
            DURATION.LENGTH_LONG
          );
        } else {
          return Linking.openURL(`tel:${phone}`);
        }
      })
      .catch((error) => {
        this.refs.toast.show(
          `Xảy ra lỗi! Vui lòng thử lại.`,
          DURATION.LENGTH_LONG
        );
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ padding: 10 }}
            >
              <MyIcon name="arrow" color="black" size={22} />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 20,
                textAlign: "center",
                color: "black",
              }}
            >
              {this.props.data && this.props.data.seviceBasic.serviceName}
            </Text>
          }
          rightView={
            this.props.data &&
            this.props.data.methodProcess && (
              <TouchableOpacity
                onPress={() => this.setState({ showAction: true })}
                style={{ padding: 10 }}
              >
                <MyIcon name="more-vertical" size={25} color="black" />
              </TouchableOpacity>
            )
          }
        />
        {this.renderContent()}

        <Spinner
          visible={this.props.isLoading}
          textContent={Strings.app.loading}
          textStyle={{ color: "#FFF", fontSize: fontsize.small }}
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
    borderRadius: 16,
    width: "90%",
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
    textAlign: "right",
    color: "#3d3d3d",
  },
  textInfo: {
    fontFamily: "Inter-SemiBold",
    fontSize: responsive.h(15),
    fontWeight: "600",
    textAlign: "right",
    color: "#282828",
  },
});
const mapStateToProps = (state) => ({
  user: state.auth.user,
  initComponent: state.servicesExtensionDetail.initComponent,
  data: state.servicesExtensionDetail.data,
  isLoading: state.servicesExtensionDetail.isLoading,
  errorResponse: state.servicesExtensionDetail.errorResponse,
  errorProgress: state.servicesExtensionDetail.errorProgress,
  error: state.servicesExtensionDetail.error,
  langId: state.app.language == "vi" ? 1 : 2,
});

const mapActionToProps = {
  loadDataHandle,
  resetStateByKey,
  updateRequestHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(ServiceExtensionDetailScreen);
