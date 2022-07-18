//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Image } from 'react-native';
import moment from 'moment';
import fontSize from '../../../theme/fontsize';
import { MyIcon } from '../../../theme/icons';
import { converStatusToColor, converStatusToString } from '../../../utils/request';
import ImageProgress from '../../common/ImageProgress';
import { myFromNow } from '../../../utils/request';
import colors from '../../../theme/colors';
import Lightbox from 'react-native-lightbox';

// create a component
class ListPropertyItem extends PureComponent {

    renderContent(){
        const { item, index, onPress } = this.props;
        const {
            id,
            name,
            description,
            note
        } = item;

        return(
            <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: index % 2 == 0 ? '#fff' : '#f7f7f7'
                        }}
                    >
                        <View style={{ flex: 1, flexDirection: "column", padding: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: "Inter-Bold"}}>{index + 1}. {name}</Text>
                            </View>
                            <View style={{flex: 1, marginTop: 5}}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ width: '50%'}}>
                                        <Text style={{ color: colors.appTheme, marginTop: 5, fontStyle: 'italic' }}>Mô tả</Text>
                                        <Text numberOfLines={2} lineBreakMode="tail" style={{ paddingRight: 5 }}>{description}</Text>
                                    </View>
                                    <View style={{ width: '50%'}}>
                                        <Text style={{ color: colors.appTheme, marginTop: 5, fontStyle: 'italic' }}>Ghi chú</Text>
                                        <Text numberOfLines={2} lineBreakMode="tail" style={{ paddingRight: 5 }}>{note}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
        )
    }

    render() {
        const { item, statusId, onPress } = this.props;
        const {
            id,
            name,
            description,
            note
        } = item;

        //Trạng thái đang thực hiện mới cho phép cập nhật
            if(statusId === 1){
                return(
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={onPress}
                    >                        
                    { this.renderContent() }
                    </TouchableOpacity>
                )
            }
            else{
                return(this.renderContent())
            }
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
    imageActive: {
        flex: 1,
        resizeMode: "contain"
    }
});

//make this component available to the app
export default ListPropertyItem;
