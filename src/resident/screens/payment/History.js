// //import liraries
// import React, { Component } from 'react';
// import { View, StyleSheet, Text, FlatList, ActivityIndicator, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
// import { connect } from 'react-redux';

// import moment from 'moment';
// import 'moment/locale/vi';

// import Strings from '../../utils/languages';
// import {
//     loadDataHandle, resetStateByKey, refreshDataHandle,
//     resetStateByKeyEwalle, refreshDataHandleEwalle, loadDataHandleEwallet, queryResultsEwalletVietTel
// } from '../../actions/paymentHistory';
// import ErrorContent from '../../components/common/ErrorContent';

// import ListItemHistory from './ListItemHistory';

// import NavBar from '../../components/common/NavBar';
// import { MyIcon } from '../../theme/icons';
// import colors from '../../theme/colors';
// import fontsize from '../../theme/fontsize';
// import Base64 from 'crypto-js/enc-base64';
// // create a component

// class PaymentHistoryScreen extends Component {
//     static navigationOptions = {
//         header: null
//     }

//     constructor(props) {
//         super(props);
//         this.state = {
//             searchKey: '',
//             isApplySearchKey: false,
//             type: 2,
//             showTransInquiry: false
//         };
//         moment.locale('vi');
//     }

//     componentDidMount() {
//         this.props.resetStateByKey({ key: 'initList', value: true })
//         this.props.resetStateByKeyEwalle({ key: 'initListEwallet', value: true })
//     }

//     componentWillReceiveProps(nextProps) {
//         if (nextProps.initList && nextProps.initList !== this.props.initList) {
//             const data = {
//                 departmentId: this.props.departmentId,

//                 currentPage: nextProps.currentPage + 1,
//                 rowPerPage: this.props.rowPerPage,
//                 langId: this.props.langId
//             }
//             this.props.loadDataHandle(data);
//         }
//         if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing && !nextProps.isLoading) {
//             const data = {
//                 departmentId: this.props.departmentId,

//                 currentPage: nextProps.currentPage + 1,
//                 rowPerPage: this.props.rowPerPage,
//                 langId: this.props.langId
//             }
//             this.props.loadDataHandle(data);
//         }
//         if (nextProps.departmentId && nextProps.departmentId !== this.props.departmentId) {
//             this.props.refreshDataHandle()
//         }
//         //
//         if (nextProps.initListEwallet && nextProps.initListEwallet !== this.props.initListEwallet) {
//             const data = {
//                 space_main_id: this.props.departmentId,
//                 tower_id: this.props.user.towerId,
//                 customer_id: this.props.user.customerid
//             }
//             this.props.loadDataHandleEwallet(data);
//         }
//         if (nextProps.isRefreshingEwallet && nextProps.isRefreshingEwallet !== this.props.isRefreshingEwallet && !nextProps.isLoadingEwallet) {
//             const data = {
//                 space_main_id: this.props.departmentId,
//                 tower_id: this.props.user.towerId,
//                 customer_id: this.props.user.customerid
//             }
//             this.props.loadDataHandleEwallet(data);
//         }
//         if (nextProps.departmentId && nextProps.departmentId !== this.props.departmentId) {
//             this.props.resetStateByKeyEwalle()
//         }
//     }

//     componentWillUnmount() {
//         this.props.resetStateByKey({ key: 'state' })
//     }

//     renderItem = ({ item }) => {
//         const {
//             serviceName,
//             code,
//             amount,
//             description,
//             dateOfPaid
//         } = item
//         return <ListItemHistory
//             user={this.props.user}
//             item={item}
//         />

//     }

