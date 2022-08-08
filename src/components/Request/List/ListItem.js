//import liraries
import React, { Component, PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
import fontSize from "../../../theme/fontsize";
import { MyIcon } from "../../../theme/icons";
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
    const { item, onPress } = this.props;
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
      //   <TouchableOpacity
      //     style={{
      //       flexDirection: "row",
      //       backgroundColor: "#fff",
      //       borderRadius: 12,
      //       backgroundColor: "#ffffff",
      //       shadowColor: "rgba(0, 0, 0, 0.1)",
      //       elevation: 2,
      //       shadowOffset: {
      //         width: 0,
      //         height: 4,
      //       },
      //       shadowRadius: 10,
      //       shadowOpacity: 1,
      //       marginVertical: 10,
      //       marginHorizontal: 20,
      //     }}
      //     onPress={onPress}
      //   >
      //     <View
      //       style={{
      //         flex: 1,
      //         padding: 10,
      //         alignItems: "flex-start",
      //       }}
      //     >
      //       <View
      //         style={{
      //           flexDirection: "row",
      //           alignItems: "flex-start",
      //           backgroundColor: "#fff",
      //         }}
      //       >
      //         <ImageProgress
      //           circle={true}
      //           style={{
      //             height: 46,
      //             width: 46,
      //           }}
      //           source={{ uri: avatarResident }}
      //         />
      //         <View
      //           style={{
      //             flex: 1,
      //             justifyContent: "space-between",
      //             marginLeft: 10,
      //           }}
      //         >
      //           {residentName ? (
      //             <View>
      //               <Text
      //                 style={{
      //                   fontFamily: "Inter-Bold",
      //                   fontSize: 14,
      //                   fontWeight: "bold",
      //                   fontStyle: "normal",
      //                   letterSpacing: 0,
      //                   textAlign: "left",
      //                   color: colors.appTheme,
      //                 }}
      //               >
      //                 {residentName}
      //               </Text>
      //               <View
      //                 style={{
      //                   flexDirection: "row",
      //                   justifyContent: "space-between",
      //                   alignItems: "center",
      //                 }}
      //               >
      //                 <Text
      //                   style={{
      //                     fontFamily: "Inter-Regular",
      //                     fontSize: 13,
      //                     fontWeight: "normal",
      //                     fontStyle: "normal",
      //                     letterSpacing: 0,
      //                     textAlign: "left",
      //                     color: "#3d3d3d",
      //                   }}
      //                 >
      //                   MS: {contractName}
      //                 </Text>
      //                 <View
      //                   style={{
      //                     //marginLeft: 10,
      //                     marginVertical: 5,
      //                     borderRadius: 16,
      //                     backgroundColor: colorCode ? colorCode : "#fff200",
      //                     //backgroundColor: converStatusToColor(statusKey),
      //                   }}
      //                 >
      //                   <Text
      //                     style={{
      //                       margin: 2,
      //                       marginHorizontal: 5,
      //                       fontFamily: "Inter-Regular",
      //                       fontSize: 12,
      //                       fontWeight: "normal",
      //                       fontStyle: "normal",
      //                       letterSpacing: 0,
      //                       textAlign: "left",
      //                       color: "#fff",
      //                     }}
      //                   >
      //                     {statusName}
      //                   </Text>
      //                 </View>
      //               </View>
      //               <Text
      //                 style={{
      //                   marginVertical: 0,
      //                   fontFamily: "Inter-Regular",
      //                   fontSize: 13,
      //                   fontWeight: "normal",
      //                   fontStyle: "normal",
      //                   letterSpacing: 0,
      //                   textAlign: "left",
      //                   color: "#ff3d00",
      //                 }}
      //                 numberOfLines={1}
      //               >
      //                 {employeeName} - {departmentName}
      //               </Text>
      //             </View>
      //           ) : (
      //             <View>
      //               <Text
      //                 style={{
      //                   fontFamily: "Inter-Bold",
      //                   fontSize: 14,
      //                   fontWeight: "bold",
      //                   fontStyle: "normal",
      //                   letterSpacing: 0,
      //                   textAlign: "left",
      //                   color: colors.appTheme,
      //                 }}
      //                 numberOfLines={1}
      //               >
      //                 {employeeName}
      //               </Text>
      //               <View
      //                 style={{
      //                   flexDirection: "row",
      //                   justifyContent: "space-between",
      //                   alignItems: "center",
      //                 }}
      //               >
      //                 <Text
      //                   style={{
      //                     marginVertical: 0,
      //                     fontFamily: "Inter-Regular",
      //                     fontSize: 13,
      //                     fontWeight: "normal",
      //                     fontStyle: "normal",
      //                     letterSpacing: 0,
      //                     textAlign: "left",
      //                     color: "#ff3d00",
      //                   }}
      //                   numberOfLines={1}
      //                 >
      //                   - {departmentName}
      //                 </Text>

      //                 <View
      //                   style={{
      //                     //marginLeft: 10,
      //                     marginVertical: 5,
      //                     borderRadius: 16,
      //                     backgroundColor: colorCode ? colorCode : "#fff200",
      //                     //backgroundColor: converStatusToColor(statusKey),
      //                   }}
      //                 >
      //                   <Text
      //                     style={{
      //                       margin: 2,
      //                       marginHorizontal: 5,
      //                       fontFamily: "Inter-Regular",
      //                       fontSize: 12,
      //                       fontWeight: "normal",
      //                       fontStyle: "normal",
      //                       letterSpacing: 0,
      //                       textAlign: "left",
      //                       color: "#fff",
      //                     }}
      //                   >
      //                     {statusName}
      //                   </Text>
      //                 </View>
      //               </View>
      //               {contractName ? (
      //                 <Text
      //                   style={{
      //                     fontFamily: "Inter-Regular",
      //                     fontSize: 13,
      //                     fontWeight: "normal",
      //                     fontStyle: "normal",
      //                     letterSpacing: 0,
      //                     textAlign: "left",
      //                     color: "#3d3d3d",
      //                   }}
      //                 >
      //                   MS: {contractName}
      //                 </Text>
      //               ) : null}
      //             </View>
      //           )}
      //         </View>
      //       </View>
      //       <Text
      //         style={{
      //           marginTop: 15,
      //           fontFamily: "Inter-SemiBold",
      //           fontSize: 16,
      //           fontWeight: "600",
      //           fontStyle: "normal",
      //           letterSpacing: 0,
      //           textAlign: "left",
      //           color: "#282828",
      //         }}
      //         numberOfLines={1}
      //       >
      //         {title}
      //       </Text>
      //       <Text
      //         style={{
      //           marginTop: 5,
      //           fontFamily: "Inter-Regular",
      //           fontSize: 13,
      //           fontWeight: "normal",
      //           fontStyle: "normal",
      //           letterSpacing: 0,
      //           textAlign: "left",
      //           color: "#3d3d3d",
      //         }}
      //         numberOfLines={2}
      //         lineBreakMode="tail"
      //       >
      //         {content}
      //       </Text>
      //       <View
      //         style={{
      //           width: "100%",
      //           flexDirection: "row",
      //           justifyContent: "flex-end",
      //           alignItems: "center",
      //           marginTop: 10,
      //         }}
      //       >
      //         <Text />
      //         <Text
      //           style={{
      //             fontFamily: "Inter-Regular",
      //             fontSize: 11,
      //             fontWeight: "normal",
      //             fontStyle: "normal",
      //             lineHeight: 22,
      //             letterSpacing: 0,
      //             textAlign: "left",
      //             color: "#6f6f6f",
      //           }}
      //         >
      //           {moment(dateCreate).format("DD/MM/YYYY HH:mm")}
      //         </Text>
      //       </View>
      //     </View>
      //   </TouchableOpacity>

      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          backgroundColor: "#ffffff",
          //   shadowColor: "rgba(0, 0, 0, 0.1)",
          // elevation: 1,
          height: responsive.h(220),
          width: responsive.w(180),
          //   shadowOffset: {
          //     width: 0,
          //     height: 4,
          //   },
          //   shadowRadius: 10,
          //   shadowOpacity: 1,
          //   marginVertical: 10,
          marginHorizontal: 10,
          borderWidth: 0.5,
          borderColor: "#d2d2d2",
          borderBottomWidth: 2,
          padding: 10,
          paddingVertical: 15,
          marginBottom: responsive.h(30),
          marginVertical: responsive.h(20),
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
              alignItems: "center",
            }}
          >
            <ImageProgress
              // circle={true}
              style={{
                height: 51,
                width: 51,
                borderRadius: 51 / 2,
              }}
              source={{ uri: avatarResident }}
            />
            <View
              style={{
                // flex: 1,
                // marginLeft: 10,
                // minHeight: 35,
                // justifyContent: "space-between",
                // flexDirection: "column",
                marginVertical: 5,
                maxWidth: responsive.w(100),
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
                  // margin: 2,
                  // marginHorizontal: 5,
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                  fontWeight: "normal",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: converStatusToColor(statusName),
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
              {title}
            </Text>
            {content ? (
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
                  fontSize: 11,
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
                  fontSize: 11,
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
