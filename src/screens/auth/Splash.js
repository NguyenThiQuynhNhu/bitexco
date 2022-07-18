import React, { Component } from 'react'
import {
    View,
    Platform,
    ActivityIndicator,
    Image,
    Text
} from 'react-native';
import { connect } from 'react-redux';

import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';
import { registerKilledListener, registerAppListener } from '../../fcm/Listeners';
import firebase from 'firebase';
//import SplashScreen from 'react-native-splash-screen'
import { navHome, navLogIn } from '../../actions/nav';
import { logo } from '../../theme/images';
import { Screen } from '../../utils/device';
import colors from '../../theme/colors';
import { onAuthUserValid, onAuthUserInvalid, demo } from '../../actions/auth';
import { NavigationActions, StackActions } from 'react-navigation';
import { getRequestStatusTotal, getVendorsList } from '../../actions/request';
import { getServicesExtensionStatusTotal } from '../../actions/servicesExtension'
import { getServicesBasicStatusTotal } from '../../actions/servicesBasic'
//
import { checkAnswerSurvey } from '../../resident/actions/surveyDetail';
registerKilledListener();
class Splash extends Component {
    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        FCM.createNotificationChannel({
            id: 'car_status',
            name: 'Car status',
            description: 'Notifies when changes car status',
            priority: 'max',
        });
        // FCM.getInitialNotification().then(notif => {
        //     FCM.setBadgeNumber(999);
        // })
        let resetAction;
        const { saveToken, user, navLogIn, navHome, onAuthUserValid, onAuthUserInvalid } = this.props
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                //console.log('propsS', this.props)
                if (this.props.user && this.props.user.towerId) {
                    this.props.getRequestStatusTotal({ towerId: this.props.user.towerId })
                    this.props.getServicesExtensionStatusTotal({ towerId: this.props.user.towerId })
                    this.props.getServicesBasicStatusTotal({ towerId: this.props.user.towerId })
                }

