import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import {
    ActivityIndicator,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Modal,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import {
    getDepartment,
    getBlock,
    getEmployeeByDepartment,
    getGeneralReport,
    resetData,
    refreshDataHandle
} from '../../../actions/statistics'
import AxisLineChartScreen from '../controls/LineStatistics';

import DateTimePicker from 'react-native-modal-datetime-picker';
import NavBar from '../../../components/common/NavBar';
import { MyIcon } from '../../../theme/icons';
import fontSize from '../../../theme/fontsize';
import colors from '../../../theme/colors';
import PrimaryButton from '../../../components/common/PrimaryButton';
import ModalPicker from '../../../components/common/ModalPicker';
import PieStatistics from '../controls/PieStatistics';
import BarChart from '../controls/BarChart';
import FilterType from '../../../components/statistics/FilterType';
import ButtonFilter from '../../../components/statistics/ButtonFilter';

import fontsize from '../../../theme/fontsize';
import Icon from 'react-native-vector-icons/Entypo'
import {
    onFilter
} from '../../../actions/request'
class GroupStatisticsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typeTime: 1,
            departmentSelected: null,
            showModalPicker: false,
            countRequest: 0,
            selectedButton: 1,
            startDate: moment().add(-7, 'days').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            isShowPopupCustomDate: false,
            isDateTimePickerVisible: false,
            txtStartDate: moment().format('YYYY-MM-DD'),
            txtEndDate: moment().add(1, 'days').format('YYYY-MM-DD'),
            isStartDate: true,

            showPopupLineDetail: false,
            showPopupStackDetail: false,
            showPopupBarDetail: false
        };
    }
    componentDidMount() {
        this.props.getDepartment({ towerId: this.props.towerId });
        this.props.getBlock({ towerId: this.props.towerId });
        this.loadDataHandle()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing) {
            this.loadDataHandle()
        }

    }
    componentWillUnmount() {
        this.props.resetData({ key: 'state' });
    }
    renderDataLine() {
        const { data, isLoading } = this.props;

        if (isLoading) {
            return <ActivityIndicator color='red' />
        }
        if (data) {
            const dataLine = data.filter(o => o.typeId == 1)

            if (dataLine.length == 0) {
                return <TouchableOpacity onPress={() => { this.initDataLine() }}>
                    <Text style={{ textAlign: 'center', fontSize: fontsize.small, padding: 10 }}>Không có dữ liệu</Text>
                </TouchableOpacity>
            } else {
                return <AxisLineChartScreen
                    dataX={this.getDataLineX(dataLine)}
                    dataY={this.getDataLineY(dataLine)}
                    dataS={dataLine} />
            }
        } else {
            return (
                <TouchableOpacity
                    onPress={() => { this.props.refreshDataHandle() }}
                >
                    <Text style={{ textAlign: 'center', fontSize: fontsize.small, padding: 10 }}>Có lỗi xảy ra</Text>
                </TouchableOpacity>
            )
        }
    }
    renderDataPie() {
        const { data, isLoading } = this.props;
        if (isLoading) {
            return <ActivityIndicator color='blue' />
        }
        if (data) {
            const dataStackBar = data.filter(o => o.typeId == 2)
            if (dataStackBar.length == 0) {
                return (
                    <TouchableOpacity onPress={() => { this.props.refreshDataHandle() }}>
                        <Text style={{ textAlign: 'center', fontSize: fontsize.small, padding: 10 }}>Không có dữ liệu</Text>
                    </TouchableOpacity>
                )
            } else {
                const dataShow = dataStackBar.map(o => ({ value: o.value, label: o.name })).filter(e => e.value !== 0)
                const dataShow1 = dataStackBar.map(o => (o)).filter(e => e.value !== 0)
                return (
                    // <PieStatistics dataX={dataStackBar.map(o => ({ value: o.value, label: o.name })).filter(e => e.value !== 0)} />
                    <View>
                        <BarChart dataX={this.getDataStackBarX(dataShow)} dataY={this.getDataStackBarY(dataShow)} />
                        <FlatList
                            data={dataShow1}
                            horizontal={false}
                            numColumns={2}
                            showsHorizontalScrollIndicator={false}
                            renderItem={(item) => {
                                return (
                                    <TouchableOpacity
                                        style={{ width: '50%' }}
                                        onPress={() => { this.props.navigation.navigate('requests'); this.props.onFilter({ depSelected: { id: item.item.mapb ? item.item.mapb : 0, name: item.item.name.slice(0, item.item.name.indexOf("-")) } }) }}
                                    >
                                        <View
                                            style={{
                                                borderRadius: 45,
                                                paddingRight: 12,
                                                backgroundColor: 'orange',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: 10

                                            }}>
                                            <Icon name={"dot-single"} size={20} color='#000' />
                                            <Text style={{
                                                color: '#000',
                                                fontSize: fontsize.small,
                                            }}>{item.item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                            }
                            onEndReachedThreshold={0.5}
                        />
                    </View>
                )
            }
        } else {
            return (
                <TouchableOpacity
                    onPress={() => { this.props.refreshDataHandle() }}
                >
                    <Text style={{ textAlign: 'center', fontSize: fontsize.small, padding: 10 }}>Có lỗi xảy ra</Text>
                </TouchableOpacity>)
        }
    }
    renderDataPieStatus() {
        const { data, isLoading } = this.props;
        if (isLoading) {
            return <ActivityIndicator color='blue' />
        }
        if (data) {
            const dataStackBar = data.filter(o => o.typeId == 3)
            if (dataStackBar.length == 0) {
                return (
                    <TouchableOpacity onPress={() => { this.initDataStackBar() }}>
                        <Text style={{ textAlign: 'center', fontSize: fontsize.small, padding: 10 }}>Không có dữ liệu</Text>
                    </TouchableOpacity>
                )
            } else {
                const dataShow = dataStackBar.map(o => ({ value: o.value, label: o.name })).filter(e => e.value !== 0)
                const dataShow1 = dataStackBar.map(o => (o)).filter(e => e.value !== 0)
                return (
                    // <PieStatistics dataX={datapie} />
                    <View>
                        <BarChart dataX={this.getDataStackBarX(dataShow)} dataY={this.getDataStackBarY(dataShow)} />
                        <FlatList
                            data={dataShow1}
                            horizontal={false}
                            numColumns={2}
                            showsHorizontalScrollIndicator={false}
                            renderItem={(item) => {
                                return (
                                    <TouchableOpacity
                                        style={{ width: '50%' }}
                                        onPress={() => { this.props.navigation.navigate('requests', { idStatus: item.item.matt }) }}
                                    >
                                        <View
                                            style={{
                                                borderRadius: 45,
                                                paddingRight: 12,
                                                backgroundColor: 'orange',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: 10

                                            }}>
                                            <Icon name={"dot-single"} size={20} color='#000' />
                                            <Text style={{
                                                color: '#000',
                                                fontSize: fontsize.small,
                                            }}>{item.item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                            }
                            onEndReachedThreshold={0.5}
                        />
                    </View>
                )
            }
        } else {
            return (
                <TouchableOpacity
                    onPress={() => { this.props.refreshDataHandle() }}
                >
                    <Text style={{ textAlign: 'center', fontSize: fontsize.small, padding: 10 }}>Có lỗi xảy ra</Text>
                </TouchableOpacity>)
        }
    }
    renderContent() {
        const { typeTime } = this.state;
        const { data, isLoading, error, initComponent } = this.props;

        if (initComponent || isLoading) {
            return (
                <View
                    style={{
                        paddingVertical: 20,
                    }}
                >
                    <ActivityIndicator animating size="small" />
                </View>
            )
        } else if (error && error.hasError) {
            return (
                <TouchableOpacity
                    onPress={() => { this.props.refreshDataHandle() }}
                >
                    <Text style={{ textAlign: 'center', fontSize: fontsize.small, padding: 10 }}>Có lỗi xảy ra</Text>
                </TouchableOpacity>)
        } else if (data) {
            const emptyData = data.filter(o => o.typeId == 0)[0].value == 0

            if (emptyData) {
                return (
                    <TouchableOpacity onPress={() => { this.props.refreshDataHandle() }}>
                        <Text style={{ textAlign: 'center', fontSize: fontsize.small, padding: 10 }}>Không có dữ liệu</Text>
                    </TouchableOpacity>
                )
            } else {
                return (
                    <ScrollView style={{ flex: 1, marginTop: 10 }}>

                        <View style={{ backgroundColor: '#fff', margin: 10, borderRadius: 12, paddingBottom: 10 }}>
                            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{
                                    fontFamily: "Inter-SemiBold",
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: "#282828"
                                }}>Thời gian</Text>
                            </View>
                            {this.renderDataLine()}
                        </View>

                        <View style={{ backgroundColor: '#fff', margin: 10, borderRadius: 12 }}>
                            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{
                                    fontFamily: "Inter-SemiBold",
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: "#282828", paddingRight: 10
                                }}>Nhân viên</Text>
                            </View>
                            {this.renderDataPie()}
                        </View>

                        <View style={{ backgroundColor: '#fff', margin: 10, borderRadius: 12 }}>
                            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{
                                    fontFamily: "Inter-SemiBold",
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: "#282828", paddingRight: 10
                                }}>Trạng thái</Text>
                            </View>
                            {this.renderDataPieStatus()}
                        </View>


                    </ScrollView >)
            }

        }
    }
    render() {
        const {
            typeTime,
            selectedButton,
            departmentSelected
        } = this.state;
        let count = 0;
        if (this.props.data) {
            const arr = this.props.data.filter(o => o.typeId == 0)
            count = arr[0] ? arr[0].value : 0
        }
        return (
            <View style={{ backgroundColor: '#eeeeee', flex: 1, marginBottom: 10 }}>

                <NavBar
                    leftButton={<TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={() => this.props.navigation.goBack(null)}
                    >
                        <MyIcon
                            name="arrow"
                            size={20}
                            color="#fff"
                        />
                    </TouchableOpacity>}
                    body={<Text style={{
                        fontFamily: "Inter-Bold",
                        fontSize: 18,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#ffffff"
                    }}>Thống kê phòng ban</Text>}
                    rightView={<TouchableOpacity
                        style={{ padding: 10 }}
                    >
                        <MyIcon
                            name="arrow"
                            size={20}
                            color={colors.appTheme}
                        />
                    </TouchableOpacity>}
                />
                <View style={{ flex: 1 }}>
                    <View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{
                                backgroundColor: '#fff',
                                borderBottomWidth: 1,
                                borderBottomColor: colors.grayBorder,
                                paddingVertical: 10,
                                borderTopRightRadius: 40,
                                marginTop: -10
                            }}
                        >
                            <ButtonFilter value={selectedButton == 1} text="1 Tuần" onPress={() => this.setActive(1)} />
                            <ButtonFilter value={selectedButton == 2} text="1 Tháng" onPress={() => this.setActive(2)} />
                            <ButtonFilter value={selectedButton == 3} text="3 Tháng" onPress={() => this.setActive(3)} />
                            <ButtonFilter value={selectedButton == 4} text="6 Tháng" onPress={() => this.setActive(4)} />
                            <ButtonFilter value={selectedButton == 5} text="Tuỳ chỉnh" onPress={() => this.setActive(5)} />
                        </ScrollView>
                    </View>
                    <View style={{ backgroundColor: '#fff' }}>
                        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                            <FilterType value={departmentSelected ? departmentSelected.name : 'Chọn phòng ban'} onPress={() => this.setState({ showModalPicker: true })} />
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={{ color: '#0084ff', fontSize: fontsize.larg, paddingHorizontal: 10 }}>{count}</Text>
                            </View>


                        </View>
                        <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: fontsize.small }}>Từ <Text style={{ color: '#0084ff', fontSize: fontsize.small }}>{moment(this.state.startDate).format('DD-MM-YYYY')}</Text> đến <Text style={{ color: '#0084ff', fontSize: fontsize.small }}>{moment(this.state.endDate).format('DD-MM-YYYY')}</Text></Text>
                    </View>
                    {this.renderContent()}
                    {this.props.departmentData &&
                        <ModalPicker
                            dislayValue="name"
                            visible={this.state.showModalPicker}
                            selectedValue={0}
                            onValueChange={(departmentSelected) => this.setState({ showModalPicker: false, departmentSelected }, () => { this.props.refreshDataHandle() })}
                            data={this.props.departmentData}
                            onClose={() => this.setState({ showModalPicker: false })}
                        />
                    }
                </View>
                <Modal
                    transparent={true}
                    visible={this.state.isShowPopupCustomDate}
                    onRequestClose={() => null}
                >
                    <View style={{ flex: 1, backgroundColor: colors.appOverView, justifyContent: 'center' }}>
                        <View style={{ backgroundColor: 'white', paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0, marginHorizontal: 15, borderRadius: 5, flexDirection: 'column' }} >
                            <View style={{ padding: 12, height: 160 }}>
                                <Text style={{ textAlign: 'center', fontSize: fontsize.small, color: '#2979ff' }} >Tuỳ chỉnh Thời gian</Text>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 0 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

                                        {/* <Image source={Icons.calendar} style={{ height: 30, width: 30, marginRight: 5 }} /> */}
                                        <TouchableOpacity onPress={() => this._showDateTimePicker(true)} bordered dark style={{ borderRadius: 0, flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 5 }}>
                                            <Text style={{ fontSize: fontsize.small, color: '#111' }}>{moment(this.state.txtStartDate).format('DD/MM/YYYY')}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => this._showDateTimePicker(false)} bordered dark style={{ borderRadius: 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: fontsize.small, color: '#111' }}>{moment(this.state.txtEndDate).format('DD/MM/YYYY')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {/* <View><Text style={{margin:5,flex:0.3}}>-</Text></View> */}

                                </View>
                                <View style={{ padding: 5 }}>
                                    <PrimaryButton text="OK" style={{ padding: 10 }}
                                        onPress={this.customTime}
                                    />
                                </View>
                            </View>


                            <TouchableOpacity
                                onPress={() => this.setState({ isShowPopupCustomDate: false })}
                                style={{ borderColor: colors.grayBorder, borderTopWidth: 1, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: colors.appTheme, fontSize: fontsize.small }}>ĐÓNG</Text>
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
    loadDataHandle() {
        const { getGeneralReport, towerId } = this.props;
        const { startDate, endDate, typeTime, departmentSelected } = this.state;
        getGeneralReport({
            towerId,
            dateFrom: startDate,
            dateTo: endDate,
            typeTime,
            departmentId: departmentSelected ? departmentSelected.id : 0

        });
    }
    setActive(id) {
        let option = null
        switch (id) {
            case 1: {
                option = {
                    selectedButton: id,
                    endDate: moment().format('YYYY-MM-DD'),
                    startDate: moment().add(-7, 'days').format('YYYY-MM-DD')
                }
                break;
            }
            case 2: {
                option = {
                    selectedButton: id,
                    endDate: moment().format('YYYY-MM-DD'),
                    startDate: moment().add(-1, 'months').format('YYYY-MM-DD')
                }
                break;
            }
            case 3: {
                option = {
                    selectedButton: id,
                    endDate: moment().format('YYYY-MM-DD'),
                    startDate: moment().add(-3, 'months').format('YYYY-MM-DD')
                }
                break;
            }
            case 4: {
                option = {
                    selectedButton: id,
                    endDate: moment().format('YYYY-MM-DD'),
                    startDate: moment().add(-6, 'months').format('YYYY-MM-DD')
                }
                break;
            }
            case 5: {
                option = {
                    selectedButton: id,
                    isShowPopupCustomDate: true
                }
                break;
            }
        }
        return this.setState(option, () => {
            if (id !== 5) {
                this.props.refreshDataHandle()
            }

        })
    }
    getDataLineX = (data) => {
        const xArray = [];
        data.map(a => { xArray.push(a.name) });
        return xArray;
    }
    getDataLineY(data) {
        const yArray = [];
        data.map(function (b) { yArray.push(b.value) });
        return yArray;

    }
    getDataStackBarX(data) {
        return data.map(o => o.label)
    }
    getDataStackBarY(data) {
        return data.map(a => ({ y: a.value }))
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
            this.props.refreshDataHandle()
        })
    }


};

