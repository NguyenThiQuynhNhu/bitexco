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
import moment from "moment";
import { connect } from "react-redux";
import ImageGallery from "../../../components/Request/Detail/ImageGallery";
import colors from "../../../theme/colors";
import Strings from "../../../utils/languages";
import { MyIcon } from "../../../theme/icons";
import fontsize from "../../../theme/fontsize";
import responsive from "../../../resources/responsive";

const Info = ({ icon, value, style }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginVertical: responsive.h(5),
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {/* <Text style={{ color: colors.appTheme, fontSize: fontsize.medium }}>{name.toLocaleUpperCase()}</Text>
            {value === null ? <Text /> : <Text style={{ marginVertical: 10, fontSize: fontsize.medium }}>{value}</Text>} */}
      <View
        style={{
          borderRadius: responsive.h(6),
          backgroundColor: "#df2027",
          alignItems: "center",
          justifyContent: "center",
          marginRight: responsive.h(10),
          width: responsive.h(35),
          height: responsive.h(35)
        }}
      >
        <MyIcon name={icon} color="#fff" size={responsive.h(18)} />
      </View>
      {value === null ? (
        <Text />
      ) : (
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            fontSize: responsive.h(16),
            fontWeight: "600",
            textAlign: "left",
            color: "#282828",
          }}
        >
          {value}
        </Text>
      )}
    </View>
  );
};
// create a component
class Contact extends Component {
  render() {
    const { data } = this.props;
    const {
      userContact,
      phoneContact,
      contractName,
      timeContact,
      residentName,
    } = data;
    return (
      <View
        style={{
          backgroundColor: "#ffffff",
          marginTop: responsive.h(20),
        }}
      >
        {/* <View style={{ flexDirection: 'row' }}>
                    <Info name="tên" value={userContact.length > 0 ? userContact : residentName} />
                    {phoneContact.length > 0 && <Info style={{ marginLeft: 20 }} name="số điện thoại" value={phoneContact} />}
                </View> */}
        <Info
          icon="profile1"
          value={userContact.length > 0 ? userContact : residentName}
        />
        {phoneContact.length > 0 && <Info icon="call" value={phoneContact} />}
        <Info icon="place" value={`Căn hộ ${contractName}`} />
        <Info
          icon="alarm"
          value={moment(timeContact).format("HH:mm DD/MM/YYYY")}
        />
      </View>
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
export default connect(mapStateToProps)(Contact);
