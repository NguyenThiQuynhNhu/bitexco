//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MyIcon } from '../../../theme/icons';

// create a component
class ConfirmPopup extends Component {
    state = {
        isShowModal: true
    }
    render() {
        const { onCancel, onAccept, onChangeText } = this.props;
        const { } = this.state;
        return (
            <Modal
                transparent={true}
                visible={this.state.isShowModal}
            >
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"}
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0,0.3)'
                    }}>
                    <LinearGradient
                        colors={[colors.appTheme, '#fff']}
                        style={styles.linearGradient}
                    >
                        <View
                            style={{
                                borderRadius: 5
                            }}
                        >
                            <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{'xác nhận'.toLocaleUpperCase()}</Text>
                            </View>
                            <View>
                                <TextInput
                                    autoFocus
                                    autoCorrect={false}
                                    style={{
                                        backgroundColor: '#fff',
                                        height: 100,
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        margin: 5,
                                        borderColor: colors.grayBorder,
                                        textAlignVertical: 'top'
                                    }}
                                    onEndEditing={onAccept}
                                    underlineColorAndroid="transparent"
                                    multiline={true}
                                    placeholder="Diễn giải"
                                    onChangeText={(text) => this.setState({ content: text })}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 20, alignSelf: 'center', marginBottom: 10 }}>
                                <TouchableOpacity
                                    style={{
                                        height: 50,
                                        width: 50,
                                        borderRadius: 25,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: colors.appTheme
                                    }}
                                    onPress={() => this.setState({ isShowModal: false }, () => this.props.closeRequestHandle({ request: { id, statusId: 13, content: this.state.content }, userName: this.props.user.fullName }))}
                                >
                                    <MyIcon
                                        name="checkmark"
                                        size={30}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isShowModal: false })}
                                    style={{
                                        marginLeft: 50,
                                        height: 50,
                                        width: 50,
                                        borderRadius: 25,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: colors.appTheme
                                    }}
                                >
                                    <MyIcon
                                        name="x"
                                        size={30}
                                        color="#fff"
                                    />

                                </TouchableOpacity>
                            </View>

                        </View>
                    </LinearGradient>
                </KeyboardAvoidingView>
            </Modal>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default ConfirmPopup;