//     renderFooter = () => {
//         if (!this.props.isLoading || this.props.isRefreshing) return null;
//         return (
//             <View
//                 style={{
//                     paddingVertical: 20,
//                 }}
//             >
//                 <ActivityIndicator animating size="small" />
//             </View>
//         );
//     };
//     render() {
//         return (
//             <View style={{ flex: 1 }}>
//                 <NavBar
//                     leftButton={<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ padding: 10 }}><MyIcon name="arrow" color="#fff" size={20} /></TouchableOpacity>}
//                     body={<Text style={{
//                         fontFamily: "Inter-Bold",
//                         fontSize: 20,
//                         fontWeight: "bold",
//                         fontStyle: "normal",
//                         letterSpacing: 0,
//                         textAlign: "center",
//                         color: "#ffffff"
//                     }}>{Strings.payment.paymentHistory}</Text>}
//                     rightView={<View style={{ margin: 10 }}><MyIcon name="arrow" color={colors.appTheme} size={20} /></View>}
//                 />
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: -10, alignItems: 'center', padding: 10 }}>
//                     <TouchableOpacity
//                         onPress={() => this.setState({ type: 1 })}
//                         style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                         <Text style={{
//                             fontFamily: "Inter-Bold",
//                             fontSize: 14,
//                             fontWeight: "bold",
//                             fontStyle: "normal",
//                             letterSpacing: 0,
//                             textAlign: "center",
//                             color: this.state.type == 2 ? '#c8c8c8' : "#3d3d3d"
//                         }}>Thanh toán điện tử</Text>
//                         <View style={{
//                             width: Platform.isPad ? 64 : 44,
//                             height: 3,
//                             borderRadius: 4,
//                             backgroundColor: this.state.type == 2 ? '#fff' : '#a3cd80',
//                             marginTop: 5
//                         }}></View>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         onPress={() => this.setState({ type: 2 })}
//                         style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                         <Text style={{
//                             fontFamily: "Inter-Bold",
//                             fontSize: 14,
//                             fontWeight: "bold",
//                             fontStyle: "normal",
//                             letterSpacing: 0,
//                             textAlign: "center",
//                             color: this.state.type == 1 ? '#c8c8c8' : "#3d3d3d"
//                         }}>Thanh toán thường</Text>
//                         <View style={{
//                             width: Platform.isPad ? 64 : 44,
//                             height: 3,
//                             borderRadius: 4,
//                             backgroundColor: this.state.type == 1 ? '#fff' : '#a3cd80',
//                             marginTop: 5
//                         }}></View>
//                     </TouchableOpacity>
//                 </View>
//                 {this.state.type == 2 ? this.renderContent() : this.renderContentEwallet()}
//             </View>
//         )
//     }
//     renderContentTransInquiry() {
//         const { isLoadingTransInquiry, errorTransInquiry, dataTransInquiry } = this.props;

//         if (isLoadingTransInquiry) {
//             return (<View
//                 style={{
//                     paddingVertical: 20,
//                     justifyContent: 'center',
//                     alignItems: 'center'
//                 }}
//             >
//                 <ActivityIndicator animating size="small" />
//             </View>)
//         }
//         if (errorTransInquiry && errorTransInquiry.hasError) {
//             return (<View>
//                 <Text style={{ margin: 20, fontWeight: "bold", fontFamily: "Inter-Bold", color: 'red' }}>{errorTransInquiry.message}</Text>
//             </View>
//             )
//         }
//         if (errorTransInquiry && !errorTransInquiry.hasError) {
//             return (
//                 <View>
//                     <Text style={{ margin: 20, fontWeight: "bold", fontFamily: "Inter-Bold" }}>Kết quả hoàn tiền: {errorTransInquiry.message}</Text>
//                 </View>
//             )
//         }
//     }
//     renderContent() {
//         const { emptyData, error, initList, data, isRefreshing, outOfStock, refreshDataHandle, isLoading } = this.props;

//         if (initList) {
//             return (<View
//                 style={{
//                     paddingVertical: 20,
//                 }}
//             >
//                 <ActivityIndicator animating size="small" />
//             </View>)
//         }
//         if (emptyData) {
//             return <ErrorContent title={Strings.app.emptyData} onTouchScreen={() => this.props.refreshDataHandle()} />
//         }
//         if (error && error.hasError) {
//             return <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.refreshDataHandle()} />

//         }
//         return (
//             <FlatList
//                 refreshing={isRefreshing}
//                 onRefresh={() => refreshDataHandle()}
//                 data={data || []}
//                 keyExtractor={(item, index) => `${index}`}
//                 renderItem={this.renderItem}
//                 onEndReachedThreshold={0.5}
//                 //style={{borderTopRightRadius: 20}}
//                 //ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
//                 onEndReached={() => {
//                     if (!this.onEndReachedCalledDuringMomentum && !this.props.outOfStock && this.props.currentPage > 0 && !this.props.isLoading) {
//                         const data = {
//                             departmentId: this.props.departmentId,
//                             currentPage: this.props.currentPage + 1,
//                             rowPerPage: this.props.rowPerPage,
//                             langId: this.props.langId
//                         }
//                         this.props.loadDataHandle(data);

