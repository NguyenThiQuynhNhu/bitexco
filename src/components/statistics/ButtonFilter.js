//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import fontsize from '../../theme/fontsize';
const Devices = require('react-native-device-detection');
import { Screen } from '../../utils/device'
// create a component
const ButtonFilter = ({ value, text, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <View
                style={{
                    marginLeft: 10,
                    borderRadius: 45,
                    padding: 5,
                    paddingHorizontal: 10,
                    backgroundColor: value ? colors.appBackgroundButton : colors.gray2,
                    width: Devices.isTablet ? (Screen.width / 5) : ((Screen.width - 50) / 4),

                }}>
                <Text style={{
                    color: value ? colors.appTheme : '#8c8c8c',
                    fontSize: fontsize.small,
                    textAlign: 'center'
                }}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default (ButtonFilter);
