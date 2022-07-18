//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../../theme/colors';
import fontSize from '../../../theme/fontsize';
import { converTypeToString } from '../../../utils/vendor';

// create a component
const ButtonFilter = (props) => {
    const { onSelectedChange, value, currentValue } = props
    const active = value == currentValue;
    text = converTypeToString(value);
    return (
        <TouchableOpacity
            onPress={() => onSelectedChange(value)}
        >
            <View
                style={{
                    marginLeft: 10,
                    borderRadius: 45,
                    padding: 5,
                    paddingHorizontal: 10,
                  
                    backgroundColor: active ? colors.blue : colors.gray2,

                }}>
                <Text style={{
                    color: active ? '#fff' : '#8c8c8c',
                    fontSize: fontSize.medium
                }}>{text}</Text>
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
