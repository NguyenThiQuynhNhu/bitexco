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
import responsive from "../../../../resources2/responsive";
import Device from "../../../../utils/device";
// create a component
class ListItem extends PureComponent {
  render() {
    const { item, onPress } = this.props;
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
          padding: 5,
          borderRadius: 12,
          marginVertical: 5,
          // marginHorizontal: 10,
          justifyContent: "center",
          backgroundColor: "#ffffff",
          shadowColor: "rgba(0, 0, 0, 0.1)",
          justifyContent: "center",
          elevation: 2,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowRadius: 10,
          shadowOpacity: 1,
          marginHorizontal: responsive.h(8),
          height: responsive.h(220),
          width: responsive.w(186),
        }}
        onPress={onPress}
      >
        <View>
          <View>
            <ImageProgress
              //circle={true}
              style={{
                height: responsive.h(111),
                borderRadius: 12,
                width: responsive.w(170),
                marginBottom: responsive.h(10),
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
              numberOfLines={2}
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
                marginVertical: responsive.h(8),
                maxWidth: responsive.w(222),
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 11,
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
                  fontSize: 11,
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
