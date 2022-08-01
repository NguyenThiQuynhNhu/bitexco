//import liraries
import React, { Component, PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import fontSize from "../../../theme/fontsize";

import ImageProgress from "../../../components/common/ImageProgress";
import { converStatusToColorServiceByString } from "../../../resident/utils/request";

import moment from "moment";
import colors from "../../../theme/colors";
import fontsize from "../../../theme/fontsize";
import responsive from "../../../resources/responsive";

// create a component
class ListItem extends PureComponent {
  render() {
    const { item, onPress } = this.props;
    const {
      residentName,
      serviceName,
      description,
      statusName,
      dateBook,
      logo,
      apartmentName,
    } = item;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          backgroundColor: "#ffffff",
          //   shadowColor: "rgba(0, 0, 0, 0.1)",
          elevation: 1,
          height: responsive.h(180),
          width: responsive.w(180),
          //   shadowOffset: {
          //     width: 0,
          //     height: 4,
          //   },
          //   shadowRadius: 10,
          //   shadowOpacity: 1,
          //   marginVertical: 10,
          marginHorizontal: 10,
          borderWidth: 1,
          borderBottomWidth: 3,
          borderColor: "#f5f5f5",
          padding: 10,
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
              justifyContent: "space-between",
            }}
          >
            <ImageProgress
              circle={true}
              style={{
                height: responsive.h(51),
                width: responsive.w(51),
                marginTop: 8,
              }}
              source={{ uri: logo }}
            />
            <View
              style={{
                // flex: 1,
                // marginLeft: 10,
                // minHeight: 35,
                // justifyContent: "space-between",
                // flexDirection: "column",
                marginVertical: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(15),
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "black",
                  textTransform: "uppercase",
                  maxWidth: responsive.w(100),
                }}
                lineBreakMode="tail"
                numberOfLines={1}
              >
                {residentName}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter-Me",
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
                  // margin: 2,
                  // marginHorizontal: 5,
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
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
                // marginTop: 15,
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(16),
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
            {description ? (
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: responsive.h(13),
                  fontWeight: "normal",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#3d3d3d",
                }}
                numberOfLines={2}
                lineBreakMode="tail"
              >
                {description}
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
                  fontSize: 11,
                  fontWeight: "normal",
                  fontStyle: "normal",
                  color: "#6f6f6f",
                }}
              >
                {moment(dateBook).format("DD/MM/YYYY")}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 11,
                  fontWeight: "normal",
                  fontStyle: "normal",
                  color: "#6f6f6f",
                }}
              >
                {moment(dateBook).format("HH:mm")}
              </Text>
            </View>
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
