//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Platform,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
// import ListItem from './ListItem'
import Swipeable from 'react-native-swipeable';

import Toast, { DURATION } from 'react-native-easy-toast';
import moment from 'moment'
import ErrorContent from '../../../components/common/ErrorContent';

// import ButtonFilter from '../../../components/Service/Basic/ButtonFilter';
//style
import colors from '../../../theme/colors';
import fontsize from '../../../theme/fontsize';

//data
import { loadDataHandle, refreshDataHandle, resetStateByKey, progressHandle,goListTaiSan,HandOverStatus,HandOverChangeStatus,HandOverFinishDate,CheckListStatusName } from '../../../actions/checklist_dangthuchien'
import { onChangetuNgay,onChangedenNgay,loadDate,onChangeDateName } from '../../../actions/utils'

import Strings from '../../../utils/languages';
import {getDate, getDateTime, getDateApi} from '../../../utils/Common';
import {show} from '../../../utils/Toast';
import ImageProgress from '../../../components/common/ImageProgress';
import ActionSheet from '../../../components/common/ActionSheet';
import DateTimePicker from 'react-native-modal-datetime-picker';

import TuNgayPicker from 'react-native-modal-datetime-picker';
import DenNgayPicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavBar from '../../../components/common/NavBar';
import { MyIcon } from '../../../theme/icons';

