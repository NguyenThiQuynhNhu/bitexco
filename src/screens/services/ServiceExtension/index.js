//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Platform,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import ListItem from './ListItem'

import Toast, { DURATION } from 'react-native-easy-toast';
//components

import SearchBar from '../../../components/common/SearchBar';
import ErrorContent from '../../../components/common/ErrorContent';

import ButtonFilter from '../../../resident/components/Request/List/ButtonFilter';
//style
import colors from '../../../theme/colors';
import fontsize from '../../../theme/fontsize';

//data
import { loadDataHandle, refreshDataHandle, resetStateByKey } from '../../../actions/servicesExtension'

import Strings from '../../../utils/languages';
import NavBar from '../../../components/common/NavBar';
import { MyIcon } from '../../../theme/icons';
import { titleStyle } from '../../../theme/styles'

// create a component
class ServiceExtension extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: Strings.profile.setting,
        headerBackTitle: null,
        headerTintColor: '#fff',
        headerStyle: {
            backgroundColor: colors.appTheme,
            elevation: 0,
            borderBottomColor: 'transparent',
            borderBottomWidth: 0
        },
    })
    constructor(props) {
        super(props);
        this.state = {
            searchKey: '',
            isApplySearchKey: false,
            filter: [
                {
                    statusId: 1,
                    isFilter: false
                },
                {
                    statusId: 2,
                    isFilter: false
                },
                {
                    statusId: 3,
                    isFilter: false
                },
                {
                    statusId: 5,
                    isFilter: false
                }
            ],
            status: (this.props.navigation.state.params != undefined && this.props.navigation.state.params.idStatus != undefined) ? this.props.navigation.state.params.idStatus : 0,
            isShowSearch: false,
            dataStatus: this.props.dataStatus
        };
    }
    componentDidMount() {
        this.props.resetStateByKey({ key: 'initList', path: '', value: true });
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.errorResponse && nextProps.errorResponse !== this.props.errorResponse) {
            if (!nextProps.errorResponse.hasError) {
                this.props.refreshDataHandle()
            }
        }
        if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing) {
            const data = {
                towerId: this.props.towerId,
                statusId: this.state.status,
                keyword: this.state.isApplySearchKey ? this.state.searchKey : '',
                currentPage: nextProps.currentPage + 1,
                rowPerPage: this.props.rowPerPage
            };
            this.props.loadDataHandle(data);
            setTimeout(() => {
                //const ar = [];
                this.props.dataStatus.forEach(element => {
                    element.currentValue = this.state.status
                    //ar.push(element)
                });
                this.setState({ dataStatus: this.props.dataStatus })
            }, 500);
        }
        if (nextProps.initList && nextProps.initList !== this.props.initList) {

            const data = {
                towerId: this.props.towerId,
                keyword: this.state.isApplySearchKey ? this.state.searchKey : '',
                currentPage: nextProps.currentPage + 1,
                rowPerPage: this.props.rowPerPage
            };
            await this.props.loadDataHandle(data);
            //await this.setState({ dataStatus: this.props.dataStatus })
            setTimeout(() => {
                //const ar = [];
                this.props.dataStatus.forEach(element => {
                    element.currentValue = this.state.status
                    //ar.push(element)
                });
                this.setState({ dataStatus: this.props.dataStatus })
            }, 500);
        }
        if (nextProps.errorCreate && this.props.errorCreate !== nextProps.errorCreate) {
            if (!nextProps.errorCreate.hasError) {
                this.props.refreshDataHandle()
                this.refs.toast.show('Tạo yêu cầu thành công', DURATION.LENGTH_LONG);
            }
        }
        if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
            this.props.refreshDataHandle()
        }
    }
    componentWillUnmount() {
        this.props.resetStateByKey({ key: 'state' });
    }
    _renderContent() {
        const { emptyData, error, initList, data, isRefreshing, outOfStock, refreshDataHandle, loadDataHandle, isLoading } = this.props;
        if (initList) {
            return (
                <View
                    style={{
                        paddingVertical: 20,
                    }}
                >
                    <ActivityIndicator animating size="small" />
                </View>
            )
        }
        if (emptyData) {
            return <ErrorContent title={Strings.app.emptyData} onTouchScreen={() => this.props.refreshDataHandle(), () => this.setState({ dataStatus: this.props.dataStatus })} />
        }
        if (error && error.hasError) {
            return (
                <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.refreshDataHandle(), () => this.setState({ dataStatus: this.props.dataStatus })} />
            )
        }
        return (
            <FlatList
                keyExtractor={(item, index) => `${index}`}
                refreshing={isRefreshing}
                onRefresh={() => this._onRefresh()}
                //onRefresh={() => this.setState({dataStatus: this.props.dataStatus}), () => this.props.refreshDataHandle()}
                data={data}
                //ItemSeparatorComponent={() => <View style={{ backgroundColor: colors.grayBorder, height: 1 }} />}
                renderItem={this.renderItem}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.5}
                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
                onEndReached={() => {
                    if (!this.onEndReachedCalledDuringMomentum && !this.props.outOfStock && this.props.currentPage > 0 && !this.props.isLoading) {
                        const data = {
                            towerId: this.props.towerId,
                            statusId: this.state.status,
                            keyword: this.state.isApplySearchKey ? this.state.searchKey : '',
                            currentPage: this.props.currentPage + 1,
                            rowPerPage: this.props.rowPerPage
                        };
                        this.props.loadDataHandle(data);
                    }
                }}
            />
        );
    }
    async _onRefresh() {
        await this.props.refreshDataHandle();
        setTimeout(() => {
            this.props.dataStatus.forEach(element => {
                element.currentValue = this.state.status
                //ar.push(element)
            });
            this.setState({ dataStatus: this.props.dataStatus })
        }, 500);
    }
    renderItem = ({ item }) => {

        return <ListItem item={item}
            onPress={() => this.props.canNavigate ? this.props.navigation.navigate('serviceExtensionDetail', { id: item.id, avatar: item.logo }) : null}
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
        const {
            searchKey,
            isApplySearchKey,
            dataStatus
        } = this.state;
        const { isShowSearch } = this.state;
        return (
            <View style={styles.container}>
                {isShowSearch ? <NavBar
                    body={<SearchBar
                        autofocus={true}
                        value={searchKey}
                        onChangeText={(searchKey) => {
                            this.setState({ searchKey }, () => {
                                if (searchKey.length === 0) {
                                    if (this.state.isApplySearchKey) {
                                        this.setState({ searchKey: '', isApplySearchKey: false }, () => this.props.refreshDataHandle());
                                    }
                                }
                            });
                        }}
                        onSubmitEditing={() => this.setState({ isApplySearchKey: true }, () => this.props.refreshDataHandle())}

                        onClearText={() => {
                            const isApplySearchKeyOld = this.state.isApplySearchKey;
                            this.setState({ searchKey: '', isApplySearchKey: false }, () => { if (isApplySearchKeyOld) { this.props.refreshDataHandle() } });
                        }}
                        style={{
                            flex: 1,
                            margin: Platform.OS == 'ios' ? 5 : 10,
                            marginHorizontal: 10,
                        }}
                    />}
                    rightView={

                        <TouchableOpacity
                            onPress={() => {
                                const isApplySearchKeyOld = this.state.isApplySearchKey;
                                this.setState({ isShowSearch: false, searchKey: '', isApplySearchKey: false }, () => { if (isApplySearchKeyOld) { this.props.refreshDataHandle() } });
                            }}
                            style={{ padding: 10 }}>
                            <Text style={{ color: '#fff' }}>Huỷ</Text>
                        </TouchableOpacity>
                    }
                /> :
                    <NavBar
                        leftButton={<TouchableOpacity
                            style={{ padding: 10 }}
                            onPress={() => this.props.navigation.goBack(null)}
                        >
                            <MyIcon
                                name="arrow"
                                size={22}
                                color="#fff"
                            />
                        </TouchableOpacity>}
                        body={<Text style={titleStyle}>Dịch vụ</Text>}
                        rightView={
                            <TouchableOpacity
                                onPress={() => this.setState({ isShowSearch: true })}
                                style={{ padding: 10 }}>
                                <MyIcon
                                    size={25}
                                    name="search"
                                    color="#fff" />
                            </TouchableOpacity>
                        }
                    />}

                <View style={{ marginTop: -20, borderTopRightRadius: 20 }}>
                    {/* <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{
                            backgroundColor: '#fff',
                        }}
                    >
                        <ButtonFilter value={1} currentValue={this.state.status} onSelectedChange={this._onSelectedChange} style={{ paddingHorizontal: 5 }} />
                        <ButtonFilter value={2} currentValue={this.state.status} onSelectedChange={this._onSelectedChange} />
                        <ButtonFilter value={3} currentValue={this.state.status} onSelectedChange={this._onSelectedChange} />
                        <ButtonFilter value={5} currentValue={this.state.status} onSelectedChange={this._onSelectedChange} />

                    </ScrollView> */}
                    <FlatList
                    ItemSeparatorComponent={() => <View style={{ width: 1, backgroundColor: colors.grayBorder, marginVertical: 10 }} />}
                        data={dataStatus}
                        keyExtractor={(item, index) => `${index}`}
                        horizontal={true}
                        //pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        //legacyImplementation={false}
                        renderItem={(item) => {
                            return (
                                <View>
                                    <ButtonFilter value={item.item.statusId} currentValue={item.item.currentValue} title={item.item.statusName} total={item.item.total} onSelectedChange={this._onSelectedChange} style={{ paddingHorizontal: 5 }} />
                                </View>

                            )
                        }

                        }
                        onEndReachedThreshold={0.5}
                    />
                </View>
                {this._renderContent()}
                {/* <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('requestCreate')}
                    style={{
                        backgroundColor: colors.appTheme,
                        width: 50,
                        height: 50,
                        borderRadius: 35,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: 20,
                        right: 20
                    }}>
                    <MyIcon name="plus" size={20} color="#fff" />
                </TouchableOpacity> */}
               
                <Toast ref="toast" style={{ backgroundColor: colors.toast.success, opacity: 1, borderRadius: 5, padding: 10 }} />
            </View>)

    }
    _onSelectedChange = async (value) => {
        // if (value == this.state.status) {
        //     this.setState({ status: 0 }, () => this.props.refreshDataHandle())
        // } else {
        //     this.setState({ status: value }, () => this.props.refreshDataHandle())
        // }
        if (value == this.state.status) {
            const ar = [];
            await this.props.dataStatus.forEach(element => {
                element.currentValue = 0
                ar.push(element)
            });
            await this.setState({ dataStatus: ar })
            this.setState({ status: 0 }, () => this.props.refreshDataHandle())
        } else {
            const ar = [];
            await this.props.dataStatus.forEach(element => {
                element.currentValue = value
                ar.push(element)
            });
            await this.setState({ dataStatus: ar })
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
    towerId: state.auth.user ? state.auth.user.towerId : 0,
    initList: state.servicesExtension.initList,
    currentPage: state.servicesExtension.currentPage,
    rowPerPage: state.servicesExtension.rowPerPage,
    emptyData: state.servicesExtension.emptyData,
    outOfStock: state.servicesExtension.outOfStock,
    isLoading: state.servicesExtension.isLoading,
    data: state.servicesExtension.data,
    error: state.servicesExtension.error,
    isRefreshing: state.servicesExtension.isRefreshing,
    isApplySearchKey: state.servicesExtension.isApplySearchKey,
    searchKey: state.servicesExtension.searchKey,
    errorResponse: state.servicesExtensionDetail.errorResponse,
    canNavigate: state.servicesExtensionDetail.data == null,
    language: state.app.language == 'vi' ? 1 : 2,
    dataStatus:  state.drawer.dataStatusSeviceExtension,
});

const mapActionToState = {
    loadDataHandle,
    refreshDataHandle,
    resetStateByKey,
};

//make this component available to the app
export default connect(mapStateToProps, mapActionToState)(ServiceExtension);
