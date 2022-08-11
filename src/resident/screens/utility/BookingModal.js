//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { connect } from "react-redux";
import { MyIcon } from "../../theme/icons";
import PrimaryButton from "../../components/common/PrimaryButton";
import colors from "../../theme/colors";
import Strings from "../../utils/languages";
import ImageProgress from "../../components/common/ImageProgress";
import fontsize from "../../theme/fontsize";

import { createBookingHandle } from "../../actions/utilitiesServicesDetail";

const TitleTextInput = ({
  editable = true,
  title,
  value,
  placeholder,
  onChangeText,
  onSubmitEditing,
}) => {
  return (
    <View style={{ marginBottom: responsive.h(5) }}>
      <Text
        style={{
          fontSize: responsive.h(14),
        }}
      >
        {title}
      </Text>
      <TextInput
        editable={editable}
        style={{ margin: responsive.h(10) }}
        value={value}
        placeholder={placeholder}
        onChangeText={(text) => onChangeText(text)}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};

// create a component
class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      apartment: props.user.spaceMainCode + " - " + props.user.towerName,
      fullName: props.user.fullName,
      phoneNumber: props.user.phoneNumber,
      time: moment(),
      isShowTime: false,
      message: "",
      amount: 1,
      price: 0,
    };
  }

  render() {
    const {
      showModal,
      apartment,
      fullName,
      phoneNumber,
      time,
      message,
      amount,
      totalPrice,
    } = this.state;
    const { title, visible, onClose, onSubmit, isProgress } = this.props;
    const { logo, price, unit, dateLimited } = this.props.data;

    return (
      <Modal visible={visible} transparent={true} onRequestClose={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.appOverView,
            padding: responsive.h(20),
            justifyContent: "center",
          }}
        >
          {isProgress ? (
            <ActivityIndicator />
          ) : (
            <View
              style={{
                backgroundColor: "#fff",
                height: "80%",
                borderRadius: responsive.h(16),
              }}
            >
              {/* Header */}
              <View
                style={{
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: responsive.h(16),
                }}
              >
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: responsive.h(15),
                    paddingVertical: responsive.h(5),
                    justifyContent: "center",
                    borderRadius: responsive.h(16),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-SemiBold",
                      fontSize: responsive.h(18),
                      fontWeight: "600",
                      fontStyle: "normal",
                      letterSpacing: 0,
                      textAlign: "center",
                      color: "#2e2e2e",
                    }}
                  >
                    {title}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={{ padding: responsive.h(15) }}
                >
                  <MyIcon name="no" size={responsive.h(18)} color="#6f6f6f" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{ flexDirection: "row", padding: responsive.h(10) }}
                >
                  <View
                    style={{
                      width: "50%",
                      paddingHorizontal: responsive.h(10),
                    }}
                  >
                    <ImageProgress
                      source={{ uri: logo }}
                      style={{
                        height: responsive.h(100),
                        width: "100%",
                        borderColor: colors.grayBorder,
                        borderRadius: responsive.h(12),
                        backgroundColor: colors.gray2,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      paddingLeft: responsive.h(15),
                      justifyContent: "space-between",
                      paddingVertical: responsive.h(10),
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        marginBottom: responsive.h(10),
                      }}
                    >
                      {price > 0 ? (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Inter-Medium",
                              fontSize: responsive.h(16),
                              fontWeight: "500",
                              fontStyle: "normal",
                              lineHeight: responsive.h(22),
                              letterSpacing: 0,
                              textAlign: "right",
                              color: "#ff624d",
                            }}
                          >
                            {(price * amount)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </Text>
                          <Text
                            style={{
                              fontFamily: "Inter-Medium",
                              fontSize: responsive.h(11),
                              fontWeight: "500",
                              fontStyle: "normal",
                              lineHeight: responsive.h(22),
                              letterSpacing: 0,
                              textAlign: "right",
                              color: "#6f6f6f",
                              marginLeft: responsive.h(5),
                            }}
                          >
                            VNĐ
                          </Text>
                        </View>
                      ) : (
                        <Text
                          style={{
                            fontFamily: "Inter-Medium",
                            fontSize: responsive.h(16),
                            fontWeight: "500",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "right",
                            color: "#ff624d",
                            paddingBottom: responsive.h(5),
                          }}
                        >
                          {Strings.serviceExtension.negotiable}
                        </Text>
                      )}

                      <Text>/ {unit}</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        borderRadius: responsive.h(12),
                        backgroundColor: "#f8fff2",
                        shadowColor: "rgba(0, 0, 0, 0.06)",
                        elevation: 2,
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
                        shadowRadius: 8,
                        shadowOpacity: 1,
                        elevation: 3,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this._onDownAmount();
                        }}
                      >
                        <View
                          style={{
                            width: responsive.w(50),
                            height: responsive.h(40),
                            alignItems: "center",
                            justifyContent: "center",
                            //paddingTop: 5,
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              fontFamily: "Inter-SemiBold",
                              fontSize: responsive.h(16),
                              color: "#fff200",
                            }}
                          >
                            -
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View
                        style={{
                          justifyContent: "center",
                          width: responsive.w(50),
                          height: responsive.h(40),
                          //paddingTop: 10,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontFamily: "Inter-SemiBold",
                            fontSize: responsive.h(16),
                            color: colors.appTheme,
                          }}
                        >
                          {this.state.amount}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          this._onUpAmount();
                        }}
                      >
                        <View
                          style={{
                            width: responsive.w(50),
                            height: responsive.h(40),
                            //paddingTop: 5,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              fontFamily: "Inter-SemiBold",
                              fontSize: responsive.h(16),
                              color: "#fff200",
                              alignItems: "center",
                            }}
                          >
                            +
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{ padding: responsive.h(20) }}>
                  {/* <TitleTextInput
                                    editable={false}
                                    value={apartment}
                                    title="Căn hộ"
                                    onChangeText={(apartment) => { this.setState({ apartment }) }}
                                />
                                <TitleTextInput
                                    editable={false}
                                    value={fullName}
                                    title="Người đặt"
                                    onChangeText={(fullName) => { this.setState({ fullName }) }}
                                />
                                <TitleTextInput
                                    editable={false}
                                    value={phoneNumber}
                                    title="Số điện thoại"
                                    onChangeText={(phoneNumber) => { this.setState({ phoneNumber }) }}
                                /> */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: responsive.h(10),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter",
                        fontSize: responsive.h(14),
                        fontWeight: "500",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: "#282828",
                      }}
                    >
                      {Strings.serviceExtension.totalPrice}
                    </Text>
                    {price > 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Inter-Medium",
                            fontSize: responsive.h(16),
                            fontWeight: "500",
                            fontStyle: "normal",
                            lineHeight: responsive.h(22),
                            letterSpacing: 0,
                            textAlign: "right",
                            color: "#ff624d",
                          }}
                        >
                          {(price * amount)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Inter-Medium",
                            fontSize: responsive.h(11),
                            fontWeight: "500",
                            fontStyle: "normal",
                            lineHeight: responsive.h(22),
                            letterSpacing: 0,
                            textAlign: "right",
                            color: "#6f6f6f",
                            marginLeft: responsive.h(5),
                          }}
                        >
                          VNĐ
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={{
                          fontFamily: "Inter-Medium",
                          fontSize: responsive.h(16),
                          fontWeight: "500",
                          fontStyle: "normal",
                          lineHeight: responsive.h(22),
                          letterSpacing: 0,
                          textAlign: "right",
                          color: "#ff624d",
                        }}
                      >
                        {Strings.serviceExtension.negotiable}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={() => this.setState({ isShowTime: true })}
                    style={{ marginBottom: responsive.w(5) }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: responsive.h(10),
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter",
                          fontSize: responsive.h(14),
                          fontWeight: "500",
                          fontStyle: "normal",
                          lineHeight: responsive.h(24),
                          letterSpacing: 0,
                          textAlign: "left",
                          color: "#282828",
                        }}
                      >
                        {Strings.serviceExtension.dateBook} (*)
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          borderRadius: responsive.h(8),
                          borderStyle: "solid",
                          borderWidth: 1,
                          borderColor: "#cbcbcb",
                          padding: responsive.h(10),
                        }}
                      >
                        {this.props.language == "en" ? (
                          <Text
                            style={{
                              fontFamily: "Inter-Regular",
                              marginRight: responsive.h(10),
                              fontSize: responsive.h(14),
                              fontWeight: "normal",
                              fontStyle: "normal",
                              letterSpacing: 0,
                              textAlign: "left",
                              color: "#282828",
                            }}
                          >
                            {moment(timek).format("MM/DD/YYYY HH:mm")}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontFamily: "Inter-Regular",
                              marginRight: responsive.h(10),
                              fontSize: responsive.h(14),
                              fontWeight: "normal",
                              fontStyle: "normal",
                              letterSpacing: 0,
                              textAlign: "left",
                              color: "#282828",
                            }}
                          >
                            {moment(time).format("DD/MM/YYYY HH:mm")}
                          </Text>
                        )}
                        <MyIcon
                          name="calendar"
                          size={responsive.h(20)}
                          color="rgba(0, 0, 0, 0.54)"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/* <TitleTextInput
                                    value={message}
                                    title="Lời nhắn"
                                    placeholder="Nhập lời nhắn"
                                    onChangeText={(message) => { this.setState({ message }) }}
                                /> */}
                  <View
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      paddingVertical: responsive.h(10),
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter",
                          fontSize: responsive.h(14),
                          fontWeight: "500",
                          fontStyle: "normal",
                          lineHeight: responsive.h(24),
                          letterSpacing: 0,
                          textAlign: "left",
                          color: "#282828",
                        }}
                      >
                        {Strings.serviceExtension.message}
                      </Text>
                      <Text style={{ color: "gray" }}>
                        {message.length}/ 500
                      </Text>
                    </View>

                    <TextInput
                      maxLength={500}
                      underline={false}
                      multiline
                      underlineColorAndroid="transparent"
                      style={{
                        marginTop: responsive.h(5),
                        width: "100%",
                        flex: 1,
                        height: responsive.h(100),
                        padding: responsive.h(10),
                        textAlignVertical:
                          Platform.OS === "ios" ? "auto" : "top",
                        alignContent: "flex-start",
                        alignSelf: "flex-start",
                        borderRadius: responsive.h(8),
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#cbcbcb",
                      }}
                      placeholder={Strings.serviceExtension.messagePlaceholder}
                      placeholderTextColor="#6b6b6b"
                      value={this.state.message}
                      onChangeText={(message) => {
                        this.setState({ message });
                      }}
                    />
                  </View>
                </View>
              </ScrollView>
              <PrimaryButton
                style={{
                  borderRadius: responsive.h(45),
                  margin: responsive.h(20),
                  width: responsive.w(150),
                  alignSelf: "center",
                }}
                text={Strings.serviceExtension.bookService}
                onPress={this._onSubmit}
              />
              <DateTimePicker
                cancelTextIOS={Strings.app.cancel}
                titleIOS={Strings.createRequest.at}
                confirmTextIOS={Strings.app.chose}
                minimumDate={new Date()}
                maximumDate={new Date(dateLimited)}
                mode="datetime"
                isVisible={this.state.isShowTime}
                onConfirm={(time) => {
                  this.setState({ isShowTime: false, time });
                }}
                onCancel={() => {
                  this.setState({ isShowTime: false });
                }}
              />
            </View>
          )}
        </View>
      </Modal>
    );
  }

  _onUpAmount() {
    this.setState({
      amount: this.state.amount + 1,
      totalPrice: (this.state.amount + 1) * this.state.price,
    });
  }

  _onDownAmount() {
    if (this.state.amount > 1)
      this.setState({
        amount: this.state.amount - 1,
        totalPrice: (this.state.amount - 1) * this.state.price,
      });
  }

  _onSubmit = () => {
    const { time, message, amount } = this.state;
    const { data, user, title, createBookingHandle } = this.props;
    const { departmentId, price, id } = data;
    const { spaceMainId, spaceMainCode, towerId, towerName } = user;

    createBookingHandle({
      apartmentId: spaceMainId,
      apartmentName: spaceMainCode,
      serviceId: id,
      serviceName: title,
      towerId: towerId,
      towerName,
      departmentId,
      description: message,
      price,
      amount,
      dateBook: moment(time).format("DD/MM/YYYY"),
      timeBook: moment(time).format("HH:mm"),
    });
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

//make this component available to the app
const mapStateToProps = (state) => ({
  user: state.auth.user,
  isProgress: state.utilitiesServicesDetail.isProgress,
});
const mapActionToProps = {
  createBookingHandle,
};
export default connect(
  mapStateToProps,
  mapActionToProps
)(BookingModal);
