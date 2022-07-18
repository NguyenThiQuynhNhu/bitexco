//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import fontSize from '../../../theme/fontsize';
import { MyIcon } from '../../../theme/icons';
import { converStatusToColor, converStatusToString } from '../../../utils/request';
import ImageProgress from '../../common/ImageProgress';
import { myFromNow } from '../../../utils/request';
import colors from '../../../theme/colors';

// create a component
class ListItem extends PureComponent {
    render() {
        const { item, onPress } = this.props;
        const {
            id,
            title,
            description,
            dateAction,
            employeeName,
            imageUrl,
            status
        } = item;

        //console.log(item);
        return (

            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    backgroundColor: "#ffffff",
                    shadowColor: "rgba(0, 0, 0, 0.1)",
                    elevation: 2,
                    shadowOffset: {
                        width: 0,
                        height: 4
                    },
                    shadowRadius: 10,
                    shadowOpacity: 1,
                    marginVertical: 10, marginHorizontal: 20,
                }}
                onPress={onPress}
            >
                <View
                    style={{
                        flex: 1,
                        padding: 10,
                        alignItems: 'flex-start',
                        flexDirection: 'row',
                    }}
                >

                    <ImageProgress
                        circle={true}
                        style={{
                            height: 60,
                            width: 60
                        }}

                        source={{ uri: imageUrl }}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between', marginLeft: 10 }}>
                        <Text style={{ fontSize: fontSize.medium, fontWeight: 'bold', fontFamily: "Inter-Bold", }} numberOfLines={2}>{title}</Text>
                        <Text style={{
                            marginVertical: 5, marginVertical: 0, fontFamily: "Inter-Regular",
                            fontSize: 13,
                            fontWeight: "normal",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "left",
                            color: "#ff3d00"
                        }} numberOfLines={2} lineBreakMode="tail">{employeeName}</Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{
                                fontFamily: "Inter-Regular",
                                fontSize: 11,
                                fontWeight: "normal",
                                fontStyle: "normal",
                                lineHeight: 22,
                                letterSpacing: 0,
                                textAlign: "left",
                                color: "#6f6f6f"
                            }} numberOfLines={2} lineBreakMode="tail">{moment(dateAction).format('DD/MM/YYYY HH:mm')}</Text>

                            <View
                                style={{
                                    //marginLeft: 10,
                                    marginVertical: 5,
                                    borderRadius: 16,
                                    backgroundColor: "#feefef",
                                    //backgroundColor: converStatusToColor(statusKey),
                                }}>
                                <Text style={{
                                    margin: 2, marginHorizontal: 5, fontFamily: "Inter-Regular",
                                    fontSize: 12,
                                    fontWeight: "normal",
                                    fontStyle: "normal",
                                    letterSpacing: 0,
                                    textAlign: "left",
                                    color: "#f53b3b"
                                }}>{status}</Text>
                            </View>
                        </View>
                    </View>
                </View>
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
