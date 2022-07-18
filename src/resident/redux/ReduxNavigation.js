import React, { Fragment } from 'react'
import { BackHandler, Alert, View, SafeAreaView, StatusBar } from 'react-native'
import { connect } from "react-redux"
import { NavigationActions } from 'react-navigation'
import AppWithNavigationState from '../navigators/AppNavigators';
import Strings from '../utils/languages';
import colors from '../theme/colors';
import Device from '../utils/device'

class ReduxNavigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backPress: false,
            isConnected: true
        };
        this.handleConnectionChange = this.handleConnectionChange.bind(this)
        this.onCheckNetwork = this.onCheckNetwork.bind(this)
    }

    componentWillMount() {
        Strings.setLanguage(this.props.language);
        // NetInfo.isConnected.addEventListener(
        //     'connectionChange',
        //     this.handleConnectionChange
        // )
        // if (Platform.OS === 'android') {
        //     this.onCheckNetwork()
        // }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.message && nextProps.message !== this.props.message) {
            this.notification.show({
                title: 'You pressed it!',
                message: 'The notification has been triggered',
                onPress: () => Alert.alert('Alert', 'You clicked the notification!'),
            })
        }
        if (this.props.language !== nextProps.language) {
            Strings.setLanguage(nextProps.language);
        }

    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress.bind(this));
    }

    componentWillUnmount() {

        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress.bind(this));
    }

    onBackPress() {
        const { dispatch, nav } = this.props;
        const routeNameCurrent = this.getCurrentRouteName(nav);
        if (routeNameCurrent === 'login' || routeNameCurrent === 'vendors') {
            if (routeNameCurrent === 'vendors') {
                Alert.alert('Xác nhận', 'Bạn có muốn thoát ứng dụng?', [
                    { text: 'HUỶ', onPress: () => undefined },
                    { text: 'OK', onPress: () => BackHandler.exitApp() }
                ]);
                return true;
            }
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    }

    render() {
        const { nav, dispatch } = this.props

        //console.log(this.props)
        return (
            <Fragment>
                <SafeAreaView style={{ flex: 0, backgroundColor: colors.appTheme, border: 0 }} />
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', border: 0 }}>
                    <StatusBar barStyle="light-content" />
                    <View style={{
                        ...Device.defaultMarginBottom(),
                        flex: 1, marginTop: -2
                    }}>
                        <AppWithNavigationState screenProps={{ towerLogoUrl: this.props.towerLogoUrl }} state={nav} dispatch={dispatch} />

                    </View>

                </SafeAreaView>
            </Fragment>
        );
    }

    async onCheckNetwork() {
        await NetInfo.isConnected.fetch().then().done(isConnected => this.setState({ isConnected }));
    }

    handleConnectionChange(isConnected) {
        this.setState({ isConnected: isConnected });
    }

    getCurrentRouteName(navState) {
        if (Object.prototype.hasOwnProperty.call(navState, 'index')) {
            return this.getCurrentRouteName(navState.routes[navState.index]);
        }
        return navState.routeName;
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
    towerLogoUrl: state.auth.user ? state.auth.user.towerLogoUrl : '',
    message: state.notification.message,
    language: state.app.language
})

export default connect(mapStateToProps)(ReduxNavigation)