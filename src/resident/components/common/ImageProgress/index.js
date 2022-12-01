//import liraries
import React, { Component } from "react";
import { StyleSheet, View, Image as ImageError } from "react-native";
import Image from "./react-native-image-progress";
import * as Progress from "react-native-progress";
import { MyIcon } from "../../../theme/icons";
import colors from "../../../theme/colors";
import _ from "lodash";
import { default_image } from "../../../theme/images";
import { default_user } from "../../../theme/images";
// create a component

const ImageProgress = ({ source, style, circle = false, type }) => {
  // console.log(source)
  // console.log(nhu)
  // console.log(default_image)
  // console.log(default_user)
  if (_.isNil(source) || (_.isNil(source.uri) && type == undefined)) {
    return <ImageError source={default_image} style={style} />;
  }
  if (circle) {
    const borderRadius = style.width / 2;
    return (
      <View
        style={{
          width: style.width,
          height: style.height,
          borderRadius,
          backgroundColor: 'transparent',
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ height: style.width, width: style.height, borderRadius }}
          indicator={Progress.CircleSnail}
          indicatorProps={{
            size: 20,
            color: "#1A92FD",
            unfilledColor: "rgba(200, 200, 200, 0.2)",
          }}
          renderError={() => (
            <View
              style={{
                width: style.width + 2,
                height: style.height + 2,
                borderRadius,
                backgroundColor: '#eaeaea',
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ImageError
                source={default_image}
                style={{ height: style.width, width: style.height, borderRadius }}
              />
            </View>

          )}
          source={source}
        />
      </View>
    );
  }
  return (
    <Image
      style={{ ...style, alignItems: "center", justifyContent: "center" }}
      indicator={Progress.CircleSnail}
      indicatorProps={{
        size: 20,
        color: "#1A92FD",
        unfilledColor: "rgba(200, 200, 200, 0.2)",
      }}
      renderError={() => <ImageError source={default_image} style={style} />}
      source={source}
    />
  );
};

// define your styles

//make this component available to the app
export default ImageProgress;
