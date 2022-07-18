//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, Platform, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MyIcon } from '../../../../theme/icons';
import colors from '../../../../theme/colors';
import Strings from '../../../../utils/languages';

// create a component
const CommentView = ({ onYes, onChangeText, onClose }) => {
    return (


        <LinearGradient
            colors={[colors.appTheme, '#fff']}
            style={styles.linearGradient}
        >
            <View
                style={{
                    borderRadius: 16
                }}
            >
                <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                        color: 'white',
                        fontFamily: "Inter-SemiBold",
                        fontSize: 18,
                        fontWeight: "600",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "center"
                    }}>{Strings.app.confirm}</Text>
                </View>
                <View>
                    <TextInput
                        autoFocus
                        autoCorrect={false}
                        style={{
                            backgroundColor: '#fff',
                            height: 100,
                            borderRadius: 8,
                            borderWidth: 1,
                            margin: 10,
                            marginLeft: 10,
                            borderColor: colors.grayBorder,
                            textAlignVertical: 'top',
                            fontFamily: "Inter-Regular",
                            fontSize: 14,
                        }}

                        onSubmitEditing={onYes}
                        underlineColorAndroid="transparent"
                        multiline={true}
                        placeholder={Strings.app.description}
                        onChangeText={onChangeText}
                    />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20, alignSelf: 'center', marginBottom: 10 }}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={{
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: "#ffffff",
                            borderStyle: "solid",
                            borderWidth: 1,
                            borderColor: colors.appTheme
                        }}
                    >
                        <MyIcon
                            name="x"
                            size={30}
                            color={colors.appTheme}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            marginLeft: 50,
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.appTheme
                        }}
                        onPress={onYes}
                    >
                        <MyIcon
                            name="check"
                            size={30}
                            color="#fff"
                        />
                    </TouchableOpacity>

                </View>

            </View>
        </LinearGradient>

    );
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    linearGradient: {
        width: '90%',
        borderRadius: 16,
        backgroundColor: colors.appTheme
    },
});

export default (CommentView);
