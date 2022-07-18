//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

// create a component
const Badge = (props) => {
    const { number } = props
    if (number > 0) {
        return (
            <View
                style={{
                    marginLeft: 8,
                    borderRadius: 10,
                    height: 20,
                    width: 20,
                    backgroundColor: colors.blue,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text style={{ fontSize: 10, margin: 2, color: '#fff' }}>{number > 5 ? '5+' : number}</Text>
            </View>
        );
    }
    return <View />

};


//make this component available to the app
export default Badge;
