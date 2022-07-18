//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ContentWebView from '../../components/common/ContentWebView';
import colors from '../../theme/colors';

// create a component
class VendorInfo extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.towerName,
        headerBackTitle: null,
        headerTintColor: colors.whiteColor,
        headerStyle: {
            elevation: 0,
            shadowOpacity: 0
        }
    })
    render() {
        const { towerId } = this.props.navigation.state.params;
        return (
            <ContentWebView
                api={'/Residents/TowerIntroduction'}
                data={{ title: '', time: '', contentName: 'contentGeneral' }}
                params={{ towerId }}
                onSuccess={() => null}
                onError={() => null}
            />
        );
    }
}

// define your styles


//make this component available to the app
export default VendorInfo;
