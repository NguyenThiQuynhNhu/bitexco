//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    FlatList,
    Modal,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, { DURATION } from 'react-native-easy-toast';
import LinearGradient from 'react-native-linear-gradient';
import Lightbox from 'react-native-lightbox';
import moment from 'moment';
import { TabNavigator, TabBarTop } from 'react-navigation';
import { loadDataHandle, resetStateByKey, refreshDataHandle, updateRequestHandle } from '../../../actions/requestDetail';
import ErrorContent from '../../../components/common/ErrorContent';
import ImageProgress from '../../../components/common/ImageProgress';
import fontsize from '../../../theme/fontsize';
import colors from '../../../theme/colors';
import { MyIcon } from '../../../theme/icons';
import { default_image } from '../../../theme/images';
import { converStatusToColor, converStatusToString, myFromNow } from '../../../utils/request';
import VendorInfo from '../../../components/Request/Detail/VendorInfo';
import ImageGallery from '../../../components/Request/Detail/ImageGallery';
import { Screen } from '../../../utils/device';
import Strings from '../../../utils/languages';
import NavBar from '../../../components/common/NavBar';
import TabRequestDetail from '../../../navigators/TabNavigator';
import ActionSheet from '../../../components/common/ActionSheet';



// create a component
class RequestDetailScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            itemfromList: props.navigation.state.params,
            isShowModal: false,

            showAction: false,
            isToggleDate: false,
            dataRequest: {
                requestId: 0,
                content: '',
                dateProcess: moment().format('DD/MM/YYYY')
            },
            moduleId: 0,
            dateComponent: null
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.errorResponse && nextProps.errorResponse !== this.props.errorResponse) {
            if (nextProps.errorResponse.hasError) {
                this.refs.toast.show(`Xảy ra lỗi  ${nextProps.errorResponse.statusText}`, DURATION.LENGTH_LONG);
            } else {
                const { user } = this.props
                const { id } = this.state.itemfromList

                this.props.loadDataHandle({ id })
                this.refs.toast.show('Xử lý thành công', DURATION.LENGTH_LONG);
            }
        }
    }
    componentDidMount() {
        const { user } = this.props
        const { id } = this.state.itemfromList
        this.props.navigation.setParams({ onResponse: this._onResponse });
        this.props.loadDataHandle({ id })
    }

    componentWillUnmount() {
        this.props.resetStateByKey({ key: 'state' })
    }

    renderItemChat = ({ item }) => {
        const {
            dateActive,
            content,
            statusName,
            userName,
            isCustomer } = item
        return (
            <View style={{ flexDirection: 'row' }}>
                {isCustomer ?
                    <Image source={{ uri: `${this.props.user.photoUrl || default_image}` }} style={{ height: 50, width: 50, borderRadius: 25 }} /> :
                    <View
                        style={{ height: 50, width: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.grayBorder }}
                    >
                        <MyIcon
                            name="profile"
                            size={20}
                            color={colors.gray1}

                        />
                    </View>

                }

                <View
                    style={{
                        flex: 1,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        marginLeft: 10,
                    }}>
                    <Text style={{ fontWeight: 'bold' }}>{isCustomer ? this.props.user.fullName : userName}</Text>
                    <Text>{content}</Text>
                    <Text style={{ fontSize: fontsize.micro, color: colors.gray1 }}>{moment(dateActive).fromNow()}</Text>
                </View>
            </View>
        )
    }

    renderActionSheetItem = ({ item }) => {
        const { moduleId, moduleName } = item
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ showAction: false }, () => {
                        switch (moduleId) {
                            //Tiếp nhận
                            case 'tiep_nhan': return this.setState({
                                isShowModal: true,
                                moduleId
                            });
                            //Giao việc cho nhân viên
                            case 'giao_viec':
                            //Đổi Nhân Viên Thực Hiện
                            case 'doi_nhan_vien': return this.props.navigation.navigate('requestAssignEmployee', { title: moduleName });
                            //Đổi Trạng Thái Yêu Cầu
                            case 'doi_trang_thai': return this.props.navigation.navigate('requestUpdateStatus');
                            //Hoàn thành
                            case 'hoan_thanh': return this.props.navigation.navigate('requestComplete', { keyTrangThai: 'hoan_thanh' });
                            default: break;
                        }
                    })

                }
                }
                style={{ borderBottomColor: colors.grayBorder, borderBottomWidth: 0.5, borderTopColor: colors.grayBorder, borderTopWidth: 0.5, alignItems: 'center' }}
            >
                <Text style={{ margin: 10, color: colors.blue, fontSize: fontsize.larg }}>{moduleName}</Text>
            </TouchableOpacity>
        )
    }

    renderContent() {
        const { error, towerId, data, isLoading } = this.props;
        const { showAction } = this.state
        if (isLoading) {
            return (<View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator animating size="small" />
            </View>)
        }

        if (error && error.hasError) {
            return (
                <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.refreshDataHandle()} />
            )
        }
        if (data) {
            const {
                id,
                title,
                content,
                statusId,
                statusName,
                statusColor,
                dateCreate,
                priorotyId,
                residentName,
                contractName,
                avatarResident,
                employeeName,
                departmentId,
                departmentName,
                totalRow,
                methodProcess,
                isReceive,
                phoneContact,
                colorCode,
                userContact
            } = data;
            const { dataRequest } = this.state;

            return (

                <View style={{ flex: 1, borderTopRightRadius: 20, paddingHorizontal: 20 }}>
                    {/* Thông tin nha cung cap */}
                    <View
                        style={{
                            flexDirection: 'row',
                            //borderBottomWidth: 1,
                            // borderColor: colors.grayBorder,
                            //padding: 20,
                            paddingBottom: 10,
                            backgroundColor: '#fff',
                            borderTopRightRadius: 20
                        }}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <ImageProgress
                                circle={true}
                                style={{
                                    height: 46,
                                    width: 46
                                }}
                                source={{ uri: avatarResident }}
                            />
                            {/* <View style={{ marginTop: 10, backgroundColor: colorCode, paddingHorizontal: 20, paddingVertical: 5 }}>
                                <Text style={{ color: '#fff' }}>{statusName}</Text>
                            </View> */}
                        </View>
                        <View style={{ flex: 1, marginLeft: 10, justifyContent: 'flex-start' }}>
                            <Text style={{
                                fontFamily: "Inter-Bold",
                                fontSize: 16,
                                fontWeight: "bold",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                //textAlign: "center",
                                color: "#000000"
                            }}>{residentName || userContact}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    {phoneContact.length > 0 && <Text style={{
                                        marginVertical: 5, fontFamily: "Inter-Regular",
                                        fontSize: 14,
                                        fontWeight: "normal",
                                        fontStyle: "normal",
                                        letterSpacing: 0,
                                        color: "#000000"
                                    }}>{phoneContact}</Text>}
                                    {contractName &&
                                        <Text style={{
                                            fontFamily: "Inter-Regular",
                                            fontSize: 14,
                                            fontWeight: "normal",
                                            fontStyle: "normal",
                                            letterSpacing: 0,
                                            color: "#000000"
                                        }}>MS: {contractName}</Text>
                                    }

                                </View>
                                {statusName &&
                                    <View style={{ borderRadius: 8, backgroundColor: colorCode, paddingHorizontal: 20, alignItems: 'center', marginVertical: 5, justifyContent: 'center', paddingVertical: 5 }}>
                                        <Text style={{
                                            color: '#fff', fontFamily: "Inter-SemiBold", fontSize: 15,
                                            fontWeight: "600",
                                            fontStyle: "normal",
                                            letterSpacing: 0,
                                            textAlign: "center"
                                        }}>{statusName}</Text>
                                    </View>
                                }
                            </View>


                            <Text style={{ color: colors.gray1, marginTop: 5, fontSize: 14 }}>{myFromNow(dateCreate)}</Text>
                        </View>
                    </View >
                    {/* Nội dung */}

                    <TabRequestDetail data={data} />
        
                    <Modal
                        onRequestClose={() => null}
                        transparent={true}
                        visible={this.state.isShowModal}
                    >
                        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : ""}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0, 0, 0,0.3)'
                            }}>
                            <LinearGradient
                                colors={[colors.appTheme, '#fff']}
                                style={styles.linearGradient}
                            >
                                <View
                                    style={{
                                        borderRadius: 16
                                    }}
                                >
                                    <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{
                                            color: 'white',
                                            fontFamily: "Inter-SemiBold",
                                            fontSize: 18,
                                            fontWeight: "600",
                                            fontStyle: "normal",
                                            letterSpacing: 0,
                                            textAlign: "center"
                                        }}>{Strings.app.confirm}</Text>
                                    </View>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                                            <MyIcon
                                                name="calendar"
                                                size={20}
                                                color="#fff"
                                                style={{ margin: 10 }}
                                            />
                                            <TouchableOpacity
                                                onPress={() => this.setState({
                                                    isToggleDate: true
                                                })}


                                                style={{ backgroundColor: '#fff' }}>
                                                <Text style={{ margin: 20, marginVertical: 10 }}>{this.state.dataRequest.dateProcess}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <TextInput
                                                autoFocus
                                                autoCorrect={false}
                                                style={{
                                                    backgroundColor: '#fff',
                                                    height: 100,
                                                    borderRadius: 8,
                                                    borderWidth: 1,
                                                    margin: 10,
                                                    marginLeft: 10,
                                                    borderColor: colors.grayBorder,
                                                    textAlignVertical: 'top',
                                                    fontFamily: "Inter-Regular",
                                                    fontSize: 14,
                                                }}
                                                underlineColorAndroid="transparent"
                                                multiline={true}
                                                placeholder={Strings.app.description}
                                                onChangeText={(text) => this.setState({ dataRequest: { ...this.state.dataRequest, content: text } })}
                                            />
                                        </View>

                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 20, alignSelf: 'center', marginBottom: 10 }}>

                                        <TouchableOpacity
                                            onPress={() => this.setState({ isShowModal: false })}
                                            style={{
                                                height: 50,
                                                width: 50,
                                                borderRadius: 25,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: "#ffffff",
                                                borderStyle: "solid",
                                                borderWidth: 1,
                                                borderColor: colors.appTheme
                                            }}
                                        >
                                            <MyIcon
                                                name="x"
                                                size={30}
                                                color={colors.appTheme}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                marginLeft: 50,
                                                height: 50,
                                                width: 50,
                                                borderRadius: 25,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: colors.appTheme
                                            }}
                                            onPress={() => this.setState({ isShowModal: false }, () => { this.props.updateRequestHandle({ requestId: id, content: dataRequest.content, keyTrangThai: 'dang_xu_ly', dateProcess: dataRequest.dateProcess }, 'RequestReceive') })}
                                        >
                                            <MyIcon
                                                name="check"
                                                size={30}
                                                color="#fff"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </LinearGradient>
                        </KeyboardAvoidingView>
                        <DateTimePicker
                            cancelTextIOS={Strings.createRequest.cancel}
                            titleIOS={Strings.createRequest.titlePicker}
                            confirmTextIOS={Strings.createRequest.chose}
                            mode="date"

                            isVisible={this.state.isToggleDate}
                            onConfirm={(date) => {
                                this.setState({ dataReuest: { ...this.state.dataReuest, dateProcess: date }, isToggleDate: false })
                            }}
                            onCancel={() => { this.setState({ isToggleDate: false }); }}
                        />
                    </Modal>
                    <Spinner visible={this.props.isLoadingReponse} textContent={Strings.app.progressing} textStyle={{ color: '#FFF', fontSize: fontsize.small }} />
                    { methodProcess.length > 0 ?
                        <ActionSheet visible={showAction} data={methodProcess} renderItem={this.renderActionSheetItem} closeAction={() => this.setState({ showAction: false })} />
                        : null}
                </View >
            )
        }

    }

    render() {
        const { data } = this.props
        const methodProcess = data ? data.methodProcess : [];
        const { showAction } = this.state;
        const leftButton = (
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => this.props.navigation.goBack()}
            >
                <MyIcon
                    name="arrow"
                    size={22}
                    color="#fff"
                />
            </TouchableOpacity>
        )
        const rightButton = (methodProcess.length > 0 ?
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => this.setState({ showAction: true })}
            >
                <MyIcon
                    name="more-vertical"
                    size={25}
                    color="#fff"
                />
            </TouchableOpacity>
            : <TouchableOpacity
            style={{ padding: 10 }}
        >
            <MyIcon
                name="more-vertical"
                size={25}
                color={colors.appTheme}
            />
        </TouchableOpacity>);
        return (
            <View style={styles.container}>
                <NavBar leftButton={leftButton} body={<Text numberOfLines={1} lineBreakMode="tail" style={{
                    fontFamily: "Inter-Bold",
                    fontSize: 20,
                    textAlign: "center",
                    color: "#ffffff"
                }}>{data ? data.title : ''}</Text>} rightView={data ? rightButton : <TouchableOpacity
                    style={{ padding: 10 }}></TouchableOpacity>} />
                {this.renderContent()}
                <Toast ref="toast" style={{ backgroundColor: colors.toast.success }} />
            </View>
        );
    }

}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    linearGradient: {
        width: '90%',
        borderRadius: 16,
        backgroundColor: colors.primaryKeyColor
    },

});
const mapStateToProps = state => ({
    user: state.auth.user,
    initList: state.requestDetail.initList,
    data: state.requestDetail.data,
    isLoading: state.requestDetail.isLoading,
    errorResponse: state.requestDetail.errorResponse,
    error: state.requestDetail.error,

})

const mapActionToProps = {
    loadDataHandle,
    resetStateByKey,
    refreshDataHandle,
    updateRequestHandle
}

//make this component available to the app
export default connect(mapStateToProps, mapActionToProps)(RequestDetailScreen);
