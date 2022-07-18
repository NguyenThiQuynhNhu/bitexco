// import liraries
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// create a component
const CheckBox = ({ value = false, onValueChange, visible = true }) => (
    <View pointerEvents={visible ? 'auto' : 'none'}>
        <TouchableOpacity
            onPress={onValueChange}
        >
            <Icon name={value ?"checkbox-marked-outline": "checkbox-blank-outline"} size={30} color="rgb(154, 151, 151)"/>
        </TouchableOpacity>
    </View>
)

export default (CheckBox)
