//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import ErrorContent from '../../components/common/ErrorContent';
import { get } from '../../services/helper';
import Strings from '../../utils/languages';

// create a component
class ContentWebView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowModal: false,
            initComponent: false,
            emptyData: false,
            isLoading: false,
            isLoadingWeb: true,
            isRefreshing: false,
            errors: null,
            data: {}
        };
        this.handleNavigationChange = this.handleNavigationChange.bind(this);
    }
    componentDidMount() {
        this.resetStateByObject({ initComponent: true });
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.state.initComponent !== nextState.initComponent && nextState.initComponent) {
            this.loadDataHandle();
        }
        if (nextState.isRefreshing !== this.state.isRefreshing && nextState.isRefreshing && !nextState.isLoading) {
            this.loadDataHandle();
        }
    }
    resetStateByObject(obj) {
        this.setState(obj);
    }
    refreshDataHandle() {
        this.setState({
            isRefreshing: true,
            data: []
        });
    }
    handleNavigationChange(navState) {
        if (navState.title) {
            this.setState({ isLoadingWeb: false });
        }
    }
    async loadDataHandle() {
        this.setState({
            isLoading: true,
            emptyData: false,
            errors: null
        });
        const { api, params } = this.props
        const ret = await get(api, params);
        if (ret !== undefined && ret !== null) {
            if (ret !== -1 && ret.status == 200) {
                this.setState({
                    initComponent: false,
                    isLoading: false,
                    isRefreshing: false,
                    data: ret.data,
                    emptyData: ret.data[this.props.data.contentName] === null,
                    errors: { hasError: false, error: '' }
                }, () => this.props.onSuccess(ret));
            }
            else {
                this.setState({
                    initComponent: false,
                    isLoading: false,
                    isRefreshing: false,
                    errors: { hasError: true, error: '' }
                }, () => this.props.onError(ret));
            }
        }
        else {
            this.setState({
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                errors: { hasError: true, error: '' }
            }, () => this.props.onError(ret));
        }
    }
    render() {
        if (this.state.initComponent) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <ActivityIndicator />
                    <Text>{Strings.app.loading}</Text>
                </View>
            );
        }
        if (this.state.errors && this.state.errors.hasError) {
            return (
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => this.setState({ initComponent: true })}
                >
                    <ErrorContent
                        logo="layer" title={Strings.app.error} visibleButton={false} />
                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginBottom: 50 }}>

                        <Text style={{ color: '#cccccc', marginLeft: 10 }}>{Strings.app.touchToRefresh}</Text>
                    </View >

                </TouchableOpacity >
            );
        }
        if (this.state.emptyData) {
            return (
                <ErrorContent logo="layer" title={Strings.app.emptyData} buttonText="Quay lại" onPressButton={() => this.props.navigation.goBack()} />
            );
        }
        return (
            <View style={{ flex: 1 }} >
                <View style={{ height: '100%', width: '100%' }}>
                    <WebView
                        source={{ html: `<html xmlns="http://www.w3.org/1999/xhtml"><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /></head><style>img{ width: 100%  !important; height:auto !important}</style><body><div style='font-size: 36px; font-weight: bold'><div>${this.props.data.title}</div><div style='font-size: 14px; color: #999999; font-weight: normal; margin-bottom: 20'>${this.props.data.time}</div></div>${this.state.data[this.props.data.contentName]}</body></html>` }}
                        scalesPageToFit={true}
                        startInLoadingState={Platform.OS === 'ios' ? false : this.state.isLoadingWeb}
                        javaScriptEnabled={true}

                        domStorageEnabled={true}
                        originWhitelist={['*']}
                        mixedContentMode='always'
                    />
                </View>
                {/* <WebView
                    style={{ flex: 1 }}
                    startInLoadingState={Platform.OS === 'ios' ? false : this.state.isLoadingWeb}
                    source={{ html: `<html xmlns="http://www.w3.org/1999/xhtml"><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /></head><style>img{ width: 100%  !important; height:auto !important}</style><body><div style='font-size: 36px; font-weight: bold'><div>${this.props.data.title}</div><div style='font-size: 14px; color: #999999; font-weight: normal; margin-bottom: 20'>${this.props.data.time}</div></div>${this.state.data[this.props.data.contentName]}</body></html>` }}
                    scrollEnabled
                    javaScriptEnabled
                    domStorageEnabled
                    onNavigationStateChange={this.handleNavigationChange}
                /> */}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
});

//make this component available to the app
export default ContentWebView;
