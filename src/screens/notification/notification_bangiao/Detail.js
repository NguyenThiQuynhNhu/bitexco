//import liraries
import React, { Component } from 'react';
import { Alert, View, Text, Linking, StyleSheet, ScrollView, Platform, ActivityIndicator, TouchableOpacity,PermissionsAndroid } from 'react-native';
import { connect } from 'react-redux';
// import RNFetchBlob from 'react-native-fetch-blob';//https://github.com/wkh237/react-native-fetch-blob/issues/251#issuecomment-280760756
import { WebView } from 'react-native-webview';
import moment from 'moment';
import _ from 'lodash';

import fontsize from '../../../theme/fontsize';
import FCM from 'react-native-fcm';

// import { updateItemList } from '../../actions/news';
import { get, post } from '../../../services/helper';
import { MyIcon } from '../../../theme/icons';
import colors from '../../../theme/colors'
import ErrorContent from '../../../components/common/ErrorContent';
import Strings from '../../../utils/languages';
import {show,show_info} from '../../../utils/Toast';
import NavBar from '../../../components/common/NavBar';

import Toast, { DURATION } from 'react-native-easy-toast';
import { ReadNew,refreshDataHandle,NewNoRead} from '../../../actions/notification_bangiao';


// create a component
class NewsDetail extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null
    })

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
            data: {
                fileUrl:''
            },
            isLoadDesign: false,
            // fileUrl: ''
        };
        this.handleNavigationChange = this.handleNavigationChange.bind(this);
    }

    componentDidMount() {
        // console.log('hahahahaahahah')
        this.props.navigation.setParams({ onResponse: this._onResponse });
        this.resetStateByObject({ initComponent: true });

        setTimeout(() => {
            this.setState({ isLoadDesign: true });
        }, 500)

        // if(Platform.OS==='android'){
        //     this.requestPermissionAndroid()
        // }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.initComponent !== nextState.initComponent && nextState.initComponent) {
            this.loadDataHandle();
        }
        if (nextState.isRefreshing !== this.state.isRefreshing && nextState.isRefreshing && !nextState.isLoading) {
            this.loadDataHandle();
        }
    }

    requestPermissionAndroid = async() => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'WRITE_EXTERNAL_STORAGE',
              message:
                'WRITE_EXTERNAL_STORAGE',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the WRITE_EXTERNAL_STORAGE');
          } else {
            console.log('WRITE_EXTERNAL_STORAGE permission denied');
          }
        } catch (err) {
          console.warn(err);
        }

        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: 'READ_EXTERNAL_STORAGE',
                message:
                  'READ_EXTERNAL_STORAGE',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('You can use the READ_EXTERNAL_STORAGE');
            } else {
              console.log('READ_EXTERNAL_STORAGE permission denied');
            }
          } catch (err) {
            console.warn(err);
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
    
    async loadDataHandle() {

        console.log('load data')
        
        // return
        const { navigation } = this.props;
        const { item, type } = navigation.state.params;
        console.log(navigation.state.params)
        const {
            id
        } = item;
        this.setState({
            isLoading: true,
            emptyData: false,
            errors: null
        });
        // const { api, params } = this.props
        console.log(id);

        var params = { 
            // newsId: id, 
            // towerId, 
            // typeNews: type
            'id':id,
            "language": "",
            "isPublic": true
        }
        //console.log(params)
        const ret = await post('/Notification/EmployeeDetail', params);
        //console.log(ret)
        if (ret !== undefined && ret !== null) {
            if (ret !== -1 && ret.status == 200) {
              //  console.log(ret.data)
                this.setState({
                    initComponent: false,
                    isLoading: false,
                    isRefreshing: false,
                    data: ret.data,
                    emptyData: ret.data.description === null,
                    errors: { hasError: false, error: '' }
                }, () => {
                    this.props.ReadNew({"id": id})
                    .then((data)=>{
                        if(data.status!=1)return
                        this.props.refreshDataHandle();
                        console.log('this.props.ReadNew(params) ',data)
                        //cập nhật lại số thông báo chưa đọc
                        // FCM.presentLocalNotification({
                        //     // channel: 'default',
                        //     // id: new Date().valueOf().toString(), // (optional for instant notification)
                        //     // title: "Test Notification with action", // as FCM payload
                        //     // body: "Force touch to reply", // as FCM payload (required)
                        //     priority: "high", // as FCM payload
                        //     badge: data.countRead, // as FCM payload IOS only, set 0 to clear badges
                        //     number: data.countRead, // Android only
                        //     // ticker: "My Notification Ticker", // Android only
                        //     // auto_cancel: true, // Android only (default true)
                        //     // icon: "ic_launcher", // as FCM payload, you can relace this with custom icon you put in mipmap
                        //     // wake_screen: true, // Android only, wake up screen when notification arrives
                        //     // show_in_foreground: true // notification when app is in foreground (local & remote)
                        // });

                    })
                });
            }
            else {
                //console.log(ret)
                this.setState({
                    initComponent: false,
                    isLoading: false,
                    isRefreshing: false,
                    errors: { hasError: true, error: '' }
                });
            }
        }
        else {
            //console.log(ret)
            this.setState({
                initComponent: false,
                isLoading: false,
                isRefreshing: false,
                errors: { hasError: true, error: '' }
            });
        }
    }

    renderContent(){
            const { navigation } = this.props;
            const { item, type } = navigation.state.params;
            const {
                id,
                // Title,
                dateCreate,
                imageUrl,
                isRead,
                towerId,
                towerName,
                address,
                shortDescription
            } = item;
            
            if (this.state.initComponent) {
                return (
                    <View
                    style={{
                        paddingVertical: 20,
                    }}
                >
                    <ActivityIndicator animating size="small" />
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
            if (this.state.data) {
                return (
                    <View style={{ flex: 1 }} >                        

                    {/* <WebView
                        style={{ flex: 1 }}
                        startInLoadingState={Platform.OS === 'ios' ? false : this.state.isLoadingWeb}
                        source={{ html: `<html xmlns="http://www.w3.org/1999/xhtml">
                            <head>
                            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                            </head>
                            <style>
                            img{width:100%!important;  height:auto !important} 
                            iframe{width:100%!important; height:auto !important}
                            </style>
                            <body>
                            <div style='font-size: 36px; font-weight: bold'>
                                <div style='color: #002b41; font-size:16pt'>
                                ${this.state.data.title}
                                </div>
                            <div style='font-size: 14px; color: #d0d0d0; font-weight: normal; margin-bottom: 20'>
                            ${moment(dateCreate).format('DD/MM/YYYY HH:mm')}
                            </div>
                            </div>
                            ${this.state.data.description}
                            </body>
                            </html>` }}
                        scrollEnabled
                        javaScriptEnabled
                        domStorageEnabled
                        // onNavigationStateChange={this.handleNavigationChange}
                        ref="webView"
                    /> */}
                    <WebView
                        style={{ flex: 1 }}
                        startInLoadingState={Platform.OS === 'ios' ? false : this.state.isLoadingWeb}
                        source={{ html: `<html xmlns="http://www.w3.org/1999/xhtml">
                            <head>
                            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                            </head>
                            <style>
                            img{width:100%!important;  height:auto !important} 
                            iframe{width:100%!important; height:auto !important}
                            </style>
                            <body>
                            <iframe src=" http://192.168.1.122:8081" width="800px" height="600px"/>
                            </body>
                            </html>` }}
                        scrollEnabled
                        javaScriptEnabled
                        domStorageEnabled
                        // onNavigationStateChange={this.handleNavigationChange}
                        ref="webView"
                    />
                    <View style={{ flexDirection: 'row', backgroundColor: colors.appTheme }}>
                    </View>
                    < Toast ref="toast" style={{ backgroundColor: this.props.errorProgress && this.props.errorProgress.hasError ? colors.toast.warning : colors.toast.success, opacity: 1, borderRadius: 5, padding: 10, }} />
                    </View>
                );
            }
    }

    render() {

        const downloadJSX = (
            
                this.state.data.fileUrl.length > 0 &&
                            <TouchableOpacity
                                style={{paddingHorizontal:10, flex: 0, height: 50, flexDirection: 'row', backgroundColor: colors.appTheme, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => {
                                    try {
                                        Linking.canOpenURL(this.state.data.fileUrl).then(supported => {
                                            if (supported) {  
                                                if(Platform.OS === 'android'){
                                                    // this.download(this.state.data.fileUrl);
                                                }
                                                else{
                                                    // this.download(this.state.data.fileUrl);
                                                    // Linking.openURL(this.state.data.fileUrl);
                                                }
                                            }
                                        });
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }}
                            >
                                <MyIcon
                                    name="download"
                                    size={30}
                                    color={colors.white}
                                />
                                {/* <Text style={{ color: '#fff', marginLeft: 10, fontSize: fontsize.larg }}>{Strings.app.download}</Text> */}
                            </TouchableOpacity>
            
        )

        if(!this.state.isLoadDesign)
        {
            return(<View style={styles.container}>

                <NavBar
                    leftButton={<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ padding: 10 }}><MyIcon name="arrow" color="#fff" size={20} /></TouchableOpacity>}
                    // body={<Text style={{ alignSelf: 'center', color: '#fff', fontSize: fontsize.small }}>{this.props.navigation.state.params.item.Title.toLocaleUpperCase()}</Text>}
                    body={<Text style={{ alignSelf: 'center', color: '#fff', fontSize: fontsize.small }}>{'thông báo & tin tức'.toLocaleUpperCase()}</Text>}
                    rightView={
                        downloadJSX
                    }
                />
                <View
                    style={{
                        paddingVertical: 20,
                    }}
                >
                    <ActivityIndicator animating size="small" />
                </View>
            </View>)
        }

        
        return (
            <View style={styles.container}>
                <NavBar
                    leftButton={<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ padding: 10 }}><MyIcon name="arrow" color="#fff" size={20} /></TouchableOpacity>}
                    // body={<Text style={{ alignSelf: 'center', color: '#fff', fontSize: fontsize.small }}>{this.props.navigation.state.params.item.Title.toLocaleUpperCase()}</Text>}
                    body={<Text style={{ alignSelf: 'center', color: '#fff', fontSize: fontsize.small }}>{'thông báo & tin tức'.toLocaleUpperCase()}</Text>}
                    rightView={
                        downloadJSX
                    }
                />
                {this.renderContent()}

            </View>
        )

    }
    
    handleNavigationChange = (navState) => {
        console.log(navState)
        if (navState.title) {
            this.setState({ isLoadingWeb: false });
        }
   
        Linking.canOpenURL(navState.url).then(supported => {
            if (supported) {  
                this.refs.webView.stopLoading();
                if(Platform.OS === 'android')
                {
                    if(this.state.fileUrl !== navState.url){
                        this.setState({ fileUrl: navState.url }, () =>{                 
                            this.download(navState.url);
                        });                    
                    }
                 }
                 else{
                    Linking.openURL(navState.url);
                 }
            } else {
                console.log('Don\'t know how to open URI: ' + navState.url);
            }
        });
    }
    
    download(url) {
        //console.log(url);
        try{
            var date = new Date();
            var ext = this.extention(url);
            ext = "." + ext[0];
            const { config } = RNFetchBlob
            let dirs = RNFetchBlob.fs.dirs
            let options = {
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    description: 'File'
                },
                path : dirs.DocumentDir + "/file_" + Math.floor(date.getTime() + date.getSeconds() / 2) + ext
            }
            config(options).fetch('GET', url).then((res) => {
                //console.log('The file saved to ', res.path())
                console.log(res)
                //Linking.openURL(res.data)
                show_info('Tải về hoàn tất.')
                // this.refs.toast.show("Success Downloaded", DURATION.LENGTH_LONG);
            });
        }catch(err){
            console.log(err);
        }
    }

    extention(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }

    _onResponse = () => {
        this.setState({ isShowModal: true })
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

const mapStateToProps = state => ({
    // user: state.auth.user ? state.auth.user.data : null,
    user: state.auth.user,
    // towerId: state.auth.user ? state.auth.user.towerId : 0,
})

//make this component available to the app
const mapActionToProps = {
    // updateItemList,
    ReadNew,
    refreshDataHandle,
    NewNoRead
}
export default connect(mapStateToProps, mapActionToProps)(NewsDetail);
