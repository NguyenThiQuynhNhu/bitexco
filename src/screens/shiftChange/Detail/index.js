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
import ImagePicker from 'react-native-image-picker';
import * as mineTypes from 'react-native-mime-types';

import Spinner from 'react-native-loading-spinner-overlay';
import Toast, { DURATION } from 'react-native-easy-toast';
import Lightbox from 'react-native-lightbox';
import { loadDataHandle, resetStateByKey, refreshDataHandle, updateHandle, updateStatusHandle } from '../../../actions/shiftChangeDetail';
import ErrorContent from '../../../components/common/ErrorContent';
import ImageProgress from '../../../components/common/ImageProgress';
import fontsize from '../../../theme/fontsize';
import colors from '../../../theme/colors';
import { MyIcon } from '../../../theme/icons';
import Strings from '../../../utils/languages';
import NavBar from '../../../components/common/NavBar';
import ListItem from '../../../components/Checklist/Detail/ListItem';
import moment from 'moment';
import { default_image } from '../../../theme/images';
import Timeline from 'react-native-timeline-flatlist';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import CheckBox from '../../../components/common/CheckBox';

const Devices = require('react-native-device-detection');

const initState = {
    description: '',
    valueInput: null,
    action:{
        id: 0,
        name: ''
    },
    images: [],
}
// create a component
class ChangeShiftDetailScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            itemfromList: props.navigation.state.params,
            isShowModal: false,
            showAction: false,
            description: '',
            moduleId: 0,
            dateComponent: null,
            images: [],
            itemSelected: null,
            dataSelect: [],
            valueInput: null,
            action:{
                id: 0,
                name: ''
            },
            property:{
                id: 0,
                name: ''
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.errorUpdate && nextProps.errorUpdate !== this.props.errorUpdate) {
            if (nextProps.errorUpdate.hasError) {
                this.refs.toast.show(`Xảy ra lỗi`, DURATION.LENGTH_LONG);
            } else {
                if(nextProps.data.methodProcess !== this.props.data.methodProcess){
                    const { id } = this.state.itemfromList
                    this.props.loadDataHandle({ id })
                }

                this.refs.toast.show(`Thao tác thành công`, DURATION.LENGTH_LONG);
            }
        }

    }

    componentDidMount() {
        const { user } = this.props
        const {
            id
        } = this.state.itemfromList
        this.props.navigation.setParams({ onResponse: this._onResponse });
        this.props.loadDataHandle({
            id
        })
    }

    componentWillUnmount() {
        this.props.resetStateByKey({ key: 'state' })
    }

    renderItem = ({ item, index }) => {
        const { statusId } = this.props.data;
        return <ListItem item={item} statusId={statusId} index={index}
            onPress={() => { this.setState({ ...initState, isShowModalItem: true, itemSelected: item }) }}
        />
    }

    renderItemMenu = ({ item }) =>{
        return(
            <TouchableOpacity
                onPress={() => {
                    switch(item.moduleId){
                        case -1://Bỏ qua
                            this.setState({ showAction: false })
                        break;

                        case 100://Tạo đề xuất
                            this.setState({ ...initState, showAction: false }, () => {
                                this.setState({
                                    isShowModalProposal: true,
                                    moduleId: item.moduleId,
                                    action: {
                                        id: item.moduleId,
                                        name: item.moduleName
                                    }
                                });
                            })
                        break;

                        default:
                            this.setState({...initState, showAction: false }, () => {
                                this.setState({
                                    isShowModal: true,
                                    moduleId: item.moduleId,
                                    action: {
                                        id: item.moduleId,
                                        name: item.moduleName
                                    }
                                });
                            })
                        break;
                    }
                }
                }
                style={{ alignItems: 'center' }}
            >
                <Text style={{ margin: 10, color: item.moduleId === -1 ? 'red' : colors.blue, fontSize: fontsize.larg }}>{item.moduleName}</Text>
            </TouchableOpacity>
        )
    }

    renderActionMenu = () => {
        const { data } = this.props;

        const { methodProcess } = data;
        return(
            <FlatList
                        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
                        data={methodProcess}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={this.renderItemMenu}
                        onEndReachedThreshold={0.5}
                    />
        )
    }

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

    renderItemHistory = ({ item }) => {
        const {
            dateCreate,
            description,
            status,
            statusId,
            employeeName,
            imageUrl,
        } = item
        return (
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <ImageProgress source={{ uri: `${imageUrl || default_image}` }} circle={true}
                    style={{
                        height: 50,
                        width: 50
                    }} />

                <View
                    style={{
                        flex: 1,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        marginLeft: 10,
                    }}>
                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }}>{employeeName}</Text>
                        <View
                            style={{
                                marginLeft: 10,
                                marginVertical: 5,
                                backgroundColor: colors.gray2,
                                borderRadius: 15
                            }}>
                            <Text style={{ margin: 2, marginHorizontal: 5, fontSize: fontsize.micro }}>{status}</Text>
                        </View>
                    </View>
                    <Text>{description}</Text>
                    <Text style={{ fontSize: fontsize.micro, color: colors.gray1 }}>{moment(dateCreate).format('DD/MM/YYYY HH:mm')}</Text>

                </View>
            </View>
        )
    }

    renderDetail(rowData, sectionID, rowID) {
        let time = this.props.language == 'en' ? moment(rowData.dateCreate).format('HH:mm:ss - MMMM Do YYYY') : moment(rowData.dateCreate).format('HH:mm:ss - DD [tháng] MM, YYYY')

        let title = rowID == '0' ?
            (<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><Text style={styles.infoTextHistory}>{time}</Text>
                <TouchableOpacity
                    style={{ padding: 4, flex: 1, alignItems: 'flex-end' }}
                    onPress={() => {
                        this.setState({ showPopupHistory: true }
                        ); ((rowData.description !== null && rowData.description !== undefined && rowData.description.length > 0) ? this.setState({ isUpdate: true }) : this.setState({ isUpdate: false }))
                    }}>
                </TouchableOpacity>
            </View>)
            : (<Text style={styles.infoTextHistory}>{time}</Text>);
        let desc = null
        if (rowData.description !== null && rowData.description !== undefined && rowData.description.length > 0) {
            desc = (
                <View style={{ alignContent: 'space-between', paddingRight: 5}}>
                    <Text>
                        {rowData.description}
                    </Text>
                </View>)

        }
        let info = null
        //if (rowData.status !== null && rowData.status !== undefined && /rowData.status.length > 0) {
            info = (
                <View>
                    <View style={{flex: 1, flexDirection:'row'}}>
                        <Text style={{color: colors.appTheme}}>
                            {rowData.status} - {rowData.employeeName}
                        </Text>                            
                    </View>
                </View>
            )
        //}
        
        return (
            <View style={{ flex: 1, paddingTop: 10 }}>
                <View style={{ marginTop: -25, marginBottom: 10 }}>
                    {title}
                    {info}
                    {desc}
                </View>
            </View>
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
                description,
                imageUrl,
                employeeCreate,
                status,
                statusId,
                dateCreate,
                typeId,
                employeeApproved,
                employeeEdit,
                shift1,
                shift2,
                employeeName1,
                employeeAvatar1,
                employeeName2,
                employeeAvatar2,
                methodProcess,
                histories,
                shiftOld1,
                shiftOld2,
                date1,
                date2,
                isReplace
            } = data;
            const { dataRequest, action } = this.state;

            return (

                <ScrollView>
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>                        
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 10,
                                backgroundColor: '#fff'
                            }}
                        >
                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.gray2, padding: 5, borderRadius: 5 }}>
                                <View style={{ width: '45%' }}>
                                    <View style={{ alignContent: 'flex-end', alignItems: 'flex-end', marginBottom: 5 }}>
                                        <ImageProgress
                                            circle={true}
                                            style={{
                                                height: 50,
                                                width: 50,
                                            }}

                                            source={{ uri: employeeAvatar2 }}
                                        />
                                    </View>
                                    <Text style={{ textAlign: 'right' }}>{employeeName2.toLocaleUpperCase()}</Text>
                                    { isReplace === true ? <Text style={{ fontWeight: '300', textAlign: 'right' }}>Làm thay</Text> : <Text style={{ fontWeight: '300', textAlign: 'right' }}>Ca {shiftOld2 !== null ? shiftOld2 : ''}</Text>}

                                    { date2 !== null ? <Text style={{ textAlign: 'right' }} numberOfLines={2} lineBreakMode="tail">{moment(date2).format('DD/MM/YYYY')}</Text> : null }
                                </View>
                                <View style={{ width: '5%', alignContent:'center', alignItems: 'center', margin: 10, paddingTop: 10 }}>
                                { isReplace === true ? <Icon name='autorenew' size={15} color={colors.appTheme} /> : <Icon name='chevron-right' size={15} color={colors.appTheme} /> }
                                </View>
                                <View style={{ width: '50%' }}>
                                    <View style={{ marginBottom: 5 }}>
                                        <ImageProgress
                                            circle={true}
                                            style={{
                                                height: 50,
                                                width: 50,
                                            }}

                                            source={{ uri: employeeAvatar1 }}
                                        />
                                    </View>
                                    <Text style={{  }}>{employeeName1.toLocaleUpperCase()}</Text>
                                    <Text style={{ fontWeight: '300' }}>Ca {shiftOld1 !== null ? shiftOld1 : ''}</Text>
                                    { date1 !== null ? <Text numberOfLines={2} lineBreakMode="tail">{moment(date1).format('DD/MM/YYYY')}</Text> : null }
                                </View>
                            </View>
                        </View >

                        <View style={{ padding: 10, justifyContent: 'center' }}>
                                <Text style={{ color: colors.appTheme, fontSize: fontsize.medium, textAlign: 'center' }}>{status}</Text>
                            </View>

                        {/* Content */}
                        <View style={{
                            padding: 10,
                            marginTop: 10,
                            marginBottom: 10,
                            borderColor: colors.gray2,
                            borderTopWidth: 10,
                            marginHorizontal: -10,
                        }}>
                            <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>NỘI DUNG</Text>
                            <Icon name='format-quote-open' size={20} color={colors.gray1} style={{ position:'absolute', top: 30, left: 5, }} />
                            <Text style={{ margin: 10, fontSize: fontsize.medium }}>{description}</Text>
                            <Icon name='format-quote-close' size={20} color={colors.gray1} style={{ position:'absolute', right: 10, bottom: 5 }}/>
                        </View> 

                        {/* Histories */}
                        <View style={{
                            padding: 10,
                            marginTop: 10,
                            marginBottom: 10,
                            borderColor: colors.gray2,
                            borderTopWidth: 10,
                            marginHorizontal: -10,
                        }}>

                            <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>LỊCH SỬ</Text>
                            {/* <FlatList
                                ItemSeparatorComponent={() => <View style={{ height: 10, backgroundColor: '#fff' }} />}
                                data={histories || []}
                                keyExtractor={(item, index) => `${index}`}
                                renderItem={(item) => this.renderItemHistory(item)}
                            /> */}
                            <Timeline
                                separator={false}
                                circleSize={10}
                                circleColor={colors.appTheme}
                                lineColor='#d4d4d4'
                                timeContainerStyle={{ maxWidth: 0, minWidth: 0 }}
                                descriptionStyle={{ color: 'red', fontSize: 12 }}
                                titleStyle={{ fontSize: 12 }}
                                options={{
                                    style: { paddingTop: 10 }
                                }}
                                lineWidth={1}
                                enableEmptySections={true}
                                keyExtractor={(item, index) => index}
                                renderDetail={this.renderDetail.bind(this)}
                                data={histories || []}
                            />
                        </View>

                    <Spinner visible={this.props.isLoadingReponse} textContent={Strings.app.progressing} textStyle={{ color: '#FFF', fontSize: fontsize.small }} />
                </View >
                </ScrollView>
            )
        }

    }

    render() {
        const { data } = this.props
        const { showAction, action, itemSelected, valueInput, property } = this.state;
        const leftButton = (
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => this.props.navigation.goBack(null)}
            >
                <MyIcon
                    name="arrow"
                    size={22}
                    color="#fff"
                />
            </TouchableOpacity>
        )
        const rightButton = (
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
        )
        return (
            <View style={styles.container}>
                <NavBar
                    leftButton={leftButton}
                    body={<Text style={{ color: '#fff', fontSize: fontsize.medium, fontWeight: 'bold', alignSelf: 'center', paddingLeft: 40, paddingRight: 40 }}>{data ? data.description : ''}</Text>}
                    rightView={data ? rightButton : null} />
                    
                {this.renderContent()}

                {this.state.showAction &&
                    <View style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        backgroundColor: colors.appOverView,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        paddingBottom: 20,
                        zIndex: 20
                    }}>
                        <View style={{
                            width: Devices.isTablet ? "50%" : "90%",
                            borderRadius: 5,
                            backgroundColor: '#fff',
                        }}>
                            {this.renderActionMenu()}
                        </View>
                    </View>}

                {this.state.isShowModal &&
                    <View style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        backgroundColor: colors.appOverView,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 3
                    }}>
                        <KeyboardAwareScrollView style={{
                            width: Devices.isTablet ? "50%" : "90%",
                            borderRadius: 5,
                            //height: 200,
                            flex: 1,
                            marginTop: 50,
                        }}>
                            <View style={{
                                borderColor: colors.grayBorder,
                                borderBottomWidth: 1,
                                backgroundColor: '#fff',
                            }}>
                                <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appTheme }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{ action.name.toLocaleUpperCase()}</Text>
                                </View>
                                <View style={{ padding: 10}}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingVertical: 10
                                }}>
                                    <Text style={{ color: colors.appTheme }}>DIỄN GIẢI</Text>
                                </View>
                                <TextInput
                                    maxLength={3000}
                                    underline={false}
                                    multiline
                                    underlineColorAndroid='transparent'
                                    style={{
                                        backgroundColor: '#fff',
                                        height: 120,
                                        textAlignVertical: 'top'
                                    }}
                                    placeholder='Nhập nội dung'
                                    placeholderTextColor="#9e9e9e"
                                    value={this.state.description}
                                    onChangeText={(description) => this.setState({ description })}
                                />
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            height: 30,
                                            borderRadius: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderColor: colors.appTheme,
                                            borderWidth: 1,
                                            borderRadius: 5
                                        }}
                                        onPress={() => { this.setState({ isShowModal: false, itemSelected: null }) }}
                                    >
                                        <Text style={{ color: colors.appTheme }}>{'BỎ QUA'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={this.checkValidate() ? this.onSubmitUpdateStatus : null}
                                        style={{
                                            flex: 1,
                                            height: 30,
                                            borderRadius: 5,
                                            marginLeft: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: !this.checkValidate() ? colors.gray1 : colors.appTheme,
                                        }}
                                    >
                                        <Text style={{ color: '#fff' }}>{'LƯU'}</Text>
                                    </TouchableOpacity>
                                </View>
                                </View>    
                            </View>                            
                        </KeyboardAwareScrollView>
                    </View>}

                <TouchableOpacity
                    onPress={() => this.setState({ showAction: true })}
                    style={{
                        backgroundColor: colors.appTheme,
                        width: 50,
                        height: 50,
                        borderRadius: 35,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                        zIndex: 10
                    }}>
                    <MyIcon name="more-vertical" size={20} color="#fff" />
                </TouchableOpacity>
                    
                <Toast ref="toast" style={{ backgroundColor: this.props.errorUpdate ? this.props.errorUpdate.hasError ? colors.toast.warning : colors.toast.success : colors.toast.warning }} />
            </View>
        );
    }

    checkValidate = () => {
        const { description } = this.state
        if (!description) {
            return false
        }
        return true
    }

    onSubmitUpdateStatus = () => {
        this.setState({ isShowModal: false }, () => {
            const { action, description } = this.state
            const { data } = this.props;

            const dataRequest =
            {
                id: this.props.data.id,
                dienGiai: description,
                statusId: action.id
            }
            //console.log(dataRequest)

            this.props.updateStatusHandle(dataRequest)
        })
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    imageActive: {
        flex: 1,
        resizeMode: "contain"
    },

});
const mapStateToProps = state => ({
    user: state.auth.user,
    initList: state.shiftChangeDetail.initList,
    data: state.shiftChangeDetail.data,
    isLoading: state.shiftChangeDetail.isLoading,
    error: state.shiftChangeDetail.error,
    errorUpdate: state.shiftChangeDetail.errorUpdate
})

const mapActionToProps = {
    loadDataHandle,
    resetStateByKey,
    refreshDataHandle,
    updateHandle,
    updateStatusHandle
}

//make this component available to the app
export default connect(mapStateToProps, mapActionToProps)(ChangeShiftDetailScreen);
