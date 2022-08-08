//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import Toast, { DURATION } from "react-native-easy-toast";
import Spinner from "react-native-loading-spinner-overlay";
import * as mineTypes from "react-native-mime-types";
import ImagePicker from "react-native-image-picker";
import moment from "moment";
import { connect } from "react-redux";
import Lightbox from "react-native-lightbox";
import { MyIcon } from "../../../theme/icons";
import NavBar from "../../../resident/components/common/NavBar";
import Strings from "../../../utils/languages";
import Lookup from "../../../components/Request/RequestCreate/Lookup";
import ActionSheet from "../../../components/common/ActionSheet";
import fontsize from "../../../theme/fontsize";
import ModalPicker from "../../../components/common/ModalPicker";
import colors from "../../../theme/colors";
import { updateRequestHandle } from "../../../actions/requestDetail";
import ImageProgress from "../../../components/common/ImageProgress";
import ImagePickerOption from "../../../constant/ImagePickerOption";

// create a component
class RequestComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      images: [],
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
    const { content, images } = this.state;
    return (
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{}}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 0,
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
                fontSize: 14,
                textAlign: "left",
                color: "#6b6b6b",
              }}
            >
              {content.length}/3000
            </Text>
          </View>
          <View>
            <TextInput
              maxLength={3000}
              underline={false}
              multiline
              underlineColorAndroid="transparent"
              style={{
                backgroundColor: "#fff",
                height: 120,
                textAlignVertical: "top",
                borderStyle: "solid",
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "#cbcbcb",
                padding: 10,
              }}
              placeholder={Strings.createRequest.placeholderContent}
              placeholderTextColor="#9e9e9e"
              value={this.props.content}
              onChangeText={(content) => this.setState({ content })}
            />
          </View>
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
                      marginTop: 20,
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
              bjustifyContent: "center",
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
        <Spinner
          visible={this.props.isLoadingReponse}
          textContent={Strings.app.progressing}
          textStyle={{ color: "#FFF", fontSize: fontsize.small }}
        />
        {/* <ActionSheet visible={showAction} data={methodProcess} renderItem={this.renderActionSheetItem} /> */}
      </View>
    );
  }

  render() {
    const { data, updateRequestHandle } = this.props;
    const { images, content } = this.state;
    const leftButton = (
      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={() => this.props.navigation.goBack()}
      >
        <MyIcon name="arrow" size={22} color="black" />
      </TouchableOpacity>
    );
    const rightButton = (
      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={() =>
          updateRequestHandle(
            {
              content: {
                requestId: data.id,
                content,
                keyTrangThai: this.props.navigation.state.params.keyTrangThai,
              },
              imagesInformation: images,
            },
            "RequestComplete"
          )
        }
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
              Báo cáo hoàn thành
            </Text>
          }
          rightView={rightButton}
        />
        {this.renderContent()}
        <Toast ref="toast" style={{ backgroundColor: colors.toast.success }} />
      </View>
    );
  }

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
        this.setState({ images: [...this.state.images, image] });
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
  imageActive: {
    flex: 1,
    resizeMode: "contain",
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
)(RequestComplete);
