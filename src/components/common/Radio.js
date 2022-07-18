import React, { Component } from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import colors from '../../theme/colors'

export default class RadioButton extends Component {
    render() {
        const { style, value, onPress } = this.props

        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center', ...style
                }}>
                    <View style={[{
                        height: this.props.outerCircleSize || 20,
                        width: this.props.outerCircleSize || 20,
                        borderRadius: this.props.outerCircleSize / 2 || 10,
                        borderWidth: this.props.outerCircleWidth || 2,
                        borderColor: value ? colors.appTheme : this.props.outerCircleColor || colors.warm_grey,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }]}
                    >
                        {
                            this.props.value ?
                                <View style={{
                                    height: this.props.innerCircleSize || 10,
                                    width: this.props.innerCircleSize || 10,
                                    borderRadius: this.props.innerCircleSize / 2 || 5,
                                    backgroundColor: this.props.innerCircleColor || colors.appTheme
                                }}
                                />
                                : null
                        }
                    </View>
                    {this.props.children}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
