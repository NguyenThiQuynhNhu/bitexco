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
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { MyIcon } from "../../../../theme/icons";
import colors from "../../../../theme/colors";
import Strings from "../../../../utils/languages";
import responsive from "../../../../../resources/responsive";

// create a component
const CommentView = ({ onYes, onChangeText, onClose }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#fff", "#cecece"]}
        style={styles.linearGradient}
      >
        <View
          style={{
            borderRadius: 16,
          }}
        >
          <View
            style={{
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.appTheme,
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
              height: responsive.h(55),
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
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
                height: 100,
                borderRadius: 8,
                borderWidth: 1,
                padding: 10,
                margin: 20,
                borderColor: colors.grayBorder,
                textAlignVertical: "top",
                fontFamily: "Inter-Regular",
                fontSize: 14,
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
              marginTop: 20,
              alignSelf: "center",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: colors.gray1,
              }}
            >
              <MyIcon name="x" size={30} color={colors.gray1} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginLeft: 50,
                height: 50,
                width: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.appTheme,
              }}
              onPress={onYes}
            >
              <MyIcon name="check" size={30} color="#fff" />
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
    borderRadius: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#b1b1b1",
  },
  linearGradient: {
    borderRadius: 16,
  },
});

export default CommentView;
