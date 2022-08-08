//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import _ from "lodash";
import { MyIcon } from "../../theme/icons";
import colors from "../../theme/colors";
import index from "../../screens/statistics/general";

import NavBar from "../../resident/components/common/NavBar";
import responsive from "../../resources/responsive";

// create a component
class ModalPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: props.selectedValue,
    };
  }
  componentWillReceiveProps(nextsProps) {
    if (nextsProps.visible == true) {
      this.setState({ showModal: true });
    }
  }
  render() {
    const {
      data,
      onValueChange,
      rightIcon = null,
      textStyle,
      onClose,
      visible,
      dislayValue,
      style,
    } = this.props;

    const { selectedValue } = this.state;
    return (
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={{ flex: 1, backgroundColor: "#ffff" }}>
          <NavBar
            leftButton={
              <TouchableOpacity onPress={onClose}>
                <MyIcon name="arrow" size={20} color="black" />
              </TouchableOpacity>
            }
            body={
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: 20,
                  textAlign: "center",
                  color: "black",
                }}
              >
                Chọn
              </Text>
            }
            // rightView={
            //   <TouchableOpacity style={{ padding: 10 }}>
            //     <MyIcon name="arrow" color={colors.appTheme} size={20} />
            //   </TouchableOpacity>
            // }
          />

          <FlatList
            renderItem={({ item, index }) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState(
                      { selectedValue: item.id },
                      onValueChange(item)
                    )
                  }
                >
                  <View
                    style={{
                      paddingVertical: 20,
                      paddingLeft: 20,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          item.id == selectedValue
                            ? colors.appTheme
                            : "darkgrey",
                      }}
                    >
                      {item[dislayValue]}
                    </Text>
                    {item.id == selectedValue && (
                      <Text style={{ color: colors.appTheme }}>✓</Text>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              );
            }}
            style={{ marginTop: -10 }}
            keyExtractor={(item, index) => `${index}`}
            data={data}
          />
        </View>
      </Modal>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});

//make this component available to the app
export default ModalPicker;
