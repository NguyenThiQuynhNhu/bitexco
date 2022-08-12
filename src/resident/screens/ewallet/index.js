//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
  TouchableOpacity,
  DeviceEventEmitter,
  NativeModules,
  NativeEventEmitter,
  Platform,
  Image,
} from "react-native";

import { Screen } from "../../utils/device";
import { connect } from "react-redux";
import Strings from "../../utils/languages";
import ErrorContent from "../../components/common/ErrorContent";
import { MyIcon } from "../../theme/icons";
import { WebView } from "react-native-webview";
import fontsize from "../../theme/fontsize";
import NavBar from "../../components/common/NavBar";
//
import { refreshDataHandle as refreshDataHandleFee } from "../../actions/fee";
// import { checkPaymenHandle } from '../../actions/ewallet';
class PaymentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      showWeb: true,
      text: "",
      isPaidSucsess: false,
    };
  }
  hideSpinner() {
    this.setState({ visible: false });
  }
  _onNavigationStateChange(webViewState) {
    const str = webViewState.url;
    if (str.indexOf("dip.vn/?") != -1) {
      this.setState({ showWeb: false });
      let str2 = str.slice(str.indexOf("?") + 1, str.length);
      let obj = {};
      for (let entry of str2.split("&")) {
        let pair = entry.split("=");
        obj[pair[0]] = pair[1];
      }
      switch (obj.error_code) {
        case "00":
          this.setState({ text: "Thanh toán thành công", isPaidSucsess: true });
          this.props.refreshDataHandleFee();
          break;
        case "22":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Nhập sai OTP",
          });
          break;
        case "V01":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Sai check_sum",
          });
          break;
        case "V09":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Sai check_sum",
          });
          break;
        case "V02":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Nhập sai OTP",
          });
          break;
        case "V03":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " + obj.error_code + "). OTP hết hạn",
          });
          break;
        case "21":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Nhập sai mật khẩu (mã PIN)",
          });
          break;
        case "685":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Nhập sai mật khẩu (mã PIN)",
          });
          break;
        case "16":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). KH không đủ số dư để thanh toán",
          });
          break;
        case "W04":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Kết nối timeout",
          });
          break;
        case "V04":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Có lỗi khi truy vấn hệ thống tại VIETTEL",
          });
          break;
        case "V05":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Không xác nhận được giao dịch",
          });
          break;
        case "V06":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Khách hàng hủy thanh toán",
          });
          break;
        case "S_MAINTAIN":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " + obj.error_code + "). CTT bảo trì",
          });
          break;
        case "99":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Lỗi không xác định",
          });
          break;
        case "M01":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Mã đối tác chưa được đăng ký",
          });
          break;
        case "M02":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Chưa thiết lập tài khoản nhận tiền cho đối tác",
          });
          break;
        case "M03":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Hình thức thanh toán không phù hợp",
          });
          break;
        case "M04":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Ảnh QR bị lỗi hoặc không đọc được giá trị cần thiết từ ản",
          });
          break;
        case "813":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Lỗi kết nối tới CTT",
          });
          break;
        case "P48":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Giao dịch không thành công do gói cước ViettelPay của khách hàng chưa được nâng cấp, vui lòng truy cập ứng dụng ViettelPay để được hướng dẫn nâng cấp gói cước.",
          });
          break;
        case "813":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Lỗi kết nối tới CTT",
          });
          break;
        case "813":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Lỗi kết nối tới CTT",
          });
          break;
        case "813":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Lỗi kết nối tới CTT",
          });
          break;
        case "813":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Lỗi kết nối tới CTT",
          });
          break;
        case "813":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Lỗi kết nối tới CTT",
          });
          break;
        case "813":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Lỗi kết nối tới CTT",
          });
          break;
        case "813":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Lỗi kết nối tới CTT",
          });
          break;
        case "813":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Lỗi kết nối tới CTT",
          });
          break;
        case "813":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Lỗi kết nối tới CTT",
          });
          break;
        case "813":
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Lỗi kết nối tới CTT",
          });
          break;
        default:
          this.setState({
            text:
              "Giao dịch thất bại(Mã lỗi: " +
              obj.error_code +
              "). Vui lòng liên hệ ban quản lý",
          });
      }
    }
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <NavBar
          leftButton={
            <TouchableOpacity
              //onPress={() => this.state.isPaidSucsess ? this.props.navigation.navigate('payment') : this.props.navigation.goBack()}
              onPress={() => this.props.navigation.navigate("payment")}
              style={{ padding: 10 }}
            >
              <MyIcon
                name="arrow"
                size={responsive.h(fontsize.medium)}
                color="black"
              />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(20),
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "#ffffff",
              }}
            >
              {Strings.tabbar.payment}
            </Text>
          }
        />
        {this.state.showWeb ? (
          <View style={{ flex: 1 }}>
            <WebView
              onNavigationStateChange={this._onNavigationStateChange.bind(this)}
              onLoad={() => this.hideSpinner()}
              style={{ flex: 1, marginTop: 5, marginBottom: 10 }}
              scrollEnabled
              javaScriptEnabled
              domStorageEnabled
              ref="webView"
              source={{
                uri: this.props.navigation.state.params.urlPaymentViettel,
              }}
            />
            {this.state.visible && (
              <ActivityIndicator
                style={{
                  position: "absolute",
                  top: Screen.height / 2,
                  left: Screen.width / 2,
                }}
                size="large"
              />
            )}
          </View>
        ) : (
          <View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                style={{
                  width: responsive.h(100),
                  height: responsive.h(100),
                  borderRadius: responsive.h(10),
                }}
                source={{ uri: this.props.towerLogoUrl }}
              />
            </View>
            <Text
              style={{
                fontFamily: "Inter",
                fontSize: responsive.h(18),
                fontWeight: "bold",
                textAlign: "center",
                color: "#282828",
                margin: 10,
              }}
            >
              Kết quả giao dịch
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: responsive.h(14),
                color: "#3d3d3d",
                margin: responsive.h(10),
              }}
            >
              Nhà cung cấp:{" "}
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: responsive.h(14),
                  fontWeight: "bold",
                }}
              >
                {this.props.user.ten_doi_tac}
              </Text>
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: responsive.h(14),
                color: "#3d3d3d",
                margin: responsive.h(10),
              }}
            >
              Trạng thái:{" "}
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: responsive.h(14),
                  fontWeight: "bold",
                }}
              >
                {this.state.text}.{" "}
              </Text>
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: responsive.h(14),
                color: "#3d3d3d",
                margin: responsive.h(10),
              }}
            >
              Mã đơn hàng:{" "}
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: responsive.h(14),
                  fontWeight: "bold",
                }}
              >
                {this.props.navigation.state.params.billcode}
              </Text>{" "}
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: responsive.h(14),
                color: "#3d3d3d",
                margin: responsive.h(10),
              }}
            >
              Mã giao dịch:{" "}
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: responsive.h(14),
                  fontWeight: "bold",
                }}
              >
                {this.props.navigation.state.params.order_id}
              </Text>{" "}
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: responsive.h(14),
                color: "#3d3d3d",
                margin: responsive.h(10),
              }}
            >
              Số tiền:{" "}
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: responsive.h(14),
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                {this.props.navigation.state.params.trans_amount
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ"}{" "}
              </Text>
            </Text>
          </View>
        )}
      </View>
    );
  }
}
//make this component available to the app
const mapStateToProps = (state) => ({
  departmentId: state.auth.user ? state.auth.user.spaceMainId : 0,
  user: state.auth.user,
  langId: state.app.language == "vi" ? 1 : 2,
  towerLogoUrl: state.auth.user ? state.auth.user.towerLogoUrl : "",
});

const mapActionToProps = {
  refreshDataHandleFee,
};
export default connect(
  mapStateToProps,
  mapActionToProps
)(PaymentScreen);
