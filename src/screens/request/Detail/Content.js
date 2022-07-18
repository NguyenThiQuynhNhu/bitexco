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
import { connect } from 'react-redux';
import ImageGallery from '../../../components/Request/Detail/ImageGallery';
import colors from '../../../theme/colors';
import Strings from '../../../utils/languages';
import { MyIcon } from '../../../theme/icons';

// create a component
class Content extends Component {
    render() {
        const { data } = this.props;
        const {
            content,
            imageCustormer,
            imageAdmin,
            title
        } = data
        return (
            <ScrollView style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}>
                <Text style={{
                    fontFamily: "Inter-Bold",
                    fontSize: 14,
                    textAlign: "left",
                    color: "#282828",
                    marginBottom: 5
                }}>
                    {title}
                </Text>
                <Text style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 14,
                    textAlign: "left",
                    color: "#000000"
                }}>
                    {content}
                </Text>
                
                {imageCustormer.length !== 0 &&
                    <View style={{ marginTop: -10 }}>
                        <ImageGallery data={imageCustormer} />
                    </View>
                }

                {imageAdmin.length !== 0 &&
                    <View style={{ marginTop: 10 }}>
                        <ImageGallery data={imageAdmin} title='Ảnh nhân viên up' />
                    </View>
                }
                {/* <View
                    style={{
                        marginTop:20,
                        backgroundColor: colors.appTheme,
                        width: '50%',
                        height: 50,
                        borderRadius: 25,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <MyIcon
                        name="download"
                        size={20}
                        color='#fff'
                        style={{ marginRight: 10 }}
                    />
                    <Text style={{ color: '#fff' }}>Tải về</Text>
                </View> */}
            </ScrollView>
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
export default connect(mapStateToProps)(Content);
