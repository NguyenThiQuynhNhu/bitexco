//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { MyIcon } from "../../../../theme/icons";
import colors from "../../../../theme/colors";
import Strings from "../../../../utils/languages";
import responsive from "../../../../../resources/responsive";
// create a component
const CommentView = ({ onYes, onChangeText, onClose }) => {
  return (
    // <ImageBackground
    //   source={require("../../../../resources/popupBg.png")}
    //   style={{ height: 250 }}
    // >
    <View style={styles.container}>
      <LinearGradient
        colors={["#fff", "#cecece"]}
        style={styles.linearGradient}
      >
        <View
          style={{
            borderRadius: responsive.h(16),
          }}
        >
          <View
            style={{
              padding: responsive.h(10),
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.appTheme,
              borderTopRightRadius: responsive.h(16),
              borderTopLeftRadius: responsive.h(16),
              height: responsive.h(55),
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(16),
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {Strings.app.confirm}
            </Text>
          </View>

          <View>
            <TextInput
              autoFocus
              autoCorrect={false}
              style={{
                backgroundColor: "#fff",
                height: responsive.h(100),
                borderRadius: responsive.h(8),
                borderWidth: responsive.h(1),
                padding: responsive.h(10),
                margin: responsive.h(20),
                borderColor: colors.grayBorder,
                textAlignVertical: "top",
                fontFamily: "Inter-Regular",
                fontSize: responsive.h(14),
              }}
              onSubmitEditing={onYes}
              underlineColorAndroid="transparent"
              multiline={true}
              placeholder={Strings.app.description}
              onChangeText={onChangeText}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: responsive.h(20),
              alignSelf: "center",
              marginBottom: responsive.h(10),
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                height: responsive.h(50),
                width: responsive.h(50),
                borderRadius: responsive.h(25),
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
                borderStyle: "solid",
                borderWidth: responsive.h(1),
                borderColor: colors.gray1,
              }}
            >
              <MyIcon name="x" size={responsive.h(30)} color={colors.gray1} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginLeft: responsive.h(50),
                height: responsive.h(50),
                width: responsive.h(50),
                borderRadius: responsive.h(25),
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.appTheme,
              }}
              onPress={onYes}
            >
              <MyIcon name="check" size={responsive.h(30)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "90%",
    height: responsive.h(250),
    borderRadius: responsive.h(16),
    borderBottomWidth: responsive.h(2),
    borderBottomColor: "#b1b1b1",
  },
  linearGradient: {
    borderRadius: responsive.h(16),
  },
});

export default CommentView;
