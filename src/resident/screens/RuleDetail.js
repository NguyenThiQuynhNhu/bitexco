//import liraries
import React, { Component } from "react";
import {
  Alert,
  View,
  Text,
  Linking,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { connect } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import moment from "moment";
import Toast, { DURATION } from "react-native-easy-toast";
import fontsize from "../theme/fontsize";

import { updateItemList } from "../actions/news";
import { get } from "../services/helper";
import { MyIcon } from "../theme/icons";
import colors from "../theme/colors";
import ErrorContent from "../components/common/ErrorContent";
import NavBar from "../../components/common/NavBar";
import Strings from "../utils/languages";

// create a component
class RulesDetail extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      initComponent: false,
      emptyData: false,
      isLoading: false,
      isLoadingWeb: true,
      isRefreshing: false,
      errors: null,
      data: null,
      isLoadDesign: false,
    };
    this.handleNavigationChange = this.handleNavigationChange.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ onResponse: this._onResponse });
    this.resetStateByObject({ initComponent: true });

    setTimeout(() => {
      this.setState({ isLoadDesign: true });
    }, 500);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.initComponent !== nextState.initComponent &&
      nextState.initComponent
    ) {
      this.loadDataHandle();
    }
    if (
      nextState.isRefreshing !== this.state.isRefreshing &&
      nextState.isRefreshing &&
      !nextState.isLoading
    ) {
      this.loadDataHandle();
    }
  }

  resetStateByObject(obj) {
    this.setState(obj);
  }

  refreshDataHandle() {
    this.setState({
      isRefreshing: true,
      data: [],
    });
  }

  async loadDataHandle() {
    const { navigation } = this.props;
    this.setState({
      isLoading: true,
      emptyData: false,
      errors: null,
    });
    const ret = await get(
      "/Residents/TowerRuleDetail",
      navigation.state.params
    );
    if (ret !== undefined && ret !== null) {
      if (ret !== -1 && ret.status == 200) {
        //  console.log(ret.data)
        this.setState({
          initComponent: false,
          isLoading: false,
          isRefreshing: false,
          data: ret.data,
          emptyData: ret.contents === null,
          errors: { hasError: false, error: "" },
        });
      } else {
        //console.log(ret)
        this.setState({
          initComponent: false,
          isLoading: false,
          isRefreshing: false,
          errors: { hasError: true, error: "" },
        });
      }
    } else {
      //console.log(ret)
      this.setState({
        initComponent: false,
        isLoading: false,
        isRefreshing: false,
        errors: { hasError: true, error: "" },
      });
    }
  }

  renderContent() {
    const { navigation } = this.props;
    const { name } = navigation.state.params;

    if (this.state.initComponent) {
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
    if (this.state.errors && this.state.errors.hasError) {
      return (
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => this.setState({ initComponent: true })}
        >
          <ErrorContent
            logo="layer"
            title={Strings.app.error}
            visibleButton={false}
          />
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginBottom: 50,
            }}
          >
            <Text style={{ color: "#cccccc", marginLeft: 10 }}>
              {Strings.app.touchToRefresh}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    if (this.state.emptyData) {
      return (
        <ErrorContent
          logo="layer"
          title={Strings.app.emptyData}
          buttonText="Quay lại"
          onPressButton={() => this.props.navigation.goBack()}
        />
      );
    }
    if (this.state.data) {
      return (
        <View style={{ flex: 1, marginHorizontal: 10, marginTop: -5 }}>
          <WebView
            style={{ flex: 1 }}
            startInLoadingState={
              Platform.OS === "ios" ? false : this.state.isLoadingWeb
            }
            source={{
              html: `<html xmlns="http://www.w3.org/1999/xhtml"><head><meta name="viewport" content="width=device-width" /></head><style>img{ width: 100%  !important; height:auto !important}</style><body>${
                this.state.data.contents
              }</body></html>`,
            }}
            scrollEnabled
            javaScriptEnabled
            domStorageEnabled
            onNavigationStateChange={this.handleNavigationChange}
            ref="webView"
          />
          <View
            style={{ flexDirection: "row", backgroundColor: colors.appTheme }}
          >
            {this.state.data.fileUrl.length > 0 && (
              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 50,
                  flexDirection: "row",
                  backgroundColor: colors.appTheme,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  try {
                    Linking.canOpenURL(this.state.data.fileUrl).then(
                      (supported) => {
                        if (supported) {
                          if (Platform.OS === "android") {
                            this.download(this.state.data.fileUrl);
                          } else {
                            Linking.openURL(this.state.data.fileUrl);
                          }
                        }
                      }
                    );
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <MyIcon name="download" size={30} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    marginLeft: 10,
                    fontSize: fontsize.larg,
                  }}
                >
                  {Strings.app.download}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Toast
            ref="toast"
            style={{
              backgroundColor:
                this.props.errorProgress && this.props.errorProgress.hasError
                  ? colors.toast.warning
                  : colors.toast.success,
              opacity: 1,
              borderRadius: 5,
              padding: 10,
            }}
          />
        </View>
      );
    }
  }

  render() {
    if (!this.state.isLoadDesign) {
      return (
        <View style={styles.container}>
          <NavBar
            leftButton={
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{ paddingVertical: 10 }}
              >
                <MyIcon name="arrow" color="#fff" size={20} />
              </TouchableOpacity>
            }
            body={
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: 20,
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "center",
                  color: "#ffffff",
                }}
              >
                {this.props.navigation.state.params.name}
              </Text>
            }
            rightView={
              <TouchableOpacity style={{ paddingVertical: 10 }}>
                <MyIcon size={20} name="search" color="transparent" />
              </TouchableOpacity>
            }
          />
          <View
            style={{
              paddingVertical: 20,
            }}
          >
            <ActivityIndicator animating size="small" />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <NavBar
          leftButton={
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ paddingVertical: 10 }}
            >
              <MyIcon name="arrow" color="black" size={20} />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 20,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "black",
              }}
            >
              {this.props.navigation.state.params.name}
            </Text>
          }
          rightView={
            <TouchableOpacity style={{ paddingVertical: 10 }}>
              <MyIcon size={20} name="search" color="black" />
            </TouchableOpacity>
          }
        />
        {this.renderContent()}
      </View>
    );
  }

  handleNavigationChange = (navState) => {
    if (navState.title) {
      this.setState({ isLoadingWeb: false });
    }

    Linking.canOpenURL(navState.url).then((supported) => {
      if (supported) {
        this.refs.webView.stopLoading();
        if (Platform.OS === "android") {
          if (this.state.fileUrl !== navState.url) {
            this.setState({ fileUrl: navState.url }, () => {
              this.download(navState.url);
            });
          }
        } else {
          Linking.openURL(navState.url);
        }
      } else {
        console.log("Don't know how to open URI: " + navState.url);
      }
    });
  };

  download(url) {
    try {
      var date = new Date();
      var ext = this.extention(url);
      ext = "." + ext[0];
      const { config } = RNFetchBlob;
      let dirs = RNFetchBlob.fs.dirs;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          description: "File",
        },
        path:
          dirs.DocumentDir +
          "/file_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
      };
      config(options)
        .fetch("GET", url)
        .then((res) => {
          //console.log('The file saved to ', res.path())
          //console.log(res)
          //Linking.openURL(res.data)
          this.refs.toast.show("Success Downloaded", DURATION.LENGTH_LONG);
        });
    } catch (err) {}
  }

  extention(filename) {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  }

  _onResponse = () => {
    this.setState({ isShowModal: true });
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default RulesDetail;