                FCM.getInitialNotification().then(notif => {
                    // if(notif.CountUnread){
                    //     FCM.setBadgeNumber(Number(notif.CountUnread));
                    // }
                    if (notif.actionId == "10") {
                        this.props.checkAnswerSurvey(false)
                    }
                    console.log(notif)
                    const itemData = notif.item ? JSON.parse(notif.item) : null
                    if (notif.actionId && (this.props.auth.type == 'em') && notif.channel) {

                        if (notif.actionId == '1') {
                            this.props.navigation.navigate('requestDetail', { id: notif.itemData.id, departmentId: notif.itemData.departmentId, title: notif.itemData.title })
                        } else if (notif.actionId == '2') {
                            this.props.navigation.navigate('newsDetail', { item: {id: itemData.linkid, towerId: itemData.towerId, towerName: itemData.towerName}, type: 1 })
                        } else if (notif.actionId == '3') {
                            this.props.navigation.navigate('serviceBasicDetail', { id: notif.itemData.id })
                        } else if (notif.actionId == '4') {
                            this.props.navigation.navigate('serviceExtensionDetail', { id: notif.itemData.id })
                        }
                    }
                    if (notif.actionId && (this.props.auth.type == 'em') && !notif.channel) {

                        if (notif.actionId == '1') {
                            this.props.navigation.navigate('requestDetail', { id: itemData.requestId, departmentId: itemData.departmentId, title: itemData.title })
                        } else if (notif.actionId == '2') {
                            this.props.navigation.navigate('newsDetail', { item: {id: itemData.linkid, towerId: itemData.towerId, towerName: itemData.towerName}, type: 1 })
                        } else if (notif.actionId == '3') {
                            this.props.navigation.navigate('serviceBasicDetail', { id: itemData.id })
                        } else if (notif.actionId == '4') {
                            this.props.navigation.navigate('serviceExtensionDetail', { id: itemData.id })
                        }
                    }

                    if (notif.actionId && this.props.auth.type == 're' && notif.channel) {

                        if (notif.actionId == '1') {
                            this.props.navigation.navigate('requestDetailResident', notif.itemData)
                        } else if (notif.actionId == '2') {
                            this.props.navigation.navigate('newsDetail', { item: {id: notif.itemData.linkid, towerId: notif.itemData.towerId, towerName: notif.itemData.towerName}, type: 1 })
                        } else if (notif.actionId == '3') {
                            this.props.navigation.navigate('newsDetail', { item: notif.itemData, type: notif.itemData.typeId })
                        } else if (notif.actionId == '4') {
                            this.props.navigation.navigate('serviceExtensionDetailResident', { id: notif.itemData.id });
                        } else if (notif.actionId == '10') {
                            this.props.navigation.navigate('surveyDetail', { id: notif.itemData.id, name: notif.itemData.title })
                        } else if (notif.actionId == '13') {
                            this.props.navigation.navigate('carCardList')
                        } else if (notif.actionId == '14') {
                            this.props.navigation.navigate('carCardList')
                        }
                    }
                    if (notif.actionId && this.props.auth.type == 're' && !notif.channel) {

                        if (notif.actionId == '1') {
                            this.props.navigation.navigate('requestDetailResident', itemData)
                        } else if (notif.actionId == '2') {
                            this.props.navigation.navigate('newsDetail', { item: {id: itemData.linkid, towerId: itemData.towerId, towerName: itemData.towerName}, type: 1 })
                        } else if (notif.actionId == '3') {
                            this.props.navigation.navigate('newsDetail', { item: itemData, type: itemData.typeId })
                        } else if (notif.actionId == '4') {
                            this.props.navigation.navigate('serviceExtensionDetailResident', { id: itemData.id });
                        } else if (notif.actionId == '10') {
                            this.props.navigation.navigate('surveyDetail', { id: itemData.id, name: itemData.title })
                        } else if (notif.actionId == '13') {
                            this.props.navigation.navigate('carCardList')
                        } else if (notif.actionId == '14') {
                            this.props.navigation.navigate('carCardList')
                        }
                    }
                    {/*switch (notif.actionId && (this.props.navigation.state.params.type == 'em' && this.props.auth.type == 'em')) {
                        case "1"://Yêu cầu
                            setTimeout(() => {
                                this.props.navigation.navigate('requestDetail', { id: itemData.id, departmentId: itemData.departmentId, title: itemData.title })
                            }, 500)
                            break;
                        case "2"://Tin tức
                            //     setTimeout(() => {
                            //         this.props.navigation.navigate('newsDetail', { item: itemData, type: itemData.typeId })
                            //     }, 500)
                            break;
                        case "3":// Tiện ích
                            setTimeout(() => {
                                this.props.navigation.navigate('serviceBasicDetail', { id: itemData.id })
                            }, 500)
                            break;
                        case "4":// Dịch vụ
                            setTimeout(() => {
                                this.props.navigation.navigate('serviceExtensionDetail', { id: itemData.id })
                            }, 500)
                            break;
                    }
                    switch (notif.actionId && (this.props.navigation.state.params.type == 're' && this.props.auth.type == 're')) {
                        case "1"://Yêu cầu
                            setTimeout(() => {
                                this.props.navigation.navigate('requestDetailResident', itemData)
                            }, 500)
                            break;

                        case "2"://Tin tức
                            setTimeout(() => {
                                this.props.navigation.navigate('newsDetail', { item: itemData, type: itemData.typeId })
                            }, 500)
                            break;

                        case "3"://Tiện ích
                            setTimeout(() => {
                                this.props.navigation.navigate('serviceBasicDetail', { id: itemData.id });
                            }, 500)
                            break;

                        case "4"://Dịch vụ
                            setTimeout(() => {
                                this.props.navigation.navigate('serviceExtensionDetailResident', { id: itemData.id });
                            }, 500)
                            break;
                        case "9"://Dịch vụ
                            setTimeout(() => {
                                this.props.navigation.navigate('handoverSchedule', { date: item.dateHandover })
                            }, 500);
                            break;
                        case "5"://Khảo sát
                            setTimeout(() => {
                                this.props.navigation.navigate('surveyDetail', { id: itemData.id, name: itemData.title })
                            }, 500);
                            break;
                    }*/}
                });
                try {
                    let result = FCM.requestPermissions({
                        badge: true,
                        sound: true,
                        alert: true
                      });
                } catch (e) {
                    console.error(e);
                }
                if (this.props.navigation.state.params.type == 'em' || (this.props.navigation.state.params.type == undefined && this.props.auth.type == 'em')) {
                    console.log('em như')
                     resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'drawer' })],
                    });
                } else if (this.props.navigation.state.params.type == 're' || (this.props.navigation.state.params.type == undefined && this.props.auth.type == 're')) {
                    console.log('re như')
                     resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'main' })],
                    });
                }
            } else {
                resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'login' })],
                });
            }
             this.props.navigation.dispatch(resetAction);
        })
    }
    render() {
        const { auth } = this.props;
        //console.log('auth', auth)
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Image
                    source={logo}
                    style={{
                        width: 200,
                        height: 200,
                        marginTop: (Screen.height / 2) - 250,
                        resizeMode: 'contain'
                    }}
                />

                <ActivityIndicator animating size="small" color={colors.appTheme} />
                <Text style={{
                    marginBottom: 40, fontFamily: "OpenSans-Regular",
                    fontSize: 10,
                    fontWeight: "normal",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#a0a0a0"
                }}>© 2021 DIP Vietnam. All rights reserved.</Text>
            </View>
        )
    }

}

const mapStateToProps = state => ({
    user: state.auth.user,
    saveToken: state.auth.saveToken,
    enableVibrate: state.app.enableVibrate,
    enableSound: state.app.enableVibrate,
    auth: state.auth
})

const mapActionToProps = {
    navLogIn,
    navHome,
    onAuthUserValid,
    onAuthUserInvalid,
    demo,
    getRequestStatusTotal,
    getServicesExtensionStatusTotal,
    getServicesBasicStatusTotal,
    checkAnswerSurvey
}

export default connect(mapStateToProps, mapActionToProps)(Splash)
