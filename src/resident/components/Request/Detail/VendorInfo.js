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
        padding: 20,
        backgroundColor: "#fff",
        borderTopRightRadius: 20,
        marginRight: 5,
      }}
    >
      <ImageProgress
        circle={true}
        style={{
          height: 65,
          width: 65,
        }}
        source={{ uri: logo }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: 20,
          borderTopRightRadius: 20,
        }}
      >
        <View
          style={{
            flex: 0.5,
            justifyContent: "space-between",
            borderTopRightRadius: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: 16,
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
              fontSize: 12,
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
              fontSize: 12,
              fontWeight: "normal",
              fontStyle: "normal",
              textAlign: "left",
              color: "#7d8895",
            }}
          >
            {date}
          </Text>
        </View>
        <View
          style={{
            flex: 0.5,
            justifyContent: "space-between",
            borderTopRightRadius: 20,
          }}
        >
          <View
            style={{
              padding: 5,
              borderRadius: 16,
              backgroundColor: "#fff5eb",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 14,
                fontWeight: "normal",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: converStatusToColor(statusKey),
              }}
            >
              {converStatusToString(statusId)}
            </Text>
          </View>
          <View
            style={{
              padding: 5,
              borderRadius: 16,
              backgroundColor: colors.appTheme,
              marginTop: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 14,
                fontWeight: "normal",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "#ffff",
              }}
            >
              {userActive
                ? `  ${userActive}`
                : `  ${Strings.createRequest.unreceived}`}
            </Text>
          </View>
        </View>
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
