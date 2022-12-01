//import liraries
import React, { Component, PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
import fontSize from "../../../theme/fontsize";
import { MyIcon } from "../../../theme/icons";
import { Screen } from "../../../utils/device";
import {
  converStatusToColor,
  converStatusToString,
} from "../../../utils/request";
import ImageProgress from "../../common/ImageProgress";
import { myFromNow } from "../../../utils/request";
import responsive from "../../../resources/responsive";
// create a component
class ListItem extends PureComponent {
  render() {
    const { item, onPress, index } = this.props;
    const {
      title,
      content,
      dateCreate,
      residentName,
      contractName,
      avatarResident,
      employeeName,
      departmentName,
      colorCode,
      statusName,
      statusKey,
    } = item;

    //console.log(item)
    return (

      <TouchableOpacity
        onPress={onPress}
        style={{
          //flex: 1,
          backgroundColor: "#fff",
          borderRadius: responsive.h(12),
          backgroundColor: "#ffffff",
          width: (Screen.width - responsive.h(30)) / 2,
          marginBottom: responsive.h(15),
          marginRight: responsive.h(10),
          borderWidth: 0.5,
          borderColor: "#d2d2d2",
          borderBottomWidth: 2,
          padding: responsive.h(10),
          paddingVertical: responsive.h(15),
          justifyContent: 'space-between'
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <ImageProgress
            // circle={true}
            style={{
              height: responsive.h(41),
              width: responsive.h(41),
              borderRadius: responsive.h(22),
            }}
            source={{ uri: avatarResident }}
          />

          <View style={{ marginLeft: responsive.h(10), flex: 1 }}>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontWeight: '600',
                fontSize: responsive.h(15),
                color: "black",
                //textTransform: "uppercase",
              }}
              numberOfLines={2}
              lineBreakMode="tail"
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
              numberOfLines={1}
            >
              MS: {contractName}
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
              numberOfLines={1}
            >
              {employeeName} - {departmentName}
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(12),
                fontWeight: "normal",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: colorCode,
              }}
              numberOfLines={1}
            >
              {statusName}
            </Text>
          </View>
        </View>
        <View style={{marginTop: responsive.h(15)}}>
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
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: responsive.h(14),
            color: "#3d3d3d",
          }}
          numberOfLines={2}
        >
          {content}
        </Text>
        </View>
        
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: 'flex-end',
            justifyContent: "space-between",
            marginTop: 5,
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
