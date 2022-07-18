//import liraries
import React, { Component } from 'react';
import {
    TouchableOpacity,
    Image,
    View,
    Text,
    StyleSheet,
    ScrollView,
    ImageBackground,
    Modal,
    Platform,
    ActivityIndicator,
    KeyboardAvoidingView
} from 'react-native';


import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import * as mineTypes from 'react-native-mime-types';
import FCM from 'react-native-fcm';

import { Screen } from '../../utils/device';
import { background } from '../../theme/images';
import Color from '../../theme/colors';
import FontSize from '../../theme/fontsize';
import { MyIcon } from '../../theme/icons';
import MenuItem from '../../components/profile/MenuItem';
import { signOut } from '../../actions/auth';
import colors from '../../theme/colors';
import ImageProgress from '../../components/common/ImageProgress'
import { updateProfile } from '../../actions/auth';
import auth from '../../redux/redercers/auth';
import fontSize from '../../theme/fontsize';
import Strings from '../../utils/languages';
import { getOtpCodeHaveType, loginUser, changePhone, resetStateByKey, loginUserByPass, getOtpCodeNoType, setTypeResident, setTypeVendor, loginUserByPassVendor, loginUserByPassResident, signIn} from '../../actions/auth';

// create a component
class ProfileScreen extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            isShowModal: false,
        }
    }

    render() {
        const { signOut, user, tokenDevice } = this.props
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appTheme }}>
                    <View
                        style={{
                            height: 110,
                            width: 110,
                            borderRadius: 55,
                            borderWidth: 5,
                            borderColor: 'rgba(255,255,255,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: this.props.isLoading ? '#fff' : 'transparent'
                        }}>
                        {this.props.isLoading ?
                            <ActivityIndicator  color={colors.appTheme}/> :
                            <ImageProgress
                                source={{ uri: `${user ? user.photoUrl : '' || require('../../resources/default_image.png')}` }}
                                style={{
                                    height: 100,
                                    width: 100,
                                    borderRadius: 50
                                }}
                            />
                        }
                    </View>
                    <TouchableOpacity
                        onPress={() => this._onAttachment()}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            paddingHorizontal: 25,
                            paddingVertical: 10,
                            borderRadius: 45,
                            marginVertical: 10
                        }}
                    >
                        <MyIcon name="pencil" color="#fff" size={20} />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', backgroundColor: 'transparent', fontWeight: 'bold', fontSize: FontSize.larg }}>{user ? user.fullName : ''}</Text>
                    <Text style={{ color: 'white', backgroundColor: 'transparent', fontWeight: 'bold', fontSize: FontSize.small }}>{user ? user.phoneNumber : ''}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'space-between' }}>
                    <View>
                        <MenuItem icon="setting" text={Strings.profile.setting} color="#2EB369" onPress={() => this.props.navigation.navigate('setting')} />
                        {/* <MenuItem icon="setting" text={Strings.profile.changeTypeUser} color="#2EB369" onPress={() => this.props.navigation.navigate('setting')} /> */}
                        <MenuItem icon="switch" text={Strings.profile.logout} color="red" onPress={() => this.setState({ isShowModal: true })} />
                    </View>
                </View>
            </View >
        );
    }
    _onAttachment = () => {
        const options = {
            quality: 1.0,
            maxWidth: 512,
            maxHeight: 512,
            storageOptions: {
                skipBackup: true
            },
            title: 'Chọn hình ảnh',
            takePhotoButtonTitle: 'Chụp ảnh...',
            chooseFromLibraryButtonTitle: 'Chọn ảnh từ thư viện...',
            cancelButtonTitle: 'Bỏ qua',
            permissionDenied: { title: 'Cấp quyền truy cập', text: 'Cho phép ứng dụng chụp ảnh và chọn từ thư viên ảnh...', reTryTitle: 'Thử lại', okTitle: 'Cho phép' }
        };
        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response showImagePicker = ', response);
            if (response.didCancel) {
                // console.log('User cancelled photo picker');
            } else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
            } else {
                const image = {
                    data: response.data,
                    uri: response.uri,
                    type: Platform.OS === 'ios' ? mineTypes.lookup(response.uri) : response.type,
                    fileName: response.fileName
                };
                this.props.updateProfile({ image, fullName: this.props.user.fullName })
            }
        });
    }
}



// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    linearGradient: {
        flex: 1,
        backgroundColor: colors.primaryKeyColor
    },
});
const mapStateToProps = state => ({
    user: state.auth.user,
    isLoading: state.auth.isLoading,
    error: state.auth.error,
    language: state.app.language,
    tokenDevice: state.auth.tokenDevice,
    typeList: state.auth.typeList,
})

const mapActionToProps = {
    signOut,
    updateProfile
}

//make this component available to the app
export default connect(mapStateToProps, mapActionToProps)(ProfileScreen);
