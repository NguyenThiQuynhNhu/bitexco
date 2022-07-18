// //import liraries
// import React, { Component } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, ScrollView, FlatList, TouchableOpacity,
//     DeviceEventEmitter,NativeModules, NativeEventEmitter, Platform, Image
//  } from 'react-native';

// import { Screen } from '../../utils/device';
// import { connect } from 'react-redux';
// import Strings from '../../utils/languages';
// import ErrorContent from '../../components/common/ErrorContent';
// import { loadDataHandle, resetStateByKey, paymentMomoHandle, saveTokenMomoHandle } from '../../actions/feeDetail';
// import { resetOrderId } from '../../actions/auth'
// import colors from '../../theme/colors';
// import fontsize from '../../theme/fontsize';
// import NavBar from '../../components/common/NavBar';
// import { MyIcon } from '../../theme/icons';
// import { momo, vnpay, ok, error } from '../../theme/images';
// import Toast, { DURATION } from 'react-native-easy-toast';

// import RNMomosdk from 'react-native-momosdk';
// const EventEmitter = new NativeEventEmitter(NativeModules.RNMomosdk);

// const FieldText = ({ style, name, text, nameStyle, textStyle }) => {
//     return (
//         <View style={{ padding: 12, borderTopWidth: 0.5, borderTopColor: colors.grayBorder, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...style }}>
//             <Text style={{ fontSize: fontsize.medium, ...nameStyle }}>{name}</Text>
//             <Text style={{ fontSize: fontsize.medium, ...textStyle }}>{text}</Text>
//         </View>
//     )
// }

// const BankPayment = ({ style, value, enable, onSelectedChange, currentValue, text, image, nameStyle, textStyle }) => {
//     return (
//         <TouchableOpacity 
//         onPress={() => onSelectedChange(value)}
//             style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
//             <View style={{ padding: 15, paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: colors.grayBorder, backgroundColor: '#fff', opacity: enable === 0 ? 0.3 : 1, flexDirection: 'row', alignItems: 'center', width: '80%', ...style }}>
//                 <Image source={image} style={{ width: 40, height: 40 }} resizeMode="contain"/>
//                 <Text style={{ fontSize: fontsize.medium, ...textStyle }}>{text}</Text>
//             </View>

//             <View style={{ padding: 15, paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: colors.grayBorder, backgroundColor: '#fff', opacity: enable === 0 ? 0.3 : 1, flexDirection: 'row', justifyContent:'flex-end', alignItems: 'center', width: '20%', ...style }}>
//                 {value == currentValue && <MyIcon
//                 name='check'
//                 size={20}
//                 color={colors.appTheme}
//             />}
//             </View>
//         </TouchableOpacity>
//     )
// }

// let merchantname = "LANDSOFT MANAGEMENT";
// let merchantcode = "MOMOYYTH20190311";//"MOMOIQA420180417";
// const merchantNameLabel = "Nhà cung cấp";
// let billdescription = "";
// let amount = 0;

// const enviroment = "1"; //"0": SANBOX , "1": PRODUCTION
// const isDev = enviroment === "0"

// // create a component
// class PaymentScreen extends Component {
//     static navigationOptions = {
//         header: null
//     }

//     constructor(props) {
//         super(props);
//         this.state = {
//             bankPayment: 0,
//             processing: false,
//             orderId: ''
//         }

//         //this.onPressPay = this.onPressPay.bind(this)
//         //this.checkChoicePayment = this.checkChoicePayment.bind(this)
//     }

//     componentDidMount() {
//         this.props.resetStateByKey({ key: 'errorPayment', value: -1 });

//         //this.setState({ orderId: this.props.data.orderId });

//         if(this.props.data.orderId === this.props.orderId){
//             DeviceEventEmitter.removeListener('RCTMoMoNoficationCenterRequestTokenReceived', function (e) { });
//             EventEmitter.addListener('RCTMoMoNoficationCenterRequestTokenReceived', (response) => {
//                 try{
//                     console.log("<MoMoPay>Listen.Event::" + JSON.stringify(response));
//                     if (response && response.status == 0) {
//                         console.log("", response)
//                         //SUCCESS: continue to submit momoToken,phonenumber to server
//                         let fromapp = response.fromapp; //ALWAYS:: fromapp==momotransfer

//                         this.setState({ processing: false });
//                         let momoToken = response.data;
//                         let phonenumber = response.phonenumber;
//                         let message = response.message;

//                         //call server
//                         this.paymentMomo(response.data, response.phonenumber)

