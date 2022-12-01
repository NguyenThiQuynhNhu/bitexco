//import liraries
import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MyIcon } from "../../theme/icons";
import colors from "../../theme/colors";

// create a component
class CheckBox extends PureComponent {
  render() {
    const { value, onValueChange, visible = true, styles } = this.props;
    return (
      <View pointerEvents={visible ? "auto" : "none"} style={{...styles}}>
        <TouchableOpacity onPress={onValueChange}>
          <MyIcon
            name={value ? "checkbox-checked" : "checkbox-unchecked"}
            size={20}
            color={
              visible ? (value ? "#b8b7b7" : colors.gray1) : colors.grayBorder
            }
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default CheckBox;
