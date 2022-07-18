import React from 'react'
import { Text, View, Platform } from 'react-native'
import colors from '../../theme/colors'
import Device from '../../utils/device'


const NavBar1 = ({ leftButton, body, rightView, backgroundColor = '#163c84', style }) => {
    return (
        <View
            style={{
                backgroundColor,
                ...Device.defaultNavBarStyle(),
                ...style
            }}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center'
            }}>
                {body}
            </View>
            <View style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                flexDirection: 'row',
                justifyContent: 'space-between', //...Device.defaultMarginTop()
            }}>
                <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 5  }}>
                    {leftButton}
                </View>
                <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 5  }}>
                    {rightView}
                </View>
            </View>

        </View>
    )


}

export default NavBar1
