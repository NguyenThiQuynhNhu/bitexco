import {
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');

export const Screen = {
  width,
  height: Platform.OS === 'ios' ? height : height - StatusBar.currentHeight
};

export default class Device {
  static isX() {
    const { height, width } = Dimensions.get('window')
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      (height === 812 || width === 812)
    )
  }
  
  static isXSMax() {
    const { height, width } = Dimensions.get('window')
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      (height === 896 || width === 896)
    )
  }

  static select({ ipX, isXSMax, ios, android }) {
    if (Device.isX()) {
      return ipX
    } else if (Device.isXSMax()) {
      return isXSMax
    } else if (Platform.OS === 'ios') {
      return ios
    } else if (Platform.OS === 'android') {
      return android
    }
    return {}
  }

  static defaultMarginTop() {
    return Device.select({
      ipX: {
        marginTop: 44
      },
      isXSMax: {
        marginTop: 44
      },
      ios: {
        marginTop: 20
      },
      android: {
        marginTop: 0
      }
    })
  }

  static defaultMarginBottom() {
    return Device.select({
      ipX: {
        marginBottom: -40
      },
      isXSMax: {
        marginBottom: -40
      },
      ios: {
        marginBottom: 0
      },
      android: {
        marginBottom: 0
      }
    })
  }

  static defaultPaddingTop() {
    return Device.select({
      ipX: {
        paddingTop: 44
      },
      isXSMax: {
        paddingTop: 44
      },
      ios: {
        paddingTop: 20
      },
      android: {
        paddingTop: 0
      }
    })
  }

  static defaultNavBarHeight() {
    return Device.select({
      ipX: {
        height: 44
      },
      isXSMax: {
        height: 44
      },
      ios: {
        height: 44
      },
      android: {
        height: 56
      }
    })
  }

  static defaultNavBarStyle() {
    return Device.select({
      /*ipX: {
        paddingTop: 44,
        height: 88
      },
      ios: {
        paddingTop: 20,
        height: 64
      },
      android: {
        paddingTop: 0,
        height: 56
      }*/
      ipX: {
        paddingTop: 0,
        height: 100
      },
      isXSMax: {
        paddingTop: 0,
        height: 100
      },
      ios: {
        paddingTop: 0,
        height: 100,
        //paddingBottom: 10
      },
      android: {
        paddingTop: 0,
        height: 100,
        //paddingBottom: 10
      }
    })
  }
}