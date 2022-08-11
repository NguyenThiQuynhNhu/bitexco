//import liraries
import React, { PureComponent } from "react";
import moment from "moment";
import { View, Text, TouchableOpacity } from "react-native";
import ImageProgress from "../../components/common/ImageProgress";
import FontSize from "../../theme/fontsize";
import colors from "../../theme/colors";
import fontsize from "../../theme/fontsize";
import Strings from "../../utils/languages";
import responsive from "../../../resources/responsive";
// create a component
class ListItemHistory extends PureComponent {
  render() {
    const { item, onPress, user } = this.props;
    const { serviceName, code, amount, description, dateOfPaid } = item;

    return (
      <View
        // onPress={onPress}
        style={{
          flexDirection: "row",
          marginHorizontal: responsive.h(20),
          marginBottom: responsive.h(10),
          padding: responsive.h(10),
          borderRadius: responsive.h(20),
          backgroundColor: "#ffffff",
          shadowColor: "rgba(0, 0, 0, 0.1)",
          elevation: 2,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowRadius: 10,
          shadowOpacity: 1,
        }}
      >
        {/* <ImageProgress circle={true} source={{ uri: user ? user.photoUrl : '' }} style={{ height: 50, width: 50 }} /> */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: responsive.h(16),
              fontWeight: "600",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
              color: "#282828",
            }}
          >
            {serviceName}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Medium",
              fontSize: responsive.h(14),
              fontWeight: "500",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
              color: "#3d3d3d",
            }}
          >
            {code}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Medium",
              fontSize: responsive.h(12),
              fontWeight: "500",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
              color: "#626262",
            }}
          >
            {description}
          </Text>
        </View>
        <View
          style={{
            width: "30%",
            justifyContent: "flex-start",
            alignItems: "flex-end",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: responsive.h(16),
              fontWeight: "600",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "right",
              color: "#ff624d",
            }}
          >
            {amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: responsive.h(11),
              fontWeight: "normal",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
              color: "#6f6f6f",
            }}
          >
            {moment(dateOfPaid).format("DD/MM/YYYY")}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: responsive.h(11),
              fontWeight: "normal",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
              color: "#6f6f6f",
            }}
          >
            {moment(dateOfPaid).format("HH:mm:ss")}
          </Text>
        </View>
      </View>
    );
  }
}

//make this component available to the app
export default ListItemHistory;
