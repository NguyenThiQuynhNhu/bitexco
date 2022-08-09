//import liraries
import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ListData from "../../../components/common/ListData";
import { connect } from "react-redux";
import { resetStateByKey } from "../../../actions/requestCreate";
import Strings from "../../../utils/languages";
import { MyIcon } from "../../../theme/icons";
import fontsize from "../../../theme/fontsize";
import { converLevelToString } from "../../../utils/checklist";
import NavBar from "../../../resident/components/common/NavBar";

const Devices = require("react-native-device-detection");
// create a component

class ListItem extends PureComponent {
  render() {
    const { data } = this.props;
    const { item, index } = data;
    const { id, name, typeId } = item;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          paddingVertical: 10,
          backgroundColor: "#fff",
          paddingHorizontal: 10,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          key={index}
          style={{
            width: Devices.isTablet ? "60%" : "80%",
            paddingVertical: 10,
          }}
          onPress={() => this.props.onNext(item)}
        >
          <Text numberOfLines={3}>{name}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          key={index}
          style={{
            width: Devices.isTablet ? "40%" : "20%",
            paddingVertical: 10,
          }}
          onPress={() => this.props.onSelected(item)}
        >
          <Text style={{ textAlign: "right", paddingRight: 10 }}>CHỌN</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class ListProperty extends Component {
  onNext = (item) => {
    const { onSelected } = this.props.navigation.state.params;

    this.props.navigation.goBack();
    item.isDone = item.typeId === 4;
    onSelected(item);
  };

  onSelected = (item) => {
    const { onSelected } = this.props.navigation.state.params;
    this.props.navigation.goBack();
    item.isDone = true;
    onSelected(item);
  };

  renderList() {
    const {
      id,
      systemId,
      categoryId,
      propertyId,
      typeSystemId,
    } = this.props.navigation.state.params;

    return (
      <ListData
        api={{
          url: "/Vendors/Checklist/Properties",
          params: {
            id,
            systemId,
            categoryId,
            propertyId,
          },
          loadmore: false,
        }}
        renderItem={(item) => (
          <ListItem
            data={item}
            navigation={this.props.navigation}
            onSelected={this.onSelected}
            onNext={this.onNext}
          />
        )}
      />
    );
  }

  render() {
    const leftButton = (
      <TouchableOpacity
        style={{ paddingVertical: 10 }}
        onPress={() => this.props.navigation.goBack()}
      >
        <MyIcon name="arrow" size={20} color="black" />
      </TouchableOpacity>
    );

    const {
      id,
      systemId,
      categoryId,
      categoryName,
      propertyId,
      propertyName,
      typeSystemId,
    } = this.props.navigation.state.params;
    //('params', this.props.navigation.state.params)

    return (
      <View style={styles.container}>
        <NavBar
          leftButton={leftButton}
          body={
            <Text
              style={{
                color: "black",
                fontSize: fontsize.medium,
                fontWeight: "bold",
                alignSelf: "center",
              }}
            >
              CHỌN THIẾT BỊ
            </Text>
          }
          rightView={null}
        />
        {/* <View style={{ padding: 10 }}>
                    <Text>*** - { categoryName } - { propertyName } </Text>
                </View> */}
        {this.renderList()}

        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
          style={{
            backgroundColor: colors.appTheme,
            width: 50,
            height: 50,
            borderRadius: 35,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 20,
            right: 20,
          }}
        >
          <MyIcon name="arrow" size={20} color="#fff" />
        </TouchableOpacity>
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
  vendorSelected: state.requestCreate.vendorSelected,
  user: state.auth.user,
});

//make this component available to the app
export default connect(
  mapStateToProps,
  { resetStateByKey }
)(ListProperty);
