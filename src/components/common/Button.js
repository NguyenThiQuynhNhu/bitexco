//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../theme/colors'

// create a component
const Button = ({ text, textStyle, onPress, style, visible = true }) => {

    return (
        <View pointerEvents={visible ? 'auto' : 'none'}>
            <TouchableOpacity onPress={onPress}>
                <View
                    style={{
                        borderRadius: 5,
                        padding: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.appBackgroundButton,
                        backgroundColor: !visible ? colors.gray2 : colors.appBackgroundButton,
                        ...style
                    }}
                >
                    <Text style={{
                        color: !visible ? colors.gray1 : colors.appTheme, 
                        ...textStyle
                    }}>{text}</Text>
                </View>
            </TouchableOpacity>
        </View >
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.appTheme,
    },
    text: {
        color: '#fff'
    }
});
Button.propTypes = {
    style: PropTypes.object
};
//make this component available to the app
export default Button;
