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
  Keyboard,
  Switch,
  PermissionsAndroid,
  FileSystem,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import * as mineTypes from "react-native-mime-types";
import DateTimePicker from "react-native-modal-datetime-picker";
import { connect } from "react-redux";
import ImagePicker from "react-native-image-picker";
import Lightbox from "react-native-lightbox";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import _ from "lodash";
import Toast, { DURATION } from "react-native-easy-toast";
import colors from "../../../theme/colors";
import { MyIcon } from "../../../theme/icons";
import getImage from "../../../utils/permissionsCamera";
import Lookup from "../../../components/Request/RequestCreate/Lookup";
import { createRequestHandle } from "../../../actions/requestCreate";
import Strings from "../../../utils/languages";
import fontsize from "../../../theme/fontsize";
import NavBar from "../../../components/common/NavBar";
import responsive from "../../../../resources/responsive";

// create a component
class CreateScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      vendorSelected: {
        id: props.user.towerId,
        name: props.user.towerName,
      },
      time: new Date(),
      day: new Date(),
      title: "",
      content: "",
      isShowTime: false,
      isToggleDate: false,
      isToggleTimeFrom: false,
      isToggleTimeTo: false,
      userContact: props.user.fullName,
      phoneContact: props.user.phoneNumber,
      modalView: null,
      modalVisible: false,
      images: [],
      imagesInformation: [],
    };
    moment.locale(props.language);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && nextProps.error !== this.props.error) {
      if (!nextProps.error.hasError) {
        this.props.navigation.goBack();
      } else {
        this.refs.toast.show(nextProps.error.message, DURATION.LENGTH_LONG);
      }
    }
  }
  componentDidMount() {
    this.props.navigation.dispatch({
      type: "SAVE_KEY",
      payload: this.props.navigation.state.key,
    });
    this.props.navigation.setParams({
      onAttachment: this._onAttachment,
      onNext: this._onNext,
    });

    const { vendorDetail } = this.props;
    if (!_.isNull(vendorDetail)) {
      this.props.resetStateByKey({
        key: "vendorSelected",
        value: { id: vendorDetail.id, name: vendorDetail.towerName },
      });
    }
  }
  render() {
    const {
      next,
      vendor,
      department,
      contractNo,

      phone,
      from,
      date,
      at,
      unreceived,
      received,
    } = Strings.createRequest;
    const {
      title,
      content,
      time,
      day,
      isShowTime,
      userContact,
      phoneContact,
      vendorSelected,
    } = this.state;

    return (
      <View>
        <NavBar
          body={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  ontFamily: "Inter-Bold",
                  fontSize: responsive.h(20),
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "center",
                  color: "black",
                }}
              >
                {Strings.createRequest.navTitle}
              </Text>
            </View>
          }
          leftButton={
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <MyIcon name="arrow" color="black" size={responsive.h(20)} />
            </TouchableOpacity>
          }
          rightView={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  this.onNext();
                }}
                style={{
                  flexDirection: "row",
                  paddingVertical: responsive.h(10),
                  alignItems: "center",
                }}
              >
                <MyIcon
                  name="paperplane"
                  color="black"
                  size={responsive.h(24)}
                />
              </TouchableOpacity>
            </View>
          }
        />
        <KeyboardAwareScrollView
          style={{
            borderTopRightRadius: responsive.h(20),
            marginTop: responsive.h(-20),
            paddingTop: responsive.h(20),
          }}
        >
          <View style={styles.container}>
            <Lookup
              visible={this.props.vendorDetail == null}
              fielName={`${vendor} (*)`}
              text={
                vendorSelected
                  ? vendorSelected.name
                  : Strings.createRequest.placeholderVendor
              }
            />
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginTop: responsive.h(20),
                borderTopRightRadius: responsive.h(20),
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: responsive.h(10),
                }}
              >
                <Text
                  style={{
                    color: "#282828",
                    fontFamily: "Inter-Bold",
                    fontSize: responsive.h(16),
                    fontWeight: "bold",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                  }}
                >
                  {Strings.createRequest.title} (*)
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: responsive.h(10),
                    fontWeight: "normal",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#6f6f6f",
                  }}
                >
                  {title.length}/ 50
                </Text>
              </View>

              <TextInput
                maxLength={50}
                underline={false}
                multiline
                style={{
                  width: "100%",
                  flex: 1,
                  height: responsive.h(66),
                  padding: responsive.h(10),
                  textAlignVertical: Platform.OS === "ios" ? "auto" : "top",
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  fontSize: responsive.h(fontsize.small),
                  fontFamily: "Inter-Regular",
                  borderRadius: responsive.h(8),
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#cbcbcb",
                }}
                placeholder={Strings.createRequest.placeholderTitle}
                placeholderTextColor="#6b6b6b"
                value={this.state.title}
                underlineColorAndroid="transparent"
                onChangeText={(title) => {
                  this.setState({ title });
                }}
              />
            </View>
            <View
              style={{
                // borderBottomWidth: 1,
                // borderColor: colors.grayBorder,

                alignItems: "flex-start",
                justifyContent: "space-between",
                marginTop: responsive.h(20),
                borderTopRightRadius: responsive.h(20),
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: responsive.h(10),
                }}
              >
                <Text
                  style={{
                    color: "#282828",
                    fontFamily: "Inter-Bold",
                    fontSize: responsive.h(16),
                    fontWeight: "bold",
                    fontStyle: "normal",
                    letterSpacing: 0,
                  }}
                >
                  {Strings.createRequest.content} (*)
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: responsive.h(8),
                    fontWeight: "normal",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#6f6f6f",
                  }}
                >
                  {content.length}/ 500
                </Text>
              </View>

              <TextInput
                maxLength={500}
                underline={false}
                multiline
                underlineColorAndroid="transparent"
                style={{
                  width: "100%",
                  flex: 1,
                  height: responsive.h(100),
                  padding: responsive.h(10),
                  textAlignVertical: Platform.OS === "ios" ? "auto" : "top",
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  fontSize: responsive.h(fontsize.small),
                  fontFamily: "Inter-Regular",
                  borderRadius: responsive.h(8),
                  borderStyle: "solid",
                  borderWidth: responsive.w(1),
                  borderColor: "#cbcbcb",
                }}
                placeholder={Strings.createRequest.placeholderContent}
                placeholderTextColor="#9e9e9e"
                value={this.state.content}
                onChangeText={(content) => {
                  this.setState({ content });
                }}
              />
            </View>

            {this.state.images.length > 0 ? (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: responsive.h(20) }}
              >
                {this.state.images.length < 5 && (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: colors.grayBorder,
                      borderRadius: responsive.h(8),
                      padding: responsive.h(5),
                      marginTop: responsive.h(10),
                      marginRight: responsive.h(10),
                    }}
                  >
                    <MyIcon
                      onPress={() => this._onAttachment()}
                      name="image2"
                      size={responsive.h(40)}
                      color="#a8acaf"
                    />
                    <View
                      style={{
                        borderRadius: responsive.h(2),
                        backgroundColor: "#abafb2",
                        padding: responsive.h(3),
                        //borderTopRightRadius: 20,
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
                  </View>
                )}

                {this.state.images.map((eachImage, y) => {
                  return (
                    <View key={y}>
                      <Lightbox
                        style={{
                          marginTop: responsive.h(10),
                          marginRight: responsive.h(10),
                          borderRadius: responsive.h(5),
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
                            width: responsive.w(90),
                            height: responsive.h(120),
                            zIndex: 0,
                            borderRadius: responsive.h(8),
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
                          borderRadius: responsive.h(15),
                          marginTop: 0,
                          backgroundColor: "#505c5c5c",
                          zIndex: 1,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{ padding: responsive.h(5), color: "#fff" }}
                        >
                          X
                        </Text>
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
                  marginTop: responsive.h(20),
                  paddingVertical: responsive.w(20),
                  borderRadius: responsive.h(8),
                  backgroundColor: "#eaeaea",
                }}
              >
                <MyIcon name="image2" size={responsive.h(40)} color="#a8acaf" />
                <View
                  style={{
                    borderRadius: responsive.h(2),
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: responsive.h(20),
                borderTopRightRadius: responsive.h(20),
                //borderBottomWidth: 1,
                //borderBottomColor: colors.grayBorder
              }}
            >
              <Text
                style={{
                  color: "#282828",
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(16),
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                }}
              >
                {Strings.createRequest.date}
              </Text>
              <Switch
                style={{
                  flex: 0,
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                  color: "#6fcf97",
                }}
                value={this.state.isShowTime}
                onValueChange={() => {
                  this.setState({ isShowTime: !this.state.isShowTime });
                }}
              />
            </View>

            {isShowTime && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: responsive.h(10),
                  borderTopRightRadius: responsive.h(20),
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: responsive.h(10),
                    // borderBottomWidth: 1,
                    // borderBottomColor: colors.grayBorder,
                    flex: 0.45,
                    borderRadius: responsive.h(8),
                    borderStyle: "solid",
                    borderWidth: responsive.h(1),
                    borderColor: "#cbcbcb",
                  }}
                  onPress={() => {
                    this.setState({
                      isToggleDate: true,
                      day: moment(),
                      time: moment(),
                    });
                  }}
                >
                  {this.props.language == "en" ? (
                    <Text
                      style={{
                        //marginLeft: 20,
                        // fontSize: fontsize.larg,
                        flex: 1,
                        fontFamily: "Inter-SemiBold",
                        fontSize: responsive.h(14),
                        fontWeight: "600",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: "#282828",
                      }}
                    >
                      {day
                        ? moment(day).format("DD/MM/YYYY")
                        : moment().format("DD/MM/YYYY")}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        //marginLeft: 20,
                        fontFamily: "Inter-SemiBold",
                        fontSize: responsive.h(14),
                        fontWeight: "600",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: "#282828",
                        flex: 1,
                      }}
                    >
                      {day
                        ? moment(day).format("DD/MM/YYYY")
                        : moment().format("DD/MM/YYYY")}
                    </Text>
                  )}
                  <DateTimePicker
                    cancelTextIOS={Strings.createRequest.cancel}
                    titleIOS={Strings.createRequest.titlePicker}
                    confirmTextIOS={Strings.createRequest.chose}
                    mode="date"
                    minimumDate={new Date()}
                    isVisible={this.state.isToggleDate}
                    onConfirm={(day) => {
                      this.setState({ isToggleDate: false, day });
                    }}
                    onCancel={() => {
                      this.setState({ isToggleDate: false });
                    }}
                  />
                  <MyIcon
                    name="calendar"
                    size={responsive.h(20)}
                    color="rgba(0, 0, 0, 0.54)"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ isToggleTimeFrom: true });
                  }}
                  style={{
                    padding: responsive.h(10),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    // borderBottomWidth: 1,
                    // borderBottomColor: colors.grayBorder
                    borderRadius: responsive.h(8),
                    borderStyle: "solid",
                    borderWidth: responsive.h(1),
                    borderColor: "#cbcbcb",
                    flex: 0.45,
                  }}
                >
                  <Text
                    style={{
                      //marginLeft: 20,
                      fontFamily: "Inter-SemiBold",
                      fontSize: responsive.h(14),
                      fontWeight: "600",
                      fontStyle: "normal",
                      letterSpacing: 0,
                      textAlign: "left",
                      color: "#282828",
                      flex: 1,
                    }}
                  >
                    {time
                      ? moment(time).format("HH:mm")
                      : moment().format("HH:mm")}
                  </Text>
                  <DateTimePicker
                    cancelTextIOS={Strings.app.cancel}
                    titleIOS={Strings.createRequest.at}
                    confirmTextIOS={Strings.app.chose}
                    mode="time"
                    isVisible={this.state.isToggleTimeFrom}
                    onConfirm={(time) => {
                      this.setState({ isToggleTimeFrom: false, time });
                    }}
                    onCancel={() => {
                      this.setState({ isToggleTimeFrom: false });
                    }}
                  />
                  <MyIcon
                    name="clock"
                    size={responsive.h(20)}
                    color="rgba(0, 0, 0, 0.54)"
                  />
                </TouchableOpacity>
              </View>
            )}
            {/* <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: 20,

                            borderBottomWidth: 1,
                            borderBottomColor: colors.grayBorder
                        }}>
                            <Text style={{ color: colors.blue, fontSize: fontsize.small }}>{Strings.createRequest.from}</Text>
                            <TextInput
                                style={{ flex: 1, marginLeft: 20, paddingHorizontal: 0, paddingVertical: 0, fontSize: fontsize.small }}
                                placeholder={Strings.createRequest.placeholderSender}
                                placeholderTextColor="#9e9e9e"
                                value={userContact}
                                underlineColorAndroid='transparent'
                                onChangeText={(userContact) => { this.setState({ userContact }) }}
                            />
                        </View> */}
            {/* <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.grayBorder
                        }}>
                            <Text style={{ color: colors.blue, fontSize: fontsize.small }}>{Strings.createRequest.phone}</Text>
                            <TextInput
                                style={{ flex: 1, marginLeft: 20, paddingHorizontal: 0, paddingVertical: 0, fontSize: fontsize.small }}
                                placeholder={Strings.createRequest.placeholderPhone}
                                placeholderTextColor="#9e9e9e"
                                value={phoneContact}
                                underlineColorAndroid='transparent'
                                onChangeText={(text) => { this.setState({ phoneContact: text }) }}
                            />
                        </View> */}
            {/* <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: 20,
                        }}><Text style={{ color: '#fff', fontSize: fontsize.small }}>Vime</Text>

                        </View> */}
          </View>
        </KeyboardAwareScrollView>

        <Spinner
          visible={this.props.isLoading}
          color={colors.primaryKeyColor}
        />
        <Toast
          ref="toast"
          style={{
            backgroundColor: colors.toast.warning,
            opacity: 1,
            borderRadius: responsive.h(5),
            padding: responsive.h(10),
          }}
        />
      </View>
    );
  }

  _deleteImage(item) {
    const array = this.state.images;
    const index = array.indexOf(item);
    array.splice(index, 1);
    this.setState({ images: array });
  }

  _onAttachment = () => {
    const options = {
      quality: 1,
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
    // getImage().then(info =>{
    //     console.log('info', info)
    // })

    ImagePicker.showImagePicker(options, (response) => {
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
          images: [...this.state.images, image],
          //imagesInformation: [...this.state.imagesInformation, { mineType: image.type, bytes: image.data }]
        });
      }
    });
  };

  async onNext() {
    Keyboard.dismiss();
    const { user } = this.props;
    const { spaceMainId, spaceMainCode } = user;
    const {
      time,
      day,
      title,
      content,
      phoneContact,
      userContact,
      vendorSelected,
      imagesInformation,
      isShowTime,
    } = this.state;

    if (title.length == 0) {
      return this.refs.toast.show(
        `${Strings.message.pleaseType} ${Strings.createRequest.title}`,
        DURATION.LENGTH_LONG
      );
    }
    if (content.length == 0) {
      return this.refs.toast.show(
        `${Strings.message.pleaseType} ${Strings.createRequest.content}`,
        DURATION.LENGTH_LONG
      );
    }

    return this.props.createRequestHandle({
      vendorSelected,
      contractSelected: {
        id: spaceMainId,
        name: spaceMainCode,
      },
      title,
      content,
      time: isShowTime ? moment(time).format("HH:mm") : "",
      day: isShowTime ? moment(day).format("DD/MM/YYYY") : "",
      userContact,
      phoneContact,
      imagesInformation: this.state.images.map((o) => ({
        mineType: o.type,
        bytes: o.data,
      })),
    });
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: responsive.h(20),
    backgroundColor: "#fff",
    borderTopRightRadius: responsive.h(20),
  },
  imageActive: {
    flex: 1,
    resizeMode: "contain",
  },
});

const mapStateToProps = (state) => ({
  vendorDetail: state.vendorDetail.data,
  user: state.auth.user,
  error: state.requestCreateResident.error,
  isLoading: state.requestCreateResident.isLoading,
  language: state.app.language,
});

//make this component available to the app
export default connect(
  mapStateToProps,
  { createRequestHandle }
)(CreateScreen);
