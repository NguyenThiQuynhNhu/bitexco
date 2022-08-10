//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../theme/colors'
import responsive from "../../resources/responsive";
// create a component
const PrimaryButton = ({ text, textStyle, onPress, style, visible = true }) => {

    return (
        <View pointerEvents={visible ? 'auto' : 'none'}>
            <TouchableOpacity onPress={onPress}>
                <View
                    style={{
                        borderRadius: responsive.h(20),
                        paddingVertical: responsive.h(10),
                        paddingHorizontal: responsive.h(20),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.appTheme,
                        backgroundColor: !visible ? colors.gray1 : colors.appTheme,
                        ...style
                    }}
                >
                    <Text style={{
                        fontFamily: "Inter-SemiBold",
                        fontSize: responsive.h(16),
                        fontWeight: "600",
                        color: '#fff', ...textStyle
                    }}>{text}</Text>
                </View>
            </TouchableOpacity>
        </View >
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.appTheme,
    },
    text: {
        color: '#fff'
    }
});
PrimaryButton.propTypes = {
    style: PropTypes.object
};
//make this component available to the app
export default PrimaryButton;
