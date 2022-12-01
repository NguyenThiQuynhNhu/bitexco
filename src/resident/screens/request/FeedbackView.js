import React from "react";
import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import ElevatedView from "react-native-elevated-view";

import Strings from "../../utils/languages";

import { MyIcon } from "../../theme/icons";
import colors from "../../theme/colors";
import responsive from "../../../resources/responsive";

class FeedbackView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 5,
      description: Strings.detailRequest.ratingContentDefault,
    };
  }

  renderRateText = () => {
    const { rate } = this.state;
    let rateText = "";
    switch (rate) {
      case 1:
        rateText = "Chưa Hoàn Thành";
        break;
      case 2:
        rateText = "Hoàn Thành";
        break;
      case 3:
        rateText = "Hoàn Thành Tốt";
        break;
      default:
        break;
    }
    return <Text style={{ alignSelf: "center" }}>{rateText}</Text>;
  };

  renderStar(active, rate) {
    return (
      <TouchableOpacity
        key={rate}
        activeOpacity={1}
        onPress={() => this.setState({ rate: rate })}
      >
        <MyIcon
          name="star"
          size={responsive.h(30)}
          color="#2699FB"
          style={active ? styles.iconStarActive : styles.iconStarDeactive}
        />
      </TouchableOpacity>
    );
  }

  renderRateView() {
    const { rate } = this.state;
    const listStar = [];
    for (let i = 0; i < 5; i += 1) {
      const active = i < rate;
      listStar.push(this.renderStar(active, i + 1));
    }
    return listStar;
  }

  render() {
    const { onClose, onSubmit, onChangeText } = this.props;
    const { rate, description } = this.state;

    return (
      <View
        style={{
          width: "92.5%",
          borderRadius: responsive.h(16),
        }}
      >
        <View
          style={{
            borderRadius: responsive.h(10),
            justifyContent: "center",
            backgroundColor: "#fff",
            padding: responsive.h(10),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              //backgroundColor: 'white'
            }}
          >
            {this.renderRateView()}
          </View>
          {/* {this.renderRateText()} */}

          <ElevatedView elevation={5} style={styles.cardView}>
            <TextInput
              value={description}
              style={styles.textMultiRow}
              placeholder={Strings.detailRequest.typeContent}
              underlineColorAndroid="transparent"
              multiline
              onSubmitEditing={() => onSubmit({ rate, description })}
              returnKeyLabel="send"
              numberOfLines={6}
              onChangeText={(text) => this.setState({ description: text })}
            />
          </ElevatedView>
          <TouchableOpacity
            onPress={() => onSubmit({ rate, description })}
            style={{
              padding: responsive.h(10),
              marginTop: responsive.h(20),
              alignItems: "center",
              borderRadius: responsive.h(20),
              backgroundColor: colors.appTheme,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(16),
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "#ffffff",
              }}
            >
              {Strings.detailRequest.sentRate}
            </Text>
          </TouchableOpacity>
          {/* <PrimaryButton text="Gửi đánh giá" onPress={this.commentRequest} /> */}
        </View>
        <TouchableOpacity
          onPress={onClose}
          style={{
            borderRadius: responsive.h(45),
            position: "absolute",
            backgroundColor: "#505c5c5c",
            padding: responsive.h(10),
            top: responsive.h(-10),
            right: responsive.h(-10),
          }}
        >
          <MyIcon name="no" size={responsive.h(20)} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gridView: {
    //backgroundColor: 'white',
    margin: responsive.h(26),
    justifyContent: "center",
  },
  wrapperView: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    alignItems: "center",
    justifyContent: "center",
  },
  bodyView: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  blackText: {
    color: "#000",
    fontSize: responsive.h(12),
  },
  cardView: {
    borderRadius: responsive.h(5),
    flexDirection: "row",
    margin: responsive.h(5),
    padding: responsive.h(2),
    borderColor: "#fafafa",
    borderWidth: responsive.h(1),
    backgroundColor: "white",
  },
  textMultiRow: {
    flex: 1,
    padding: responsive.h(5),
    height: responsive.h(90),
    borderRadius: responsive.h(8),
    textAlignVertical: "top",
    fontFamily: "Inter-Regular",
    color: "#2e2e2e",
  },
  iconStarDeactive: {
    margin: responsive.h(5),
    opacity: 0.5,
  },
  iconStarActive: {
    margin: responsive.h(5),
  },
  wrapperTextIcon: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: responsive.h(10),
  },
  swiperImage: {
    margin: responsive.h(20),
    flexDirection: "row",
    alignItems: "center",
  },
});

const mapDispatchToProps = {
  // navListRequest: payload => dispatch(actions.navListRequest(payload)),
  // changeStateLoading: payload => dispatch(actions.changeStateLoading(payload)),
  // resetStateByKey: payload => dispatch(actions.resetStateByKey(payload))
};

export default connect(
  null,
  mapDispatchToProps
)(FeedbackView);
