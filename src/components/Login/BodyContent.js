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
        isPass,
        goCase,
        onChangePassword,
        onPressByPass,
        valuePhone,
        valuePass,
        isType,
        onPressResident,
        onPressVendor,
        valuePasswordRetype,
        isRegister,
        onChangePasswordRetype,
        goRegister,
        titleRegister,
        onPressRegister,
        choiceType,
        isLoginByPass
    } = props
    return (

        <View
            style={{
                //flex: 1,
                alignItems: 'center'
            }}
        >
            {/* <Text
                style={{
                    fontSize: Platform.isPad ? 24 : 20,
                    textAlign: 'center',
                    marginHorizontal: 20
                }}
            >
               {isRegister ? titleRegister : title}
            </Text> */}
            <View
                behavior={Platform.OS == 'ios' ? "padding" : ""}
                style={{
                    //flex: 1,
                    justifyContent: 'center'
                }}
            >
                {isCode ? <CodeInput
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
                />

                    :
                    <View>
                        {
                            !isType &&
                            <View

                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderBottomWidth: 0.5,
                                    borderColor: '#cccccc',
                                    marginBottom: Platform.OS === 'ios' ? 30 : 20,
                                    paddingBottom: 2
                                }}
                            >
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontFamily: "Inter-Regular",
                                        fontSize: 16,
                                        fontWeight: "normal",
                                        fontStyle: "normal",
                                        letterSpacing: 0,
                                        textAlign: "left",
                                        color: "#262626"
                                    }}
                                    autoCapitalize="none"
                                    autoFocus={false}
                                    keyboardType="phone-pad"
                                    autoCorrect={false}
                                    maxLength={15}
                                    value={valuePhone}
                                    onChangeText={onChangePhone}
                                    placeholder={Strings.login.phone}
                                    placeholderTextColor="#cccccc"
                                    underlineColorAndroid="transparent"
                                    onSubmitEditing={onSubmitEditing}
                                />
                                <MyIcon name="phone" size={20} color="#cccccc" />
                            </View>
                        }
                        {// hiện nhập mật khẩu
                            (isPass || isRegister) &&
                            <View

                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderBottomWidth: 0.5,
                                    borderColor: '#cccccc',
                                    marginBottom: Platform.OS === 'ios' ? 30 : 20,
                                    paddingBottom: 2
                                }}
                            >
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontFamily: "Inter-Regular",
                                        fontSize: 16,
                                        fontWeight: "normal",
                                        fontStyle: "normal",
                                        letterSpacing: 0,
                                        textAlign: "left",
                                        color: "#262626"
                                    }}
                                    autoCapitalize="none"
                                    autoFocus={false}
                                    //keyboardType="phone-pad"
                                    autoCorrect={false}
                                    //maxLength={15}
                                    value={valuePass}
                                    onChangeText={onChangePassword}
                                    placeholder={Strings.login.password}
                                    placeholderTextColor="#cccccc"
                                    secureTextEntry={true}
                                    underlineColorAndroid="transparent"
                                    onSubmitEditing={onSubmitEditing}
                                />
                                <Icon name="lock" size={20} color="#cccccc" />
                            </View>
                        }
                        {// hiện đăng ký
                            isRegister &&
                            <View>
                                <View

                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderBottomWidth: 0.5,
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

                    </View>}
                {/* {// ở trang otp thì không hiện ra
                    (!isCode || !isType) &&
                    
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
                            isRegister && <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{ color: colors.gray1, fontSize: 16, alignSelf: 'center' }}>{Strings.login.label1} </Text>
                                <Text style={{ color: colors.appTheme, fontSize: 16, alignSelf: 'center' }}>{Strings.login.label3}</Text>
                            </View>
                        }
                        {   
                            !isRegister && !isCode && !isType &&   <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={{ color: colors.gray1, fontSize: 16, alignSelf: 'center' }}>{Strings.login.label2} </Text>
                                    <Text style={{ color: colors.appTheme, fontSize: 16, alignSelf: 'center' }}>{Strings.login.button3}</Text>
                                </View>
                        }

                    </TouchableOpacity>

                } */}
                { // ở trang chọn loại người dùng thì không hiện ra
                    (!isType && !isRegister) &&
                    <TouchableOpacity
                        style={{
                            marginTop: 50,
                            borderRadius: 45,
                            width: Screen.width * 0.8,
                            height: 50,
                            backgroundColor: colors.appTheme,
                            justifyContent: 'center'
                        }}
                        onPress={isPass ? onPressByPass : onPress}// có hai hàm login tuỳ theo sử dụng mật khẩu hay otp
                    >
                        <Text style={{
                            fontFamily: "Inter-SemiBold",
                            fontSize: 18,
                            fontWeight: "600",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "center",
                            color: "#ffffff"
                        }}>{textButton}</Text>
                    </TouchableOpacity>
                }

                {/* {// ở trang otp thì không hiện ra
                    (!isCode && !isType && !isRegister) &&
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
                } */}
                {
                    isRegister &&
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
                }
                {
                    isType &&
                    <View style={{
                        alignItems: 'center',
                        //borderBottomWidth: 2,
                        marginBottom: Platform.OS === 'ios' ? 30 : 20
                    }}>
                        {
                            !isLoginByPass &&
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
                            />
                        }


                        {(choiceType || isLoginByPass) && <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                //borderBottomWidth: 2,
                                marginTop: Platform.OS === 'ios' ? 30 : 20
                            }}
                        >

                            <TouchableOpacity
                                style={{
                                    marginHorizontal: 5,
                                    width: Screen.width * 0.7 / 2,
                                    padding: 10,
                                    justifyContent: 'center',
                                    borderRadius: 24,
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                    borderColor: colors.appTheme
                                }}
                                onPress={onPressResident}
                            >
                                <Text style={{
                                    fontFamily: "Inter-SemiBold",
                                    fontSize: 18,
                                    fontWeight: "600",
                                    fontStyle: "normal",
                                    letterSpacing: 0,
                                    textAlign: "center",
                                    color: colors.appTheme
                                }}>Cư dân</Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    marginHorizontal: 5,
                                    width: Screen.width * 0.7 / 2,
                                    padding: 10,
                                    justifyContent: 'center',
                                    borderRadius: 24,
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                    borderColor: colors.appTheme
                                }}
                                onPress={onPressVendor}
                            >
                                <Text style={{
                                    fontFamily: "Inter-SemiBold",
                                    fontSize: 18,
                                    fontWeight: "600",
                                    fontStyle: "normal",
                                    letterSpacing: 0,
                                    textAlign: "center",
                                    color: colors.appTheme
                                }}>Nhân viên</Text>

                            </TouchableOpacity>
                        </View>}
                    </View>

                }

            </View>


            {settingText &&
                <View
                    style={{
                        marginBottom: 24,
                        width: Screen.width * 0.9,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* { 
                        !isType &&
                        <TouchableOpacity
                        onPressOut={() => this.props.reSendOtpCode(this.props.phoneNumber)}
                        >
                            <Text
                                style={{

                                    fontSize: 15,
                                    textDecorationLine: 'underline'
                                }}
                            >{Strings.login.resent.toLocaleUpperCase()}</Text>
                        </TouchableOpacity>
                    } */}
                    <TouchableOpacity></TouchableOpacity>
                    <TouchableOpacity
                        onPressOut={changePhone}
                    >
                        <Text
                            style={{
                                fontFamily: "Inter-SemiBold",
                                fontSize: 16,
                                fontWeight: "600",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                textAlign: "center",
                                color: colors.appTheme,
                                textDecorationLine: 'underline'
                            }}>{Strings.login.changephone}</Text>
                    </TouchableOpacity>
                </View>}
        </View >

    );
}
const styles = StyleSheet.create({
    text: {
        color: '#fff',
        textDecorationLine: 'underline'
    }
})
