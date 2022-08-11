//import liraries
import React, { Component } from "react";
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Modal,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import ImagePicker from "react-native-image-picker";
import * as mineTypes from "react-native-mime-types";
import FCM from "react-native-fcm";

import { Screen } from "../../utils/device";
import { background } from "../../theme/images";

import FontSize from "../../theme/fontsize";
import { MyIcon } from "../../theme/icons";
import MenuItem from "../../components/profile/MenuItem";
import { signOut } from "../../actions/auth";
import colors from "../../theme/colors";
import ImageProgress from "../../components/common/ImageProgress";
import { updateProfile } from "../../actions/auth";
import auth from "../../redux/redercers/auth";
import fontSize from "../../theme/fontsize";
import Strings from "../../utils/languages";
import NavBar from "../../components/common/NavBar";
import fontsize from "../../theme/fontsize";
import {
  getOtpCodeHaveType,
  loginUser,
  changePhone,
  resetStateByKey,
  loginUserByPass,
  getOtpCodeNoType,
  setTypeResident,
  setTypeVendor,
  loginUserByPassVendor,
  loginUserByPassResident,
  signIn,
} from "../../../actions/auth";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import responsive from "../../../resources/responsive";
const MenuPicker = ({ name, onPress, icon }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: responsive.h(10),
      }}
    >
      <View
        style={{
          width: responsive.h(30),
          height: responsive.h(30),
          borderRadius: responsive.h(6),
          backgroundColor: colors.gray2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MyIcon
          name={icon}
          size={responsive.h(20)}
          color={"black"}
          //style={{ marginHorizontal: 20 }}
        />
      </View>

      <Text
        style={{
          fontFamily: "OpenSans-Regular",
          fontSize: responsive.h(16),
          fontWeight: "normal",
          fontStyle: "normal",
          letterSpacing: 0,
          textAlign: "left",
          color: "#494856",
          marginLeft: responsive.h(10),
        }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

// create a component
class ProfileScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      showInfo: false,
      isShowModalType: false,
      isLogOut: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    //console.log('componentWicomponentWillReceivePropsllUnmount')
    // if (nextProps && nextProps.error && nextProps.error.hasError) {
    //     Alert.alert('Thông báo', nextProps.error.message);
    // }
  }
  getLengthBuilding() {
    let count = 0;
    if (this.props.dataBuilding.length > 0) {
      let f = this.props.dataBuilding[0].building_ConnectString;
      this.props.dataBuilding.forEach((e) => {
        if (e.building_ConnectString !== f) {
          count++;
        }
      });
      return count;
    }

    return count;
  }
  render() {
    const isListBuilding = this.getLengthBuilding();
    const { signOut, user, tokenDevice } = this.props;
    return (
      <View style={styles.container}>
        <NavBar
          //body={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: fontSize.larg, color: '#fff' }}>{Strings.profile.setting.toLocaleUpperCase()}</Text></View>}
          leftButton={
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <MyIcon name="arrow" color="black" size={responsive.h(20)} />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                padding: responsive.h(10),
                width: Screen.width - responsive.w(124),
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(18),
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "black",
              }}
              numberOfLines={2}
              lineBreakMode="tail"
            >
              {Strings.profile.title}
            </Text>
          }
        />
        {/* <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.appTheme, marginTop: -30 }}>
                    <TouchableOpacity
                        onPress={() => this._onAttachment()}
                        style={{
                            height: 85,
                            width: 85,
                            borderRadius: 42.5,
                            borderWidth: 5,
                            borderColor: 'rgba(255,255,255,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: this.props.isLoading ? '#fff' : 'transparent'
                        }}>
                        <ImageProgress
                            circle
                            source={{ uri: `${user ? user.photoUrl : '' || require('../../resources/default_image.png')}` }}
                            style={{
                                borderRadius: 42.5,
                                height: 80,
                                width: 80,
                            }}
                        />

                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: 20 }}>
                        <Text style={{
                            color: 'white', fontFamily: "OpenSans-SemiBold",
                            fontSize: 20,
                            fontWeight: "600",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "left"
                        }}>{user ? user.fullName : ''}</Text>
                        <Text style={{
                            color: 'white', fontFamily: "OpenSans-SemiBold",
                            fontSize: 18,
                            fontWeight: "600",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "left"
                        }}>{user ? user.phoneNumber : ''}</Text>
                    </View>

                </View> */}
        <ScrollView>
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              justifyContent: "space-between",
              paddingHorizontal: responsive.h(20),
            }}
          >
            <View>
              <View style={{ paddingVertical: responsive.h(10) }} />
              <MenuPicker
                icon="sphere"
                name={Strings.profile.settinglanguage}
                onPress={() => this.props.navigation.navigate("setting")}
              />
              {this.props.typeList.length > 1 && (
                <MenuPicker
                  icon="profile"
                  name={Strings.profile.changeTypeUser}
                  onPress={() => this.setState({ isShowModalType: true })}
                />
              )}

              <MenuPicker
                icon="info3"
                name={Strings.login.changePass}
                onPress={() => this.props.navigation.navigate("changePass")}
              />
              {isListBuilding > 0 ? (
                <MenuPicker
                  icon="layers"
                  name={Strings.login.listBuilding}
                  onPress={() =>
                    this.props.navigation.navigate("building", {
                      phoneNumber: this.props.phoneNumber,
                      password: this.props.password,
                    })
                  }
                />
              ) : null}

              <MenuPicker
                icon="switch"
                name={Strings.profile.logout}
                onPress={() => this.setState({ isShowModal: true })}
              />
              {/* <TouchableOpacity onPress={() => this.setState({ isShowModal: true })} style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.grayBorder, flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
                            <Text style={{fontSize: fontsize.small, fontWeight: 'bold'}}>{Strings.profile.logout}</Text>
                        </TouchableOpacity> */}
            </View>
            {/*
            <View
              style={{
                marginTop: 20,
                flexDirection: "column",
                //backgroundColor: colors.gray2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginBottom: 10,
                  fontFamily: "OpenSans-Regular",
                  fontSize: 14,
                  fontWeight: "normal",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#494856",
                }}
              >
                Version 1.0{" "}
              </Text>
              <Text
                style={{
                  marginBottom: 10,
                  fontFamily: "OpenSans-Regular",
                  fontSize: 14,
                  fontWeight: "normal",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#494856",
                }}
              >
                © 2021 DIP Vietnam. All rights reserved.
              </Text>
            </View> */}
          </View>
        </ScrollView>
        <Modal visible={this.state.isShowModal} onRequestClose={() => null}>
          <LinearGradient
            colors={[colors.appTheme, "#fff"]}
            style={styles.linearGradient}
          >
            <View
              style={{
                flex: 1,
                marginTop: responsive.h(70),
                alignItems: "center",
              }}
            >
              <MyIcon name="switch1" size={responsive.h(150)} color="#fff" />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: responsive.h(fontSize.small),
                  color: "#fff",
                  marginTop: responsive.h(20),
                  margin: responsive.h(20),
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {Strings.profile.questionLogout}
              </Text>

              <View
                style={{ flexDirection: "row", marginTop: responsive.h(100) }}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ isShowModal: false })}
                  style={{
                    height: responsive.h(50),
                    width: responsive.h(50),
                    borderRadius: responsive.h(25),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: colors.appTheme,
                  }}
                >
                  <MyIcon
                    name="x"
                    size={responsive.h(20)}
                    color={colors.appTheme}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginLeft: responsive.h(50),
                    height: responsive.h(50),
                    width: responsive.h(50),
                    borderRadius: responsive.h(25),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.appTheme,
                  }}
                  onPress={() => {
                    this.setState({ isLogOut: true }),
                      this.setState({ isShowModal: true }, () =>
                        this.props.signOut({
                          towers: this.props.user.towers,
                          tokenDevice,
                        })
                      );
                  }}
                >
                  <MyIcon name="check" size={responsive.h(20)} color="#fff" />
                </TouchableOpacity>
              </View>
              {this.state.isLogOut && (
                <View>
                  <ActivityIndicator color={colors.appTheme} />
                </View>
              )}
            </View>
          </LinearGradient>
        </Modal>
        {/* <Modal
                    visible={this.state.isShowModalType}
                    onRequestClose={() => null}
                >
                    <LinearGradient
                        colors={[colors.appTheme, '#fff']}
                        style={styles.linearGradient}
                    >
                        <View style={{ flex: 1, marginTop: 70, alignItems: 'center' }}>
                            <MyIcon
                                name="user"
                                size={150}
                                color="#fff"
                            />
                            <Text style={{ fontSize: fontSize.larg, color: '#fff', marginTop: 20, margin: 20, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>{Strings.profile.questionChangeUser}</Text>

                            <View style={{ flexDirection: 'row', marginTop: 100 }}>
                                <TouchableOpacity
                                    style={{
                                        height: 50,
                                        width: 50,
                                        borderRadius: 25,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: colors.appTheme
                                    }}
                                    onPress={() => this.props.loginUser({ phoneNumber: this.props.phoneNumber, type: 'em', otpCode: this.props.otpCode })}
                                >
                                    <MyIcon
                                        name="check"
                                        size={30}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isShowModalType: false })}
                                    style={{
                                        marginLeft: 50,
                                        height: 50,
                                        width: 50,
                                        borderRadius: 25,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: colors.appTheme
                                    }}
                                >
                                    <MyIcon
                                        name="x"
                                        size={30}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </Modal> */}
        <Modal visible={this.state.isShowModalType} onRequestClose={() => null}>
          {this.props.error && this.props.error.hasError ? (
            <LinearGradient
              colors={[colors.appTheme, "#fff"]}
              style={styles.linearGradient}
            >
              {this.props.isLoadingChangeUser ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#fff",
                  }}
                >
                  <ActivityIndicator />
                  <Text style={{ fontSize: responsive.h(fontsize.small) }}>
                    {Strings.app.loading}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    marginTop: responsive.h(70),
                    alignItems: "center",
                  }}
                >
                  <MyIcon name="accout" size={responsive.h(150)} color="#fff" />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: responsive.h(fontSize.small),
                      color: "#fff",
                      marginTop: responsive.h(20),
                      margin: responsive.h(20),
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {Strings.app.message}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: responsive.h(100),
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.setState({ isShowModalType: false })}
                      style={{
                        height: responsive.h(50),
                        width: responsive.h(50),
                        borderRadius: responsive.h(25),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: colors.appTheme,
                      }}
                    >
                      <MyIcon
                        name="x"
                        size={responsive.h(30)}
                        color={colors.appTheme}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        marginLeft: responsive.h(50),
                        height: responsive.h(50),
                        width: responsive.h(50),
                        borderRadius: responsive.h(25),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.appTheme,
                      }}
                      onPress={() =>
                        this.props.signOut({
                          towers: this.props.user.towers,
                          tokenDevice: this.props.tokenDevice,
                        })
                      }
                      //onPress={() => this.props.loginUser({ phoneNumber: this.props.phoneNumber, type: 're', otpCode: this.props.otpCode })}
                    >
                      <MyIcon
                        name="check"
                        size={responsive.h(30)}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={[colors.appTheme, "#fff"]}
              style={styles.linearGradient}
            >
              {this.props.isLoadingChangeUser ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#fff",
                  }}
                >
                  <ActivityIndicator />
                  <Text style={{ fontSize: responsive.h(fontsize.small) }}>
                    {Strings.app.loading}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    marginTop: responsive.h(70),
                    alignItems: "center",
                  }}
                >
                  <MyIcon name="accout" size={responsive.h(150)} color="#fff" />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: fontSize.small,
                      color: "#fff",
                      marginTop: responsive.h(20),
                      margin: responsive.h(20),
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {Strings.profile.questionChangeUser}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: responsive.h(100),
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.setState({ isShowModalType: false })}
                      style={{
                        height: responsive.h(50),
                        width: responsive.h(50),
                        borderRadius: responsive.h(25),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        borderStyle: "solid",
                        borderWidth: responsive.h(1),
                        borderColor: colors.appTheme,
                      }}
                    >
                      <MyIcon
                        name="x"
                        size={responsive.h(20)}
                        color={colors.appTheme}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        marginLeft: responsive.h(50),
                        height: responsive.h(50),
                        width: responsive.h(50),
                        borderRadius: responsive.h(25),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.appTheme,
                      }}
                      onPress={() =>
                        this.props.loginUser({
                          phoneNumber: this.props.phoneNumber,
                          type: "em",
                          otpCode: this.props.otpCode,
                          password: this.props.password,
                        })
                      }
                    >
                      <MyIcon
                        name="check"
                        size={responsive.h(20)}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </LinearGradient>
          )}
        </Modal>
      </View>
    );
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
        this.props.updateProfile({ image, fullName: this.props.user.fullName });
      }
    });
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  linearGradient: {
    flex: 1,
    backgroundColor: colors.primaryKeyColor,
  },
});
const mapStateToProps = (state) => ({
  user: state.auth.user,
  isLoading: state.auth.isLoading,
  error: state.auth.error,
  language: state.app.language,
  tokenDevice: state.auth.tokenDevice,
  typeList: state.auth.typeList,
  phoneNumber: state.auth.phoneNumber,
  password: state.auth.Pass,
  otpCode: state.auth.otpCode,
  content: state.auth.content,
  isLoadingChangeUser: state.auth.isLoading,
  dataBuilding: state.building.data,
});

const mapActionToProps = {
  signOut,
  updateProfile,
  loginUser,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(ProfileScreen);
