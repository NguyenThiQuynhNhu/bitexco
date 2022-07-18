import React, { Component } from 'react';
import { View, Text, TextInput, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import NavBar from '../../components/common/NavBar';
import { MyIcon } from '../../theme/icons';
import Toast, { DURATION } from 'react-native-easy-toast';

import IconButton from '../../components/common/IconButton';
import { titleStyle } from '../../theme/styles';
import Lookup from '../../components/Request/RequestCreate/Lookup';
import RadioButton from '../../components/common/Radio';
import PrimaryButton from '../../components/common/PrimaryButton';
import ImageProgress from '../../components/common/ImageProgress';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import moment from 'moment';
import colors from '../../theme/colors';
import {
    SheduleTimeInsert
} from '../../actions/shifts';
import Strings from '../../utils/languages';
import shifts from '.';
import { Screen } from '../../utils/device'
import fontsize from '../../theme/fontsize';
class ChangeShiftScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            changeType: 20,
            shiftSelected: null,
            dienGiai: '',
            depSelected: null,
            employeeSelected: null,
            itemSelected: props.navigation.state.params.itemSelected
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error && nextProps.error !== this.props.error) {
            if (!nextProps.error.hasError) {
                this.props.navigation.goBack();
            } else {
                this.refs.toast.show('Xảy ra lỗi', DURATION.LENGTH_LONG);
            }
        }
    }

    render() {
        const { depSelected, employeeSelected, changeType, shiftSelected, itemSelected } = this.state

        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <NavBar
                    leftButton={<IconButton icon="arrow" size={20} color="#fff" onPress={() => { this.props.navigation.goBack() }} />}
                    body={<Text style={titleStyle}>Đề xuất đổi ca</Text>}
                    rightView={<TouchableOpacity
                        style={{ padding: 10 }}
                    >
                        <MyIcon
                            name="arrow"
                            size={22}
                            color={colors.appTheme}
                        />
                    </TouchableOpacity>}
                />
                <KeyboardAwareScrollView style={{ flex: 1, padding: 10, marginTop: -10 }}>
                    {/* <Lookup
                        fielName={`NGƯỜI ĐỀ XUẤT`}
                        text={this.props.user.fullName}
                    // onPress={() => this.props.navigation.navigate('depDictionary', { onSelected: (depSelected) => { this.setState({ depSelected }) } })}
                    />
                    <Lookup
                        fielName={`CA HIỆN TẠI`}
                        text={this.props.user.fullName}
                    // onPress={() => this.props.navigation.navigate('depDictionary', { onSelected: (depSelected) => { this.setState({ depSelected }) } })}
                    /> */}
                    <View style={{
                        backgroundColor: '#fff',
                        shadowColor: "rgba(0, 0, 0, 0.08)",
                        elevation: 2,
                        shadowOffset: {
                            width: 0,
                            height: 4
                        },
                        shadowRadius: 12,
                        shadowOpacity: 1,
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: colors.white, borderRadius: 5, marginHorizontal: 10, marginBottom: 20
                    }}>
                        <RadioButton value={this.state.changeType === 20} onPress={() => this.setState({ changeType: 20 })}>
                            <Text style={{ marginLeft: 10, color: (this.state.changeType === 20 ? colors.appTheme : 'black'), fontFamily: 'Inter-Bold', fontSize: fontsize.medium, fontWeight: 'bold' }}>Đổi ca</Text>
                        </RadioButton>
                        <RadioButton value={this.state.changeType === 10} onPress={() => this.setState({ changeType: 10, shiftSelected: null })}>
                            <Text style={{ marginLeft: 10, color: (this.state.changeType === 10 ? colors.appTheme : 'black'), fontFamily: 'Inter-Bold', fontSize: fontsize.medium, fontWeight: 'bold' }}>Làm thay ca</Text>
                        </RadioButton>

                    </View>
                    <View style={{
                        backgroundColor: colors.white, borderRadius: 5, padding: 10, marginHorizontal: 10,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                        shadowColor: "rgba(0, 0, 0, 0.08)",
                        elevation: 2,
                        shadowOffset: {
                            width: 0,
                            height: 4
                        },
                        shadowRadius: 12,
                        shadowOpacity: 1,
                    }}>
                        <Text style={{ color: colors.appTheme, fontWeight: 'bold', fontFamily: 'Inter-Bold', fontSize: fontsize.medium }}>Người đổi</Text>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <View
                                style={{
                                    flex: 1,
                                    padding: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <ImageProgress
                                    circle={true}
                                    style={{
                                        height: 60,
                                        width: 60
                                    }}

                                    source={{ uri: itemSelected.employeeImageUrl }}
                                />
                                <View style={{ flex: 1, justifyContent: 'space-between', marginLeft: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{fontWeight: 'bold', fontFamily: 'Inter-Bold', fontSize: fontsize.small}}>{itemSelected.employeeFullName}</Text>
                                            <Text style={{fontSize: fontsize.small, fontFamily: "Inter-Regular"}}>{itemSelected.phone}</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{fontSize: fontsize.small, fontFamily: "Inter-Regular"}}>{itemSelected.name}</Text>
                                                <Text style={{ fontStyle: 'italic' }}>{moment(itemSelected.date).format('DD/MM/YYYY')}</Text>
                                            </View>
                                        </View>
                                        <View style={{ borderRadius: 45, height: 22, width: 22, backgroundColor: colors.appBackround, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'rgb(0 ,173, 239)' }} numberOfLines={2} lineBreakMode="tail">{itemSelected.code}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {changeType == 10 ? <View style={{
                        backgroundColor: colors.white, borderRadius: 5, padding: 10, marginTop: 10, marginBottom: 10, borderRadius: 5,
                        backgroundColor: '#fff',
                        shadowColor: "rgba(0, 0, 0, 0.08)",
                        elevation: 2,
                        shadowOffset: {
                            width: 0,
                            height: 4
                        },
                        shadowRadius: 12,
                        shadowOpacity: 1,
                        marginHorizontal: 10
                    }}>
                        <Text style={{ color: colors.appTheme, marginTop: 10, fontWeight: 'bold', fontFamily: 'Inter-Bold', fontSize: fontsize.medium, marginBottom: 10 }}>Người nhận</Text>
                        <Lookup
                            fielName={`Phòng ban (*)`}
                            colorText='black'
                            text={depSelected ? depSelected.name : Strings.createRequest.placeholderDepartment}
                            onPress={() => this.props.navigation.navigate('depDictionary', { onSelected: (depSelected) => { this.setState({ depSelected }) } })}
                        />
                        <Lookup

                            visible={depSelected !== null}
                            borderBottom={false}
                            colorText='black'
                            fielName={`Nhân viên (*)`}
                            text={employeeSelected ? employeeSelected.name : Strings.createRequest.placeholderEmployee}
                            onPress={() => this.props.navigation.navigate('empDictionary', { date: itemSelected.date, api: '/Vendors/ShiftShiftStaff', departmentId: depSelected.id, employeeId: itemSelected.employeeId, onSelected: (employeeSelected) => { this.setState({ employeeSelected }) } })}
                        />
                    </View> :
                        shiftSelected ?
                            <TouchableOpacity
                                style={{
                                    //borderTopWidth: 1,
                                    borderBottomWidth: 1,
                                    borderTopColor: colors.grayBorder,
                                    borderBottomColor: colors.grayBorder,
                                    marginVertical: 10,
                                    paddingTop: 10,
                                    backgroundColor: colors.white,
                                    borderRadius: 5,
                                    padding: 10,
                                    borderRadius: 5,
                                    backgroundColor: '#fff',
                                    shadowColor: "rgba(0, 0, 0, 0.08)",
                                    elevation: 2,
                                    shadowOffset: {
                                        width: 0,
                                        height: 4
                                    },
                                    shadowRadius: 12,
                                    shadowOpacity: 1,
                                    marginHorizontal: 10
                                }}
                                onPress={() => this.props.navigation.navigate('shiftChoice', { itemSelected, onSelected: (shiftSelected) => { this.setState({ shiftSelected }) } })}
                            >
                                <Text style={{ color: colors.appTheme, fontWeight: 'bold', fontFamily: 'Inter-Bold', fontSize: fontsize.medium }}>Người nhận</Text>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                    <View
                                        style={{
                                            flex: 1,
                                            padding: 10,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <ImageProgress
                                            circle={true}
                                            style={{
                                                height: 60,
                                                width: 60
                                            }}

                                            source={{ uri: shiftSelected.employeeImageUrl }}
                                        />
                                        <View style={{ flex: 1, justifyContent: 'space-between', marginLeft: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{fontSize: fontsize.small, fontWeight: 'bold', fontFamily: "Inter-Bold"}}>{shiftSelected.employeeFullName}</Text>
                                                    <Text style={{fontSize: fontsize.small, fontFamily: "Inter-Regular"}}>{shiftSelected.phone}</Text>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Text style={{fontSize: fontsize.small, fontFamily: "Inter-Regular"}}>{shiftSelected.name}</Text>
                                                        <Text style={{ fontStyle: 'italic' }}>{moment(shiftSelected.date).format('DD/MM/YYYY')}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ borderRadius: 45, height: 22, width: 22, backgroundColor: colors.appBackround, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ color: 'rgb(0 ,173, 239)' }} numberOfLines={2} lineBreakMode="tail">{shiftSelected.code}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    {/* <MyIcon
                                        size={20}
                                        color={"#C0C0C0"}
                                        name="arrow-right" /> */}
                                </View>
                            </TouchableOpacity> : <View style={{
                                backgroundColor: colors.blue, borderRadius: 5, marginTop: 10, paddingHorizontal: 10, marginBottom: 10,
                                borderRadius: 5,
                                backgroundColor: '#fff',
                                shadowColor: "rgba(0, 0, 0, 0.08)",
                                elevation: 2,
                                shadowOffset: {
                                    width: 0,
                                    height: 4
                                },
                                shadowRadius: 12,
                                shadowOpacity: 1, marginHorizontal: 10,
                                paddingTop: 20
                            }}><Lookup
                                    fielName={`Người nhận(*)`}
                                    text={Strings.createRequest.placeholderEmployee}
                                    colorText='black'
                                    borderBottom={false}
                                    onPress={() => this.props.navigation.navigate('shiftChoice', { itemSelected, onSelected: (shiftSelected) => { this.setState({ shiftSelected }) } })}
                                />
                            </View>
                    }
                    <TextInput
                        underline={false}
                        multiline
                        underlineColorAndroid='transparent'
                        style={{
                            padding: 5,
                            backgroundColor: '#fff',
                            width: Screen.width - 40,
                            borderWidth: 0.5,
                            borderColor: colors.grayBorder,
                            borderRadius: 5,
                            height: 100,
                            textAlignVertical: Platform.OS === 'ios' ? 'auto' : 'top',
                            alignContent: 'flex-start',
                            alignSelf: 'flex-start',
                            marginHorizontal: 10,
                            marginTop: 10,
                            fontFamily: "Inter-Regular"
                        }}
                        placeholder="Ghi chú..."
                        placeholderTextColor="#9e9e9e"
                        value={this.state.dienGiai}
                        onChangeText={(dienGiai) => { this.setState({ dienGiai }) }}
                    />
                    <View style={{ margin: 10 }}>
                        <PrimaryButton visible={this.checkValidate()} text="Lưu" style={{ width: '100%', height: 50, }}
                            onPress={this.OnSheduleTimeInsert}
                        />
                    </View>
                    {this.checkValidateEmployee() ? null : (<View>
                        <Text style={{ color: colors.red, fontFamily: "Inter-Regular", marginLeft: 10 }}>Lưu ý: Hai nhân viên đổi ca phải khác nhau. Vui lòng kiểm tra lại, xin cảm ơn.</Text>
                    </View>)
                    }
                    {shiftSelected && (shiftSelected.date != itemSelected.date) ?
                        (<View>
                            <Text style={{ color: colors.red, fontFamily: "Inter-Regular", marginLeft: 10 }}>Lưu ý: Hai ca phải cùng một ngày. Vui lòng kiểm tra lại, xin cảm ơn.</Text>
                        </View>) : null
                    }
                </KeyboardAwareScrollView>
                <Toast ref="toast" style={{ backgroundColor: colors.toast.warning, opacity: 1, borderRadius: 5, padding: 10 }} />
            </View>
        );
    }

    checkValidate = () => {
        const { employeeSelected, changeType, shiftSelected, itemSelected } = this.state
        if (changeType === 10) {
            if (!employeeSelected) {
                return false
            }
        } else {
            if (!shiftSelected) {
                return false
            }
        }
        if (shiftSelected && (shiftSelected.date != itemSelected.date)) {
            return false
        }

        const employeeId = changeType === 10 ? employeeSelected.id : shiftSelected.employeeId;
        if (itemSelected.employeeId === employeeId) {
            return false;
        }

        return true
    }

    checkValidateEmployee = () => {
        const { employeeSelected, changeType, shiftSelected, itemSelected } = this.state

        const employeeId = changeType === 10 ? (employeeSelected !== null ? employeeSelected.id : 0) : (shiftSelected != null ? shiftSelected.employeeId : 0);

        if (itemSelected.employeeId === employeeId) {
            return false;
        }

        return true
    }

    OnSheduleTimeInsert = () => {
        const { dienGiai, changeType, employeeSelected, itemSelected, shiftSelected } = this.state
        const employeeId = changeType === 10 ? employeeSelected.id : shiftSelected.employeeId;
        const { towerId } = this.props;

        const dataRequest = {
            idDoiCa1: itemSelected.id,// Id của ca đang chọn 
            idPhanLoaiCaCu1: itemSelected.typeId,//TypeId của ca đang chọn ,
            idPhanLoaiCaMoi1: 0,
            manV1: itemSelected.employeeId, //EmployeeId của ca đang chọn 
            maLoai: changeType,//10: làm thay ca, 20: đổi ca giữa 2 nhân viên; = 10 chỉ cho chọn nhân viên; = 20 cho chọn ca trực theo ngày ,
            manV2: employeeId,//EmployeeId của ca muốn đổi ,
            idDoiCa2: shiftSelected ? shiftSelected.id : 0,//Id của ca muốn đổi ,
            idPhanLoaiCaCu2: shiftSelected ? shiftSelected.typeId : 0,//TypeId của ca muốn đổi ,
            idPhanLoaiCaMoi2: 0,
            dienGiai,
            matn: towerId
        }

        this.props.SheduleTimeInsert(dataRequest)
    }
}


const mapStateToProps = (state) => ({
    user: state.auth.user,
    towerId: state.auth.user.towerId,
    error: state.shifts.errorCreate
});

const mapActionToState = {
    SheduleTimeInsert
};
export default connect(mapStateToProps, mapActionToState)(ChangeShiftScreen)

