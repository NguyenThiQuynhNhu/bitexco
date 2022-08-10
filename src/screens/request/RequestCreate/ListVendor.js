//import liraries
import React, { Component, PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ListData from "../../../components/common/ListData";
import { connect } from "react-redux";
import {
  resetStateByKey,
  onVendorSelected,
} from "../../../actions/requestCreate";
import Strings from "../../../utils/languages";
import responsive from "../../../resources/responsive";
// create a component

class ListItem extends PureComponent {
  render() {
    const { data } = this.props;
    const { item, index } = data;
    const { id, towerName, logo } = item;
    return (
      <TouchableOpacity
        key={index}
        style={{
          marginVertical: responsive.h(20),
          backgroundColor: "#fff",
          marginHorizontal: responsive.h(20),
        }}
        onPress={() => this.props.onSelected(item)}
      >
        <Text style={{fontSize: responsive.h(114)}}>{towerName}</Text>
      </TouchableOpacity>
    );
  }
}

class ListVendor extends Component {
  static navigationOptions = {
    headerTitle: Strings.createRequest.placeholderVendor,
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
    },
  };

  onSelected = (item) => {
    this.props.navigation.goBack();
    this.props.onVendorSelected({
      id: item.id,
      name: item.towerName,
      logo: item.logo,
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <ListData
          api={{
            url: "/Residents/TowerList",
            params: {
              typeId: 20,
            },
            loadmore: true,
          }}
          renderItem={(item) => (
            <ListItem
              data={item}
              navigation={this.props.navigation}
              onSelected={this.onSelected}
            />
          )}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

//make this component available to the app
export default connect(
  null,
  { resetStateByKey, onVendorSelected }
)(ListVendor);