//                     } else {
//                         //let message = response.message;
//                         //Has Error: show message here
//                         this.setState({ processing: false });
//                     }
//                 }catch(ex){
//                     console.log(ex)
//                 }
//             });
//         }
//     }

//     componentWillReceiveProps(nextProps) {
//         console.log(nextProps)
//         if (nextProps.isLoadingPayment && nextProps.isLoadingPayment !== this.props.isLoadingPayment) {
//             console.log('this.props.loadDataHandle')
//         }
//     }

//     componentWillUnmount(){
//         DeviceEventEmitter.removeListener('RCTMoMoNoficationCenterRequestTokenReceived', function (e) { });
//     }

//     renderItem = ({ item, index }) => {
//         const { name, description, amount } = item
//         return (
//             <View style={{ flex: 1, marginBottom: 5 }}>
//                 <FeildText name={name} nameStyle={{ fontWeight: 'bold' }} textStyle={{ color: colors.appTheme, fontWeight: 'bold' }} text={amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'} />
//                 <Text numberOfLines={2} lineBreakMode="tail" style={{ marginTop: 5 }}>{description}</Text>
//             </View>
//         )
//     }

//     renderContent() {
//         const { bankPayment } = this.state;

//         const { isLoading, data, error, initComponent } = this.props;
//         if (isLoading || initComponent) {
//             return (
//                 <View
//                 style={{
//                     paddingVertical: 20,
//                 }}
//             >
//                 <ActivityIndicator animating size="small" />
//             </View>
//             )
//         }
//         if (error && error.hasError) {
//             return (
//                 <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.refreshDataHandle()} />
//             )
//         }
//         const {
//             title,
//             contractNo,
//             towerName,
//             time,
//             dealine,
//             amountIncurred,
//             amountOldDebt,
//             amountPaid,
//             amountPaidFront,
//             isPaid,
//             items,
//             debitNote
//         } = this.props.data

//         const { user } = this.props

//         billdescription = "Thanh toán phí tháng " + debitNote

//         return (
//             <ScrollView showsVerticalScrollIndicator={false}>
//                 <View style={{ flex: 1 }}>
//                     <View style={{ padding: 15, marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//                         <Text style={{ fontSize: fontsize.medium }}>{Strings.payment.summary}</Text>
//                     </View>

//                     {/* <FieldText name="Nhà cung cấp" text={user.towerName} textStyle={{ }}/>

//                     <FieldText name="Code NCC" text={user.towerCode} textStyle={{ }}/> */}

//                     <FieldText name={Strings.payment.total} text={(amountIncurred).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'}  textStyle={{ }}/>

//                     <FieldText name={Strings.payment.discount} text='0 đ'  textStyle={{ }}/>
                    
//                     <FieldText name={Strings.payment.afterDiscount} text={(amountIncurred - amountPaid).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'}  textStyle={{ }}/>

//                     <FieldText name={Strings.payment.description} text={billdescription} textStyle={{ }}/>


//                     <View style={{ padding: 15, marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//                         <Text style={{ fontSize: fontsize.medium }}>{Strings.payment.bankPayment}</Text>
//                     </View>

//                     <BankPayment image={momo} enable={1} value={1} onSelectedChange={this._onSelectedChange} currentValue={this.state.bankPayment} text={Strings.payment.momo}  textStyle={{ paddingLeft: 15 }}/>

//                     <BankPayment image={vnpay} enable={0} value={2} onSelectedChange={this._onSelectedChangeTemp} text={Strings.payment.vnpay}  textStyle={{ paddingLeft: 15 }}/>

//                 </View>
//                 <View style={{ flex: 1, alignItems: 'center'}}>
//                     <TouchableOpacity
//                         style={{
//                             marginTop: 40,
//                             marginBottom: 10,
//                             borderRadius: 45,
//                             width: Screen.width * 0.8,
//                             height: 50,
//                             backgroundColor: this.checkChoicePayment() ? colors.appTheme : colors.gray1,
//                             justifyContent: 'center'
//                         }}
//                         onPress={() => this.checkChoicePayment() ? (this.state.processing ? null : this.setState({ processing: true }, ()=>{ this.onPressPay() })) : null }
//                     >
//                         <Text style={{ color: '#fff', fontSize: 18, alignSelf: 'center' }}>{Strings.payment.agree}</Text>
//                     </TouchableOpacity>
//                     </View>
//             </ScrollView>
//         )
//     }

//     choicePayment(value){
//         this.setState({ bankPayment: value });
//     }

//     checkChoicePayment(){
//         return (this.state.bankPayment !== 0)
//     }

