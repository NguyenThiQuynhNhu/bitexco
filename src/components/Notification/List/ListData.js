//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Platform } from "react-native";
import ListItem from "./ListItem";
import { connect } from "react-redux";
import FCM from "react-native-fcm";
import { updateIsReadToList } from "../../../actions/notification";
import { loadBadge } from "../../../actions/home";
// create a component
class ListData extends Component {
  renderItem = ({ item }) => {
    const { canNavigate, navigation, updateIsReadToList } = this.props;
    return (
      <ListItem
        item={item}
        onPress={() => {
          switch (item.typeId) {
            case 1:
              navigation.navigate("requestDetail", { id: item.linkId });
              break;
            case 2:
              navigation.navigate("newsDetail", {
                item: {
                  id: item.linkIdNews,
                  towerId: item.towerId,
                  towerName: item.towerName,
                },
                type: 1,
              });
              break;
            case 3:
              navigation.navigate("serviceBasicDetail", { id: item.linkId });
              break;

            case 4:
              navigation.navigate("serviceExtensionDetail", {
                id: item.linkId,
              });
              break;

            case 5:
              navigation.navigate("checklistDetail", { id: item.linkId });
              break;

            case 6:
              navigation.navigate("proposalDetail", { id: item.linkId });
              break;

            default:
              break;
          }

          setTimeout(() => {
            updateIsReadToList(item);
            this.props.loadBadge();
            if (Platform.OS != "ios") {
              FCM.removeAllDeliveredNotifications();
            }
          }, 500);

          // setTimeout(() => {
          //     this.props.loadBadge();
          // }, 1000);
        }}
      />
    );
  };

  renderFooter = () => {
    if (!this.props.isLoading || this.props.isRefreshing) return null;
    return (
      <View
        style={{
          paddingVertical: 20,
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
        style={{ borderTopRightRadius: 20, marginTop: -16.5 }}
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

const mapStateToProps = (state) => ({});

const mapActionToState = {
  updateIsReadToList,
  loadBadge,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(ListData);
//export default ListData
