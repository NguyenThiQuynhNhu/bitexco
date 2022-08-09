import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { Screen } from "../../../utils/device";
import Strings from "../../../utils/languages";
import NavBar from "../../../components/common/NavBar";
import fontsize from "../../../theme/fontsize";
import colors from "../../../theme/colors";
import { MyIcon } from "../../../theme/icons";
import moment from "moment";
import ErrorContent from "../../../components/common/ErrorContent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Lookup from "../../../components/Request/RequestCreate/Lookup";
import Toast, { DURATION } from "react-native-easy-toast";
import ImagePicker from "react-native-image-picker";
import Lightbox from "react-native-lightbox";
import * as mineTypes from "react-native-mime-types";
import RNFetchBlob from "rn-fetch-blob";
const fs = RNFetchBlob.fs;
let imagePath = null;
import Spinner from "react-native-loading-spinner-overlay";
//
import {
  refreshDataHandle,
  createCarCardHandle,
} from "../../../actions/carCard";
class CarCardCreateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardID: 0,
      cardHolder: "",
      typeID: null,
      licencePlate: "",
      carColor: "",
      typeCarName: null,
      typeName: "",
      images: [],
      imagesInformation: [],
    };
  }
  async componentDidMount() {
    if (this.props.navigation.state.params) {
      //nếu có ảnh thì edit lại để hiển thị
      if (
        this.props.navigation.state.params.image &&
        this.props.navigation.state.params.image.length > 0
      ) {
        let ar = [];
        await this.props.navigation.state.params.image.forEach((element) => {
          ar.push({ uri: element.imageUrl, isEdit: true });
        });
        await this.setState({
          images: ar,
        });
      }

      this.setState({
        cardID: this.props.navigation.state.params.cardID,
        cardHolder: this.props.navigation.state.params.cardHolder,
        typeID: this.props.navigation.state.params.typeID,
        licencePlate: this.props.navigation.state.params.licencePlate,
        carColor: this.props.navigation.state.params.carColor,
        typeCarName: this.props.navigation.state.params.typeCarName,
        typeName: this.props.navigation.state.params.typeName,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.error && nextProps.error !== this.props.error) {
      if (!nextProps.error.hasError) {
        this.props.navigation.goBack();
        this.props.refreshDataHandle();
      } else {
        this.refs.toast.show(nextProps.error.message, DURATION.LENGTH_LONG);
      }
    }
  }
  componentWillUnmount() {}
  async onNext() {
    const { user } = this.props;
    const { spaceMainId, spaceMainCode } = user;
    const {
      cardID,
      cardHolder,
      typeID,
      licencePlate,
      carColor,
      typeCarName,
      typeName,
    } = this.state;

    if (cardHolder.length == 0) {
      return this.refs.toast.show(`Vui lòng nhập chủ xe`, DURATION.LENGTH_LONG);
    }
    if (licencePlate == 0) {
      return this.refs.toast.show(
        `Vui lòng nhập biển số xe`,
        DURATION.LENGTH_LONG
      );
    }
    // if (carColor == 0) {
    //     return this.refs.toast.show(`Vui lòng nhập màu xe`, DURATION.LENGTH_LONG);
    // }
    // if (typeCarName == 0) {
    //     return this.refs.toast.show(`Vui lòng nhập đời xe`, DURATION.LENGTH_LONG);
    // }
    if (typeID == null) {
      return this.refs.toast.show(
        `Vui lòng chọn loại xe`,
        DURATION.LENGTH_LONG
      );
    }
    if (this.state.images.length > 0) {
      let ar2 = [];
      await this.state.images.forEach((element) => {
        if (element.isEdit) {
          RNFetchBlob.config({
            fileCache: true,
          })
            .fetch("GET", element.uri)
            .then((resp) => {
              // the image path you can use it directly with Image component
              imagePath = resp.path();
              return resp.readFile("base64");
            })
            .then((base64Data) => {
              console.log("isEdit2");
              ar2.push({ bytes: base64Data, mineType: "image/jpeg" });
            });
        } else {
          ar2.push({ bytes: element.data, mineType: "image/jpeg" });
        }
      });
      await this.setState({ imagesInformation: ar2 });
    } else {
      await this.setState({ imagesInformation: [] });
    }

    await setTimeout(() => {
      return this.props.createCarCardHandle({
        cardID,
        cardHolder,
        typeID,
        licencePlate,
        carColor,
        typeCarName,
        departmentID: spaceMainId,
        imagesInformation: this.state.imagesInformation,
      });
    }, 1000);
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
      console.log(response);
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
          //imagesInformation: [...this.state.imagesInformation, { mineType: image.type, bytes: image.data, id: moment().format('YYYYMMDDHHmmssms')}]
        });
      }
    });
  };
  _deleteImage(item) {
    const array = this.state.images;
    const index = array.indexOf(item);
    array.splice(index, 1);
    this.setState({ images: array });
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
              {Strings.carCard.name}
            </Text>
          }
          rightView={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  this.onNext();
                }}
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <MyIcon name="paperplane" color="black" size={24} />
              </TouchableOpacity>
            </View>
          }
        />
        <KeyboardAwareScrollView
          style={{ borderTopRightRadius: 20, paddingHorizontal: 20 }}
        >
          <View style={styles.container}>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "space-between",
                borderTopRightRadius: 20,
              }}
            >
              <Text
                style={{
                  color: "#282828",
                  fontFamily: "Inter-Bold",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {Strings.carCard.carOwnerText} (*)
              </Text>

              <TextInput
                maxLength={50}
                underline={false}
                style={{
                  width: "100%",
                  flex: 1,
                  height: 40,
                  padding: 10,
                  textAlignVertical: "center",
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  fontSize: fontsize.small,
                  fontFamily: "Inter-Regular",
                  borderRadius: 8,
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#cbcbcb",
                }}
                placeholder={Strings.carCard.placeholderOwner}
                placeholderTextColor="#6b6b6b"
                value={this.state.cardHolder}
                underlineColorAndroid="transparent"
                onChangeText={(cardHolder) => {
                  this.setState({ cardHolder });
                }}
              />
            </View>

            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginTop: 20,
                borderTopRightRadius: 20,
              }}
            >
              <Text
                style={{
                  color: "#282828",
                  fontFamily: "Inter-Bold",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {Strings.carCard.licensePlateText} (*)
              </Text>

              <TextInput
                maxLength={50}
                underline={false}
                style={{
                  width: "100%",
                  flex: 1,
                  height: 40,
                  padding: 10,
                  textAlignVertical: "center",
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  fontSize: fontsize.small,
                  fontFamily: "Inter-Regular",
                  borderRadius: 8,
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#cbcbcb",
                }}
                placeholder={Strings.carCard.placeholderlicensePlate}
                placeholderTextColor="#6b6b6b"
                value={this.state.licencePlate}
                underlineColorAndroid="transparent"
                onChangeText={(licencePlate) => {
                  this.setState({ licencePlate });
                }}
              />
            </View>

            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginTop: 20,
                borderTopRightRadius: 20,
              }}
            >
              <Text
                style={{
                  color: "#282828",
                  fontFamily: "Inter-Bold",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {Strings.carCard.carColorText}
              </Text>

              <TextInput
                maxLength={50}
                underline={false}
                style={{
                  width: "100%",
                  flex: 1,
                  height: 40,
                  padding: 10,
                  textAlignVertical: "center",
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  fontSize: fontsize.small,
                  fontFamily: "Inter-Regular",
                  borderRadius: 8,
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#cbcbcb",
                }}
                placeholder={Strings.carCard.placeholderColor}
                placeholderTextColor="#6b6b6b"
                value={this.state.carColor}
                underlineColorAndroid="transparent"
                onChangeText={(carColor) => {
                  this.setState({ carColor });
                }}
              />
            </View>

            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginVertical: 20,
                borderTopRightRadius: 20,
              }}
            >
              <Text
                style={{
                  color: "#282828",
                  fontFamily: "Inter-Bold",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {Strings.carCard.carModelText}
              </Text>

              <TextInput
                maxLength={50}
                underline={false}
                style={{
                  width: "100%",
                  flex: 1,
                  height: 40,
                  padding: 10,
                  textAlignVertical: "center",
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  fontSize: fontsize.small,
                  fontFamily: "Inter-Regular",
                  borderRadius: 8,
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#cbcbcb",
                }}
                placeholder={Strings.carCard.placeholderModel}
                placeholderTextColor="#6b6b6b"
                value={this.state.typeCarName}
                underlineColorAndroid="transparent"
                onChangeText={(typeCarName) => {
                  this.setState({ typeCarName });
                }}
              />
            </View>
            <Lookup
              fielName={`${Strings.carCard.carTypeText} (*)`}
              text={
                this.state.typeID
                  ? this.state.typeName
                  : Strings.carCard.placeholderType
              }
              onPress={() =>
                this.props.navigation.navigate("listTypeCar", {
                  onSelected: (typeSelected) =>
                    this.setState({
                      typeID: typeSelected.typeID,
                      typeName: typeSelected.typeName,
                    }),
                })
              }
            />
            {this.state.images.length > 0 ? (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 20 }}
              >
                {this.state.images.length < 5 && (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: colors.grayBorder,
                      borderRadius: 8,
                      padding: 5,
                      marginTop: 10,
                      marginRight: 10,
                    }}
                  >
                    <MyIcon
                      onPress={() => this._onAttachment()}
                      name="image2"
                      size={40}
                      color="#a8acaf"
                    />
                    <View
                      style={{
                        borderRadius: 2,
                        backgroundColor: "#abafb2",
                        padding: 3,
                        //borderTopRightRadius: 20,
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
                        {Strings.createRequest.textPhoto}
                      </Text>
                    </View>
                  </View>
                )}

                {this.state.images.map((eachImage, y) => {
                  //console.log(eachImage.uri)
                  return (
                    <View key={y}>
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
                <MyIcon name="image2" size={40} color="#a8acaf" />
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
                    {Strings.createRequest.textPhoto}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
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
            borderRadius: 5,
            padding: 10,
          }}
        />
      </View>
    );
  }
}
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
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  error: state.carCardCreate.error,
  isLoading: state.carCardCreate.isLoading,
});

const mapActionToProps = {
  refreshDataHandle,
  createCarCardHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(CarCardCreateScreen);
