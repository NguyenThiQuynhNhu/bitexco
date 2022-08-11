//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import responsive from "../../../resources/responsive";
import Color from "../../theme/colors";
import fontsize from "../../theme/fontsize";
import FontSize from "../../theme/fontsize";
import Strings from "../../utils/languages";
// create a component
const ActionSheet = ({ data, renderItem, visible, onClose = () => {} }) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={() => {}}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: Color.appOverView,
          justifyContent: "center",
        }}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View style={{ marginBottom: 5, marginHorizontal: 5 }}>
            <View style={{ borderRadius: 5, backgroundColor: "white" }}>
              <FlatList
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${index}`}
              />
            </View>
            <TouchableOpacity
              style={{
                padding: 10,
                marginTop: 5,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
              }}
              onPress={onClose}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: responsive.h(fontsize.medium),
                  color: "red",
                }}
              >
                {Strings.app.close}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default ActionSheet;
