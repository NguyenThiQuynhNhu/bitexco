//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { MyIcon } from '../../theme/icons';
import fontSize from '../../theme/fontsize';
import { resetStateByKey } from '../../actions/app';
import { signOut } from '../../actions/auth';
import Strings from '../../resident/utils/languages';
// create a component
class ModalLogOut extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isLogOut: false
        }
    }
    render() {
        return (
            <Modal
                visible={this.props.isShow}
                onRequestClose={() => null}
            >
                <LinearGradient
                    colors={[colors.appTheme, '#fff']}
                    style={{
                        flex: 1,
                        backgroundColor: colors.primaryKeyColor
                    }}
                >
                    <View style={{ flex: 1, marginTop: 100, alignItems: 'center' }}>
                        <MyIcon
                            name="switch"
                            size={200}
                            color="#fff"
                        />
                        <Text style={{ fontSize: fontSize.medium, color: '#fff', marginTop: 20, fontFamily: "Inter-Bold", }}>{Strings.profile.questionLogout}?</Text>
                        <View style={{ flexDirection: 'row', marginTop: 100 }}>

                            <TouchableOpacity
                                onPress={this.props.onPress}
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
                                onPress={() => {
                                    this.setState({ isLogOut: true})
                                    this.props.resetStateByKey({ showModal: false })
                                    this.props.signOut({ towers: this.props.user.towers, tokenDevice: this.props.tokenDevice })
                                }}
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
                                    name="check"
                                    size={30}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                            
                        </View>
                        {this.state.isLogOut &&  <View><ActivityIndicator  color={colors.appTheme}/></View>}
                    </View>
                    
                </LinearGradient>
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
export default connect(mapStateToProps, mapActionToProps)(ModalLogOut);
