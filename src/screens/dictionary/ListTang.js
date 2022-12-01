//import liraries
import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import ListData from "../../components/common/ListData";
import { connect } from "react-redux";
import { resetStateByKey } from "../../actions/requestCreate";
import Strings from "../../utils/languages";
import { MyIcon } from "../../theme/icons";
import fontsize from "../../theme/fontsize";
import responsive from "../../resources/responsive";
import NavBar from "../../resident/components/common/NavBar";

class ListTang extends Component {
  onSelected = (item) => {
    const { onSelected } = this.props.navigation.state.params;
    this.props.navigation.goBack();
    onSelected(item);
    //this.props.resetStateByKey({ key: 'depSelected', path: '', value: { id: item.id, name: item.name } })
  };
  render() {
    const data = this.props.navigation.state.params.tang;
    const leftButton = (
      <TouchableOpacity
        style={{ padding: responsive.h(10) }}
        onPress={() => this.props.navigation.goBack()}
      >
        <MyIcon name="arrow" size={responsive.h(20)} color="black" />
      </TouchableOpacity>
    );
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
              {Strings.common.choose}
            </Text>
          }
          rightView={null}
        />

        <FlatList
          //refreshing={isRefreshing}
          //onRefresh={() => this.refreshDataHandle()}
          data={data || []}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                //key={index}
                style={{
                  marginVertical: responsive.h(20),
                  backgroundColor: "#fff",
                  marginHorizontal: responsive.h(20),
                }}
                onPress={() => this.onSelected(item)}
              >
                <Text style={{fontSize: responsive.h(14)}}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => (
            <View style={{ height: 0.5, backgroundColor: colors.grayBorder }} />
          )}
          //ListFooterComponent={this.renderFooter}
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
  //blockSelected: state.water.blockSelected
});

//make this component available to the app
export default connect(mapStateToProps)(ListTang);
