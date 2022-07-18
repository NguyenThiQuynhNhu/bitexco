import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import { Screen } from "../../../utils/device";
import Strings from "../../../utils/languages";
import NavBar from "../../../components/common/NavBar";
import fontsize from "../../../theme/fontsize";
import colors from "../../../theme/colors";
import { MyIcon } from "../../../theme/icons";
import moment from "moment";
import ErrorContent from "../../../components/common/ErrorContent";
//
import {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
} from "../../../actions/survey";

class ListItem extends PureComponent {
  render() {
    const { item, onPress } = this.props;
    const { id, code, name, dateFr, dateTo, isReply } = item;
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          marginBottom: 10,
          borderRadius: 12,
          backgroundColor: "#ffffff",
          shadowColor: "rgba(0, 0, 0, 0.1)",
          elevation: 2,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowRadius: 10,
          shadowOpacity: 1,
          marginHorizontal: 10,
        }}
        onPress={onPress}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              borderRadius: 45,
              height: 40,
              width: 40,
              backgroundColor: "#fff200",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <MyIcon name="file-text" size={20} color={colors.appTheme} />
          </View>
          {!isReply ? (
            <View
              style={{
                borderRadius: 45,
                height: 10,
                width: 10,
                backgroundColor: "red",
                position: "absolute",
                left: 40,
                bottom: 10,
              }}
            />
          ) : null}
          <View
            style={{ flex: 1, justifyContent: "space-between", margin: 10 }}
          >
            <Text
              lineBreakMode="tail"
              numberOfLines={2}
              style={{
                flexDirection: "row",
                width: Screen.width - 110,
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#282828",
              }}
            >
              {name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 11,
                  fontWeight: "normal",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#6f6f6f",
                }}
              >
                {moment(dateFr).format("DD/MM/YYYY HH:mm")} -{" "}
                {moment(dateTo).format("DD/MM/YYYY HH:mm")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
class SurveyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.resetStateByKey({ key: "initList", path: "", value: true });
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing
    ) {
      const data = {
        TowerID: this.props.towerId,
      };
      this.props.loadDataHandle(data);
    }
    if (nextProps.initList && nextProps.initList !== this.props.initList) {
      const data = {
        TowerID: this.props.towerId,
      };
      this.props.loadDataHandle(data);
    }
    if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
      this.props.refreshDataHandle();
    }
  }
  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }
  renderItem = ({ item }) => {
    return (
      <ListItem
        item={item}
        onPress={() => this.props.navigation.navigate("surveyDetail", item)}
      />
    );
  };
  _renderContent() {
    const {
      emptyData,
      error,
      initList,
      data,
      isRefreshing,
      outOfStock,
      refreshDataHandle,
      loadDataHandle,
      isLoading,
    } = this.props;
    if (initList) {
      return (
        <View
          style={{
            paddingVertical: 20,
          }}
        >
          <ActivityIndicator animating size="small" />
        </View>
      );
    }
    if (emptyData) {
      return (
        <ErrorContent
          title={Strings.app.emptyData}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
      );
    }
    if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
      );
    }
    return (
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        refreshing={isRefreshing}
        onRefresh={() => this.props.refreshDataHandle()}
        data={data}
        renderItem={this.renderItem}
        onEndReachedThreshold={0.5}
        style={{ paddingHorizontal: 10, marginTop: 7 }}
      />
    );
  }
  render() {
    //console.log('this.props', this.props)
    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ padding: 10 }}
            >
              <MyIcon name="arrow" color="black" size={20} />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                padding: 10,
                width: Screen.width - 124,
                fontFamily: "Inter-Bold",
                fontSize: 18,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "black",
              }}
              numberOfLines={2}
              lineBreakMode="tail"
            >
              {Strings.setting.surveySheet}
            </Text>
          }
          rightView={
            <TouchableOpacity style={{ padding: 10 }}>
              <MyIcon name="reply" color="black" size={20} />
            </TouchableOpacity>
          }
        />
        {this._renderContent()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
const mapStateToProps = (state) => ({
  user: state.auth.user,
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  data: state.survey.data,
  isLoading: state.survey.isLoading,
  error: state.survey.error,
  emptyData: state.survey.emptyData,
  initList: state.survey.initList,
  isRefreshing: state.survey.isRefreshing,
});

const mapActionToProps = {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(SurveyScreen);