//                     }
//                 }}
//                 onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
//                 ListFooterComponent={this.renderFooter}
//             />
//         );
//     }
//     renderContentEwallet() {
//         const { emptyDataEwallet, errorEwallet, initListEwallet, dataEwallet, isRefreshingEwallet, refreshDataHandleEwalle } = this.props;

//         if (initListEwallet) {
//             return (<View
//                 style={{
//                     paddingVertical: 20,
//                 }}
//             >
//                 <ActivityIndicator animating size="small" />
//             </View>)
//         }
//         if (emptyDataEwallet) {
//             return <ErrorContent title={Strings.app.emptyData} onTouchScreen={() => this.props.refreshDataHandleEwalle()} />
//         }
//         if (errorEwallet && errorEwallet.errorEwallet) {
//             return <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.refreshDataHandleEwalle()} />

//         }
//         return (
//             <View style={{flex: 1, marginBottom: 20}}>
//                 <Text style={{
//                     fontSize: 12,
//                     marginHorizontal: 10,
//                     fontStyle: 'italic',
//                     color: 'red'}}>Lưu ý: Trong trường hợp thanh toán không thành công nhưng tài khoản của bạn vẫn bị trừ tiền, vui lòng thực hiện 'Truy vấn và tự động hoàn tiền'. Liên hệ ban quản lý nếu có lỗi xảy ra!</Text>
//                 <FlatList
//                     refreshing={isRefreshingEwallet}
//                     onRefresh={() => this.props.refreshDataHandleEwalle()}
//                     data={dataEwallet || []}
//                     keyExtractor={(item, index) => `${index}`}
//                     renderItem={this.renderItemEWallet}
//                 />

//                 <Modal
//                     animationType="slide"
//                     transparent
//                     visible={this.state.showTransInquiry}
//                 >
//                     <View style={{ flex: 1, backgroundColor: colors.appOverView, justifyContent: 'center' }}>
//                         <View style={{ backgroundColor: '#fff', marginHorizontal: 40, marginVertical: 100 }}>
//                             <NavBar
//                                 body={<Text style={{

//                                     fontSize: 20,
//                                     fontWeight: "bold",
//                                     textAlign: "center",
//                                     color: "#ffffff"
//                                 }}>Kết quả truy vấn/hoàn tiền</Text>} rightView={null} />
//                             {this.renderContentTransInquiry()}
//                             <View style={{ flexDirection: 'row', margin: 10 }}>
//                                 <TouchableOpacity
//                                     style={{
//                                         flex: 1,
//                                         height: 30,
//                                         borderRadius: 5,
//                                         justifyContent: 'center',
//                                         alignItems: 'center',
//                                         borderColor: colors.appTheme,
//                                         borderWidth: 1,
//                                         borderRadius: 5
//                                     }}
//                                     onPress={() => this.setState({ showTransInquiry: false })}
//                                 >
//                                     <Text style={{ color: colors.appTheme }}>{'Bỏ qua'}</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     </View>

//                 </Modal>
//             </View>
//         );
//     }
//     des(note) {
//         let str2 = note.slice(note.indexOf("?") + 1, note.length)
//         let obj = {};
//         for (let entry of str2.split("&")) {
//             let pair = entry.split("=");
//             obj[pair[0]] = pair[1];
//         }
//         return obj.desc
//     }
//     trans_amount(note) {
//         let str2 = note.slice(note.indexOf("?") + 1, note.length)
//         let obj = {};
//         for (let entry of str2.split("&")) {
//             let pair = entry.split("=");
//             obj[pair[0]] = pair[1];
//         }
//         return obj.trans_amount
//     }
//     checkTime(ngay) {
//         var now = new Date()
//         var dateOfPayment = new Date(ngay)
//         var diffMs = (now - dateOfPayment); // milliseconds between now & dateOfPayment
//         var diffDays = Math.floor(diffMs / 86400000); // days
//         var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
//         var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
//         if (diffDays > 0) {
//             return true
//         } else if (diffHrs > 0) {
//             return true
//         } else if (diffMins >= 10) {
//             return true
//         }
//         return false

//     }
//     queryResults(item) {
//         var CryptoJS = require("crypto-js");
//         const toHashCheckSum = this.props.user.access_code + 'TRANS_INQUIRY' + this.props.user.ma_doi_tac + item.order_id + '2.0'
//         let hmacSHA1 = CryptoJS.HmacSHA1(toHashCheckSum, this.props.user.hash_key)
//         let check_sum = Base64.stringify(hmacSHA1)
//         data = `cmd=TRANS_INQUIRY&merchant_code=${this.props.user.ma_doi_tac}&order_id=${item.order_id}&version=2.0&check_sum=${check_sum}`

