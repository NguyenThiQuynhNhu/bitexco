//import liraries
import React, { Component } from 'react';
import {
    View, Text, StyleSheet, ActivityIndicator, ScrollView, FlatList, TouchableOpacity,
    DeviceEventEmitter, NativeModules, NativeEventEmitter, Platform, TextInput, Modal,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import Strings from '../../utils/languages';
import ErrorContent from '../../components/common/ErrorContent';
import { resetStateByKey, loadDataHandle, paymentMomoHandle, refreshDataHandle, savePaymentViettelHandle } from '../../actions/feeDetail';
import colors from '../../theme/colors';
import fontsize from '../../theme/fontsize';
import NavBar from '../../components/common/NavBar';
import { MyIcon } from '../../theme/icons';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Screen } from '../../utils/device';
import { get, helper } from '../../services/helper';
import Swiper from 'react-native-swiper';
import Base64 from 'crypto-js/enc-base64';
import moment from 'moment';
import { signOut } from '../../actions/auth';
const FeildText = ({ style, name, text, nameStyle, textStyle }) => {
    return (
        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...style }}>
            <Text style={{
                fontFamily: "Inter-Medium",
                fontSize: 14,
                fontWeight: "500",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#3d3d3d"
                , ...nameStyle
            }}>{name}</Text>
            <Text style={{
                fontFamily: "Inter",
                fontSize: 14,
                fontWeight: "500",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "right",
                color: "#3d3d3d", ...textStyle
            }}>{text}</Text>
        </View>
    )
}

const SearchField = ({ }) => {
    return (
        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.gray2 }}>
            <TextInput
                maxLength={500}
                underline={false}
                multiline
                underlineColorAndroid='transparent'
                style={{
                    width: '100%',
                    flex: 1,
                    height: 100,
                    padding: 5,
                    textAlignVertical: Platform.OS === 'ios' ? 'auto' : 'top',
                    alignContent: 'flex-start',
                    alignSelf: 'flex-start',
                    fontSize: fontsize.small
                }}
                placeholderTextColor="#9e9e9e"
            />
            <TextInput
                maxLength={500}
                underline={false}
                multiline
                underlineColorAndroid='transparent'
                style={{
                    width: '100%',
                    flex: 1,
                    height: 100,
                    padding: 5,
                    textAlignVertical: Platform.OS === 'ios' ? 'auto' : 'top',
                    alignContent: 'flex-start',
                    alignSelf: 'flex-start',
                    fontSize: fontsize.small
                }}
                placeholderTextColor="#9e9e9e"
            />
        </View>
    )
}

const merchantname = "DIPVietnam";
const merchantcode = "MOMOVJEL20190308";
const merchantNameLabel = "Nhà cung cấp";
const billdescription = "Thanh toan phi thang 3/2019";
const amount = 50000;
const enviroment = "1"; //"0": SANBOX , "1": PRODUCTION

