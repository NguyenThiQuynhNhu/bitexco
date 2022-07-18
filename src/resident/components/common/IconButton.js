// import liraries
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MyIcon } from '../../theme/icons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import colors from '../../theme/colors';

// create a component
const IconButton = ({
    icon, onPress, color = '#fff', size = 20, materialIcon, style
}) => (
        <TouchableOpacity onPress={onPress} style={{
            paddingHorizontal: 10,
            justifyContent: 'center',
            ...style
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