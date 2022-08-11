//import liraries
import React, { Component, PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import fontSize from "../../../theme/fontsize";
import { MyIcon } from "../../../theme/icons";
import ImageProgress from "../../../components/common/ImageProgress";
import {
  converStatusToColor,
  converStatusToString,
} from "../../../utils/request";

import { myFromNow } from "../../../utils/request";
import moment from "moment";
import colors from "../../../theme/colors";
import fontsize from "../../../theme/fontsize";
import { Screen } from "../../../utils/device";
import responsive from "../../../../resources/responsive";
import Device from "../../../../utils/device";
// create a component
class ListItem extends PureComponent {
  render() {
    const { item, onPress, index } = this.props;
    const {
      title,
      content,
      logo,
      statusId,
      dateRequest,
      statusName,
      statusKey,
    } = item;
    return (
      <TouchableOpacity
        style={{
          // backgroundColor: "#fff",
          borderRadius: responsive.h(12),
          backgroundColor: "#ffffff",
          width: (Screen.width - responsive.h(30)) / 2,
          margin: responsive.h(10),
          // marginRight: index % 2 == 0 && 0,
          borderWidth: 0.5,
          borderColor: "#d2d2d2",
          borderBottomWidth: 2,
          padding: responsive.h(10),
        }}
        onPress={onPress}
      >
        <View>
          <View>
            <ImageProgress
              //circle={true}
              style={{
                height: responsive.h(111),
                borderRadius: responsive.h(12),
                width: "100%",
                marginBottom: responsive.h(10),
                // borderWidth: 1,
                // borderColor: "black",
              }}
              source={{ uri: logo }}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              maxWidth: responsive.w(222),
            }}
          >
            <Text
              lineBreakMode="tail"
              numberOfLines={1}
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(15),
                fontWeight: "600",
                fontStyle: "normal",
                textAlign: "left",
                color: "#282828",
                maxWidth: responsive.w(100),
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(12),
                fontWeight: "normal",
                fontStyle: "normal",
                // letterSpacing: 0,

                color: converStatusToColor(statusKey),
              }}
            >
              {statusName}
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(13),
                fontWeight: "600",
                fontStyle: "normal",
                textAlign: "left",
                color: "#888888",
                maxWidth: responsive.w(222),
              }}
              numberOfLines={1}
              lineBreakMode="tail"
            >
              {content}
            </Text>
            {/* </View> */}
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                paddingTop: responsive.h(5),
              }}
            >
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
                {moment(dateRequest).format("DD/MM/YYYY")}
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
                {moment(dateRequest).format("HH:mm")}
              </Text>
            </View>
          </View>
        </View>
        {/* <MyIcon
                    name="triangle"
                    size={35}
                    color={converStatusToColor(statusKey)}
                    style={{ position: 'absolute', top: 0, right: 0, alignSelf: 'flex-start' }} /> */}
      </TouchableOpacity>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});

//make this component available to the app
export default ListItem;
