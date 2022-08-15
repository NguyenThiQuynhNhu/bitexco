//import liraries
import React, { Component, PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
import fontSize from "../../../theme/fontsize";
import { MyIcon } from "../../../theme/icons";
import { converTypeToIcon } from "../../../utils/notification";
import ImageProgress from "../../common/ImageProgress";
import { myFromNow } from "../../../utils/request";
import colors from "../../../theme/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import responsive from "../../../resources/responsive";

// create a component
class ListItem extends PureComponent {
  render() {
    const { item, onPress } = this.props;
    const {
      id,
      title,
      description,
      dateCreate,
      employeeName,
      imageUrl,
      linkId,
      typeId,
      isRead,
      actionName,
    } = item;

    return (
      <TouchableOpacity style={{ flexDirection: "row" }} onPress={onPress}>
        <View
          style={{
            flex: 1,
            padding: responsive.h(20),
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
              isRead || Platform.OS != "ios" ? "#fff" : "#eeeeee",
            // borderTopRightRadius: Platform.OS === "ios" ? null :  responsive.h(50),
          }}
        >
          <View
            style={{
              borderRadius: responsive.h(30),
              height: responsive.h(60),
              width: responsive.h(60),
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#d2d2d2",
              borderWidth: 1,
            }}
          >
            <MyIcon
              name="megaphone-01"
              size={responsive.h(30)}
              color="#d2d2d2"
            />

            {/* {!isRead ? (
              <View
                style={{
                  borderRadius: 45,
                  height: 10,
                  width: 10,
                  backgroundColor: "red",
                  position: "absolute",
                  right: 10,
                  bottom: 0,
                }}
              />
            ) : null} */}
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              marginLeft: responsive.h(10),
            }}
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text numberOfLines={3} lineBreakMode="tail">
                <Text
                  style={{
                    fontFamily: "Inter-Bold",
                    fontSize: responsive.h(14),
                    fontWeight: "bold",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: isRead ? "#626262" : "#282828",
                  }}
                >
                  {title}
                </Text>
                <Text
                  style={{
                    fontSize: responsive.h(14),
                    fontFamily: "Inter-Medium",
                    color: isRead ? "#626262" : "#282828",
                    color: isRead ? "#626262" : "#282828",
                  }}
                >
                  {actionName}
                </Text>{" "}
                <Text
                  style={{
                    fontSize: responsive.h(14),
                    fontWeight: "bold",
                    fontFamily: "Inter-Bold",
                    color: isRead ? "#626262" : "#282828",
                  }}
                >
                  {description}
                </Text>
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: isRead ? colors.gray1 : colors.appTheme,
                  color: "#a0a0a0",
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(12),
                  textAlign: "left",
                }}
                numberOfLines={2}
                lineBreakMode="tail"
              >
                {moment(dateCreate).format("HH:mm - DD [tháng] MM, YYYY")}
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
