//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
class RowItem extends PureComponent {
    render() {
        const { title, value, styleValue, styleTitle } = this.props
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 5
                }}>
                <Text style={{...styleTitle}}>{title}</Text>
                <Text style={{...styleValue}}>{value}</Text>
            </View>
        )
    }
}

// define your styles


//make this component available to the app
export default RowItem;
