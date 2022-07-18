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

import Spinner from 'react-native-loading-spinner-overlay';
import Toast, { DURATION } from 'react-native-easy-toast';
import { updatePropertyHandle } from '../../../actions/checklistDetail';
import ErrorContent from '../../../components/common/ErrorContent';
import fontsize from '../../../theme/fontsize';
import colors from '../../../theme/colors';
import { MyIcon } from '../../../theme/icons';
import Strings from '../../../utils/languages';
import NavBar from '../../../components/common/NavBar';
import ListPropertyItem from '../../../components/Checklist/Detail/ListPropertyItem';

const Devices = require('react-native-device-detection');

const initState = {
    description: '',
    valueInput: null,
    action:{
        id: 0,
        name: ''
    }
}
// create a component
class PropertyScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            //itemfromList: props.navigation.state.params,
            isShowModal: false,
            isShowModalItem: false,
            isShowModalProposal: false,
            showAction: false,
            description: '',
            note: '',
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

    renderItem = ({ item, index }) => {
        const { statusId } = this.props.data;
        //console.log(index)
        return <ListPropertyItem item={item} statusId={statusId} index={index}
            onPress={() => { this.setState({ ...initState, isShowModalItem: true, itemSelected: item, description: item.description, note: '' }) }}
        />
    }

    renderItemMenu = ({ item }) =>{
        //console.log(item)
        return(
            <TouchableOpacity
                onPress={() => {
                    switch(item.moduleId){
                        case '-1'://Bỏ qua
                            this.setState({ showAction: false })
                        break;

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
                methodProcess,
                properties
            } = data;
            const { dataRequest, action } = this.state;

            return (

                <View style={{ flex: 1 }}> 
                    <FlatList
                        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
                        data={properties}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={this.renderItem}
                        ListFooterComponent={this.renderFooter}
                        onEndReachedThreshold={0.5}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
                    />

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

                {this.renderContent()}

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
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{itemSelected.name.toLocaleUpperCase()}</Text>
                            </View>
                            <View style={{ padding: 10 }}>                                
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
                                    placeholder="Mô tả"
                                    value={this.state.description}
                                    onChangeText={(description) => this.setState({ description })}
                                />
                                
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
                                        padding: 5, 
                                        marginTop: 5, 
                                    }}
                                    underlineColorAndroid="transparent"
                                    multiline={true}
                                    placeholder="Ghi chú"
                                    value={this.state.note}
                                    onChangeText={(note) => this.setState({ note })}
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
        const { note } = this.state
        if (!note) {
            return false
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
            const { itemSelected, description, note } = this.state
            const dataRequest =
            {
                id: itemSelected.id,
                description,//den giai
                note
            }
            this.props.updatePropertyHandle(dataRequest)
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
    updatePropertyHandle
}

//make this component available to the app
export default connect(mapStateToProps, mapActionToProps)(PropertyScreen);
