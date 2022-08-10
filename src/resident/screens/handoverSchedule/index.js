//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import FCM, {
  FCMEvent,
  NotificationType,
  WillPresentNotificationResult,
  RemoteNotificationResult,
} from "react-native-fcm";
import ImageProgress from "../../components/common/ImageProgress";
import NavBar from "../../components/common/NavBar";
import { MyIcon } from "../../theme/icons";
import fontsize from "../../theme/fontsize";
import _ from "lodash";
import ErrorContent from "../../components/common/ErrorContent";
import { Screen } from "../../utils/device";
import colors from "../../theme/colors";
import Strings from "../../utils/languages";
import { Calendar, LocaleConfig } from "react-native-calendars";
import {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
  loadDataDayListHandle,
  handoverSetProps,
} from "../../actions/handoverSchedule";
import Icon from "react-native-vector-icons/Entypo";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import { default_user } from "../../theme/images";
import { getDate, getDateTime, getDateApi } from "../../../utils/Common";
import responsive from "../../../resources/responsive";
// create a component
class HandoverScheduleScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);

    this.state = {
      showAction: false,
      markedDates: this.props.data,
      date:
        this.props.navigation.state.params != undefined &&
        this.props.navigation.state.params.date
          ? this.props.navigation.state.params.date
          : new Date(),
      itemSelected: null,
      showConfirm: false,
      f: false,
    };
  }
  componentDidMount() {
    //this.props.refreshDataHandle()
    this.props.resetStateByKey({ key: "initList", value: true });
    //     this.setState({ date: moment(this.props.navigation.state.params.date).format('YYYY-MM-DD') }, () => {

    //         const key = moment(this.props.navigation.state.params.date).format('YYYY-MM-DD');
    //         try {
    //             this.setState({ markedDates: { ...this.props.data, [key]: { ...(this.props.data[key] || {}), ...{ selected: true, textColor: '#fff', color: colors.appTheme, startingDay: true, endingDay: true } } } })
    //         } catch (error) { }
    //     })
    // }
    // console.log(this.props)
    // if(this.props.navigation.state.params != undefined && this.props.navigation.state.params.date){
    //     this.setState({ date: moment(this.props.navigation.state.params.date).format('YYYY-MM-DD') }, () => {

    //         const key = moment(this.props.navigation.state.params.date).format('YYYY-MM-DD');
    //         try{
    //         this.setState({ markedDates: { ...this.props.data, [key]: { ...(this.props.data[key] || {}), ...{ selected: true, textColor: 'red' } } } })
    //         }catch(error){}
    //     })
    // }
    const towerCustomer = this.props.user.towerCustomers.filter(
      (id) => id.idTower == this.props.towerId
    );
    // const data = {
    //     makh: towerCustomer[0].idCustomer
    // }
    // console.log('nhu2')
    // this.props.loadDataHandle(data);
    this.props.loadDataDayListHandle({
      date: getDateApi(this.state.date),
      makh: towerCustomer[0].idCustomer,
    });
  }
  componentWillUpdate(nextProps, nextState) {
    const towerCustomer = this.props.user.towerCustomers.filter(
      (id) => id.idTower == this.props.towerId
    );
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing
    ) {
      this.props.loadDataDayListHandle({
        date: getDateApi(this.state.date),
        makh: towerCustomer[0].idCustomer,
      });
    }
    if (
      nextProps.isRefreshingSchedul &&
      nextProps.isRefreshingSchedul !== this.props.isRefreshingSchedul
    ) {
      const data = {
        makh: towerCustomer[0].idCustomer,
      };
      this.props.loadDataHandle(data);
    }
    if (nextProps.initList && nextProps.initList !== this.props.initList) {
      const data = {
        makh: towerCustomer[0].idCustomer,
      };
      this.props.loadDataHandle(data);
    }
    // if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing && !nextProps.isLoading) {
    //     const data = {
    //         makh: towerCustomer[0].idCustomer
    //     }
    //     console.log('nhu3')
    //     this.props.loadDataHandle(data);
    // }
    // if (this.props.navigation.state.params != undefined && this.props.navigation.state.params.date) {
    //     this.setState({date: this.props.navigation.state.params.date})
    // }
    if (nextState.date && nextState.date !== this.state.date) {
      this.props.loadDataDayListHandle({
        date: getDateApi(nextState.date),
        makh: towerCustomer[0].idCustomer,
      });
    }
    // if (nextProps.markedDates && nextProps.markedDates !== this.props.markedDates) {
    //     this.setState({ markedDates: nextProps.markedDates })
    // }
    if (nextProps.data && nextProps.data !== this.props.data) {
      this.setState({ markedDates: nextProps.data });
    }

    if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
      const data = {
        makh: towerCustomer[0].idCustomer,
      };
      this.props.loadDataHandle(data);
    }

    // if (this.props.navigation.state.params != undefined && this.props.navigation.state.params.date && nextState.date && nextState.date == this.state.date) {
    //     const key = moment(this.props.navigation.state.params.date).format('YYYY-MM-DD');
    //     this.props.loadDataDayListHandle({ date: getDateApi(this.props.navigation.state.params.date), makh: towerCustomer[0].idCustomer })
    //     // this.setState({ date: moment(this.props.navigation.state.params.date).format('YYYY-MM-DD') },
    //     // { markedDates: { ...this.props.data, [key]: { ...(this.props.data[key] || {}), ...{ selected: true, textColor: '#fff', color: colors.appTheme, startingDay: true, endingDay: true } } } })
    // }
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.navigation.state.params != undefined &&
      this.props.navigation.state.params.date
    ) {
      this.setState(
        {
          date: moment(this.props.navigation.state.params.date).format(
            "YYYY-MM-DD"
          ),
        },
        () => {
          const key = moment(this.props.navigation.state.params.date).format(
            "YYYY-MM-DD"
          );
          try {
            this.setState({
              markedDates: {
                ...this.props.data,
                [key]: {
                  ...(this.props.data[key] || {}),
                  ...{
                    selected: true,
                    textColor: "#fff",
                    color: colors.appTheme,
                    startingDay: true,
                    endingDay: true,
                  },
                },
              },
            });
          } catch (error) {}
        }
      );
    }
  }
  renderContent = () => {
    const {
      emptyData,
      error,
      dataDayList,
      isRefreshing,
      isLoading,
    } = this.props;
    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator color={colors.appTheme} />
        </View>
      );
    }
    if (error) {
      return (
        <View
          style={{
            marginTop: responsive.h(10),
            marginHorizontal: responsive.w(-10),
            backgroundColor: colors.gray2,
            paddingTop: responsive.h(10),
            flex: 1,
          }}
        >
          <View
            style={{
              padding: responsive.h(10),
              backgroundColor: "#fff",
              borderTopEndRadius: responsive.h(50),
              borderTopStartRadius: responsive.h(50),
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: responsive.h(10),
              }}
            >
              <MyIcon name="calendar" color="#000" size={responsive.h(20)} />
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#000",
                  marginLeft: responsive.w(10),
                  fontSize: responsive.h(fontsize.small),
                }}
              >
                {moment(this.state.date).format("DD/MM/YYYY")}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() =>
                this.props.handoverSetProps({ isRefreshing: true, data: [] })
              }
            >
              <MyIcon
                name={"layers"}
                size={responsive.h(100)}
                color={colors.grayBorder}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#cccccc",
                  fontSize: fontsize.small,
                  textAlign: "center",
                  marginHorizontal: responsive.w(20),
                }}
              >
                {Strings.app.error}
              </Text>
            </TouchableOpacity>
            {/* <ErrorContent title={Strings.app.emptyData}
                onTouchScreen={() => this.props.handoverSetProps({ isRefreshing: true, data: [] })}
            /> */}
          </View>
        </View>
      );
    }
    if (dataDayList.length == 0) {
      return (
        <View
          style={{
            marginTop: responsive.h(10),
            marginHorizontal: responsive.w(-10),
            backgroundColor: colors.gray2,
            paddingTop: responsive.h(10),
            flex: 1,
          }}
        >
          <View
            style={{
              padding: responsive.h(10),
              backgroundColor: "#fff",
              borderTopEndRadius: responsive.h(50),
              borderTopStartRadius: responsive.h(50),
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: responsive.h(10),
              }}
            >
              <MyIcon name="calendar" color="#000" size={responsive.h(20)} />
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#000",
                  marginLeft: responsive.w(10),
                  fontSize: responsive.h(fontsize.small),
                }}
              >
                {moment(this.state.date).format("DD/MM/YYYY")}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() =>
                this.props.handoverSetProps({ isRefreshing: true, data: [] })
              }
            >
              <MyIcon
                name={"layers"}
                size={responsive.h(100)}
                color={colors.grayBorder}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#cccccc",
                  fontSize: responsive.h(fontsize.small),
                  textAlign: "center",
                  marginHorizontal: responsive.w(20),
                }}
              >
                {Strings.app.emptyData}
              </Text>
            </TouchableOpacity>
            {/* <ErrorContent title={Strings.app.emptyData}
                onTouchScreen={() => this.props.handoverSetProps({ isRefreshing: true, data: [] })}
            /> */}
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          marginTop: responsive.h(10),
          marginHorizontal: responsive.w(-10),
          backgroundColor: colors.gray2,
          paddingTop: responsive.h(10),
        }}
      >
        <View
          style={{
            padding: responsive.h(10),
            backgroundColor: "#fff",
            borderTopEndRadius: responsive.h(50),
            borderTopStartRadius: responsive.h(50),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: responsive.h(10),
            }}
          >
            <MyIcon name="calendar" color="#000" size={responsive.h(20)} />
            <Text
              style={{
                fontWeight: "bold",
                color: "#000",
                marginLeft: responsive.w(10),
                fontSize: responsive.h(fontsize.small),
              }}
            >
              {moment(this.state.date).format("DD/MM/YYYY")}
            </Text>
          </View>

          <FlatList
            refreshing={isRefreshing}
            onRefresh={() =>
              this.props.handoverSetProps({ isRefreshing: true, data: [] })
            }
            //ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
            data={dataDayList}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => `${index}`}
            // canNavigate={this.props.canNavigate}
            // navigation={this.props.navigation}
          />
        </View>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    const {
      apartmentName,
      buildingChecklistName,
      dateHandoverFrom,
      dateHandoverTo,
      planName,
      scheduleConfirmName,
      scheduleGroupName,
      scheduleName,
      statusName,
    } = item;
    return (
      <TouchableOpacity
      //style={{ flexDirection: 'row' }}
      //onPress={() => this.setState({ itemSelected: item, isShowModal: true, isAllowChangeShift: item.isAlow >= 0 })}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              height: responsive.h(10),
              width: responsive.w(25),
              backgroundColor: "#f4ad41",
              marginRight: responsive.w(5),
              marginLeft: responsive.h(-5),
              borderTopEndRadius: responsive.h(10),
              borderBottomEndRadius: responsive.h(10),
            }}
          />
          {/* <Icon name='arrow-bold-right' size={ 20 } color='#f4ad41' style={{ marginRight: 5, marginLeft: -5 }}/> */}
          <Text
            style={{
              fontSize: responsive.h(fontsize.small),
              fontWeight: "bold",
              color: "#000",
            }}
          >
            {moment(dateHandoverFrom).format("HH:mm")} -{" "}
            {moment(dateHandoverTo).format("HH:mm")}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            padding: responsive.h(10),
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderWidth: responsive.h(1),
            borderColor: colors.gray2,
            marginVertical: responsive.h(10),
            marginHorizontal: responsive.w(25),
            borderRadius: responsive.h(10),
          }}
        >
          {/* <ImageProgress
                        circle={true}
                        style={{
                            height: 60,
                            width: 60
                        }}

                        source={{ uri: employeeImageUrl }}
                    /> */}

          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      //flex: 1,
                      padding: responsive.h(10),
                      //flexDirection: 'row',
                      alignItems: "center",
                      backgroundColor: "#fff",
                      borderWidth: responsive.h(1),
                      borderColor: colors.gray2,
                      marginRight: responsive.w(10),
                      //marginHorizontal: 25,
                      borderRadius: responsive.h(50),
                    }}
                  >
                    <Icon2
                      name="home"
                      size={responsive.h(20)}
                      color={colors.gray1}
                    />
                  </View>

                  <View>
                    <Text
                      style={{
                        fontSize: responsive.h(fontsize.small),
                        fontWeight: "bold",
                        color: "#000",
                        alignItems: "center",
                      }}
                    >
                      {apartmentName}
                    </Text>
                    <Text
                      style={{
                        fontSize: responsive.h(fontsize.small),
                        color: colors.gray1,
                      }}
                    >
                      {buildingChecklistName}
                    </Text>
                    <Text
                      style={{
                        fontSize: responsive.h(fontsize.small),
                        color: colors.gray1,
                        fontStyle: "italic",
                      }}
                    >
                      {scheduleConfirmName == null || scheduleConfirmName == ""
                        ? "Chưa nhận"
                        : scheduleConfirmName}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "column" }}>
                {/* <View style={{ borderRadius: 45, height: 26, width: 26, backgroundColor: colors.appBackround, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: colors.appTheme }} numberOfLines={2} lineBreakMode="tail">{scheduleConfirmName}</Text>
                                </View> */}
                {/* <Icon name='dots-vertical-circle' size={ 30 } color={colors.appTheme} style={{ marginRight: 10 }}/> */}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const { isShowSearch } = this.state;
    const { user } = this.props;
    const uri = user ? { uri: user.photoUrl } : default_user;
    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("profile")}
              style={{ paddingVertical: responsive.h(10) }}
            >
              <ImageProgress
                style={{
                  height: responsive.h(40),
                  width: responsive.h(40),
                }}
                circle={true}
                resizeMode="stretch"
                type="0"
                source={user && !_.isNil(user.photoUrl) ? uri : default_user}
              />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                alignSelf: "center",
                color: "black",
                fontSize: responsive.h(fontsize.medium),
              }}
            >
              {Strings.handoverSchedule.title.toLocaleUpperCase()}
            </Text>
          }
          rightView={
            <TouchableOpacity
              onPress={() => this.props.refreshDataHandle()}
              style={{ paddingVertical: responsive.h(10) }}
            >
              <Icon name="cycle" color="black" size={responsive.h(20)} />
            </TouchableOpacity>
          }
        />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Calendar
            current={moment(this.state.date).format("YYYY-MM-DD")}
            // Collection of dates that have to be colored in a special way. Default = {}
            markedDates={this.state.markedDates}
            // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
            markingType={"period"}
            monthFormat={"MM/yyyy"}
            hideExtraDays={true}
            disableMonthChange={true}
            firstDay={1}
            enableSwipeMonths={true}
            onDayPress={(day) => {
              this.setState({ date: day.dateString }, () => {
                const key = day.dateString;
                try {
                  this.setState({
                    markedDates: {
                      ...this.props.data,
                      [key]: {
                        ...(this.props.data[key] || {}),
                        ...{
                          selected: true,
                          textColor: "#fff",
                          color: colors.appTheme,
                          startingDay: true,
                          endingDay: true,
                        },
                      },
                    },
                  });
                } catch (error) {}
              });
              //console.log('nhu')
            }}
            // dayComponent={(day) => {
            //     const {
            //         date, state, marking, theme, onPress
            //     } = day
            //     const { dotColor } = marking
            //     let selected = null
            //     return (
            //         <TouchableWithoutFeedback onPress={() => console.log(nhu)}>
            //             <View style={{ marginBottom: -5 }}>
            //                 <View style={{
            //                     //backgroundColor: marking.selected ? colors.appTheme : 'transparent',
            //                     padding: 2,
            //                     height:25,
            //                     width:25,
            //                     borderRadius: 45,
            //                     justifyContent:'center',
            //                     alignItems:'center'
            //                 }}
            //                 >
            //                     {/* <Text style={{ color: marking.selected ? '#fff' : state === 'today' ? colors.appTheme : '#000' }}>{date.day}</Text> */}
            //                 </View>
            //                 <View
            //                     style={{
            //                         height: 5,
            //                         width: 5,
            //                         borderRadius: 2.5,
            //                         //backgroundColor: dotColor,
            //                         alignSelf: 'center',
            //                         // marginTop: 5
            //                     }}
            //                 />
            //             </View>
            //         </TouchableWithoutFeedback>
            //     )
            // }}
          />
        </ScrollView>
        <View style={{ flex: 1 }}>{this.renderContent()}</View>
        {/* <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showConfirm}
                >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)', justifyContent: 'center', alignItems: 'center',  }}>
                         <View style={{
                width: '90%',
                borderRadius: 5,
            }}>
                <View
                    style={{
                        borderRadius: 10,
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        padding: 10
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            //backgroundColor: 'white'
                        }}
                    >

                    </View>
                </View>
                <TouchableOpacity
                    onPress={()=>this.setState({showConfirm: false})}
                    style={{ borderRadius: 45, position: 'absolute', backgroundColor: '#505c5c5c', padding: 5, top: -10, right: -10 }}>

                    <MyIcon
                        name="no"
                        size={15}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>

                    </View>
                </Modal> */}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9",
  },
  text: {
    color: "#fff",
    fontSize: responsive.h(30),
    fontWeight: "bold",
  },
  dot: {
    width: responsive.h(5),
    height: responsive.h(5),
    marginHorizontal: responsive.w(5),
    borderRadius: responsive.h(7),
    backgroundColor: "rgb(206, 209, 212)",
  },
  activeDot: {
    width: responsive.h(5),
    height: responsive.h(5),
    marginHorizontal: responsive.w(5),
    borderRadius: responsive.h(7),
    backgroundColor: "rgb(105, 109, 116)",
  },
});

const mapStateToProps = (state) => ({
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  data: state.handoverSchedule.data,
  //isLoading: state.handoverSchedule.isLoading,
  initList: state.handoverSchedule.initList,
  isRefreshingSchedul: state.handoverSchedule.isRefreshing,
  currentPage: state.handoverSchedule.currentPage,
  rowPerPage: state.handoverSchedule.rowPerPage,
  emptyData: state.handoverSchedule.emptyData,
  outOfStock: state.handoverSchedule.outOfStock,
  //error: state.handoverSchedule.error,
  isApplySearchKey: state.handoverSchedule.isApplySearchKey,
  searchKey: state.handoverSchedule.searchKey,
  user: state.auth.user,
  isLoading: state.handoverScheduleDayList.isLoading,
  dataDayList: state.handoverScheduleDayList.data,
  error: state.handoverScheduleDayList.error,
  isRefreshing: state.handoverScheduleDayList.isRefreshing,
});

const mapActionToState = {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
  loadDataDayListHandle,
  handoverSetProps,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(HandoverScheduleScreen);
