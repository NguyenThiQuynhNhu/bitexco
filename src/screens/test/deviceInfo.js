//import liraries
import React, { Component } from 'react';
import {
    Alert,
    View,
    Text,
    StyleSheet,
    TextInput,
    ImageBackground,
    Image,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity
} from 'react-native';

const Devices = require('react-native-device-detection');

import NavBar from '../../components/common/NavBar';
import { MyIcon } from '../../theme/icons';

// create a component
class DeviceInfoScreen extends Component {
    static navigationOptions = {
        header: null,
    }
    constructor(props) {
        super(props)
        this.state = {
            phoneNumber: '',
            otpCode: ''
        }
    }
    
    render() {
        const leftButton = (
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => this.props.navigation.goBack(null)}
            >
                <MyIcon
                    name="arrow"
                    size={22}
                    color="#fff"
                />
            </TouchableOpacity>
        )

        return (
            
            <ScrollView >
                <NavBar
                    leftButton={leftButton}
                    body={<Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', alignSelf: 'center' }}>Test Device</Text>}
                    rightView={ null} />

                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        marginTop: 150
                    }}
                >
                    <Text style={{ marginBottom: 10 }}>pixelDensity: { Devices.pixelDensity }</Text>
                    <Text style={{ marginBottom: 10 }}>width: { Devices.width }</Text>
                    <Text style={{ marginBottom: 10 }}>width: { Devices.height }</Text>
                    <Text style={{ marginBottom: 10 }}>adjustedWidth: { Devices.adjustedWidth }</Text>
                    <Text style={{ marginBottom: 10 }}>adjustedHeight: { Devices.adjustedHeight }</Text>
                    <Text style={{ marginBottom: 10 }}>isTablet: { Devices.isTablet === true ? 'true' : 'false' }</Text>
                </View>
            </ScrollView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#fff'
    },
});

//make this component available to the app
export default DeviceInfoScreen;
