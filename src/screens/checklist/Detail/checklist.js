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
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Lightbox from 'react-native-lightbox';
import moment from 'moment';
import { TabNavigator, TabBarTop } from 'react-navigation';
import { loadDataHandle, resetStateByKey, refreshDataHandle, updateHandle, updateStatusHandle, insertProposalHandle } from '../../../actions/checklistDetail';
import ErrorContent from '../../../components/common/ErrorContent';
import ImageProgress from '../../../components/common/ImageProgress';
import fontsize from '../../../theme/fontsize';
import colors from '../../../theme/colors';
import { MyIcon } from '../../../theme/icons';
import { default_image } from '../../../theme/images';
import { converStatusToColor, converStatusToString, myFromNow } from '../../../utils/request';
import VendorInfo from '../../../components/Request/Detail/VendorInfo';
import ImageGallery from '../../../components/Request/Detail/ImageGallery';
import { Screen, Device } from '../../../utils/device';
import Strings from '../../../utils/languages';
import NavBar from '../../../components/common/NavBar';
import ActionSheet from '../../../components/common/ActionSheet';
import ModalPicker from '../../../components/common/ModalPicker';
import ListItem from '../../../components/Checklist/Detail/ListItem';

import CircleView from '../../../components/common/CircleView';
import CheckBox from '../../../components/common/CheckBox';
import PrimaryButton from '../../../components/common/PrimaryButton';

const Devices = require('react-native-device-detection');

import { TabChecklistDetail } from '../../../navigators/TabNavigator';

