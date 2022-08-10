import React, { Component } from "react";
import {
  StatusBar,
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Alert,
  SafeAreaView
} from "react-native";
import { connect } from "react-redux";
import ImagePicker from "react-native-image-picker";
import * as mineTypes from "react-native-mime-types";
import _ from "lodash";
import { Screen } from "../utils/device";
import Device from "../utils/device";
import ImageProgress from "../components/common/ImageProgress";
import colors from "../theme/colors";
import { MyIcon } from "../theme/icons";
import Badge from "./common/Badge";
import { resetStateByKey } from "../actions/app";
import { getRequestStatusTotal, getVendorsList } from "../actions/request";
import { getServicesExtensionStatusTotal } from "../actions/servicesExtension";
import { loadDataHandle } from "../actions/vendor";
import { updateProfile } from "../actions/auth";
import { resetStateByKey as resetRequest } from "../actions/request";
import {
  resetStateByKey as resetAuth,
  loginUser,
  signOut,
} from "../actions/auth";
import { converStatusToIcon } from "../utils/request";
import FCM, { FCMEvent } from "react-native-fcm";
import LinearGradient from "react-native-linear-gradient";
import fontSize from "../theme/fontsize";
import Strings from "../utils/languages";
import ModalLogOut from "../components/common/ModalLogOut";
import responsive from "../resources/responsive";
class Drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModalLogout: false,
      showListVendor: false,
      isShowModalType: false,
      menuReport: [
        {
          id: 10,
          icon: "overview",
          name: "Tổng hợp",
        },
        {
          id: 11,
          icon: "phng-ban-01",
          name: "Phòng ban",
        },
        {
          id: 12,
          icon: "nhn-vin-01",
          name: "Nhân viên",
        },
        {
          id: 13,
          icon: "nhm-cv-01",
          name: "Nhóm công việc",
        },
        {
          id: 14,
          icon: "kho-st-01",
          name: "Khảo sát",
        },
      ],
      menuSetting: [
        // {
        //     id: 0,
        //     icon: 'setting',
        //     name: 'Thông báo'
        // },
        {
          id: 3,
          icon: "i-vai-tr-ng-dng-01",
          name: "Đổi vài trò người dùng",
        },
        {
          id: 4,
          icon: "danh-sch-ta-nh-01",
          name: "Danh sách toà nhà",
        },
        // {
        //     id: 1,
        //     icon: 'settings',
        //     name: 'Cài đặt'
        // },
        {
          id: 2,
          icon: "ng-xut-01",
          name: "Đăng xuất",
        },
      ],
      menuSetting1: [
        // {
        //     id: 0,
        //     icon: 'setting',
        //     name: 'Thông báo'
        // },
        {
          id: 1,
          icon: "settings",
          name: "Cài đặt",
        },
        {
          id: 2,
          icon: "logout",
          name: "Đăng xuất",
        },
      ],
      isMine: false,
    };
  }

  componentDidMount() {
    this.props.getRequestStatusTotal({ towerId: this.props.towerId });
    this.props.loadDataHandle();
  }

  componentWillUpdate(nextProps) {
    if (this.props.isMine !== nextProps.isMine) {
      this.props.getRequestStatusTotal({
        towerId: nextProps.user !== null ? nextProps.user.towerId : -1,
        isMine: nextProps.isMine,
      });
    }
    if (
      nextProps.user &&
      this.props.user &&
      nextProps.user !== this.props.user
    ) {
      this.props.getRequestStatusTotal({
        towerId: nextProps.user !== null ? nextProps.user.towerId : -1,
      });
    }
  }
  renderMenuStatus(menus) {
    if (menus.length == 0) return null;
    return (
      <View>
        <TouchableOpacity
          style={{
            marginTop: responsive.h(10),
            // paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft : responsive.h(20),
          }}
        >
          <Text style={styles.textTitle}>Phản ánh</Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <Text
              style={{
                marginRight : responsive.h(10),
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(14),
                fontWeight: "bold",
                textAlign: "left",
                color: "#494856",
              }}
            >
              Của tôi
            </Text>
            <Switch
              style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }}
              value={this.props.isMine}
              onValueChange={() =>
                this.props.resetRequest({
                  key: "isMine",
                  path: "",
                  value: !this.props.isMine,
                })
              }
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("DrawerClose");
            this.props.navigation.dispatch({
              type: "ON_STATUS_CHANGE",
              payload: 0,
            });
            this.props.navigation.navigate("requests", { title: "Tất cả" });
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical : responsive.h(10),
          }}
        >
          <View
            style={{
              borderRadius : responsive.h(6),
              backgroundColor: colors.grayBorder,
              padding : responsive.h(5),
              alignItems: "center",
              justifyContent: "center",
              marginRight : responsive.h(10),
              marginLeft : responsive.h(20),
              width: responsive.h(30), 
              height: responsive.h(30), 
            }}
          >
            <MyIcon name={converStatusToIcon(0)} color="black" size = {responsive.h(18)}/>
          </View>

          <Text style={styles.textInfo}>Tất cả</Text>
        </TouchableOpacity>
        <FlatList
          scrollEnabled={false}
          data={menus}
          renderItem={({ item }) => {
            const { id, name, total, colorCode } = item;
            return (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.dispatch({
                    type: "ON_STATUS_CHANGE",
                    payload: id,
                  });
                  this.props.navigation.navigate("requests", { idStatus: id });
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical : responsive.h(10),
                }}
              >
                <View
                  style={{
                    borderRadius : responsive.h(6),
                    backgroundColor: colors.grayBorder,
                    //padding : responsive.h(5),
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight : responsive.h(10),
                    marginLeft : responsive.h(20),
                    width: responsive.h(30), 
                    height: responsive.h(30), 
                  }}
                >
                  <MyIcon
                    name={converStatusToIcon(id)}
                    color="black"
                    size={responsive.h(18)}
                  />
                </View>
                <Text style={{ flex: 1, ...styles.textInfo }}>{name}</Text>
                {total > 0 && (
                  <View
                    style={{
                      marginLeft: responsive.h(8),
                      borderRadius: responsive.h(10),
                      height: responsive.h(20),
                      width: responsive.h(20),
                      backgroundColor: colorCode,
                      alignItems: "center",
                      justifyContent: "center",
                      marginHorizontal: responsive.h(10),
                    }}
                  >
                    <Text style={{ fontSize: responsive.h(10), margin: responsive.h(2), color: "#fff" }}>
                      {total}
                    </Text>
                  </View>
                )}

                {/* {total && <Badge number={total} style={{ marginHorizontal: responsive.h(10) }} />} */}
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    );
  }

  renderMenu(menus) {
    const isListBuilding = this.getLengthBuilding();
    return (
      <FlatList
        scrollEnabled={false}
        data={menus}
        renderItem={({ item }) => {
          const { id, icon, name, number } = item;
          return (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("DrawerClose");

                switch (id) {
                  case 0:
                    break;
                  case 1:
                    return this.props.navigation.navigate("setting");
                  case 2:
                    {
                      this.setState({ isShowModalLogout: true });
                    }
                    break;
                  case 3:
                    {
                      this.setState({ isShowModalType: true });
                    }
                    break;
                  case 4: {
                    return this.props.navigation.navigate("building", {
                      phoneNumber: this.props.phoneNumber,
                      password: this.props.password,
                    });
                  }

                  case 10: {
                    return this.props.navigation.navigate("generalStatistics");
                  }
                  case 11: {
                    return this.props.navigation.navigate("groupsStatistics");
                  }
                  case 12: {
                    return this.props.navigation.navigate("employeeStatistics");
                  }
                  case 13: {
                    return this.props.navigation.navigate(
                      "reportGroupsProgress"
                    );
                  }
                  case 14:
                    {
                      return this.props.navigation.navigate("reportSurvey");
                    }
                    break;
                  default:
                    break;
                }
              }}
              // style={{
              //     flexDirection: 'row',
              //     alignItems: 'center',
              //     paddingVertical : responsive.h(10)
              // }}
            >
              {id != 4 ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical : responsive.h(10),
                  }}
                >
                  <View
                    style={{
                      borderRadius : responsive.h(6),
                      backgroundColor: colors.grayBorder,
                      //padding : responsive.h(5),
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight : responsive.h(10),
                      marginLeft : responsive.h(20),
                      width: responsive.h(30), 
                      height: responsive.h(30), 
                    }}
                  >
                    <MyIcon name={icon} color="black" size = {responsive.h(18)}/>
                  </View>
                  <Text style={{ flex: 1, ...styles.textInfo }}>{name}</Text>
                </View>
              ) : (
                <View>
                  {isListBuilding > 0 ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical : responsive.h(10),
                      }}
                    >
                      <View
                        style={{
                          borderRadius : responsive.h(6),
                          backgroundColor: colors.grayBorder,
                          //padding : responsive.h(5),
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight : responsive.h(10),
                          marginLeft : responsive.h(20),
                          width: responsive.h(30), 
                      height: responsive.h(30), 
                        }}
                      >
                        <MyIcon name={icon} color="black" size = {responsive.h(18)}/>
                      </View>

                      <Text style={{ flex: 1, ...styles.textInfo }}>
                        {name}
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => `${index}`}
      />
    );
  }

  choiceVendor(item, user) {
    this.setState({ showListVendor: false });
    this.props.resetAuth({
      key: "user",
      path: "",
      value: {
        ...user,
        towerId: item.id,
        towerName: item.name,
        towerLogoUrl: item.logo,
      },
    });
  }

  renderVendorList(user) {
    if (_.isNil(this.props.dataVendor)) return null;
    return (
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <TouchableOpacity
          onPress={() => this.setState({ showListVendor: false })}
          style={{
            backgroundColor: colors.grayBorder,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: colors.grayBorder,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: responsive.h(25),
              width: responsive.h(45),
              height: responsive.h(45),
              marginHorizontal: responsive.h(20),
              marginVertical: responsive.h(10),
            }}
          >
            <MyIcon name="three-dot" size={responsive.h(25)} color={colors.appTheme} />
          </View>
        </TouchableOpacity>
        <FlatList
          data={this.props.dataVendor}
          renderItem={({ item }) => {
            const { logo, name, id } = item;
            return (
              <TouchableOpacity
                onPress={() => this.choiceVendor(item, user)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      user.towerId == id
                        ? "rgba(255,255,255,0.4)"
                        : "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: responsive.h(30),
                    width: responsive.h(45),
                    height: responsive.h(45),
                    marginHorizontal: responsive.h(20),
                    marginVertical: responsive.h(10),
                  }}
                >
                  <ImageProgress
                    source={{ uri: logo }}
                    circle={true}
                    style={{ width: responsive.h(40), height: responsive.h(40) }}
                  />
                </View>

                <Text style={{ flex: 1, fontSize: responsive.h(14) }}>{name}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    );
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
    const { user } = this.props;
    const fullName = user !== null ? user.name : "";
    const towerName = user !== null ? user.towerName : "";
    const photoUrl = user ? user.photoUrl : "";
    //console.log(this.props.dataVendor)
    return (
      <View
        style={{
          ...Device.defaultNavBarStyle(),
          flex: 1,
          backgroundColor: colors.grayBorder,
        }}
      >
        <SafeAreaView
        style={{ flex: 0, backgroundColor: "transparent", border: 0 }}
      />
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
        {/* header */}

        {user && (
            <View style={{ flexDirection: "row", marginTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight }}>
              <TouchableOpacity
                //onPress={() => this._onAttachment()}
                style={{
                  height: responsive.h(55),
                  width: responsive.h(55),
                  borderRadius: responsive.h(30),
                  borderWidth: 5,
                  borderColor: "rgba(255,255,255,0.4)",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: this.props.isLoading
                    ? "#fff"
                    : "transparent",
                }}
              >
                <ImageProgress
                  source={{ uri: photoUrl }}
                  circle={true}
                  style={{ height: responsive.h(50), width: responsive.h(50) }}
                />
              </TouchableOpacity>

              <View style={{ flex: 1, justifyContent: "center", marginLeft: responsive.h(10) }}>
                <Text
                  style={{
                    fontSize: responsive.h(16),
                    fontFamily: "Inter-Bold",
                    color: "black",
                    marginBottom: responsive.h(5)
                  }}
                >
                  {fullName}
                </Text>
                <View style={{ flexDirection: "row", alignItems: 'center', display: "flex" }}>
                  <MyIcon
                    name="profile1"
                    size={responsive.h(11)}
                    color="black"
                    style={{
                      marginRight: responsive.h(5),
                    }}
                  />
                  <Text
                    style={{
                      fontSize: responsive.h(14),
                      fontFamily: "Inter-Medium",
                      color: "black",
                    }}
                  >
                    {towerName}
                  </Text>
                </View>
              </View>
            </View>
          )}
        {this.state.showListVendor ? (
          this.renderVendorList(user)
        ) : (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#ffff",
                paddingHorizontal: responsive.h(10),
              }}
            >
              {this.props.dataVendor.map((o, index) => {
                if (index < 3) {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        this.props.resetAuth({
                          key: "user",
                          path: "",
                          value: {
                            ...user,
                            towerId: o.id,
                            towerName: o.name,
                            towerLogoUrl: o.logo,
                          },
                        })
                      }
                      style={{
                        backgroundColor:
                          user.towerId == o.id
                            ? "rgba(255,255,255,0.4)"
                            : "transparent",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: responsive.h(30),
                        width: responsive.h(45),
                        height: responsive.h(45),
                        margin: responsive.h(5),
                        marginLeft: responsive.h(5),
                      }}
                    >
                      <ImageProgress
                        source={{ uri: o.logo }}
                        circle={true}
                        style={{ height: responsive.h(40), width: responsive.h(40) }}
                      />
                    </TouchableOpacity>
                  );
                }
              })}
              {this.props.dataVendor.length > 3 && (
                <TouchableOpacity
                  onPress={() => this.setState({ showListVendor: true })}
                  style={{ padding: responsive.h(10) }}
                >
                  <View
                    style={{
                      backgroundColor: "#fff",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: responsive.h(30),
                      width: responsive.h(50),
                      height: responsive.h(50),
                    }}
                  >
                    <MyIcon
                      name="three-dot"
                      size={responsive.h(25)}
                      color={colors.appTheme}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              style={{ backgroundColor: "#fff" }}
              showsVerticalScrollIndicator={false}
            >
              {this.renderMenuStatus(this.props.dataStatus)}

              <View style={{ height: 1, backgroundColor: colors.grayBorder }} />

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("serviceBasic")}
                style={{ paddingVertical : responsive.h(20), paddingLeft : responsive.h(20) }}
              >
                <Text style={styles.textTitle}>Tiện ích</Text>
              </TouchableOpacity>

              <View style={{ height: 1, backgroundColor: colors.grayBorder }} />

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("serviceExtension")
                }
                style={{ paddingVertical : responsive.h(20), paddingLeft : responsive.h(20) }}
              >
                <Text style={styles.textTitle}>Dịch vụ</Text>
              </TouchableOpacity>

              <View style={{ height: 1, backgroundColor: colors.grayBorder }} />
              <View
                style={{ paddingTop : responsive.h(20), paddingLeft : responsive.h(20), paddingBottom : responsive.h(5) }}
              >
                <Text style={styles.textTitle}>Thống kê hệ thống</Text>
              </View>
              {this.renderMenu(this.state.menuReport)}

              <View style={{ height: 1, backgroundColor: colors.grayBorder }} />
              <View
                style={{ paddingTop : responsive.h(20), paddingLeft : responsive.h(20), paddingBottom : responsive.h(5) }}
              >
                <Text style={styles.textTitle}>Hệ thống</Text>
              </View>

              {this.renderMenu(
                this.props.typeList.length > 1
                  ? this.state.menuSetting
                  : this.state.menuSetting1
              )}
              <View style={{ height: 1, backgroundColor: colors.grayBorder }} />
              <View
                style={{
                  height: responsive.h(50),
                  flexDirection: "column",
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginBottom: responsive.h(10),
                    fontFamily: "OpenSans-Regular",
                    fontSize: responsive.h(14),
                    color: "#a0a0a0",
                  }}
                >
                  Version 1.0{" "}
                </Text>
              </View>
            </ScrollView>
          </View>
        )}
        <ModalLogOut
          isShow={this.state.isShowModalLogout}
          onPress={() => this.setState({ isShowModalLogout: false })}
        />

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
                  <Text>Đang tải</Text>
                </View>
              ) : (
                <View style={{ flex: 1, marginTop: responsive.h(70), alignItems: "center" }}>
                  <MyIcon name="accout" size={responsive.h(150)} color="#ffffff" />
                  <Text
                    style={{
                      fontSize: fontSize.medium,
                      color: "#fff",
                      marginTop: responsive.h(20),
                      margin: responsive.h(20),
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Phiên đã hết hạn. Bạn có muốn đăng nhập lại?
                  </Text>

                  <View style={{ flexDirection: "row", marginTop: responsive.h(100) }}>
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
                      <MyIcon name="x" size={responsive.h(30)} color={colors.appTheme} />
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
                    >
                      <MyIcon name="check" size={responsive.h(30)} color="#fff" />
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
                  <Text style={{fontSize: responsive.h(14),}}>Đang tải</Text>
                </View>
              ) : (
                <View style={{ flex: 1, marginTop: responsive.h(70), alignItems: "center" }}>
                  <MyIcon name="accout" size={150} color="#ffffff" />
                  <Text
                    style={{
                      fontSize: fontSize.medium,
                      color: "#fff",
                      marginTop: responsive.h(20),
                      margin: responsive.h(20),
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {Strings.profile.questionChangeUser}
                  </Text>

                  <View style={{ flexDirection: "row", marginTop: responsive.h(100) }}>
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
                      <MyIcon name="x" size={responsive.h(30)} color={colors.appTheme} />
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
                          type: "re",
                          otpCode: this.props.otpCode,
                          password: this.props.password,
                        })
                      }
                    >
                      <MyIcon name="check" size={responsive.h(30)} color="#fff" />
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
      title: "Chọn hình ảnh",
      takePhotoButtonTitle: "Chụp ảnh...",
      chooseFromLibraryButtonTitle: "Chọn ảnh từ thư viện...",
      cancelButtonTitle: "Bỏ qua",
      permissionDenied: {
        title: "Cấp quyền truy cập",
        text: "Cho phép ứng dụng chụp ảnh và chọn từ thư viên ảnh...",
        reTryTitle: "Thử lại",
        okTitle: "Cho phép",
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
        this.props.updateProfile({ image });
      }
    });
  };
}
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray2,
  },
  linearGradient: {
    flex: 1,
    backgroundColor: colors.primaryKeyColor,
  },
  textTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: responsive.h(18),
    fontWeight: "600",
    textAlign: "left",
    color: "#000",
  },
  textInfo: {
    fontFamily: "OpenSans-Regular",
    fontSize: responsive.h(16),
    textAlign: "left",
    color: "#494856",
  },
});
const mapStateToProps = (state) => ({
  user: state.auth.user,
  isLoading: state.auth.isLoading,
  error: state.auth.error,
  language: state.app.language,
  tokenDevice: state.auth.tokenDevice,
  dataStatus: state.drawer.data,
  dataVendor: state.vendor.data,
  isMine: state.request.isMine,
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  isLoadingChangeUser: state.auth.isLoading,
  typeList: state.auth.typeList,
  phoneNumber: state.auth.phoneNumber,
  otpCode: state.auth.otpCode,
  password: state.auth.Pass,
  dataBuilding: state.building.data,
});
const mapActionToProps = {
  resetStateByKey,
  getRequestStatusTotal,
  loadDataHandle,
  updateProfile,
  resetRequest,
  resetAuth,
  loginUser,
  signOut,
  getServicesExtensionStatusTotal,
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(Drawer);
