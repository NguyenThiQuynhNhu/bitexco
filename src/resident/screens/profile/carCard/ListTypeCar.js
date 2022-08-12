//import liraries
import React, { Component, PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ListData from "../../../components/common/ListData";
import { connect } from "react-redux";
import { resetStateByKey } from "../../../actions/utilitiesBasicBooking";
import Strings from "../../../utils/languages";
import fontsize from "../../../theme/fontsize";
import { MyIcon } from "../../../theme/icons";
import responsive from "../../../../resources/responsive";

import NavBar from "../../../components/common/NavBar";
// create a component

class ListItem extends PureComponent {
  render() {
    const { data } = this.props;
    const { item, index } = data;
    const { id, typeName } = item;
    return (
      <TouchableOpacity
        key={index}
        style={{
          paddingVertical: responsive.h(20),
          backgroundColor: "#fff",
          paddingHorizontal: responsive.h(10),
        }}
        onPress={() => this.props.onSelected(item)}
      >
        <Text>{typeName}</Text>
      </TouchableOpacity>
    );
  }
}

class ListTypeCar extends Component {
  static navigationOptions = {
    header: null,
  };
  onSelected = (item) => {
    const { onSelected } = this.props.navigation.state.params;
    this.props.navigation.goBack();
    onSelected(item);
  };
  render() {
    const { serviceId, towerId } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                padding: responsive.h(10),
              }}
            >
              <MyIcon name="arrow" color="black" size={responsive.h(20)} />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                alignSelf: "center",
                color: "black",
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(20),
                fontWeight: "bold",
              }}
            >
              {Strings.carCard.carTypeText}
            </Text>
          }
          // rightView={
          //   <View style={{ margin: 10 }}>
          //     <MyIcon name="arrow" color={colors.appTheme} size={20} />
          //   </View>
          // }
        />
        <ListData
          api={{
            url: "/Car/GetTypeList",
            loadmore: false,
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
const mapStateToProps = (state) => ({
  towerId: state.auth.user.towerId,
  langId: state.app.language == "vi" ? 1 : 2,
});

//make this component available to the app
export default connect(
  mapStateToProps,
  { resetStateByKey }
)(ListTypeCar);
