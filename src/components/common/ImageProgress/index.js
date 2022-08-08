//import liraries
import React from "react";
import { View } from "react-native";
import { Image as ImageError } from "react-native";
import Image from "./react-native-image-progress";
import * as Progress from "react-native-progress";
import colors from "../../../theme/colors";
import { default_image } from "../../../theme/images";
import { MyIcon } from "../../../theme/icons";
import _ from "lodash";

// create a component

const ImageProgress = (props) => {
  const { source, style, circle = false } = props;
  if (_.isNil(source) || _.isNil(source.uri) || source.uri.length == 0) {
    //console.log(source)
    if (circle) {
      return (
        <View
          style={{
            ...style,
            borderRadius: style.width / 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e6e6e6",
            ...style,
          }}
        >
          <MyIcon name="camera" size={style.width / 2} color={colors.gray1} />
        </View>
      );
    }
    return (
      <ImageError resizeMode="contain" source={default_image} style={style} />
    );
  }
  if (circle) {
    const borderRadius = style.width / 2;
    return (
      <View
        style={{
          width: style.width + 2,
          height: style.height + 2,
          borderRadius,
          backgroundColor: colors.grayBorder,
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
        }}
      >
        <Image
          style={{ ...style, borderRadius: style.width / 2 }}
          // indicator={Progress.CircleSnail}
          // indicatorProps={{
          //     size: 20,
          //     color: '#1A92FD',
          //     unfilledColor: 'rgba(200, 200, 200, 0.2)'
          // }}
          renderError={() => (
            <View
              style={{
                ...style,
                borderRadius: style.width / 2,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e6e6e6",
              }}
            >
              <MyIcon
                name="camera"
                size={style.width / 2}
                color={colors.gray1}
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
      style={{ ...style }}
      renderError={() => (
        <ImageError resizeMode="contain" source={default_image} style={style} />
      )}
      source={source}
    />
  );
};

// define your styles

//make this component available to the app
export default ImageProgress;
