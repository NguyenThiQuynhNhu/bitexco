//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import moment, { lang } from 'moment';
import { default_image } from '../../../theme/images';
import { converStatusToColor, converStatusToString } from '../../../utils/request'
import colors from '../../../theme/colors';
import Strings from '../../../utils/languages';
import ImageProgress from '../../common/ImageProgress';
import fontsize from '../../../theme/fontsize';

// create a component
const VendorInfo = (props) => {
    const {
        residentName,
        contractName,
        dateCreate,
        statusId,
        avatarResident,
        colorCode
    } = props.data;
    return (
        <View
            style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderColor: colors.grayBorder,
                padding: 10,
                paddingBottom: 0,
                backgroundColor: '#fff'
            }}
        >
            <View style={{ alignItems: 'center' }}>
                <ImageProgress
                    circle={true}
                    style={{
                        height: 100,
                        width: 100
                    }}
                    source={{ uri: avatarResident }}
                />
                <View style={{ marginTop: 10, backgroundColor: colorCode, paddingHorizontal: 20, paddingVertical: 5 }}>
                    <Text style={{ color: '#fff' }}>{converStatusToString(statusId)}</Text>
                </View>
            </View>
            <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
                <Text style={{ fontSize: fontsize.larg, fontWeight: 'bold' }}>{residentName}</Text>
                <Text style={{ marginVertical: 5, fontWeight: 'bold' }}>MS: {contractName}</Text>
                <Text style={{ color: colors.gray1 }}>{moment(dateCreate).fromNow()}</Text>
            </View>
        </View >
    );
};

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
export default VendorInfo;
