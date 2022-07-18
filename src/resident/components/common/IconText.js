import React from 'react'
import { View, Image, Text } from 'react-native'
import { MyIcon } from '../../theme/icons'

const IconText = (props) => {
    const {
        size=20,
        icon,
        text,
        color = "#fff",
        attribute,
        wrapperStyle
    } = props
    return (
        <View style={wrapperStyle}>
            <MyIcon
                name={icon}
                size={size}
                color={color}
                style={{
                    marginRight: 5
                }}
            />
            <Text
                lineBreakMode='tail'
                {...attribute}
            >
                {text}
            </Text>
        </View>
    )
}

export default IconText
