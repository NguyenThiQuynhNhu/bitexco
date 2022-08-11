//import liraries
import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
import colors from "../../theme/colors";
import fontSize from "../../theme/fontsize";
import RowItem from "../common/RowItem";
import Strings from "../../utils/languages";
import responsive from "../../../resources/responsive";
// create a component

class ListItem extends PureComponent {
  constructor(props) {
    super(props);
    moment.locale(props.language);
  }
  render() {
    const month =
      this.props.language == "vi"
        ? moment().format("MM/YYYY")
        : moment().format("MMMM YYYY");
    const { item, onPress } = this.props;
    const {
      id,
      name,
      amountOldDebt,
      amountIncurred,
      amountPaid,
      amountOwed,
    } = item;
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: colors.grayBorder,
            padding: responsive.h(10),
          }}
        >
          <View>
            <Text>{Strings.fee.contractNo}</Text>
            <Text
              style={{
                fontSize: responsive.h(fontSize.larg),
                color: colors.appTheme,
              }}
            >
              {name}
            </Text>
          </View>
          <Text
            style={{
              fontSize: responsive.h(fontSize.larg),
              color: colors.appTheme,
            }}
          >
            {amountOwed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>
        </View>
        <View style={{ padding: responsive.h(10) }}>
          <RowItem
            title={`${Strings.fee.balance} ${month}`}
            value={amountOldDebt
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            styleValue={{ fontSize: fontSize.larg, color: colors.appTheme }}
          />
          <RowItem
            title={`${Strings.fee.occursduring} ${month}`}
            value={amountIncurred
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            styleValue={{ fontSize: fontSize.larg, color: colors.appTheme }}
          />
          <RowItem
            title={`${Strings.fee.paid} ${month}`}
            value={amountPaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            styleValue={{ fontSize: fontSize.larg, color: colors.appTheme }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 10,
    backgroundColor: "#fff",
  },
});

//make this component available to the app
export default ListItem;
