//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  Image,
  Modal,
  FlatList,
  Keyboard,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as mineTypes from "react-native-mime-types";
import DateTimePicker from "react-native-modal-datetime-picker";
import { connect } from "react-redux";
import ImagePicker from "react-native-image-picker";
import Lightbox from "react-native-lightbox";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import _ from "lodash";
import Toast, { DURATION } from "react-native-easy-toast";
import ModalPicker from "../../../components/common/ModalPicker";
import colors from "../../../theme/colors";
import { MyIcon } from "../../../theme/icons";
import { titleStyle } from "../../../theme/styles";
import Lookup from "../../../components/Request/RequestCreate/Lookup";
import Strings from "../../../utils/languages";
import ImageProgress from "../../../components/common/ImageProgress";
import IconButton from "../../../components/common/IconButton";
import fontsize from "../../../theme/fontsize";
import fontSize from "../../../theme/fontsize";
import axios from "axios";
import { get, helper, post } from "../../../services/helper";
import ErrorContent from "../../../components/common/ErrorContent";
import { Screen } from "../../../utils/device";
const Devices = require("react-native-device-detection");
import Button from "../../../components/common/Button";

import NavBar from "../../../resident/components/common/NavBar";
//
import {
  loadDataHandle,
  resetStateByKey,
  createHandle,
} from "../../../actions/waterDetail";
import { refreshDataHandle as refreshDataHandleListElectric } from "../../../actions/water";
// create a component
class CreateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemfromList: props.navigation.state.params.data,
      title: "",
      content: "",

      waterRequest:
        props.navigation.state.params.data.indexId > 0
          ? {
              id: props.navigation.state.params.data.id,
              indexId: props.navigation.state.params.data.indexId,
              code2: props.navigation.state.params.data.code2,
              indexOld: props.navigation.state.params.data.indexOld,
              indexNew: props.navigation.state.params.data.indexNew,
              indexUse: props.navigation.state.params.data.indexUse,
              peoplePromotion:
                props.navigation.state.params.data.peoplePromotion,
              m3PerPeople: props.navigation.state.params.data.m3PerPeople,
              rateFeeEnviroment:
                props.navigation.state.params.data.rateFeeEnviroment,
              rateFeeVAT: props.navigation.state.params.data.rateFeeVAT,
              amount: props.navigation.state.params.data.amount,
              dateFrom: props.navigation.state.params.data.dateFrom,
              dateTo: props.navigation.state.params.data.dateTo,
              dateNotify: props.navigation.state.params.data.dateNotify,
              datePayment: props.navigation.state.params.data.datePayment,
              dateCreate: props.navigation.state.params.data.dateCreate,
              description: props.navigation.state.params.data.description,
              linkUrl:
                !props.navigation.state.params.data.linkUrl ||
                props.navigation.state.params.data.linkUrl == null
                  ? ""
                  : props.navigation.state.params.data.linkUrl,
            }
          : {
              id: props.navigation.state.params.data.id,
              indexId: 0,
              code2: props.navigation.state.params.data.code2,
              //indexOld: '',
              indexOld: props.navigation.state.params.data.indexOld,
              indexNew: "",
              indexUse: "",
              peoplePromotion: "",
              m3PerPeople: "",
              rateFeeEnviroment:
                props.navigation.state.params.data.rateFeeEnviroment,
              rateFeeVAT: props.navigation.state.params.data.rateFeeVAT,
              amount: 0,
              dateFrom: props.navigation.state.params.data.dateFrom,
              dateTo: props.navigation.state.params.data.dateTo,
              dateNotify: props.navigation.state.params.data.dateNotify,
              datePayment: props.navigation.state.params.data.datePayment,
              dateCreate: "",
              description: "",
              linkUrl: "",
            },
      images: [],
      imagesInformation: [],
      isStartDate: true,
      isShowPopupCustomDate: false,
      isShowPopupCustomDateThanhToan: false,
      isShowPopupCustomDateThongBao: false,
    };
  }

  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state", path: "", value: null });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.error && nextProps.error !== this.props.error) {
      if (nextProps.error.status === 200) {
        this.props.navigation.goBack();
      }
    }

    if (
      nextProps.processError &&
      nextProps.processError !== this.props.processError
    ) {
      if (nextProps.processError.status === 200) {
        //this.refs.toast.show("Dữ liệu đã được cập nhật", DURATION.LENGTH_LONG);
        setTimeout(() => {
          this.props.navigation.goBack();
        }, 0);
      } else {
        if (nextProps.processError.hasError) {
          this.refs.toast.show(
            nextProps.processError.statusText,
            DURATION.LENGTH_LONG
          );
        }
      }
    }
  }
  componentDidMount() {
    const { id, indexId } = this.state.itemfromList;
    setTimeout(() => {
      this.props.loadDataHandle({ id, indexId });
    }, 10);
  }
  renderImage() {
    return (
      <View style={{ marginTop: 10 }}>
        {this.state.waterRequest.linkUrl != "" ? (
          <View>
            <Text style={styles.textTitle}>Hình nhân viên up</Text>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.grayBorder,
                  borderRadius: 5,
                  padding: 5,
                  marginRight: 10,
                  marginTop: 10,
                }}
              >
                <MyIcon
                  onPress={() => this._onAttachment()}
                  name="camera"
                  size={40}
                  color="#a8acaf"
                />
                <View
                  style={{
                    borderRadius: 2,
                    backgroundColor: "#abafb2",
                    padding: 3,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontSize: 8,
                      fontWeight: "normal",
                      fontStyle: "normal",
                      letterSpacing: 0,
                      textAlign: "left",
                      color: "#ffffff",
                    }}
                  >
                    Nhấn vào để tải ảnh
                  </Text>
                </View>
              </View>
              {/* <ImageProgress
                                source={ {uri: this.state.waterRequest.linkUrl} }
                                style={{
                                    width: 90, height: 120, zIndex: 0,marginTop: 10,justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingVertical: 20
                                }}
                            /> */}
              <Lightbox
                style={{
                  marginTop: 10,
                  marginRight: 10,
                  borderRadius: 5,
                  backgroundColor: "#eeeeee",
                }}
                activeProps={{
                  style: styles.imageActive,
                }}
                {...this.props.lightboxProps}
              >
                <Image
                  source={{ uri: this.state.waterRequest.linkUrl }}
                  style={{ width: 90, height: 120, zIndex: 0, borderRadius: 8 }}
                />
              </Lightbox>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => this._onAttachment()}
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
              borderRadius: 8,
              backgroundColor: "#eaeaea",
            }}
          >
            <MyIcon name="camera" size={40} color="#a8acaf" />
            <View
              style={{
                borderRadius: 2,
                backgroundColor: "#abafb2",
                padding: 3,
              }}
            >
              <Text
                style={{
                  fontFamily: "OpenSans-Regular",
                  fontSize: 8,
                  fontWeight: "normal",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#ffffff",
                }}
              >
                Nhấn vào để tải ảnh
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
  renderContent() {
    const { error, towerId, data, isLoading } = this.props;
    const { showAction } = this.state;

    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator animating size="small" />
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

    if (data) {
      const {
        code2,
        indexOld,
        indexNew,
        indexUse,
        peoplePromotion,
        m3PerPeople,
        rateFeeEnviroment,
        rateFeeVAT,
        dateCreate,
        dateFrom,
        dateNotify,
        dateTo,
        amount,
        description,
        datePayment,
      } = this.state.waterRequest;

      const { indexId } = data;
      return (
        <KeyboardAwareScrollView
          style={{
            borderTopRightRadius: 20,
            marginTop: 5,
            marginHorizontal: 10,
          }}
        >
          <View style={styles.container}>
            <View
              style={{
                flex: 1,
                borderRadius: 12,
                backgroundColor: "#ffffff",
                shadowColor: "rgba(0, 0, 0, 0.08)",
                elevation: 2,
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowRadius: 12,
                shadowOpacity: 1,
                margin: 10,
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: 18,
                  fontWeight: "600",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "center",
                  color: colors.appTheme,
                }}
              >
                {code2}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 20,
                }}
              >
                <Text style={styles.textTitle}>Chỉ số mới (*)</Text>
                <TextInput
                  maxLength={50}
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignContent: "flex-end",
                    alignSelf: "flex-end",
                    textAlign: "right",
                    fontSize: fontsize.small,
                    color: "#f53b3b",
                    fontFamily: "Inter-SemiBold",
                    marginLeft: 20,
                  }}
                  keyboardType="numeric"
                  placeholder="Nhập chỉ số mới..."
                  placeholderTextColor="#a0a0a0"
                  value={indexNew.toString()}
                  underlineColorAndroid="transparent"
                  onChangeText={(indexNew) => {
                    this.setState({
                      waterRequest: { ...this.state.waterRequest, indexNew },
                    });
                  }}
                />
              </View>
              <Text style={styles.textTitle}>Hình ảnh chỉ số</Text>
              {this.state.images.length > 0 ? (
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {this.state.images.length < 5 && (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.grayBorder,
                        borderRadius: 8,
                        padding: 5,
                        marginRight: 10,
                        marginTop: 10,
                      }}
                    >
                      <MyIcon
                        onPress={() => this._onAttachment()}
                        name="camera"
                        size={40}
                        color="#a8acaf"
                      />
                      <View
                        style={{
                          borderRadius: 2,
                          backgroundColor: "#abafb2",
                          padding: 3,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "OpenSans-Regular",
                            fontSize: 8,
                            fontWeight: "normal",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "left",
                            color: "#ffffff",
                          }}
                        >
                          Nhấn vào để tải ảnh
                        </Text>
                      </View>
                    </View>
                  )}

                  {this.state.images.map((eachImage, y) => {
                    return (
                      <View
                        key={y}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Lightbox
                          style={{
                            marginTop: 10,
                            marginRight: 10,
                            borderRadius: 5,
                            backgroundColor: "#eeeeee",
                          }}
                          activeProps={{
                            style: styles.imageActive,
                          }}
                          {...this.props.lightboxProps}
                        >
                          <Image
                            source={{ uri: eachImage.uri }}
                            style={{
                              width: 90,
                              height: 120,
                              zIndex: 0,
                              borderRadius: 8,
                            }}
                          />
                        </Lightbox>

                        <TouchableOpacity
                          onPress={() => {
                            this._deleteImage(eachImage);
                          }}
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            borderRadius: 15,
                            marginTop: 0,
                            backgroundColor: "#505c5c5c",
                            zIndex: 1,
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ padding: 5, color: "#fff" }}> X </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              ) : (
                this.renderImage()
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 20,
                }}
              >
                <Text style={styles.textTitle}>Số người ưu đãi</Text>
                <TextInput
                  maxLength={50}
                  style={{
                    flex: 1,
                    marginLeft: 20,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    justifyContent: "flex-end",
                    alignContent: "flex-end",
                    alignSelf: "flex-end",
                    textAlign: "right",
                    fontSize: fontsize.small,
                    color: "#282828",
                    fontFamily: "Inter-SemiBold",
                  }}
                  keyboardType="numeric"
                  placeholder="Nhập số người..."
                  placeholderTextColor="#a0a0a0"
                  value={peoplePromotion.toString()}
                  //value={indexId > 0 ? peoplePromotion.toString() : this.props.data.peoplePromotion.toString()}
                  underlineColorAndroid="transparent"
                  onChangeText={(peoplePromotion) => {
                    this.setState({
                      waterRequest: {
                        ...this.state.waterRequest,
                        peoplePromotion,
                      },
                    });
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 20,
                }}
              >
                <Text style={styles.textTitle}>Số M3/người</Text>
                <TextInput
                  maxLength={50}
                  style={{
                    flex: 1,
                    marginLeft: 20,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    justifyContent: "flex-end",
                    alignContent: "flex-end",
                    alignSelf: "flex-end",
                    textAlign: "right",
                    fontSize: fontsize.small,
                    color: "#282828",
                    fontFamily: "Inter-SemiBold",
                  }}
                  keyboardType="numeric"
                  placeholder="Nhập số m3/ người..."
                  placeholderTextColor="#a0a0a0"
                  value={m3PerPeople.toString()}
                  //value={indexId > 0 ? m3PerPeople.toString() : this.props.data.m3PerPeople.toString()}
                  underlineColorAndroid="transparent"
                  onChangeText={(m3PerPeople) => {
                    this.setState({
                      waterRequest: { ...this.state.waterRequest, m3PerPeople },
                    });
                  }}
                />
                <Text
                  style={{
                    justifyContent: "flex-end",
                    marginLeft: 5,
                    fontSize: fontsize.small,
                    color: "#282828",
                    fontFamily: "Inter-SemiBold",
                  }}
                >
                  m
                </Text>
                <Text
                  style={{
                    justifyContent: "flex-end",
                    marginTop: -5,
                    fontSize: fontsize.small,
                    color: "#282828",
                    fontFamily: "Inter-SemiBold",
                  }}
                >
                  3
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 20,
                }}
              >
                <Text style={styles.textTitle}>Tỷ lệ phí BVMT</Text>
                <TextInput
                  maxLength={50}
                  style={{
                    flex: 1,
                    marginLeft: 20,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    justifyContent: "flex-end",
                    alignContent: "flex-end",
                    alignSelf: "flex-end",
                    textAlign: "right",
                    fontSize: fontsize.small,
                    color: "#282828",
                    fontFamily: "Inter-SemiBold",
                  }}
                  keyboardType="numeric"
                  placeholder="Nhập tỷ lệ phí BVMT..."
                  placeholderTextColor="#a0a0a0"
                  value={(rateFeeEnviroment * 100).toString()}
                  //value={indexId > 0 ? rateFeeEnviroment.toString() : this.props.data.rateFeeEnviroment.toString()}
                  underlineColorAndroid="transparent"
                  onChangeText={(rateFeeEnviroment) => {
                    this.setState({
                      waterRequest: {
                        ...this.state.waterRequest,
                        rateFeeEnviroment: Number(rateFeeEnviroment) / 100,
                      },
                    });
                  }}
                />
                <Text
                  style={{
                    justifyContent: "flex-end",
                    marginLeft: 5,
                    fontSize: fontsize.small,
                    fontFamily: "Inter-SemiBold",
                    color: "#282828",
                  }}
                >
                  %
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 20,
                }}
              >
                <Text style={styles.textTitle}>Tỷ lệ VAT</Text>
                <TextInput
                  maxLength={50}
                  style={{
                    flex: 1,
                    marginLeft: 20,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    justifyContent: "flex-end",
                    alignContent: "flex-end",
                    alignSelf: "flex-end",
                    textAlign: "right",
                    fontSize: fontsize.small,
                    color: "#282828",
                    fontFamily: "Inter-SemiBold",
                  }}
                  keyboardType="numeric"
                  placeholder="Nhập tỷ lệ VAT..."
                  placeholderTextColor="#a0a0a0"
                  value={(rateFeeVAT * 100).toString()}
                  //value={indexId > 0 ? rateFeeVAT.toString() : this.props.data.rateFeeVAT.toString()}
                  underlineColorAndroid="transparent"
                  onChangeText={(rateFeeVAT) => {
                    this.setState({
                      waterRequest: {
                        ...this.state.waterRequest,
                        rateFeeVAT: Number(rateFeeVAT) / 100,
                      },
                    });
                  }}
                />
                <Text
                  style={{
                    justifyContent: "flex-end",
                    marginLeft: 5,
                    fontSize: fontsize.small,
                    fontFamily: "Inter-SemiBold",
                    color: "#282828",
                  }}
                >
                  %
                </Text>
              </View>
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  paddingTop: 20,
                }}
              >
                <Text style={styles.textTitle}>Ghi chú</Text>
                <TextInput
                  maxLength={500}
                  underline={false}
                  multiline
                  underlineColorAndroid="transparent"
                  style={{
                    width: Screen.width - 60,
                    height: 100,
                    marginTop: 10,
                    padding: 5,
                    textAlignVertical: Platform.OS === "ios" ? "auto" : "top",
                    alignContent: "flex-start",
                    alignSelf: "auto",
                    fontSize: fontsize.small,
                    fontFamily: "Inter-Medium",
                    borderWidth: 1,
                    borderColor: "#a0a0a0",
                    borderRadius: 4,
                  }}
                  placeholder="Nhập ghi chú..."
                  placeholderTextColor="#a0a0a0"
                  value={description}
                  onChangeText={(description) => {
                    this.setState({
                      waterRequest: { ...this.state.waterRequest, description },
                    });
                  }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#c8c8c8",
                marginHorizontal: 20,
              }}
            >
              <Text style={styles.textTitle}>Chỉ số cũ</Text>
              <Text
                style={{
                  justifyContent: "flex-end",
                  fontSize: fontsize.small,
                  fontFamily: "Inter-SemiBold",
                  fontWeight: "600",
                  color: "#f53b3b",
                }}
              >
                {indexOld}
              </Text>
              {/* <Text style={{ justifyContent: 'flex-end', fontSize: fontsize.larg }}>{  indexId > 0 ? indexOld : this.props.data.indexNew }</Text> */}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#c8c8c8",
                marginHorizontal: 20,
              }}
            >
              <Text style={styles.textTitle}>Số tiêu thụ</Text>
              {/* <Text style={{ justifyContent: 'flex-end', fontSize: fontsize.larg }}>{ Number(indexNew) > 0 ? (indexNew - (indexId > 0 ? indexOld : this.props.data.indexNew)) : '' }</Text> */}
              <Text
                style={{
                  justifyContent: "flex-end",
                  fontSize: fontsize.small,
                  fontFamily: "Inter-SemiBold",
                  fontWeight: "600",
                  color: "#f53b3b",
                }}
              >
                {Number(indexNew) > 0 ? indexNew - indexOld : ""}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => this.setState({ isShowPopupCustomDate: true })}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#c8c8c8",
                marginHorizontal: 20,
              }}
            >
              <Text style={styles.textTitle}>Kỳ thanh toán</Text>
              <Text
                style={{
                  justifyContent: "flex-end",
                  fontSize: fontsize.small,
                  fontFamily: "Inter-Medium",
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#a0a0a0",
                }}
              >
                {dateFrom === null ? "" : moment(dateFrom).format("DD/MM/YYYY")}{" "}
                - {dateTo === null ? "" : moment(dateTo).format("DD/MM/YYYY")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.setState({ isShowPopupCustomDateThanhToan: true })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#c8c8c8",
                marginHorizontal: 20,
              }}
            >
              <Text style={styles.textTitle}>Ngày thanh toán</Text>
              <Text
                style={{
                  justifyContent: "flex-end",
                  fontSize: fontsize.small,
                  fontFamily: "Inter-Medium",
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#a0a0a0",
                }}
              >
                {datePayment === null
                  ? ""
                  : moment(datePayment).format("DD/MM/YYYY")}
              </Text>
            </TouchableOpacity>
            {indexId > 0 && (
              <TouchableOpacity
                onPress={() =>
                  this.setState({ isShowPopupCustomDateThongBao: true })
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#c8c8c8",
                  marginHorizontal: 20,
                }}
              >
                <Text style={styles.textTitle}>Ngày thông báo</Text>
                <Text
                  style={{
                    justifyContent: "flex-end",
                    fontSize: fontsize.small,
                    fontFamily: "Inter-Medium",
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#a0a0a0",
                  }}
                >
                  {dateNotify === null
                    ? ""
                    : moment(dateNotify).format("DD/MM/YYYY")}
                </Text>
              </TouchableOpacity>
            )}

            {indexId > 0 ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 15,
                  marginHorizontal: 20,
                }}
              >
                <Text style={styles.textTitle}>Tổng tiền</Text>
                <Text
                  style={{
                    justifyContent: "flex-end",
                    fontSize: fontsize.small,
                    fontFamily: "Inter-SemiBold",
                    fontWeight: "600",
                    color: "#f53b3b",
                  }}
                >
                  {amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      fontSize: 11,
                      textAlign: "right",
                      color: "#6f6f6f",
                    }}
                  >
                    VNĐ
                  </Text>
                </Text>
              </View>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <NavBar
          leftButton={
            <TouchableOpacity
              style={{ paddingVertical: 10 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <MyIcon name="arrow" size={20} color="black" />
            </TouchableOpacity>
          }
          rightView={
            <TouchableOpacity
              onPress={this._onSend}
              style={{
                padding: 10,
              }}
            >
              <MyIcon name="paperplane" color="black" size={24} />
            </TouchableOpacity>
          }
          body={<Text style={titleStyle}>Ghi chỉ số</Text>}
          // rightView={<IconButton materialIcon="send" color="#fff" size={24}
          //     onPress={this._onSend}
          // />}
        />

        {this.renderContent()}

        <Toast
          ref="toast"
          style={{
            backgroundColor: colors.toast.warning,
            opacity: 1,
            borderRadius: 5,
            padding: 10,
          }}
        />

        {/* <TouchableOpacity
                    onPress={this._onSend}
                    style={{
                        backgroundColor: colors.appTheme,
                        width: 50,
                        height: 50,
                        borderRadius: 35,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: 20,
                        right: 20
                    }}>
                    <MyIcon
                        name="paperplane"
                        color="#fff"
                        size={30}
                    />
                </TouchableOpacity> */}
        <Modal
          transparent={true}
          visible={this.state.isShowPopupCustomDate}
          onRequestClose={() => null}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: colors.appOverView,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginHorizontal: 15,
                borderRadius: 5,
                flexDirection: "column",
                width: Devices.isTablet ? "50%" : "90%",
              }}
            >
              <View style={{ padding: 12, paddingVertical: 15, height: 160 }}>
                <Text style={{ textAlign: "center", fontSize: 17 }}>
                  TÙY CHỈNH THỜI GIAN
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 0,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {/* <Image source={Icons.calendar} style={{ height: 30, width: 30, marginRight: 5 }} /> */}
                    <TouchableOpacity
                      onPress={() => this._showDateTimePicker(true)}
                      bordered
                      dark
                      style={{
                        borderRadius: 0,
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 5,
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{ fontSize: fontSize.medium, color: "#111" }}
                      >
                        {moment(this.state.waterRequest.dateFrom).format(
                          "DD-MM-YYYY"
                        )}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this._showDateTimePicker(false)}
                      bordered
                      dark
                      style={{
                        borderRadius: 0,
                        flex: 1,
                        padding: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{ fontSize: fontSize.medium, color: "#111" }}
                      >
                        {moment(this.state.waterRequest.dateTo).format(
                          "DD-MM-YYYY"
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* <View><Text style={{margin:5,flex:0.3}}>-</Text></View> */}
                </View>
                <View style={{ padding: 5 }}>
                  <Button
                    text="OK"
                    style={{ padding: 10 }}
                    onPress={this.customTime}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={() => this.setState({ isShowPopupCustomDate: false })}
                style={{
                  borderColor: colors.grayBorder,
                  borderTopWidth: 1,
                  paddingVertical: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "red" }}>ĐÓNG</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={(date) => this._handleDatePicked(date)}
              onCancel={this._hideDateTimePicker}
              mode="date"
              //date={new Date('01/09/2021')}
              date={
                this.state.isStartDate
                  ? new Date(this.state.waterRequest.dateFrom)
                  : new Date(this.state.waterRequest.dateTo)
              }
            />
          </View>
        </Modal>
        <DateTimePicker
          isVisible={this.state.isShowPopupCustomDateThanhToan}
          onConfirm={(date) => this._handleDatePickedThanhToan(date)}
          onCancel={this._hideDateTimePicker}
          mode="date"
          //date={new Date('01/09/2021')}
          date={new Date(this.state.waterRequest.datePayment)}
        />
        <DateTimePicker
          isVisible={this.state.isShowPopupCustomDateThongBao}
          onConfirm={(date) => this._handleDatePickedThongBao(date)}
          onCancel={this._hideDateTimePicker}
          mode="date"
          //date={new Date('01/09/2021')}
          date={new Date(this.state.waterRequest.dateNotify)}
        />
      </View>
    );
  }
  _showDateTimePicker(type) {
    this.setState({ isDateTimePickerVisible: true, isStartDate: type });
  }
  _hideDateTimePicker = () =>
    this.setState({
      isDateTimePickerVisible: false,
      isShowPopupCustomDateThanhToan: false,
      isShowPopupCustomDateThongBao: false,
    });

  _handleDatePicked = (date) => {
    if (this.state.isStartDate) {
      this.setState({
        waterRequest: {
          ...this.state.waterRequest,
          dateFrom: moment(date).format("YYYY-MM-DD"),
        },
      });
    } else {
      this.setState({
        waterRequest: {
          ...this.state.waterRequest,
          dateTo: moment(date).format("YYYY-MM-DD"),
        },
      });
    }
    this._hideDateTimePicker();
  };
  _handleDatePickedThanhToan = (date) => {
    this.setState({
      waterRequest: {
        ...this.state.waterRequest,
        datePayment: moment(date).format("YYYY-MM-DD"),
      },
    });
    this._hideDateTimePicker();
  };
  _handleDatePickedThongBao = (date) => {
    this.setState({
      waterRequest: {
        ...this.state.waterRequest,
        dateNotify: moment(date).format("YYYY-MM-DD"),
      },
    });
    this._hideDateTimePicker();
  };
  customTime = () => {
    this.setState({
      isShowPopupCustomDate: false,
    });
  };
  _onSend = async () => {
    const { waterRequest, content } = this.state;
    const {
      id,
      indexId,
      indexNew,
      indexOld,
      description,
      peoplePromotion,
      m3PerPeople,
      rateFeeEnviroment,
      rateFeeVAT,
      dateNotify,
      datePayment,
      dateFrom,
      dateTo,
    } = waterRequest;
    //let indexOldSub = indexId > 0 ? indexOld : this.props.data.indexNew
    let indexOldSub = indexOld;
    if (Number(indexNew) === NaN) {
      return this.refs.toast.show(
        `${Strings.message.pleaseType}` + " Chỉ số mới",
        DURATION.LENGTH_LONG
      );
    }

    // return this.props.createHandle({
    //     id,
    //     indexId,
    //     indexNew,
    //     indexOld: indexOldSub,
    //     month: this.props.month,
    //     year: this.props.year,
    //     description,
    //     peoplePromotion,
    //     m3PerPeople,
    //     rateFeeEnviroment,
    //     rateFeeVAT
    // })
    const ret = await post("/Water/CanhBao", {
      id,
      indexId,
      indexNew,
      indexOld: indexOldSub,
      month: this.props.month,
      year: this.props.year,
      description,
      peoplePromotion,
      m3PerPeople,
      rateFeeEnviroment,
      rateFeeVAT,
      imagesInformation: this.state.imagesInformation[0]
        ? this.state.imagesInformation[0]
        : {},
    });
    console.log(ret);
    if (ret !== undefined && ret !== null) {
      if (ret !== -1 && ret.status == 200) {
        if (ret.data.isChoPhep) {
          return this._onSubmit({
            id,
            indexId,
            indexNew,
            indexOld: indexOldSub,
            month: this.props.month,
            year: this.props.year,
            description,
            peoplePromotion,
            m3PerPeople,
            rateFeeEnviroment,
            rateFeeVAT,
            dateNotify,
            datePayment,
            dateFrom,
            dateTo,
            imagesInformation: this.state.imagesInformation[0]
              ? this.state.imagesInformation[0]
              : {},
          });
        } else {
          return Alert.alert(
            "",
            "Cảnh báo số liệu bất thường, bạn có muốn tiếp tục?",
            [
              {
                text: "Huỷ",
                onPress: () => {
                  return;
                },
                style: "cancel",
              },
              {
                text: "Tiếp tục",
                onPress: () => {
                  return this._onSubmit({
                    id,
                    indexId,
                    indexNew,
                    indexOld: indexOldSub,
                    month: this.props.month,
                    year: this.props.year,
                    description,
                    peoplePromotion,
                    m3PerPeople,
                    rateFeeEnviroment,
                    rateFeeVAT,
                    dateNotify,
                    datePayment,
                    dateFrom,
                    dateTo,
                    imagesInformation: this.state.imagesInformation[0]
                      ? this.state.imagesInformation[0]
                      : {},
                  });
                },
              },
            ],
            { cancelable: false }
          );
        }
      } else {
        return this._onSubmit({
          id,
          indexId,
          indexNew,
          indexOld: indexOldSub,
          month: this.props.month,
          year: this.props.year,
          description,
          peoplePromotion,
          m3PerPeople,
          rateFeeEnviroment,
          rateFeeVAT,
          dateNotify,
          datePayment,
          dateFrom,
          dateTo,
          imagesInformation: this.state.imagesInformation[0]
            ? this.state.imagesInformation[0]
            : {},
        });
      }
    } else {
      return this._onSubmit({
        id,
        indexId,
        indexNew,
        indexOld: indexOldSub,
        month: this.props.month,
        year: this.props.year,
        description,
        peoplePromotion,
        m3PerPeople,
        rateFeeEnviroment,
        rateFeeVAT,
        dateNotify,
        datePayment,
        dateFrom,
        dateTo,
        imagesInformation: this.state.imagesInformation[0]
          ? this.state.imagesInformation[0]
          : {},
      });
    }
  };
  async _onSubmit(data) {
    await this.props.createHandle(data);
    await this.props.refreshDataHandleListElectric();
  }
  _deleteImage(item) {
    // const array = this.state.images;
    // const index = array.indexOf(item);
    // array.splice(index, 1);
    // this.setState({ images: array });
    this.setState({ images: [], imagesInformation: [] });
  }

  _onAttachment = () => {
    const options = {
      quality: 1.0,
      maxWidth: 512,
      maxHeight: 512,
      storageOptions: {
        skipBackup: true,
      },
      title: Strings.createRequest.takeAPhoto,
      takePhotoButtonTitle: Strings.createRequest.chooseAnImage,
      chooseFromLibraryButtonTitle: Strings.createRequest.SelectFromGallery,
      cancelButtonTitle: Strings.createRequest.cancel,
      permissionDenied: {
        title: Strings.createRequest.access,
        text: Strings.createRequest.access2,
        reTryTitle: Strings.createRequest.retry,
        okTitle: Strings.createRequest.allow,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response showImagePicker = ', response);

      if (response.didCancel) {
        // console.log('User cancelled photo picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
      } else {
        const image = {
          data: response.data,
          uri: response.uri,
          type:
            Platform.OS === "ios"
              ? mineTypes.lookup(response.uri)
              : response.type,
          fileName: response.fileName,
        };

        this.setState({
          images: [image],
          imagesInformation: [{ mineType: image.type, bytes: image.data }],
          //images: [...this.state.images, image],
          //imagesInformation: [...this.state.imagesInformation, { mineType: image.type, bytes: image.data }]
        });
      }
    });
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    marginTop: -10,
  },
  imageActive: {
    flex: 1,
    resizeMode: "contain",
  },
  textTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#282828",
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  initList: state.waterDetail.initList,
  data: state.waterDetail.data,
  isLoading: state.waterDetail.isLoading,
  errorResponse: state.waterDetail.errorResponse,
  error: state.waterDetail.error,
  processError: state.waterDetail.processError,
  month: state.water.searchKey,
  year: state.water.searchKey2,
});

const mapActionToProps = {
  loadDataHandle,
  resetStateByKey,
  createHandle,
  refreshDataHandleListElectric,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(CreateScreen);
