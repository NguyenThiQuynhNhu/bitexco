import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, TextInput, Platform, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import { Calendar, LocaleConfig } from 'react-native-calendars'
import Toast, { DURATION } from 'react-native-easy-toast';

import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '../../components/common/NavBar';
import IconButton from '../../components/common/IconButton';
import { titleStyle } from '../../theme/styles'
import { Screen } from '../../utils/device'
import colors from '../../theme/colors';
import fontsize from '../../theme/fontsize';
import { MyIcon } from '../../theme/icons';
import Strings from '../../utils/languages';
import { converTypeToColor } from '../../utils/shifts'
import CircleView from '../../components/common/CircleView'
import {
    loadDataShiftHandle,
    loadDataDayListHandle,
    shiftsSetProps as setProps
} from '../../actions/shifts'
import ErrorContent from '../../components/common/ErrorContent';
import ImageProgress from '../../components/common/ImageProgress';
import Lookup from '../../components/Request/RequestCreate/Lookup';
import PrimaryButton from '../../components/common/PrimaryButton';
import Radio from '../../components/common/Radio';

class ShiftListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            isShowModal: false,
            itemSelected: null,
            modalView: null,
            changeType: 0,
            title: '',
            isShowForm: false,
            markedDates: null,
            isAllowChangeShift: true
        };
    }

    componentDidMount() {
        this.props.loadDataShiftHandle({ employeeId: 0, date: moment(new Date()).format('DD/MM/YYYY'), towerId: this.props.towerId })

        this.props.loadDataDayListHandle({ date: moment(this.state.date).format('DD/MM/YYYY'), towerId: this.props.towerId, employeeId: 0, isChangeShift: false, DateSelected: '' })
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing) {
            this.props.loadDataDayListHandle({ date: this.state.date, towerId: this.props.towerId, employeeId: 0, isChangeShift: false, DateSelected: '' })
        }
        if (nextState.date && nextState.date !== this.state.date) {
            this.props.loadDataDayListHandle({ date: moment(nextState.date).format('DD/MM/YYYY'), towerId: this.props.towerId, employeeId: 0, isChangeShift: false, DateSelected: '' })
        }
        if (nextProps.errorCreate && nextProps.errorCreate !== this.props.errorCreate) {
            if (!nextProps.errorCreate.hasError) {
                this.refs.toast.show('Thao tác thành công', DURATION.LENGTH_LONG);
            }
        }
        if (nextProps.markedDates && nextProps.markedDates !== this.props.markedDates) {
            this.setState({ markedDates: nextProps.markedDates })
        }
    }

    componentWillUnmount() {
        this.props.setProps({ key: 'state' });
    }

    renderContent = () => {
        const { emptyData, error, data, isRefreshing, isLoading } = this.props;
        if (isLoading) {
            return (<View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator  color={colors.appTheme}/>
            </View>)
        }
        if (error) {
            return (
                <View style={{ paddingTop: 100 }}>
                    <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.setProps({ isRefreshing: true, data: [] })} />
                </View>
            )
        }
        if (data.length == 0) {
            return <View style={{ paddingTop: 100 }}><ErrorContent title={Strings.app.emptyData} onTouchScreen={() => this.props.setProps({ isRefreshing: true, data: [] })} />
            </View>
        }

        return (
            <View style={{
                //padding: 10,
                //marginTop: 10,
                //marginBottom: 10,
                //borderColor: colors.gray2,
                //borderTopWidth: 10,
                //marginHorizontal: -10,
            }}>

                <Text style={{ paddingTop: 10, marginLeft: 30, fontSize: fontsize.small, fontWeight: 'bold', fontFamily: "Inter-Bold" }}>Ca trực <Text style={{ fontWeight: 'normal', color: colors.appTheme, marginLeft: 20, fontStyle: 'italic' }}>{ moment(this.state.date).format('DD/MM/YYYY') }</Text></Text>
                
                <FlatList
                refreshing={isRefreshing}
                onRefresh={() => this.props.setProps({ isRefreshing: true, data: [] })}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#c8c8c8", marginHorizontal: 30 }} />}
                data={data}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => `${index}`}
            // canNavigate={this.props.canNavigate}
            // navigation={this.props.navigation}
            />
            </View>
        );
    }

    renderItem = ({ item, index }) => {
        const {
            code,
            name,
            block,
            employeeFullName,
            employeeImageUrl,
            date,
            phone,
            isAllow
        } = item
        return (
            <TouchableOpacity
                style={{ flexDirection: 'row',
                    marginVertical: 10,
                    marginHorizontal: 30,
                    //padding: 10, 
                }}
                onPress={() => this.setState({ itemSelected: item, isShowModal: true, isAllowChangeShift: new Date(date) > new Date() })}
            >
                <View
                    style={{
                        flex: 1,
                        
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#fff'
                    }}
                >

                    <ImageProgress
                        circle={true}
                        style={{
                            height: 60,
                            width: 60
                        }}

                        source={{ uri: employeeImageUrl }}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between', marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: fontsize.small, fontWeight: 'bold', fontFamily: "Inter-Bold" }}>{employeeFullName}</Text>
                                <Text style={{fontSize: fontsize.small, fontFamily: "Inter-Regular"}}>{ phone }</Text>
                                <Text style={{fontSize: fontsize.small, fontFamily: "Inter-Regular"}}>{name}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ borderRadius: 45, height: 26, width: 26, backgroundColor: colors.appBackround, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: colors.appTheme }} numberOfLines={2} lineBreakMode="tail">{code}</Text>
                                </View>
                                    <Icon name='dots-vertical-circle' size={ 26 } color={colors.appTheme} style={{ marginRight: 0 }}/>
                                </View>
                            </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { isShowModal, markedDates, isShowForm, title, isAllowChangeShift } = this.state
        const { isLoading } = this.props;

        return (
            <View style={{ flex: 1 }}>

                <NavBar
                    leftButton={<IconButton icon="arrow" size={22}
                        onPress={() => this.props.navigation.goBack()}
                        color="#fff" />}
                        rightView={<TouchableOpacity
                            style={{ padding: 10 }}
                            
                        >
                            <MyIcon
                                name="arrow"
                                size={22}
                                color= {colors.appTheme}
                            />
                        </TouchableOpacity>}
                    body={<Text style={titleStyle}>Ca trực</Text>}

                />
                <ScrollView style={{ flex: 1, marginTop: -10 }} showsVerticalScrollIndicator={false}>
                    <View style={{
                        marginHorizontal: 20,
                        marginVertical: 10,
                        borderRadius: 20,
                        padding: 5,
                        backgroundColor: '#fff',
                        shadowColor: "rgba(0, 0, 0, 0.08)",
                        elevation: 2,
                        shadowOffset: {
                            width: 0,
                            height: 4
                        },
                        shadowRadius: 12,
                        shadowOpacity: 1 }}>
                        <Calendar
                            
                            markedDates={markedDates}
                            onDayPress={(day) => {
                                this.setState({ date: day.dateString }, () => {

                                    const key = day.dateString;
                                    try{
                                    this.setState({ markedDates: { ...this.props.markedDates, [key]: { ...(this.props.markedDates[key] || {}), ...{ selected: true } } } })
                                    }catch(error){}
                                })
                            }}

                            monthFormat={'MM/yyyy'}
                            onMonthChange={(date) => {
                                const dateString = date.day +'/'+ date.month + '/'+ date.year
                                this.props.loadDataShiftHandle({ employeeId: 0, date: dateString, towerId: this.props.towerId })
                            }}
                            hideExtraDays={true}
                            disableMonthChange={true}
                            firstDay={1}

                            dayComponent={(day) => {
                                const {
                                    date, state, marking, theme, onPress
                                } = day
                                // const {
                                //     textDayFontFamily,
                                //     textDayFontSize, dayTextColor
                                // } = theme
                                const { dotColor } = marking
                                // let textColor = dayTextColor
                                // if (marking) {
                                //     textColor = marking.textColor
                                // }
                                let selected = null
                                //console.log(day)

                                //const dateString = date.day +'/'+ date.month +'/'+ date.year

                                //console.log(dateString)
                                return (
                                    <TouchableWithoutFeedback onPress={() => onPress(date)}>
                                        <View style={{ marginBottom: -5 }}>
                                            <View style={{
                                                backgroundColor: marking.selected ? colors.appTheme : 'transparent',
                                                padding: 2,
                                                height:25,
                                                width:25,
                                                borderRadius: 45,
                                                justifyContent:'center',
                                                alignItems:'center'
                                            }}
                                            >
                                                <Text style={{ color: marking.selected ? '#fff' : state === 'today' ? colors.appTheme : '#000' }}>{date.day}</Text>
                                            </View>
                                            <View
                                                style={{
                                                    height: 5,
                                                    width: 5,
                                                    borderRadius: 2.5,
                                                    backgroundColor: dotColor,
                                                    alignSelf: 'center',
                                                    // marginTop: 5
                                                }}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                )
                            }}
                        />

                    </View>
                    
                    <View style={{ flex: 1 }}>
                        {this.renderContent()}
                    </View>
                </ScrollView>

                { isLoading ? <View style={{ position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0)', height: '100%', width: '100%', marginTop: 40 }}></View> : null }

                {isShowModal && <View style={{ height: '100%', width: '100%', position: 'absolute', backgroundColor: colors.appOverView, justifyContent: 'center' }}>
                    <View style={{ backgroundColor: '#fff', alignSelf: 'center', width: '80%', borderRadius: 10 }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', borderColor: colors.gray2, borderBottomWidth: 0.5, padding: 10 }}>
                            <Text style={{ fontSize: fontsize.small, fontWeight: 'bold', fontFamily: "Inter-Bold" }}>Tuỳ chọn</Text>
                        </View>
                        {/* <TouchableOpacity
                            onPress={() => this.onPressOption(1)}
                            style={{ justifyContent: 'center', padding: 15 }}>
                            <Text>NHẬN CA</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity
                            onPress={() => this.onPressOption(3)}
                            style={{ justifyContent: 'center', padding: 15 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name='phone' size={ 20 } color={colors.appTheme} style={{ marginRight: 20 }}/>
                                <Text style={{ fontSize: fontsize.small, fontFamily: 'Inter-Regular'}}>Gọi</Text>
                            </View>
                        </TouchableOpacity>

                        {/* { isAllowChangeShift ? */}
                        <TouchableOpacity
                            onPress={() => this.onPressOption(2)}
                            style={{ justifyContent: 'center', padding: 15 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name='account-convert' size={ 20 } color={colors.appTheme} style={{ marginRight: 20 }}/>
                                <Text style={{ fontSize: fontsize.small, fontFamily: 'Inter-Regular'}}>Đề xuất đổi ca</Text>
                            </View>
                        </TouchableOpacity>
                        {/* : null } */}

                        <TouchableOpacity
                            onPress={() => this.onPressOption(0)}
                            style={{ justifyContent: 'center', padding: 15 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name='window-close' size={ 20 } color={colors.appTheme} style={{ marginRight: 20 }}/>
                                <Text style={{ color: 'red', fontSize: fontsize.small, fontFamily: 'Inter-Regular' }}>Bỏ qua</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>}
                <Toast ref="toast" style={{ backgroundColor: colors.toast.success, opacity: 1, borderRadius: 5, padding: 10, margin: 10 }} />
            </View>
        );
    }

    onPressOption = (type) => {
        const d = new Date()
        const { itemSelected } = this.state
        switch (type) {
            case 0: {
                this.setState({ isShowModal: false, isShowForm: false })
            } break;
            case 1: {
            } break;

            case 2: {
                this.setState({ isShowModal: false }, () => {
                    if(new Date(itemSelected.date) >= new Date(d.getFullYear(),d.getMonth(),d.getDate())){
                        this.props.navigation.navigate('changeShift', { itemSelected })
                    }else{
                        this.refs.toast.show('Ngày đề xuất phải lớn hơn hoặc bằng ngày hiện tại! Vui lòng kiểm tra lại, xin cảm ơn.', DURATION.LENGTH_LONG);
                    }
                })
            } break;

            case 3:
                this.setState({ isShowModal: false }, () => {
                    Linking.canOpenURL(`tel:${itemSelected.phone}`).then((supported) => {
                        if (!supported) {
                            this.refs.toast.show('Số điện thoại không đúng! Vui lòng kiểm tra lại', DURATION.LENGTH_LONG);
                        } else {
                            return Linking.openURL(`tel:${itemSelected.phone}`);
                        }
                    }).catch((error) => {
                        this.refs.toast.show('Xảy ra lỗi! Vui lòng thử lại.', DURATION.LENGTH_LONG);
                    });
                })
            break;
            default: break
        }

    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    isLoading: state.shiftsDayList.isLoading,
    data: state.shiftsDayList.data,
    error: state.shiftsDayList.error,
    isRefreshing: state.shiftsDayList.isRefreshing,
    // canNavigate: true,//state.requestDetail.data == null,
    language: state.app.language,
    markedDates: state.shifts.markedDates,
    towerId: state.auth.user.towerId,
    errorCreate: state.shifts.errorCreate

});

const mapActionToState = {
    loadDataShiftHandle,
    loadDataDayListHandle,
    setProps
};
export default connect(mapStateToProps, mapActionToState)(ShiftListScreen)
