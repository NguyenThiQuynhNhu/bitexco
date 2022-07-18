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

// create a component
class ListItem extends PureComponent {
    render() {
        const { item, onPress } = this.props;
        const {
            id,
            title,
            system,
            dateAction,
            employeeName,
            imageUrl,
            status
        } = item;
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
                            height: 80,
                            width: 80
                        }}

                        source={{ uri: imageUrl }}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between', marginLeft: 10 }}>
                        <Text style={{ fontSize: fontSize.small, fontWeight: 'bold' }} numberOfLines={2}>{title}</Text>
                        <Text style={{ marginVertical: 5 }} numberOfLines={2} lineBreakMode="tail">{system}</Text>
                        <Text style={{ marginVertical: 5 }} numberOfLines={1}>{employeeName}</Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{ color: colors.gray1 }} numberOfLines={2} lineBreakMode="tail">{moment(dateAction).format('DD/MM/YYYY HH:mm')}</Text>
                            <Text style={{ marginVertical: 5, color: colors.appTheme }} numberOfLines={1}>{status}</Text>
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
