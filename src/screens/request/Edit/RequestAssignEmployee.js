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
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import Toast, { DURATION } from "react-native-easy-toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";
import * as mineTypes from "react-native-mime-types";
import ImagePicker from "react-native-image-picker";
import Lightbox from "react-native-lightbox";

import moment from "moment";
import { connect } from "react-redux";
import { MyIcon } from "../../../theme/icons";
import Strings from "../../../utils/languages";
import Lookup from "../../../components/Request/RequestCreate/Lookup";
import ActionSheet from "../../../components/common/ActionSheet";
import fontsize from "../../../theme/fontsize";
import ModalPicker from "../../../components/common/ModalPicker";
import colors from "../../../theme/colors";
import { updateRequestHandle } from "../../../actions/requestDetail";
import ImagePickerOption from "../../../constant/ImagePickerOption";

import NavBar from "../../../resident/components/common/NavBar";

// create a component
class RequestAssignEmployee extends Component {
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
      groupSelected: {
        id: 0,
      },
      images: [],
      imagesInformation: [],
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
      groupSelected,
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
        <Lookup
          visible={depSelected.id !== 0}
          fielName={`Nhóm công việc (*)`}
          text={
            groupSelected.id != 0
              ? groupSelected.name
              : Strings.createRequest.placeholderGroup
          }
          onPress={() =>
            this.props.navigation.navigate("groupDictionary", {
              departmentId: depSelected.id,
              onSelected: (groupSelected) => this.setState({ groupSelected }),
            })
          }
        />

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 20,
          }}
          onPress={() => this.setState({ showModalLevel: true })}
        >
          <Text
            style={{
              color: "#282828",
              fontFamily: "Inter-Bold",
              fontSize: 16,
              fontWeight: "bold",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
              marginRight: 10,
              flex: 0.5,
            }}
          >
            Cấp độ (*)
          </Text>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 8,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#cbcbcb",
              padding: 5,
              flex: 0.5,
            }}
          >
            <Text
              style={{
                color: "#282828",
                fontFamily: "Inter-SemiBold",
                fontSize: 14,
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
              }}
            >
              {levelSelected.value
                ? levelSelected.value
                : Strings.createRequest.placeholderPriority}
            </Text>
            <MyIcon size={14} color={colors.grayBorder} name="arrow-down" />
          </View>
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            fontWeight: "600",
            textAlign: "left",
            color: "#282828",
            marginBottom: 10,
          }}
        >
          Thời gian
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
              flex: 0.45,
              borderRadius: 8,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#cbcbcb",
            }}
            onPress={() => {
              this.setState({ isToggleDate: true });
            }}
          >
            {this.props.language == "en" ? (
              <Text
                style={{
                  flex: 1,
                  fontFamily: "Inter-SemiBold",
                  fontSize: 14,
                  fontWeight: "600",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#282828",
                }}
              >
                {moment(day).format("DD/MM/YYYY")}
              </Text>
            ) : (
              <Text
                style={{
                  flex: 1,
                  fontFamily: "Inter-SemiBold",
                  fontSize: 14,
                  fontWeight: "600",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#282828",
                }}
              >
                {moment(day).format("DD/MM/YYYY")}
              </Text>
            )}
            <MyIcon name="calendar2" size={20} color={"rgba(0, 0, 0, 0.54)"} />
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
              onCancel={() => {
                this.setState({ isToggleDate: false });
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ isToggleTimeFrom: true });
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
              flex: 0.45,
              borderRadius: 8,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#cbcbcb",
            }}
          >
            <Text
              style={{
                flex: 1,
                fontFamily: "Inter-SemiBold",
                fontSize: 14,
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#282828",
              }}
            >
              {moment(time).format("HH:mm")}
            </Text>
            <MyIcon name="clock2" size={20} color={"rgba(0, 0, 0, 0.54)"} />
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
              onCancel={() => {
                this.setState({ isToggleTimeFrom: false });
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingBottom: 0,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
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
        {this.state.images.length > 0 ? (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {this.state.images.length < 5 && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.grayBorder,
                  borderRadius: 8,
                  padding: 5,
                  marginTop: 20,
                  marginRight: 10,
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
                <View key={y}>
                  <Lightbox
                    style={{
                      marginTop: 20,
                      marginRight: 10,
                      borderRadius: 5,
                      backgroundColor: "#eeeeee",
                    }}
                    activeProps={{
                      style: styles.imageActive,
                    }}
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
                    onPress={() => this._deleteImage(eachImage)}
                    style={{
                      position: "absolute",
                      top: 10,
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
          <TouchableOpacity
            onPress={() => this._onAttachment()}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
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
        <ModalPicker
          visible={showModalLevel}
          selectedValue={this.state.levelSelected.id}
          onValueChange={(levelSelected) =>
            this.setState({ showModalLevel: false, levelSelected })
          }
          data={[
            { id: 1, value: "Khẩn cấp" },
            { id: 2, value: "Bình thường" },
            { id: 3, value: "Thấp" },
          ]}
          dislayValue="value"
          onClose={() => this.setState({ showModalLevel: false })}
        />

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
        <MyIcon name="arrow" size={22} color="black" />
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
    const {
      day,
      time,
      depSelected,
      employeeSelected,
      content,
      levelSelected,
      groupSelected,
      imagesInformation,
    } = this.state;
    if (depSelected.id == 0) {
      return this.refs.toast.show(
        `Vui lòng chọn Phòng ban`,
        DURATION.LENGTH_LONG
      );
    }
    if (employeeSelected.id == 0) {
      return this.refs.toast.show(
        `Vui lòng chọn Nhân viên`,
        DURATION.LENGTH_LONG
      );
    }
    if (groupSelected.id == 0) {
      return this.refs.toast.show(
        `Vui lòng chọn Nhóm công việc`,
        DURATION.LENGTH_LONG
      );
    }
    if (levelSelected.id == 0) {
      return this.refs.toast.show(`Vui lòng chọn Cấp độ`, DURATION.LENGTH_LONG);
    }
    return this.props.updateRequestHandle(
      {
        requestId: this.props.data.id,
        dateProcess:
          moment(day).format("DD/MM/YYYY") + " " + moment(time).format("HH:mm"),
        departmentId: depSelected.id,
        employeeProcessId: employeeSelected.id,
        content,
        priorotyId: levelSelected.id,
        groupProcessId: groupSelected.id,
        imagesInformation,
      },
      "RequestAssignEmployee"
    );
  };

  _onAttachment = () => {
    // if (this.props.images && _.size(this.props.images) < 5) {
    ImagePicker.showImagePicker(ImagePickerOption, (response) => {
      // console.log('Response showImagePicker = ', response);

      if (response.didCancel) {
        // console.log('User cancelled photo picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
      } else {
        const image = {
          uri: response.uri,
          mineType:
            Platform.OS === "ios"
              ? mineTypes.lookup(response.uri)
              : response.type,
          bytes: response.data,
        };
        this.setState(
          {
            images: [...this.state.images, image],
            imagesInformation: [
              ...this.state.imagesInformation,
              { mineType: image.mineType, bytes: image.bytes },
            ],
          },
          () => {
            console.log(this.state.imagesInformation);
          }
        );
      }
    });
  };

  _deleteImage = (item) => {
    const array = this.state.images;
    const index = array.indexOf(item);
    array.splice(index, 1);
    this.setState({ images: array });
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
  data: state.requestDetail.data,
  isLoading: state.requestDetail.isLoading,
  errorResponse: state.requestDetail.errorResponse,
  error: state.requestDetail.error,
  language: state.app.language,
});

const mapActionToProps = {
  updateRequestHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(RequestAssignEmployee);
