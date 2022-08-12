//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { default_image } from "../../../theme/images";
import {
  converStatusToColor,
  converStatusToString,
} from "../../../utils/request";
import colors from "../../../theme/colors";
import Strings from "../../../utils/languages";
import ImageProgress from "../../common/ImageProgress";
import fontSize from "../../../theme/fontsize";
import responsive from "../../../../resources/responsive";
import fontsize from "../../../theme/fontsize";

// create a component
const VendorInfo = (props) => {
  const {
    logo,
    towerName,
    statusId,
    contractName,
    departmentName,
    userActive,
    statusKey,
    userName,
    date,
  } = props.data;
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingHorizontal: responsive.h(10),
        paddingVertical: responsive.h(20),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          flex: 0.8,
        }}
      >
        <ImageProgress
          circle={true}
          style={{
            height: responsive.h(70),
            width: responsive.h(70),
          }}
          source={{ uri: logo }}
        />
        <View
          style={{
            justifyContent: "center",
            marginLeft: responsive.h(10),
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: responsive.h(15),
              fontWeight: "600",
              fontStyle: "normal",
              textAlign: "left",
              color: "#292929",
            }}
          >
            {userName}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Medium",
              fontSize: responsive.h(13),
              fontWeight: "500",
              fontStyle: "normal",
              textAlign: "left",
              color: "#292929",
            }}
          >
            {contractName}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: responsive.h(12),
              fontWeight: "normal",
              fontStyle: "normal",
              textAlign: "left",
              color: "#7d8895",
            }}
          >
            {date}
          </Text>
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: responsive.h(fontsize.micro),
            textAlign: "center",
            backgroundColor: "#fff5eb",
            borderRadius: responsive.h(15),
            paddingHorizontal: responsive.h(10),
            paddingVertical: responsive.h(5),
            color: converStatusToColor(statusKey),
          }}
        >
          {converStatusToString(statusId)}
        </Text>
      </View>
      {/* <Text style={{ fontSize: fontSize.larg }}>{towerName}</Text> */}
      {/* <View style={{ alignItems: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <View>
                    <View
                        style={{
                            marginRight: 10,
                            marginVertical: 5,
                            backgroundColor: converStatusToColor(statusKey),
                            borderRadius: 15
                        }}>
                        < Text style={{ margin: 5, marginHorizontal: 10, color: '#fff' }}>{converStatusToString(statusId)}</Text>
                    </View>
                    <Text>{contractName}</Text>
                </View>
                <Text numberOfLines={2}>
                    <Text>{
                        departmentName}
                    </Text>
                    <Text
                        style={{ color: 'blue' }}>
                        {userActive ? ` - ${userActive}` : ` - ${Strings.createRequest.unreceived}`}
                    </Text>
                </Text>
            </View> */}
    </View>
  );
};

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
export default VendorInfo;
