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
          backgroundColor: "#fff",
          borderRadius: responsive.h(12),
          backgroundColor: "#ffffff",
          width: (Screen.width - responsive.h(30))/2,
          margin: responsive.h(10),
          marginRight: index % 2 == 0 && 0,
          borderWidth: 0.5,
          borderColor: "#d2d2d2",
          borderBottomWidth: 2,
          padding: responsive.h(10),
        }}
      >
        <View
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: 'flex-start',
              // alignItems: "center",
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

            <View style={{marginLeft: responsive.h(10), flex: 1}}>
              <Text
                style={{
                  fontFamily: "Inter-Bold",
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
                  color: converStatusToColor(statusName),
                }}
                numberOfLines={1}
              >
                {statusName}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                // marginTop: 15,
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
            {content ? (
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: responsive.h(14),
                  fontWeight: "normal",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#3d3d3d",
                }}
                numberOfLines={2}
                lineBreakMode="tail"
              >
                {content}
              </Text>
            ) : null}
          </View>
          <View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 5,
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
