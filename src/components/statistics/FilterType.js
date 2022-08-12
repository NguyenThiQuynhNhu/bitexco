//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import responsive from "../../resources/responsive";
// create a component
const FilterType = ({ onPress, value }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <TouchableOpacity
                onPress={onPress}
                style={{ paddingHorizontal: responsive.h(20), paddingVertical: responsive.h(10), borderRadius: responsive.h(45), backgroundColor: colors.grayBorder }}>
                <Text style={{fontSize:responsive.h(14) }}>{value}</Text>
            </TouchableOpacity>
        </View>
    );
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default (FilterType);
