//import liraries
import React, { Component } from 'react';
import {
    Picker,
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
    FlatList,
    Animated,
    TextInput,
    Platform,
    ActivityIndicator,
    TouchableWithoutFeedback,
    RefreshControl,
    ScrollView,
    Item,
    Modal
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Toast, { DURATION } from 'react-native-easy-toast';
import FCM, { FCMEvent } from "react-native-fcm";

//components
import ImageProgress from '../../../components/common/ImageProgress';
import ListAutoHideHeader from '../../../components/common/ListAutoHideHeader';
import { MyIcon } from '../../../theme/icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconText from '../../../components/common/IconText';
import SearchBar from '../../../components/common/SearchBar';
import ErrorContent from '../../../components/common/ErrorContent';
import Device from '../../../utils/device';
import ListData from '../../../components/Checklist/List/ListData';
import ButtonFilter from '../../../components/Checklist/List/ButtonFilter';
import ButtonDateFilter from '../../../components/statistics/ButtonFilter';

//style
import colors from '../../../theme/colors';
import fontSize from '../../../theme/fontsize';
import NavBar from '../../../components/common/NavBar';

const Devices = require('react-native-device-detection');
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';

//data
import firebase from 'firebase';
import {
    loadDataHandle,
    refreshDataHandle,
    resetStateByKey,
    onSubmitEditing,
    onChangeText,
    onClearText,
    onFilter,
    onClearFilter
} from '../../../actions/checklist'
import { converStatusToColor, converStatusToString } from '../../../utils/request';
import Strings from '../../../utils/languages';
import PrimaryButton from '../../../components/common/PrimaryButton';

import Button from '../../../components/common/Button';
import CircleView from '../../../components/common/CircleView';
import apiStorage from '../../../utils/ApiStorage';
import keys from '../../../utils/keys';
import AsyncStorage from '@react-native-community/async-storage';
//import { show } from './../../utils/Toast';
class ChecklistOfflineList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }
   componentDidMount = async () => {
        //     AsyncStorage.removeItem(keys.keyChecklists);
        //    return
        //console.log('ListItem')
        
        await apiStorage.get(keys.keyChecklists)
            .then(async (data) => {
                //console.log(data);
                if (data.status === 1) {
                    //let checklistsArray = await JSON.parse(data.content);
                    this.setState({data: JSON.parse(data.content)})
                }
            })
    }
    _renderContent() {
        const { data } = this.state;
        // if (initList) {
        //     return (<View style={{ flex: 1, justifyContent: 'center' }}>
        //         <ActivityIndicator  color={colors.appTheme}/>
        //     </View>)
        // }

        if (data.length == 0) {
            return <ErrorContent title={Strings.app.emptyData}/>
        }
        // if (error && error.hasError) {
        //     return (
        //         <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.refreshDataHandle()} />
        //     )
        // }
        return (
            <FlatList
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
                //refreshing={refreshing}
                //onRefresh={onRefresh}
                data={data}
                keyExtractor={(item, index) => `${index.toString()}`}
                renderItem={this.renderItem}
                //ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.5}
                //onEndReached={onEndReached}
                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
            />
        );
    }
    renderItem = ({ item, index }) => {
        //const {onRefresh, canNavigate, navigation } = this.props;
        //console.log('this.props', this.props)
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
        return (
            <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => this.props.navigation.navigate('checklisOfflinetDetail', item)}
        >
            <View
                style={{
                    flex: 1,
                    padding: 10,
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
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: fontSize.larg, fontWeight: 'bold', color: isUnNormal ? 'red' : null }} numberOfLines={2}>{title}</Text>

                        <View style={{ borderRadius: 45, height: 24, width: 24, backgroundColor: colors.appBackround, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: colors.appTheme }} numberOfLines={2} lineBreakMode="tail">{typeName}</Text>
                        </View>
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
                        <Text style={{ marginVertical: 5 }} numberOfLines={2} lineBreakMode="tail">{system}</Text>
                        {/* <View style={{ borderRadius: 45, height: 24, width: 24, backgroundColor: colors.appBackround, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: colors.appTheme }} numberOfLines={2} lineBreakMode="tail">{typeName}</Text>
                        </View> */}
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text numberOfLines={1}>{employeeName}</Text>
                        {statusId === 2 ? <Text style={{ color: colors.appTheme }} numberOfLines={1} lineBreakMode="tail">{stepApproved} / {stepTotalApprove}</Text>
                            : null}
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: colors.gray1 }} numberOfLines={2} lineBreakMode="tail">{moment(dateAction).format('DD/MM/YYYY')}</Text>
                        <Text style={{ color: colors.appTheme }} numberOfLines={1}>{status}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        )
    }
    render(){
        return(
            <View style={styles.container}>
            <NavBar
                    leftButton={<TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <MyIcon
                            name="arrow"
                            size={22}
                            color="#fff"
                        />
                    </TouchableOpacity>}
                    body={<View style={{ justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', alignSelf: 'center', fontSize: fontSize.medium, fontWeight: 'bold' }}>CHECKLIST OFFLINE</Text>
                    </View>
                    }
                    // rightView={<TouchableOpacity
                    //     onPress={() => this.setState({ showFilter: true })}
                    //     style={{ padding: 10 }}
                    // >
                    //     <MyIcon
                    //         name="search"
                    //         size={25}
                    //         color="#fff"

                    //     />
                    // </TouchableOpacity>}
                />
                {this._renderContent()}
                </View>
        )

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
const mapStateToProps = (state) => ({

    initList: state.checklist.initList,
    currentPage: state.checklist.currentPage,
    rowPerPage: state.checklist.rowPerPage,
    emptyData: state.checklist.emptyData,
    outOfStock: state.checklist.outOfStock,
    isLoading: state.checklist.isLoading,
    data: state.checklist.data,
    error: state.checklist.error,
    isRefreshing: state.checklist.isRefreshing,
    isApplySearchKey: state.checklist.isApplySearchKey,
    searchKey: state.checklist.searchKey,
    createStatus: state.checklist.createStatus,
    canNavigate: true,//state.requestDetail.data == null,
    language: state.app.language,
    isMine: state.checklist.isMine,
    user: state.auth.user,
    statusId: state.checklist.statusId,
    errorResponse: state.requestDetail.errorResponse,
    towerId: state.auth.user.towerId,
    statusSelected: state.checklist.statusSelected
});

const mapActionToState = {
    loadDataHandle,
    refreshDataHandle,
    resetStateByKey,
    onSubmitEditing,
    onChangeText,
    onClearText,
    onFilter,
    onClearFilter
};

//make this component available to the app
export default connect(mapStateToProps, mapActionToState)(ChecklistOfflineList);