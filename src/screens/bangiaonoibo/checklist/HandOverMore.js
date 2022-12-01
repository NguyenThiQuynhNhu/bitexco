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
  KeyboardAvoidingView,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { connect } from "react-redux";
// import ListItem from './ListItem'
import Swipeable from "react-native-swipeable";

// import Toast, { DURATION } from 'react-native-easy-toast';
import moment from "moment";
//components

import SearchBar from "../../../components/common/SearchBar";
import ErrorContent from "../../../components/common/ErrorContent";

// import ButtonFilter from '../../../components/Service/Basic/ButtonFilter';
//style
import colors from "../../../theme/colors";
import fontsize from "../../../theme/fontsize";
// import {Icon, Content,Form,Picker,Item,Fab,CheckBox} from 'native-base'
import Icon from "react-native-vector-icons/FontAwesome";

//data
import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  HandOverPlanData,
  HandOverPlanAdd,
} from "../../../actions/checklist_handovermore";

import Strings from "../../../utils/languages";
import { ChuyenTrang, getDate, getDateTime } from "../../../utils/Common";
import { show } from "../../../utils/Toast";
import NavBar from "../../../components/common/NavBar";
import { MyIcon } from "../../../theme/icons";
import ImageProgress from "../../../components/common/ImageProgress";
import { converStatusToByString } from "../../../utils/handover";
import responsive from "../../../resources/responsive";
// create a component
class HandOverMore extends Component {
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
      isloading: true,
      Apartments: [],
      Dutys: [],
      Groups: [],
      GroupId: 0,
    };
  }
  componentDidMount() {
    this.props
      .HandOverPlanData({
        buildingId: this.props.user.towerId,
      })
      .then((data) => {
        this.setState({ isloading: false });
        if (data.status != 200) {
          show(`${Strings.message.saveError}!`);
          return;
        }
        this.setState({
          Apartments: data.dataDetail.apartments,
          Dutys: data.dataDetail.duties,
          Groups: data.dataDetail.groups,
        });
      });
  }
  componentWillReceiveProps(nextProps) {
    // console.log('this ',this)

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
        employeeId: this.props.user.id,
        StatusId: this.state.statusId,
        tuNgay: getDate(this.props.utils.tuNgay),
        denNgay: getDate(this.props.utils.denNgay),
        BuildingId: this.props.user.towerId,
      };
      this.props.loadDataHandle(data);
    }
    if (nextProps.initList && nextProps.initList !== this.props.initList) {
      const data = {
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
        employeeId: this.props.user.id,
        StatusId: this.state.statusId,
        tuNgay: getDate(this.props.utils.tuNgay),
        denNgay: getDate(this.props.utils.denNgay),
        BuildingId: this.props.user.towerId,
      };
      this.props.loadDataHandle(data);
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
    if (this.state.isloading) {
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
    if (this.state.Apartments.length == 0) {
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
        data={this.state.Apartments}
        ItemSeparatorComponent={() => (
          <View style={{ backgroundColor: colors.grayBorder, height: 1 }} />
        )}
        renderItem={this.renderItem}
      />
    );
  }

  async item_click(item) {
    var _temp = this.state.Apartments.map((i) => {
      if (i.apartmentId == item.apartmentId) {
        const _IsChoose = i.isChoose;
        const _Duty =
          this.state.Dutys.length > 0 ? this.state.Dutys[0].id : null; //mặc định chọn ca đầu tiên
        const _DutyName =
          this.state.Dutys.length > 0 ? this.state.Dutys[0].name : ""; //mặc định chọn ca đầu tiên

        // console.log('DutyId ',_IsChoose ? null : this.state.Dutys[0].Id)
        return {
          ...i,
          isChoose: !_IsChoose, //nếu đang chọn thì bỏ chọn
          dutyId: _IsChoose ? null : _Duty, //nếu bỏ chọn thì xoá luôn ca trực
          dutyName: _IsChoose ? "" : _DutyName, //nếu bỏ chọn thì xoá luôn ca trực_DutyName
        };
      } else {
        return { ...i };
      }
    });
    this.setState({ Apartments: _temp });
  }

  item_duty_click(value, item) {
    var _temp = this.state.Apartments.map((i) => {
      if (i.apartmentId == item.apartmentId) {
        return {
          ...i,
          dutyId: value.id,
          dutyName: value.name,
        };
      } else {
        return { ...i };
      }
    });
    this.setState({ Apartments: _temp });
  }

  item_save_click() {
    this.setState({ isloading: true });

    if (this.state.GroupId == 0) {
      show(`${Strings.common.pleaseChoose} ${Strings.common.group}!`);
      this.setState({ isloading: false });
      return;
    }

    if (this.state.Apartments.filter((i) => i.isChoose).length == 0) {
      show(`${Strings.common.pleaseChoose} ${Strings.handover.apartment}!`);
      this.setState({ isloading: false });
      return;
    }

    this.state.Apartments.forEach((i) => {
      if (i.isChoose) {
        //nếu được chọn
        if (i.dutyId == null) {
          //thì kiểm tra xem đã chọn ca chưa
          show(`${Strings.common.pleaseChoose} ${Strings.handover.shift}!`);
          this.setState({ isloading: false });
          return;
        }
      }
    });
    // apartmentId: 6753
    // apartmentName: "DIP-006 - Tầng 1 - Block A"
    // buildingChecklistId: 8
    // buildingChecklistName: "Checklist Bàn giao nội bộ SwanPark 1A"
    // customerId: null
    // customerName: ""
    // dateHandoverFrom: "2020-06-23T15:55:33.9344092Z"
    // dateHandoverTo: "2020-06-23T15:55:33.9344092Z"
    // dateNotification: 0
    // dutyId: 1
    // dutyName: "Ca 1 (07:00 - 09:00)"
    // id: null
    // isChoose: true
    // userId: null
    // userName: ""

    // "id": 0,
    // "isChoose": true,
    // "apartmentId": 0,
    // "customerId": 0,
    // "buildingChecklistId": 0,
    // "userId": 0,
    // "dutyId": 0,
    // "apartmentName": "string",
    // "customerName": "string",
    // "buildingChecklistName": "string",
    // "userName": "string",
    // "dutyName": "string",
    // "dateHandoverFrom": "2020-06-23T08:24:21.951Z",
    // "dateHandoverTo": "2020-06-23T08:24:21.951Z",
    // "dateNotification": 0
    const parram = {
      scheduleGroupId: this.state.GroupId.id,
      employeeId: this.props.user.id,
      apartmentSchedule: this.state.Apartments,
      // "apartmentSchedule": [
      //     {
      //         apartmentId: 7993,
      //         apartmentName: "A-04-04 - Tầng 04 - BLock A",
      //         buildingChecklistId: 13,
      //         buildingChecklistName: "Checklist Bàn giao nội bộ SwanPark 1A",
      //         customerId: null,
      //         customerName: "",
      //         dateHandoverFrom: "2020-10-02T11:14:09.8032911",
      //         dateHandoverTo: "2020-10-02T11:14:09.8032911",
      //         dateNotification: 0,
      //         dutyId: 11,
      //         dutyName: "Ca 1 (08:00 - 12:00)",
      //         id: null,
      //         isChoose: true,
      //         userId: null,
      //         userName: ""
      //     }
      // ],
      buildingId: this.props.user.towerId,
    };
    // {
    //     name: this.props.user.username,
    //     pass: this.props.user.password,
    //     BuildingId: this.props.building.Id,
    //     ScheduleGroupId:this.state.GroupId,
    //     ApartmentSchedule:this.state.Apartments
    // }

    // console.log('parram ',parram)
    // return

    this.props.HandOverPlanAdd(parram).then((data) => {
      this.setState({ isloading: false });
      if (data != "OK") {
        show(data);
        return;
      }
      this.props.navigation.goBack();
    });

    // show('Thành công!')
  }

  renderItem = ({ item }) => {
    // return <ListItem item={item}
    //     onPressSwipe={() => this.setState({ showModal: true, modalView: this.renderCreateNote(item) })}
    //     onPress={() => this.setState({ showModal: true, modalView: this.renderDetail(item) })}
    // />
    //console.log('renderItem ',item)
    return (
      <Swipeable
        rightActionActivationDistance={50}
        rightButtons={[
          <TouchableOpacity
            onPress={() =>
              this.setState({
                showModal: true,
                modalView: this.renderCreateNote(item),
              })
            }
            style={{ flex: 1, justifyContent: "center", paddingLeft: responsive.h(10),}}
          >
            <Text />
          </TouchableOpacity>,
        ]}
      >
        <TouchableOpacity
          onPress={() => this.item_click(item)}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            // padding: responsive.h(20),
            paddingVertical: responsive.h(15),
            paddingRight: responsive.h(20),
            backgroundColor: "#fff",
          }}
        >
          <View
            style={{
              // backgroundColor:colors.gray1,
              paddingHorizontal: responsive.h(15),
              marginRight: responsive.h(10),
            }}
          >
            <CheckBox
              onTintColor={colors.appTheme}
              onCheckColor={colors.appTheme}
              style={{ color: colors.appTheme, alignSelf: "center" }}
              value={item.isChoose}
              onPress={() => this.item_click(item)}
            />
          </View>

          <View style={{ flex: 1, justifyContent: "center", marginLeft: responsive.h(10),}}>
            {/* <Text style={{ fontSize: fontSize.larg, fontWeight: 'bold' }}>{item.nhanvien}</Text> */}
            {/* <Text numberOfLines={2} lineBreakMode="tail" style={{ marginVertical: responsive.h(10),}}>{description}</Text> */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: responsive.h(5),
              }}
            >
              <Text style={{ color: colors.appTheme, fontWeight: "bold" }}>
                {item.apartmentName}
              </Text>
              {/* <Text style={{ color: colors.gray1 }}>{item.nhanvien}</Text> */}
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("NhomListScreen", {
                  nhom: this.state.Dutys,
                  onSelected: (Dutys) => this.item_duty_click(Dutys, item),
                });
              }}
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ paddingRight: responsive.h(10),}}>
                {item.dutyName == ""
                  ? `${Strings.common.pleaseChoose} ${Strings.handover.shift}...`
                  : item.dutyName}
              </Text>
              <MyIcon name="arrow-arrow-down" size={15} color={colors.gray1} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Swipeable>
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
  renderDetail(data) {
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
            height: "80%",
            width: "80%",
            backgroundColor: "#fff",
            borderRadius: responsive.h(10),
          }}
        >
          <View
            style={{
              padding: responsive.h(20),
              backgroundColor: colors.appTheme,
              borderTopLeftRadius: responsive.h(10),
              borderTopRightRadius: responsive.h(10),
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: fontsize.larg,
              }}
            >
              GÓP Ý
            </Text>
          </View>
          <ScrollView>{data && this.renderData(data)}</ScrollView>
          <TouchableOpacity
            onPress={() => this.setState({ showModal: false })}
            style={{
              backgroundColor: colors.appTheme,
              borderRadius: responsive.h(45),
              padding: responsive.h(10),
              width: "80%",
              alignSelf: "center",
              marginBottom: responsive.h(10),
            }}
          >
            <Text style={{ color: "#fff", alignSelf: "center" }}>
              {"đóng".toLocaleUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
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
              <Text style={{ fontSize: fontsize.larg, fontWeight: "bold" }}>
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
                <Text style={{ color: colors.gray1 }}>
                  {isRead ? "Đã nhận" : "Mới"}
                </Text>
                <Text style={{ color: colors.gray1 }}>
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
  renderCreateNote(item) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : ""}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0,0.3)",
        }}
      >
        <CommentView
          title="Phản hồi"
          onChangeText={(description) => this.setState({ description })}
          onYes={() => this._onCreate(item)}
          onClose={() => this.setState({ showModal: false, modalView: null })}
        />
      </KeyboardAvoidingView>
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
                <Text style={{ color: "#fff" }}>{Strings.handover.cancel}</Text>
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
                  alignSelf: "center",
                  color: "black",
                  fontSize: fontsize.larg,
                }}
              >
                BÀN GIAO THÊM
              </Text>
            }
            rightView={
              <TouchableOpacity
                onPress={() => this.item_save_click()}
                style={{ padding: responsive.h(10),}}
              >
                <Icon
                  style={{
                    fontSize: responsive.h(26),
                    paddingHorizontal: responsive.h(8),
                    color: "black",
                  }}
                  type="FontAwesome"
                  name="save"
                />
                {/* <MyIcon
                                    size={20}
                                    name="search"
                                    color={colors.white} /> */}
              </TouchableOpacity>
            }
          />
        )}
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("NhomListScreen", {
              nhom: this.state.Groups,
              onSelected: (GroupId) => this.setState({ GroupId }),
            });
          }}
          style={{
            padding: responsive.h(15),
            backgroundColor: colors.gray2,
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: colors.grayBorder,
          }}
        >
          <Text style={{fontSize: responsive.h(14)}}>
            {this.state.GroupId == ""
              ? "Vui lòng chọn nhóm..."
              : this.state.GroupId.name}
          </Text>

          <MyIcon size={responsive.h(20)} name="arrow-arrow-down" color={colors.appTheme} />
        </TouchableOpacity>
        <View style={{ paddingHorizontal: responsive.h(10),}}>{this._renderContent()}</View>
        {/* <Content>
                    <Form style={{ paddingHorizontal: responsive.h(10),}}>
                        <Item picker>
                            <Icon name='layer-group' type='FontAwesome5' />
                            <Picker
                                headerBackButtonText='Quay lại'
                                note
                                placeholder='Vui lòng chọn nhóm!'
                                textStyle={{color:colors.appTheme,fontWeight:'500'}}
                                placeholderStyle={{color:colors.gray1}}
                                iosHeader='Chọn'
                                mode="dialog"
                                selectedValue={this.state.GroupId}
                                onValueChange={(value) => {
                                    this.setState({
                                        GroupId: value
                                    });
                                }}
                            >
                                {
                                    this.state.Groups.map(item => {
                                        return <Picker.Item key={item.Id} label={item.Name} value={item.Id} />
                                    })
                                }

                            </Picker>
                        </Item>


                    </Form>
                    {this._renderContent()}
                </Content> */}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({
  user: state.auth.user,
  building: state.auth.building,
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  initList: state.checklist_dangthuchien.initList,
  currentPage: state.checklist_dangthuchien.currentPage,
  rowPerPage: state.checklist_dangthuchien.rowPerPage,
  emptyData: state.checklist_dangthuchien.emptyData,
  outOfStock: state.checklist_dangthuchien.outOfStock,
  isLoading: state.checklist_dangthuchien.isLoading,
  data: state.checklist_dangthuchien.data,
  error: state.checklist_dangthuchien.error,
  isRefreshing: state.checklist_dangthuchien.isRefreshing,
  isApplySearchKey: state.checklist_dangthuchien.isApplySearchKey,
  searchKey: state.checklist_dangthuchien.searchKey,
  errorResponse: state.checklist_dangthuchien.errorResponse,
  canNavigate: state.servicesBasicDetail.data == null,
  language: state.app.language == "vi" ? 1 : 2,
  utils: state.utils,
});

const mapActionToState = {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  HandOverPlanData,
  HandOverPlanAdd,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(HandOverMore);
