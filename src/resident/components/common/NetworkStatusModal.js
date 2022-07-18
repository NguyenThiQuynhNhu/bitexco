import React, { Component } from 'react'
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'


import colors from '../../theme/colors'
import device from '../../utils/device'

class NetworkStatusModal extends Component {

    render() {
        const { closeModal, visible, onRequestClose } = this.props

        return (
            <Modal 
                animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={() => onRequestClose()}
            >
                <View 
                    style={{
                        flex: 1,
                        ...device.defaultMarginTop()
                    }}
                >
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 30,
                        //alignItems: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'black',
                        opacity: 0.6
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: 14,
                            //paddingLeft: 10
                        }}>Không có kết nối/ Connecting failure. </Text>
                    </View>
                </View> 
            </Modal> 
        )
    }
}

export default NetworkStatusModal
