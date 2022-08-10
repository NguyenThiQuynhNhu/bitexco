//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import colors from "../../../theme/colors";
import default_image from "../../../theme/images";

import { MyIcon } from "../../../theme/icons";
import fontSize from "../../../theme/fontsize";
import ImageProgress from "../../../components/common/ImageProgress";
import responsive from "../../../../resources/responsive";

// create a component
class ListItem extends Component {
  render() {
    const { item, onPress } = this.props;
    const {
      id,
      typeId,
      towerName,
      hotline,
      address,
      logo,
      serviceName,
    } = this.props.item;
    return (
      <TouchableOpacity style={{ flexDirection: "row" }} onPress={onPress}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            padding: responsive.h(10),
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderBottomColor: colors.grayBorder,
          }}
        >
          <ImageProgress
            circle={true}
            style={{
              height: responsive.h(100),
              width: responsive.h(100),
            }}
            source={{ uri: logo }}
          />

          <View style={{ flex: 1, justifyContent: "center", marginLeft: 10 }}>
            <Text
              style={{
                fontSize: responsive.h(fontSize.medium),
                fontWeight: "bold",
              }}
            >
              {towerName}
            </Text>
            <Text
              style={{
                marginVertical: responsive.h(5),
                color: colors.gray1,
                fontSize: responsive.h(14),
              }}
            >
              {serviceName}
            </Text>
            <Text
              style={{
                fontSize: responsive.h(14),
              }}
            >
              {address}
            </Text>
          </View>
        </View>
        {typeId == 20 && (
          <View
            style={{
              position: "absolute",
              top: 1,
              right: 0,
              alignSelf: "flex-start",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MyIcon
              name="triangle"
              size={responsive.h(30)}
              color={colors.blue}
            />
            <MyIcon
              name="check-circle"
              size={responsive.h(10)}
              style={{
                position: "absolute",
                top: responsive.h(2),
                right: responsive.w(1),
              }}
              color="#fff"
            />
          </View>
        )}
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
