//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import colors from '../../../theme/colors';
import default_image from '../../../theme/images';

import { MyIcon } from '../../../theme/icons';
import fontSize from '../../../theme/fontsize';
import ImageProgress from '../../../components/common/ImageProgress';

// create a component
class ListItem extends Component {
    render() {
        const { item, onPress } = this.props;
        const { id, typeId, towerName, hotline, address, logo, serviceName } = this.props.item
        return (
            <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={onPress}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        padding: 10,
                        backgroundColor: '#fff',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.grayBorder
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
                        <Text style={{ fontSize: fontSize.medium, fontWeight: 'bold' }}>{towerName}</Text>
                        <Text style={{ marginVertical: 5, color: colors.gray1 }}>{serviceName}</Text>
                        <Text>{address}</Text>
                    </View>
                </View>
                {typeId == 20 &&
                    <View
                        style={{ position: 'absolute', top: 1, right: 0, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <MyIcon
                            name="triangle" size={30}
                            color={colors.blue}
                        />
                        <MyIcon
                            name="check-circle" size={10}
                            style={{ position: 'absolute', top: 2, right: 1, }}
                            color="#fff"
                        />
                    </View>
                }
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