// create a component
class PaymentDetailScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            isShowFeeDetail: false,
            dataDetail: [],
            urlPaymentViettel: null,
            isLoading: false
        };
    }

    componentDidMount() {
        this.props.loadDataHandle({
            departmentId: this.props.departmentId,
            time: this.props.navigation.state.params.time,
            langId: this.props.langId,
            ma_toa_nha: this.props.user.ma_toa_nha,
            ma_khach_hang: this.props.user.ma_khach_hang,
            ma_mat_bang: this.props.user.ma_mat_bang,
            phoneNumber: this.props.phoneNumber,
            password: this.props.password,
            idNew: this.props.idNew,
            trans_amount: null, order_id: null, billcode: null
        })
    }

    componentWillUnmount() {
        this.props.resetStateByKey({ key: 'state' })
    }

    componentWillReceiveProps(nextProps) {
        //01 lưu thanh toán lỗi
        if (nextProps && nextProps.errorLogin && nextProps.errorLogin.hasError && this.props.errorLogin !== nextProps.errorLogin) {
            Alert.alert('Thông báo', 'Hết phiên sử dụng, bạn cần đăng nhập lại để tiếp tục!', [
                // { text: 'HUỶ', onPress: () => undefined },
                { text: 'OK', onPress: () => this.props.signOut({ towers: this.props.user.towers, tokenDevice: this.props.tokenDevice }) }
            ]);
        }
        if (nextProps && nextProps.errorSavePayment && this.props.errorSavePayment !== nextProps.errorSavePayment) {
            if (nextProps.errorSavePayment.status === 200) {
                this.setState({ isLoading: false })
                this.props.navigation.navigate('ewallet', { urlPaymentViettel: this.state.urlPaymentViettel, trans_amount: this.state.trans_amount, order_id: this.state.order_id, billcode: this.state.billcode })
            } else {
                if (nextProps.errorSavePayment.hasError) {
                    this.setState({ isLoading: false })
                    Alert.alert('Lỗi', 'Vui lòng liên hệ ban quản lý(Mã lỗi: 01)!');
                }
            }

        }
    }

    renderItem = ({ item, index }) => {
        const { name, description, amount } = item
        return (
            <TouchableOpacity
                onPress={() => this.clickItem(item)}
                style={{ paddingHorizontal: 10, marginBottom: 10, paddingBottom: 10, borderRadius: 5, borderWidth: 0.5, borderColor: colors.gray2 }}>
                <FeildText name={name} nameStyle={{ color: '#000' }} textStyle={{}} text={amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'} />
                <Text numberOfLines={2} lineBreakMode="tail" style={{ marginTop: 5, fontSize: fontsize.small }}>{description}</Text>
            </TouchableOpacity>
        )
    }

    async clickItem(item) {
        const url = '/Fee/GetChiTietDichVu';
        const ret = await get(url, {
            MaLDV: item.maldv,
            LinkID: item.linkID,
            ID: item.id
        });
        if (ret !== undefined && ret !== null) {
            if (ret.status == 200) {
                this.setState({ dataDetail: ret.data, isShowFeeDetail: true })
            }
            else {
            }
        }
        else {
        }
        //this.setState({isShowFeeDetail: true})
    }
    renderItemDetail = ({ item, index }) => {
        const { tenDM, donGia, thanhTien, soLuong } = item
        return (
            <View
                style={{ flex: 1, marginBottom: 5 }}>
                <FeildText name={tenDM} nameStyle={{ fontWeight: 'bold', color: '#000' }} textStyle={{ color: colors.appTheme, fontWeight: 'bold' }} text={thanhTien.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'} />
                <FeildText name={Strings.serviceExtension.price} nameStyle={{}} textStyle={{ color: '#000' }} text={donGia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'} />
                <FeildText name={Strings.payment.number} nameStyle={{}} textStyle={{ color: '#000' }} text={soLuong} />
            </View>
        )
    }
    getUrlViettelPayment() {
        const {ma_doi_tac, ten_doi_tac, access_code, hash_key} = this.props.user
        if ( ma_doi_tac == null || ten_doi_tac == null || access_code == null || hash_key == null || ( ma_doi_tac != null && ma_doi_tac =='') || ( ten_doi_tac != null && ten_doi_tac =='') || ( access_code != null && access_code =='') || ( hash_key != null && hash_key =='')) {
            Alert.alert('Thông báo', 'Lỗi dữ liệu, bạn cần đăng nhập lại để tiếp tục. Trong trường hợp đã đăng nhập lại nhưng vẫn lỗi vui lòng liên hệ ban quản lý!', [
                // { text: 'HUỶ', onPress: () => undefined },
                { text: 'OK', onPress: () => {} }
            ]);
        } else {
            this.setState({ isLoading: true })
            let time = this.props.navigation.state.params.time.trim()
            let month = time.slice(0, time.indexOf("/"))
            let year = time.slice(time.indexOf("/") + 1, time.length)
            const {
                title,
                contractNo,
                towerName,
                dealine,
                amountIncurred,
                amountOldDebt,
                amountPaid,
                amountPaidFront,
                isPaid,
                items
            } = this.props.data
            
            var billcode = this.props.billCode
            var command = 'PAYMENT'
            var desc = title
            var locale = 'Vi'
            var merchant_code = this.props.user.ma_doi_tac
            var order_id = this.props.departmentId + '_' + moment().format('YYYYMMDDHHmmss')
            var return_url = 'https://dip.vn'
            var login_msisdn = ''
            var cancel_url = null
            //var trans_amount = amountIncurred + amountOldDebt - amountPaid - amountPaidFront
            var trans_amount = amountIncurred
            var version = '2.0'
            var CryptoJS = require("crypto-js");
            const toHashCheckSum = this.props.user.access_code + billcode + command + merchant_code + order_id + trans_amount + version
            console.log(toHashCheckSum)
            console.log(Base64.stringify(CryptoJS.HmacSHA1(order_id, this.props.user.hash_key)))
            let hmacSHA1 = CryptoJS.HmacSHA1(toHashCheckSum, this.props.user.hash_key)
            let checkSum = Base64.stringify(hmacSHA1)
            let _url = 'https://pay3.viettel.vn//PaymentGateway/payment?'
            // Required Parameter
            _url += `billcode=${billcode}&command=${command}&merchant_code=${merchant_code}&order_id=${order_id}&return_url=${return_url}`
            _url += `&trans_amount=${trans_amount}&version=${version}&desc=${desc}&locale=${locale}`
            // Hàm escape(String) => replace các kí tự đặc biệt
            // if(other_info) _url += `&other_info=${escape(JSON.stringify(other_info))}` // JSON format. 
            // if(customer_bill_info) _url += `&customer_bill_info=${escape(JSON.stringify(customer_bill_info))}` //JSON format
            // if(cancel_url) _url += `&cancel_url=${cancel_url}`
    
            // CheckSum
            _url += `&check_sum=${checkSum}`
            this.setState({ trans_amount: amountIncurred, order_id: order_id, billcode: billcode, urlPaymentViettel: _url })
            //this.setState({ urlPaymentViettel: _url })
            console.log(_url)
            this.props.savePaymentViettelHandle(
                {
                    "tower_id": this.props.user.towerId,
                    "space_main_id": this.props.departmentId,
                    "customer_id": this.props.user.customerid,
                    "year": year,
                    "month": month,
                    "bill_code": billcode,
                    "order_id": order_id,
                    "note": _url,
                    "payment_source": 3
                }
            )
            //this.props.navigation.navigate('ewallet', { urlPaymentViettel: _url, trans_amount: amountIncurred, order_id: order_id, billcode: billcode })
        }
        
    }
    renderButtonPayment() {
        const { data } = this.props;
        if (data !== null) {
            if (!data.isPaid && this.props.billCode != null && data.isUseEWallet && this.props.user.ma_doi_tac && this.props.user.ma_doi_tac.trim != '') {
                return (<View style={{ alignItems: 'center', position: 'absolute', bottom: 0, justifyContent: 'center', width: '100%' }}><TouchableOpacity
                    //onPress={() => this.props.navigation.navigate('ewallet', { time: this.props.navigation.state.params.time })}
                    onPress={() => this.getUrlViettelPayment()}
                    style={{
                        backgroundColor: colors.appTheme,
                        marginVertical: 20,
                        borderRadius: 45,
                        width: 150,
                        height: 50,
                        justifyContent: 'center',
                    }}>
                    {/* <MyIcon name="message" size={20} color="#fff" /> */}
                    <Text style={{ color: '#fff', fontSize: 18, alignSelf: 'center', fontSize: fontsize.small }}>{Strings.tabbar.payment}</Text>
                </TouchableOpacity></View>)
            }
            else
                return null
        } else {
            return null
        }
    }

    renderContent() {
        console.log(this.props)
        const { isLoading, data, error, initComponent } = this.props;
        if (isLoading || initComponent || this.state.isLoading) {
            return (
                <View
                    style={{
                        paddingVertical: 20,
                    }}
                >
                    <ActivityIndicator animating size="small" />
                </View>
            )
        }
        if (error && error.hasError) {
            return (
                <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.refreshDataHandle()} />
            )
        }
        const {
            title,
            contractNo,
            towerName,
            time,
            dealine,
            amountIncurred,
            amountOldDebt,
            amountPaid,
            amountPaidFront,
            isPaid,
            items
        } = this.props.data
        const pageData = items.map((o, index) => (
            <TouchableOpacity
            style={{ width: Screen.width - 40,
                //height: 120,
                padding: 10, borderRadius: 12,
                backgroundColor: "#ffffff",
                shadowColor: "rgba(0, 0, 0, 0.1)",
                elevation: 2,
                shadowOffset: {
                    width: 0,
                    height: 4
                },
                shadowRadius: 10,
                shadowOpacity: 1,
            marginVertical: 5}}
                onPress={() => this.clickItem(o)}>
                <FeildText name={o.name} nameStyle={{

                    fontFamily: "Inter",
                    fontSize: 16,
                    fontWeight: "600",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#282828"
                }} textStyle={{
                    fontFamily: "Inter",
                    fontSize: 16,
                    fontWeight: "600",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "right",
                    color: "#ff624d"
                }} text={o.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'} />
                <Text numberOfLines={2} lineBreakMode="tail" style={{
                    marginTop: 5,
                    fontFamily: "Inter",
                    fontSize: 12,
                    fontWeight: "500",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#626262"
                }}>{o.description}</Text>
            </TouchableOpacity>
        ));
        return (
            <View style={{ flex: 1, flexDirection: 'column', borderTopRightRadius: 20 }}>
                <ScrollView style={{ borderTopRightRadius: 20, marginTop: -20 }} showsVerticalScrollIndicator={false}>
                    <View style={{ color: '#000', flex: 2, marginBottom: 70, backgroundColor: '#fff', padding: 20, borderTopRightRadius: 20 }}>
                        <Text style={{
                            fontFamily: "Inter",
                            fontSize: 18,
                            fontWeight: "bold",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "left",
                            color: "#282828"
                        }}>{title}</Text>
                        <View style={{
                            borderRadius: 20,
                            backgroundColor: "#ffffff",
                            shadowColor: "rgba(0, 0, 0, 0.1)",
                            elevation: 2,
                            shadowOffset: {
                                width: 0,
                                height: 4
                            },
                            shadowRadius: 10,
                            shadowOpacity: 1,
                            padding: 10,
                            marginTop: 20
                        }}>
                            <FeildText style={{}} name={Strings.payment.contractNo} text={contractNo} textStyle={{ color: colors.appTheme, fontWeight: 'bold' }} />
                            <FeildText style={{ marginTop: 10 }} name={Strings.payment.time} text={time} />
                            <FeildText name={Strings.payment.dealine} text={dealine} textStyle={{ color: "#f2c94c", fontWeight: 'bold' }} />
                            <FeildText name={Strings.payment.status} textStyle={{ color: isPaid ? colors.appTheme : "#eb5757", fontWeight: "bold", }} text={isPaid ? Strings.payment.paidStatus : Strings.payment.unpaidStatus} />
                        </View>


                        <View style={{
                            borderRadius: 20,
                            backgroundColor: "#ffffff",
                            shadowColor: "rgba(0, 0, 0, 0.1)",
                            elevation: 2,
                            shadowOffset: {
                                width: 0,
                                height: 4
                            },
                            shadowRadius: 10,
                            shadowOpacity: 1,
                            padding: 10,
                            marginTop: 20
                        }}>
                            {/* <FeildText name={Strings.payment.openingBalance} text={amountOldDebt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'} /> */}
                            <FeildText name={Strings.payment.occursDuring} text={amountIncurred.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'} />
                            {/* <FeildText name={Strings.payment.total} nameStyle={{}} text={(amountIncurred + amountOldDebt).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'} textStyle={{ color: colors.appTheme, fontWeight: 'bold' }} /> */}
                            <View style={{ height: 1, marginTop: 10, backgroundColor: colors.gray2 }} />
                            <FeildText name={Strings.payment.paidFront} text={amountPaidFront.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'} />
                            <FeildText name={Strings.payment.paid} text={amountPaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'} />
                            <FeildText name={Strings.payment.debt} text={(amountIncurred - amountPaid).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'} textStyle={{ color: colors.appTheme, fontWeight: 'bold' }} nameStyle={{}} />
                            {/* <FeildText name={Strings.payment.debt} text={(amountIncurred + amountOldDebt - amountPaid - amountPaidFront).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'} textStyle={{ color: colors.appTheme, fontWeight: 'bold' }} nameStyle={{}} /> */}
                        </View>

                        <Text style={{
                            fontFamily: "Inter-Bold",
                            fontSize: 16,
                            fontWeight: "bold",
                            fontStyle: "normal",
                            lineHeight: 24,
                            letterSpacing: 0,
                            textAlign: "left",
                            color: "#3d3d3d", marginBottom: 10, marginTop: 20
                        }}>{Strings.payment.detailFee}</Text>
                        {/* <View style={{ height: 1, backgroundColor: colors.gray2, marginHorizontal: -10 }} /> */}
                        {/* <FlatList
                            data={items}
                            renderItem={this.renderItem}
                            style={{ marginTop: 10 }}
                        /> */}
                        {/* <View style={{ height: 1, backgroundColor: colors.gray2, marginHorizontal: -10 }} />
                        <FeildText name={Strings.payment.total} nameStyle={{}} text={amountIncurred.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'} textStyle={{ color: colors.appTheme, fontWeight: 'bold' }} /> */}
                        {/*<View style={{
                            width: Screen.width - 40,
                            height: 120,
                            padding: 10, borderRadius: 12,
                            backgroundColor: "#ffffff",
                            shadowColor: "rgba(0, 0, 0, 0.1)",
                            elevation: 2,
                            shadowOffset: {
                                width: 0,
                                height: 4
                            },
                            shadowRadius: 10,
                            shadowOpacity: 1,
                            //backgroundColor: '#000'

                        }}>
                             <Swiper
                                dot={<View style={styles.dot} />}
                                activeDot={
                                    <View style={styles.activeDot} />
                                }
                                autoplay={true}
                                autoplayTimeout={3}
                                paginationStyle={{ bottom: 5 }}
                                showsButtons={false}>
                                {pageData}
                            </Swiper> 
                            
                        </View>*/}
                        {pageData}
                    </View>


                </ScrollView>

                {this.renderButtonPayment()}
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    leftButton={<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ padding: 10 }}><MyIcon name="arrow" size={fontsize.medium} color="#fff" /></TouchableOpacity>}
                    body={<Text style={{
                        fontFamily: "Inter-Bold",
                        fontSize: 20,
                        fontWeight: "bold",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "center",
                        color: "#ffffff"
                    }}>{Strings.payment.debitNote}</Text>}
                    rightView={<View style={{ margin: 10 }}><MyIcon name="arrow" color={colors.appTheme} size={20} /></View>}
                />
                {this.renderContent()}

                <Toast ref="toast" style={{ backgroundColor: colors.toast.success, opacity: 1, borderRadius: 5, padding: 10 }} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isShowFeeDetail}
                >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)', justifyContent: 'center', alignItems: 'center', }}>
                        {/* <View style={{ backgroundColor: '#fff'}}>
                            <FlatList
                                data={this.state.dataDetail}
                                renderItem={this.renderItemDetail}
                            />
                            <TouchableOpacity
                            onPress={()=>this.setState({isShowFeeDetail: false})}
                            style={{ borderRadius: 45, position: 'absolute', backgroundColor: '#505c5c5c', padding: 20 }}>

                            <MyIcon
                                name="no"
                                size={20}
                                color="#fff"
                            />
                        </TouchableOpacity>
                        </View> */}
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
                                <FlatList
                                    data={this.state.dataDetail}
                                    renderItem={this.renderItemDetail}
                                />
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
                                onPress={() => this.setState({ isShowFeeDetail: false })}
                                style={{ borderRadius: 45, position: 'absolute', backgroundColor: '#505c5c5c', padding: 5, top: -10, right: -10 }}>

                                <MyIcon
                                    name="no"
                                    size={15}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        //padding: 10
    },

    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    dot: {
        width: 5,
        height: 5,
        marginHorizontal: 5,
        borderRadius: 7,
        backgroundColor: 'rgb(206, 209, 212)'
    },
    activeDot: {
        width: 5,
        height: 5,
        marginHorizontal: 5,
        borderRadius: 7,
        backgroundColor: 'rgb(105, 109, 116)'
    },
    IconBadge: {
        top: -7,
        right: 8,
        position: 'absolute',
        borderRadius: 45,
        minWidth: 20,
        minHeight: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF0000'
    },
});

//make this component available to the app
const mapStateToProps = state => ({
    departmentId: state.auth.user ? state.auth.user.spaceMainId : 0,
    initComponent: state.feeDetail.initComponent,
    isLoading: state.feeDetail.isLoading,
    billCode: state.feeDetail.billCode,
    errorPayment: state.feeDetail.errorPayment,
    data: state.feeDetail.data,
    error: state.feeDetail.error,
    user: state.auth.user,
    langId: state.app.language == 'vi' ? 1 : 2,
    phoneNumber: state.auth.phoneNumber,
    password: state.auth.Pass,
    idNew: state.auth.idNew,
    errorLogin: state.auth.error,
    tokenDevice: state.auth.tokenDevice,
    errorSavePayment: state.feeDetail.errorSavePayment
})

const mapActionToProps = {
    loadDataHandle,
    refreshDataHandle,
    paymentMomoHandle,
    resetStateByKey,
    savePaymentViettelHandle,
    signOut
}
export default connect(mapStateToProps, mapActionToProps)(PaymentDetailScreen);
