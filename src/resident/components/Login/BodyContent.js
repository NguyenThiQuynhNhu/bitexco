import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

import CodeInput from 'react-native-confirmation-code-input';
import { Screen } from '../../utils/device';
import Strings from '../../utils/languages';
import { MyIcon } from '../../theme/icons';
import colors from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const BodyContent = (props) => {
    const {
        isLoading,
        onPress,
        onFulfill,
        onChangePhone,
        title,
        valueInput,
        textButton,
        placeholderInput,
        showIcon = true,
        settingText = false,
        isCode = false,
        changePhone,
        onSubmitEditing,
        reSendOtpCode,
        isPass,
        goCase,
        onChangePassword,
        onPressByPass,
        valuePhone,
        valuePass,
        valuePasswordRetype,
        isRegister,
        onChangePasswordRetype,
        goRegister,
        titleRegister,
        onPressRegister
    } = props
    return (

        <View
            style={{
                flex: 1,
                alignItems: 'center'
            }}
        >
            <Text
                style={{
                    fontSize: 24,
                    textAlign: 'center',
                    marginHorizontal: 20
                }}
            >
                {isRegister ? titleRegister : title}
            </Text>
            <View
                behavior={Platform.OS == 'ios' ? "padding" : ""}
                style={{
                    flex: 1,
                    justifyContent: 'center'
                }}
            >
                {isCode ?
                    <CodeInput
                        containerStyle={{ alignSelf: 'center', flex: 0 }}
                        codeInputStyle={{ fontSize: 36, color: '#666666' }}
                        activeColor="black"
                        inactiveColor="gray"
                        cellBorderWidth={2}
                        keyboardType="phone-pad"
                        className={'border-b'}
                        space={10}
                        size={48}
                        codeLength={4}
                        inputPosition='left'
                        onFulfill={onFulfill}
                    /> :
                    <View>
                        <View

                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderBottomWidth: 2,
                                marginBottom: Platform.OS === 'ios' ? 30 : 20
                            }}
                        >
                            <TextInput
                                style={{
                                    flex: 1,
                                    fontSize: 24,
                                }}
                                autoCapitalize="none"
                                autoFocus={false}
                                keyboardType="phone-pad"
                                autoCorrect={false}
                                maxLength={15}
                                value={valuePhone}
                                onChangeText={onChangePhone}
                                placeholder={placeholderInput}
                                placeholderTextColor="#666666"
                                underlineColorAndroid="transparent"
                                onSubmitEditing={onSubmitEditing}
                            />
                            <MyIcon name="phone" size={20} color="#666666" />
                        </View>
                        {// hiện nhập mật khẩu
                            (isPass || isRegister) &&
                            <View

                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderBottomWidth: 2,
                                    marginBottom: Platform.OS === 'ios' ? 30 : 20
                                }}
                            >
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 24,
                                    }}
                                    autoCapitalize="none"
                                    autoFocus={false}
                                    //keyboardType="phone-pad"
                                    autoCorrect={false}
                                    //maxLength={15}
                                    value={valuePass}
                                    onChangeText={onChangePassword}
                                    placeholder={Strings.login.password}
                                    placeholderTextColor="#666666"
                                    secureTextEntry={true}
                                    underlineColorAndroid="transparent"
                                    onSubmitEditing={onSubmitEditing}
                                />
                                <Icon name="lock" size={20} color="#666666" />
                            </View>
                        }
                        {// hiện đăng ký
                            isRegister &&
                            <View>
                                <View

                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderBottomWidth: 2
                                    }}
                                >
                                    <TextInput
                                        style={{
                                            flex: 1,
                                            fontSize: 24,
                                        }}
                                        autoCapitalize="none"
                                        autoFocus={false}
                                        //keyboardType="phone-pad"
                                        autoCorrect={false}
                                        //maxLength={15}
                                        value={valuePasswordRetype}
                                        onChangeText={onChangePasswordRetype}
                                        placeholder={Strings.login.passwordRetype}
                                        placeholderTextColor="#666666"
                                        secureTextEntry={true}
                                        underlineColorAndroid="transparent"
                                        onSubmitEditing={onSubmitEditing}
                                    />
                                    <Icon name="lock" size={20} color="#666666" />
                                </View>
                            </View>
                        }

                        {!isRegister &&
                            <TouchableOpacity
                                style={{
                                    marginTop: 10,
                                    // borderRadius: 45,
                                    width: Screen.width * 0.8,
                                    height: 50,
                                    // backgroundColor: colors.appTheme,
                                    justifyContent: 'center'
                                }}
                                onPress={goCase}
                            >
                                {
                                    isPass ? <Text style={{ color: colors.appTheme, fontSize: 16, alignSelf: 'center' }}>{Strings.login.byOTP}</Text>
                                        : <Text style={{ color: colors.appTheme, fontSize: 16, alignSelf: 'center' }}>{Strings.login.byPass}</Text>
                                }

                            </TouchableOpacity>
                        }

                    </View>}
                {
                    isRegister ?
                        <TouchableOpacity
                            style={{
                                marginTop: 40,
                                borderRadius: 45,
                                width: Screen.width * 0.8,
                                height: 50,
                                backgroundColor: colors.appTheme,
                                justifyContent: 'center'
                            }}
                            onPress={onPressRegister}// có hai hàm login tuỳ theo sử dụng mật khẩu hay otp
                        >
                            <Text style={{ color: '#fff', fontSize: 18, alignSelf: 'center' }}>{Strings.login.button3.toLocaleUpperCase()}</Text>
                        </TouchableOpacity>
                        : <TouchableOpacity
                            style={{
                                marginTop: 40,
                                borderRadius: 45,
                                width: Screen.width * 0.8,
                                height: 50,
                                backgroundColor: colors.appTheme,
                                justifyContent: 'center'
                            }}
                            onPress={isPass ? onPressByPass : onPress}// có hai hàm login tuỳ theo sử dụng mật khẩu hay otp
                        >
                            <Text style={{ color: '#fff', fontSize: 18, alignSelf: 'center' }}>{textButton.toLocaleUpperCase()}</Text>
                        </TouchableOpacity>
                }
                {// ở trang otp thì không hiện ra
                    !isCode &&


                    <TouchableOpacity
                        style={{
                            marginTop: 10,
                            // borderRadius: 45,
                            width: Screen.width * 0.8,
                            height: 50,
                            // backgroundColor: colors.appTheme,
                            justifyContent: 'center'
                        }}
                        onPress={goRegister}
                    >
                        {
                            isRegister ? <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{ color: colors.gray1, fontSize: 16, alignSelf: 'center' }}>{Strings.login.label1} </Text>
                                <Text style={{ color: colors.appTheme, fontSize: 16, alignSelf: 'center' }}>{Strings.login.label3}</Text>
                            </View> :
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={{ color: colors.gray1, fontSize: 16, alignSelf: 'center' }}>{Strings.login.label2} </Text>
                                    <Text style={{ color: colors.appTheme, fontSize: 16, alignSelf: 'center' }}>{Strings.login.button3}</Text>
                                </View>
                        }



                    </TouchableOpacity>


                }
                {settingText &&
                    <View
                        style={{
                            marginBottom: 20,
                            marginTop: 30,
                            width: Screen.width * 0.8,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <TouchableOpacity
                            onPressOut={() => reSendOtpCode()}
                        >
                            <Text
                                style={{

                                    fontSize: 15,
                                    textDecorationLine: 'underline'
                                }}
                            >{Strings.login.resent.toLocaleUpperCase()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPressOut={changePhone}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                    textDecorationLine: 'underline'
                                }}>{Strings.login.changephone.toLocaleUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>}
            </View>
        </View >

    );
}
const styles = StyleSheet.create({
    text: {
        color: '#fff',
        textDecorationLine: 'underline'
    }
})
