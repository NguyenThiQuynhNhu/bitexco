//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { get, helper } from '../../services/helper';
import colors from '../../theme/colors';
import ErrorContent from './ErrorContent';
import Strings from "../../utils/languages";

// create a component
class ListData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initList: false,
            currentPage: 0,
            rowPerPage: 20,
            outOfStock: false, // đánh dấu dữ liệu trên API đã load hết
            emptyData: false,
            isLoading: false,
            isRefreshing: false,
            searchKey: '',
            isApplySearchKey: false,
            error: null,
            data: []
        }
    }
    componentDidMount() {
        this.resetStateByKey({ initList: true });
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.state.initList !== nextState.initList && nextState.initList) {
            this.loadDataHandle({
                searchKey: nextState.isApplySearchKey ? nextState.searchKey : '',
                currentPage: nextState.currentPage + 1,
                rowPerPage: nextState.rowPerPage
            });
        }
        if (nextState.isRefreshing !== this.state.isRefreshing && nextState.isRefreshing && !nextState.isLoading) {
            this.loadDataHandle({
                searchKey: nextState.isApplySearchKey ? nextState.searchKey : '',
                currentPage: nextState.currentPage + 1,
                rowPerPage: nextState.rowPerPage
            });
        }
    }
    async loadDataHandle(dataRequest) {
        const { url, params, loadmore } = this.props.api
        const paramsRequest = loadmore ? { ...dataRequest, ...params } : params
        const ret = await get(url, paramsRequest);
        //console.log('unit')
        //console.log(ret)
        if (ret !== undefined && ret !== null) {
            if (ret !== -1 && ret.status == 200) {
                const newData = [...this.state.data, ...ret.data]
                this.setState({
                    initList: false,
                    isLoading: false,
                    isRefreshing: false,
                    data: newData,
                    emptyData: newData.length === 0,
                    outOfStock: ret.data.length < this.state.rowPerPage,
                    currentPage: ret.data.length > 0 ? this.state.currentPage + 1 : this.state.currentPage,
                    errors: { hasError: false, error: '' }
                });
            }
            else {
                this.setState({
                    initList: false,
                    isLoading: false,
                    isRefreshing: false,
                    errors: { hasError: true, error: '' }
                });
            }
        }
        else {
            this.setState({
                initList: false,
                isLoading: false,
                isRefreshing: false,
                errors: { hasError: true, error: '' }
            });
        }
    }
    resetStateByKey(obj) {
        this.setState(obj);
    }
    refreshDataHandle() {
        this.setState({
            currentPage: 0,
            isRefreshing: true,
            outOfStock: false,
            data: []
        });
    }
    renderFooter = () => {
        if (!this.state.isLoading || this.state.isRefreshing) return null;
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
            data,
            isRefreshing,
            currentPage,
            rowPerPage,
            isApplySearchKey,
            outOfStock,
            searchKey,
            error,
            emptyData
        } = this.state
        if (error && error.hasError) {
            return <ErrorContent title={Strings.app.error} />
        }
        if (emptyData) {
            return <ErrorContent title={Strings.app.emptyData} />
        }
        return (
            <View style={styles.container}>
                {this.props.api.loadmore ? <FlatList
                    refreshing={isRefreshing}
                    onRefresh={() => this.refreshDataHandle()}
                    style={{borderTopRightRadius: 20, marginTop: -20}}
                    data={data}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={this.props.renderItem}
                    ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: colors.grayBorder, marginHorizontal: 20 }} />}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentum && !outOfStock && currentPage > 0) {
                            const data = {
                                keyword: isApplySearchKey ? searchKey : '',
                                currentPage: currentPage + 1,
                                rowPerPage: rowPerPage
                            };
                            this.loadDataHandle(data);
                   
                        }
                    }}
                /> :
                    <FlatList
                        refreshing={isRefreshing}
                        onRefresh={() => this.refreshDataHandle()}
                        data={data || []}
                        style={{borderTopRightRadius: 20, marginTop: -20}}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={this.props.renderItem}
                        ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: colors.grayBorder }} />}
                        ListFooterComponent={this.renderFooter}
                    />}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopRightRadius: 20,
    },
});

//make this component available to the app
export default ListData;
