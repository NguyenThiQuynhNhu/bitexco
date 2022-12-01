//import liraries
import React, { Component, PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import fontSize from "../../../theme/fontsize";
import { Screen } from "../../../utils/device";
import ImageProgress from "../../../components/common/ImageProgress";
import {
  converStatusToColorServiceByString,
} from "../../../utils/request";

import moment from "moment";
import colors from "../../../theme/colors";
import fontsize from "../../../theme/fontsize";
import responsive from "../../../resources/responsive";

// create a component
class ListItem extends PureComponent {
  render() {
    const { item, onPress, index } = this.props;
    const {
      residentName,
      serviceName,
      description,
      statusName,
      dateCreate,
      logo,
      apartmentName,
    } = item;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: "#fff",
          borderRadius: responsive.h(12),
          backgroundColor: "#ffffff",
          width: (Screen.width - responsive.h(30)) / 2,
          marginBottom: responsive.h(15),
          marginRight: responsive.h(10),
          // margin: responsive.h(10),
          // marginRight: index % 2 != 0 ? 0 : 10,
          borderWidth: 0.5,
          borderColor: "#d2d2d2",
          borderBottomWidth: 2,
          padding: responsive.h(10),
          paddingVertical: responsive.h(15),
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              //display: "flex",
              justifyContent: "space-between",
              marginBottom: responsive.h(15),
            }}
          >
            <ImageProgress
              // circle={true}
              style={{
                height: responsive.h(41),
                width: responsive.h(41),
                borderRadius: responsive.h(22),
              }}
              source={{ uri: logo }}
            />
            <View style={{ marginLeft: responsive.h(10), flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(15),
                  color: "black",
                }}
                lineBreakMode="tail"
                numberOfLines={2}
              >
                {residentName}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: responsive.h(14),
                  fontWeight: "normal",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#888888",
                }}
              >
                MS: {apartmentName}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: responsive.h(12),
                  fontWeight: "normal",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: converStatusToColorServiceByString(statusName),
                }}
              >
                {statusName}
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(14),
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#282828",
              }}
              numberOfLines={1}
            >
              {serviceName}
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(14),
                color: "#3d3d3d",
              }}
              numberOfLines={1}
            //lineBreakMode="tail"
            >
              {description}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: 'flex-end',
              justifyContent: "space-between",
              marginTop: responsive.h(15),
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(12),
                fontWeight: "normal",
                fontStyle: "normal",
                color: "#6f6f6f",
              }}
            >
              {moment(dateCreate).format("DD/MM/YYYY")}
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(12),
                fontWeight: "normal",
                fontStyle: "normal",
                color: "#6f6f6f",
              }}
            >
              {moment(dateCreate).format("HH:mm")}
            </Text>
          </View>
        </View>
        {/* <MyIcon
                        name="triangle"
                        size={20}
                        color={converStatusToColor(statusId)}
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
