//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ListItem from "./ListItem";
import responsive from "../../../resources/responsive";
// create a component
class ListData extends Component {
  renderItem = ({ item, index }) => {
    const { canNavigate, navigation } = this.props;
    return (
      <ListItem
        item={item}
        index={index}
        onPress={() =>
          canNavigate ? navigation.navigate("requestDetail", item) : null
        }
      />
    );
  };

  renderFooter = () => {
    if (!this.props.isLoading || this.props.isRefreshing) return null;
    return (
      <View
        style={{
          paddingVertical: responsive.h(20),
        }}
      >
        <ActivityIndicator animating size="small" />
      </View>
    );
  };

  render() {
    const {
      refreshing,
      onRefresh,
      data,
      renderItem,
      onEndReached,
    } = this.props;
    return (
      <FlatList
        //ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
        numColumns={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={data}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderItem}
        ListFooterComponent={this.renderFooter}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        contentContainerStyle={{
          //alignItems: data.length > 1 ? "center" : null,
        }}
      />
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});

export default ListData;
