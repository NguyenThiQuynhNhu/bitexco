//import liraries
import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';

import moment from 'moment';
import 'moment/locale/vi';

import Strings from '../../utils/languages';
import { loadDataHandle, resetStateByKey, refreshDataHandle, onSubmitEditing, onChangeText, onClearText, updateItemListNotify } from '../../actions/notification';
import { updateItemList, updateBadge } from '../../actions/news';
import ErrorContent from '../../components/common/ErrorContent';

import ListItem from './ListItem';
// import { REOTP_CODE_REQUEST } from '../../actions/actionTypes';
import NavBar from '../../components/common/NavBar';
import { MyIcon } from '../../theme/icons';
import colors from '../../theme/colors';
import fontsize from '../../theme/fontsize';
import SearchBar from '../../components/common/SearchBar';
//import { default_user } from '../../theme/images';
import ImageProgress from '../../components/common/ImageProgress';
import _ from 'lodash';
import { Screen } from '../../utils/device'
import { default_user } from '../../theme/images';
// create a component
import FCM from "react-native-fcm";
class NotificationScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            isShowSearch: false,

        };
        moment.locale('vi');
    }

    componentDidMount() {
        this.props.resetStateByKey({ key: 'initList', value: true })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initList && nextProps.initList !== this.props.initList) {
            const data = {
                towerId: this.props.towerId,
                keyword: nextProps.isApplySearchKey ? searchKey : '',
                currentPage: nextProps.currentPage + 1,
                rowPerPage: this.props.rowPerPage,
                typeNews: 1
            }
            this.props.loadDataHandle(data);
        }
        if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing && !nextProps.isLoading) {
            const data = {
                towerId: this.props.towerId,
                keyword: nextProps.isApplySearchKey ? nextProps.searchKey : '',
                currentPage: nextProps.currentPage + 1,
                rowPerPage: this.props.rowPerPage,
                typeNews: 1
            }
            this.props.loadDataHandle(data);
        }
        if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
            this.props.refreshDataHandle()
        }
    }

    componentWillUnmount() {
        this.props.resetStateByKey({ key: 'state' })
    }

    renderItem = ({ item }) => {
        const {
            actionId,
            requestId,
            shortDescription,
            imageUrl,
            //towerName
        } = item
        return <View>
            {actionId == 9 || actionId == null ? null :
                <ListItem
                    item={item}
                    onPress={() => {
                        if (actionId == 2) {
                            this.props.navigation.navigate('newsDetail', { item: {id: item.linkIdNews, towerId: item.towerId, towerName: item.towerName}, type: 1 })
                        } else if (actionId == 9) {
                            this.props.navigation.navigate('schedule', { date: item.dateHandover })
                        }
                        else if (actionId == 3) {
                            this.props.navigation.navigate('serviceBasicDetailResident', { id: item.requestId })
                        }else if (actionId == 4) {
                            this.props.navigation.navigate('serviceExtensionDetailResident', { id: item.requestId })
                        }else if (actionId == 13 || actionId == 14) {
                            this.props.navigation.navigate('carCardList')
                        }else if (actionId == 10) {
                            this.props.navigation.navigate('surveyDetail', { id: item.requestId , name: item.title })
                        } else {
                            this.props.navigation.navigate('requestDetailResident',
                                {
                                    id: requestId,
                                    title: shortDescription,
                                    logo: imageUrl,
                                    //towerName
                                })
                        }
                        setTimeout(() => {
                            if(Platform.OS != 'ios') {
                                FCM.removeAllDeliveredNotifications()
                            }
                            this.props.updateItemListNotify(item)
                            this.props.updateBadge();
                        }, 500)
                        
                    }}
                />
            }
        </View>


    }

    renderFooter = () => {
        if (!this.props.isLoading || this.props.isRefreshing) return null;
        return (
            <View
                style={{
                    paddingVertical: 20,
                }}
            >
                <ActivityIndicator animating size="small" />
            </View>
        );
    };
    render() {
        console.log(this.props)
        const { searchKey, onSubmitEditing, onChangeText, onClearText, user } = this.props;
        const { isShowSearch } = this.state;
        const uri = user ? { uri: user.photoUrl } : default_user
        //console.log('user', user)

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>





                {isShowSearch ? <NavBar
                    body={<SearchBar
                        autofocus={true}
                        value={searchKey}
                        onChangeText={(searchKey) => onChangeText({ searchKey })}
                        onSubmitEditing={onSubmitEditing}
                        onClearText={onClearText}
                        style={{
                            flex: 1,
                            margin: Platform.OS == 'ios' ? 15 : 20,
                            marginHorizontal: 10,
                            marginRight: 50
                        }}
                    />}
                    rightView={
                        <TouchableOpacity
                            onPress={() => this.setState({ isShowSearch: false }, onClearText)}
                            style={{ padding: 10 }}>
                            <Text style={{ color: 'black' }}>{Strings.app.cancel}</Text>
                        </TouchableOpacity>
                    }
                /> :
                    <NavBar
                        leftButton={<TouchableOpacity onPress={() => this.props.navigation.navigate('profile')} style={{ padding: 10 }}>
                            <ImageProgress
                                style={{
                                    height: 40,
                                    width: 40
                                }}
                                circle={true}
                                resizeMode="stretch"
                                type='0'
                                source={(user && !_.isNil(user.photoUrl)) ? uri : default_user}
                            />
                        </TouchableOpacity>}
                        body={<Text style={{
                            fontFamily: "Inter-Bold",
                            fontSize: 20,
                            fontWeight: "bold",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "center",
                            color: "black"
                        }}>{Strings.tabbar.notification}</Text>}
                        rightView={
                            <TouchableOpacity
                                onPress={() => this.setState({ isShowSearch: true })}
                                style={{ padding: 10 }}>
                                <MyIcon
                                    size={24}
                                    name="search"
                                    color="black" />
                            </TouchableOpacity>
                        }
                    />}
                {this.renderContent()}
            </View>
        )
    }
    renderContent() {
        const { emptyData, error, initList, data, isRefreshing, outOfStock, refreshDataHandle, isLoading } = this.props;
        const dataNull = data.filter(d => d.actionId != 9 && d.actionId != null);
        if (emptyData || dataNull.length == 0) {
            return <ErrorContent title={Strings.app.emptyData} onTouchScreen={() => this.props.refreshDataHandle()} />
        }
        if (error && error.hasError) {
            return (
                <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.refreshDataHandle()} />
            )
        }
        return (
            <FlatList
                refreshing={isRefreshing}
                onRefresh={() => refreshDataHandle()}
                data={data || []}
                keyExtractor={(item, index) => `${index}`}
                renderItem={this.renderItem}
                onEndReachedThreshold={0.5}
                //horizontal={false}
                //numColumns={2}
                style={{ borderTopRightRadius: 20, marginHorizontal: Platform.OS === 'ios' ? null : 20, marginTop: -13 }}
                onEndReached={() => {
                    if (!this.onEndReachedCalledDuringMomentum
                        && !this.props.outOfStock
                        && this.props.currentPage > 0
                        && !this.props.isLoading
                    ) {
                        const data = {
                            towerId: this.props.towerId,
                            keyword: this.props.isApplySearchKey ? this.props.searchKey : '',
                            currentPage: this.props.currentPage + 1,
                            rowPerPage: this.props.rowPerPage,
                            typeNews: 1
                        }
                        this.props.loadDataHandle(data);

                    }
                }}
                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
                ListFooterComponent={this.renderFooter}
            />

        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
});

const mapStateToProps = state => ({

    towerId: state.auth.user ? state.auth.user.towerId : 0,
    data: state.notificationResident.data,
    isLoading: state.notificationResident.isLoading,
    initList: state.notificationResident.initList,
    isRefreshing: state.notificationResident.isRefreshing,
    currentPage: state.notificationResident.currentPage,
    rowPerPage: state.notificationResident.rowPerPage,
    emptyData: state.notificationResident.emptyData,
    outOfStock: state.notificationResident.outOfStock,
    error: state.notificationResident.error,
    isApplySearchKey: state.notificationResident.isApplySearchKey,
    searchKey: state.notificationResident.searchKey,
    user: state.auth.user,
    //errorProgress: state.departmentDetail.errorProgress,
})
const mapActionToProps = {
    loadDataHandle,
    resetStateByKey,
    refreshDataHandle,
    onSubmitEditing,
    onClearText,
    onChangeText,
    updateItemList,
    updateItemListNotify,
    updateBadge
}

//make this component available to the app
export default connect(mapStateToProps, mapActionToProps)(NotificationScreen);