//     _onSelectedChange = (value) => {
//         if (value == this.state.bankPayment) {
//             this.setState({ bankPayment: 0 })
//         } else {
//             this.setState({ bankPayment: value })
//         }
//     }

//     _onSelectedChangeTemp = (value) => {
        
//     }

//     render() {
//         return (
//             <View style={styles.container}>
//                 <NavBar
//                     leftButton={<TouchableOpacity onPress={() =>{ 
//                         DeviceEventEmitter.removeListener('RCTMoMoNoficationCenterRequestTokenReceived', function (e) { });
//                         this.props.navigation.goBack()}
//                     } style={{ padding: 10 }}><MyIcon name="arrow" size={20} color="#fff" /></TouchableOpacity>}
//                     body={<Text style={{ alignSelf: 'center', color: '#fff', fontSize: fontsize.medium }}>{Strings.payment.title}</Text>}
//                 />
//                 {this.renderContent()}

//                 { this.props.isLoadingPayment &&
//                     <View style={{
//                         height: '100%',
//                         width: '100%',
//                         position: 'absolute',
//                         backgroundColor: colors.appOverView,
//                         justifyContent: 'center',
//                         alignItems: 'center'
//                     }}>
//                         <View style={{
//                             width: "90%",
//                             borderRadius: 5,
//                             backgroundColor: '#fff',
//                         }}>
//                             <View style={{
//                                 borderColor: colors.grayBorder,
//                                 borderBottomWidth: 1
//                             }}>
//                                 <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center'}}>
//                                     <ActivityIndicator animating size="large" color={colors.appTheme}/>
//                                     <Text style={{ marginTop: 15 }}>Hệ thống đang xử lý</Text>
//                                     <Text>Vui lòng đợi trong giây lát</Text>
//                                 </View>    
//                             </View>                            
//                         </View>
//                     </View>}

//                     { this.props.errorPayment !== -1 &&
//                     <View style={{
//                         height: '100%',
//                         width: '100%',
//                         position: 'absolute',
//                         backgroundColor: colors.appOverView,
//                         justifyContent: 'center',
//                         alignItems: 'center'
//                     }}>
//                         <View style={{
//                             width: "90%",
//                             borderRadius: 5,
//                             backgroundColor: '#fff',
//                         }}>
//                             <View style={{
//                                 borderColor: colors.grayBorder,
//                                 borderBottomWidth: 1
//                             }}>
//                                 <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center'}}>
//                                     <Image source={this.props.errorPayment === 0 ? ok : error } style={{ width: 60, height: 60 }} resizeMode="contain"/>
                                    
//                                     { this.props.errorPayment === 1 &&
//                                         <View style={{ justifyContent: 'center', alignItems: 'center'}}>
//                                             <Text style={{ marginTop: 15 }}>Thanh toán không thành công.</Text>
//                                             <Text>Vui lòng lòng thử lại, xin cảm ơn.</Text>

//                                             <TouchableOpacity
//                                             style={{
//                                                 marginTop: 40,
//                                                 marginBottom: 10,
//                                                 borderRadius: 45,
//                                                 width: Screen.width * 0.8,
//                                                 height: 50,
//                                                 backgroundColor: colors.appTheme,
//                                                 justifyContent: 'center'
//                                             }}
//                                             onPress={() => this.props.navigation.goBack() }
//                                             >
//                                             <Text style={{ color: '#fff', fontSize: 18, alignSelf: 'center' }}>Đóng</Text>
//                                             </TouchableOpacity>
//                                         </View>
//                                     }

//                                     { this.props.errorPayment === 0 &&
//                                         <View style={{ justifyContent: 'center', alignItems: 'center'}}>
//                                             <Text style={{ marginTop: 15 }}>Chúc mừng bạn đã thanh toán thành công.</Text>
//                                             <Text>Cảm ơn bạn đã sử dụng dịch vụ.</Text>

//                                             <TouchableOpacity
//                                             style={{
//                                                 marginTop: 40,
//                                                 marginBottom: 10,
//                                                 borderRadius: 45,
//                                                 width: Screen.width * 0.8,
//                                                 height: 50,
//                                                 backgroundColor: colors.appTheme,
//                                                 justifyContent: 'center'
//                                             }}
//                                             onPress={() => {
//                                                 this.onPressReload()
//                                             }}
//                                             >
//                                             <Text style={{ color: '#fff', fontSize: 18, alignSelf: 'center' }}>Đóng</Text>
//                                             </TouchableOpacity>
//                                         </View>
//                                     }
//                                 </View>    
//                             </View>                            
//                         </View>
//                     </View>}

