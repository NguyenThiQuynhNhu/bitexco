//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, TextInput, TouchableOpacity, Platform } from 'react-native';
import { MyIcon } from '../../theme/icons';
import colors from '../../theme/colors';
import Strings from '../../utils/languages';
import responsive from "../../resources/responsive";
// create a component
const InputNumber = (props) => {
    const { navbarOpacity, style, onChangeText, onClearText, onSubmitEditing, value, placeholder, keyboardType = 'numeric' } = props;

    return (
        <Animated.View style={[
            {
                alignItems: 'center',
                borderRadius: responsive.h(8),
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "#cbcbcb",
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: responsive.h(10)
            }, style, { opacity: navbarOpacity }]}>

            

            <TextInput
                value={value}
                onSubmitEditing={onSubmitEditing}
                onChangeText={(text) => onChangeText(text)}
                placeholderTextColor="#fff"
                placeholder={placeholder}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                autoFocus={false}
                style={{
                    flex: 1,
                    padding: 0,
                    justifyContent: 'flex-start',
                    fontFamily: "Inter-Medium",
                    fontSize: responsive.h(14),
                    fontWeight: "500",
                    textAlign: "left",
                    color: "#282828"
                }}
                keyboardType={keyboardType}
            />
            <MyIcon
                name="search"
                size={responsive.h(20)}
                color="#cbcbcb"
                style={{ margin: responsive.h(10) }}
            />
        </Animated.View>
    )
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.gray2,
    },
});

//make this component available to the app
export default InputNumber;
