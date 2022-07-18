// import liraries
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MyIcon } from '../../theme/icons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// create a component
const IconButton = ({
                        icon, onPress, color, style, size = 20, materialIcon
                    }) => (
    <TouchableOpacity onPress={onPress} style={{
        paddingHorizontal: 10,
        flex: 1,
        justifyContent: 'center'
    }}>
        {materialIcon ? <Icon
            name={materialIcon}
            size={size}
            color={color}
        /> : <MyIcon
            name={icon}
            size={size}
            color={color}
        />}
    </TouchableOpacity>
)

export default (IconButton)
