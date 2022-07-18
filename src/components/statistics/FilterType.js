//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';

// create a component
const FilterType = ({ onPress, value }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <TouchableOpacity
                onPress={onPress}
                style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 45, backgroundColor: colors.grayBorder }}>
                <Text>{value}</Text>
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
