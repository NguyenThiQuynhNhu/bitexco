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
    ActivityIndicator
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

const Devices = require('react-native-device-detection');
class ChecklistOfflineDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            itemSelected: null,
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
            dataSelect: [],
            valueInput: '',
            action:{
                id: 0,
                name: ''
            },
            property:{
                id: 0,
                name: '',
                typeId: 1,
                isDone: false
            },

            category: {
                id: 0,
                name: ''
            },

            property3:{
                id: 0, 
                name: ''
            }
        };
    }
    componentDidMount = async () => {
        this.setState({data: this.props.navigation.state.params.info})
    }
    renderContent() {
        const { error, data, isLoading } = this.state;

        // if (isLoading) {
        //     return (<View style={{ flex: 1, justifyContent: 'center' }}>
        //         <ActivityIndicator animating size="small"  color={colors.appTheme}/>
        //     </View>)
        // }

        if (!data) {
            return (
                <ErrorContent title='Không có dữ liệu' onTouchScreen={() => this.props.refreshDataHandle()} />
            )
        }
        if (data) {
            const {
                items,
                checklistTypeId
            } = data;

            return (

                <View style={{ flex: 1 }}>
                    {Devices.isTablet ?
                        checklistTypeId === 3 ?
                        <View style={{ flexDirection: "row", alignItems: 'center', borderBottomWidth: 1, borderColor: colors.grayBorder, backgroundColor: colors.grayBorder }}>
                            <View style={{ width: 50 }}><Text style={{ padding: 10 }}>STT</Text></View>

                            <View style={{ flex: 1, minWidth: 150, borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Nội dung kiểm tra</Text></View>

                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Đơn vị</Text></View>
                            <View style={{ flex: 1, maxWidth: 60, borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Hình ảnh</Text></View>
                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Chỉ số cũ</Text></View>
                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Chỉ số mới</Text></View>
                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Tiêu thụ</Text></View>
                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10 }}>Ghi chú</Text></View>
                        </View>
                        : 
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
    renderItem = ({ item, index }) => {
        const { statusId, checklistTypeId, isOwner } = this.state.data;
        const { itemSelected } = this.state;

        if(checklistTypeId === 3)
        {
            return <ListItemIndex item={item} checklistTypeId={checklistTypeId} statusId={statusId} index={index} isOwner={isOwner} onPressImage={() => { this.setState({ isShowModalImages: true, itemSelected: item }) }}
                onPress={() => { this.setState({ ...initState, itemSelected: item, valueInput: item.employeeId > 0 ? item.indexNew : '', description: item.employeeId > 0 ? item.description : '', imagesEdit: item.employeeId > 0 ? item.images.map(x=>x) : [], imagesEditView: item.employeeId > 0 ? item.images : [] }, () => { this.showEditIndex() }) }}
            />
        }
        else{
            return <ListItem item={item} statusId={statusId} index={index} isOwner={isOwner} onPressImage={() => { this.setState({ isShowModalImages: true, itemSelected: item }) }}
                onPress={() => { this.setState({ ...initState, itemSelected: item, valueInput: item.employeeId > 0 ? (item.isSelect ? { id: item.value, name: item.value } : item.value) : (item.isSelect ? { id: item.standard, name: item.standard } : 'Bình thường'), description: item.employeeId > 0 ? item.description : '', imagesEdit: item.employeeId > 0 ? item.images.map(x=>x) : [], imagesEditView: item.employeeId > 0 ? item.images : [] }, () => { this.showEdit() }) }}
            />
        }
    }
    showEditIndex(){
        this.setState({ isShowModalItemIndex: true })
    }
    renderActionMenu = () => {
        const { data } = this.state;
        //console.log('methodProcess', data)
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
    renderItemMenu = ({ item }) =>{
        return(
            <TouchableOpacity
                onPress={() => {
                    switch(item.moduleId){
                        case -1://Bỏ qua
                            this.setState({ showAction: false })
                        break;

                        case 1:
                            this.setState({...initState, showAction: false }, () => {
                                this.setState({
                                    moduleId: item.moduleId,
                                    action: {
                                        id: item.moduleId,
                                        name: item.moduleName
                                    },
                                    description: item.moduleId === 1 ? 'Tiếp nhận' : 'Hoàn thành'
                                }, () => {
                                    //this.onSubmitUpdateStatus();
                                });
                            })
                        break;
                        case 2:
                            this.setState({...initState, showAction: false }, () => {
                                this.setState({
                                    moduleId: item.moduleId,
                                    action: {
                                        id: item.moduleId,
                                        name: item.moduleName
                                    },
                                    description: item.moduleId === 1 ? 'Tiếp nhận' : 'Hoàn thành'
                                }, () => {
                                    //this.checkValidateDone() ? this.onSubmitUpdateStatus() : this.refs.toast.show(`Bạn chưa thực hiện xong tất cả công việc. Vui lòng kiểm tra lại, xin ảm ơn.`, DURATION.LENGTH_LONG);;
                                });
                            })
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
    render() {
        const { data, action, itemSelected, valueInput, property } = this.state;
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
                    body={<Text style={{ color: '#fff', fontSize: fontsize.medium, fontWeight: 'bold', alignSelf: 'center' }}>{data.title}</Text>}
                    rightView={data ? rightButton : null} />

            {this.renderContent()}

            {
                this.state.showAction &&
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
                    </View>
            }
            {
                this.state.isShowModal &&
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
                                            //onPress={this.checkValidateProposal() ? this.onSubmitUpdateStatus : null}
                                            style={{
                                                flex: 1,
                                                height: 30,
                                                borderRadius: 5,
                                                marginLeft: 10,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                //backgroundColor: !this.checkValidateProposal() ? colors.gray1 : colors.appTheme,
                                            }}
                                        >
                                            <Text style={{ color: '#fff' }}>{'LƯU'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    </View>    
                                </View>                            
                            </View>
                        </View>
                    }
                    {this.state.isShowModalItemIndex &&
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
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ itemSelected: { ...itemSelected, isNormal: true } }) }}
                                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ marginRight: 5, color: colors.appTheme }}>BÌNH THƯỜNG:</Text>

                                        <CheckBox onValueChange={() => { this.setState({ itemSelected: { ...itemSelected, isNormal: true }, valueInput: itemSelected.isSelect ? null : valueInput }) }} value={itemSelected.isNormal} />
                                        
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ itemSelected: { ...itemSelected, isNormal: false } }) }}
                                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ marginRight: 5, color: 'red' }}>BẤT THƯỜNG:</Text>
                                        <CheckBox onValueChange={() => { this.setState({ itemSelected: { ...itemSelected, isNormal: false}, valueInput: itemSelected.isSelect ? null : valueInput }) }} value={!itemSelected.isNormal} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: "center", paddingVertical: 10 }}>
                                    <Text style={{ marginRight: 10, color: colors.appTheme }}>ĐƠN VỊ TÍNH:</Text>
                                    <Text>{itemSelected ? itemSelected.unit.toLocaleUpperCase() : ''}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: "center", paddingVertical: 10 }}>
                                    <Text style={{ marginRight: 10, color: colors.appTheme }}>CHỈ SỐ CŨ:</Text>
                                    <Text>{itemSelected ? itemSelected.indexOld : 0}</Text>
                                </View>
                                
                                <View style={{ paddingVertical: 5 }}>
                                    <View
                                        style={{ flexDirection: 'row', alignItems: "center" }}>
                                            <Text style={{ marginRight: 10, color: colors.appTheme }}>CHỈ SỐ MỚI:</Text>
                                            <TextInput
                                                autoFocus
                                                autoCorrect={false}
                                                style={{
                                                    flex: 1,
                                                    borderRadius: 5,
                                                    borderWidth: 1,
                                                    borderColor: '#f78383',
                                                    textAlignVertical: 'top',
                                                    padding: 5
                                                }} placeholder="Nhập..."
                                                keyboardType='numeric'
                                                defaultValue={ this.state.valueInput.toString() }
                                                value={this.state.valueInput}
                                                onChangeText={(valueInput) => { this.setState({ valueInput }) }}
                                                underlineColorAndroid="transparent"
                                            />
                                        </View>
                                </View>

                                <TextInput
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
                                { (this.state.images.length > 0 || this.state.imagesEdit.length > 0)  ?
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginTop: 10, }}>
                                        {this.state.images.length < 5 && <View
                                            style={{
                                                justifyContent: 'center',
                                                backgroundColor: colors.grayBorder,
                                                borderRadius: 5,
                                                padding: 5,
                                                marginTop: 10,
                                                marginRight: 10,
                                                height: 80,
                                                width: 80,
                                                alignItems: 'center'
                                            }}>
                                            <MyIcon
                                                onPress={() => this._onAttachment()}
                                                name="camera"
                                                size={60}
                                                color="gray"
                                            />
                                        </View>}
                                        
                                        {this.state.imagesEdit.map((imageUrl, y) => {
                                            return (
                                                <View key={y}>
                                                    <Lightbox
                                                        style={{ marginTop: 10, marginRight: 10, borderRadius: 5, backgroundColor: '#eeeeee' }}
                                                        activeProps={{
                                                            style: styles.imageActive
                                                        }}
                
                                                    >
                                                        <Image source={{ uri: imageUrl }} style={{ width: 90, height: 80, zIndex: 0 }} />
                                                    </Lightbox>

                                                    <TouchableOpacity
                                                        onPress={() => { this.deleteImageEdit(imageUrl); }}
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
                                            size={60}
                                            color={ itemSelected.isRequireImage ? '#f78383' : colors.grayBorder }
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
                                        onPress={() => { this.setState({ isShowModalItemIndex: false, itemSelected: null }) }}
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
          </View>
          
      )
    };
}
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
export default connect(mapStateToProps, mapActionToProps)(ChecklistOfflineDetailScreen);