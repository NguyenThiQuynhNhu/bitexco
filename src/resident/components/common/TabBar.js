import React from "react";
import { ImageBackground, View, StatusBar, SafeAreaView,
    Alert,
    Animated,
    StyleSheet,
    TouchableOpacity,} from "react-native";
import responsive from "../../../resources/responsive";
import colors from "../../theme/colors";
import Screen from "../../utils/device";

// import Ionicons from 'react-native-vector-icons/Ionicons';
export const tabBar = () => {
    return(
        <View/>
    )
  };

  export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    button: {
      marginVertical: 5,
    },
    bottomBar: {},
    btnCircle: {
      width: 60,
      height: 60,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0.5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 1,
      bottom: 30,
    },
    imgCircle: {
      width: 30,
      height: 30,
      tintColor: 'gray',
    },
    img: {
      width: 30,
      height: 30,
    },
  });
