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
const FeildText = ({ style, name, text, nameStyle, textStyle }) => {
  return (
    <View
      style={{
        marginTop: responsive.h(10),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        ...style,
      }}
    >
      <Text
        style={{
          fontFamily: "Inter-Medium",
          fontSize: responsive.h(14),
          fontWeight: "500",
          fontStyle: "normal",
          letterSpacing: 0,
          textAlign: "left",
          color: "#3d3d3d",
          ...nameStyle,
        }}
      >
        {name}:{" "}
      </Text>
      <Text
        style={{
          fontFamily: "Inter",
          fontSize: responsive.h(16),
          fontWeight: "500",
          fontStyle: "normal",
          letterSpacing: 0,
          textAlign: "right",
          color: "red",
          ...textStyle,
        }}
      >
        {text}
      </Text>
      <Text
        style={{
          fontFamily: "Inter-Regular",
          fontSize: responsive.h(11),
          fontWeight: "normal",
          fontStyle: "normal",
          letterSpacing: 0,
          textAlign: "right",
          color: "#6f6f6f",
        }}
      >
        {" "}
        VNĐ
      </Text>
    </View>
  );
};
class ListItem extends PureComponent {
  render() {
    const { item, onPress, user } = this.props;
    const {
      time,
      title,
      amountOldDebt,
      amountIncurred,
      amountPaid,
      isPaid,
      amountLeft,
    } = item;
    console.log(item);
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: "row",
          padding: responsive.h(20),
          backgroundColor: "#fff",
          marginHorizontal: responsive.h(20),
          marginVertical: responsive.h(10),
          borderRadius: responsive.h(12),
          // backgroundColor: "#ffffff",
          // shadowColor: "rgba(0, 0, 0, 0.1)",
          // elevation: 2,
          // shadowOffset: {
          //   width: 0,
          //   height: 4,
          // },
          // shadowRadius: 10,
          // shadowOpacity: 1,
          borderWidth: responsive.h(1),
          borderBottomWidth: responsive.h(2),
          borderColor: "#f1f1f1",
        }}
      >
        {/* <ImageProgress circle={true} source={{ uri: user ? user.photoUrl : '' }} style={{ height: 50, width: 50 }} /> */}
        <View style={{ flex: 1 }}>
          <View style={{ width: "95%", justifyContent: "space-between" }}>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(16),
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#282828",
              }}
            >
              {title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: responsive.h(10),
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: responsive.h(16),
                  fontWeight: "600",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "right",
                  color: "#3ba250",
                }}
              >
                {amountIncurred
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: responsive.h(11),
                  fontWeight: "normal",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "right",
                  color: "#6f6f6f",
                }}
              >
                {" "}
                VNĐ
              </Text>
            </View>

            {/* <Text style={{ color: isPaid ? colors.appTheme : colors.red, fontSize: fontsize.small }}>{isPaid ? Strings.payment.paidStatus : Strings.payment.unpaidStatus}</Text> */}
          </View>
          <FeildText
            name={Strings.payment.debt}
            text={amountLeft.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            textStyle={{ fontWeight: "bold", color: "#3ba250" }}
            nameStyle={{}}
          />
        </View>
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
          {time}
        </Text>
      </TouchableOpacity>
    );
  }
}

//make this component available to the app
export default ListItem;
