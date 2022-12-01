import PropTypes from "prop-types";
import React from "react";
import moment from "moment";
import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import {
  statusRefreshDataHandle,
  timeRefreshDataHandle,
  ratingRefreshDataHandle,
} from "../../../actions/reportGroupProgress";
import DatePicker from 'react-native-date-picker'
import DateTimePicker from "react-native-modal-datetime-picker";
import { MyIcon } from "../../../theme/icons";
import fontSize from "../../../theme/fontsize";
import colors from "../../../theme/colors";
import PrimaryButton from "../../../components/common/PrimaryButton";
import ModalPicker from "../../../components/common/ModalPickerDateStatis";
import FilterType from "../../../components/statistics/FilterType";
import ButtonFilter from "../../../components/statistics/ButtonFilter";
import fontsize from "../../../theme/fontsize";
import StackedBarChart from "../controls/StackedBarChart";
import ReportGroupProgressStatus from "./ReportGroupProgressStatus";
import ReportGroupProgressTimeComplete from "./ReportGroupProgressTimeComplete";
import ReportGroupProgressRating from "./ReportGroupProgressRating";
import Icon from "react-native-vector-icons/Entypo";
import NavBar from "../../../resident/components/common/NavBar";
import responsive from "../../../resources/responsive";
import Strings from "../../../utils/languages";

import {
  converNameToDateStatis
} from "../../../utils/request";
//

const DataFilter = [
  { id: 1, value: "Ngày" },
  { id: 2, value: "Tuần" },
  { id: 3, value: "Tháng" },
  { id: 4, value: "Quý" },
  { id: 5, value: "Năm" },
];

class GroupWorkingStatisticsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeTime: DataFilter[0],
      showModalPicker: false,
      countRequest: 0,
      selectedButton: 1,
      startDate: moment()
        .add(-7, "days")
        .format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      isShowPopupCustomDate: false,
      isDateTimePickerVisible: false,
      txtStartDate: moment().format("YYYY-MM-DD"),
      txtEndDate: moment()
        .add(1, "days")
        .format("YYYY-MM-DD"),
      isStartDate: true,

      showPopupLineDetail: false,
      showPopupStackDetail: false,
      showPopupBarDetail: false,
    };
  }

  renderContent() {
    return (
      <ScrollView style={{ flex: 1, marginTop: responsive.h(10), }}>
        <View style={{ backgroundColor: "#fff", margin: responsive.h(10), borderRadius: responsive.h(12), }}>
          <View
            style={{
              flexDirection: "row",
              padding: responsive.h(10),
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(16),
                fontWeight: "600",
                color: "#282828",
              }}
            >
              {Strings.common.status}
            </Text>
          </View>
          <ReportGroupProgressStatus
            dateFrom={this.state.startDate}
            dateTo={this.state.endDate}
            dataStatus={this.props.dataStatus}
          />
          <FlatList
            data={this.props.dataStatus}
            horizontal={false}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            renderItem={(item) => {
              return (
                <TouchableOpacity
                  style={{ width: "50%" }}
                  onPress={() => {
                    this.props.navigation.navigate("requests", {
                      idStatus: item.item.id,
                    });
                  }}
                >
                  <View
                    style={{
                      borderRadius: responsive.h(45),
                      paddingRight: responsive.h(12),
                      backgroundColor: "orange",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: responsive.h(10),
                    }}
                  >
                    <Icon name={"dot-single"} size={responsive.h(20)} color="#000" />
                    <Text
                      style={{
                        color: "#000",
                        fontSize: fontsize.small,
                      }}
                    >
                      {item.item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            onEndReachedThreshold={0.5}
          />
        </View>

        <View style={{ backgroundColor: "#fff", margin: responsive.h(10), borderRadius: responsive.h(12), }}>
          <View
            style={{
              flexDirection: "row",
              padding: responsive.h(10),
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(16),
                fontWeight: "600",
                color: "#282828",
                paddingRight: responsive.h(10),
              }}
            >
              {Strings.statistical.averageHandlingTime}
            </Text>
          </View>
          <ReportGroupProgressTimeComplete
            dateFrom={this.state.startDate}
            dateTo={this.state.endDate}
          />
        </View>

        <View style={{ backgroundColor: "#fff", margin: responsive.h(10), borderRadius: responsive.h(12), }}>
          <View
            style={{
              flexDirection: "row",
              padding: responsive.h(10),
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(16),
                fontWeight: "600",
                color: "#282828",
                paddingRight: responsive.h(10),
              }}
            >
              {Strings.statistical.averageRating}
            </Text>
          </View>
          <ReportGroupProgressRating
            dateFrom={this.state.startDate}
            dateTo={this.state.endDate}
          />
        </View>
      </ScrollView>
    );
  }

  render() {
    const { typeTime, selectedButton } = this.state;
    let count = 0;
    if (this.props.data) {
      const arr = this.props.data.filter((o) => o.typeId == 0);
      count = arr[0] ? arr[0].value : 0;
    }
    return (
      <View style={{ backgroundColor: "#eeeeee", flex: 1 }}>
        <NavBar
          leftButton={
            <TouchableOpacity
              style={{ padding: responsive.h(10), }}
              onPress={() => this.props.navigation.goBack(null)}
            >
              <MyIcon name="arrow" size={responsive.h(20)} color="black" />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(18),
                fontWeight: "bold",
                textAlign: "center",
                color: "black",
              }}
            >
              {Strings.statistical.workGroupStatistics}
            </Text>
          }
        //   rightView={
        //     <TouchableOpacity style={{ padding: responsive.h(10),}}>
        //       <MyIcon name="arrow" size={20} color={colors.appTheme} />
        //     </TouchableOpacity>
        //   }
        />
        <View style={{ flex: 1 }}>
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                backgroundColor: "#fff",
                borderBottomWidth: 1,
                borderBottomColor: colors.grayBorder,
                paddingVertical: responsive.h(10),
              }}
            >
              <ButtonFilter
                value={selectedButton == 1}
                text={`1 ${Strings.statistical.week}`}
                onPress={() => this.setActive(1)}
              />
              <ButtonFilter
                value={selectedButton == 2}
                text={`1 ${Strings.statistical.month}`}
                onPress={() => this.setActive(2)}
              />
              <ButtonFilter
                value={selectedButton == 3}
                text={`3 ${Strings.statistical.month}`}
                onPress={() => this.setActive(3)}
              />
              <ButtonFilter
                value={selectedButton == 4}
                text={`6 ${Strings.statistical.month}`}
                onPress={() => this.setActive(4)}
              />
              <ButtonFilter
                value={selectedButton == 5}
                text={`${Strings.statistical.custom}`}
                onPress={() => this.setActive(5)}
              />
            </ScrollView>
          </View>
          <View style={{ backgroundColor: "#fff", padding: responsive.h(10), }}>
            {/* <View style={{ flexDirection: 'row', paddingVertical: responsive.h(10),}}>
                            <FilterType value={typeTime.value} onPress={() => this.setState({ showModalPicker: true })} />
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={{ color: '#0084ff', fontSize: 30, paddingHorizontal: responsive.h(10),}}>{count}</Text>
                            </View>


                        </View> */}
            <Text style={{ alignSelf: "center", fontSize: fontsize.small }}>
              {`${Strings.statistical.from} `}
              <Text style={{ color: "#0084ff", fontSize: fontsize.small }}>
                {moment(this.state.startDate).format("DD-MM-YYYY")}
              </Text>{" "}
              {`${Strings.statistical.to} `}
              <Text style={{ color: "#0084ff", fontSize: fontsize.small }}>
                {moment(this.state.endDate).format("DD-MM-YYYY")}
              </Text>
            </Text>
          </View>
          {this.renderContent()}
          <ModalPicker
            dislayValue="value"
            visible={this.state.showModalPicker}
            selectedValue={0}
            onValueChange={(typeTime) =>
              this.setState({ showModalPicker: false, typeTime }, () => {
                this.refreshDataHandle();
              })
            }
            data={DataFilter}
            onClose={() => this.setState({ showModalPicker: false })}
          />
        </View>
        <Modal
          transparent={true}
          visible={this.state.isShowPopupCustomDate}
          onRequestClose={() => null}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: colors.appOverView,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginHorizontal: responsive.h(15),
                borderRadius: responsive.h(5),
                flexDirection: "column",
              }}
            >
              <View style={{ padding: responsive.h(12), height: responsive.h(160) }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: fontsize.small,
                    color: "#2979ff",
                  }}
                >
                  {Strings.statistical.custom} {Strings.statistical.time}
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 0,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {/* <Image source={Icons.calendar} style={{ height: 30, width: 30, marginRight: 5 }} /> */}
                    <TouchableOpacity
                      onPress={() => this._showDateTimePicker(true)}
                      bordered
                      dark
                      style={{
                        borderRadius: 0,
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: responsive.h(5),
                      }}
                    >
                      <Text style={{ fontSize: fontsize.small, color: "#111" }}>
                        {moment(this.state.txtStartDate).format("DD/MM/YYYY")}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this._showDateTimePicker(false)}
                      bordered
                      dark
                      style={{
                        borderRadius: 0,
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: fontsize.small, color: "#111" }}>
                        {moment(this.state.txtEndDate).format("DD/MM/YYYY")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* <View><Text style={{margin:5,flex:0.3}}>-</Text></View> */}
                </View>
                <View style={{ padding: responsive.h(5) }}>
                  <PrimaryButton
                    text="OK"
                    style={{ padding: responsive.h(10), }}
                    onPress={this.customTime}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={() => this.setState({ isShowPopupCustomDate: false })}
                style={{
                  borderColor: colors.grayBorder,
                  borderTopWidth: 1,
                  paddingVertical: responsive.h(20),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: colors.appTheme, fontSize: fontsize.small }}
                >
                  {Strings.statistical.close}
                </Text>
              </TouchableOpacity>
            </View>
            <DatePicker
              modal
              mode="date"
              cancelText={Strings.app.cancel}
              title={`${Strings.common.choose} ${Strings.handover.time}`}
              confirmText={Strings.app.chose}
              open={this.state.isDateTimePickerVisible}
              onConfirm={(date) => this._handleDatePicked(date)}
              onCancel={this._hideDateTimePicker}
              date={new Date()}
              locale={this.props.language == 'vi' ? "vi_VN" : 'en_US'}
            />
          </View>
        </Modal>
      </View>
    );
  }

  setActive(id) {
    let option = null;
    switch (id) {
      case 1: {
        option = {
          selectedButton: id,
          endDate: moment().format("YYYY-MM-DD"),
          startDate: moment()
            .add(-7, "days")
            .format("YYYY-MM-DD"),
        };
        break;
      }
      case 2: {
        option = {
          selectedButton: id,
          endDate: moment().format("YYYY-MM-DD"),
          startDate: moment()
            .add(-1, "months")
            .format("YYYY-MM-DD"),
        };
        break;
      }
      case 3: {
        option = {
          selectedButton: id,
          endDate: moment().format("YYYY-MM-DD"),
          startDate: moment()
            .add(-3, "months")
            .format("YYYY-MM-DD"),
        };
        break;
      }
      case 4: {
        option = {
          selectedButton: id,
          endDate: moment().format("YYYY-MM-DD"),
          startDate: moment()
            .add(-6, "months")
            .format("YYYY-MM-DD"),
        };
        break;
      }
      case 5: {
        option = {
          selectedButton: id,
          isShowPopupCustomDate: true,
        };
        break;
      }
    }
    return this.setState(option, () => {
      if (id !== 5) {
        this.refreshDataHandle();
      }
    });
  }

  _showDateTimePicker(type) {
    this.setState({ isDateTimePickerVisible: true, isStartDate: type });
  }

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    if (this.state.isStartDate) {
      this.setState({ txtStartDate: moment(date).format("YYYY-MM-DD") });
    } else {
      this.setState({ txtEndDate: moment(date).format("YYYY-MM-DD") });
    }
    this._hideDateTimePicker();
  };

  customTime = () => {
    this.setState(
      {
        isShowPopupCustomDate: false,
        startDate: this.state.txtStartDate,
        endDate: this.state.txtEndDate,
      },
      () => {
        this.refreshDataHandle();
      }
    );
  };

  refreshDataHandle() {
    const {
      refreshDataHandle,
      timeRefreshDataHandle,
      ratingRefreshDataHandle,
    } = this.props;
    refreshDataHandle();
    timeRefreshDataHandle();
    ratingRefreshDataHandle();
  }
}

const mapStateToProps = (state) => ({
  dataStatus: state.drawer.data,
  language: state.app.language,
});

const mapActionToProps = {
  refreshDataHandle: statusRefreshDataHandle,
  timeRefreshDataHandle,
  ratingRefreshDataHandle,
};
export default connect(
  mapStateToProps,
  mapActionToProps
)(GroupWorkingStatisticsScreen);
