//import liraries
import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import { default_image } from '../../theme/images';
import { MyIcon } from '../../theme/icons';
import moment from 'moment';
import ImageProgress from '../common/ImageProgress';
import colors from '../../theme/colors';

// create a component
class ListItem extends PureComponent {

    render() {
        const { onPress, item } = this.props;
        const {
            id,
            title,
            dateCreate,
            imageUrl,
            isRead,
            towerId,
            towerName,
            towerAddress,
            isImportant,
            shortDescription } = item;
        return (
            <TouchableOpacity onPress={onPress} >
                <View
                    style={{
                        flexDirection: 'row',
                        padding: 5,
                        borderBottomWidth: 0.5,
                        borderColor: 'rgb(206, 209, 212)',
                        backgroundColor: isRead ? '#ffffff' : '#edf2fa'
                    }}
                >
                    <ImageProgress
                        style={{

                            borderWidth: 1,
                            borderColor: colors.grayBorder,
                            height: 120,
                            width: 150
                        }}
                        source={{ uri: imageUrl }}
                    />
                    <View style={{ flex: 1, justifyContent: 'space-between', marginHorizontal: 5, marginRight: 10 }}>
                        <View>
                            <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: 18, color: 'rgb(53, 68, 73)' }}>{title}</Text>
                            <Text numberOfLines={2} ellipsizeMode="tail" style={{ color: 'rgb(58, 156, 253)', fontSize: 15 }}>{towerName}</Text>
                        </View>

                        {/* <Text numberOfLines={2} ellipsizeMode="tail" style={{ color: 'rgb(162, 162, 162)', fontSize: 15 }}>{towerAddress}</Text> */}
                        <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 15, color: 'rgb(70, 70, 70)' }}>{shortDescription}</Text>
                        <Text style={{ color: 'rgba(70, 70, 70, 0.5)', fontSize: 15 }}>{moment(dateCreate).fromNow()}</Text>
                    </View>
                </View>
                {
                    isImportant &&

                    <MyIcon
                        name="triangle" size={20}
                        color='red'
                        style={{ top: 1, right: 1, position:'absolute' }}
                    />

                }
            </TouchableOpacity >
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
