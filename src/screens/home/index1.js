import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Platform, StyleSheet, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '../../components/common/NavBar';
import IconButton from '../../components/common/IconButton';
import { titleStyle } from '../../theme/styles'
import { Screen } from '../../utils/device'
import colors from '../../theme/colors';
import fontsize from '../../theme/fontsize';
import { MyIcon } from '../../theme/icons';
import Strings from '../../utils/languages';

import {
    loadDataHandle,
    setProps,
    loadBadge
} from '../../actions/home';
import { getRequestStatusTotal, getVendorsList } from '../../actions/request';
import { getServicesExtensionStatusTotal } from '../../actions/servicesExtension'
import { getServicesBasicStatusTotal } from '../../actions/servicesBasic'
import ErrorContent from '../../components/common/ErrorContent';
import FCM, { FCMEvent, NotificationType, WillPresentNotificationResult, RemoteNotificationResult } from 'react-native-fcm';
import { postFCMToken, delFCMTokenResident } from '../../actions/auth';
import ImageProgress from '../../components/common/ImageProgress';
import { default_baner } from '../../theme/images';
import SwipeablePanel from 'rn-swipeable-panel';
import { converStatusToColor2 } from '../../resident/utils/serviceBasic';
import { resetStateByKey as resetRequest } from '../../actions/request';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUnnormal: props.user ? props.user.isUnnormal : false,
            menus: [
                {
                    id: 1,
                    name: 'Ca trực',
                    icon: 'calendar-clock'
                },
                {
                    id: 2,
                    name: 'Công việc',
                    myIcon: 'layers',
                    dataStatus: props.dataStatus
                },
                {
                    id: 3,
                    name: 'Checklist',
                    icon: 'clipboard-check-outline'
                },
                // {
                //     id: 18,
                //     name: 'checklist offline',
                //     icon: 'clipboard-check-outline'
                // },
                {
                    id: 4,
                    name: 'Phiếu đề xuất',
                    icon: 'message-settings-variant'
                },
                {
                    id: 5,
                    name: 'Kiểm tra định kỳ',
                    icon: 'settings-box'
                },
                // {
                //     id: 6,
                //     name: 'thông báo',
                //     icon: 'volume-low'
                // },
                {
                    id: 7,
                    name: 'Điện',
                    myIcon: 'electric'
                },
                {
                    id: 8,
                    name: 'Nước',
                    myIcon: 'water'
                },
                {
                    id: 13,
                    name: 'Gas',
                    myIcon: 'gas'
                },
                {
                    id: 14,
                    name: 'Bàn giao nội bộ',
                    icon: 'home'
                },
                {
                    id: 15,
                    name: 'Bàn giao khách hàng',
                    icon: 'home-account'
                },
                // {
                //     id: 16,
                //     name: 'nhận thêm căn bàn giao',
                //     icon: 'home-plus'
                // },
                // {
                //     id: 17,
                //     name: 'thông báo bàn giao',
                //     icon: 'volume-low'
                // },

                // {
                //     id: 10,
                //     name: 'ds đổi ca',
                //     icon: 'calendar-clock'
                // },

                // {
                //     id: 9,
                //     name: 'Mở rộng',
                //     icon: 'dots-vertical'
                // }
                {
                    id: 19,
                    name: 'Dịch vụ',
                    myIcon: 'utility',
                    dataStatus: props.dataStatusServicesBasic
                },
                {
                    id: 20,
                    name: 'Tiện ích',
                    myIcon: 'ic_tab_tien_ich'
                },
            ],
            menusMore: [
                {
                    id: 10,
                    name: 'ds đổi ca',
                    icon: 'calendar-clock'
                },
                {
                    id: 11,
                    name: 'Nhận ca',
                    icon: 'layers'
                },
                {
                    id: 12,
                    name: 'Bàn giao ca',
                    myicon: 'clipboard-check-outline'
                },
            ],
            swipeablePanelActive: false,
            dataStt: 0
        };
    }

    async componentDidMount() {
        FCM.getFCMToken().then(token => {
            this.props.postFCMToken(token, 'vendor');
            //this.props.delFCMTokenResident(token);
        });
        const request = {
            towerId: this.props.user.towerId
        }
        this.props.loadDataHandle(request);
        this.props.loadBadge();
        this.props.getRequestStatusTotal({ towerId: this.props.user.towerId })
        this.props.getServicesBasicStatusTotal({ towerId: this.props.user.towerId })
        this.props.getServicesExtensionStatusTotal({ towerId: this.props.user.towerId })
        this.unsubscribe = FCM.on(FCMEvent.Notification, notif => {
            // console.log("Notification", notif);
            this.props.loadBadge();
            const itemData = notif.item ? JSON.parse(notif.item) : null

            try {
                if (notif.title.includes("bất thường")) {
                    this.setState({ isUnnormal: true });
                }
            } catch (error) {

            }
            if (Platform.OS === 'android' && !notif.local_notification) {
                FCM.presentLocalNotification({
                    body: notif.body,
                    priority: "high",
                    title: notif.title,
                    sound: "default",
                    "large_icon": "icon",// Android only
                    icon: "icon",
                    "show_in_foreground": true,
                    vibrate: 300,
                    "lights": true,
                    //status: 'notif.status',
                    channel: 'car_status',
                    actionId: notif.actionId,
                    itemData: JSON.parse(notif.item)

                });
            }
            // Tạo notification Local khi app đang chế độ foreground
            if (Platform.OS === 'ios' && notif._notificationType === NotificationType.WillPresent) {
                notif.finish(WillPresentNotificationResult.All)
                //this.props.AddItemToList(itemData)
                return;
            }

            if (notif.opened_from_tray) {
                if (notif.itemData) {
                    switch (notif.actionId) {
                        case "1"://Yêu cầu
                            setTimeout(() => {
                                this.props.navigation.navigate('requestDetail', { id: notif.itemData.requestId })
                            }, 500);
                            break;

                        case "3"://Tiện ích
                            setTimeout(() => {
                                this.props.navigation.navigate('serviceBasicDetail', { id: notif.itemData.id })
                            }, 500);
                            break;

                        case "4"://Dịch vụ
                            setTimeout(() => {
                                this.props.navigation.navigate('serviceExtensionDetail', { id: notif.itemData.id })
                            }, 500); 0
                            break;

                        case "5"://Checklist
                            setTimeout(() => {
                                this.props.navigation.navigate('checklistDetail', { id: notif.itemData.id })
                            }, 500);
                            break;

                        case "6"://Proposal
                            setTimeout(() => {
                                this.props.navigation.navigate('proposalDetail', { id: notif.itemData.id })
                            }, 500);
                            break;

                    }
                } else {
                    switch (notif.actionId) {
                        case "1"://Yêu cầu
                            setTimeout(() => {
                                this.props.navigation.navigate('requestDetail', { id: itemData.requestId })
                            }, 500);
                            break;

                        case "3"://Tiện ích
                            setTimeout(() => {
                                this.props.navigation.navigate('serviceBasicDetail', { id: itemData.id })
                            }, 500);
                            break;

                        case "4"://Dịch vụ
                            setTimeout(() => {
                                this.props.navigation.navigate('serviceExtensionDetail', { id: itemData.id })
                            }, 500); 0
                            break;

                        case "5"://Checklist
                            setTimeout(() => {
                                this.props.navigation.navigate('checklistDetail', { id: itemData.id })
                            }, 500);
                            break;

                        case "6"://Proposal
                            setTimeout(() => {
                                this.props.navigation.navigate('proposalDetail', { id: itemData.id })
                            }, 500);
                            break;
                    }
                }
            }

            if (Platform.OS === 'ios') {
                switch (notif._notificationType) {
                    case NotificationType.Remote:
                        notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                        break;
                    case NotificationType.NotificationResponse:
                        notif.finish();
                        break;
                    case NotificationType.WillPresent:
                        notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                        // this type of notificaiton will be called only when you are in foreground.
                        // if it is a remote notification, don't do any app logic here. Another notification callback will be triggered with type NotificationType.Remote
                        break;
                }
            }
            {/*
            // Tạo notification Local khi app đang chế độ foreground
            if (Platform.OS === 'ios' && notif._notificationType === NotificationType.WillPresent) {
                // this notification is only to decide if you want to show the notification when user if in foreground.
                // usually you can ignore it. just decide to show or not.
                // console.log('nhu 1');
                notif.finish(WillPresentNotificationResult.All)
                //this.props.AddItemToList(itemData)
                return;
            }

            if (notif.opened_from_tray) {
                // console.log('nhu 2');
                // console.log(itemData);

                switch (notif.actionId) {
                    case "1"://Yêu cầu
                        setTimeout(() => {
                            this.props.navigation.navigate('requestDetail', { id: itemData.id })
                        }, 500);
                        break;

                    case "3"://Tiện ích
                        setTimeout(() => {
                            this.props.navigation.navigate('serviceBasicDetail', { id: itemData.id })
                        }, 500);
                        break;

                    case "4"://Dịch vụ
                        setTimeout(() => {
                            this.props.navigation.navigate('serviceExtensionDetail', { id: itemData.id })
                        }, 500); 0
                        break;

                    case "5"://Checklist
                        setTimeout(() => {
                            this.props.navigation.navigate('checklistDetail', { id: itemData.id })
                        }, 500);
                        break;

                    case "6"://Proposal
                        setTimeout(() => {
                            this.props.navigation.navigate('proposalDetail', { id: itemData.id })
                        }, 500);
                        break;
                }

                // if (notif.actionId == 1) {
                //     setTimeout(() => {
                //         this.props.navigation.navigate('requestDetail', { id: itemData.requestId, departmentId: itemData.departmentId, title: itemData.title })
                //     }, 500)
                // }
                //Tin tức
                // else if (notif.actionId == 2) {
                //     setTimeout(() => {
                //         this.props.navigation.navigate('newsDetail', { item: itemData, type: itemData.typeId })
                //     }, 500)
                // }
            }
            else if (Platform.OS === 'android' && !notif.local_notification) {
                // console.log(notif.title);
                // console.log(notif.body);
                // console.log( notif.actionId);
                // console.log( notif.item);
                // notif.finish(WillPresentNotificationResult.All)
                FCM.presentLocalNotification({
                    vibrate: 500,
                    title: notif.title,
                    body: notif.body,
                    actionId: notif.actionId,
                    item: notif.item,
                    sound: 'default',
                    priority: 'high',
                    show_in_foreground: true
                });
                // this.props.AddItemToList(itemData)
            }

            if (Platform.OS === 'ios') {
                // console.log('nhu 4');
                //optional
                //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
                //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
                //notif._notificationType is available for iOS platfrom
                switch (notif._notificationType) {
                    case NotificationType.Remote:
                        notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                        break;
                    case NotificationType.NotificationResponse:
                        notif.finish();
                        break;
                    case NotificationType.WillPresent:
                        notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                        // this type of notificaiton will be called only when you are in foreground.
                        // if it is a remote notification, don't do any app logic here. Another notification callback will be triggered with type NotificationType.Remote
                        break;
                }
            }
            */}
        });
        const menus = await [
            {
                id: 1,
                name: 'Ca trực',
                icon: 'calendar-clock'
            },
            {
                id: 2,
                name: 'Công việc',
                myIcon: 'layers',
                dataStatus: this.props.dataStatus
            },
            {
                id: 3,
                name: 'Checklist',
                icon: 'clipboard-check-outline'
            },
            {
                id: 4,
                name: 'Phiếu đề xuất',
                icon: 'message-settings-variant'
            },
            {
                id: 5,
                name: 'Kiểm tra định kỳ',
                icon: 'settings-box'
            },
            {
                id: 7,
                name: 'Điện',
                myIcon: 'electric'
            },
            {
                id: 8,
                name: 'Nước',
                myIcon: 'water'
            },
            {
                id: 13,
                name: 'Gas',
                myIcon: 'gas'
            },
            {
                id: 19,
                name: 'Dịch vụ',
                myIcon: 'utility',
                dataStatus: this.props.dataStatusServicesExtension
            },
            {
                id: 20,
                name: 'Tiện ích',
                myIcon: 'ic_tab_tien_ich',
                dataStatus: this.props.dataStatusServicesBasic
            },
            {
                id: 14,
                name: 'Bàn giao nội bộ',
                icon: 'home'
            },
            {
                id: 15,
                name: 'Bàn giao khách hàng',
                icon: 'home-account'
            },
        ];
        await this.setState({ menus: menus })

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing) {
            const request = {
                towerId: this.props.user.towerId
            }
            this.props.loadDataHandle(request);
        }
        if (nextProps.dataStatus != this.props.dataStatus || nextProps.dataStatusServicesExtension != this.props.dataStatusServicesExtension || nextProps.dataStatusServicesBasic != this.props.dataStatusServicesBasic) {

            const menus = [
                {
                    id: 1,
                    name: 'Ca trực',
                    icon: 'calendar-clock'
                },
                {
                    id: 2,
                    name: 'Công việc',
                    myIcon: 'layers',
                    dataStatus: this.props.dataStatus
                },
                {
                    id: 3,
                    name: 'Checklist',
                    icon: 'clipboard-check-outline'
                },
                {
                    id: 4,
                    name: 'Phiếu đề xuất',
                    icon: 'message-settings-variant'
                },
                {
                    id: 5,
                    name: 'Kiểm tra định kỳ',
                    icon: 'settings-box'
                },
                {
                    id: 7,
                    name: 'Điện',
                    myIcon: 'electric'
                },
                {
                    id: 8,
                    name: 'Nước',
                    myIcon: 'water'
                },
                {
                    id: 13,
                    name: 'Gas',
                    myIcon: 'gas'
                },
                {
                    id: 19,
                    name: 'Dịch vụ',
                    myIcon: 'utility',
                    dataStatus: this.props.dataStatusServicesExtension
                },
                {
                    id: 20,
                    name: 'Tiện ích',
                    myIcon: 'ic_tab_tien_ich',
                    dataStatus: this.props.dataStatusServicesBasic
                },
                {
                    id: 14,
                    name: 'Bàn giao nội bộ',
                    icon: 'home'
                },
                {
                    id: 15,
                    name: 'Bàn giao khách hàng',
                    icon: 'home-account'
                },
            ];
            this.setState({ menus: menus })
        }
    }
    componentWillUpdate(nextProps) {
        if (this.props.isMine !== nextProps.isMine) {
            this.props.getRequestStatusTotal({ towerId: nextProps.user !== null ? nextProps.user.towerId : -1, isMine: nextProps.isMine })
        }
    }
    componentWillUnmount() {
        this.props.setProps({ key: 'state' });
    }

    openPanel = () => {
        this.setState({ swipeablePanelActive: true });
    };

    closePanel = () => {
        this.setState({ swipeablePanelActive: false });
    };

    renderContent = () => {
        const { emptyData, error, data, isRefreshing, isLoading } = this.props;
        if (isLoading && !isRefreshing) {
            return (<View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator color={colors.appTheme} />
            </View>)
        }
        if (error && error.hasError) {
            return (
                <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.setProps({ isRefreshing: true, data: [] })} />
            )
        }
        if (emptyData) {
            return <ErrorContent title={Strings.app.emptyData} onTouchScreen={() => this.props.setProps({ isRefreshing: true, data: [] })} />
        }

        return (
            <View style={{
                borderColor: colors.gray2,
                borderTopWidth: 10,
            }}>

                <FlatList
                    refreshing={isRefreshing}
                    onRefresh={() => this.props.setProps({ isRefreshing: true, data: [] })}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
                    data={data || []}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => `${index}`}
                />
            </View>
        );
    }

    renderItemMenu = ({ item, index }) => {
        const { id, name, icon, myIcon } = item
        const size = Screen.width / 4
        return (
            <TouchableOpacity style={{
                width: Screen.width / 4,
                flex: 1,
                height: (Screen.height - 90) / 4,
                //height: (Screen.height / 2) - 250,
                marginHorizontal: 10,
                marginVertical: 10,
                //marginBottom: 10
                //backgroundColor: '#000',
                //margin: (Screen.width -(Screen.width / 2)) / 6
                //padding: 5,
                borderRadius: 10,
                backgroundColor: "#ffffff",
                shadowColor: "rgba(0, 0, 0, 0.08)",
                elevation: 2,
                shadowOffset: {
                    width: 0,
                    height: 4
                },
                shadowRadius: 12,
                shadowOpacity: 1

            }}
                onPress={() => {
                    switch (id) {
                        case 1: {
                            return this.props.navigation.navigate('shiftList')
                        }
                        case 2: {
                            return this.props.navigation.navigate('requests')
                        }
                        case 3: {
                            return this.props.navigation.navigate('checklist', { isMaintenance: 0 })
                        }
                        case 4: {
                            return this.props.navigation.navigate('proposal')
                        }
                        case 5: {
                            return this.props.navigation.navigate('checklist', { isMaintenance: 1 })
                        }
                        case 6: {
                            return this.props.navigation.navigate('notification')
                        }
                        case 7: {
                            return this.props.navigation.navigate('electric')
                        }
                        case 8: {
                            return this.props.navigation.navigate('water')
                        }
                        case 9: {
                            //return this.props.navigation.navigate('water')
                            this.openPanel();
                            break;
                        }
                        case 10: {
                            //this.closePanel();
                            return this.props.navigation.navigate('shiftChange')
                        }
                        case 13: {
                            return this.props.navigation.navigate('gas')
                        }
                        case 14: {
                            return this.props.navigation.navigate('CheckList_NoiBo')
                        }
                        case 15: {
                            return this.props.navigation.navigate('CheckList_KhachHang')
                        }
                        case 16: {
                            return this.props.navigation.navigate('HandOverMore')
                        }
                        case 17: {
                            return this.props.navigation.navigate('Notification_Bangiao')
                        }
                        case 18: {
                            return this.props.navigation.navigate('ChecklistOfflineScreen')
                        }
                        case 19: {
                            return this.props.navigation.navigate('serviceExtension')
                        }
                        case 20: {
                            return this.props.navigation.navigate('serviceBasic')
                        }
                        default: break
                    }
                }}
            >
                <View style={{
                    flex: 1,
                    width: Screen.width / 2 - 30,

                }}>
                    {id == 2 &&
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.resetRequest({ key: 'isMine', path: '', value: !this.props.isMine })
                                    //this.props.navigation.navigate('requests', { isMine: true })
                                }}
                                style={{ height: 40, width: 40, borderWidth: 0, borderColor: "#ebebeb", borderRadius: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                                <MyIcon name="user1" size={20} color={this.props.isMine ? colors.appTheme : 'red'} />
                            </TouchableOpacity>
                        </View>
                    }

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {
                            icon ? <Icon name={icon} size={Platform.isPad ? 90 : 30} color={colors.appTheme} />
                                : <MyIcon name={myIcon} size={Platform.isPad ? 90 : 30} color={colors.appTheme} />
                        }

                        <Text style={{ marginTop: 5, fontSize: 16, color: colors.appTheme, fontWeight: 'bold', textAlign: 'center', fontFamily: "Inter-SemiBold", }}>{name}</Text>
                    </View>
                    {id == 2 &&
                        <View style={{ height: 40, width: '100%', backgroundColor: '#fff', padding: 5, paddingTop: 0, borderRadius: 10 }} >
                            <View style={{ backgroundColor: "#ebebeb", height: 0.5, marginBottom: 5, marginHorizontal: 5 }}></View>
                            {this.renderMenuStatusRequest(item.dataStatus)}
                        </View>
                    }
                    {id == 19 &&
                        <View style={{ height: 40, width: '100%', backgroundColor: '#fff', padding: 5, borderRadius: 10, paddingTop: 0 }} >
                            <View style={{ backgroundColor: "#ebebeb", height: 0.5, marginBottom: 5, marginHorizontal: 5 }}></View>
                            {this.renderMenuStatusServicesExtension(item.dataStatus)}
                        </View>
                    }
                    {id == 20 &&
                        <View style={{ height: 40, width: '100%', backgroundColor: '#fff', padding: 5, borderRadius: 10, paddingTop: 0 }} >
                            <View style={{ backgroundColor: "#ebebeb", height: 0.5, marginBottom: 5, marginHorizontal: 5 }}></View>
                            {this.renderMenuStatusServicesBasic(item.dataStatus)}
                        </View>
                    }

                </View>
            </TouchableOpacity>
        )
    }
    renderMenuStatusServicesBasic(menus) {
        //if (menus.length == 0) return null
        return (

            <FlatList
                horizontal={true}
                scrollEnabled={false}
                data={menus}
                renderItem={({ item }) => {
                    const { statusId, total, statusName, statusKey } = item
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('serviceBasic', { idStatus: statusId })
                            }}
                            style={{
                                width: (Screen.width / 2 - 40) / menus.length,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                // backgroundColor: colorCode
                            }}
                        >

                            <View
                                style={{
                                    //marginLeft: 8,
                                    borderRadius: 15,
                                    height: 25,
                                    width: 25,
                                    backgroundColor: converStatusToColor2(statusId),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    //marginHorizontal: 10

                                }}
                            >
                                <Text style={{ fontSize: 12, margin: 2, color: '#fff' }}>{total}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={(item, index) => `${index}`}
            />
        );
    }
    renderMenuStatusServicesExtension(menus) {
        //if (menus.length == 0) return null
        return (

            <FlatList
                horizontal={true}
                scrollEnabled={false}
                data={menus}
                renderItem={({ item }) => {
                    const { statusId, total, statusName, statusKey } = item
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('serviceExtension', { idStatus: statusId })
                            }}
                            style={{
                                width: (Screen.width / 2 - 40) / menus.length,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                // backgroundColor: colorCode
                            }}
                        >

                            <View
                                style={{
                                    //marginLeft: 8,
                                    borderRadius: 15,
                                    height: 25,
                                    width: 25,
                                    backgroundColor: converStatusToColor2(statusId),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    //marginHorizontal: 10

                                }}
                            >
                                <Text style={{ fontSize: 12, margin: 2, color: '#fff' }}>{total}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={(item, index) => `${index}`}
            />
        );
    }
    renderMenuStatusRequest(menus) {
        //if (menus.length == 0) return null
        return (

            <FlatList
                horizontal={true}
                scrollEnabled={false}
                data={menus}
                renderItem={({ item }) => {
                    const { id, name, total, colorCode } = item
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.dispatch({ type: 'ON_STATUS_CHANGE', payload: id })
                                this.props.navigation.navigate('requests', { idStatus: id })
                            }}
                            style={{
                                width: (Screen.width / 2 - 40) / menus.length,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                // backgroundColor: colorCode
                            }}
                        >

                            <View
                                style={{
                                    //marginLeft: 8,
                                    borderRadius: 15,
                                    height: 25,
                                    width: 25,
                                    backgroundColor: colorCode,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    //marginHorizontal: 10

                                }}
                            >
                                <Text style={{ fontSize: 12, margin: 2, color: '#fff' }}>{total}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={(item, index) => `${index}`}
            />
        );
    }

    renderItem = ({ item, index }) => {
        const {
            id,
            title,
            system,
            imageUrl,
            employeeName,
            status,
            dateAction,
            typeId,
            departmentId,
            statusId,
            stepApproved,
            stepTotalApprove,
            typeName,
            total,
            isMaintenance
        } = item
        return (index === 0 ? <View style={{ flex: 1 }}><Text style={{ marginBottom: 10, paddingLeft: 10, paddingTop: 10, fontWeight: 'bold' }}>CÔNG VIỆC ({total})</Text>
            <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => {
                    this.props.navigation.navigate('checklistDetail', { id: item.id })
                }}
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
                            <Text style={{ fontSize: fontsize.larg, fontWeight: 'bold' }} numberOfLines={2}>{title}</Text>

                            <View style={{ borderRadius: 45, height: 24, width: 24, backgroundColor: colors.appBackround, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: colors.appTheme }} numberOfLines={2} lineBreakMode="tail">{typeName}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ marginVertical: 5 }} numberOfLines={2} lineBreakMode="tail">{system}</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ marginVertical: 5 }} numberOfLines={1}>{employeeName}</Text>
                            {statusId === 2 ? <Text style={{ color: colors.appTheme }} numberOfLines={1}>{stepApproved} / {stepTotalApprove}</Text>
                                : null}
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: colors.gray1 }} numberOfLines={2} lineBreakMode="tail">{moment(dateAction).format('DD/MM/YYYY')}{isMaintenance ? ' - (KTĐK)' : ''}</Text>
                            <Text style={{ color: colors.appTheme }} numberOfLines={1}>{status}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
            : <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => {
                    this.props.navigation.navigate('checklistDetail', { id: item.id })
                }}
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
                            height: 100,
                            width: 100
                        }}

                        source={{ uri: imageUrl }}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between', marginLeft: 10 }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: fontsize.larg, fontWeight: 'bold' }} numberOfLines={2}>{title}</Text>

                            <View style={{ borderRadius: 45, height: 24, width: 24, backgroundColor: colors.appBackround, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: colors.appTheme }} numberOfLines={2} lineBreakMode="tail">{typeName}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ marginVertical: 5 }} numberOfLines={2} lineBreakMode="tail">{system}</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ marginVertical: 5 }} numberOfLines={1}>{employeeName}</Text>
                            {statusId === 2 ? <Text style={{ color: colors.appTheme }} numberOfLines={1}>{stepApproved} / {stepTotalApprove}</Text>
                                : null}
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: colors.gray1 }} numberOfLines={2} lineBreakMode="tail">{moment(dateAction).format('DD/MM/YYYY')}{isMaintenance ? ' - (KTĐK)' : ''}</Text>
                            <Text style={{ color: colors.appTheme }} numberOfLines={1}>{status}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }

    render() {
        const { menus, menusMore } = this.state
        return (
            // <ImageBackground resizeMode='cover' source={default_baner} style={{ width: '100%', height: '100%' }} >
            <View style={{ flex: 1, backgroundColor: "#ffffff" }}>

                <NavBar
                    leftButton={<IconButton materialIcon="menu" size={28}
                        onPress={() => this.props.navigation.openDrawer()}
                        color="#fff" />}
                    // body={<Text style={titleStyle}>TRANG CHỦ</Text>}

                    rightView={<View style={{
                        paddingRight: 10,
                        flexDirection: 'row', justifyContent: 'center', alignContent: 'center'
                    }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('notification')} style={{
                            paddingHorizontal: 15,
                            //flex: 1,
                            justifyContent: 'center'
                        }}>
                            <MyIcon
                                name="bell"
                                size={28}
                                color="#fff"
                            />
                            {this.props.badgeNotify !== 0 &&
                                <View style={styles.IconBadge}>
                                    <Text style={{ color: 'white', fontSize: 10 }}>{this.props.badgeNotify > 99 ? '99+' : this.props.badgeNotify}</Text>
                                </View>
                            }
                        </TouchableOpacity>
                        <ImageProgress
                            style={{
                                height: 30,
                                width: 30,
                            }}
                            circle={true}
                            resizeMode="stretch"
                            source={{ uri: this.props.user !== null ? this.props.user.towerLogoUrl : '' }}
                        />
                    </View>}
                />
                <View style={{
                    flex: 1,
                    //marginTop: 20 
                }}>
                    {/* <View style={{ justifyContent: 'center', alignItems: 'center', height: 250 }}>
                        <ImageProgress
                                style={{
                                    height: 90,
                                    width: 90,
                                    //borderWidth: 2,
                                    //borderColor: '#fb660573'
                                }}
                                circle={true}
                                resizeMode="stretch"
                                source={{ uri: this.props.user !== null ? this.props.user.photoUrl : '' }}
                        />
                        <Text style={{ color: '#fb6605', fontSize: 20, fontWeight: 'bold' }}>{this.props.user.fullName}</Text>
                            <Text style={{ color: '#000', fontSize: 14 }}>{this.props.user.phoneNumber}</Text>
                    </View> */}
                    <View style={{ marginTop: -10, marginHorizontal: 10 }}>
                        {this.props.user.towerId != null ?
                            <View>
                                <FlatList
                                    //scrollEnabled={false}
                                    data={menus}
                                    renderItem={this.renderItemMenu}
                                    horizontal={false}
                                    numColumns={2}
                                />
                            </View> : <Text>Vui lòng chọn toà nhà</Text>
                        }
                    </View>
                    {/* <View style={{ flex: 1 }}>
                        {this.renderContent()}
                    </View> */}

                    {/* <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('dashboard')}
                        style={{
                            backgroundColor: (this.props.user !== null ? this.props.user.isUnnormal : false) ? 'red' : colors.appTheme,
                            width: 50,
                            height: 50,
                            borderRadius: 35,
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            bottom: 20,
                            right: 20
                        }}>
                        
                        <Icon name='lock-pattern' size={ 30 } color='#fff' />
                    </TouchableOpacity> */}
                </View>
                {/* <SwipeablePanel
                    fullWidth
                    isActive={this.state.swipeablePanelActive}
                    onClose={this.closePanel}
                    onPressCloseButton={this.closePanel}
                    //closeOnTouchOutside={true}
                    style={{ padding: 10 }}
                    //showCloseButton={true}
                >
					<FlatList
                        data={menusMore}
                        renderItem={this.renderItemMenu}
                        horizontal={false}
                        numColumns={3}
                        />
				</SwipeablePanel> */}
            </View>
            // </ImageBackground>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    IconBadge: {
        top: 0,
        right: 7,
        position: 'absolute',
        borderRadius: 45,
        minWidth: 20,
        minHeight: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF0000'
    },
});

const mapStateToProps = (state) => ({
    emptyData: state.home.emptyData,
    isLoading: state.home.isLoading,
    data: state.home.data,
    error: state.home.error,
    isRefreshing: state.home.isRefreshing,
    user: state.auth.user,
    canNavigate: true,//state.requestDetail.data == null,
    language: state.app.language,
    badgeNotify: state.badge.badgeNotifyR,
    dataStatus: state.drawer.data,
    dataStatusServicesBasic: state.drawer.dataStatusServiecBasic,
    dataStatusServicesExtension: state.drawer.dataStatusSeviceExtension,
    isMine: state.request.isMine
});

const mapActionToState = {
    loadDataHandle,
    postFCMToken,
    setProps,
    loadBadge,
    delFCMTokenResident,
    getRequestStatusTotal,
    getServicesExtensionStatusTotal,
    getServicesBasicStatusTotal,
    resetRequest
};
export default connect(mapStateToProps, mapActionToState)(HomeScreen)
