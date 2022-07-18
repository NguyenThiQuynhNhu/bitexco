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
    Item
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
import ListData from '../../../components/Notification/List/ListData';
import ButtonFilter from '../../../components/Notification/List/ButtonFilter';
//style
import colors from '../../../theme/colors';
import fontSize from '../../../theme/fontsize';
import NavBar from '../../../components/common/NavBar';

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
    onClearFilter,
    updateIsReadToList
} from '../../../actions/notification'
import { converStatusToColor, converTypeToString } from '../../../utils/notification';
import Strings from '../../../utils/languages';
import PrimaryButton from '../../../components/common/PrimaryButton';
import CircleView from '../../../components/common/CircleView';
import {
    loadBadge
} from '../../../actions/home';

// create a component
class ProposalList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depSelected: null,
            searchKey: '',
            isApplySearchKey: false,
            filter: [
                {
                    statusId: 0,
                    isFilter: false
                },
                {
                    statusId: 1,
                    isFilter: false
                },
                {
                    statusId: 2,
                    isFilter: false
                }
            ],
            typeId: 0,
            showFilter: false
        };
    }
    componentDidMount() {
        this.props.resetStateByKey({ key: 'initList', path: '', value: true })
    }

    componentWillReceiveProps(nextProps) {
        const { isRead, towerId, rowPerPage, isRefreshing, initList, createStatus, errorResponse, refreshDataHandle, depSelected } = this.props;
        if (nextProps.isRefreshing && nextProps.isRefreshing !== isRefreshing) {
            const data = {
                isRead: nextProps.isRead,
                typeId: this.state.typeId,
                //towerId,
                keyword: this.state.isApplySearchKey ? this.state.searchKey : '',
                currentPage: nextProps.currentPage + 1,
                rowPerPage,
                departmentId: nextProps.depSelected ? nextProps.depSelected.id : 0
            };
            this.props.loadDataHandle(data);
        }

        if (nextProps.initList && nextProps.initList !== initList) {

            const data = {
                isRead: nextProps.isRead,
                typeId: this.state.typeId,
                //towerId,
                keyword: this.state.isApplySearchKey ? this.state.searchKey : '',
                currentPage: nextProps.currentPage + 1,
                rowPerPage,
                departmentId: depSelected ? depSelected.id : 0
            };
            this.props.loadDataHandle(data);
        }

        if (nextProps.createStatus && createStatus !== nextProps.createStatus) {
            this.refs.toast.show('Tạo yêu cầu thành công', DURATION.LENGTH_LONG);
        }

        if (nextProps.errorResponse && nextProps.errorResponse !== errorResponse) {
            if (!nextProps.errorResponse.hasError) {
                refreshDataHandle()
            }
        }

        if (nextProps.towerId != towerId ||
            // nextProps.depSelected !== depSelected ||
            nextProps.isRead !== isRead
        ) {
            refreshDataHandle()
        }

    }

    componentWillUnmount() {
        this.props.resetStateByKey({ key: 'state' });
    }

    _renderContent() {
        const { emptyData, error, initList, data, isRefreshing, outOfStock, refreshDataHandle, loadDataHandle, isLoading, depSelected } = this.props;
        if (initList) {
            return (<View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator color={colors.appTheme} />
            </View>)
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
            <ListData updateIsReadToList={() => this.props.updateIsReadToList()}
                refreshing={isRefreshing}
                onRefresh={() => refreshDataHandle()}
                data={data || []}
                canNavigate={this.props.canNavigate}
                onEndReachedThreshold={0.5}
                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
                onEndReached={() => {
                    if (!this.onEndReachedCalledDuringMomentum && !this.props.outOfStock && this.props.currentPage > 0) {
                        const towerId = this.props.user.towerId
                        const data = {
                            isRead: this.props.isRead,
                            typeId: this.state.typeId,
                            //towerId,
                            keyword: this.state.isApplySearchKey ? this.state.searchKey : '',
                            currentPage: this.props.currentPage + 1,
                            rowPerPage: this.props.rowPerPage,
                            departmentId: depSelected ? depSelected.id : 0
                        };
                        this.props.loadDataHandle(data);
                    }
                }}
                navigation={this.props.navigation}
            />
        );
    }

    render() {
        const {
            searchKey,
            onSubmitEditing,
            onClearText,
            onChangeText,
            navigation,
            resetStateByKey,
            onFilter,
            onClearFilter,
            user
        } = this.props;
        const { depSelected, showFilter, typeId } = this.state;

        return (
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
                        <Text style={{
                            fontFamily: "Inter-Bold",
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "#ffffff"
                        }}>Thông báo</Text>
                        <Text style={{ fontFamily: "Inter-Bold", color: '#fff', alignSelf: 'center', fontSize: fontSize.small, fontWeight: 'bold' }}>Nhóm: {converTypeToString(typeId)}</Text>
                    </View>
                    }
                    rightView={<TouchableOpacity
                        onPress={() => this.setState({ showFilter: true })}
                        style={{ padding: 10 }}
                    >
                        <MyIcon
                            name="search"
                            size={25}
                            color="#fff"

                        />
                    </TouchableOpacity>}
                />
                {this._renderContent()}

                {showFilter && <View style={{ ...Device.defaultMarginTop(), height: '100%', width: '100%', position: 'absolute', backgroundColor: colors.appOverView }}>
                    <View style={{ width: '90%', margin: 20, alignSelf: 'center', padding: 10, backgroundColor: '#fff', justifyContent: 'space-between' }}>
                        <SearchBar
                            value={this.state.searchKey}
                            onChangeText={(searchKey) => {
                                this.setState({ searchKey }, () => {
                                    if (searchKey.length === 0) {
                                        if (this.state.isApplySearchKey) {
                                            this.setState({ searchKey: '', isApplySearchKey: false }, () => this.props.refreshDataHandle());
                                        }
                                    }
                                });
                            }}
                            onSubmitEditing={() => this.setState({ isApplySearchKey: true, showFilter: false }, () => this.props.refreshDataHandle())}

                            onClearText={() => {
                                const isApplySearchKeyOld = this.state.isApplySearchKey;
                                this.setState({ searchKey: '', isApplySearchKey: false }, () => { if (isApplySearchKeyOld) { this.props.refreshDataHandle() } });
                            }}

                        />
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('notificationType', { id: user.towerId, onSelected: (depSelected) => this.setState({ depSelected, typeId: depSelected.id }) })}
                            style={{ padding: 10, marginTop: 10, borderRadius: 5, backgroundColor: colors.gray2, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>{this.props.depSelected ? this.props.depSelected.name : depSelected ? depSelected.name : 'Chọn nhóm'}</Text>
                            <MyIcon
                                name="arrow-down"
                                size={20}
                                color={colors.gray1}
                            />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                            <PrimaryButton text="Bỏ lọc"
                                onPress={() => this.setState({ searchKey: '', isApplySearchKey: false, showFilter: false, depSelected: null, typeId: 0 }, () => onClearFilter())}
                            />
                            <PrimaryButton
                                visible={this.state.searchKey !== '' || this.props.depSelected !== null || depSelected !== null}
                                onPress={() => this.setState({ showFilter: false, isApplySearchKey: this.state.searchKey.length !== 0 }, () => onFilter({ depSelected }))}
                                text="Lọc dữ liệu"
                                style={{ marginLeft: 10 }} />
                        </View>

                    </View>
                    <TouchableOpacity
                        onPress={() => this.setState({ showFilter: false })}
                        style={{ borderRadius: 45, backgroundColor: colors.appTheme, padding: 10, position: 'absolute', top: 5, right: 5 }}>
                        <MyIcon
                            name="no"
                            color="#fff"
                            size={10}
                        />
                    </TouchableOpacity>
                </View>}
                <Toast ref="toast" style={{ backgroundColor: colors.toast.success, opacity: 1, borderRadius: 5, padding: 10 }} />
            </View >)

    }

    _onSelectedChange = (value) => {
        if (value == this.state.status) {
            this.setState({ status: 0 }, () => this.props.refreshDataHandle())
        } else {
            this.setState({ status: value }, () => this.props.refreshDataHandle())
        }
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
const mapStateToProps = (state) => ({

    initList: state.notification.initList,
    currentPage: state.notification.currentPage,
    rowPerPage: state.notification.rowPerPage,
    emptyData: state.notification.emptyData,
    outOfStock: state.notification.outOfStock,
    isLoading: state.notification.isLoading,
    data: state.notification.data,
    error: state.notification.error,
    isRefreshing: state.notification.isRefreshing,
    isApplySearchKey: state.notification.isApplySearchKey,
    searchKey: state.notification.searchKey,
    createStatus: state.notification.createStatus,
    canNavigate: true,
    language: state.app.language,
    isRead: state.notification.isRead,
    user: state.auth.user,
    typeId: state.notification.typeId,
    towerId: state.auth.user.towerId,
    depSelected: state.notification.depSelected,
    errorResponse: state.requestDetail.errorResponse,
});

const mapActionToState = {
    loadDataHandle,
    refreshDataHandle,
    resetStateByKey,
    onSubmitEditing,
    onChangeText,
    onClearText,
    onFilter,
    onClearFilter,
    updateIsReadToList,
    loadBadge
};

//make this component available to the app
export default connect(mapStateToProps, mapActionToState)(ProposalList);
