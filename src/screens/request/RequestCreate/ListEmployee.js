//import liraries
import React, { Component, PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ListData from "../../../components/common/ListData";
import { connect } from "react-redux";
import { resetStateByKey } from "../../../actions/requestCreate";
import Strings from "../../../utils/languages";
import { MyIcon } from "../../../theme/icons";
import fontsize from "../../../theme/fontsize";
import NavBar from "../../../resident/components/common/NavBar";
// create a component

class ListItem extends PureComponent {
  render() {
    const { data } = this.props;
    const { item, index } = data;
    const { id, name } = item;
    return (
      <TouchableOpacity
        key={index}
        style={{
          marginVertical: 20,
          backgroundColor: "#fff",
          marginHorizontal: 20,
        }}
        onPress={() => this.props.onSelected(item)}
      >
        <Text>{name}</Text>
      </TouchableOpacity>
    );
  }
}

class ListEmployee extends Component {
  static navigationOptions = {
    headerTitle: Strings.createRequest.placeholderDepartment,
  };
  onSelected = (item) => {
    const { onSelected } = this.props.navigation.state.params;
    this.props.navigation.goBack();
    onSelected(item);
  };
  render() {
    const leftButton = (
      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={() => this.props.navigation.goBack()}
      >
        <MyIcon name="arrow" size={20} color="black" />
      </TouchableOpacity>
    );

    const { departmentId, employeeId } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <NavBar
          leftButton={leftButton}
          body={
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                color: "black",
              }}
            >
              {Strings.createRequest.placeholderEmployee}
            </Text>
          }
          //   rightView={null}
          //   rightView={
          //     <TouchableOpacity style={{ padding: 10 }}>
          //       <MyIcon name="arrow" color={colors.appTheme} size={20} />
          //     </TouchableOpacity>
          //   }
        />

        <ListData
          api={{
            url: "/Vendors/DepartmmentEmployee",
            params: {
              towerId: this.props.user.towerId,
              departmentId,
              employeeId,
            },
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
  user: state.auth.user,
});

//make this component available to the app
export default connect(
  mapStateToProps,
  { resetStateByKey }
)(ListEmployee);
