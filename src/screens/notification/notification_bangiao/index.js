//import liraries
import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';

import moment from 'moment';
import 'moment/locale/vi';

import Strings from '../../../utils/languages';
import { loadDataHandle, resetStateByKey, refreshDataHandle, onSubmitEditing, onChangeText, onClearText } from '../../../actions/notification_bangiao';
import ErrorContent from '../../../components/common/ErrorContent';
import Loader_Detail from '../../../utils/Loader_Detail';

import ListItem from './ListItem';
// import { REOTP_CODE_REQUEST } from '../../actions/actionTypes';
import NavBar from '../../../components/common/NavBar';
import { MyIcon } from '../../../theme/icons';
import colors from '../../../theme/colors';
import fontsize from '../../../theme/fontsize';
import SearchBar from '../../../components/common/SearchBar';
// import { goBack } from '../../../utils/Utils';

// create a component

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
        //console.log('this.props.navigation.getParam(item) ',this.props.navigation.getParam('item'))
        // console.log(this)
        this.props.resetStateByKey({ key: 'initList', path: '', value: true });

        // setTimeout(()=>{
        //     this.props.navigation.navigate('newsDetail', { item:this.props.data[3], type: 1 })
        // },500)
    }

    componentWillReceiveProps(nextProps) {
        const item = this.props.navigation.getParam('item')
        if (nextProps.initList && nextProps.initList !== this.props.initList) {
            const data = {
                towerId:this.props.user.towerId,
                keyword: nextProps.isApplySearchKey ? searchKey : '',
                currentPage: nextProps.currentPage + 1,
                rowPerPage: this.props.rowPerPage,
                TypeNews: item?item.Id : 0,
                employeeId: this.props.user.id,
            }
            this.props.loadDataHandle(data);
        }
        if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing && !nextProps.isLoading) {
            const data = {
                towerId:this.props.user.towerId,
                keyword: nextProps.isApplySearchKey ? nextProps.searchKey : '',
                currentPage: nextProps.currentPage + 1,
                rowPerPage: this.props.rowPerPage,
                TypeNews: item?item.Id : 0,
                employeeId: this.props.user.id,
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
            // requestId,
            // shortDescription,
            imageUrl,
            towerName,
            Id,
            Title
        } = item
        return <ListItem
            item={item}
            onPress={() => {
                this.props.navigation.navigate('Notification_Bangiao_Detail', { item, type: 1 })
                // if (actionId == 2) {
                //     this.props.navigation.navigate('newsDetail', { item, type: 1 })
                // } else {
                //     // console.log('request nho')
                //     // return
                //     this.props.navigation.navigate('requestDetail',
                //         {
                //             id:Id,// requestId,
                //             title: Title,//shortDescription,
                //             logo: imageUrl,
                //             towerName
                //         })
                // }

            }}
        />

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
        const { searchKey, onSubmitEditing, onChangeText, onClearText } = this.props;
        const { isShowSearch } = this.state;
        const item = this.props.navigation.getParam('item')
        return (
            <View style={{ flex: 1 }}>

                {isShowSearch ? <NavBar
                    body={<SearchBar
                        autofocus={true}
                        value={searchKey}
                        onChangeText={(searchKey) => onChangeText({ searchKey })}
                        onSubmitEditing={onSubmitEditing}
                        onClearText={onClearText}
                        style={{
                            flex: 1,
                            margin: Platform.OS == 'ios' ? 5 : 10,
                            marginHorizontal: 10,
                        }}
                    />}
                    rightView={
                        <TouchableOpacity
                            onPress={() => this.setState({ isShowSearch: false }, onClearText)}
                            style={{ padding: 10 }}>
                            <Text style={{ color: '#fff' }}>{Strings.app.cancel}</Text>
                        </TouchableOpacity>
                    }
                /> :
                    <NavBar
                        leftButton={
                            <TouchableOpacity 
                                onPress={() => {
                                    this.props.navigation.goBack()
                                }} 
                                style={{ padding: 10 }}>
                                   <MyIcon name="arrow" color={colors.white} size={20} />
                            </TouchableOpacity>}
                        // body={<Text style={{ alignSelf: 'center', color: '#fff', fontSize: fontsize.larg }}>PHẢN ÁNH</Text>}
                        body={<Text style={{ alignSelf: 'center', color: '#fff', fontSize: fontsize.larg }}>{(item?item.name : 'thông báo').toLocaleUpperCase()}</Text>}
                        rightView={
                            <TouchableOpacity
                                onPress={() => {
                                    // this.setState({ isShowSearch: true })
                                }}
                                style={{ padding: 10 }}>
                                <MyIcon
                                    size={20}
                                    name="search"
                                    color={colors.appTheme} />
                            </TouchableOpacity>
                        }
                    />}
                {this.renderContent()}
            </View>
        )
    }
    renderContent() {
        const { emptyData, error, initList, data, isRefreshing, outOfStock, refreshDataHandle, isLoading } = this.props;

        if(isLoading){
            return <Loader_Detail />
        }

        if (emptyData) {
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
                // onEndReachedThreshold={0.5}
                // onEndReached={() => {
                //     if (!this.onEndReachedCalledDuringMomentum
                //         && !this.props.outOfStock
                //         && this.props.currentPage > 0
                //         && !this.props.isLoading
                //     ) {
                //         const data = {
                //             towerId: this.props.towerId,
                //             keyword: this.props.isApplySearchKey ? this.props.searchKey : '',
                //             currentPage: this.props.currentPage + 1,
                //             rowPerPage: this.props.rowPerPage,
                //             typeNews: 1
                //         }
                //         this.props.loadDataHandle(data);

                //     }
                // }}
                // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
                // ListFooterComponent={this.renderFooter}
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
    user: state.auth.user,
    //towerId: state.auth.building===null ? 0 : state.auth.building.Id,
    data: state.notification_bangiao.data,
    isLoading: state.notification_bangiao.isLoading,
    initList: state.notification_bangiao.initList,
    isRefreshing: state.notification_bangiao.isRefreshing,
    currentPage: state.notification_bangiao.currentPage,
    rowPerPage: state.notification_bangiao.rowPerPage,
    emptyData: state.notification_bangiao.emptyData,
    outOfStock: state.notification_bangiao.outOfStock,
    error: state.notification_bangiao.error,
    isApplySearchKey: state.notification_bangiao.isApplySearchKey,
    searchKey: state.notification_bangiao.searchKey,
    // errorProgress: state.departmentDetail.errorProgress,
})
const mapActionToProps = {
    loadDataHandle,
    resetStateByKey,
    refreshDataHandle,
    onSubmitEditing,
    onClearText,
    onChangeText
}

//make this component available to the app
export default connect(mapStateToProps, mapActionToProps)(NotificationScreen);
