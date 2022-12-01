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
import responsive from "../../../resources/responsive";
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
      <View style={{ paddingHorizontal: responsive.h(20) }}>
        <View style={{}}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 0,
              marginBottom: responsive.h(10),
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(16),
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
                fontSize: responsive.h(14),
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
                height: responsive.h(120),
                textAlignVertical: "top",
                borderStyle: "solid",
                borderWidth: 1,
                borderRadius: responsive.h(8),
                borderColor: "#cbcbcb",
                padding: responsive.h(10),
                fontSize: responsive.h(14)
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
                  borderRadius: responsive.h(8),
                  padding: responsive.h(5),
                  marginTop: responsive.h(20),
                  marginRight: responsive.h(10),
                }}
              >
                <MyIcon
                  onPress={() => this._onAttachment()}
                  name="camera"
                  size={responsive.h(40)}
                  color="#a8acaf"
                />
                <View
                  style={{
                    borderRadius: 2,
                    backgroundColor: "#abafb2",
                    padding: responsive.h(3),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontSize: responsive.h(8),
                      fontWeight: "normal",
                      fontStyle: "normal",
                      letterSpacing: 0,
                      textAlign: "left",
                      color: "#ffffff",
                    }}
                  >
                    {Strings.createRequest.addPhoto}
                  </Text>
                </View>
              </View>
            )}
            {this.state.images.map((eachImage, y) => {
              return (
                <View key={y}>
                  <Lightbox
                    style={{
                      marginTop: responsive.h(20),
                      marginRight: responsive.h(20),
                      borderRadius: responsive.h(5),
                      backgroundColor: "#eeeeee",
                    }}
                    activeProps={{
                      style: styles.imageActive,
                    }}
                  >
                    <Image
                      source={{ uri: eachImage.uri }}
                      style={{
                        width: responsive.w(90),
                        height: responsive.h(120),
                        zIndex: 0,
                        borderRadius: responsive.h(8),
                      }}
                    />
                  </Lightbox>

                  <TouchableOpacity
                    onPress={() => this._deleteImage(eachImage)}
                    style={{
                      position: "absolute",
                      top: responsive.h(10),
                      right: 0,
                      borderRadius: responsive.h(15),
                      marginTop: responsive.h(20),
                      backgroundColor: "#505c5c5c",
                      zIndex: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ padding: responsive.h(5), color: "#fff", fontSize: responsive.h(14)  }}> X </Text>
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
              marginTop: responsive.h(20),
              paddingVertical: responsive.h(20),
              borderRadius: responsive.h(8),
              backgroundColor: "#eaeaea",
            }}
          >
            <MyIcon name="camera" size={responsive.h(40)} color="#a8acaf" />
            <View
              style={{
                borderRadius: 2,
                backgroundColor: "#abafb2",
                padding: responsive.h(3),
              }}
            >
              <Text
                style={{
                  fontFamily: "OpenSans-Regular",
                  fontSize: responsive.h(8),
                  fontWeight: "normal",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#ffffff",
                }}
              >
                {Strings.createRequest.textPhoto}
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
        style={{ padding: responsive.h(10) }}
        onPress={() => this.props.navigation.goBack()}
      >
        <MyIcon name="arrow" size={responsive.h(22)} color="black" />
      </TouchableOpacity>
    );
    const rightButton = (
      <TouchableOpacity
        style={{ padding: responsive.h(10) }}
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
        <MyIcon name="paperplane" size={responsive.h(24)} color="black" />
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
                fontSize: responsive.h(20),
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
        <Toast ref="toast" style={{ backgroundColor: colors.toast.success }} />
      </View>
    );
  }

  _onAttachment = () => {
    // if (this.props.images && _.size(this.props.images) < 5) {
      let option = {
        quality: 1.0,
        maxWidth: 512,
        maxHeight: 512,
        storageOptions: {
          skipBackup: true
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
      }
    ImagePicker.showImagePicker(option, (response) => {
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
