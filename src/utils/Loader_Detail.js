import React, { Component } from 'react';
import { View,ActivityIndicator } from 'react-native';
// import Color from '../Libs/Color';

export default class Loader_Detail extends Component {
    state = {  }
    render() {
        let {flex,color,marginHorizontal,marginVertical} = this.props
        if(flex === undefined){
            flex=1
        }
        if(marginHorizontal === undefined){
            marginHorizontal=10
        }
        if(marginVertical === undefined){
            marginVertical=5
        }
        return (
            <View style={{
                // backgroundColor:Color.NoColor,
                flex:flex,
                alignItems:'center',
                justifyContent:'center'
            }}>
                <ActivityIndicator size='small' animating={true} color={color} style={{marginHorizontal,marginVertical}} />
            </View>
        );
    }
}