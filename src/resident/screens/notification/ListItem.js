//import liraries
import React, { PureComponent } from "react";
import moment from "moment";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import ImageProgress from "../../components/common/ImageProgress";

import FontSize from "../../theme/fontsize";
import colors from "../../theme/colors";
import fontsize from "../../theme/fontsize";
import { IconText } from "../../Home";
import { Screen } from "../../utils/device";
import { MyIcon } from "../../../theme/icons";
// create a component
class ListItem extends PureComponent {
  render() {
    const { item, onPress } = this.props;
    const {
      id,
      title,
      dateCreate,
      imageUrl,
      isRead,
      towerId,
      towerName,
      towerAddress,
      actionId,
      requestId,
      shortDescription,
    } = item;
    return (
      <TouchableOpacity style={{ flexDirection: "row" }} onPress={onPress}>
        <View
          style={{
            flex: 1,
            paddingVertical: responsive.h(10),
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
              isRead || Platform.OS != "ios" ? "#fff" : "#eeeeee",
            borderTopRightRadius:
              Platform.OS === "ios" ? null : responsive.h(50),
            paddingLeft: Platform.OS == "ios" ? responsive.w(15) : 0,
          }}
        >
          <View
            style={{
              borderRadius: responsive.h(45),
              height: responsive.h(60),
              width: responsive.h(60),
              backgroundColor: "#fff200",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Icon name={ converTypeToIcon(2) } size={ 30 } color={colors.appTheme} /> */}
            <ImageProgress
              //circle
              style={{
                height: responsive.h(42),
                width: responsive.h(42),
              }}
              circle
              source={{ uri: imageUrl }}
            />

            {!isRead ? (
              <View
                style={{
                  borderRadius: responsive.h(45),
                  height: responsive.h(10),
                  width: responsive.h(10),
                  backgroundColor: "red",
                  position: "absolute",
                  right: responsive.h(10),
                  bottom: responsive.h(0),
                }}
              />
            ) : null}
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              marginLeft: responsive.h(10),
            }}
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text>
                <Text
                  style={{
                    fontFamily: "Inter-Bold",
                    fontSize: responsive.h(14),
                    fontWeight: "500",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: isRead ? "#626262" : "#282828",
                  }}
                >
                  {title}{" "}
                </Text>

                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: responsive.h(fontsize.small),
                  }}
                >
                  {shortDescription}
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
                  color: "#a0a0a0",
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(12),
                  fontWeight: "normal",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#a0a0a0",
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

//make this component available to the app
export default ListItem;
