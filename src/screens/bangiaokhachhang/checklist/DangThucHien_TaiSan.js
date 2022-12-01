//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
  ScrollView,
  Modal,
  // KeyboardAvoidingView,
  Switch,
  TextInput,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
// import ListItem from './ListItem'
import Swipeable from "react-native-swipeable";

import Toast, { DURATION } from "react-native-easy-toast";
import moment from "moment";
//components

import SearchBar from "../../../components/common/SearchBar";
import ErrorContent from "../../../components/common/ErrorContent";

// import ButtonFilter from '../../../components/Service/Basic/ButtonFilter';
//style
import colors from "../../../theme/colors";
import fontsize from "../../../theme/fontsize";

//import {Icon,Content,Form,Picker,Item,Fab} from 'native-base'

//data
import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  progressHandle,
  HandoverHandle,
  UploadImages,
  DeleteImages,
} from "../../../actions/checklist_dangthuchien_taisan_khachhang";
import { HandOverAddCheckListData } from "../../../actions/checklist_dangthuchien_taisan";
import { CheckListAdd } from "../../../actions/checklist_dangthuchien_taisan";
import {
  HandOverStatus,
  HandOverChangeStatus,
  HandOverFinishDate,
} from "../../../actions/checklist_dangthuchien";
// import { loadDataHandle as loadDataHandleMaster,refreshDataHandle as refreshDataHandleMaster} from '../../../actions/checklist_dangthuchien'

import Strings from "../../../utils/languages";
import Loader_Detail from "../../../utils/Loader_Detail";
import { groupArray, sortAscending } from "../../../utils/Common";
import { show } from "../../../utils/Toast";
import { MyIcon } from "../../../theme/icons";

import ImageProgress from "../../../components/common/ImageProgress";
// import CommentView from './CommentView';

import ImagePicker from "react-native-image-picker";
import * as mineTypes from "react-native-mime-types";
import Lightbox from "react-native-lightbox";
import ImagePickerOption from "../../../constant/ImagePickerOption";

import ActionSheet from "../../../components/common/ActionSheet";
import DateTimePicker from "react-native-modal-datetime-picker";
import DatePicker from 'react-native-date-picker'
const { width, height } = Dimensions.get("window");
const icon_add = width / 7.3;

