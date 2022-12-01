//import liraries
import React, { Component, PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import fontSize from "../../../../theme/fontsize";

import ImageProgress from "../../../../components/common/ImageProgress";
import {
  converStatusToColor,
  converStatusToString,
  converStatusToColorServiceByString,
} from "../../../../utils/request";
import { MyIcon } from "../../../../theme/icons";

import moment from "moment";
import colors from "../../../../theme/colors";
import fontsize from "../../../../theme/fontsize";
import { Screen } from "../../../../utils/device";
import responsive from "../../../../../resources/responsive"; // create a component
class ListItem extends PureComponent {
  render() {
    const { item, onPress, deleteService } = this.props;
    const {
      serviceName,
      description,
      statusName,
      dateBook,
      logo,
      statusId,
    } = item;
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#fff",
          borderRadius: responsive.h(12),
          backgroundColor: "#ffffff",
          width: (Screen.width - responsive.h(30)) / 2,
          marginBottom: responsive.h(10),
          marginRight: responsive.h(10),
          // margin: responsive.h(10),
          // marginRight: index % 2 != 0 ? 0 : 10,
          borderWidth: 0.5,
          borderColor: "#d2d2d2",
          borderBottomWidth: 2,
          padding: responsive.h(10),
        }}
        onPress={onPress}
      >
        <View>
          <ImageProgress
            //circle={true}
            style={{
              height: responsive.h(111),
              borderRadius: responsive.h(12),
              width: "100%",
            }}
            source={{ uri: logo }}
          />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              maxWidth: responsive.w(222),
              marginTop: responsive.h(10),
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
              {serviceName}
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(12),
                fontWeight: "normal",
                fontStyle: "normal",
                // letterSpacing: 0,

                color: converStatusToColorServiceByString(statusName),
              }}
            >
              {statusName}
            </Text>
          </View>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(13),
                fontWeight: "600",
                fontStyle: "normal",
                textAlign: "left",
                color: "#888888",
                maxWidth: responsive.w(222),
                marginTop: responsive.h(3),
              }}
              numberOfLines={1}
              lineBreakMode="tail"
            >
              {description}
            </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: responsive.h(15),
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
              {moment(dateBook).format("DD/MM/YYYY")}
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
              {moment(dateBook).format("HH:mm")}
            </Text>
          </View>
        </View>

        {/* {statusName == "Mới" && (
          <TouchableOpacity
            style={{
              borderRadius: 45,
              height: 40,
              width: 40,
              backgroundColor: "red",
              justifyContent: "center",
              alignItems: "center",
              margin: 10,
            }}
            onPress={() => deleteService(item.id)}
          >
            <MyIcon name="x" size={20} color="#fff" />
          </TouchableOpacity>
        )} */}
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
