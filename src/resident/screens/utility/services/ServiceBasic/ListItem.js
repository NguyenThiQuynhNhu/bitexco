//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import fontSize from '../../../../theme/fontsize';
import { MyIcon } from '../../../../theme/icons';
import ImageProgress from '../../../../components/common/ImageProgress';
import { converStatusToColor, converStatusToString } from '../../../../utils/serviceBasic'


import moment from 'moment';
import colors from '../../../../theme/colors';
import fontsize from '../../../../theme/fontsize';
import { Screen } from '../../../../utils/device'
// create a component
class ListItem extends PureComponent {
    render() {

        const { item, onPress, deleteService } = this.props;
        const { serviceName, description, statusName, dateCreate, logo, statusId } = item;
        return (

            <TouchableOpacity
                style={{
                    flexDirection: 'row', marginHorizontal: 20, marginVertical: 10, borderRadius: 12,
                    backgroundColor: "#ffffff",
                    shadowColor: "rgba(0, 0, 0, 0.1)",
                    elevation: 2,
                    shadowOffset: {
                        width: 0,
                        height: 4
                    },
                    shadowRadius: 10,
                    shadowOpacity: 1
                }}
                onPress={onPress}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >

                    <ImageProgress
                        //circle={true}
                        style={{
                            height: Screen.width / 4,
                            width: Screen.width / 4,
                            borderTopLeftRadius: 12,
                            borderBottomLeftRadius: 12
                        }}

                        source={{ uri: logo }}
                    />

                    <View style={{ flex: 1, justifyContent: 'center', margin: 10 }}>
                        <Text style={{
                            flexDirection: 'row', flex: 1, width: (Screen.width - 60) - (Screen.width / 4),
                            fontFamily: "Inter-SemiBold",
                            fontSize: 16,
                            fontWeight: "600",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "left",
                            color: "#282828"
                        }}>{serviceName}</Text>
                        <Text lineBreakMode="tail" style={{
                            flexDirection: 'row', flex: 1, width: (Screen.width - 60) - (Screen.width / 4),
                            fontFamily: "Inter-Regular",
                            fontSize: 13,
                            fontWeight: "normal",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "left",
                            color: "#3d3d3d"
                        }} numberOfLines={2} lineBreakMode="tail">{description}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 5 }}>
                            {/* <Text style={{ color: colors.gray1 }}>{statusName}</Text> */}
                            <View
                                style={{
                                    //marginLeft: 10,
                                    padding: 5,
                                    borderRadius: 16,
                                    backgroundColor: "#fff5eb"
                                }}>
                                <Text style={{
                                    fontFamily: "Inter-Regular",
                                    fontSize: 12,
                                    fontWeight: "normal",
                                    fontStyle: "normal",
                                    letterSpacing: 0,
                                    textAlign: "center",
                                    color: converStatusToColor(statusId)
                                }}>{statusName}</Text>
                            </View>
                            <Text style={{
                                fontFamily: "Inter-Regular",
                                fontSize: 11,
                                fontWeight: "normal",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                textAlign: "left",
                                color: "#6f6f6f"
                            }}>{moment(dateCreate).format('DD/MM/YYYY HH:mm')}</Text>
                        </View>
                    </View>

                </View>
                {statusId == 1 && <TouchableOpacity style={{ borderRadius: 45, height: 40, width: 40, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', margin: 10 }}
                    onPress={() => deleteService(item.id)}
                >
                    <MyIcon name='x' size={20} color="#fff" />

                </TouchableOpacity>}
                {/* <MyIcon
                    name="triangle"
                    size={20}
                    color={converStatusToColor(statusId)}
                    style={{ position: 'absolute', top: 0, right: 0, alignSelf: 'flex-start' }} /> */}
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
