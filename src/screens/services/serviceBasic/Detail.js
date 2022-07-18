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
    ActivityIndicator,
    Linking,
    LinkingIOS
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, { DURATION } from 'react-native-easy-toast';
import moment from 'moment';
import { loadDataHandle, resetStateByKey, updateRequestHandle, refreshDataHandle } from '../../../actions/servicesBasicDetail';
import ErrorContent from '../../../components/common/ErrorContent';
import ImageProgress from '../../../components/common/ImageProgress';
import fontsize from '../../../theme/fontsize';
import colors from '../../../theme/colors';
import { MyIcon } from '../../../theme/icons';
import { default_image } from '../../../theme/images';
import { converStatusToColor, converStatusToString } from '../../../utils/serviceBasic';
import Strings from '../../../utils/languages';
import NavBar from '../../../components/common/NavBar';
import ActionSheet from '../../../components/common/ActionSheet';
import { Screen } from '../../../utils/device';
// create a component
class ServiceBasicDetailScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            // itemfromList: props.navigation.state.params,
            isShowModal: false,
            content: '',
            showAction: false,
            title: '',
            statusId: 0
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.errorResponse && nextProps.errorResponse !== this.props.errorResponse) {
            if (nextProps.errorResponse.hasError) {
                this.refs.toast.show(`Xảy ra lỗi  ${nextProps.errorResponse.message}`, DURATION.LENGTH_LONG);
            } else {
                this.props.loadDataHandle({ id: this.props.navigation.state.params.id, langId: this.props.langId })
                this.refs.toast.show('Xử lý thành công', DURATION.LENGTH_LONG);
            }
        }
        if (nextProps.errorProgress && nextProps.errorProgress !== this.props.errorProgress) {
            if (nextProps.errorProgress.hasError) {
                this.refs.toast.show(`Xảy ra lỗi  ${nextProps.errorProgress.message}`, DURATION.LENGTH_LONG);
            } else {
                this.props.loadDataHandle({ id: this.props.navigation.state.params.id, langId: this.props.langId })
                this.refs.toast.show('Đánh giá thành công', DURATION.LENGTH_LONG);
            }
        }
    }
    componentDidMount() {
        this.props.loadDataHandle({ id: this.props.navigation.state.params.id, langId: this.props.langId })
    }

    componentWillUnmount() {
        this.props.resetStateByKey({ key: 'state' })
    }

    renderStar(active, rate) {
        return (
            <MyIcon
                name="star"
                size={20}
                color={colors.appTheme}
                style={active ? styles.iconStarActive : styles.iconStarDeactive}
            />
        )
    }

    renderRateView(ratingMark) {
        const listStar = []
        for (let i = 0; i < 5; i += 1) {
            const active = i < ratingMark
            listStar.push(this.renderStar(active, i + 1))
        }
        return listStar
    }

    renderItemChat = ({ item }) => {
        const {
            dateCreate,
            description,
            statusName,
            statusId,
            userName,
            avatarUrl,
            ratingMark,
            isCustomer } = item
        return (
            <View style={{
                borderRadius: 16, padding: 10,
                backgroundColor: "#ffffff",
                shadowColor: "rgba(0, 0, 0, 0.08)",
                elevation: 2,
                shadowOffset: {
                    width: 0,
                    height: 4
                },
                shadowRadius: 12,
                shadowOpacity: 1,
                marginHorizontal: 20,
                marginVertical: 10
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <ImageProgress source={{ uri: `${isCustomer ? this.props.user.photoUrl : avatarUrl || default_image}` }} circle={true}
                        style={{
                            height: 32,
                            width: 32
                        }} />
                    <View
                        style={{
                            width: Screen.width - 102,
                            justifyContent: 'center',
                            marginLeft: 10,
                        }}>
                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>

                            {isCustomer ? <View /> : <View
                                style={{
                                    marginRight: 5,
                                    backgroundColor: colors.gray1,
                                    borderRadius: 15
                                }}>
                                <Text style={{ margin: 2, marginHorizontal: 5, fontSize: fontsize.micro, color: '#fff', fontFamily: "Inter-Regular" }}>BQL</Text>
                            </View>}
                            <Text style={{
                                fontFamily: "Inter-SemiBold",
                                fontSize: 16,
                                fontWeight: "600",
                                textAlign: "left",
                                color: "#292929",
                                flex: 0.8
                            }}>{userName}</Text>
                            <View
                                style={{
                                    marginLeft: 10,
                                    backgroundColor: '#fff5eb',
                                    borderRadius: 15
                                }}>
                                <Text style={{ margin: 5, marginHorizontal: 10, fontSize: fontsize.micro, color: converStatusToColor(statusId), fontFamily: "Inter-Regular" }}>{statusName}</Text>
                            </View>
                        </View>


                        <Text style={{ fontSize: fontsize.micro, color: colors.gray1, fontFamily: "Inter-Regular", marginTop: 5 }}>{moment(dateCreate).format('DD/MM/YYYY HH:mm')}</Text>

                    </View>
                </View>

                {(ratingMark === 0 || ratingMark === undefined) ? <View /> :
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        {this.renderRateView(ratingMark)}
                    </View>
                }

                <Text style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 13,
                    textAlign: "left",
                    color: "#3d3d3d", marginTop: 10
                }}>{description}</Text>
            </View>
        )
    }

    renderActionSheetItem = ({ item }) => {
        const { moduleId, moduleName } = item

        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ showAction: false }, () => {
                        return this.setState({
                            isShowModal: true,
                            moduleId,
                            statusId: moduleId,
                            title: moduleName
                        });
                    })

                }
                }
                style={{ borderBottomColor: colors.grayBorder, borderBottomWidth: 0.5, borderTopColor: colors.grayBorder, borderTopWidth: 0.5, alignItems: 'center' }}
            >
                <Text style={{ margin: 10, color: colors.blue, fontSize: fontsize.larg }}>{moduleName}</Text>
            </TouchableOpacity>
        )
    }

    renderItemZone({ item }) {

        return (
            <View
                style={{
                    marginRight: 10,
                    marginVertical: 5,
                    backgroundColor: colors.grayBorder,
                    borderRadius: 15
                }}>
                < Text style={{ margin: 5, marginHorizontal: 10, ...styles.textInfo }}>{item}</Text>
            </View>
        );
    }

    renderContent() {
        const { showAction } = this.state;
        const { error, data, initComponent } = this.props;
        if (initComponent) {
            return null
        }
        if (error && error.hasError) {
            return (
                <ErrorContent title={Strings.app.error + ' hoặc phiếu yêu cầu không còn tồn tại'} onTouchScreen={() => this.props.refreshDataHandle()} />
            )
        }
        if (data == null) {
            return (
                <ErrorContent title={Strings.app.emptyData} onTouchScreen={() => this.props.refreshDataHandle()} />
            )
        } else if (data) {
            const {
                seviceBasic,
                historys,
                methodProcess
            } = this.props.data;
            const { content } = this.state;
            const {
                apartmentId,
                dateBook,
                dateCreate,
                dateOfProcess,
                departmentId,
                departmentName,
                description,
                employeeName,
                id,
                lastComment,
                logo,
                price,
                rating,
                ratingComment,
                residentId,
                serviceName,
                statusId,
                statusName,
                towerId,
                zoneTimes,
                zoneName,
                residentName,
                residentPhone,
                amount
            } = seviceBasic
            return (

                <ScrollView style={{ borderTopRightRadius: 20 }}>
                    <View style={{ flex: 1, borderTopRightRadius: 20  }}>
                        {/* Thông tin nha cung cap */}
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 20,
                                backgroundColor: '#fff',
                                borderTopRightRadius: 20
                            }}
                        >
                            <ImageProgress
                                circle={true}
                                style={{
                                    height: 65,
                                    width: 65
                                }}

                                source={{ uri: this.props.navigation.state.params.avatar }}
                            />
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', marginHorizontal: 10 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.call(residentPhone);
                                    }}
                                >
                                    <Text style={{
                                        fontSize: fontsize.small, fontFamily: "Inter-SemiBold",
                                        fontSize: 16,
                                        fontWeight: "600",
                                        textAlign: "left",
                                        color: "#292929"
                                    }}>{residentName}</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                        <Text style={{
                                            marginVertical: 0, fontFamily: "Inter-Medium",
                                            fontSize: 12,
                                            fontWeight: "500",
                                            textAlign: "left",
                                            color: "#292929"
                                        }}>{residentPhone}</Text>
                                        <View
                                            style={{
                                                borderRadius: 16, backgroundColor: converStatusToColor(statusId), paddingHorizontal: 20, alignItems: 'center', marginVertical: 5, justifyContent: 'center', paddingVertical: 5
                                            }}>
                                            < Text style={{
                                                color: "#fff", fontFamily: "Inter-SemiBold", fontSize: 15,
                                                fontWeight: "600",
                                                fontStyle: "normal",
                                                letterSpacing: 0,
                                                textAlign: "center"
                                            }}>{converStatusToString(statusId)}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <Text style={{
                                    fontFamily: "Inter-Regular",
                                    fontSize: 13,
                                    letterSpacing: 0,
                                    textAlign: "left",
                                    color: "#ff3d00"
                                }} numberOfLines={1}>{employeeName} - {departmentName}</Text>


                            </View>
                        </View >
                        {
                            description ? <Text style={{
                                fontFamily: "Inter-Regular",
                                fontSize: 13,
                                textAlign: "left",
                                color: "#3d3d3d",
                                marginHorizontal: 20,
                                marginTop: 15
                            }}>{description}</Text> : null
                        }

                        <View style={{
                            borderRadius: 16,
                            backgroundColor: "#ffffff",
                            shadowColor: "rgba(0, 0, 0, 0.1)",
                            elevation: 2,
                            shadowOffset: {
                                width: 0,
                                height: 4
                            },
                            shadowRadius: 10,
                            shadowOpacity: 1,
                            margin: 20
                        }}>
                            <ImageProgress

                                style={{
                                    borderRadius: 16,
                                    height: 150,
                                    width: '100%'
                                }}

                                source={{ uri: logo }}
                            />
                            {/* Nội dung */}
                            <View style={{ flexDirection: 'row', marginBottom: 10, paddingHorizontal: 10, marginTop: 15, justifyContent: 'space-between' }}>
                                <Text style={styles.textTitle}>{Strings.serviceBasicBooking.amountPeople}</Text>
                                <Text style={{ ...styles.textInfo, marginLeft: 5 }}>{amount}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 10, paddingHorizontal: 10, justifyContent: 'space-between' }}>
                                <Text style={styles.textTitle}>{Strings.serviceBasicBooking.dateCreate}</Text>
                                <Text style={{ ...styles.textInfo, marginLeft: 10 }}>{moment(dateCreate).format('DD/MM/YYYY HH:mm')}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginBottom: 10, paddingHorizontal: 10, justifyContent: 'space-between' }}>
                                <Text style={styles.textTitle}>{Strings.serviceBasicBooking.dateBook}</Text>
                                <Text style={{ ...styles.textInfo, marginLeft: 5 }}>{moment(dateBook).format('DD/MM/YYYY')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 10, paddingHorizontal: 10, justifyContent: 'space-between' }}>
                                <Text style={styles.textTitle}>{Strings.serviceBasicBooking.position}</Text>
                                <Text style={{ ...styles.textInfo, marginLeft: 5 }}>{zoneName}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginBottom: 10, paddingHorizontal: 10, justifyContent: 'space-between' }}>
                                <Text style={styles.textTitle}>{Strings.serviceBasicBooking.deposit}</Text>
                                <Text style={{ ...styles.textInfo, color: "#ff624d", marginLeft: 5 }}>{price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} <Text style={{
                                    fontFamily: "Inter",
                                    fontSize: 11,
                                    textAlign: "right",
                                    color: "#6f6f6f"
                                }}>VNĐ</Text></Text>
                            </View>
                            <View style={{ marginBottom: 15, paddingHorizontal: 10 }}>
                                <Text style={styles.textTitle}>{Strings.serviceBasicBooking.time}</Text>
                                <FlatList
                                    style={{ alignSelf: 'flex-start', marginLeft: 5 }}
                                    scrollEnabled={false}
                                    data={zoneTimes}
                                    keyExtractor={(index) => `${index}`}
                                    renderItem={this.renderItemZone}
                                    numColumns={2}
                                    horizontal={false} />
                            </View>


                        </View>

                        <View style={{ marginHorizontal: 20, height: 1, backgroundColor: "#d4d4d4" }} />

                        {/* Chat */}
                        <View>
                            <FlatList
                                data={historys || []}
                                keyExtractor={(item, index) => `${index}`}
                                renderItem={(item) => this.renderItemChat(item)}
                            />
                        </View>
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
                                            }}>{this.state.title}</Text>
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
                                                onChangeText={(content) => this.setState({ content })}
                                            />
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
                                                onPress={() => this.setState({ isShowModal: false }, () => {
                                                    this.props.updateRequestHandle({
                                                        bookingId: id,
                                                        statusId: this.state.statusId,
                                                        description: content,
                                                        towerName: this.props.user.towerName,
                                                        serviceName: serviceName
                                                    })
                                                })}
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

                        </Modal>
                        <Spinner visible={this.props.isLoadingReponse} textContent={Strings.app.progressing} textStyle={{ color: '#FFF', fontSize: fontsize.small }} />

                        <ActionSheet visible={showAction} data={methodProcess} renderItem={this.renderActionSheetItem} closeAction={() => this.setState({ showAction: false })} />
                    </View >
                </ScrollView >
            )
        }

    }

    call(phone) {
        Linking.canOpenURL(`tel: ${phone}`).then((supported) => {
            if (!supported) {
                this.refs.toast.show(`Số điện thoại không đúng!Vui lòng kiểm tra lại.`, DURATION.LENGTH_LONG);
            } else {
                return Linking.openURL(`tel:${phone}`);
            }
        }).catch((error) => {
            this.refs.toast.show(`Xảy ra lỗi! Vui lòng thử lại.`, DURATION.LENGTH_LONG);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    leftButton={<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ padding: 10 }}><MyIcon name="arrow" color="#fff" size={22} /></TouchableOpacity>}
                    body={<Text style={{
                        fontFamily: "Inter-Bold",
                        fontSize: 20,
                        textAlign: "center",
                        color: "#ffffff"
                    }}>{this.props.data && this.props.data.seviceBasic.serviceName}</Text>}
                    rightView={this.props.data && this.props.data.methodProcess &&
                        <TouchableOpacity
                            onPress={() =>
                                this.setState({ showAction: true })
                            }
                            style={{ padding: 10 }}>
                            <MyIcon
                                name="more-vertical"
                                size={25}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    }
                />
                {this.renderContent()}

                <Spinner visible={this.props.isLoading} textContent={Strings.app.loading} textStyle={{ color: '#FFF', fontSize: fontsize.small }} />
                <Toast ref="toast" style={{ backgroundColor: this.props.errorResponse && this.props.errorResponse.hasError ? colors.toast.warning : colors.toast.success }} />
            </View>
        );
    }
    // _onResponseSuccess = (requestData) => {
    //     if (this.state.content.length !== 0) {
    //         this.setState({ isShowModal: false }, () => this.props.feedbackHandle(requestData))
    //     } else {
    //         this.refs.toast.show(Strings.detailRequest.typeContent, DURATION.LENGTH_LONG);
    //     }
    // }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    linearGradient: {
        borderRadius: 16,
        width: '90%',
        backgroundColor: colors.primaryKeyColor
    },
    cardView: {
        borderRadius: 5,
        flexDirection: 'row',
        margin: 5,
        padding: 2,
        borderColor: '#fafafa',
        borderWidth: 1,
        backgroundColor: 'white'
    },
    iconStarDeactive: {
        margin: 5,
        opacity: 0.5
    },
    iconStarActive: {
        margin: 5
    },
    wrapperTextIcon: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10
    },
    swiperImage: {
        margin: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textTitle: {
        fontFamily: "Inter-Medium",
        fontSize: 14,
        fontWeight: "500",
        textAlign: "left",
        color: "#3d3d3d"
    },
    textInfo: {
        fontFamily: "Inter-Medium",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "left",
        color: "#282828"
    }
});
const mapStateToProps = state => ({
    user: state.auth.user,
    initComponent: state.servicesBasicDetail.initComponent,
    data: state.servicesBasicDetail.data,
    isLoading: state.servicesBasicDetail.isLoading,
    errorResponse: state.servicesBasicDetail.errorResponse,
    errorProgress: state.servicesBasicDetail.errorProgress,
    error: state.servicesBasicDetail.error,
    langId: state.app.language == 'vi' ? 1 : 2,
})

const mapActionToProps = {
    loadDataHandle,
    resetStateByKey,
    updateRequestHandle,
    refreshDataHandle
}

//make this component available to the app
export default connect(mapStateToProps, mapActionToProps)(ServiceBasicDetailScreen);
