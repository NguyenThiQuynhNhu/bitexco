//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import fontSize from '../../../theme/fontsize';
import { MyIcon } from '../../../theme/icons';
import { converStatusToColor, converStatusToString } from '../../../utils/request';
import ImageProgress from '../../common/ImageProgress';
import { myFromNow } from '../../../utils/request';
import colors from '../../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// create a component
class ListItem extends PureComponent {
    render() {
        const { item, onPress } = this.props;
        const {
            id,
            status,
            statusId,
            dateCreate,
            typeId,
            employeeName,
            employeeAvatarUrl,
            employeeName1,
            employeeName2,
            ca1,
            ca2,
            isReplace
        } = item;

        //console.log(item);
        return (

            <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={onPress}
            >
                <View
                    style={{
                        flex: 1,
                        padding: 10,
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

                        source={{ uri: employeeAvatarUrl }}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between', marginLeft: 10 }}>
                        <Text style={{ marginVertical: 5, fontWeight: 'bold' }} numberOfLines={2} lineBreakMode="tail">{employeeName.toLocaleUpperCase()}</Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text numberOfLines={2} lineBreakMode="tail">{moment(dateCreate).format('DD/MM/YYYY HH:mm')}</Text>
                            <Text style={{ marginVertical: 5, color: colors.appTheme }} numberOfLines={1}>{status}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.gray2, padding: 5 }}>
                            <View style={{ width: '45%' }}>
                                <Text style={{ textAlign: 'right' }}>{employeeName2.toLocaleUpperCase()}</Text>
                                { isReplace === true ? <Text style={{ fontWeight: '300', textAlign: 'right' }}>Làm thay</Text> : <Text style={{ fontWeight: '300', textAlign: 'right' }}>Ca {ca2 !== null ? ca2 : ''}</Text>}
                            </View>
                            <View style={{ width: '5%', alignContent:'center', alignItems: 'center', margin: 10 }}>
                            { isReplace === true ? <Icon name='autorenew' size={15} color={colors.appTheme} /> : <Icon name='chevron-right' size={15} color={colors.appTheme} /> }
                            </View>
                            <View style={{ width: '50%' }}>
                                <Text numberOfLines={2} lineBreakMode="tail" style={{  }}>{employeeName1.toLocaleUpperCase()}</Text>
                                <Text style={{ fontWeight: '300' }}>Ca {ca1 !== null ? ca1 : ''}</Text>
                            </View>
                        </View>
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
