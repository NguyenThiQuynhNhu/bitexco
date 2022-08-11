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
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { connect } from "react-redux";
import { MyIcon } from "../../theme/icons";
import PrimaryButton from "../../components/common/PrimaryButton";
import colors from "../../theme/colors";
import Strings from "../../utils/languages";

import {
  createBookingHandle,
  loadZoneTimeHandle,
} from "../../actions/utilitiesBasicDetail";

const TitleTextInput = ({
  editable = true,
  title,
  value,
  placeholder,
  onChangeText,
  onSubmitEditing,
}) => {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderColor: colors.grayBorder,
        marginBottom: responsive.h(5),
      }}
    >
      <Text>{title}</Text>
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
class BookingBasicModal extends Component {
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
      amountPeople: 1,
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
      amountPeople,
    } = this.state;
    const { title, visible, onClose, onSubmit, isProgress } = this.props;
    return (
      <Modal visible={visible} transparent={true} onRequestClose={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.appOverView,
            padding: responsive.h(10),
            justifyContent: "center",
          }}
        >
          {isProgress ? (
            <ActivityIndicator />
          ) : (
            <View style={{ backgroundColor: "#fff", height: "80%" }}>
              {/* Header */}
              <View
                style={{
                  backgroundColor: colors.appTheme,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: responsive.h(20),
                    paddingVertical: responsive.h(5),
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    {title}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={{ padding: responsive.h(20) }}
                >
                  <MyIcon name="no" size={responsive.h(20)} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: responsive.h(10) }}>
                  <TitleTextInput
                    editable={false}
                    value={apartment}
                    title="Căn hộ"
                    onChangeText={(apartment) => {
                      this.setState({ apartment });
                    }}
                  />
                  <TitleTextInput
                    editable={false}
                    value={fullName}
                    title="Người đặt"
                    onChangeText={(fullName) => {
                      this.setState({ fullName });
                    }}
                  />
                  <TitleTextInput
                    editable={false}
                    value={phoneNumber}
                    title="Số điện thoại"
                    onChangeText={(phoneNumber) => {
                      this.setState({ phoneNumber });
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => this.setState({ isShowTime: true })}
                    style={{
                      borderBottomWidth: 1,
                      borderColor: colors.grayBorder,
                      marginBottom: responsive.h(5),
                    }}
                  >
                    <Text style={{ fontSize: responsive.h(14) }}>
                      Thời gian
                    </Text>
                    <Text style={{ margin: responsive.h(10) }}>
                      {moment(time).format("DD/MM/YYYY")}
                    </Text>
                  </TouchableOpacity>
                  <TitleTextInput
                    value={message}
                    title="Lời nhắn"
                    placeholder="Nhập lời nhắn"
                    onChangeText={(message) => {
                      this.setState({ message });
                    }}
                  />
                </View>
              </ScrollView>
              <PrimaryButton
                style={{
                  borderRadius: responsive.h(45),
                  margin: responsive.h(20),
                }}
                text={Strings.serviceBasicBooking.book}
                onPress={this._onSubmit}
              />
              <DateTimePicker
                cancelTextIOS={Strings.app.cancel}
                titleIOS={Strings.createRequest.at}
                confirmTextIOS={Strings.app.chose}
                mode="date"
                isVisible={this.state.isShowTime}
                onConfirm={(time) => {
                  this.setState({ isShowTime: false, time });
                  //LOAD SUẤT
                  this._onLoadZoneTime();
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

  _onLoadZoneTime() {
    const { time } = this.state;
    this.props.loadZoneTimeHandle({
      dateBook: moment(time).format("DD/MM/YYYY"),
      towerId: this.props.user.towerId,
      zoneId: 8,
      langId: 1,
      serviceId: 51,
    });
  }

  _onSubmit = () => {
    const { time, message } = this.state;
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
  loadZoneTimeHandle,
};
export default connect(
  mapStateToProps,
  mapActionToProps
)(BookingBasicModal);