import NavBar from "../../../resident/components/common/NavBar";
import responsive from "../../../resources/responsive";
import { converStatusToByString } from "../../../utils/handover";
// create a component
class DangThucHien_TaiSan extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: Strings.profile.setting,
    headerBackTitle: null,
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: colors.appTheme,
      elevation: 0,
      borderBottomColor: "transparent",
      borderBottomWidth: 0,
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      searchKey: "",
      isApplySearchKey: false,
      status: 0,
      isShowSearch: false,
      showModal: false,
      // modalView: null,
      isDat: false,
      isKhongDat: false,
      ghiChu: "",
      // diengiai:'',
      images: [],
      item: {},
      isSave: false,
      showModalAddChecklist: false,
      nhom: "",
      tang: "",
      hangmuc: "",
      mota: "",
      nhomData: [],
      tangData: [],

      showActionStatus: false,
      actionDataStatus: [],

      isDateTimePickerVisible: false,
      nam: 0,
      thang: 0,
      ngay: 0,
      gio: 0,
      phut: 0,
      giay: 0,
    };
  }

  componentDidMount() {
    //console.log(this.props)
    this.props.resetStateByKey({ key: "initList", path: "", value: true });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errorResponse &&
      nextProps.errorResponse !== this.props.errorResponse
    ) {
      if (!nextProps.errorResponse.hasError) {
        this.props.refreshDataHandle();
      }
    }
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing
    ) {
      const data = {
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
        Id: this.props.item.id,
        // Id:7,
      };
      this.props.loadDataHandle(data);
    }
    if (nextProps.initList && nextProps.initList !== this.props.initList) {
      const data = {
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
        Id: this.props.item.id,
        // Id:7,
      };
      this.props.loadDataHandle(data);
      // console.log(groupArray(this.props.data,'GroupName'))
    }
    if (
      nextProps.errorCreate &&
      this.props.errorCreate !== nextProps.errorCreate
    ) {
      if (!nextProps.errorCreate.hasError) {
        this.props.refreshDataHandle();
        this.refs.toast.show(`${Strings.message.saveSuccess}!`, DURATION.LENGTH_LONG);
      }
    }
    if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
      this.props.refreshDataHandle();
    }
    if (
      nextProps.errorResponse &&
      this.props.errorResponse !== nextProps.errorResponse
    ) {
      this.setState({ showModal: false, modalView: null }, () => {
        if (nextProps.errorResponse && nextProps.errorResponse.hasError) {
          this.refs.toast.show(
            nextProps.errorResponse.message,
            DURATION.LENGTH_LONG
          );
        } else {
          this.refs.toast.show(`${Strings.message.saveSuccess}!`, DURATION.LENGTH_LONG);
        }
      });
    }
  }

  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }

  _renderContent() {
    const {
      emptyData,
      error,
      initList,
      data,
      isRefreshing,
      outOfStock,
      refreshDataHandle,
      loadDataHandle,
      isLoading,
    } = this.props;
    //console.log('data', groupArray(data, 'groupName'))
    //console.log('data', data)
    if (initList) {
      return (
        <View
          style={{
            paddingVertical: responsive.h(20),
          }}
        >
          <ActivityIndicator animating size="small" />
        </View>
      );
    }
    if (emptyData) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
      );
    }
    if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
      );
    }
    return (
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        refreshing={isRefreshing}
        onRefresh={() => refreshDataHandle()}
        data={groupArray(
          data.map((item, index) => {
            return { ...item, index };
          }),
          "groupName"
        )}
        ItemSeparatorComponent={() => (
          <View style={{ backgroundColor: colors.grayBorder, height: 1 }} />
        )}
        renderItem={({ item }) => this.renderItemNhom(item)}
        style={{ marginHorizontal: responsive.w(20) }}
      />
    );
  }

  item_click(item) {
    //console.log(item)

    var listImages = (item.image === null ? "" : item.image)
      .trim()
      .split(";")
      .filter((i) => {
        return i !== "";
      })
      .map((i) => {
        return {
          uri: item.url + i,
          url: i,
        };
      });

    // console.log(listImages)
    // return
    this.setState({
      showModal: true,
      item,
      images: listImages,
      isKhongDat: item.isNoQuality,
      ghiChu: item.Note,
      // diengiai:item.Description
      // modalView: this.renderDetail(item)
    });
  }

  renderItemTaiSan = (item) => {
    //console.log(item)
    return (
      <TouchableOpacity
        key={item.index}
        onPress={() => this.item_click(item)}
        style={{
          flex: 1,
          // backgroundColor: item.index % 2 === 0 ? "#fff" : colors.gray2,
          paddingHorizontal: responsive.h(18),
          // paddingVertical: responsive.h(10),
          // borderColor: colors.grayBorder,
          // borderBottomWidth: 1,
          width: "100%",
          borderWidth: 1,
          borderBottomWidth: responsive.h(3),
          borderRadius: responsive.h(13),
          padding: responsive.h(10),
          borderColor: "#f5f5f5",
          marginBottom: responsive.h(10),
        }}
      >
        <Text
          style={{
            flex: 1,
            paddingBottom: responsive.h(10),
            color: item.IsNoQuality ? colors.red : "#000",
            fontSize: responsive.h(15),
            fontFamily: "Inter-Bold",
          }}
          numberOfLines={1}
          lineBreakMode="tail"
        >
          {item.name}
        </Text>

        <Text
          style={{
            color: colors.appTheme,
            fontWeight: "bold",
            fontSize: responsive.h(14),
          }}
        >
          <Text
            style={{
              color: "#888888",
              fontStyle: "italic",
              fontFamily: "Inter-Regular",
              fontSize: responsive.h(14),
            }}
          >
            {Strings.handover.note}:{" "}
          </Text>
          {item.note}
        </Text>
      </TouchableOpacity>
    );
  };

  renderItemToaNha = (item) => {
    //console.log(item)
    return (
      <View key={item.key}>
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            fontSize: responsive.h(15),
            color: "black",
            paddingVertical: responsive.h(10),
          }}
        >
          {Strings.electric.floor}: {item.key}
        </Text>
        {item.values.map((i) => {
          return this.renderItemTaiSan(i);
        })}
      </View>
    );
  };

  renderItemNhom = (item) => {
    //console.log(groupArray(item.values, 'floorName'))
    // return
    const data = groupArray(item.values, "floorName").map((i) => {
      return this.renderItemToaNha(i);
    });

    return (
      <View key={item.key}>
        <Text
          style={{
            paddingTop: responsive.h(20),
            fontFamily: "Inter-Bold",
            fontSize: responsive.h(16),
            color: colors.appTheme,
          }}
        >
          {Strings.common.group}: {item.key}
        </Text>

        {/* sắp xếp tăng dần trước khi đưa dữ liệu đi */}
        {sortAscending(data, "key")}
      </View>
    );
  };

  renderFooter = () => {
    if (!this.props.isLoading || this.props.isRefreshing) return null;
    return (
      <View
        style={{
          paddingVertical: responsive.h(20),
        }}
      >
        <ActivityIndicator animating size="small" />
      </View>
    );
  };

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
          uri: response.uri,
          mineType:
            Platform.OS === "ios"
              ? mineTypes.lookup(response.uri)
              : response.type,
          bytes: response.data,
        };
        this.setState({ images: [...this.state.images, image] }, () => {
          console.log(this.state.images);
        });
      }
    });
  };

  _deleteImage = (item) => {
    // console.log('delete:')
    // console.log(item)
    // console.log(item.uri.substring(0,4).toLowerCase())

    // return
    if (item.uri.substring(0, 4).toLowerCase() === "http") {
      //ảnh đã up lên server rồi nên xoá trên server trước khi xoá trong mảng
      Alert.alert(
        Strings.handover.notify,
        `${Strings.handover.mesDeleteImage}?`,
        [
          //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
          {
            text: Strings.handover.cancel,
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: Strings.handover.ok,
            onPress: () => {
              this.props.DeleteImages(item.url).then((data) => {
                //nếu xoá ok thì xoá hẳn trong mảng images
                const array = this.state.images;
                const index = array.indexOf(item);
                array.splice(index, 1);
                this.setState({ images: array });
              });
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      //ảnh này mới chọn nên cho xoá
      const array = this.state.images;
      const index = array.indexOf(item);
      array.splice(index, 1);
      this.setState({ images: array });
    }
  };

  renderImages() {
    return (
      <View style={{ marginBottom: responsive.h(20), }}>
        {this.state.images.length > 0 ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: responsive.h(10), }}
          >
            {this.state.images.length < 5 && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.grayBorder,
                  borderRadius: responsive.h(5),
                  padding: responsive.h(5),
                  marginRight: responsive.h(10),
                  marginTop: responsive.h(10),
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
                      marginTop: responsive.h(10),
                      marginRight: responsive.h(10),
                      borderRadius: responsive.h(5),
                      backgroundColor: "#eeeeee",
                    }}
                    activeProps={{
                      style: styles.imageActive,
                    }}
                  >
                    <Image
                      source={{ uri: eachImage.uri }}
                      style={{ width: responsive.w(90), height: responsive.h(120), zIndex: 0, borderRadius: responsive.h(8) }}
                    />
                  </Lightbox>

                  <TouchableOpacity
                    onPress={() => this._deleteImage(eachImage)}
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
                    <Text style={{ padding: responsive.h(5), color: "#fff", fontSize: responsive.h(14) }}> X </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <TouchableOpacity
            onPress={() => this._onAttachment()}
            style={{
              backgroundColor: "#ffff",
              borderRadius: responsive.h(5),
              justifyContent: "center",
              alignItems: "center",
              marginTop: responsive.h(10),
              paddingVertical: responsive.h(20),
            }}
          >
            <MyIcon name="camera" size={responsive.h(20)} color="gray" />
            <Text
              style={{
                textAlign: "center",
                color: colors.gray1,
                fontFamily: "Inter-Regular",
                fontsize: responsive.h(14),
              }}
            >
              {Strings.createRequest.textPhoto}
            </Text>
          </TouchableOpacity>
        )}
        {/* <Spinner visible={this.props.isLoadingReponse} textContent={Strings.app.progressing} textStyle={{ color: '#FFF', fontSize: fontsize.small }} /> */}
        {/* <ActionSheet visible={showAction} data={methodProcess} renderItem={this.renderActionSheetItem} /> */}
      </View>
    );
  }

  renderDetail() {
    const loadingJSX = (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.appTheme,
          width: "80%",
          borderRadius: responsive.h(45),
          padding: responsive.h(10),
          alignSelf: "center",
          marginBottom: responsive.h(10),
        }}
      >
        <Loader_Detail flex={0} color={colors.white} />
        <Text style={{ color: "#fff", alignSelf: "center", fontSize: responsive.h(14) }}>
        {`${Strings.message.pleaseWait}...`}
        </Text>
      </View>
    );

    const btnJSX = (
      <View
        style={{
          bottom: 0,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isDat: false,
                isKhongDat: false,
                ghiChu: "",
                showModal: false,
                images: [],
              });
            }}
            style={{
              borderWidth: 1,
              borderColor: colors.appTheme,
              width: responsive.w(150),
              height: responsive.h(40),
              borderRadius: responsive.h(45),
              padding: responsive.h(10),
              marginBottom: responsive.h(10),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.appTheme,
                alignSelf: "center",
                fontSize: responsive.h(16),
                fontFamily: "Inter-Bold",
              }}
            >
              {Strings.handover.cancel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // this.setState({ showModal: false })
              // alert(this.state.isBinhThuong + '')
              this.item_thuchien();
            }}
            style={{
              backgroundColor: colors.appTheme,
              width: responsive.w(150),
              height: responsive.h(40),
              borderRadius: responsive.h(45),
              alignSelf: "center",
              marginBottom: responsive.h(10),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                alignSelf: "center",
                fontSize: responsive.h(16),
                fontFamily: "Inter-Bold",
              }}
            >
              {Strings.handover.ok}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.appOverView,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#f2f2f2",
            borderRadius: responsive.h(10),
            maxHeight: responsive.h(600),
            width: responsive.w(380),
            paddingHorizontal: responsive.h(20),
            paddingVertical: responsive.h(10),
          }}
        >
          <View
            style={{
              padding: responsive.h(10),
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: "black",
                fontWeight: "bold",
                fontSize: responsive.h(16),
              }}
            >
              {Strings.handover.handover}
            </Text>
          </View>
          <View
            style={{
              height: responsive.h(2),
              backgroundColor: "#cfcfcf",
            }}
          />
          <View>
            {/* {data && this.renderData(data)} */}

            {/* <Text style={{ margin:20,color:colors.appTheme,fontWeight:'bold',fontSize:20 }}>Hệ thống cửa nhôm kính, cửa đi, cửa sổ, vách kính</Text> */}
            <Text
              style={{
                marginHorizontal: responsive.h(10),
                fontWeight: "bold",
                fontSize: responsive.h(16),
                color: "black",
                paddingVertical: responsive.h(5),
              }}
            >
              {this.state.item.name}
            </Text>
            <Text
              style={{
                marginHorizontal: responsive.h(10),
                fontSize: responsive.h(14),
                color: "#888888",
                fontFamily: "Inter-Medium",
              }}
            >
              {this.state.item.description}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    marginRight: responsive.h(10),
                    fontWeight: "bold",
                    fontSize: responsive.h(14),
                  }}
                >
                  {Strings.handover.complete} /
                  <Text
                    style={{
                      color: this.state.isKhongDat
                        ? colors.red
                        : colors.appTheme,
                      fontWeight: "bold",
                      fontSize: responsive.h(14),
                    }}
                  >
                    {Strings.handover.failed}
                  </Text>
                </Text>
                <Switch
                  value={this.state.isKhongDat}
                  onValueChange={() => {
                    this.setState({ isKhongDat: !this.state.isKhongDat });
                  }}
                  style={{
                    marginVertical: responsive.h(20),
                    transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }],
                  }}
                />
              </View>
            </View>

            <TextInput
              style={{
                height: responsive.h(100),
                borderColor: colors.grayBorder,
                borderWidth: 0.5,
                borderRadius: responsive.h(8),
                paddingLeft: responsive.h(10),
                color: colors.appTheme,
                textAlignVertical: "top",
                fontSize: responsive.h(14),
                backgroundColor: "#ffff",
                fontFamily: "Inter-Medium",
              }}
              underline={false}
              multiline
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({ ghiChu: text })}
              value={this.state.ghiChu}
              placeholder={`${Strings.handover.note}...`}
              placeholderTextColor="#a5a5a5"
              //   multiline={true}
            />

            {this.renderImages()}
          </View>

          {this.state.isSave ? loadingJSX : btnJSX}
        </View>
      </View>
    );
  }

  item_thuchien = async () => {
    this.setState({ isSave: true });
    // return
    await this.props.UploadImages(this.state.images).then((data) => {
      if (data.length === this.state.images.length) {
        // return
        var _item = this.state.item;
        _item.valueChoose = this.state.isDat;
        _item.isNoQuality = this.state.isKhongDat;
        _item.note = this.state.ghiChu;
        var urls = "";
        data.forEach((i) => {
          urls = urls + i.url + ";";
        });

        _item.image = urls;
        //_item.url = urls;

        //console.log(_item)

        // return
        this.setState(
          {
            item: _item,
          },
          () => {
            var data = {
              item: this.state.item,
              Id: this.props.item.id,
              // Id:7,
            };
            this.props.HandoverHandle(data).then((data) => {
              //console.log('ket qua : ' + data)
              if (data) {
                this.setState(
                  {
                    isDat: false,
                    isKhongDat: false,
                    ghiChu: "",
                    // diengiai:'',
                    showModal: false,
                    images: [],
                    isSave: false,
                  },
                  () => {
                    //load data
                    this.props.refreshDataHandle();
                  }
                );
              } else {
                this.setState(
                  {
                    isSave: false,
                  },
                  () => {
                    show(`${Strings.message.saveError}!`);
                  }
                );
              }
            });
          }
        );
      }
    });

    // return
  };

  renderModalAddCheckList() {
    const loadingJSX = (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.appTheme,
          width: "80%",
          borderRadius: responsive.h(45),
          padding: responsive.h(10),
          alignSelf: "center",
          marginBottom: responsive.h(10),
        }}
      >
        <Loader_Detail flex={0} color={colors.white} />
        <Text style={{ color: "#fff", alignSelf: "center", fontSize: responsive.h(14)}}>
        {`${Strings.message.pleaseWait}...`.toLocaleUpperCase()}
        </Text>
      </View>
    );

    const btnJSX = (
      <View
        style={{
          alignItems: "flex-start",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: responsive.h(20),
          padding: responsive.h(10),
          marginTop: responsive.h(5),
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.setState({
              showModalAddChecklist: false,
              nhom: "",
              tang: "",
              hangmuc: "",
              mota: "",
            });
          }}
          style={{
            backgroundColor: "#fff",
            width: responsive.w(150),
            height: responsive.h(40),
            borderRadius: responsive.h(45),
            padding: responsive.h(10),
            alignSelf: "center",
            marginBottom: responsive.h(10),
            borderWidth: 1,
            borderColor: colors.appTheme,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.appTheme,
              alignSelf: "center",
              fontFamily: "Inter-Bold",
              fontSize: responsive.h(16),
            }}
          >
            {Strings.handover.cancel}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.item_AddCheckList();
          }}
          style={{
            backgroundColor: colors.appTheme,
            width: responsive.w(150),
            height: responsive.h(40),
            borderRadius: responsive.h(45),
            alignSelf: "center",
            marginBottom: responsive.h(10),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              alignSelf: "center",
              fontFamily: "Inter-Bold",
              fontSize: responsive.h(16),
            }}
          >
            {Strings.handover.ok}
          </Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.appOverView,
          justifyContent: "center",
          alignItems: "center",
          padding: responsive.h(10),
        }}
      >
        <View
          style={{
            height: responsive.h(584),
            width: responsive.w(380),
            backgroundColor: "#f2f2f2",
            borderRadius: responsive.h(10),
            paddingHorizontal: responsive.h(10),
          }}
        >
          <View
            style={{
              padding: responsive.h(10),
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: "black",
                fontWeight: "bold",
                fontSize: responsive.h(16),
                fontFamily: "Inter-Bold",
                paddingVertical: responsive.h(10),
              }}
            >
              {Strings.handover.add} {Strings.handover.nameTestItem}
            </Text>
            <View
              style={{
                height: responsive.h(2),
                backgroundColor: "#cfcfcf",
                width: "100%",
              }}
            />
          </View>
          <View
            style={{
              padding: responsive.h(10),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("NhomListScreen", {
                  nhom: this.state.nhomData,
                  onSelected: (nhom) =>
                    this.setState({ nhom, showModalAddChecklist: true }),
                });
                this.setState({
                  showModalAddChecklist: false,
                  modalView: null,
                });
              }}
              style={{
                padding: responsive.h(10),
                backgroundColor: "#ffff",
                flexDirection: "row",
                justifyContent: "space-between",
                borderRadius: responsive.h(15),
                marginBottom: responsive.h(10),
              }}
            >
              <Text
                style={{
                  paddingRight: responsive.h(10),
                  fontSize: responsive.h(14),
                  color: "#a5a5a5",
                }}
              >
                {this.state.nhom == ""
                  ? `${Strings.common.choose} ${Strings.common.group}`
                  : this.state.nhom.name}
              </Text>
              <MyIcon name="arrow-down" size={15} color={colors.gray1} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("TangListScreen", {
                  tang: this.state.tangData,
                  onSelected: (tang) =>
                    this.setState({ tang, showModalAddChecklist: true }),
                });
                this.setState({
                  showModalAddChecklist: false,
                  modalView: null,
                });
              }}
              style={{
                padding: responsive.h(10),
                backgroundColor: colors.gray2,
                flexDirection: "row",
                justifyContent: "space-between",
                borderRadius: responsive.h(15),
                backgroundColor: "#ffff",
                marginVertical: responsive.h(10),
              }}
            >
              <Text
                style={{
                  paddingRight: responsive.h(10),
                  fontSize: responsive.h(14),
                  color: "#a5a5a5",
                }}
              >
                {this.state.tang == ""
                  ? `${Strings.common.choose} ${Strings.electric.floor}`
                  : this.state.tang.name}
              </Text>
              <MyIcon name="arrow-down" size={15} color={colors.gray1} />
            </TouchableOpacity>

            <TextInput
              style={{
                height: responsive.h(100),
                width: "100%",
                borderRadius: responsive.h(8),
                paddingLeft: responsive.h(10),
                color: colors.appTheme,
                textAlignVertical: "top",
                backgroundColor: "#ffff",
                fontSize: responsive.h(14),
                borderRadius: responsive.h(16),
                marginTop: responsive.h(5),
              }}
              underline={true}
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({ hangmuc: text })}
              value={this.state.hangmuc}
              placeholder={`${Strings.handover.nameTestItem}...`}
              placeholderTextColor="#a5a5a5"
              multiline={true}
            />

            <TextInput
              style={{
                height: responsive.h(130),
                width: "100%",
                borderRadius: responsive.h(8),
                paddingLeft: responsive.h(10),
                color: colors.appTheme,
                textAlignVertical: "top",
                backgroundColor: "#ffff",
                fontSize: responsive.h(14),
                borderRadius: responsive.h(16),
                marginTop: responsive.h(15),
              }}
              underline={false}
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({ mota: text })}
              value={this.state.mota}
              placeholder={`${Strings.handover.describe}...`}
              placeholderTextColor="#a5a5a5"
              multiline={true}
            />
          </View>

          {this.state.isSave ? loadingJSX : btnJSX}
        </View>
      </View>
    );
  }

  item_AddCheckList = async () => {
    //console.log(this.props)
    //console.log(this.state)
    this.setState({ isSave: true });
    // return

    var data = [
      {
        //"id": 0,
        //"scheduleApartmentId": 0,
        groupName: this.state.nhom.name,
        description: this.state.mota,
        quality: "",
        image: "",
        url: "",
        note: "",
        valueInput: "",
        userAllowName: "",
        name: this.state.hangmuc,
        planName: "",
        userAllowNote: "",
        scheduleName: "",
        checklistName: "",
        floorName: this.state.tang.name,
        buildingId: this.props.item.buildingId,
        dateAction: "2020-06-16T01:23:17.384Z",
        dateAllow: "2020-06-16T01:23:17.384Z",
        valueChoose: true,
        isNoQuality: true,
      },
    ];
    this.props
      .CheckListAdd({
        data,
        Id: this.props.item.id,
        username: this.props.user.no,
      })
      .then((data) => {
        //console.log(data)
        if (data.status === 200) {
          this.setState(
            {
              showModalAddChecklist: false,
              isSave: false,
              nhom: "",
              tang: "",
              hangmuc: "",
              mota: "",
            },
            () => {
              //load data
              this.props.refreshDataHandle();
            }
          );
        } else {
          this.setState(
            {
              isSave: false,
            },
            () => {
              show(data.message);
            }
          );
        }
      });
  };

  renderData(data) {
    const {
      customerName,
      customerAvatar,
      description,
      dateCreate,
      isRead,
    } = data;
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              padding: responsive.h(20),
              backgroundColor: "#fff",
            }}
          >
            <ImageProgress
              circle={true}
              style={{
                height: responsive.h(50),
                width: responsive.h(50),
              }}
              source={{ uri: customerAvatar }}
            />
            <View style={{ flex: 1, justifyContent: "center", marginLeft: responsive.h(10),}}>
              <Text style={{ fontSize: fontSize.larg, fontWeight: "bold" }}>
                {customerName}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: responsive.h(5),
                }}
              >
                <Text style={{ color: colors.gray1, fontSize: responsive.h(14) }}>
                  {isRead ? "Đã nhận" : "Mới"}
                </Text>
                <Text style={{ color: colors.gray1, fontSize: responsive.h(14) }}>
                  {moment(dateCreate).format("DD/MM/YYYY HH:mm")}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={{ textAlign: "left", margin: responsive.h(10),}}> {description}</Text>
      </View>
    );
  }

  renderLoading() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.appOverView,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  item_status_click() {
    var parram = {
      isCustomer: true,
    };
    this.props.HandOverStatus(parram).then((data) => {
      //console.log(data)
      var list = data.map((i) => {
        return { id: i.id, name: i.name, isUpdateTime: i.updateTime };
      });

      this.setState({
        showActionStatus: true,
        actionDataStatus: list,
      });
    });
  }

  renderActionSheetItemStatus = ({ item }) => {
    const { id, name, isUpdateTime } = item;

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ showActionStatus: false }, () => {
            var dataSend = {
              id: this.props.item.id,
              statusId: id,
              statusName: name,
              employeeId: this.props.user.id,
            };

            // console.log('HandOverChangeStatus Khach Hang',dataSend)
            // return

            this.props
              .HandOverChangeStatus(dataSend)
              .then((data) => {
                if (data.status === 200) {
                  if (!isUpdateTime) {
                    setTimeout(() => {
                      show(`${Strings.message.saveSuccess}!`);
                      this.props.refreshDataHandle();
                    }, 500);
                  }
                } else {
                  setTimeout(() => {
                    show(data.message);
                  }, 500);
                }
              })
              .then(() => {
                if (isUpdateTime) {
                  //nếu rơi vào trạng thái đang còn lỗi thì cập nhật lại thời gia dự kiến hoàn thành tiếp theo
                  setTimeout(() => {
                    this._showDateTimePicker();
                  }, 500);
                }
              });
          });
        }}
        style={{
          borderBottomColor: colors.grayBorder,
          borderBottomWidth: 0.5,
          borderTopColor: colors.grayBorder,
          borderTopWidth: 0.5,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            margin: responsive.h(10),
            fontSize: responsive.h(16),
            color: "black",
            textAlign: "center",
            fontFamily: "Inter-Medium",
          }}
        >
          {converStatusToByString(name)}
        </Text>
      </TouchableOpacity>
    );
  };
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  _handleDatePicked = (date) => {
    this.setState(
      {
        nam: date.getFullYear(),
        thang:
          (date.getMonth() + 1).toString().length === 1
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1,
        ngay:
          date.getDate().toString().length === 1
            ? "0" + date.getDate()
            : date.getDate(),
        gio:
          date.getHours().toString().length === 1
            ? "0" + date.getHours()
            : date.getHours(),
        phut:
          date.getMinutes().toString().length === 1
            ? "0" + date.getMinutes()
            : date.getMinutes(),
        giay:
          date.getSeconds().toString().length === 1
            ? "0" + date.getSeconds()
            : date.getSeconds(),
      },
      () => {
        this._hideDateTimePicker();

        var data = {
          Id: this.props.item.Id,
          FinishDate:
            this.state.ngay + "/" + this.state.thang + "/" + this.state.nam,
        };
        // console.log(data)
        // return

        this.props.HandOverFinishDate(data).then((data) => {
          console.log(data)
          if (data.status === 200) {
            setTimeout(() => {
              show(`${Strings.message.saveSuccess}!`);
              this.props.refreshDataHandle();
            }, 500);
          } else {
            setTimeout(() => {
              show(data.message);
            }, 500);
          }
        });
      }
    );
  };

  render() {
    const { searchKey, isApplySearchKey } = this.state;
    const { isShowSearch } = this.state;
    return (
      <View style={styles.container}>
        {isShowSearch ? (
          <NavBar
            body={
              <SearchBar
                autofocus={true}
                value={searchKey}
                onChangeText={(searchKey) => {
                  this.setState({ searchKey }, () => {
                    if (searchKey.length === 0) {
                      if (this.state.isApplySearchKey) {
                        this.setState(
                          { searchKey: "", isApplySearchKey: false },
                          () => this.props.refreshDataHandle()
                        );
                      }
                    }
                  });
                }}
                onSubmitEditing={() =>
                  this.setState({ isApplySearchKey: true }, () =>
                    this.props.refreshDataHandle()
                  )
                }
                onClearText={() => {
                  const isApplySearchKeyOld = this.state.isApplySearchKey;
                  this.setState(
                    { searchKey: "", isApplySearchKey: false },
                    () => {
                      if (isApplySearchKeyOld) {
                        this.props.refreshDataHandle();
                      }
                    }
                  );
                }}
                style={{
                  // flex: 1,
                  // margin: Platform.OS == "ios" ? 5 : responsive.h(10),
                  marginHorizontal: responsive.h(10),
                }}
              />
            }
            rightView={
              <TouchableOpacity
                onPress={() => {
                  const isApplySearchKeyOld = this.state.isApplySearchKey;
                  this.setState(
                    {
                      isShowSearch: false,
                      searchKey: "",
                      isApplySearchKey: false,
                    },
                    () => {
                      if (isApplySearchKeyOld) {
                        this.props.refreshDataHandle();
                      }
                    }
                  );
                }}
                style={{ padding: responsive.h(10),}}
              >
                <Text style={{ color: "black" }}>{Strings.handover.cancel}</Text>
              </TouchableOpacity>
            }
          />
        ) : (
          <NavBar
            leftButton={
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{ padding: responsive.h(10),}}
              >
                <MyIcon size={responsive.h(20)} name="arrow" color="black" />
              </TouchableOpacity>
            }
            body={
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(18),
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "center",
                  color: "black",
                }}
              >
                {Strings.handover.navTitleDetail}
              </Text>
            }
            rightView={
              <TouchableOpacity
                onPress={() => {
                  this.setState(
                    {
                      showModalAddChecklist: true, //mở form lên
                    },
                    () => {
                      //load data cho danh mục nhóm và tầng
                      this.props.HandOverAddCheckListData().then((data) => {
                        //console.log('data', data)
                        this.setState({
                          nhomData: data.groupItems,
                          tangData: data.blockItems,
                        });
                      });
                    }
                  );
                }}
                style={{ padding: responsive.h(10),}}
              >
                <MyIcon size={responsive.h(20)} name="plus" color="black" />
              </TouchableOpacity>
            }
          />
        )}

        {this._renderContent()}
        {/* <Switch
                            onValueChange={(value)=>this.setState({isBinhThuong:value})}
                            value={this.state.isBinhThuong}
                        /> */}
        {/* <View><Text>abc</Text></View> */}
        {/* <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('requestCreate')}
                    style={{
                        backgroundColor: colors.appTheme,
                        width: responsive.h(50),
                        height: responsive.h(50),
                        borderRadius: responsive.h(35),
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: responsive.h(20),
                        right: 20
                    }}>
                    <MyIcon name="plus" size={20} color="#fff" />
                </TouchableOpacity> */}
        <Modal
          transparent={true}
          visible={this.state.showModal}
          onRequestClose={() => {
            this.setState({ showModal: false, modalView: null });
          }}
        >
          {/* {this.state.modalView} */}
          {this.renderDetail()}
        </Modal>

        <Modal
          transparent={true}
          visible={this.state.showModalAddChecklist}
          onRequestClose={() => {
            this.setState({ showModalAddChecklist: false, modalView: null });
          }}
        >
          {/* {this.state.modalView} */}
          {this.renderModalAddCheckList()}
        </Modal>
        <Toast
          ref="toast"
          style={{
            backgroundColor:
              this.props.errorResponse && this.props.errorResponse.hasError
                ? colors.toast.warning
                : colors.toast.success,
            opacity: 1,
            borderRadius: responsive.h(5),
            padding: responsive.h(10),
          }}
        />

        {/* chuyển trạng thái */}
        {/* <Fab
                    direction="up"
                    containerStyle={{
                    }}
                    style={{ backgroundColor: colors.appTheme, width: icon_add, height: icon_add }}
                    position="bottomRight"
                    onPress={() => this.item_status_click()}>
                    <Icon name="check" type="FontAwesome5" />
                </Fab> */}
        <TouchableOpacity
          onPress={() => this.item_status_click()}
          style={{
            backgroundColor: colors.appTheme,
            width: responsive.h(50),
            height: responsive.h(50),
            borderRadius: responsive.h(35),
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: responsive.h(20),
            right: responsive.h(20),
          }}
        >
          <MyIcon name="check" size={30} color="#fff" />
        </TouchableOpacity>

        <ActionSheet
          title="Chọn trạng thái"
          visible={this.state.showActionStatus}
          data={this.state.actionDataStatus}
          renderItem={this.renderActionSheetItemStatus}
          closeAction={() => this.setState({ showActionStatus: false })}
        />
        {/* <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          cancelTextIOS="Huỷ"
          confirmTextIOS="Xác nhận"
          titleIOS="Chọn thời gian"
          mode="date"
          locale="vi_VN" //https://gist.github.com/jacobbubu/1836273
        /> */}
        <DatePicker
          modal
          mode="date"
          open={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          confirmText={'Ok'}
          title={`${Strings.handover.mesTimeUpdate}`}
          cancelText={Strings.handover.cancel}
          date={new Date()}
          locale={this.props.language == 1 ? "vi_VN" : 'en_US'}
        />
      </View>
    );
  }
  _onCreate = (item) => {
    this.setState({ modalView: this.renderLoading() }, () => {
      this.props.progressHandle({
        id: item.id,
        description: this.state.description,
      });
    });
  };
  _onSelectedChange = (value) => {
    if (value == this.state.status) {
      this.setState({ status: 0 }, () => this.props.refreshDataHandle());
    } else {
      this.setState({ status: value }, () => this.props.refreshDataHandle());
    }
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({
  user: state.auth.user,
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  initList: state.checklist_dangthuchien_taisan_khachhang.initList,
  currentPage: state.checklist_dangthuchien_taisan_khachhang.currentPage,
  rowPerPage: state.checklist_dangthuchien_taisan_khachhang.rowPerPage,
  emptyData: state.checklist_dangthuchien_taisan_khachhang.emptyData,
  outOfStock: state.checklist_dangthuchien_taisan_khachhang.outOfStock,
  isLoading: state.checklist_dangthuchien_taisan_khachhang.isLoading,
  data: state.checklist_dangthuchien_taisan_khachhang.data,
  error: state.checklist_dangthuchien_taisan_khachhang.error,
  isRefreshing: state.checklist_dangthuchien_taisan_khachhang.isRefreshing,
  isApplySearchKey:
    state.checklist_dangthuchien_taisan_khachhang.isApplySearchKey,
  searchKey: state.checklist_dangthuchien_taisan_khachhang.searchKey,
  errorResponse: state.checklist_dangthuchien_taisan_khachhang.errorResponse,
  canNavigate: state.servicesBasicDetail.data == null,
  language: state.app.language == "vi" ? 1 : 2,
  item: state.checklist_dangthuchien_khachhang.item,
});

const mapActionToState = {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  progressHandle,
  HandoverHandle,
  UploadImages,
  DeleteImages,
  CheckListAdd,
  HandOverAddCheckListData,
  // loadDataHandleMaster,
  // refreshDataHandleMaster
  HandOverStatus,
  HandOverChangeStatus,
  HandOverFinishDate,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(DangThucHien_TaiSan);
