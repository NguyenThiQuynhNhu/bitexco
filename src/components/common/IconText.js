import React from 'react'
import { View, Image, Text } from 'react-native'
import { MyIcon } from '../../theme/icons'

const IconText = ({
    size=20,
    icon,
    text,
    color = "#fff",
    attribute,
    wrapperStyle,
}) => {

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
