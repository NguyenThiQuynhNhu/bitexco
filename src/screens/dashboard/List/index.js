import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Platform, ScrollView,
    Modal, Image } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '../../../components/common/NavBar';
import IconButton from '../../../components/common/IconButton';
import { titleStyle } from '../../../theme/styles'
import { Screen } from '../../../utils/device'
import colors from '../../../theme/colors';
import fontsize from '../../../theme/fontsize';
import Strings from '../../../utils/languages';

const Devices = require('react-native-device-detection');
import { MyIcon } from '../../../theme/icons';
import ButtonDateFilter from '../../../components/statistics/ButtonFilter';
import DateTimePicker from 'react-native-modal-datetime-picker';
//style
import fontSize from '../../../theme/fontsize';

import Button from '../../../components/common/Button';
import ImageProgress from '../../../components/common/ImageProgress';
import { default_image } from '../../../theme/images'
import _ from 'lodash';

import {
    loadDataHandle,
    setProps
} from '../../../actions/dashboard'
import { resetStateByKey as resetAuth } from '../../../actions/auth';
import ErrorContent from '../../../components/common/ErrorContent';

class DashboardScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            txtStartDate: moment().format('YYYY-MM-DD'),
            txtEndDate: moment().format('YYYY-MM-DD'),
            isStartDate: true,
            selectedButton: 1,
            isShowPopupCustomDate: false
        };
    }

    componentDidMount() {
        const request = {
            towerId: this.props.user.towerId,
            dateFrom: moment(this.state.startDate).format('DD/MM/YYYY'),
            dateTo: moment(this.state.endDate).format('DD/MM/YYYY')
        }
        this.props.loadDataHandle(request);
        //console.log(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing) {
            const request = {
                towerId: this.props.user.towerId,
                dateFrom: moment(this.state.startDate).format('DD/MM/YYYY'),
                dateTo: moment(this.state.endDate).format('DD/MM/YYYY')
            }
            this.props.loadDataHandle(request);
        }
    }

    componentWillUnmount() {
        this.props.setProps({ key: 'state' });
    }
    
    renderContent = () => {
        const { emptyData, error, data, isRefreshing, isLoading } = this.props;
        if (isLoading && !isRefreshing) {
            return (<View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator  color={colors.appTheme}/>
            </View>)
        }
        if (error && error.hasError) {
            return (
                <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.setProps({ isRefreshing: true, data: [] })} />
            )
        }
        if (emptyData) {
            return <ErrorContent title={Strings.app.emptyData} onTouchScreen={() => this.props.setProps({ isRefreshing: true, data: [] })} />
        }

        if(data !== [])
        {
            let level = 0
            if(data.length > 0){
                level = data[0].level

                if(this.state.selectedButton === 1){
                    const dataFilters = data.filter(o => o.amount > 0)
                    let isUnnormal = false;
                    if(dataFilters.length > 0){
                        isUnnormal = true
                    }
                    setTimeout(() => {
                        if(this.props.user.isUnnormal !== isUnnormal){
                            this.props.resetAuth({ key: 'user', path: '', value: { ...this.props.user, isUnnormal: isUnnormal } })
                        }
                    }, 500);
                }
            }
            
            if(level === 1){
                const numColumn = Devices.isTablet ? 3 : 2
                return (
                    <FlatList
                        ItemSeparatorComponent={() => <View style={{ height: 0, backgroundColor: colors.grayBorder }} />}
                        data={data || []}
                        renderItem={this.renderItem}
                        numColumns={ numColumn }
                    />
                );
            }
            else{
                return (
                    <FlatList
                        ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: colors.grayBorder }} />}
                        data={data || []}
                        renderItem={this.renderItem}
                        numColumns={ 1 }
                    />
                );
            }
        }
        else
        {
            return null;
        }
    }

    renderItem = ({ item }) => {
        const { id, name, icon } = item
        const size = item.level === 1 ? (Screen.width / (Devices.isTablet ? 3 : 2)) : '100%'

        const { startDate, endDate } = this.state

        if(item.level === 1){//View toà nhà
            return (
                <TouchableOpacity style={{
                    width: size,
                    flex: 1,
                    height: Screen.width / (Devices.isTablet ? 3 : 3.2),
                    padding: 2.5
                }}
                    onPress={() => {
                        return this.props.navigation.navigate('dashboardLevel2', { startDate, endDate, towerId: item.id, towerName: item.name, towerImageUrl: item.imageUrl })
                    }}
                >
                    <View style={{
                        flex: 1,
                        borderColor: item.amount > 0 ? 'red' : colors.grayBorder,
                        borderWidth: 1
                    }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',
                        backgroundColor: '#fff',height: '100%',
                        width: '100%', padding: 5 }}>
                            <ImageProgress
                                style={{
                                    height: '100%',
                                    width: '100%'
                                }}
                                resizeMode="stretch"
                                source={{ uri: item.imageUrl }}
                            />
                        </View>
                        { item.amount > 0 ? <View style={{ position: 'absolute', top: 5, right: 5, borderRadius: 25, width: 25, height: 25, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff' }}>{ item.amount }</Text>   
                        </View>
                        : null}

                        <View style={{ width: '100%', height: 30, backgroundColor: item.amount > 0 ? 'red' : colors.grayBorder, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: Platform.isPad ? fontsize.medium : fontsize.micro, color: item.amount > 0 ? '#fff' : '' }}>{name.toLocaleUpperCase()}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
        else{
            return (
                <TouchableOpacity style={{
                    width: size,
                    flex: 1,
                    padding: 10,
                    paddingVertical: 20, 
                    backgroundColor: item.amount > 0 ? 'red' : ''
                }}
                onPress={() => {
                    return this.props.navigation.navigate('dashboardChecklist', { startDate, endDate, towerId: this.props.user.towerId, towerName: this.props.user.towerName, systemId: item.id, systemName: item.name, towerImageUrl: this.props.dataVendor[0].logo })
                }}
                >
                    <View style={{ width: '100%' }}>
                            <Text style={{ fontSize: Platform.isPad ? fontsize.medium : fontsize.micro, color: item.amount > 0 ? '#fff' : '' }}>{name.toLocaleUpperCase()}</Text>

                            { item.amount > 0 ? <View style={{ position: 'absolute', right: 5, top: -8, borderRadius: 25, width: 25, height: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'red' }}>{ item.amount }</Text>   
                        </View>
                        : null}
                        </View>
                </TouchableOpacity>
            )
        }
    }

    render() {

        const { selectedButton } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>

                <NavBar
                    leftButton={<TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <MyIcon
                            name="arrow"
                            size={22}
                            color="#fff"
                        />
                    </TouchableOpacity>}
                    body={<Text style={titleStyle}>DASHBOARD</Text>}

                />
                <View>
                    <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{
                                backgroundColor: '#fff',
                                paddingVertical: 10,
                            }}
                        >
                            <ButtonDateFilter value={selectedButton == 1} text="Hôm nay" onPress={() => this.setActive(1)} />
                            <ButtonDateFilter value={selectedButton == 2} text="Hôm qua" onPress={() => this.setActive(2)} />
                            {/* <ButtonDateFilter value={selectedButton == 3} text="Tuần này" onPress={() => this.setActive(3)} />
                            <ButtonDateFilter value={selectedButton == 4} text="Tuần trước" onPress={() => this.setActive(4)} /> */}
                            <ButtonDateFilter value={selectedButton == 5} text="Tháng này" onPress={() => this.setActive(5)} />
                            <ButtonDateFilter value={selectedButton == 6} text="Tuỳ chỉnh" onPress={() => this.setActive(6)} />
                        </ScrollView>


                    <View style={{ flexDirection: 'row', padding: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: colors.grayBorder, }}>
                        <Text style={{ fontSize: fontSize.medium, color: '#111' }}>Kỳ báo cáo: {moment(this.state.startDate).format('DD-MM-YYYY')} - </Text>

                        <Text style={{ fontSize: fontSize.medium, color: '#111' }}>{moment(this.state.endDate).format('DD-MM-YYYY')}</Text>
                    </View>
                </View>

                <View style={{ flex: 1 }}>
                        {this.renderContent()}
                </View>

                <Modal
                    transparent={true}
                    visible={this.state.isShowPopupCustomDate}
                    onRequestClose={() => null}
                >
                    <View style={{ flex: 1, backgroundColor: colors.appOverView, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0, marginHorizontal: 15, borderRadius: 5, flexDirection: 'column', width: Devices.isTablet ? "50%" : "90%", }} >
                            <View style={{ padding: 12, paddingVertical: 15, height: 160 }}>
                                <Text style={{ textAlign: 'center', fontSize: 17 }} >TÙY CHỈNH THỜI GIAN</Text>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 0 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

                                        {/* <Image source={Icons.calendar} style={{ height: 30, width: 30, marginRight: 5 }} /> */}
                                        <TouchableOpacity onPress={() => this._showDateTimePicker(true)} bordered dark style={{ borderRadius: 0, flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 5, padding: 10 }}>
                                            <Text style={{ fontSize: fontSize.medium, color: '#111' }}>{moment(this.state.txtStartDate).format('DD-MM-YYYY')}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => this._showDateTimePicker(false)} bordered dark style={{ borderRadius: 0, flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: fontSize.medium, color: '#111' }}>{moment(this.state.txtEndDate).format('DD-MM-YYYY')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {/* <View><Text style={{margin:5,flex:0.3}}>-</Text></View> */}

                                </View>
                                <View style={{ padding: 5 }}>
                                    <Button text="OK" style={{ padding: 10 }}
                                        onPress={this.customTime}
                                    />
                                </View>
                            </View>


                            <TouchableOpacity
                                onPress={() => this.setState({ isShowPopupCustomDate: false })}
                                style={{ borderColor: colors.grayBorder, borderTopWidth: 1, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'red' }}>ĐÓNG</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={(date) => this._handleDatePicked(date)}
                            onCancel={this._hideDateTimePicker}

                        />
                    </View>

                </Modal>
            </View>
        );
    }

    refreshDataHandle(){
        const request = {
            towerId: this.props.user.towerId,
            dateFrom: moment(this.state.startDate).format('DD/MM/YYYY'),
            dateTo: moment(this.state.endDate).format('DD/MM/YYYY')
        }
        this.props.loadDataHandle(request);
    }

    _showDateTimePicker(type) {
        this.setState({ isDateTimePickerVisible: true, isStartDate: type });

    }
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        if (this.state.isStartDate) {
            this.setState({ txtStartDate: moment(date).format('YYYY-MM-DD') });
        } else {
            this.setState({ txtEndDate: moment(date).format('YYYY-MM-DD') });
        }
        this._hideDateTimePicker();
    };

    customTime = () => {
        this.setState({
            isShowPopupCustomDate: false,
            startDate: this.state.txtStartDate,
            endDate: this.state.txtEndDate
        }, () => {
            this.refreshDataHandle()
        })
    }

    _onSelectedChange = (value) => {
        if (value == this.state.status) {
            this.setState({ status: -1 }, () => this.refreshDataHandle())
        } else {
            this.setState({ status: value }, () => this.refreshDataHandle())
        }
    }

    setActive(id) {
        let option = null
        switch (id) {
            case 1: //hôm nay
            {
                option = {
                    selectedButton: id,
                    endDate: moment().format('YYYY-MM-DD'),
                    startDate: moment().format('YYYY-MM-DD')
                }
                break;
            }
            case 2: //hôm qua
            {
                option = {
                    selectedButton: id,
                    endDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
                    startDate: moment().add(-1, 'days').format('YYYY-MM-DD')
                }
                break;
            }
            case 3: //tuần này
            {
                var curr = new Date(); // get current date
                var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
                var last = first + 6; // last day is the first day + 6
                
                var firstday = new Date(curr.setDate(first)).toUTCString();
                var lastday = new Date(curr.setDate(last)).toUTCString();
                var date = moment(firstday).format('YYYY-MM-DD')
                option = {
                    selectedButton: id,
                    endDate: moment().subtract(7, 'days'),
                    startDate: moment(firstday).format('YYYY-MM-DD')
                }
                break;
            }
            case 4: //tuần trước
            {
                var curr = new Date(); // get current date
                var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
                var last = first + 6; // last day is the first day + 6

                var firstday = new Date(curr.setDate(first)).toUTCString();
                var lastday = new Date(curr.setDate(last)).toUTCString();

                option = {
                    selectedButton: id,
                    startDate: moment(firstday).add(-1, 'weeks').format('YYYY-MM-DD'),
                    endDate: moment(lastday).add(-1, 'weeks').format('YYYY-MM-DD')
                }
                break;
            }

            case 5: //tháng này
            {
                option = {
                    selectedButton: id,
                    startDate: moment().format("YYYY-MM-01"),
                    endDate: moment().format("YYYY-MM-") + moment().daysInMonth()
                }
                break;
            }

            case 6: //tuỳ chọn
            {
                option = {
                    selectedButton: id,
                    isShowPopupCustomDate: true
                }
                break;
            }
        }
        return this.setState(option, () => {
            if (id !== 6) {
                this.refreshDataHandle();
            }
        })
    }
}

const mapStateToProps = (state) => ({
    emptyData: state.dashboard.emptyData,
    isLoading: state.dashboard.isLoading,
    data: state.dashboard.data,
    error: state.dashboard.error,
    isRefreshing: state.dashboard.isRefreshing,
    user: state.auth.user,
    canNavigate: true,
    language: state.app.language,
    dataVendor: state.vendor.data,
});

const mapActionToState = {
    loadDataHandle,
    setProps,
    resetAuth
};
export default connect(mapStateToProps, mapActionToState)(DashboardScreen)
