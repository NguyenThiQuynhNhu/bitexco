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
          marginHorizontal: responsive.h(10),
          marginBottom: responsive.h(10),
          padding: responsive.h(10),
          borderRadius: responsive.h(20),
          backgroundColor: "#ffffff",
          borderWidth: 0.5,
          borderBottomWidth: 2,
          borderColor: "#d2d2d2",
        }}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: responsive.h(5),
        }}>
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: responsive.h(16),
              fontWeight: "600",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
              color: "#282828",
              flex: 1
            }}
          >
            {serviceName}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: responsive.h(16),
              fontWeight: "600",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "right",
              color: colors.appTheme,
              flex: 1
            }}
          >
            {amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: responsive.h(5),
        }}>
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
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: responsive.h(5),
        }}>
          <Text
            style={{
              fontFamily: "Inter-Medium",
              fontSize: responsive.h(12),
              fontWeight: "500",
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
              color: "#626262",
              marginBottom: responsive.h(5),
            }}
          >
            {description}
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
