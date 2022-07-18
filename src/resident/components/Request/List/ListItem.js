//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import fontSize from '../../../theme/fontsize';
import { MyIcon } from '../../../theme/icons';
import { converStatusToColor, converStatusToString } from '../../../utils/request';
import ImageProgress from '../../common/ImageProgress';

// create a component
class ListItem extends PureComponent {
    render() {
        const { item, onPress } = this.props;
        const { id, title, content, logo, towerName, statusId, departmentName } = item;
        return (

            <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={onPress}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        backgroundColor: '#fff'
                    }}
                >

                    <ImageProgress
                        circle={true}
                        style={{
                            height: 100,
                            width: 100
                        }}

                        source={{ uri: logo }}
                    />

                    <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={{ fontSize: fontSize.larg, fontWeight: 'bold' }}>{title}</Text>
                        <Text style={{ marginVertical: 5, color: colors.gray1 }}>{towerName}</Text>
                        <Text style={{ marginVertical: 5, color: colors.gray1 }}>{departmentName}</Text>
                        <Text numberOfLines={2} lineBreakMode="tail">{content}</Text>
                    </View>
                </View>
                <MyIcon
                    name="triangle"
                    size={20}
                    color={converStatusToColor(statusId)}
                    style={{ position: 'absolute', top: 0, right: 0, alignSelf: 'flex-start' }} />
            </TouchableOpacity>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default ListItem;
