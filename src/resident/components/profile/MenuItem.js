//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Color from '../../theme/colors';
import {MyIcon} from '../../theme/icons';

// create a component
const MenuItem = (props) => {
    const { onPress, color, icon, text } = props
    return (
        <TouchableOpacity
            style={styles.container}
            // onPress={() => this.props.navigation.navigate('schedules')}
            onPress={onPress}
        >
            <View
                style={[styles.wrapIcon, { backgroundColor: color }]}
            >
                <MyIcon
                    name={icon}
                    color="white"
                    size={20}
                />
            </View>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        paddingVertical: 10,
        marginHorizontal: 10,
        flexDirection: 'row',
        borderBottomColor: Color.grayBorder,
        borderBottomWidth: 1
    },
    wrapIcon: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    text: {
        fontSize: 18,
        color: 'rgb(41, 50, 53)',
        marginLeft: 10
    }
});

//make this component available to the app
export default MenuItem;
