//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Timeline from "react-native-timeline-flatlist";
import { connect } from "react-redux";
import moment from "moment";
import fontSize from "../../../theme/fontsize";
import { MyIcon } from "../../../theme/icons";
import {
  converStatusToColor,
  converStatusToString,
} from "../../../utils/request";

import NavBar from "../../../components/common/NavBar";
import fontsize from "../../../theme/fontsize";
import colors from "../../../theme/colors";

// create a component
class History extends Component {
  renderDetail(rowData, sectionID, rowID) {
    let time =
      this.props.language == "en"
        ? moment(rowData.dateCreate).format("HH:mm - MMMM Do YYYY")
        : moment(rowData.dateCreate).format("HH:mm - DD [tháng] MM, YYYY");

    let title =
      rowID == "0" ? (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.infoTextHistory}>{time}</Text>
          <TouchableOpacity
            style={{ padding: 4, flex: 1, alignItems: "flex-end" }}
            onPress={() => {
              this.setState({ showPopupHistory: true });
              rowData.description !== null &&
              rowData.description !== undefined &&
              rowData.description.length > 0
                ? this.setState({ isUpdate: true })
                : this.setState({ isUpdate: false });
            }}
          />
        </View>
      ) : (
        <Text style={styles.infoTextHistory}>{time}</Text>
      );
    let desc = null;
    if (
      rowData.description !== null &&
      rowData.description !== undefined &&
      rowData.description.length > 0
    ) {
      desc = (
        <View style={{ alignContent: "space-between", paddingRight: 5 }}>
          <Text style={{ fontFamily: "Inter-Regular" }}>
            {rowData.description}
          </Text>
        </View>
      );
    }
    let info = null;
    if (
      rowData.status !== null &&
      rowData.status !== undefined &&
      rowData.status.length > 0
    ) {
      info = (
        <View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={{ color: colors.appTheme }}>
              {rowData.status} - {rowData.employeeName}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, paddingTop: 10 }}>
        <View style={{ marginTop: -25, marginBottom: 10 }}>
          {title}
          {info}
          {desc}
        </View>
      </View>
    );
  }

  render() {
    const { histories, title } = this.props.data;
    const leftButton = (
      <TouchableOpacity
        style={{ paddingVertical: 10 }}
        onPress={() => this.props.navigation.goBack(null)}
      >
        <MyIcon name="arrow" size={20} color="black" />
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
              {title}
            </Text>
          }
        />
        <Timeline
          separator={false}
          circleSize={10}
          circleColor={colors.appTheme}
          lineColor="#d4d4d4"
          timeContainerStyle={{ maxWidth: 0, minWidth: 0 }}
          descriptionStyle={{ color: "red", fontSize: 12 }}
          titleStyle={{ fontSize: 12 }}
          options={{
            style: { paddingTop: 10 },
          }}
          lineWidth={1}
          enableEmptySections={true}
          keyExtractor={(item, index) => index}
          renderDetail={this.renderDetail.bind(this)}
          data={histories}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  infoTextHistory: {
    flex: 2,
    fontSize: 14,
    color: "#B2B2B2",
    borderBottomWidth: 0,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.checklistDetail.data,
  language: state.app.language,
});

//make this component available to the app
export default connect(mapStateToProps)(History);