//         this.props.queryResultsEwalletVietTel(data, {
//             ma_doi_tac: this.props.user.ma_doi_tac,
//             hash_key: this.props.user.hash_key,
//             merchant_code: this.props.user.access_code,
//             access_code: this.props.user.access_code,
//             order_id: item.order_id,
//             trans_amount: this.trans_amount(item.note),
//             trans_content: 'Chua co phieu thu tren he thong'
//         })
//         this.setState({ showTransInquiry: true })
//     }
//     //REFUND_PAYMENT

//     renderItemEWallet = ({ item }) => {
//         const {
//             bill_code,
//             id_pt,
//             khach_hang,
//             mat_bang,
//             ngay,
//             nguon_thanh_toan,
//             note,
//             order_id,
//             so_phieu_thu,
//             toa_nha,
//             trang_thai
//         } = item

//         return (
//             <View
//             style={{padding: 20, backgroundColor: '#fff', marginHorizontal: 20, marginVertical: 10,
//                 borderRadius: 12,
//                 backgroundColor: "#ffffff",
//                 shadowColor: "rgba(0, 0, 0, 0.1)",
//                 elevation: 2,
//                 shadowOffset: {
//                     width: 0,
//                     height: 4
//                 },
//                 shadowRadius: 10,
//                 shadowOpacity: 1
//             }}
//                 //onPress={() => this.checkTime(ngay) ? this.queryResults(item) : this.queryResults(item)}
//             ><Text style={{fontFamily: "Inter-Regular",
//             fontSize: 11,
//             fontWeight: "normal",
//             fontStyle: "normal",
//             letterSpacing: 0,
//             textAlign: "right",
//             color: "#6f6f6f"}}>
//             {moment(ngay).format('DD/MM/YYYY HH:mm')}
//         </Text>
//                 <Text style={{
//                             fontFamily: "Inter-Bold",
//                             fontSize: 16,
//                             fontWeight: "bold",
//                             color: "#282828"
//                         }}>
//                     {nguon_thanh_toan}-{this.des(note)}-{mat_bang}
//                 </Text>
//                 <Text style={{fontFamily: "Inter-Regular",
//                     fontSize: 14,
//                     color: "#282828"}}>Mã đơn hàng: {bill_code}
//                 </Text>
//                 {so_phieu_thu !=null && so_phieu_thu.trim() != ''  && <Text style={{fontFamily: "Inter-Regular",
//                     fontSize: 14,
//                     color: "#282828"}}>Số phiếu thu: {so_phieu_thu}
//                 </Text>}

//                 <Text style={{fontFamily: "Inter-Regular",
//                     fontSize: 14,
//                     textAlign: "right",
//                     marginVertical: 5,
//                     color: (id_pt !=null && id_pt > 0) ? colors.appTheme : 'red'}}>
//                     {trang_thai}
//                 </Text>
//                 {(id_pt ==null || (id_pt !=null && id_pt == 0)) &&
//                 <TouchableOpacity
//                 style={{
//                     flex: 1,
//                     height: 30,
//                     borderRadius: 5,
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     borderColor: colors.appTheme,
//                     borderWidth: 1,
//                     borderRadius: 5
//                 }}
//                 onPress={() => Alert.alert('Xác nhận', 'Bạn muốn truy vấn?', [
//                     { text: 'HUỶ', onPress: () => undefined },
//                     { text: 'OK', onPress: () => this.checkTime(ngay) ? this.queryResults(item) : Alert.alert('Thông báo', 'Vui lòng thực hiện truy vấn sau 10 phút kể từ lúc giao dịch thanh toán để đảm bảo chính xác!') }
//                 ])}
//             >
//                 <Text style={{ color: colors.appTheme }}>Truy vấn và tự động hoàn tiền</Text>
//             </TouchableOpacity>}

//             </View>

//         )

//     }
// }

// // define your styles
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff'
//     },
// });