// create a component
class index extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: Strings.profile.setting,
        headerBackTitle: null,
        headerTintColor: '#fff',
        headerStyle: {
            backgroundColor: colors.appTheme,
            elevation: 0,
            borderBottomColor: 'transparent',
            borderBottomWidth: 0
        },
    })

    constructor(props) {
        super(props);
        this.state = {
            showAction: false,
            actionData:[
                {id:1,name:'Bàn giao'},
                {id:2,name:'Chuyển trạng thái'},
            ],

            showActionStatus: false,
            actionDataStatus:[],

            searchKey: '',
            isApplySearchKey: false,
            status: 0,
            isShowSearch: false,
            showModal: false,
            modalView: null,
            item:{},
            
            isDateTimePickerVisible: false,
            nam:0,
            thang:0,
            ngay:0,
            gio:0,
            phut:0,
            giay:0,

            isTuNgayPickerVisible: false,
            isDenNgayPickerVisible: false,
            showActionDate: false,
            statusId:0,
            statusName:'Tất cả',
            showActionStatusName: false,
            actionDataStatusName:[
                // {Id:2,Name:'chờ bàn giao'},
                // {Id:3,Name:'Chuyển nhà thầu xử lý'},
                // {Id:9,Name:'Nhà thầu đã sửa chữa xong'},
            ],
        };
    }
    componentDidMount() {

        // load danh sách trạng thái để filter trước rồi mới load dữ liệu chính
        this.props.CheckListStatusName({isCustomer:false})
        .then((data)=>{
            data.push({id: 0, name: 'Tất cả'})
            this.setState({
                actionDataStatusName:data,
                // statusId:data[0].id,
                // statusName:data[0].name,
            },()=>{
                    this.props.resetStateByKey({ key: 'initList', path: '', value: true });
            })
        })
        
    }
    componentWillReceiveProps(nextProps) {

        // console.log('this ',this)

        if (nextProps.errorResponse && nextProps.errorResponse !== this.props.errorResponse) {
            if (!nextProps.errorResponse.hasError) {
                this.props.refreshDataHandle()
            }
        }
        if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing) {
            const data = {
                keyword: this.state.isApplySearchKey ? this.state.searchKey : '',
                currentPage: nextProps.currentPage + 1,
                rowPerPage: this.props.rowPerPage,
                username:this.props.user.fullName,
                employeeId: this.props.user.id,
                StatusId:this.state.statusId,
                tuNgay:getDateApi(this.props.utils.tuNgay),
                denNgay:getDateApi(this.props.utils.denNgay),
                // tuNgay:this.props.utils.tuNgay,
                // denNgay:this.props.utils.denNgay,
                BuildingId:this.props.user.towerId
            };
            this.props.loadDataHandle(data);
        }
        if (nextProps.initList && nextProps.initList !== this.props.initList) {
            const data = {
                keyword: this.state.isApplySearchKey ? this.state.searchKey : '',
                currentPage: nextProps.currentPage + 1,
                rowPerPage: this.props.rowPerPage,
                username:this.props.user.fullName,
                employeeId: this.props.user.id,
                StatusId:this.state.statusId,
                tuNgay:getDateApi(this.props.utils.tuNgay),
                denNgay:getDateApi(this.props.utils.denNgay),
                BuildingId:this.props.user.towerId
            };
            this.props.loadDataHandle(data);
        }
        if (nextProps.errorCreate && this.props.errorCreate !== nextProps.errorCreate) {
            if (!nextProps.errorCreate.hasError) {
                this.props.refreshDataHandle()
                this.refs.toast.show('Tạo yêu cầu thành công', DURATION.LENGTH_LONG);
            }
        }
        if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
            this.props.refreshDataHandle()
        }
        if (nextProps.errorResponse && this.props.errorResponse !== nextProps.errorResponse) {
            this.setState({ showModal: false, modalView: null }, () => {
                if (nextProps.errorResponse && nextProps.errorResponse.hasError) {
                    this.refs.toast.show(nextProps.errorResponse.message, DURATION.LENGTH_LONG);
                } else {
                    this.refs.toast.show('Phản hồi thành công', DURATION.LENGTH_LONG);
                }
            })
        }
    }
    componentWillUnmount() {
        // this.props.resetStateByKey({ key: 'state' });
        this.props.resetStateByKey({ key: 'state' });
    }

    _renderContent() {
        return (
            <View style={{flex: 1}}>
                <TouchableOpacity onPress={()=>this.setState({showActionStatusName:true})}
                                style={{
                                    backgroundColor: colors.white,
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottomWidth: 0.5,
                        borderBottomColor: colors.appTheme,
                        flexDirection: 'row',
                        marginTop: -20
                                }}
                            >
                                
                                <Text style={{
                                    fontWeight: '700',
                                    fontSize: fontsize.medium,
                                    textAlign: 'center',
                                    fontFamily: "Inter-Bold",
                                }}>{this.state.statusName}</Text>

                                <Icon style={{fontSize:fontsize.medium,marginHorizontal:10}} name='filter-list' />

                            </TouchableOpacity>
                            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 5
            }}>
                <TouchableOpacity onPress={()=>{
                    if(this.props.utils.date.length<=0){
                        this.props.loadDate()
                    }
                    this.setState({showActionDate:true})
                }} 
                style={{
                    paddingVertical: 10, flex: 1, backgroundColor: colors.NoColor, alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
                    borderRadius: 12,
                    backgroundColor: "#ffffff",
                    shadowColor: "rgba(0, 0, 0, 0.1)",
                    elevation: 2,
                    shadowOffset: {
                        width: 0,
                        height: 4
                    },
                    shadowRadius: 10,
                    shadowOpacity: 1,
                    marginHorizontal: 10
                }}>
                    
                    <Text style={{fontFamily: "Inter-Bold", fontSize:fontsize.medium,fontWeight:'500'}}>{this.props.utils.Name}</Text>
                    <Icon style={{fontSize:fontsize.larg,marginLeft:5}} name='arrow-drop-down' type='MaterialIcons' />
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>this.setState({isTuNgayPickerVisible:true})} 
                style={{
                    paddingVertical: 10, flex: 1, backgroundColor: colors.NoColor, alignItems: 'center',
                    borderRadius: 12,
                    backgroundColor: "#ffffff",
                    shadowColor: "rgba(0, 0, 0, 0.1)",
                    elevation: 2,
                    shadowOffset: {
                        width: 0,
                        height: 4
                    },
                    shadowRadius: 10,
                    shadowOpacity: 1,
                    marginHorizontal: 10
                }}>
                    <Text style={{ ontFamily: "Inter-Bold", fontSize: fontsize.medium, fontWeight: '500' }}>{getDate(this.props.utils.tuNgay)}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>this.setState({isDenNgayPickerVisible:true})} 
            style={{
                paddingVertical: 10, flex: 1, backgroundColor: colors.NoColor, alignItems: 'center',
                borderRadius: 12,
                backgroundColor: "#ffffff",
                shadowColor: "rgba(0, 0, 0, 0.1)",
                elevation: 2,
                shadowOffset: {
                    width: 0,
                    height: 4
                },
                shadowRadius: 10,
                shadowOpacity: 1,
                marginHorizontal: 10
            }}>
                    <Text style={{ fontFamily: "Inter-Bold", fontSize: fontsize.medium, fontWeight: '500' }}>{getDate(this.props.utils.denNgay)}</Text>
                </TouchableOpacity>
                
            </View>
            {
                this._renderContentContent()
            }
            <ActionSheet title='Tuỳ chọn' visible={this.state.showAction} data={this.state.actionData} renderItem={this.renderActionSheetItem} closeAction={()=>this.setState({showAction:false})} />
                <ActionSheet title='Chọn trạng thái' visible={this.state.showActionStatus} data={this.state.actionDataStatus} renderItem={this.renderActionSheetItemStatus} closeAction={()=>this.setState({showActionStatus:false})} />
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    cancelTextIOS="Huỷ"
                    confirmTextIOS='Xác nhận'
                    titleIOS='Chọn thời gian'
                    mode='date'
                    locale="vi_VN"//https://gist.github.com/jacobbubu/1836273
                />

                <TuNgayPicker
                    date={new Date(this.props.utils.tuNgay)}
                    isVisible={(this.state.isTuNgayPickerVisible)}
                    onConfirm={(date)=>{
                        this.setState({isTuNgayPickerVisible:false})
                        this.props.onChangetuNgay(date)
                        setTimeout(()=>{
                            this.props.refreshDataHandle()
                        },500)
                    }}
                    onCancel={()=>{this.setState({isTuNgayPickerVisible:false})}}
                    cancelTextIOS="Huỷ"
                    confirmTextIOS='Xác nhận'
                    titleIOS='Chọn thời gian'
                    mode='date'
                    locale="vi_VN"//https://gist.github.com/jacobbubu/1836273
                />

                <DenNgayPicker
                    date={new Date(this.props.utils.denNgay)}
                    isVisible={this.state.isDenNgayPickerVisible}
                    onConfirm={(date)=>{
                        this.setState({isDenNgayPickerVisible:false})
                        this.props.onChangedenNgay(date)
                        setTimeout(()=>{
                            this.props.refreshDataHandle()
                        },500)
                    }}
                    onCancel={()=>{this.setState({isDenNgayPickerVisible:false})}}
                    cancelTextIOS="Huỷ"
                    confirmTextIOS='Xác nhận'
                    titleIOS='Chọn thời gian'
                    mode='date'
                    locale="vi_VN"//https://gist.github.com/jacobbubu/1836273
                />
                <ActionSheet title='Chọn thời gian' visible={this.state.showActionDate} data={this.props.utils.date} renderItem={this.renderActionSheetDate} closeAction={()=>this.setState({showActionDate:false})} />
                <ActionSheet title='Chọn trạng thái' visible={this.state.showActionStatusName} data={this.state.actionDataStatusName} renderItem={this.renderActionSheetStatusName} closeAction={()=>this.setState({showActionStatusName:false})} />
            </View>
            // <DangThucHien />
        );
    }
    _renderContentContent() {
        const { emptyData, error, initList, data, isRefreshing, refreshDataHandle } = this.props;
        if (initList) {
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
        if (emptyData) {
            return <ErrorContent title={Strings.app.emptyData} onTouchScreen={() => this.props.refreshDataHandle()} />
        }
        if (error && error.hasError) {
            return (
                <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.refreshDataHandle()} />
            )
        }
        return (
            <FlatList
                keyExtractor={(item, index) => `${index}`}
                refreshing={isRefreshing}
                onRefresh={() => refreshDataHandle()}
                data={data}
                //ItemSeparatorComponent={() => <View style={{ backgroundColor: colors.grayBorder, height: 1 }} />}
                renderItem={this.renderItem}
            />
        );
    }
    renderItem = ({ item }) => {
        return (
            <Swipeable rightActionActivationDistance={50} rightButtons={[
                <TouchableOpacity 
                    onPress={() => this.setState({ showModal: true, modalView: this.renderCreateNote(item) })} 
                    style={{ flex: 1, justifyContent: 'center', paddingLeft: 10 }}>
                    <Text></Text>
                </TouchableOpacity>
            ]}
            style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                borderRadius: 12,
                backgroundColor: "#ffffff",
                shadowColor: "rgba(0, 0, 0, 0.1)",
                elevation: 2,
                shadowOffset: {
                    width: 0,
                    height: 4
                },
                shadowRadius: 10,
                shadowOpacity: 1,
                marginVertical: 10, marginHorizontal: 20,
            }}>
                <TouchableOpacity
                    onPress={() => this.item_click(item)}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 20,
                        backgroundColor: '#fff',
                        borderRadius: 12,
                    }}
                >

                    <View style={{
                        width:50,
                        height:50,
                        // backgroundColor:colors.gray1,
                        borderRadius:25,
                        borderWidth:0.5,
                        borderColor:colors.appTheme,
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                        {/* lấy ra ký tự đầu và ký tự cuối của mã căn hộ */}
                        <Text>{(item.id+''.charAt(0) ).toUpperCase()}</Text>
                    </View>

                    <View style={{ flex: 1, justifyContent:'center', marginLeft: 10 }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 5 }}>
                            <Text style={{ color: '#000', fontWeight: 'bold', fontFamily: "Inter-Bold"  }}>{item.apartmentName}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 5 }}>
                            {/* <Text style={{ color: colors.gray1 }}>Khu <Text style={{ color: colors.appTheme,fontWeight:'bold' }}>{item.khu}</Text></Text> */}
                            <Text style={{
                                fontFamily: "Inter-Regular",
                                fontSize: 11,
                                color: "#6f6f6f"
                            }}>{moment(item.dateHandoverFrom).format('DD/MM/YYYY HH:mm')}</Text>
                            <Text style={{
                                fontFamily: "Inter-Regular",
                                fontSize: 11,
                                color: "#6f6f6f"
                            }}>-</Text>
                            <Text style={{
                                fontFamily: "Inter-Regular",
                                fontSize: 11,
                                color: "#6f6f6f"
                            }}>{moment(item.dateHandoverTo).format('DD/MM/YYYY HH:mm')}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {/* <Text style={{ color: colors.gray1 }}>{statusName}</Text> */}
                            <View
                                style={{
                                    //marginLeft: 10,
                                    marginVertical: 5,
                                    backgroundColor: "#feefef",
                                    borderRadius: 15
                                }}>
                                <Text style={{ margin: 2, marginHorizontal: 5, fontSize: fontsize.small, color: "#f53b3b", fontFamily: "Inter-Regular", }}>{item.statusName}</Text>
                            </View>
                            <Text style={{ color: colors.gray1 }}></Text>
                        </View>
                        
                    </View>

                </TouchableOpacity>

            </Swipeable>
        )
    }
    renderActionSheetStatusName = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                        this.setState({ 
                            showActionStatusName: false ,
                            statusName:item.name,
                            statusId:item.id
                        },()=>{
                            setTimeout(()=>{
                                this.props.refreshDataHandle()
                            },500)
                        })
                    }
                }
                style={{ borderBottomColor: colors.grayBorder, borderBottomWidth: 0.5, borderTopColor: colors.grayBorder, borderTopWidth: 0.5, alignItems: 'center' }}
            >
                <Text style={{fontWeight:'400', margin: 10, color: colors.blue, fontSize: fontsize.medium,textAlign:'center' }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    renderActionSheetDate = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                        this.setState({ showActionDate: false },()=>{
                            this.props.onChangeDateName(item.name)
                            this.props.onChangetuNgay(item.dateFrom)
                            this.props.onChangedenNgay(item.dateTo)
                            setTimeout(()=>{
                                this.props.refreshDataHandle()
                            },500)
                        })
                    }
                }
                style={{ borderBottomColor: colors.grayBorder, borderBottomWidth: 0.5, borderTopColor: colors.grayBorder, borderTopWidth: 0.5, alignItems: 'center' }}
            >
                <Text style={{fontWeight:'400', margin: 10, color: colors.blue, fontSize: fontsize.larg,textAlign:'center' }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    item_click(item){
        this.props.goListTaiSan(item)
    }
    
    render() {
        const {
            searchKey,
        } = this.state;
        const { isShowSearch } = this.state;
        return (
            <View style={styles.container}>
                <NavBar
                    leftButton={<TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={{ padding: 10 }}>
                        <MyIcon
                            size={20}
                            name="arrow"
                            color="#fff" />
                    </TouchableOpacity>}
                    body={<Text style={{ fontFamily: "Inter-Bold",
                    fontSize: 18,
                    fontWeight: "bold",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "center",
                    color: "#ffffff" }}>Bàn giao nội bộ</Text>}
                    rightView={<TouchableOpacity
                        style={{ padding: 10 }}>
                        <MyIcon
                            size={20}
                            name="arrow"
                            color={colors.appTheme} />
                    </TouchableOpacity>}
                />


                {this._renderContent()}
                <Toast ref="toast" style={{ backgroundColor: this.props.errorResponse && this.props.errorResponse.hasError ? colors.toast.warning : colors.toast.success, opacity: 1, borderRadius: 5, padding: 10 }} />
            </View>)

    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
const mapStateToProps = (state) => ({
    user: state.auth.user,
    building: state.auth.building,
    towerId: state.auth.user ? state.auth.user.towerId : 0,
    initList: state.checklist_dangthuchien.initList,
    currentPage: state.checklist_dangthuchien.currentPage,
    rowPerPage: state.checklist_dangthuchien.rowPerPage,
    emptyData: state.checklist_dangthuchien.emptyData,
    outOfStock: state.checklist_dangthuchien.outOfStock,
    isLoading: state.checklist_dangthuchien.isLoading,
    data: state.checklist_dangthuchien.data,
    error: state.checklist_dangthuchien.error,
    isRefreshing: state.checklist_dangthuchien.isRefreshing,
    isApplySearchKey: state.checklist_dangthuchien.isApplySearchKey,
    searchKey: state.checklist_dangthuchien.searchKey,
    errorResponse: state.checklist_dangthuchien.errorResponse,
    canNavigate: state.servicesBasicDetail.data == null,
    language: state.app.language == 'vi' ? 1 : 2,
    utils:state.utils
});

// const mapActionToState = dispatch => ({
//     loadDataHandle,
//     refreshDataHandle,
//     resetStateByKey,
//     progressHandle
// })

const mapActionToState = {
    loadDataHandle,
    refreshDataHandle,
    resetStateByKey,
    progressHandle,
    goListTaiSan,
    HandOverStatus,
    HandOverChangeStatus,
    HandOverFinishDate,

    onChangetuNgay,
    onChangedenNgay,
    onChangeDateName,
    loadDate,
    CheckListStatusName
}

//make this component available to the app
export default connect(mapStateToProps, mapActionToState)(index);
