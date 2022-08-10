//import liraries
import React, { Component } from "react";
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
  KeyboardAvoidingView,
} from "react-native";
import { connect } from "react-redux";
import ImageGallery from "../../../components/Request/Detail/ImageGallery";
import colors from "../../../theme/colors";
import Strings from "../../../utils/languages";
import { MyIcon } from "../../../theme/icons";
import responsive from "../../../resources/responsive";

// create a component
class Content extends Component {
  render() {
    const { data } = this.props;
    const { content, imageCustormer, imageAdmin, title } = data;
    return (
      <ScrollView style={{ flex: 1, paddingHorizontal: responsive.h(20), marginTop: responsive.h(20) }}>
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            fontSize: responsive.h(15),
            textAlign: "left",
            color: "#282828",
            marginBottom: responsive.h(5),
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            fontSize: responsive.h(15),
            textAlign: "left",
            color: "#888888",
          }}
        >
          {content}
        </Text>

        {imageCustormer.length !== 0 && (
          <View style={{ marginTop: -responsive.h(10) }}>
            <ImageGallery data={imageCustormer} />
          </View>
        )}

        {imageAdmin.length !== 0 && (
          <View style={{ marginTop: responsive.h(10) }}>
            <ImageGallery data={imageAdmin} title="Ảnh nhân viên up" />
          </View>
        )}
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
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.requestDetail.data,
});

// const mapActionToProps = {
//     loadDataHandle,
//     resetStateByKey,
//     refreshDataHandle,
//     closeRequestHandle
// }

//make this component available to the app
export default connect(mapStateToProps)(Content);