const styles = {
    buttonPadding: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    colorStyle: {

        backgroundColor: '#0084ff',

    },
    colorStyleButton: {
        height: 35,
        backgroundColor: '#0084ff',

    },
    itemStyle: {
        borderBottomWidth: 0,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 5,

    },
    itemStyleInput: {
        paddingRight: 15,
        borderBottomWidth: 0,
        paddingBottom: 5,

    },
    itemStyleButton: {
        borderBottomWidth: 0,
        paddingRight: 15,
        paddingTop: 25,


    },
    itemStyle2: {
        fontStyle: 'italic',
        padding: 5,
        borderWidth: 1,
        borderColor: '#c9c9c9',
        borderRadius: 5,
        fontSize: 15
    },
    viewFontStyle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    titleStyle: {
        alignSelf: 'center'
    },
    labelRighttStyle: {
        marginRight: 15
    },
    roundedTextBox: {
        marginTop: 5,
        marginRight: 10,
        marginLeft: 10
    },
    button: {
        fontSize: 14,
        height: 15,
        marginRight: 10,

    },
    textTitle: {
        fontSize: 17,
        color: 'white'
    }

};


const mapStateToProps = (state) => ({
    data: state.reportGeneral.data,
    isLoading: state.reportGeneral.isLoading,
    isRefreshing: state.reportGeneral.isRefreshing,
    error: state.reportGeneral.error,
    initComponent: state.reportGeneral.initComponent,
    towerId: state.auth.user.towerId,
    departmentData: state.statistics.listDepartment

})

const mapActionToProps = {
    getEmployeeByDepartment,
    getDepartment,
    resetData,
    refreshDataHandle,
    getGeneralReport,
    getBlock,
    onFilter
}
export default connect(mapStateToProps, mapActionToProps)(GroupStatisticsScreen);
