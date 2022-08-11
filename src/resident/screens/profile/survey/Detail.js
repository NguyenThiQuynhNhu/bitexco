import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
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
import Toast, { DURATION } from "react-native-easy-toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
//
import { refreshDataHandle as refreshDataHandleSurvey } from "../../../actions/survey";
import {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
  insSurveyHandle,
  checkAnswerSurvey,
} from "../../../actions/surveyDetail";
import responsive from "../../../../resources/responsive";
class SurveyDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnswer: true,
      color: colors.toast.success,
    };
  }
  componentDidMount() {
    this.props.resetStateByKey({ key: "initList", path: "", value: true });
  }
  async componentWillReceiveProps(nextProps) {
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing
    ) {
      const data = {
        idSurvey: this.props.navigation.state.params.id,
      };
      await this.props.loadDataHandle(data);
      if (this.props.data) {
        await this.checkQuestion();
      }
    }
    if (nextProps.initList && nextProps.initList !== this.props.initList) {
      const data = {
        idSurvey: this.props.navigation.state.params.id,
      };
      await this.props.loadDataHandle(data);
      if (this.props.data) {
        await this.checkQuestion();
      }
    }
    if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
      this.props.refreshDataHandle();
    }

    if (nextProps.errorIns && nextProps.errorIns !== this.props.errorIns) {
      if (!nextProps.errorIns.hasError) {
        this.props.refreshDataHandle();
        this.props.refreshDataHandleSurvey();
        this.refs.toast.show(
          Strings.surveyDetail.sucsess,
          DURATION.LENGTH_LONG
        );
      } else {
        this.refs.toast.show(nextProps.error.message, DURATION.LENGTH_LONG);
      }
    }
  }
  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }
  renderItem = ({ item }) => {
    const {
      id,
      questionName,
      answerTypeName,
      answerTypeID,
      answer,
      answerText,
      isAnswer,
    } = item;
    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: responsive.h(10),
          borderRadius: responsive.h(12),
          backgroundColor: "#ffffff",
          shadowColor: "rgba(0, 0, 0, 0.1)",
          elevation: 2,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowRadius: responsive.h(10),
          shadowOpacity: 1,
          marginHorizontal: responsive.h(10),
        }}
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
              flex: 1,
              justifyContent: "space-between",
              margin: responsive.h(10),
            }}
          >
            <Text
              lineBreakMode="tail"
              numberOfLines={2}
              style={{
                flexDirection: "row",
                flex: 1,
                width: Screen.width - 60,
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(16),
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#282828",
              }}
            >
              {questionName}
            </Text>
            {answer.length > 0 ? (
              <FlatList
                refreshing={true}
                data={answer}
                renderItem={(itemAnswer) => {
                  //console.log(itemAnswer)
                  return (
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: responsive.h(10),
                      }}
                      onPress={async () =>
                        isAnswer ? null : this.checkAnswer(id, itemAnswer.item)
                      }
                    >
                      <View
                        style={{
                          height: responsive.h(20),
                          width: responsive.h(20),
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor:
                            itemAnswer.item.isReply ||
                            this.state[`${id}${itemAnswer.item.id}`]
                              ? colors.appTheme
                              : "#000",
                          borderRadius: responsive.h(10),
                        }}
                      >
                        {itemAnswer.item.isReply ||
                        this.state[`${id}${itemAnswer.item.id}`] ? (
                          <Text
                            style={{
                              color: colors.appTheme,
                              fontSize: responsive.h(15),
                            }}
                          >
                            ✓
                          </Text>
                        ) : null}
                      </View>
                      <Text style={{ flex: 1, marginLeft: responsive.h(10) }}>
                        {itemAnswer.item.answerName}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                //onEndReachedThreshold={0.5}
                style={{ marginTop: responsive.h(10) }}
              />
            ) : (
              <TextInput
                editable={answerText == ""}
                underline={false}
                multiline
                style={{
                  width: "100%",
                  flex: 1,
                  height: responsive.h(50),
                  padding: responsive.h(10),
                  textAlignVertical: Platform.OS === "ios" ? "auto" : "center",
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  fontSize: responsive.h(fontsize.small),
                  fontFamily: "Inter-Regular",
                  borderRadius: responsive.h(8),
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#cbcbcb",
                  marginTop: responsive.h(10),
                }}
                placeholder={Strings.message.pleaseType}
                placeholderTextColor="#6b6b6b"
                value={this.state[id] ? this.state[id] : answerText}
                underlineColorAndroid="transparent"
                onChangeText={(text) => {
                  this.setState({ [id]: text });
                }}
              />
            )}
          </View>
        </View>
      </View>
    );
    return (
      <ListItem
        item={item}
        onPress={() => this.props.navigation.navigate("surveyDetail", item)}
      />
    );
  };
  async checkQuestion() {
    await this.setState({ isAnswer: true });
    await this.props.data.forEach((question) => {
      if (!question.isAnswer) {
        this.setState({ isAnswer: false });
      }
    });
  }
  checkAnswer(id, item) {
    const ar = this.state[`${id}list`] ? this.state[`${id}list`] : [];
    if (this.state[`${id}${item.id}`]) {
      //console.log(ar)
      for (let i = 0; i < ar.length; i++) {
        if (ar[i].id === item.id) {
          ar.splice(i, 1);
        }
      }
      this.setState({
        [`${id}${item.id}`]: !this.state[`${id}${item.id}`],
        [`${id}list`]: ar,
      });
    } else {
      //console.log(ar)
      ar.push(item);
      this.setState({
        [`${id}${item.id}`]: !this.state[`${id}${item.id}`],
        [`${id}list`]: ar,
      });
    }
  }
  async _onSubmit() {
    const ar = [];
    const result = this.props.data.filter(
      (q) =>
        (!this.state[q.id] && !this.state[`${q.id}list`] && !q.isAnswer) ||
        (!this.state[q.id] &&
          this.state[`${q.id}list`] &&
          this.state[`${q.id}list`].length == 0 &&
          !q.isAnswer)
    );
    //console.log(result)
    await this.props.data.forEach((q) => {
      // if ((!this.state[q.id] && !this.state[`${q.id}list`] && !q.isAnswer) || (!this.state[q.id] && this.state[`${q.id}list`] && this.state[`${q.id}list`].length == 0 && !q.isAnswer)) {
      //     return this.refs.toast.show(`${Strings.message.pleaseType} ${q.questionName}`, DURATION.LENGTH_LONG);
      // }
      const itemQ = {
        idQuestion: q.id,
        answerText: this.state[q.id] ? this.state[q.id] : "",
        answer: this.state[`${q.id}list`] ? this.state[`${q.id}list`] : [],
      };
      ar.push(itemQ);
    });
    //if (result < 1) {
    //console.log(JSON.stringify(ar))
    return this.callSubmit(ar);

    //}
  }
  callSubmit(ar) {
    this.props.insSurveyHandle(ar);
    this.props.checkAnswerSurvey(true);
  }
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
      isLoadingIns,
    } = this.props;
    if (initList || isLoadingIns) {
      return (
        <View
          style={{
            paddingVertical: responsive.h(20),
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
        style={{
          paddingHorizontal: responsive.h(10),
          marginTop: responsive.h(7),
        }}
      />
    );
  }
  render() {
    //console.log('this.props', this.props)
    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <MyIcon name="arrow" color="black" size={responsive.h(20)} />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                padding: responsive.h(10),
                width: Screen.width - 124,
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(18),
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "black",
              }}
              numberOfLines={2}
              lineBreakMode="tail"
            >
              {this.props.navigation.state.params.name}
            </Text>
          }
          rightView={
            // <TouchableOpacity
            //   onPress={() => (this.state.isAnswer ? null : this._onSubmit())}
            //   style={{ padding: 10 }}
            // >
            //   <MyIcon
            //     name="reply"
            //     color={this.state.isAnswer ? colors.appTheme : "black"}
            //     size={20}
            //   />
            // </TouchableOpacity>
            this.state.isAnswer ? null : (
              <TouchableOpacity onPress={() => this._onSubmit()}>
                <MyIcon name="reply" color="black" size={responsive.h(20)} />
              </TouchableOpacity>
            )
          }
        />
        <Text
          style={{
            //fontFamily: "Inter-SemiBold",
            fontSize: responsive.h(14),
            color: "red",
            fontStyle: "italic",
            margin: responsive.h(10),
          }}
        >
          {!this.state.isAnswer ? "" : Strings.surveyDetail.isAnswer}
        </Text>
        <KeyboardAwareScrollView>
          {this._renderContent()}
        </KeyboardAwareScrollView>
        <Toast
          ref="toast"
          style={{
            backgroundColor:
              this.props.errorIns && !this.props.errorIns.hasError
                ? colors.toast.success
                : colors.toast.warning,
            opacity: 1,
            borderRadius: 5,
            padding: responsive.h(10),
          }}
        />
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
  data: state.surveyDetail.data,
  isLoading: state.surveyDetail.isLoading,
  error: state.surveyDetail.error,
  emptyData: state.surveyDetail.emptyData,
  initList: state.surveyDetail.initList,
  isRefreshing: state.surveyDetail.isRefreshing,
  isLoadingIns: state.surveyDetail.isLoadingIns,
  errorIns: state.surveyDetail.errorIns,
});

const mapActionToProps = {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
  insSurveyHandle,
  checkAnswerSurvey,
  refreshDataHandleSurvey,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToProps
)(SurveyDetailScreen);
