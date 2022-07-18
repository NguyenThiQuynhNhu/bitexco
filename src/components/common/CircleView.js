//import liraries
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import colors from '../../theme/colors'

// create a component
const CircleView = ({ children, size = 50, color = 'transparent', style }) => {
    return (
        <View style={{
            backgroundColor: color,
            width: size,
            height: size,
            ...style,
            borderRadius: size / 2,
            justifyContent: 'center',
            alignItems: 'center'
        }} >
            {children}
        </View>
    )
}

// define your styles


export default (CircleView)
