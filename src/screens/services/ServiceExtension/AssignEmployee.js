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
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import Toast, { DURATION } from "react-native-easy-toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";
import { connect } from "react-redux";
import { MyIcon } from "../../../theme/icons";
import Strings from "../../../utils/languages";
import Lookup from "../../../components/Request/RequestCreate/Lookup";
import fontsize from "../../../theme/fontsize";
import ModalPicker from "../../../components/common/ModalPicker";
import colors from "../../../theme/colors";
import { updateRequestHandle } from "../../../actions/servicesExtensionDetail";
import NavBar from "../../../resident/components/common/NavBar";

// create a component
class ServiceExtensionAssignEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: new Date(),
      time: new Date(),
      isToggleDate: false,
      showModalLevel: false,
      depSelected: {
        id: 0,
      },
      employeeSelected: {
        id: 0,
      },
      levelSelected: {
        id: 0,
      },
      content: "",
    };
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errorResponse &&
      nextProps.errorResponse !== this.props.errorResponse
    ) {
      if (nextProps.errorResponse.hasError) {
        // this.refs.toast.show(`Xảy ra lỗi  ${nextProps.errorResponse.statusText}`, DURATION.LENGTH_LONG);
      } else {
        this.props.navigation.goBack();
        // this.refs.toast.show('Xử lý thành công', DURATION.LENGTH_LONG);
      }
    }
  }
  renderContent() {
    const { user } = this.props;
    const {
      depSelected,
      employeeSelected,
      levelSelected,
      content,
      showModalLevel,
      day,
      time,
    } = this.state;
    return (
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          paddingHorizontal: 20,
        }}
      >
        <Lookup
          fielName={`Phòng ban (*)`}
          text={
            depSelected.id != 0
              ? depSelected.name
              : Strings.createRequest.placeholderDepartment
          }
          onPress={() =>
            this.props.navigation.navigate("depDictionary", {
              id: user.towerId,
              onSelected: (depSelected) => this.setState({ depSelected }),
            })
          }
        />
        <Lookup
          visible={depSelected.id !== 0}
          fielName={`Nhân viên (*)`}
          text={
            employeeSelected.id != 0
              ? employeeSelected.name
              : Strings.createRequest.placeholderEmployee
          }
          onPress={() =>
            this.props.navigation.navigate("empDictionary", {
              towerId: user.towerId,
              departmentId: depSelected.id,
              onSelected: (employeeSelected) =>
                this.setState({ employeeSelected }),
            })
          }
        />

        {/* <TouchableOpacity style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.grayBorder
                }}
                    onPress={() => this.setState({ showModalLevel: true })}
                >
                    <Text style={{ color: colors.blue }}>CẤP ĐỘ (*)</Text>
                    <View style={{ justifyContent: 'flex-end', flexDirection: 'row', width: '60%' }}>
                        <Text style={{ color: 'gray' }}>{levelSelected.value}</Text>
                        <MyIcon
                            size={20}
                            color={"#C0C0C0"}
                            name="arrow-right" />
                    </View>

                </TouchableOpacity> */}
        <View>
          {/* <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.grayBorder
                        }}
                        onPress={() => { this.setState({ isToggleDate: true }); }}
                    >
                        <MyIcon
                            name="calendar"
                            size={20}
                        />
                        {this.props.language == 'en' ?
                            <Text
                                style={{
                                    marginLeft: 20,
                                    fontSize: fontsize.larg,
                                    flex: 1,
                                }}>{moment(day).format('MMMM Do YYYY')}</Text> :
                            <Text
                                style={{
                                    marginLeft: 20,
                                    fontSize: fontsize.larg,
                                    flex: 1,
                                }}>{moment(day).format('[Ngày] DD [tháng] MM[,] YYYY')}</Text>}

                        <DateTimePicker
                            cancelTextIOS={Strings.createRequest.cancel}
                            titleIOS={Strings.createRequest.titlePicker}
                            confirmTextIOS={Strings.createRequest.chose}
                            mode="date"
                            minimumDate={new Date()}
                            isVisible={this.state.isToggleDate}
                            onConfirm={(day) => {
                                // this.props.resetStateByKey({ key: 'day', path: '', value: date });
                                this.setState({ isToggleDate: false, day });
                            }}
                            onCancel={() => { this.setState({ isToggleDate: false }); }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { this.setState({ isToggleTimeFrom: true }); }}
                        style={{ paddingVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <MyIcon
                            name="clock"
                            size={20}
                        />
                        <Text style={{
                            marginLeft: 20,
                            fontSize: fontsize.larg,
                            flex: 1,
                        }}>{Strings.createRequest.at}    {moment(time).format('HH:mm')}</Text>
                        <DateTimePicker
                            cancelTextIOS={Strings.app.cancel}
                            titleIOS={Strings.createRequest.at}
                            confirmTextIOS={Strings.app.chose}
                            mode="time"
                            isVisible={this.state.isToggleTimeFrom}
                            onConfirm={(time) => {
                                // this.props.resetStateByKey({ key: 'time', path: '', value: time });
                                this.setState({ isToggleTimeFrom: false, time });
                            }}
                            onCancel={() => { this.setState({ isToggleTimeFrom: false }); }}
                        />
                    </TouchableOpacity> */}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: 16,
              fontWeight: "600",
              textAlign: "left",
              color: "#282828",
            }}
          >
            {Strings.createRequest.content}
          </Text>

          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 10,
              textAlign: "left",
              color: "#6f6f6f",
            }}
          >
            {content.length}/3000
          </Text>
        </View>
        <View
          style={{
            marginTop: 10,
            // borderColor: colors.grayBorder,
            // borderBottomWidth: 1,
          }}
        >
          <TextInput
            maxLength={3000}
            underline={false}
            multiline
            underlineColorAndroid="transparent"
            style={{
              backgroundColor: "#fff",
              height: 120,
              textAlignVertical: "top",
              borderRadius: 8,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#cbcbcb",
              padding: 10,
            }}
            placeholder={Strings.createRequest.placeholderContent}
            placeholderTextColor="#9e9e9e"
            value={this.props.content}
            onChangeText={(content) => this.setState({ content })}
            // onChangeText={(text) => { this.props.resetStateByKey({ key: 'content', path: '', value: text }); }}
          />
        </View>

        <Spinner
          visible={this.props.isLoadingReponse}
          textContent={Strings.app.progressing}
          textStyle={{ color: "#FFF", fontSize: fontsize.small }}
        />
        {/* <ActionSheet visible={showAction} data={methodProcess} renderItem={this.renderActionSheetItem} /> */}
      </KeyboardAwareScrollView>
    );
  }

  render() {
    const {
      day,
      time,
      depSelected,
      employeeSelected,
      content,
      levelSelected,
    } = this.state;
    const leftButton = (
      <TouchableOpacity
        style={{ paddingVertical: 10 }}
        onPress={() => this.props.navigation.goBack()}
      >
        <MyIcon name="arrow" size={20} color="black" />
      </TouchableOpacity>
    );
    const rightButton = (
      <TouchableOpacity
        style={{ paddingVertical: 10 }}
        onPress={this._onRequest}
      >
        <MyIcon name="paperplane" size={24} color="black" />
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <NavBar
          leftButton={leftButton}
          body={
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                color: "black",
              }}
            >
              {this.props.navigation.state.params.title}
            </Text>
          }
          rightView={rightButton}
        />
        {this.renderContent()}
        <Toast ref="toast" style={{ backgroundColor: colors.toast.warning }} />
      </View>
    );
  }

  _onRequest = () => {
    const { id, statusId, serviceName } = this.props.data;
    const {
      //day,
      //time,
      depSelected,
      employeeSelected,
      content,
      //levelSelected
    } = this.state;
    if (depSelected.id == 0) {
      return this.refs.toast.show(
        `Vui lòng chọn phòng ban`,
        DURATION.LENGTH_LONG
      );
    }
    if (employeeSelected.id == 0) {
      return this.refs.toast.show(
        `Vui lòng chọn nhân viên`,
        DURATION.LENGTH_LONG
      );
    }

    return this.props.updateRequestHandle({
      bookingId: id,
      employeeId: employeeSelected.id,
      departmentId: depSelected.id,
      description: content,
      towerName: this.props.user.towerName,
      employeeName: employeeSelected.name,
      serviceName,
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

const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.servicesExtensionDetail.data.seviceBasic,
  isLoading: state.servicesExtensionDetail.isLoading,
  errorResponse: state.servicesExtensionDetail.errorResponse,
  error: state.servicesExtensionDetail.error,
  language: state.app.language,
});

const mapActionToProps = {
  updateRequestHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(ServiceExtensionAssignEmployee);
