import { Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const {
  width: DEVICE_SCREEN_WIDTH,
  height: DEVICE_SCREEN_HEIGHT,
} = Dimensions.get("window");

const DESIGN_SCREEN_WIDTH = 414;
const DESIGN_SCREEN_HEIGHT = 950;

const widthPercent = DEVICE_SCREEN_WIDTH / DESIGN_SCREEN_WIDTH;
const heightPercent = DEVICE_SCREEN_HEIGHT / DESIGN_SCREEN_HEIGHT;

function getWidth(designWidth) {
  const result = designWidth * widthPercent;
  return Number(result.toFixed(1));
}

function getHeight(designHeight) {
  const result = designHeight * heightPercent;
  return Number(result.toFixed(1));
}

function getFontSize(designWidth) {
  // return getWidth(designWidth);
  return RFValue(designWidth, DESIGN_SCREEN_HEIGHT);
}

const responsive = {
  w: getWidth,
  h: getHeight,
  f: getFontSize,
};

export default responsive;