// const mapStateToProps = state => ({
//     user: state.auth.user,
//     data: state.paymentHistory.data,
//     isLoading: state.paymentHistory.isLoading,
//     initList: state.paymentHistory.initList,
//     isRefreshing: state.paymentHistory.isRefreshing,
//     currentPage: state.paymentHistory.currentPage,
//     rowPerPage: state.paymentHistory.rowPerPage,
//     emptyData: state.paymentHistory.emptyData,
//     outOfStock: state.paymentHistory.outOfStock,
//     error: state.paymentHistory.error,
//     isApplySearchKey: state.paymentHistory.isApplySearchKey,
//     searchKey: state.paymentHistory.searchKey,
//     departmentId: state.auth.user ? state.auth.user.spaceMainId : 0,
//     langId: state.app.language == 'vi' ? 1 : 2,
//     //
//     initListEwallet: state.paymentHistory.initListEwallet,
//     emptyDataEwallet: state.paymentHistory.emptyDataEwallet,
//     isRefreshingEwallet: state.paymentHistory.isRefreshingEwallet,
//     isLoadingEwallet: state.paymentHistory.isLoadingEwallet,
//     dataEwallet: state.paymentHistory.dataEwallet,
//     errorEwallet: state.paymentHistory.errorEwallet,
//     //check truy vấn
//     isLoadingTransInquiry: state.paymentHistory.isLoadingTransInquiry,
//     errorTransInquiry: state.paymentHistory.errorTransInquiry,
//     dataTransInquiry: state.paymentHistory.dataTransInquiry
// })
// const mapActionToProps = {
//     loadDataHandle,
//     resetStateByKey,
//     refreshDataHandle,
//     resetStateByKeyEwalle,
//     refreshDataHandleEwalle,
//     loadDataHandleEwallet,
//     queryResultsEwalletVietTel
// }

// //make this component available to the app
// export default connect(mapStateToProps, mapActionToProps)(PaymentHistoryScreen);
//import liraries
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";

import moment from "moment";
import "moment/locale/vi";

import Strings from "../../utils/languages";
import {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
  resetStateByKeyEwalle,
  refreshDataHandleEwalle,
  loadDataHandleEwallet,
  queryResultsEwalletVietTel,
} from "../../actions/paymentHistory";
import ErrorContent from "../../components/common/ErrorContent";

import ListItemHistory from "./ListItemHistory";

import NavBar from "../../components/common/NavBar";
import { MyIcon } from "../../theme/icons";
import colors from "../../theme/colors";
import fontsize from "../../theme/fontsize";
import Base64 from "crypto-js/enc-base64";
import responsive from "../../../resources/responsive";
// create a component

class PaymentHistoryScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchKey: "",
      isApplySearchKey: false,
      type: 1,
      showTransInquiry: false,
    };
    moment.locale("vi");
  }

  componentDidMount() {
    this.props.resetStateByKey({ key: "initList", value: true });
    this.props.resetStateByKeyEwalle({ key: "initListEwallet", value: true });
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
    //
    if (
      nextProps.initListEwallet &&
      nextProps.initListEwallet !== this.props.initListEwallet
    ) {
      const data = {
        space_main_id: this.props.departmentId,
        tower_id: this.props.user.towerId,
        customer_id: this.props.user.customerid,
      };
      this.props.loadDataHandleEwallet(data);
    }
    if (
      nextProps.isRefreshingEwallet &&
      nextProps.isRefreshingEwallet !== this.props.isRefreshingEwallet &&
      !nextProps.isLoadingEwallet
    ) {
      const data = {
        space_main_id: this.props.departmentId,
        tower_id: this.props.user.towerId,
        customer_id: this.props.user.customerid,
      };
      this.props.loadDataHandleEwallet(data);
    }
    if (
      nextProps.departmentId &&
      nextProps.departmentId !== this.props.departmentId
    ) {
      this.props.resetStateByKeyEwalle();
    }
  }

  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }

  renderItem = ({ item }) => {
    const { serviceName, code, amount, description, dateOfPaid } = item;
    return <ListItemHistory user={this.props.user} item={item} />;
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
    return (
      <View style={{ flex: 1 }}>
        <NavBar
          leftButton={
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <MyIcon name="arrow" color="black" size={responsive.h(20)} />
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
                color: "black",
              }}
            >
              {Strings.payment.paymentHistory}
            </Text>
          }
        />
        <View>
          <ScrollView
            horizontal
            contentContainerStyle={{
              flex: 1,
              height: "100%",
            }}
          >
            <TouchableOpacity onPress={() => this.setState({ type: 1 })}>
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(14),
                  paddingLeft: responsive.h(20),
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  color: this.state.type == 1 ? "#3d3d3d" : "#c8c8c8",
                  paddingHorizontal: responsive.h(10),
                  textAlign: "center",
                  paddingVertical: responsive.h(10),
                }}
              >
                {Strings.payment.cardPayment}
              </Text>
              <View
                style={{
                  // width: Platform.basic ? 64 : 44,
                  width: "130%",
                  height: responsive.h(3),
                  borderRadius: responsive.h(4),
                  backgroundColor:
                    this.state.type == 1 ? colors.appTheme : "#f1f1f1",
                  marginTop: responsive.h(5),
                  paddingHorizontal: responsive.h(20),
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setState({ type: 2 })}
              style={
                {
                  // flex: 1,
                  // justifyContent: "center",
                  // alignItems: "center",
                }
              }
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(14),
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  color: this.state.type == 2 ? "#3d3d3d" : "#c8c8c8",
                  paddingHorizontal: responsive.h(10),
                  textAlign: "center",
                  paddingLeft: responsive.h(20),
                  paddingVertical: responsive.h(10),
                }}
              >
                {Strings.payment.normalPayment}
              </Text>

              <View
                style={{
                  // width: Platform.isPad ? 64 : 44,
                  width: this.state.paid ? "130%" : "160%",
                  height: responsive.h(3),
                  borderRadius: responsive.h(4),
                  backgroundColor:
                    this.state.type == 2 ? colors.appTheme : "#f1f1f1",
                  marginTop: responsive.h(5),
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#fff",
              }}
              disabled={true}
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(14),
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  color: this.state.type == 3 ? "#3d3d3d" : "#c8c8c8",
                  paddingHorizontal: responsive.h(20),
                  textAlign: "center",
                  paddingVertical: responsive.h(10),
                  color: "#fff",
                }}
              >
                {}
              </Text>
              <View
                style={{
                  // width: Platform.isPad ? 64 : 44,
                  width: this.state.type == 3 ? "130%" : "160%",
                  height: responsive.h(3),
                  borderRadius: responsive.h(4),
                  backgroundColor:
                    this.state.type == 3 ? colors.appTheme : "#f1f1f1",
                  marginTop: responsive.h(5),
                }}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* <View
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
            onPress={() => this.setState({ type: 1 })}
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
                color: this.state.type == 2 ? "#c8c8c8" : "#3d3d3d",
              }}
            >
              Thanh toán điện tử
            </Text>
            <View
              style={{
                width: Platform.isPad ? 64 : 44,
                height: 3,
                borderRadius: 4,
                backgroundColor: this.state.type == 2 ? "#fff" : "#a3cd80",
                marginTop: 5,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ type: 2 })}
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
                color: this.state.type == 1 ? "#c8c8c8" : "#3d3d3d",
              }}
            >
              Thanh toán thường
            </Text>
            <View
              style={{
                width: Platform.isPad ? 64 : 44,
                height: 3,
                borderRadius: 4,
                backgroundColor: this.state.type == 1 ? "#fff" : "#a3cd80",
                marginTop: 5,
              }}
            />
          </TouchableOpacity>
        </View> */}
        {this.state.type == 2
          ? this.renderContent()
          : this.renderContentEwallet()}
      </View>
    );
  }
  renderContentTransInquiry() {
    const {
      isLoadingTransInquiry,
      errorTransInquiry,
      dataTransInquiry,
    } = this.props;

    if (isLoadingTransInquiry) {
      return (
        <View
          style={{
            paddingVertical: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator animating size="small" />
        </View>
      );
    }
    if (errorTransInquiry && errorTransInquiry.hasError) {
      return (
        <View>
          <Text
            style={{
              margin: 20,
              fontWeight: "bold",
              fontFamily: "Inter-Bold",
              color: "red",
              fontSize: responsive.h(fontsize.micro),
            }}
          >
            {errorTransInquiry.message}
          </Text>
        </View>
      );
    }
    if (errorTransInquiry && !errorTransInquiry.hasError) {
      return (
        <View>
          <Text
            style={{
              margin: responsive.h(20),
              fontWeight: "bold",
              fontFamily: "Inter-Bold",
            }}
          >
            Kết quả truy vấn: {errorTransInquiry.message}
          </Text>
        </View>
      );
    }
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
        refreshing={isRefreshing}
        onRefresh={() => refreshDataHandle()}
        data={data || []}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderItem}
        onEndReachedThreshold={0.5}
        //style={{borderTopRightRadius: 20}}
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
  renderContentEwallet() {
    const {
      emptyDataEwallet,
      errorEwallet,
      initListEwallet,
      dataEwallet,
      isRefreshingEwallet,
      refreshDataHandleEwalle,
    } = this.props;

    if (initListEwallet) {
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
    if (emptyDataEwallet) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => this.props.refreshDataHandleEwalle()}
        />
      );
    }
    if (errorEwallet && errorEwallet.errorEwallet) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => this.props.refreshDataHandleEwalle()}
        />
      );
    }
    return (
      <View style={{ flex: 1, marginBottom: responsive.h(20) }}>
        <Text
          style={{
            fontSize: responsive.h(12),
            marginHorizontal: responsive.h(10),
            fontStyle: "italic",
            color: "red",
          }}
        >
          Lưu ý: Trong trường hợp thanh toán không thành công nhưng tài khoản
          của bạn vẫn bị trừ tiền, vui lòng thực hiện 'Truy vấn kết quả', nếu
          thanh toán ở cổng Viettel thành công liên hệ BQL để hoàn tiền. Liên hệ
          ban quản lý nếu có lỗi xảy ra!
        </Text>
        <FlatList
          refreshing={isRefreshingEwallet}
          onRefresh={() => this.props.refreshDataHandleEwalle()}
          data={dataEwallet || []}
          keyExtractor={(item, index) => `${index}`}
          renderItem={this.renderItemEWallet}
        />

        <Modal
          animationType="slide"
          transparent
          visible={this.state.showTransInquiry}
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
                backgroundColor: "#fff",
                marginHorizontal: responsive.h(40),
                marginVertical: responsive.h(100),
              }}
            >
              <NavBar
                body={
                  <Text
                    style={{
                      fontSize: responsive.h(20),
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "#ffffff",
                    }}
                  >
                    Kết quả truy vấn
                  </Text>
                }
                rightView={null}
              />
              {this.renderContentTransInquiry()}
              <View style={{ flexDirection: "row", margin: responsive.h(10) }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    height: responsive.h(30),
                    borderRadius: responsive.h(5),
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: colors.appTheme,
                    borderWidth: responsive.h(1),
                    borderRadius: responsive.h(5),
                  }}
                  onPress={() => this.setState({ showTransInquiry: false })}
                >
                  <Text
                    style={{
                      color: colors.appTheme,
                      fontSize: responsive.h(fontsize.medium),
                    }}
                  >
                    {"Bỏ qua"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  des(note) {
    let str2 = note.slice(note.indexOf("?") + 1, note.length);
    let obj = {};
    for (let entry of str2.split("&")) {
      let pair = entry.split("=");
      obj[pair[0]] = pair[1];
    }
    return obj.desc;
  }
  trans_amount(note) {
    let str2 = note.slice(note.indexOf("?") + 1, note.length);
    let obj = {};
    for (let entry of str2.split("&")) {
      let pair = entry.split("=");
      obj[pair[0]] = pair[1];
    }
    return obj.trans_amount;
  }
  checkTime(ngay) {
    var now = new Date();
    var dateOfPayment = new Date(ngay);
    var diffMs = now - dateOfPayment; // milliseconds between now & dateOfPayment
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if (diffDays > 0) {
      return true;
    } else if (diffHrs > 0) {
      return true;
    } else if (diffMins >= 10) {
      return true;
    }
    return false;
  }
  queryResults(item) {
    var CryptoJS = require("crypto-js");
    const toHashCheckSum =
      this.props.user.access_code +
      "TRANS_INQUIRY" +
      this.props.user.ma_doi_tac +
      item.order_id +
      "2.0";
    let hmacSHA1 = CryptoJS.HmacSHA1(toHashCheckSum, this.props.user.hash_key);
    let check_sum = Base64.stringify(hmacSHA1);
    data = `cmd=TRANS_INQUIRY&merchant_code=${
      this.props.user.ma_doi_tac
    }&order_id=${item.order_id}&version=2.0&check_sum=${check_sum}`;

    this.props.queryResultsEwalletVietTel(data, {
      ma_doi_tac: this.props.user.ma_doi_tac,
      hash_key: this.props.user.hash_key,
      merchant_code: this.props.user.access_code,
      access_code: this.props.user.access_code,
      order_id: item.order_id,
      trans_amount: this.trans_amount(item.note),
      trans_content: "Chua co phieu thu tren he thong",
    });
    this.setState({ showTransInquiry: true });
  }
  //REFUND_PAYMENT

  renderItemEWallet = ({ item }) => {
    const {
      bill_code,
      id_pt,
      khach_hang,
      mat_bang,
      ngay,
      nguon_thanh_toan,
      note,
      order_id,
      so_phieu_thu,
      toa_nha,
      trang_thai,
    } = item;

    return (
      <View
        style={{
          padding: responsive.h(20),
          backgroundColor: "#fff",
          marginHorizontal: responsive.h(20),
          marginVertical: responsive.h(10),
          borderRadius: responsive.h(12),
          backgroundColor: "#ffffff",
          shadowColor: "rgba(0, 0, 0, 0.1)",
          elevation: 2,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowRadius: 10,
          shadowOpacity: 1,
        }}
        //onPress={() => this.checkTime(ngay) ? this.queryResults(item) : this.queryResults(item)}
      >
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: responsive.h(11),
            fontWeight: "normal",
            fontStyle: "normal",
            letterSpacing: 0,
            textAlign: "right",
            color: "#6f6f6f",
          }}
        >
          {moment(ngay).format("DD/MM/YYYY HH:mm")}
        </Text>
        <Text
          style={{
            fontFamily: "Inter-Bold",
            fontSize: responsive.h(16),
            fontWeight: "bold",
            color: "#282828",
          }}
        >
          {nguon_thanh_toan}-{this.des(note)}-{mat_bang}
        </Text>
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: responsive.h(14),
            color: "#282828",
          }}
        >
          Mã đơn hàng: {bill_code}
        </Text>
        {so_phieu_thu != null && so_phieu_thu.trim() != "" && (
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: responsive.h(14),
              color: "#282828",
            }}
          >
            Số phiếu thu: {so_phieu_thu}
          </Text>
        )}

        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: responsive.h(14),
            textAlign: "right",
            marginVertical: responsive.h(5),
            color: id_pt != null && id_pt > 0 ? colors.appTheme : "red",
          }}
        >
          {trang_thai}
        </Text>
        {(id_pt == null || (id_pt != null && id_pt == 0)) && (
          <TouchableOpacity
            style={{
              flex: 1,
              height: responsive.h(30),
              borderRadius: responsive.h(5),
              justifyContent: "center",
              alignItems: "center",
              borderColor: colors.appTheme,
              borderWidth: responsive.h(1),
              borderRadius: responsive.h(5),
            }}
            onPress={() =>
              Alert.alert("Xác nhận", "Bạn muốn truy vấn?", [
                { text: "HUỶ", onPress: () => undefined },
                {
                  text: "OK",
                  onPress: () =>
                    this.checkTime(ngay)
                      ? this.queryResults(item)
                      : Alert.alert(
                          "Thông báo",
                          "Vui lòng thực hiện truy vấn sau 10 phút kể từ lúc giao dịch thanh toán để đảm bảo chính xác!"
                        ),
                },
              ])
            }
          >
            <Text style={{ color: colors.appTheme }}>Truy vấn kết quả</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
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
  data: state.paymentHistory.data,
  isLoading: state.paymentHistory.isLoading,
  initList: state.paymentHistory.initList,
  isRefreshing: state.paymentHistory.isRefreshing,
  currentPage: state.paymentHistory.currentPage,
  rowPerPage: state.paymentHistory.rowPerPage,
  emptyData: state.paymentHistory.emptyData,
  outOfStock: state.paymentHistory.outOfStock,
  error: state.paymentHistory.error,
  isApplySearchKey: state.paymentHistory.isApplySearchKey,
  searchKey: state.paymentHistory.searchKey,
  departmentId: state.auth.user ? state.auth.user.spaceMainId : 0,
  langId: state.app.language == "vi" ? 1 : 2,
  //
  initListEwallet: state.paymentHistory.initListEwallet,
  emptyDataEwallet: state.paymentHistory.emptyDataEwallet,
  isRefreshingEwallet: state.paymentHistory.isRefreshingEwallet,
  isLoadingEwallet: state.paymentHistory.isLoadingEwallet,
  dataEwallet: state.paymentHistory.dataEwallet,
  errorEwallet: state.paymentHistory.errorEwallet,
  //check truy vấn
  isLoadingTransInquiry: state.paymentHistory.isLoadingTransInquiry,
  errorTransInquiry: state.paymentHistory.errorTransInquiry,
  dataTransInquiry: state.paymentHistory.dataTransInquiry,
});
const mapActionToProps = {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
  resetStateByKeyEwalle,
  refreshDataHandleEwalle,
  loadDataHandleEwallet,
  queryResultsEwalletVietTel,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(PaymentHistoryScreen);
