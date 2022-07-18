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
import Strings from '../../../utils/languages';
import apiStorage from '../../../utils/ApiStorage';
import keys from '../../../utils/keys';
import { show } from '../../../utils/Toast';
import AsyncStorage from '@react-native-community/async-storage';
import { REPORT_GROUP_PROGRESS_RATING_RERESHING } from '../../../actions/actionTypes';
import { loadDataHandle, resetStateByKey, refreshDataHandle, updateHandle, updateStatusHandle, insertProposalHandle } from '../../../actions/checklistDetail';
import { connect } from 'react-redux';
// create a component
class ListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            idDowload: []
        };
    }
    componentDidMount = async () => {
        //     AsyncStorage.removeItem(keys.keyChecklists);
        //    return
        //console.log('ListItem')
        const { item, onRefresh } = this.props;
        await apiStorage.get(keys.keyChecklists)
            .then(async (data) => {
                //console.log(data);
                if (data.status === 1) {
                    let checklistsArray = await JSON.parse(data.content);
                    //await checklistsArray.push(item);
                    //console.log(checklistsArray);
                    //console.log(item);
                    let idDowload = await checklistsArray.filter(function (element) {
                        return element.id == item.id;
                    });
                    //console.log(idDowload)
                    await this.setState({ idDowload: idDowload })

                }
            })
    }

    onDownload = async (checklist) => {
        const { item, onRefresh } = this.props;
        await apiStorage.get(keys.keyChecklists)
            .then(async (data) => {
                //console.log(data);
                if (data.status === 1) {//có checklists offline thì lấy ra và pust thêm item vào
                    let checklistsArray = await JSON.parse(data.content);
                    let id = checklist.id;
                    await this.props.loadDataHandle({ id });
                    checklist['info'] = await this.props.data;
                    await checklistsArray.push(checklist);
                    // console.log(checklist);
                    await apiStorage.set(keys.keyChecklists, JSON.stringify(checklistsArray))
                        .then(async (data) => {
                            if (data.status !== 1) {
                                throw Error(data.message)
                            } else {
                                await this.setState({ idDowload: checklistsArray })
                                //await this.props.onRefresh();
                                //show();
                            }
                        })
                } else if (data.status === 0) {// k có checklists offline thì thêm mới
                    let checklistsArray = [];
                    let id = checklist.id;
                    await this.props.loadDataHandle({ id });
                    checklist['info'] = await this.props.data;
                    await checklistsArray.push(checklist)
                    await apiStorage.set(keys.keyChecklists, JSON.stringify(checklistsArray))
                        .then(async (data) => {
                            if (data.status !== 1) {
                                throw Error(data.message)
                            } else {
                                await this.setState({ idDowload: checklistsArray })
                                //await this.props.onRefresh();
                                //show();
                            }
                        })
                }
                else {
                    throw new Error(data.content)
                }
            })

    }
    onUnload = async (checklist) => {
        await apiStorage.get(keys.keyChecklists)
            .then(async (data) => {
                // console.log(data);
                if (data.status === 1) {// lấy vị trí của item trong checklists offline và xoá
                    let checklistsArray = await JSON.parse(data.content);
                    // console.log(checklistsArray);
                    // console.log(checklist);
                    let index = await checklistsArray.findIndex(function (element) {
                        return element.id == checklist.id;
                    });
                    await checklistsArray.splice(index, 1);
                    // console.log(index)
                    await apiStorage.set(keys.keyChecklists, JSON.stringify(checklistsArray))
                        .then(async (data) => {
                            if (data.status !== 1) {
                                throw Error(data.message)
                            } else {
                                await this.setState({ idDowload: [] })
                                //await this.props.onRefresh();
                                //show();
                            }
                        })

                } else {
                    throw new Error(data.content)
                }
            })

    }
    render() {
        const { item, onPress } = this.props;
        const {
            id,
            title,
            system,
            dateAction,
            employeeName,
            imageUrl,
            status,
            statusId,
            stepApproved,
            stepTotalApprove,
            typeName,
            isUnNormal
        } = item;
        //console.log(onPress)
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
                    marginVertical: 10, marginHorizontal: 20, padding: 10,
                }}
                onPress={onPress}
            >
                <View
                    style={{
                        flex: 1,
                        
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#fff'
                    }}
                >

                    <ImageProgress
                        circle={true}
                        style={{
                            height: 80,
                            width: 80
                        }}

                        source={{ uri: imageUrl }}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between', marginLeft: 10 }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Text style={{ fontFamily: "Inter-Bold", fontSize: fontSize.small, fontWeight: 'bold', color: isUnNormal ? 'red' : null }} numberOfLines={2}>{title}</Text>

                            {/* <View style={{ borderRadius: 45, height: 24, width: 24, backgroundColor: colors.appBackround, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: colors.appTheme }} numberOfLines={2} lineBreakMode="tail">{typeName}</Text>
                            </View> */}
                            {/* {
                                this.state.idDowload.length > 0 ?
                                    <TouchableOpacity onPress={() => this.onUnload(item)}
                                        style={{ borderRadius: 40, paddingHorizontal: 10, paddingVertical: 5, marginLeft: 10, backgroundColor: colors.red, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: colors.white }}>{Strings.checklist.unDownload}</Text>
                                    </TouchableOpacity> :
                                    <TouchableOpacity onPress={() => this.onDownload(item)}
                                        style={{ borderRadius: 40, paddingHorizontal: 10, paddingVertical: 5, marginLeft: 10, backgroundColor: colors.appTheme, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <MyIcon
                                            name="download"
                                            size={20}
                                            color="#fff"
                                            style={{ marginRight: 5 }}
                                        />
                                        <Text style={{ color: colors.white }}>{Strings.checklist.download}</Text>
                                    </TouchableOpacity>
                            } */}

                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ marginVertical: 5, flex: 0.9 }} numberOfLines={2} lineBreakMode="tail">{system}</Text>
                            <View style={{ borderRadius: 45, height: 24, width: 24, backgroundColor: colors.appBackround, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: colors.appTheme, fontFamily: "Inter-Regular", }} numberOfLines={2} lineBreakMode="tail">{typeName}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{
                                fontFamily: "Inter-Bold",
                                fontSize: 13,
                                letterSpacing: 0,
                                textAlign: "left",
                                color: colors.appTheme
                            }} numberOfLines={1}>{employeeName}</Text>
                            {statusId === 2 ? <Text style={{ color: colors.appTheme, fontFamily: "Inter-Regular", }} numberOfLines={1} lineBreakMode="tail">{stepApproved} / {stepTotalApprove}</Text>
                                : null}
                        </View>

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
                            }} numberOfLines={2} lineBreakMode="tail">{moment(dateAction).format('DD/MM/YYYY')}</Text>
                            <View
                                style={{
                                    marginVertical: 5,
                                    borderRadius: 16,
                                    backgroundColor: "#feefef",
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
const mapStateToProps = state => ({
    user: state.auth.user,
    initList: state.checklistDetail.initList,
    data: state.checklistDetail.data,
    isLoading: state.checklistDetail.isLoading,
    error: state.checklistDetail.error,
    errorUpdate: state.checklistDetail.errorUpdate
})
const mapActionToProps = {
    loadDataHandle,
}
export default connect(mapStateToProps, mapActionToProps)(ListItem);
//make this component available to the app
//export default ListItem;
