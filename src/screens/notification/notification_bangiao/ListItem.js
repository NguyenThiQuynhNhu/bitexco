//import liraries
import React, { PureComponent } from 'react';
import moment from 'moment';
import { View, Text, TouchableOpacity ,Image} from 'react-native';
import ImageProgress from '../../../components/common/ImageProgress';

import FontSize from '../../../theme/fontsize';
import colors from '../../../theme/colors';
import fontsize from '../../../theme/fontsize';
import Icon from 'react-native-vector-icons/Ionicons';

// import { Icon } from 'native-base';

// create a component
class ListItem extends PureComponent {
    render() {
        const { item, onPress } = this.props
        // const {
        //     id,
        //     title,
        //     dateCreate,
        //     imageUrl,
        //     ImageUrl,
        //     isRead,
        //     totalRead,
        //     towerId,
        //     towerName,
        //     towerAddress,
        //     actionId,
        //     requestId,
        //     shortDescription } = item;
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    // padding: 20,
                    paddingLeft:10,
                    paddingRight:15,
                    paddingVertical:15,
                    borderBottomWidth: 0.5,
                    borderColor: 'rgb(206, 209, 212)',
                    alignItems: 'center',
                    backgroundColor: colors.white
                }}
                onPress={onPress}
            >


                <View style={{
                    marginRight:10,
                    marginLeft:5,
                    backgroundColor:item.IsRead ? colors.NoColor : colors.blue,
                    width:11,
                    height:11,
                    borderRadius:5.5
                }}>

                </View>

                <ImageProgress
                    circle={true}
                    style={{
                        height: 50,
                        width: 50
                    }}
                    
                    source={{ uri: item.imageUrl }}
                    // source={require('../../resources/icon_full.png')}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={{ fontSize: fontsize.medium,color:colors.appTheme,fontWeight:'500' }}>{item.title}</Text>
                        
                        <Text numberOfLines={2} style={{ fontSize: fontsize.small,color:colors.gray1 }}>{item.shortDescription}</Text>

                        <View style={{ flexDirection: 'row',marginTop:10, alignItems: 'center', justifyContent: 'space-between' }}>
                            {/* <IconText icon="ic_luot_xem" text={item.TotalRead?tem.TotalRead : 0} /> */}
                            <View style={{
                                flexDirection:'row',
                                alignItems:'center'
                            }}>
                                <Icon style={{
                                    color: colors.gray1,
                                    fontSize:fontsize.larg
                                }} name='ios-eye' type='Ionicons' />
                                <Text style={{
                                    color: colors.gray1,
                                    fontSize:fontsize.small,
                                    marginLeft:10
                                }}>{item.totalRead?tem.totalRead : 0}</Text>
                            </View>
                            
                            <Text style={{color:colors.gray1}}>{moment(item.DateCreate).format('DD/MM/YYYY HH:mm')}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
        )
    }
}



//make this component available to the app
export default ListItem;
