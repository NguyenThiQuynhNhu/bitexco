//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MyIcon } from '../../theme/icons';
import FontSize from '../../theme/fontsize';
import Color from '../../theme/colors';
import colors from '../../theme/colors';
import responsive from "../../resources/responsive";
// create a component
const ErrorContent = (props) => {
    const { onTouchScreen, onPressButton, buttonText = 'Thử lại', logo, contentText, visibleButton = false, title } = props;
    return (
        <TouchableOpacity
            style={{ flex: 1 }}
            onPress={onTouchScreen}
        >
            <View
                style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    {/* <MyIcon name={"layers"} size={80} color={colors.grayBorder} /> */}
                    <Image source={require('../../resources/empty-box.png')} style={{ width: responsive.h(80), height: responsive.h(80) }} />
                    <Text style={{
                        fontFamily: "OpenSans-Regular",
                        fontSize: responsive.h(14),
                        fontWeight: "normal",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: "#cccccc", textAlign: 'center', marginHorizontal: responsive.h(20)
                    }}>{title}</Text>
                    {visibleButton ?
                        <TouchableOpacity
                            style={{
                                backgroundColor: Color.appTheme,
                                margin: responsive.h(10),
                                padding: responsive.h(10),
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={onPressButton}
                        >
                            <Text style={{ color: 'white', fontSize: responsive.h(14) }}>{buttonText}</Text>
                        </TouchableOpacity> : null}
                </View>
            </View>
            {/* <View style={{ flexDirection: 'row', alignSelf: 'center', marginBottom: 50 }}>
       
                <Text style={{ color: '#cccccc', marginLeft: 10 }}>{contentText}</Text>
            </View > */}

        </TouchableOpacity >
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
export default ErrorContent;
