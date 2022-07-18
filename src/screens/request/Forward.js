//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { MyIcon } from '../../theme/icons';
import NavBar from '../../components/common/NavBar';
import fontsize from '../../theme/fontsize';
import Strings from '../../utils/languages';
import colors from '../../theme/colors';


const Lookup = ({ title, placeHolder }) => {
    return (
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderColor: colors.grayBorder, borderBottomWidth: 1, paddingVertical: 20 }}>
            <Text style={{ color: colors.appTheme }}>{title.toLocaleUpperCase()}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Text style={{ marginRight: 10, color: colors.gray1 }}>{placeHolder}</Text>
                <MyIcon
                    name="arrow-arrow-down"
                    size={20}
                    color={colors.gray1}
                />
            </View>

        </TouchableOpacity>
    )
}
// create a component
class Forward extends Component {

    render() {
        const leftButton = (
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => this.props.navigation.goBack()}
            >
                <MyIcon
                    name="arrow"
                    size={20}
                    color="#fff"
                />
            </TouchableOpacity>
        )
        return (
            <View style={styles.container}>

                <NavBar leftButton={leftButton} body={<Text style={{ color: '#fff', fontSize: fontsize.medium, fontWeight: 'bold', alignSelf: 'center' }}>{Strings.detailRequest.forward}</Text>} rightButton={null} />
                <View style={{ paddingHorizontal: 20 }}>
                    <Lookup title={Strings.forwardRequest.group} placeHolder={Strings.forwardRequest.selectVendor} />
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderColor: colors.grayBorder, borderBottomWidth: 1, paddingVertical: 20 }}>
                        <Text style={{ color: colors.appTheme }}>{Strings.forwardRequest.isChoseemployee.toLocaleUpperCase()}</Text>
                        <Switch />
                    </TouchableOpacity>
                    <Lookup title={Strings.forwardRequest.employee} placeHolder={Strings.forwardRequest.unSelect} />
                    <Lookup title={Strings.forwardRequest.phoneemployee} placeHolder={Strings.forwardRequest.inputPhonenumber} />
                    <View style={{ flex: 1, paddingVertical: 20 }}>
                        <Text style={{ color: colors.appTheme }}>{Strings.forwardRequest.resion.toLocaleUpperCase()}</Text>
                        <TextInput
                            maxLength={3000}
                            underline={false}
                            multiline
                            underlineColorAndroid='transparent'
                            style={{
                                flex: 1,
                                height: 200,
                                width: '100%',
                                marginTop: 20,
                                paddingTop: Platform.OS === 'ios' ? 0 : 5,
                                textAlignVertical: Platform.OS === 'ios' ? 'auto' : 'top',
                                alignContent: 'flex-start',
                                alignSelf: 'flex-start',
                                backgroundColor: 'red'
                            }}
                            placeholder={Strings.detailRequest.tabContent}
                            placeholderTextColor={colors.gray1}
                        // value={this.props.content}
                        // onChangeText={(text) => { this.props.resetStateByKey({ key: 'content', path: '', value: text }); }}
                        />
                    </View>
                </View>

            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,


        backgroundColor: '#fff',
    },
});

//make this component available to the app
const mapStateToProps = state => ({

})
const mapActionToProps = {

}
export default connect(null, mapActionToProps)(Forward);
