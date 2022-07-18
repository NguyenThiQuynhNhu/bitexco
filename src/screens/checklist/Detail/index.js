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
    TextInput,
    Platform,
    ActivityIndicator,
    Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import * as mineTypes from 'react-native-mime-types';

import Spinner from 'react-native-loading-spinner-overlay';
import Toast, { DURATION } from 'react-native-easy-toast';
import Lightbox from 'react-native-lightbox';
import { loadDataHandle, resetStateByKey, refreshDataHandle, updateHandle, updateStatusHandle, insertProposalHandle } from '../../../actions/checklistDetail';
import ErrorContent from '../../../components/common/ErrorContent';
import ImageProgress from '../../../components/common/ImageProgress';
import fontsize from '../../../theme/fontsize';
import colors from '../../../theme/colors';
import { MyIcon } from '../../../theme/icons';
import Strings from '../../../utils/languages';
import NavBar from '../../../components/common/NavBar';
import ListItem from '../../../components/Checklist/Detail/ListItem';
import ListItemIndex from '../../../components/Checklist/Detail/ListItemIndex';

import CheckBox from '../../../components/common/CheckBox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TadChecklistDetail from '../../../navigators/TabChecklistDetal';
const Devices = require('react-native-device-detection');

const initState = {
    description: '',
    valueInput: '',
    action: {
        id: 0,
        name: ''
    },
    images: [],
    imagesEdit: [],
    imagesEditView: [],
}
// create a component

class ChecklistDetailScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            itemfromList: props.navigation.state.params,
            isShowModal: false,
            isShowModalItem: false,
            isShowModalItemIndex: false,
            isShowModalProposal: false,
            isShowModalImages: false,
            showAction: false,
            description: '',
            moduleId: 0,
            dateComponent: null,
            images: [],
            imagesEditView: [],
            imagesEdit: [],
            itemSelected: null,
            dataSelect: [],
            valueInput: '',
            action: {
                id: 0,
                name: ''
            },
            property: {
                id: 0,
                name: '',
                typeId: 1,
                isDone: false
            },

            category: {
                id: 0,
                name: ''
            },

            property3: {
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
                if (nextProps.data.methodProcess !== this.props.data.methodProcess) {
                    const { id } = this.state.itemfromList
                    this.props.loadDataHandle({ id })
                }

                this.refs.toast.show(`Thao tác thành công`, DURATION.LENGTH_LONG);
            }
        }

    }

    componentDidMount() {
        //console.log('detail')
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
        const { statusId, checklistTypeId, isOwner } = this.props.data;
        const { itemSelected } = this.state;

        // if(itemSelected){
        // }

        if (checklistTypeId === 3) {
            return <ListItemIndex item={item} checklistTypeId={checklistTypeId} statusId={statusId} index={index} isOwner={isOwner} onPressImage={() => { this.setState({ isShowModalImages: true, itemSelected: item }) }}
                onPress={() => { this.setState({ ...initState, itemSelected: item, valueInput: item.employeeId > 0 ? item.indexNew : '', description: item.employeeId > 0 ? item.description : '', imagesEdit: item.employeeId > 0 ? item.images.map(x => x) : [], imagesEditView: item.employeeId > 0 ? item.images : [] }, () => { this.showEditIndex() }) }}
            />
        }
        else {
            return <ListItem item={item} statusId={statusId} index={index} isOwner={isOwner} onPressImage={() => { this.setState({ isShowModalImages: true, itemSelected: item }) }}
                onPress={() => { this.setState({ ...initState, itemSelected: item, valueInput: item.employeeId > 0 ? (item.isSelect ? { id: item.value, name: item.value } : item.value) : (item.isSelect ? { id: item.standard, name: item.standard } : 'Bình thường'), description: item.employeeId > 0 ? item.description : '', imagesEdit: item.employeeId > 0 ? item.images.map(x => x) : [], imagesEditView: item.employeeId > 0 ? item.images : [] }, () => { this.showEdit() }) }}
            />
        }
    }

    showEdit() {
        //console.log('showEdit')
        this.setState({ isShowModalItem: true })
    }

    showEditIndex() {
        //console.log('showEditIndex')
        this.setState({ isShowModalItemIndex: true })
    }

    renderItemMenu = ({ item }) => {
        //console.log(item)
        return (
            <TouchableOpacity
                onPress={() => {
                    switch (item.moduleId) {
                        case '-1'://Bỏ qua
                            this.setState({ showAction: false })
                            break;

                        case '1':
                            this.setState({ ...initState, showAction: false }, () => {
                                this.setState({
                                    moduleId: item.moduleId,
                                    action: {
                                        id: item.moduleId,
                                        name: item.moduleName
                                    },
                                    description: item.moduleId === 1 ? 'Tiếp nhận' : 'Hoàn thành'
                                }, () => {
                                    this.onSubmitUpdateStatus();
                                });
                            })
                            break;
                        case '2':
                            this.setState({ ...initState, showAction: false }, () => {
                                this.setState({
                                    moduleId: item.moduleId,
                                    action: {
                                        id: item.moduleId,
                                        name: item.moduleName
                                    },
                                    description: item.moduleId === 1 ? 'Tiếp nhận' : 'Hoàn thành'
                                }, () => {
                                    this.checkValidateDone() ? this.onSubmitUpdateStatus() : this.refs.toast.show(`Bạn chưa thực hiện xong tất cả công việc. Vui lòng kiểm tra lại, xin ảm ơn.`, DURATION.LENGTH_LONG);;
                                });
                            })
                            break;
                        // case '4':
                        //     this.setState({...initState, showAction: false }, () => {
                        //         this.setState({
                        //             isShowModal: true,
                        //             moduleId: item.moduleId,
                        //             action: {
                        //                 id: item.moduleId,
                        //                 name: item.moduleName
                        //             }
                        //         });
                        //     })
                        // break;
                        case '100'://Tạo đề xuất
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
                            this.setState({ ...initState, showAction: false }, () => {
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

        //console.log('methodProcess', methodProcess)
        return (
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
                <ActivityIndicator animating size="small" color={colors.appTheme} />
            </View>
        );
    };

    renderContent() {
        const { error, data, isLoading } = this.props;

        if (isLoading) {
            return (<View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator animating size="small" color={colors.appTheme} />
            </View>)
        }

        if (error && error.hasError) {
            return (
                <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.refreshDataHandle()} />
            )
        }
        if (data) {
            const {
                items,
                checklistTypeId
            } = data;
            //console.log('data', data)
            return (
                <View style={{ flex: 1, marginHorizontal: 0 }}>
                    <TadChecklistDetail />
                </View>
            )
        }

    }

    render() {
        const { data } = this.props
        const { action, itemSelected, valueInput, property } = this.state;
        const leftButton = (
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => this.props.navigation.goBack(null)}
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

                <NavBar
                    leftButton={leftButton}
                    body={<Text style={{ color: '#fff', fontSize: fontsize.medium, fontWeight: 'bold', alignSelf: 'center', fontFamily: "Inter-Bold" }}>{data.title}</Text>}
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
                    <TouchableOpacity
                        onPress={() => { this.setState({ isShowModal: false, itemSelected: null }) }}
                        style={{
                            height: '100%',
                            width: '100%',
                            position: 'absolute',
                            backgroundColor: colors.appOverView,
                            justifyContent: 'center',
                            alignItems: 'center',


                        }}>
                        <KeyboardAwareScrollView
                            style={{
                                paddingVertical: 60,
                                height: '100%',
                                width: '100%',
                                backgroundColor: colors.appOverView
                            }}
                            contentContainerStyle={{ alignItems: 'center' }}>
                            <View style={{
                                width: Devices.isTablet ? "50%" : "90%",
                                borderRadius: 5,
                                backgroundColor: '#fff',
                                borderRadius: 12
                            }}>
                                <View style={{
                                    borderColor: colors.grayBorder,
                                    borderBottomWidth: 1
                                }}>
                                    <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appTheme, borderTopRightRadius: 12, borderTopLeftRadius: 12 }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{action.name}</Text>
                                    </View>
                                    <View style={{ padding: 10 }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingVertical: 10
                                        }}>
                                            <Text style={{ color: colors.appTheme, fontFamily: "Inter-Bold" }}>Diễn giải</Text>
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
                                                <Text style={{ color: colors.appTheme }}>{'Bỏ qua'}</Text>
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
                                                <Text style={{ color: '#fff' }}>{'Lưu'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </TouchableOpacity>}

                {this.state.isShowModalImages &&
                    <View style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        backgroundColor: colors.appOverView,
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}>
                        <View style={{
                            width: Devices.isTablet ? "70%" : "90%",
                            borderRadius: 5,
                            backgroundColor: '#fff',
                            borderRadius: 12
                        }}>
                            <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appTheme, borderTopRightRadius: 12, borderTopLeftRadius: 12 }}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: "Inter-Bold" }}>Ảnh đính kèm</Text>
                            </View>
                            <View style={{ padding: 10 }}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                                    {itemSelected.images.map((eachImage, y) => {
                                        return (
                                            <View key={y}>
                                                <Lightbox
                                                    style={{ marginTop: 10, marginRight: 10, borderRadius: 5 }}
                                                    activeProps={{
                                                        style: styles.imageActive
                                                    }}
                                                >
                                                    <Image source={{ uri: eachImage }} style={{ width: 300, height: 300 }} />
                                                </Lightbox>
                                            </View>
                                        );
                                    })}
                                </ScrollView>

                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            height: 40,
                                            borderRadius: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderColor: colors.appTheme,
                                            borderWidth: 1,
                                            borderRadius: 5
                                        }}
                                        onPress={() => { this.setState({ isShowModalImages: false }) }}
                                    >
                                        <Text style={{ color: colors.appTheme }}>{'Đóng'}</Text>
                                    </TouchableOpacity>
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
                        alignItems: 'center',

                    }}>
                        <KeyboardAwareScrollView
                            style={{
                                paddingVertical: 60,
                                height: '100%',
                                width: '100%',
                                backgroundColor: colors.appOverView
                            }}
                            contentContainerStyle={{ alignItems: 'center' }}>
                            <View style={{
                                width: Devices.isTablet ? "50%" : "90%",
                                borderRadius: 5,
                                backgroundColor: '#fff',
                                borderRadius: 12
                            }}>
                                <View style={{
                                    borderColor: colors.grayBorder,
                                    borderBottomWidth: 1
                                }}>
                                    <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appTheme, borderTopRightRadius: 12, borderTopLeftRadius: 12 }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: "Inter-Bold" }}>Đề xuất sửa chữa</Text>
                                    </View>
                                    <View style={{ padding: 10 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ category: { id: data.categoryId }, property3: { id: data.propertyId } }, () => {
                                                    this.choiceLevel()
                                                })
                                            }}

                                            style={{ flexDirection: 'row', alignItems: "center", paddingVertical: 10 }}>
                                            <Text style={{ marginRight: 10, color: colors.appTheme, fontFamily: "Inter-Bold" }}>Thiết bị</Text>
                                            <Text>{property.id !== 0 ? property.name : 'Chưa chọn'}</Text>
                                        </TouchableOpacity>

                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingVertical: 10
                                        }}>
                                            <Text style={{ color: colors.appTheme, fontFamily: "Inter-Bold" }}>Diễn giải</Text>
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
                                                <Text style={{ color: colors.appTheme }}>{'Bỏ qua'}</Text>
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
                                                <Text style={{ color: '#fff' }}>{'Lưu'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </View>}

                <Toast ref="toast" position="center" style={{ backgroundColor: this.props.errorUpdate ? this.props.errorUpdate.hasError ? colors.toast.warning : colors.toast.success : colors.toast.warning }} />

            </View>
        );
    }

    choiceLevel() {
        const { data } = this.props
        if (data.typeSystemId === 1)
            this.choiceLevel2()
        else if (data.typeSystemId === 2)
            this.choiceLevel3()
        else this.choiceLevel4()
    }

    choiceLevel2() {
        const { data } = this.props
        const { category, property3 } = this.state;

        this.props.navigation.navigate('propertyList', {
            id: data.id, systemId: data.systemId, categoryId: category.id, categoryName: category.name, propertyId: property3.id, propertyName: property3.name, typeSystemId: data.typeSystemId, onSelected: (value) => {
                this.setState({ property: value, category: { id: value.id, name: value.name } }, () => {
                    const { property } = this.state;
                    if (!property.isDone) {
                        this.choiceLevel3()
                    }
                })
            }
        })
    }

    choiceLevel3() {
        const { data } = this.props
        const { category, property3 } = this.state;

        this.props.navigation.navigate('propertyList', {
            id: data.id, systemId: data.systemId, categoryId: category.id, categoryName: category.name, propertyId: property3.id, typeSystemId: data.typeSystemId, categoryName: category.name, onSelected: (value) => {
                this.setState({ property: value, property3: { id: value.id, name: value.name } }, () => {
                    const { property } = this.state;
                    if (!property.isDone) {
                        this.choiceLevel4()
                    }
                })
            }
        })
    }

    choiceLevel4() {
        const { data } = this.props
        const { category, property3 } = this.state;

        this.props.navigation.navigate('propertyList', {
            id: data.id, systemId: data.systemId, categoryId: category.id, categoryName: category.name, propertyId: property3.id, propertyName: property3.name, typeSystemId: data.typeSystemId, onSelected: (value) => {
                this.setState({ property: value }, () => {

                })
            }
        })
    }

    checkValidate = () => {
        const { valueInput, itemSelected } = this.state
        //console.log(statusId)
        if (!valueInput) {
            return false
        }

        if (itemSelected.isRequireImage) {
            if (this.state.images.length === 0) {
                return false
            }
        }

        return true
    }

    checkValidateDone = () => {
        const { items } = this.props.data;
        const dataFilters = items.filter(o => o.employeeId > 0)

        //console.log(dataFilters)

        return items.length === dataFilters.length
    }

    checkValidateProposal = () => {
        const { description } = this.state
        if (!description) {
            return false
        }
        return true
    }

    onSubmit = () => {

        this.setState({ isShowModalItem: false, isShowModalItemIndex: false }, () => {
            const { itemSelected, description, valueInput, imagesEdit } = this.state

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

                imageEdit: imagesEdit.map(o => ({ mineType: '', bytes: null, isEdit: true, imageUrl: o })),

                sourceId: itemSelected.sourceId,
                employeeId: itemSelected.employeeId,
                isRequireImage: itemSelected.isRequireImage,
                checklistId: this.props.data.id,
                indexOld: itemSelected.indexOld,
                indexNew: this.props.data.checklistTypeId === 3 ? valueInput : 0,
                amount: itemSelected.amount,
                unit: itemSelected.unit,
                checklistTypeId: this.props.data.checklistTypeId
            }
            this.props.updateHandle(dataRequest)
        })
    }

    onSubmitUpdateStatus = () => {
        this.setState({ isShowModal: false }, () => {
            const { action, description } = this.state
            const { id, title, system } = this.props.data
            const dataRequest =
            {
                id,
                description,
                statusId: action.id,
                title,
                system
            }

            this.props.updateStatusHandle(dataRequest)
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

                systemId: this.props.data.systemId,
                categoryId: this.props.data.categoryId,
                typeSystemId: property.typeId,
                nameId: this.props.data.propertyId
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

    deleteImageEdit(item) {
        const array = this.state.imagesEdit;

        const index = array.indexOf(item);
        array.splice(index, 1);
        this.setState({ imagesEdit: array });
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
                    fileName: response.fileName,
                    isEdit: false
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
        backgroundColor: '#fff',
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