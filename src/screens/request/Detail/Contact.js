//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    FlatList,
    Modal,
    TextInput,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import ImageGallery from '../../../components/Request/Detail/ImageGallery';
import colors from '../../../theme/colors';
import Strings from '../../../utils/languages';
import { MyIcon } from '../../../theme/icons';
import fontsize from '../../../theme/fontsize';


const Info = ({ icon, value, style }) => {
    return (
        <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'flex-start', alignItems: 'center' }}>
            {/* <Text style={{ color: colors.appTheme, fontSize: fontsize.medium }}>{name.toLocaleUpperCase()}</Text>
            {value === null ? <Text /> : <Text style={{ marginVertical: 10, fontSize: fontsize.medium }}>{value}</Text>} */}
            <View style={{
                borderRadius: 6,
                backgroundColor: "#fff200", padding: 5, alignItems: 'center', justifyContent: 'center', marginRight: 10
            }}>
                <MyIcon name={icon} color='#fff' size={18} />
            </View>
            {value === null ? <Text /> : <Text style={{
                fontFamily: "Inter-SemiBold",
                fontSize: 14,
                fontWeight: "600",
                textAlign: "left",
                color: "#282828"
            }}>{value}</Text>}
        </View>
    );
}
// create a component
class Contact extends Component {

    render() {
        const { data } = this.props;
        const {
            userContact,
            phoneContact,
            contractName,
            timeContact,
            residentName
        } = data
        return (
            <View style={{
                borderRadius: 10, marginTop: 20, padding: 10, marginHorizontal: 20,
                backgroundColor: "#ffffff",
                shadowColor: "rgba(0, 0, 0, 0.1)",
                elevation: 2,
                shadowOffset: {
                    width: 0,
                    height: 4
                },
                shadowRadius: 10,
                shadowOpacity: 1,
            }}>
                {/* <View style={{ flexDirection: 'row' }}>
                    <Info name="tên" value={userContact.length > 0 ? userContact : residentName} />
                    {phoneContact.length > 0 && <Info style={{ marginLeft: 20 }} name="số điện thoại" value={phoneContact} />}
                </View> */}
                <Info icon="user" value={userContact.length > 0 ? userContact : residentName} />
                {phoneContact.length > 0 && <Info icon="call" value={phoneContact} />}
                <Info icon="place" value={`Căn hộ ${contractName}`} />
                <Info icon="alarm" value={moment(timeContact).format('HH:mm DD/MM/YYYY')} />
            </View>
        )

    }
}

const mapStateToProps = state => ({
    data: state.requestDetail.data
})

// const mapActionToProps = {
//     loadDataHandle,
//     resetStateByKey,
//     refreshDataHandle,
//     closeRequestHandle
// }

//make this component available to the app
export default connect(mapStateToProps)(Contact);
