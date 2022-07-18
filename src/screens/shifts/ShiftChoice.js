import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, TextInput, Platform, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Calendar, LocaleConfig } from 'react-native-calendars'

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
    setProps
} from '../../actions/shiftsChoice'
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
            itemSelected: props.navigation.state.params.itemSelected
        };
    }

    componentDidMount() {
        
        this.props.loadDataShiftHandle({ employeeId: 0, date: moment(new Date()).format('DD/MM/YYYY'), towerId: this.props.towerId })

        this.props.loadDataDayListHandle({ date: moment(this.state.date).format('DD/MM/YYYY'), towerId: this.props.towerId, employeeId: this.state.itemSelected.employeeId, isChangeShift: true, typeIdSelected: this.state.itemSelected.typeId, DateSelected: moment(this.state.itemSelected.date).format('DD/MM/YYYY') })
    }

    componentWillUpdate(nextProps, nextState) {
        // if (nextState.date && nextState.date !== this.state.date) {
        //     this.props.loadDataDayListHandle({ date: moment(nextState.date).format('DD/MM/YYYY'), towerId: this.props.towerId, employeeId: this.state.itemSelected.employeeId, isChangeShift: true, dateSelect: moment(itemSelected.date).format('DD/MM/YYYY') })
        // }

        if (nextState.date && nextState.date !== this.state.date) {
            this.props.loadDataDayListHandle({ date: moment(nextState.date).format('DD/MM/YYYY'), towerId: this.props.towerId, employeeId: this.state.itemSelected.employeeId, isChangeShift: true, typeIdSelected: this.state.itemSelected.typeId, DateSelected: moment(this.state.itemSelected.date).format('DD/MM/YYYY') })
        }

        if (nextProps.markedDates && nextProps.markedDates !== this.props.markedDates) {
            this.setState({ markedDates: nextProps.markedDates })
        }
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
            }}>

                <Text style={{ paddingTop: 10, marginLeft: 30, fontSize: fontsize.small, fontWeight: 'bold', fontFamily: "Inter-Bold" }}>Ca trực <Text style={{ fontWeight: 'normal', color: colors.appTheme, marginLeft: 20, fontStyle: 'italic' }}>{ moment(this.state.date).format('DD/MM/YYYY') }</Text></Text>
                
                <FlatList
                refreshing={isRefreshing}
                onRefresh={() => this.props.setProps({ isRefreshing: true, data: [] })}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
                data={data}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => `${index}`}
            // canNavigate={this.props.canNavigate}
            // navigation={this.props.navigation}
            />
            </View>
        );
    }

    onSelected = (item) => {
        const { onSelected } = this.props.navigation.state.params;
        this.props.navigation.goBack();
        onSelected(item)
    }

    renderItem = ({ item, index }) => {
        const {
            id,
            code,
            name,
            block,
            date,
            typeId,
            employeeId,
            employeeFullName,
            employeeImageUrl,
            phone,
            isAllow
        } = item
        
        const { itemSelected } = this.state;
        
        return (
            <TouchableOpacity
                style={{ flexDirection: 'row', marginVertical: 10,
                marginHorizontal: 30, }}
                onPress={() => { this.onSelected(item) }}
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
                            <View style={{ borderRadius: 45, height: 22, width: 22, backgroundColor: colors.appBackround, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'rgb(0 ,173, 239)' }} numberOfLines={2} lineBreakMode="tail">{code}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        const { isLoading } = this.props
        const { markedDates, isShowModal, isShowForm, title } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>

                <NavBar
                    leftButton={<IconButton icon="arrow" size={20}
                        onPress={() => this.props.navigation.goBack()}
                        color="#fff" />}
                    body={<Text style={titleStyle}>Chọn người nhận</Text>}
                    rightView={<TouchableOpacity
                        style={{ padding: 10 }}
                        
                    >
                        <MyIcon
                            name="arrow"
                            size={22}
                            color= {colors.appTheme}
                        />
                    </TouchableOpacity>}
                />
                <ScrollView style={{ flex: 1, marginTop: -10 }} showsVerticalScrollIndicator={false}>
                    <View style={{ 
                        marginHorizontal: 20,
                        marginVertical: 10,
                    padding: 5,
                    borderRadius: 20,
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
                                    this.setState({ markedDates: { ...this.props.markedDates, [key]: { ...(this.props.markedDates[key] || {}), ...{ selected: true } } } })
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
                                const { dotColor } = marking
                                let selected = null
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
            </View>
        );
    }

}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    isLoading: state.shiftsDayListChoice.isLoading,
    data: state.shiftsDayListChoice.data,
    error: state.shiftsDayListChoice.error,
    isRefreshing: state.shiftsDayListChoice.isRefreshing,
    // canNavigate: true,//state.requestDetail.data == null,
    language: state.app.language,
    markedDates: state.shiftsChoice.markedDates,
    towerId: state.auth.user.towerId
});

const mapActionToState = {
    loadDataShiftHandle,
    loadDataDayListHandle,
    setProps
};
export default connect(mapStateToProps, mapActionToState)(ShiftListScreen)