//                 <Toast ref="toast" style={{ backgroundColor: colors.toast.success, opacity: 1, borderRadius: 5, padding: 10 }} />
//             </View>
//         );
//     }

//     onPressReload(){
//         this.props.loadDataHandle({
//             departmentId: this.props.departmentId,
//             time: this.props.navigation.state.params.time,
//             langId: this.props.langId
//         })

//         this.props.navigation.goBack()
//     }

//     // TODO: Action to Request Payment MoMo App
//     onPressPay = async() => {
//         if (this.state.processing){
//             const {
//                 amountIncurred,
//                 amountPaid
//             } = this.props.data

//             const { user } = this.props;

//             amount = amountIncurred - amountPaid

//             let jsonData = {};
//             jsonData.isDev = isDev;
//             jsonData.enviroment = enviroment; //SANBOX OR PRODUCTION
//             jsonData.action = "gettoken"; //DO NOT EDIT
//             jsonData.merchantname = user.towerName; //edit your merchantname here
//             jsonData.merchantcode = user.towerCode; //edit your merchantcode here
//             jsonData.merchantnamelabel = merchantNameLabel;
//             jsonData.description = billdescription;
//             jsonData.amount = amount;//order total amount
//             //jsonData.orderId = "DIP20190314001";//truyền phía server
//             //jsonData.orderLabel = "Ma don hang";//truyền phía server
//             jsonData.appScheme = "momoyyth20190311";// iOS App Only , match with Schemes Indentify from your  Info.plist > key URL types > URL Schemes
//             console.log("data_request_payment " + JSON.stringify(jsonData));

//             if (Platform.OS === 'android'){
//                 let dataPayment = await RNMomosdk.requestPayment(jsonData);
//                 this.momoHandleResponse(dataPayment);
//             }else{
//                 RNMomosdk.requestPayment(JSON.stringify(jsonData));
//             }
//             this.setState({ processing: false });
//         }else{
//             this.setState({ processing: false });
//         }
//     }
    
//     async momoHandleResponse(response){
//         try{
//             if (response && response.status == 0) {
//                 console.log("response", response)
//                 //SUCCESS continue to submit momoToken,phonenumber to server
//                 let fromapp = response.fromapp; //ALWAYS:: fromapp == momotransfer

//                 this.setState({ processing: false });

//                 let momoToken = response.data;
//                 let phonenumber = response.phonenumber;
//                 let message = response.message;

//                 //call server
//                 this.paymentMomo(response.data, response.phonenumber)
//             } else {
//                 //let message = response.message;
//                 //Has Error: show message here
//                 this.setState({ processing: false });
//             }
//         }catch(ex){}
//     }

//     paymentMomo(appData, phonenumber)
//     {
//         const { spaceMainId, towerId, towerCode } = this.props.user;
//         const {
//             debitNote,
//             orderId
//         } = this.props.data

//         console.log(orderId)
//         console.log(this.props.orderId)

//         if(orderId === this.props.orderId){
//             //this.props.resetOrderId()

//             return this.props.paymentMomoHandle({
//                 partnerCode: towerCode,//Mã đối tác (*)
//                 partnerRefId: '',//Mã đơn hàng phía đối tác (*)--Server side
//                 customerNumber: phonenumber,//Số điện thoại khách hàng (*)
//                 appData,//Token nhận được từ app MoMo (*)
//                 description: billdescription,//Mô tả cho giao dịch
//                 amount: amount,   //Số tiền thanh toán
//                 debitNote,
//                 towerId,
//                 apartmentId: spaceMainId,
//                 orderId: this.props.orderId,
//                 os: Platform.OS
//             });
//         }
//     }
// }

// // define your styles
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: colors.gray2,
//     },
// });

// //make this component available to the app
// const mapStateToProps = state => ({
//     departmentId: state.auth.user ? state.auth.user.spaceMainId : 0,
//     initComponent: state.feeDetail.initComponent,
//     isLoading: state.feeDetail.isLoading,

//     errorPayment: state.feeDetail.errorPayment,
//     isLoadingPayment: state.feeDetail.isLoadingPayment,

//     data: state.feeDetail.data,

//     error: state.feeDetail.error,
//     user: state.auth.user,
//     orderId: state.auth.orderId,
//     langId: state.app.language == 'vi' ? 1 : 2
// })

// const mapActionToProps = {
//     loadDataHandle,
//     paymentMomoHandle, 
//     saveTokenMomoHandle,
//     resetStateByKey,
//     resetOrderId
// }
// export default connect(mapStateToProps, mapActionToProps)(PaymentScreen);
