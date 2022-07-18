import React, { Component, Fragment } from 'react'
import {
    View,
    Platform,
    ActivityIndicator,
    Image,
    Text,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';

import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';
import { registerKilledListener, registerAppListener } from '../../fcm/Listeners';
import firebase from 'firebase';
import SplashScreen from 'react-native-splash-screen'
import { navHome, navLogIn } from '../../actions/nav';
import { logo } from '../../theme/images';
import colors from '../../theme/colors';
import { onAuthUserValid, onAuthUserInvalid } from '../../actions/auth';

//import  SafeAreaView  from 'react-native-safe-area-view'

registerKilledListener();

class Splash extends Component {
    static navigationOptions = {
        header: null
    }

    // componentDidMount() {
    //     let resetAction;
    //     const { saveToken, user, navLogIn, navHome, onAuthUserValid, onAuthUserInvalid } = this.props
    //     this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    //         console.log(user)
    //         if (user) {
    //             FCM.getInitialNotification().then(notif => {
    //                 const itemData = JSON.parse(notif.item);
    //                 switch (notif.actionId) {
    //                     case "1"://Yêu cầu
    //                         setTimeout(() => {
    //                             this.props.navigation.navigate('requestDetail', itemData)
    //                         }, 500)
    //                         break;

    //                     case "2"://Tin tức
    //                         setTimeout(() => {
    //                             this.props.navigation.navigate('newsDetail', { item: itemData, type: itemData.typeId })
    //                         }, 500)
    //                         break;

    //                     case "3"://Tiện ích
    //                         setTimeout(() => {
    //                             this.props.navigation.navigate('serviceBasicDetail', { id: itemData.id });
    //                         }, 500)
    //                         break;

    //                     case "4"://Dịch vụ
    //                         setTimeout(() => {
    //                             this.props.navigation.navigate('serviceExtensionDetailResident', { id: itemData.id });
    //                         }, 500)
    //                         break;
    //                 }
    //             });
    //             try {
    //                 let result = FCM.requestPermissions({ badge: true, sound: true, alert: true });
    //             } catch (e) {
    //                 console.error(e);
    //             }

    //             resetAction = StackActions.reset({
    //                 index: 0,
    //                 actions: [NavigationActions.navigate({ routeName: 'main' })],
    //             });
    //         } else {
    //             resetAction = StackActions.reset({
    //                 index: 0,
    //                 actions: [NavigationActions.navigate({ routeName: 'login' })],
    //             });
    //         }
    //         this.props.navigation.dispatch(resetAction);

    //     })
    //     SplashScreen.hide();
    // }

    render() {
        return (
            <Fragment >
                {/* <SafeAreaView style={{ flex: 0, backgroundColor: colors.appTheme }} />
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <StatusBar barStyle="light-content" />

                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: 50
                        }}
                    >
                        <Image
                            source={logo}
                            style={{
                                width: 200,
                                height: 200
                            }}
                        />

                        <View style={{ paddingVertical: 20 }} >
                            <ActivityIndicator animating size="small" />
                        </View>

                        <View
                            style={{
                                height: 70,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ marginTop: 5 }}>© 2020 DIP MIEN TRUNG. All rights reserved.</Text>
                            <Text style={{ marginTop: 5 }}>Developed by DIP.VN</Text>
                        </View>
                    </View>

                </SafeAreaView> */}
            </Fragment>
        )
    }

}

const mapStateToProps = state => ({
    user: state.auth.user,
    saveToken: state.auth.saveToken,
    enableVibrate: state.app.enableVibrate,
    enableSound: state.app.enableVibrate,
})

const mapActionToProps = {
    navLogIn,
    navHome,
    onAuthUserValid,
    onAuthUserInvalid,
}

export default connect(mapStateToProps, mapActionToProps)(Splash)