const initState = {
    description: '',
    valueInput: null,
    action:{
        id: 0,
        name: ''
    }
}
// create a component
class ChecklistDetailScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            //itemfromList: props.navigation.state.params,
            isShowModal: false,
            isShowModalItem: false,
            isShowModalProposal: false,
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
                this.refs.toast.show(`Thao tác thành công`, DURATION.LENGTH_LONG);
            }
        }

    }

    componentDidMount() {
        const { user } = this.props
    }

    componentWillUnmount() {
        this.props.resetStateByKey({ key: 'state' })
    }

    renderItem = ({ item, index }) => {
        const { statusId } = this.props.data;
        //console.log(statusId)
        //console.log(index)
        return <ListItem item={item} statusId={statusId} index={index}
            onPress={() => { this.setState({ ...initState, isShowModalItem: true, itemSelected: item }) }}
        />
    }

    renderItemMenu = ({ item }) =>{
        //console.log(item)
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

        //console.log(methodProcess)
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
                <ActivityIndicator animating size="small"  color={colors.appTheme}/>
            </View>
        );
    };

    renderContent() {
        const { error, towerId, data, isLoading } = this.props;
        const { showAction } = this.state


        if (isLoading) {
            return (<View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator animating size="small"  color={colors.appTheme}/>
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
                dateAction,
                employeeApproved,
                employeeName,
                imageUrl,
                status,
                title,
                items,
                methodProcess
            } = data;
            const { dataRequest, action } = this.state;

            return (

                <View style={{ flex: 1 }}>
                    {Devices.isTablet ?
                        <View style={{ flexDirection: "row", alignItems: 'center', borderBottomWidth: 1, borderColor: colors.grayBorder, backgroundColor: colors.grayBorder }}>
                            <View style={{ width: 50 }}><Text style={{ padding: 10 }}>STT</Text></View>

                            <View style={{ flex: 1, minWidth: 150, borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Nội dung kiểm tra</Text></View>

                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Tiêu chuẩn</Text></View>
                            <View style={{ flex: 1, maxWidth: 60, borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Hình ảnh</Text></View>
                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Bình thường</Text></View>
                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Bất thường</Text></View>
                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Nhập/ Chọn</Text></View>
                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Ghi chú</Text></View>
                        </View>
                        : null}
                        
                    <FlatList
                        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
                        data={items}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={this.renderItem}
                        ListFooterComponent={this.renderFooter}
                        onEndReachedThreshold={0.5}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
                    />

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
                        right: 20
                    }}>
                    <MyIcon name="more-vertical" size={20} color="#fff" />
                </TouchableOpacity>

                    <Spinner visible={this.props.isLoadingReponse} textContent={Strings.app.progressing} textStyle={{ color: '#FFF', fontSize: fontsize.small }} />
                </View >
            )
        }

    }

    render() {
        const { data } = this.props
        const { showAction, action, itemSelected, valueInput, property } = this.state;
        const leftButton = (
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => this.props.navigation.goBack()}
            >
                <MyIcon
                    name="arrow"
                    size={20}
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
                    size={20}
                    color="#fff"
                />
            </TouchableOpacity>
        )
        return (
            <View style={styles.container}>
                {/* {this.renderContent()} */}
                
                {this.state.isShowModalItem &&
                    <View style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        backgroundColor: colors.appOverView,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {/* <KeyboardAwareScrollView behavior={Platform.OS == 'ios' ? "padding" : ""}
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0, 0, 0,0.3)'
                            }}> */}
                        <View style={{
                            width: Devices.isTablet ? "50%" : "90%",
                            borderRadius: 5,
                            backgroundColor: '#fff',
                        }}>
                            <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appTheme }}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{itemSelected.title.toLocaleUpperCase()}</Text>
                            </View>
                            <View style={{ padding: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: "center", paddingVertical: 10 }}>
                                    <Text style={{ marginRight: 10, color: colors.appTheme }}>TIÊU CHUẨN:</Text>
                                    <Text>{itemSelected ? itemSelected.standard.toLocaleUpperCase() : ''}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ itemSelected: { ...itemSelected, isNormal: true } }) }}
                                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ marginRight: 5, color: colors.appTheme }}>BÌNH THƯỜNG:</Text>
                                        <CheckBox onValueChange={() => { this.setState({ itemSelected: { ...itemSelected, isNormal: true } }) }} value={itemSelected.isNormal} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ itemSelected: { ...itemSelected, isNormal: false } }) }}
                                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ marginRight: 5, color: 'red' }}>BẤT THƯỜNG:</Text>
                                        <CheckBox onValueChange={() => { this.setState({ itemSelected: { ...itemSelected, isNormal: false } }) }} value={!itemSelected.isNormal} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingVertical: 5 }}>
                                    {itemSelected && itemSelected.isSelect ? <TouchableOpacity
                                        //  onPress={() => { this.props.navigation.navigate('depSource', { sourceId: itemSelected.sourceId, onSelected: (valueInput) => { this.setState({ valueInput }) } }) }}
                                        onPress={() => { this.props.navigation.navigate('sourceList', { sourceId: 32, onSelected: (valueInput) => { this.setState({ valueInput }) } }) }}

                                        style={{ flexDirection: 'row', alignItems: "center", paddingVertical: 10 }}>
                                        <Text style={{ marginRight: 10, color: colors.appTheme }}>{itemSelected.isSelect ? "CHỌN" : "NHẬP"} :</Text>
                                        <Text>{valueInput ? valueInput.name : 'CHƯA CHỌN'}</Text>
                                    </TouchableOpacity> : <View
                                        style={{ flexDirection: 'row', alignItems: "center" }}>
                                            <Text style={{ marginRight: 10, color: colors.appTheme }}>CHỌN:</Text>
                                            <TextInput
                                                style={{
                                                    flex: 1,
                                                    borderRadius: 5,
                                                    borderWidth: 1,
                                                    borderColor: colors.grayBorder,
                                                    textAlignVertical: 'top',
                                                    padding: 5
                                                }} placeholder="Nhập..."
                                                onChangeText={(valueInput) => { this.setState({ valueInput }) }}
                                                underlineColorAndroid="transparent"
                                            />
                                        </View>}
                                </View>
                                <TextInput
                                    autoFocus
                                    autoCorrect={false}
                                    style={{
                                        backgroundColor: '#fff',
                                        height: 60,
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        borderColor: colors.grayBorder,
                                        textAlignVertical: 'top',
                                        padding: 5
                                    }}
                                    underlineColorAndroid="transparent"
                                    multiline={true}
                                    placeholder={Strings.app.description}
                                    value={this.state.description}
                                    onChangeText={(description) => this.setState({ description })}
                                />
                                {this.state.images.length > 0 ?
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginTop: 10, }}>
                                        {this.state.images.length < 5 && <View
                                            style={{
                                                justifyContent: 'center',
                                                backgroundColor: colors.grayBorder,
                                                borderRadius: 5,
                                                padding: 5,
                                                marginTop: 10,
                                                marginRight: 10,
                                                height: 80
                                            }}>
                                            <MyIcon
                                                onPress={() => this._onAttachment()}
                                                name="camera"
                                                size={60}
                                                color="gray"
                                            />
                                        </View>}

                                        {this.state.images.map((eachImage, y) => {
                                            return (
                                                <View key={y}>
                                                    <Lightbox
                                                        style={{ marginTop: 10, marginRight: 10, borderRadius: 5, backgroundColor: '#eeeeee' }}
                                                        activeProps={{
                                                            style: styles.imageActive
                                                        }}
                
                                                    >
                                                        <ImageProgress source={{ uri: eachImage.uri }} style={{ width: 90, height: 80, zIndex: 0 }} />
                                                    </Lightbox>

                                                    <TouchableOpacity
                                                        onPress={() => { this.deleteImage(eachImage); }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            right: 0,
                                                            borderRadius: 15,
                                                            marginTop: 0,
                                                            backgroundColor: '#505c5c5c',
                                                            zIndex: 1,
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <Text style={{ padding: 5, color: '#fff' }}> X </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        })}
                                    </ScrollView> :
                                    <TouchableOpacity
                                        onPress={() => this._onAttachment()}
                                        style={{
                                            backgroundColor: colors.grayBorder,
                                            borderRadius: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 10,
                                            paddingVertical: 20

                                        }}>
                                        <MyIcon
                                            name="camera"
                                            size={80}
                                            color="gray"
                                        />
                                    </TouchableOpacity>
                                }
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
                                        onPress={() => { this.setState({ isShowModalItem: false, itemSelected: null }) }}
                                    >
                                        <Text style={{ color: colors.appTheme }}>{'BỎ QUA'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={this.checkValidate() ? this.onSubmit : null}
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
                        {/* </KeyboardAwareScrollView> */}
                    </View>}

                {this.state.showAction &&
                    <View style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        backgroundColor: colors.appOverView,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        paddingBottom: 20
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
                        alignItems: 'center'
                    }}>
                        <View style={{
                            width: Devices.isTablet ? "50%" : "90%",
                            borderRadius: 5,
                            backgroundColor: '#fff',
                        }}>
                            <View style={{
                                borderColor: colors.grayBorder,
                                borderBottomWidth: 1
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
                                        onPress={this.checkValidateProposal() ? this.onSubmitUpdateStatus : null}
                                        style={{
                                            flex: 1,
                                            height: 30,
                                            borderRadius: 5,
                                            marginLeft: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: !this.checkValidateProposal() ? colors.gray1 : colors.appTheme,
                                        }}
                                    >
                                        <Text style={{ color: '#fff' }}>{'LƯU'}</Text>
                                    </TouchableOpacity>
                                </View>
                                </View>    
                            </View>                            
                        </View>
                    </View>}

                {this.state.isShowModalProposal &&
                    <View style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        backgroundColor: colors.appOverView,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            width: Devices.isTablet ? "50%" : "90%",
                            borderRadius: 5,
                            backgroundColor: '#fff',
                        }}>
                            <View style={{
                                borderColor: colors.grayBorder,
                                borderBottomWidth: 1
                            }}>
                                <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appTheme }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>ĐỀ XUẤT SỬA CHỮA</Text>
                                </View>
                                <View style={{ padding: 10}}>
                                    <TouchableOpacity
                                            onPress={() => { this.props.navigation.navigate('propertyList', { id: data.id, onSelected: (value) => { this.setState({ property: value }) } }) }}

                                            style={{ flexDirection: 'row', alignItems: "center", paddingVertical: 10 }}>
                                            <Text style={{ marginRight: 10, color: colors.appTheme }}>THIẾT BỊ</Text>
                                            <Text>{property.id !== 0 ? property.name : 'CHƯA CHỌN'}</Text>
                                    </TouchableOpacity>

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
                                            onPress={() => { this.setState({ isShowModalProposal: false }) }}
                                        >
                                            <Text style={{ color: colors.appTheme }}>{'BỎ QUA'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={this.checkValidateProposal() ? this.onSubmitProposal : null}
                                            style={{
                                                flex: 1,
                                                height: 30,
                                                borderRadius: 5,
                                                marginLeft: 10,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: !this.checkValidateProposal() ? colors.gray1 : colors.appTheme,
                                            }}
                                        >
                                            <Text style={{ color: '#fff' }}>{'LƯU'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>    
                            </View>                            
                        </View>
                    </View>}
                    
                <Toast ref="toast" style={{ backgroundColor: this.props.errorUpdate ? this.props.errorUpdate.hasError ? colors.toast.warning : colors.toast.success : colors.toast.warning }} />
            </View>
        );
    }
    checkValidate = () => {
        const { itemSelected, valueInput } = this.state
        const { statusId } = this.props.data;
        if(statusId !== 0 & statusId !== 1)
        {
            if (!valueInput) {
                return false
            }
        }
        return true
    }

    checkValidateProposal = () => {
        const { description } = this.state
        if (!description) {
            return false
        }
        return true
    }

    onSubmit = () => {

        this.setState({ isShowModalItem: false }, () => {
            const { itemSelected, description, imageInformation, valueInput } = this.state
            const dataRequest =
            {
                id: itemSelected.id,
                numberNo: itemSelected.numberNo,
                title: itemSelected.title,
                standard: itemSelected.standard,
                isNormal: itemSelected.isNormal,//Binh Thuong, bat thuong
                value: itemSelected.isSelect ? valueInput.id : valueInput,//gia tri nhap
                // value:"string",
                description,//den giai
                isGroup: itemSelected.isGroup,
                isSelect: itemSelected.isSelect,
                imageInformation: this.state.images.map(o => ({ mineType: o.type, bytes: o.data })),
                sourceId: itemSelected.sourceId
            }
            this.props.updateHandle(dataRequest)
        })
    }

    onSubmitUpdateStatus = () => {
        this.setState({ isShowModal: false }, () => {
            const { action, description } = this.state

            const dataRequest =
            {
                id: this.props.data.id,
                description,
                statusId: action.id
            }

            this.props.updateStatusHandle(dataRequest, this.state.itemfromList)
        })
    }

    onSubmitProposal = () => {
        this.setState({ isShowModalProposal: false }, () => {
            const { property, description } = this.state

            const dataRequest =
            {
                checklistId: this.props.data.id,
                towerId: this.props.user.towerId,
                description,
                propertyName: property.name,
                propertyId: property.id,
            }
            this.props.insertProposalHandle(dataRequest)
        })
    }

    deleteImage(item) {
        const array = this.state.images;
        const index = array.indexOf(item);
        array.splice(index, 1);
        this.setState({ images: array });
    }
    _onAttachment = () => {

        // if (this.props.images && _.size(this.props.images) < 5) {
        const options = {
            quality: 1.0,
            maxWidth: 512,
            maxHeight: 512,
            storageOptions: {
                skipBackup: true
            },
            title: 'Chọn hình ảnh',
            takePhotoButtonTitle: 'Chụp ảnh...',
            chooseFromLibraryButtonTitle: 'Chọn ảnh từ thư viện...',
            cancelButtonTitle: 'Bỏ qua',
            permissionDenied: { title: 'Cấp quyền truy cập', text: 'Cho phép ứng dụng chụp ảnh và chọn từ thư viên ảnh...', reTryTitle: 'Thử lại', okTitle: 'Cho phép' }
        };

        ImagePicker.launchCamera(options, (response) => {
            // console.log('Response showImagePicker = ', response);

            if (response.didCancel) {
                // console.log('User cancelled photo picker');
            } else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
            } else {

                const image = {
                    data: response.data,
                    uri: response.uri,
                    type: Platform.OS === 'ios' ? mineTypes.lookup(response.uri) : response.type,
                    fileName: response.fileName
                };

                // const source = { uri: response.uri, data: response.data };
                // You can also display the image using data:
                // const source = { uri: `data:image/jpeg;base64,${response.data}` };
                this.setState({ images: [...this.state.images, image] })
                //this.props.addImageToList(image);
            }
        });
        // } else {
        //     Toast.show({
        //         text: 'Bạn chỉ chọn được tối đa 5 hình',
        //         position: 'bottom',
        //         type: 'warning',
        //         duration: 2000
        //     });
        // }

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
    initList: state.checklistDetail.initList,
    data: state.checklistDetail.data,
    isLoading: state.checklistDetail.isLoading,
    error: state.checklistDetail.error,
    errorUpdate: state.checklistDetail.errorUpdate
})

const mapActionToProps = {
    loadDataHandle,
    resetStateByKey,
    refreshDataHandle,
    updateHandle,
    updateStatusHandle,
    insertProposalHandle
}

//make this component available to the app
export default connect(mapStateToProps, mapActionToProps)(ChecklistDetailScreen);
