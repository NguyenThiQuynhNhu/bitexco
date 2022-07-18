//import liraries
import React, { Component } from 'react';
import { Screen } from '../../../utils/device'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import fontSize from '../../../theme/fontsize';
import {  converStatusToString } from '../../../utils/serviceBasic';
import colors from '../../../theme/colors';


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
                    borderColor: colors.gray2,
                    borderWidth: 0.5,
                    alignItems:'center',
                    width: Screen.width / 4,
                    paddingVertical: 20,
                    backgroundColor: value !== currentValue ? '#fff' : colors.gray2,
                    ...style
                }}>
                <Text style={{
                    // color: value == currentValue ? '#fff' : color,
                    fontSize: 10
                }}>{text.toLocaleUpperCase()}</Text>
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
