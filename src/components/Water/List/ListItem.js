//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import fontSize from '../../../theme/fontsize';
import { MyIcon } from '../../../theme/icons';
import ImageProgress from '../../common/ImageProgress';
import { myFromNow } from '../../../utils/request';
import colors from '../../../theme/colors';
import responsive from "../../../resources/responsive";
// create a component
class ListItem extends PureComponent {
    render() {
        const { item, onPress, onLongPress } = this.props;
        const {
            id,
            code,
            code2,
            customerName,
            customerId,
            indexOld,
            indexNew,
            indexUse,
            amount,
            dateFrom,
            dateTo,
            employeeId,
            employeeName,
            dateCreate,
            dateNotify,
            indexId,
            peoplePromotion,
            m3PerPeople,
            rateFeeEnviroment,
            rateFeeVAT
        } = item;

        //console.log(item);
        return (

            <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={onPress}
                onLongPress={onLongPress}
            >
                <View
                    style={{
                        flex: 1,
                        padding: responsive.h(10),
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#fff'
                    }}
                >

                    <View style={{ flex: 1, justifyContent: 'space-between', marginLeft: responsive.h(10) }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{
                                fontFamily: "Inter-SemiBold",
                                fontSize: responsive.h(16),
                                fontWeight: "600",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                textAlign: "left",
                                color: "#282828"
                            }} numberOfLines={2}>{code}</Text>

                            {indexId > 0 ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{
                                    marginVertical: responsive.h(5), fontFamily: "Inter-SemiBold",
                                    fontSize: responsive.h(16),
                                    fontWeight: "600",
                                    fontStyle: "normal",
                                    letterSpacing: 0,
                                    textAlign: "right",
                                    color: "#ff624d"
                                }} numberOfLines={1}>{amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
                                <Text style={{
                                    marginVertical: responsive.h(5), fontFamily: "Inter-Regular",
                                    fontSize: responsive.h(13),
                                    letterSpacing: 0,
                                    textAlign: "right",
                                    color: "#6f6f6f",
                                    marginLeft: 5
                                }} numberOfLines={1}>VNĐ</Text>
                            </View> : null}
                        </View>

                        {indexId > 0 ?
                            <View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{
                                        marginVertical: responsive.h(5), fontFamily: "Inter-Medium",
                                        fontSize: responsive.h(12),
                                        fontWeight: "500",
                                        fontStyle: "normal",
                                        letterSpacing: 0,
                                        textAlign: "left",
                                        color: "#626262"
                                    }} numberOfLines={1}>CS cũ: <Text style={{ marginVertical: responsive.h(5), fontFamily: "Inter-Medium",
                                    fontSize: responsive.h(12),
                                    fontWeight: "500",
                                    fontStyle: "normal",
                                    letterSpacing: 0,
                                    textAlign: "left",
                                    color: "#ff3d00" }} numberOfLines={1}>{indexOld}</Text></Text>

                                    <Text style={{
                                        marginVertical: responsive.h(5), fontFamily: "Inter-Medium",
                                        fontSize: responsive.h(12),
                                        fontWeight: "500",
                                        fontStyle: "normal",
                                        letterSpacing: 0,
                                        textAlign: "left",
                                        color: "#626262"
                                    }} numberOfLines={1}>CS mới: <Text style={{ marginVertical: responsive.h(5), fontFamily: "Inter-Medium",
                                    fontSize: responsive.h(12),
                                    fontWeight: "500",
                                    fontStyle: "normal",
                                    letterSpacing: 0,
                                    textAlign: "left",
                                    color: "#ff3d00" }} numberOfLines={1}>{indexNew}</Text></Text>

                                    <Text style={{
                                        marginVertical: responsive.h(5), fontFamily: "Inter-Medium",
                                        fontSize: responsive.h(12),
                                        fontWeight: "500",
                                        fontStyle: "normal",
                                        letterSpacing: 0,
                                        textAlign: "left",
                                        color: "#626262"
                                    }} numberOfLines={1}>Tiêu thụ: <Text style={{
                                        marginVertical: responsive.h(5), fontFamily: "Inter-Medium",
                                        fontSize: responsive.h(12),
                                        fontWeight: "500",
                                        fontStyle: "normal",
                                        letterSpacing: 0,
                                        textAlign: "left",
                                        color: "#ff3d00"
                                    }} numberOfLines={1}>{indexUse}</Text></Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{
                                        marginVertical: responsive.h(5), fontFamily: "Inter-Medium",
                                        fontSize: responsive.h(12),
                                        fontWeight: "500",
                                        fontStyle: "normal",
                                        letterSpacing: 0,
                                        textAlign: "left",
                                        color: "#626262"
                                    }} numberOfLines={1}>{employeeName}</Text>

                                    <Text style={{
                                        marginVertical: responsive.h(5), fontFamily: "Inter-Regular",
                                        fontSize: responsive.h(11),
                                        fontWeight: "normal",
                                        fontStyle: "normal",
                                        letterSpacing: 0,
                                        textAlign: "left",
                                        color: "#6f6f6f"
                                    }} numberOfLines={2} lineBreakMode="tail">{dateCreate === null ? "" : moment(dateCreate).format('DD/MM/YYYY HH:mm')}</Text>
                                </View>
                            </View>
                            : <View>
                                <Text style={{
                                    marginVertical: responsive.h(5), fontFamily: "Inter-Regular",
                                    fontSize: responsive.h(11),
                                    fontWeight: "normal",
                                    fontStyle: "normal",
                                    letterSpacing: 0,
                                    textAlign: "left",
                                    color: "#ff3d00"
                                }} numberOfLines={1}>Chưa ghi chỉ số</Text>
                            </View>}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default ListItem;
