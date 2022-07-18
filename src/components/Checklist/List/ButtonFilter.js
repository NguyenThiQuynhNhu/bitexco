//import liraries
import React, { Component } from 'react';
import { Screen } from '../../../utils/device'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import fontSize from '../../../theme/fontsize';
import {  converStatusToString } from '../../../utils/checklist';
import colors from '../../../theme/colors';

import fontsize from '../../../theme/fontsize';

const Devices = require('react-native-device-detection');

// create a component
const ButtonFilter = (props) => {
    const { onSelectedChange, value, currentValue, textColor, style } = props
    const text = converStatusToString(value)

    return (
        <TouchableOpacity

            onPress={() => onSelectedChange(value)}
        >
            <View
                style={{
                    alignItems: 'center',
                    width: Devices.isTablet ? (Screen.width / 5) : (Screen.width / 4),
                    marginTop: 10,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    ...style
                    
                }}>
                <Text style={{
                    fontFamily: value !== currentValue ? "Inter-Regular" : "Inter-Bold",
                    fontSize: 13,
                    fontWeight: value !== currentValue ? "normal" : "bold",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "center",
                    color: value !== currentValue ? '#c8c8c8' : "#3d3d3d"
                }}>{text}</Text>
                <View style={{
                    width: Devices.isTablet ? 64 : 44,
                    height: 3,
                    borderRadius: 4,
                    backgroundColor: value !== currentValue ? '#fff' : '#a3cd80',
                    marginTop: 2.5
                }}></View>
            </View>
            
        </TouchableOpacity>
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
export default ButtonFilter;
