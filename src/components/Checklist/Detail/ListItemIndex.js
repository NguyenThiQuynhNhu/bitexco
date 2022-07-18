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

const Devices = require('react-native-device-detection');

// create a component
class ListItemIndex extends PureComponent {

    renderContent(){
        const { item, index, onPress, onPressImage, checklistTypeId } = this.props;
        const {
            id,
            title,
            description,
            isGroup,
            isNormal,
            images,
            numberNo,
            standard,
            isSelect,
            value,
            isRequireImage,
            employeeId,
            amount,
            indexOld,
            indexNew,
            unit,
            
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
    
                        {Devices.isTablet ?
                            <View style={{ flex: 1, flexDirection: "row" }}>
                            {isGroup ? <View style={{ width: 50 }}><Text style={{fontWeight: 'bold', padding: 10}}>{numberNo}</Text></View> :
                                        <View style={{ width: 50, borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10}}>{numberNo}</Text></View>}
    
                            {isGroup ? <View style={{ flex: 1, minWidth: 150, borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{fontWeight: 'bold', padding: 10}}>{title}</Text></View> :
                                        <View style={{ flex: 1, minWidth: 150, borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10, fontFamily: "Inter-Bold"}}>{title}</Text></View>}
    
                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10}}>{unit}</Text></View>
                            <View style={{ flex: 1, maxWidth: 60, borderLeftWidth: 1, borderColor: colors.grayBorder }}>
                                    { images.length > 0 ? 
                                        <TouchableOpacity
                                        style={{ padding: 5 }}
                                        onPress={onPressImage}
                                    >                        
                                        <Image source={{ uri: images[0] }} style={{ width: 50, height: 40 }} />
                                    </TouchableOpacity>
                                     : <View style={{ padding: 5, width: 50, height: 40, justifyContent: 'center', alignItems:'center' }}><Text style={{ color: isRequireImage ? 'red' : '#fff'}}>{ isRequireImage ? "?" : ""}</Text></View>}
                            </View>
                            <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10, alignItems: 'center', justifyContent: 'center'}}>{ indexOld }</Text></View>

                            <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10, alignItems: 'center', justifyContent: 'center', color: !isNormal ? 'red' : ''}}>{ indexNew }</Text></View>

                            <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10, alignItems: 'center', justifyContent: 'center'}}>{ amount }</Text></View>

                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10}}>{description}</Text></View>
                        </View>
                        :
                        <View style={{ flex: 1, flexDirection: "column", padding: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: "Inter-Bold"}}>{numberNo}. {title}</Text>
                            </View>
                            <View style={{flex: 1, marginTop: 5}}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ width: '60%'}}>
                                    { images.length > 0 ? 
                                    <View>
                                        <Text style={{ color: colors.appTheme, fontStyle: 'italic' }}>Hình ảnh</Text>
                                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                                            {images.map((eachImage, y) => {
                                                return (
                                                    <View key={y}>
                                                        <Lightbox
                                                            style={{ marginTop: 10, marginRight: 10, borderRadius: 5 }}
                                                            activeProps={{
                                                                style: styles.imageActive
                                                            }}
                                                        >
                                                            <Image source={{ uri: eachImage }} style={{ width: 50, height: 40 }} />
                                                        </Lightbox>
                                                    </View>
                                                );
                                            })}
                                        </ScrollView>
                                    </View>
                                    : null }

                                        <Text style={{ color: colors.appTheme, fontStyle: 'italic', marginTop: 5 }}>Ghi chú</Text>
                                        <Text numberOfLines={2} lineBreakMode="tail" style={{ paddingRight: 5 }}>{description}</Text>
                                    </View>
                                    <View style={{ width: '40%'}}>
                                        <Text style={{ color: colors.appTheme, fontStyle: 'italic' }}>Chỉ số cũ</Text>
                                        <Text style={{ }}>{indexOld}</Text>

                                        <Text style={{ color: colors.appTheme, fontStyle: 'italic', marginTop: 10 }}>Chỉ số mới</Text>
                                        <Text style={{ color: isNormal ? '#000' : 'red' }}>{ indexNew }</Text>

                                        <Text style={{ color: colors.appTheme, fontStyle: 'italic', marginTop: 10 }}>Tiêu thụ / Đơn vị tính</Text>
                                        <Text numberOfLines={2} lineBreakMode="tail" style={{ }}>{amount} / {unit}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                    </View>
        )
    }

    render() {
        const { item, statusId, isOwner, onPress } = this.props;
        const {
            id,
            title,
            description,
            isGroup,
            isNormal,
            images,
            numberNo,
            standard,
            isSelect,
            value
        } = item;
        if(isGroup){
            return (
                <TouchableOpacity
                    style={{ flexDirection: 'row' }}
                    onPress={ (statusId === 1) ? onPress : null }
                    //onPress={ () => console.log('nhu') }
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.grayBorder
                        }}
                    >
    
                        { Devices.isTablet ? 
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            {isGroup ? <View style={{ width: 50 }}><Text style={{fontWeight: 'bold', padding: 10}}>{numberNo}</Text></View> :
                                        <View style={{ width: 50, borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10}}>{numberNo}</Text></View>}

                            {isGroup ? <View style={{ flex: 1, minWidth: 150, borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{fontWeight: 'bold', padding: 10, fontFamily: "Inter-Bold"}}>{title}</Text></View> :
                                        <View style={{ flex: 1, minWidth: 150, borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10, fontFamily: "Inter-Bold"}}>{title}</Text></View>}

                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10}}></Text></View>
                            <View style={{ flex: 1, maxWidth: 60, borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10}}></Text></View>
                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10}}></Text></View>
                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10}}></Text></View>
                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10}}></Text></View>
                            <View style={{ flex: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderColor: colors.grayBorder }}><Text style={{ padding: 10}}></Text></View>
                        </View>
                        :
                        <View style={{ flex: 1, flexDirection: "row", backgroundColor: '#dcf2fa' }}>
                            <Text style={{ padding: 10, fontWeight: 'bold', color: '#3d3d3d', fontFamily: "Inter-Bold"}}>{numberNo}. {title ? title.toLocaleUpperCase() : ''}</Text>
                        </View>
                    }
                    </View>
                </TouchableOpacity>
            )
        }
        else{
            //Trạng thái đang thực hiện mới cho phép cập nhật
            if(statusId === 1 && isOwner){
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
export default ListItemIndex;