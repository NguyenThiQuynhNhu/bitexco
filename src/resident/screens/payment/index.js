//import liraries
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  processColor,
  Platform,
} from "react-native";
import { connect } from "react-redux";

import moment from "moment";
import "moment/locale/vi";

import Strings from "../../utils/languages";
import {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
} from "../../actions/fee";
import ErrorContent from "../../components/common/ErrorContent";

import ListItem from "./ListItem";

import NavBar from "../../components/common/NavBar";
import { MyIcon } from "../../theme/icons";
import colors from "../../theme/colors";
import fontsize from "../../theme/fontsize";
import { default_user } from "../../theme/images";
import ImageProgress from "../../components/common/ImageProgress";
import { PieChart } from "react-native-charts-wrapper";
import _ from "lodash";
import Base64 from "crypto-js/enc-base64";
import { WebView } from "react-native-webview";

// create a component
class PaymentScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchKey: "",
      isApplySearchKey: false,
      paid: false,
      web: null,
    };
    moment.locale("vi");
  }

  async componentDidMount() {
    //await this.props.resetStateByKey({ key: 'initList', value: false })
    await this.props.resetStateByKey({ key: "initList", value: true });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initList && nextProps.initList !== this.props.initList) {
      const data = {
        departmentId: this.props.departmentId,

        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
        langId: this.props.langId,
      };
      this.props.loadDataHandle(data);
    }
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing &&
      !nextProps.isLoading
    ) {
      const data = {
        departmentId: this.props.departmentId,

        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
        langId: this.props.langId,
      };
      this.props.loadDataHandle(data);
    }
    if (
      nextProps.departmentId &&
      nextProps.departmentId !== this.props.departmentId
    ) {
      this.props.refreshDataHandle();
    }
  }

  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }

  renderItem = ({ item }) => {
    const {
      actionId,
      requestId,
      shortDescription,
      imageUrl,
      time,
      towerName,
      isPaid,
    } = item;
    if (isPaid == this.state.paid) {
      return (
        <ListItem
          onPress={() =>
            this.props.navigation.navigate("paymentDetail", { time })
          }
          user={this.props.user}
          item={item}
        />
      );
    } else return null;
  };

  renderFooter = () => {
    if (!this.props.isLoading || this.props.isRefreshing) return null;
    return (
      <View
        style={{
          paddingVertical: 20,
        }}
      >
        <ActivityIndicator animating size="small" />
      </View>
    );
  };
  render() {
    const { user } = this.props;
    const uri = user ? { uri: user.photoUrl } : default_user;
    return (
      <View style={{ flex: 1 }}>
        <NavBar
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("profile")}
              style={{ padding: 10 }}
            >
              <ImageProgress
                style={{
                  height: 40,
                  width: 40,
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
                fontFamily: "Inter-Bold",
                fontSize: 20,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "black",
              }}
            >
              {Strings.tabbar.payment}
            </Text>
          }
          // rightView={
          //     <TouchableOpacity style={{ padding: 10 }}>
          //         <MyIcon
          //             size={20}
          //             name="search"
          //             color="#fff" />
          //     </TouchableOpacity>
          // }
          rightView={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("paymentHistory")}
              style={{ padding: 10 }}
            >
              <MyIcon size={24} name="history" color="#fff" />
            </TouchableOpacity>
          }
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginTop: -10,
            alignItems: "center",
            padding: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => this.setState({ paid: false })}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 14,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: this.state.paid ? "#c8c8c8" : "#3d3d3d",
              }}
            >
              {Strings.payment.unpaidStatus}
            </Text>
            <View
              style={{
                width: Platform.isPad ? 64 : 44,
                height: 3,
                borderRadius: 4,
                backgroundColor: this.state.paid ? "#fff" : "#a3cd80",
                marginTop: 5,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ paid: true })}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 14,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: !this.state.paid ? "#c8c8c8" : "#3d3d3d",
              }}
            >
              {Strings.payment.paidStatus}
            </Text>
            <View
              style={{
                width: Platform.isPad ? 64 : 44,
                height: 3,
                borderRadius: 4,
                backgroundColor: !this.state.paid ? "#fff" : "#a3cd80",
                marginTop: 5,
              }}
            />
          </TouchableOpacity>
        </View>
        {this.renderContent()}
      </View>
    );
  }

  demo() {
    var billcode = "BILL004"; // Trường hợp k có billcode, truyền tham số order_id vào
    var command = "PAYMENT";
    var desc = "Thanh Toan BILL004";
    var locale = "Vi";
    var merchant_code = "CTTDIP";
    var order_id = "ORDER004";
    var other_info = {
      type: "No VAT",
      desc: "Thanh Toan BILL004",
    };
    var customer_bill_info = {
      bill_to_forename: "NGUYEN VAN",
      bill_to_surname: "AN",
      bill_to_email: "annv@cybersource.com",
      bill_to_address_line1: "So 15",
      bill_to_address_city: "Ha Noi",
      bill_to_address_state: "Unknown",
      bill_to_address_country: "vi",
      bill_to_address_postal_code: "94043",
    };
    var return_url = "";
    var login_msisdn = "";
    var cancel_url = null;
    var trans_amount = 100;
    var version = "2.0";
    var CryptoJS = require("crypto-js");
    const toHashCheckSum =
      "d41d8cd98f00b204e9800998ecf8427e7374a0c0b8785ce841010011e2a3074c" +
      billcode +
      command +
      merchant_code +
      order_id +
      trans_amount +
      version;

    let demo = CryptoJS.HmacSHA1(
      toHashCheckSum,
      "d41d8cd98f00b204e9800998ecf8427e067c8498698af55ffdfe1266a1583f03"
    );
    let checkSum = Base64.stringify(demo);
    let _url = "https://game1.viettel.vn/PaymentGateway/payment?";
    // Required Parameter
    _url += `billcode=${billcode}&command=${command}&merchant_code=${merchant_code}&order_id=${order_id}&return_url=${return_url}`;
    _url += `&trans_amount=${trans_amount}&version=${version}&login_msisdn=${login_msisdn}&desc=${desc}&locale=${locale}`;
    // Hàm escape(String) => replace các kí tự đặc biệt
    // if(other_info) _url += `&other_info=${escape(JSON.stringify(other_info))}` // JSON format.
    // if(customer_bill_info) _url += `&customer_bill_info=${escape(JSON.stringify(customer_bill_info))}` //JSON format
    // if(cancel_url) _url += `&cancel_url=${cancel_url}`

    // CheckSum
    _url += `&check_sum=${checkSum}`;
    this.setState({ web: _url });
    //     hmac = crypto.createHmac(algorithm, secret);
    // hmac.write(text);
    // hmac.end();
    // hash = hmac.read().toString('base64');
    // return hash;
  }
  renderContent() {
    const {
      emptyData,
      error,
      initList,
      data,
      isRefreshing,
      outOfStock,
      refreshDataHandle,
      isLoading,
    } = this.props;
    if (
      emptyData ||
      (data &&
        data.filter((item) => item.isPaid == this.state.paid).length == 0)
    ) {
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
        refreshing={isRefreshing}
        onRefresh={() => refreshDataHandle()}
        data={data || []}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderItem}
        onEndReachedThreshold={0.5}
        //ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
        onEndReached={() => {
          if (
            !this.onEndReachedCalledDuringMomentum &&
            !this.props.outOfStock &&
            this.props.currentPage > 0 &&
            !this.props.isLoading
          ) {
            const data = {
              departmentId: this.props.departmentId,
              currentPage: this.props.currentPage + 1,
              rowPerPage: this.props.rowPerPage,
              langId: this.props.langId,
            };
            this.props.loadDataHandle(data);
          }
        }}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        ListFooterComponent={this.renderFooter}
      />
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.fee.data,
  isLoading: state.fee.isLoading,
  initList: state.fee.initList,
  isRefreshing: state.fee.isRefreshing,
  currentPage: state.fee.currentPage,
  rowPerPage: state.fee.rowPerPage,
  emptyData: state.fee.emptyData,
  outOfStock: state.fee.outOfStock,
  error: state.fee.error,
  isApplySearchKey: state.fee.isApplySearchKey,
  searchKey: state.fee.searchKey,
  departmentId: state.auth.user ? state.auth.user.spaceMainId : 0,
  langId: state.app.language == "vi" ? 1 : 2,
  fee: state.fee,
  dataPieSet: state.fee.dataPieSet,
});
const mapActionToProps = {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(PaymentScreen);
