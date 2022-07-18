//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Linking
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { MyIcon } from '../../theme/icons';
import fontSize from '../../theme/fontsize';
import { resetStateByKey } from '../../actions/app';
import { signOut } from '../../actions/auth';
import colors from '../../theme/colors';
import { Screen } from '../../utils/device'

// create a component
class ModalUpdateVerSion extends Component {
    state = {
        isShow: false,
        version: Platform.OS == 'ios' ? 1 : 1
    }
    render() {
        const { version } = this.props
        let isShow =  (version != 0 && this.state.version < version)
        return (
            <Modal
                visible={ isShow}
                onRequestClose={() => null}
                transparent
            >
                <View style={{ flex: 1, backgroundColor: colors.appOverView, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: Screen.width - 60, borderRadius: 20, borderWidth: 1, borderColor: colors.appTheme, backgroundColor: '#fff', padding: 20  }}>
                            <Text style={{ color: '#000', fontFamily: "Inter-Bold", textAlign: 'center' }}>Thông báo</Text>
                            <Text style={{ color: '#000', marginTop: 10, fontFamily: "Inter-Medium", textAlign: 'center' }}>Bitexco property đã có phiên bản mới. Hãy cập nhật để sử dụng các dịch vụ mới nhất và trải nghiệm tốt nhất.</Text>
                            <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={()=>{
                                        if(Platform.OS == 'ios'){
                                            Linking.openURL('https://apps.apple.com/us/app/xmh-building-care/id1584775347')
                                        }else{
                                            Linking.openURL('https://play.google.com/store/apps/details?id=com.building.vime.bitexco')
                                        }
                                    }}
                                    style={{
                                        padding: 20,
                                        paddingVertical: 10,
                                        borderRadius: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: colors.appTheme,
                                        borderStyle: "solid",
                                        borderWidth: 1,
                                        borderColor: colors.appTheme
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontFamily: "Inter-Bold", textAlign: 'center' }}>Cập nhật</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                </View>
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

const mapStateToProps = state => ({
    showModal: state.app.showModal,
    user: state.auth.user,
    tokenDevice: state.auth.tokenDevice
})
const mapActionToProps = {
    resetStateByKey,
    signOut
}

//make this component available to the app
export default connect(mapStateToProps, mapActionToProps)(ModalUpdateVerSion);
