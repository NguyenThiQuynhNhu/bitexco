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
import _ from "lodash";

import fontsize from "../../theme/fontsize";

import { updateItemList, updateBadge } from "../../actions/news";
import { get } from "../../services/helper";
import { MyIcon } from "../../theme/icons";
import colors from "../../theme/colors";
import ErrorContent from "../../components/common/ErrorContent";
import Strings from "../../utils/languages";
import Toast, { DURATION } from "react-native-easy-toast";
import { refreshDataHandle } from "../../actions/notification";
// import HTML from 'react-native-render-html';

import NavBar from "../../../resident/components/common/NavBar";
import responsive from "../../../resources/responsive";

// create a component
class NewsDetail extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

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
      fileUrl: "",
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
    const { updateItemList, navigation } = this.props;
    const { item, type } = navigation.state.params;
    const {
      id,
      title,
      dateCreate,
      imageUrl,
      isRead,
      towerId,
      towerName,
      address,
      shortDescription,
    } = item;
    this.setState({
      isLoading: true,
      emptyData: false,
      errors: null,
    });
    // const { api, params } = this.props
    // console.log({ api, params });
    const ret = await get("/Residents/NewsDetail", {
      newsId: id,
      towerId,
      typeNews: type,
    });
    console.log(ret);
    if (ret !== undefined && ret !== null) {
      if (ret !== -1 && ret.status == 200) {
        //  console.log(ret.data)
        this.setState(
          {
            initComponent: false,
            isLoading: false,
            isRefreshing: false,
            data: ret.data,
            emptyData: ret.description === null,
            errors: { hasError: false, error: "" },
          },
          () => this.props.updateItemList(ret)
        );
        this.props.refreshDataHandle();
        this.props.updateBadge(towerId);
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
    const { item, type } = navigation.state.params;
    const {
      id,
      title,
      dateCreate,
      imageUrl,
      isRead,
      towerId,
      towerName,
      address,
      shortDescription,
    } = item;

    if (this.state.initComponent) {
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
    if (this.state.errors && this.state.errors.hasError) {
      return (
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => this.setState({ initComponent: true })}
        >
          <ErrorContent
            logo="layer"
            title={Strings.app.error + " hoặc tin đã bị xóa!"}
            visibleButton={false}
          />
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginBottom: responsive.h(50),
            }}
          >
            <Text
              style={{
                color: "#cccccc",
                marginLeft: responsive.h(10),
                fontSize: responsive.h(fontsize.small),
              }}
            >
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
        <View style={{ flex: 1, marginHorizontal: responsive.h(20) }}>
          {/* <View style={{ height: '100%', width: '100%' }}> */}
          <WebView
            style={{ flex: 1 }}
            source={{
              html: `<html xmlns="http://www.w3.org/1999/xhtml">
                            <head>
                            <meta name="viewport" content="width=device-width" />
                            </head>
                            <style>img{ width: 100%  !important; height:auto !important} iframe{ width: 100%  !important; height:auto !important}</style>
                            <body>
                            <div style='font-size: 14px; font-weight: bold'>
                            <div style="border-radius: 20px">
                            <img src=${
                              this.state.data.imageUrl
                            } style="border-radius: 20px !important">
                            </div>
                            <div style='color: #000000; font-size:16pt; margin-top: 10px; font-family: Asap-SemiBold'>${
                              this.state.data.title
                            }</div>
                            <div style='font-size: 12px; color: #6f6f6f; font-weight: normal; margin-bottom: 10; font-family: Asap-Regular'>${moment(
                              this.state.data.dateCreate
                            ).format("DD/MM/YYYY HH:mm")}</div>
                            </div>${this.state.data.description}</body>
                            </html>`,
            }}
            scalesPageToFit={true}
            startInLoadingState={
              Platform.OS === "ios" ? false : this.state.isLoadingWeb
            }
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={["*"]}
            mixedContentMode="always"
          />
          {/* </View> */}
          {/* <WebView
                        style={{ flex: 1 }}
                        //startInLoadingState={Platform.OS === 'ios' ? false : this.state.isLoadingWeb}
                        source={{ html: `<html xmlns="http://www.w3.org/1999/xhtml"><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /></head><style>img{ width: 100%  !important; height:auto !important} iframe{ width: 100%  !important; height:auto !important}</style><body><div style='font-size: 36px; font-weight: bold'><div style='color: #002b41; font-size:16pt'>${title}</div><div style='font-size: 14px; color: #d0d0d0; font-weight: normal; margin-bottom: 20'>${moment(dateCreate).format('DD/MM/YYYY HH:mm')}</div></div><div><img src=${imageUrl}></div>${this.state.data.description}</body></html>` }}
                        scrollEnabled
                        javaScriptEnabled
                        domStorageEnabled
                        onNavigationStateChange={this.handleNavigationChange}
                        ref="webView"
                        //javaScriptEnabled
                        //domStorageEnabled
                        allowFileAccessFromFileURLs
                        startInLoadingState
                        originWhitelist={['*']}
                        mixedContentMode="compatibility"
                    /> */}
          <View
            style={{ flexDirection: "row", backgroundColor: colors.appTheme }}
          >
            {this.state.data.link.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  try {
                    Linking.openURL(this.state.data.link);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                style={{
                  height: responsive.h(50),
                  flex: 1,
                  flexDirection: "row",
                  backgroundColor: colors.appTheme,
                  borderColor: "#fff",
                  borderRightWidth:
                    this.state.data.fileUrl.length > 0 ? responsive.w(1) : 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MyIcon
                  name="link"
                  size={responsive.h(fontsize.small)}
                  color="#fff"
                />
                <Text
                  style={{
                    color: "#fff",
                    marginLeft: responsive.h(10),
                    fontSize: responsive.h(fontsize.small),
                  }}
                >
                  Liên kết
                </Text>
              </TouchableOpacity>
            )}
            {this.state.data.fileUrl.length > 0 && (
              <TouchableOpacity
                style={{
                  flex: 1,
                  height: responsive.h(50),
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
                <MyIcon name="download" size={responsive.h(30)} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    marginLeft: responsive.h(10),
                    fontSize: responsive.h(fontsize.small),
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
              borderRadius: responsive.h(5),
              padding: responsive.h(10),
            }}
          />
        </View>
      );
    }
  }

  render() {
    //         const htmlContent = `
    //     <h1>This HTML snippet is now rendered with native components !</h1>
    //     <h2>Enjoy a webview-free and blazing fast application</h2>
    //     <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
    //     <em style="textAlign: center;">Look at how happy this native cat is</em>
    // `;

    if (!this.state.isLoadDesign) {
      return (
        <View style={styles.container}>
          <NavBar
            leftButton={
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{ padding: responsive.h(10) }}
              >
                <MyIcon name="arrow" color="black" size={responsive.h(20)} />
              </TouchableOpacity>
            }
            body={
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: responsive.h(20),
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "center",
                  color: "black",
                }}
              >
                {this.props.navigation.state.params.item.towerName.toLocaleUpperCase()}
              </Text>
            }
          />
          <View
            style={{
              paddingVertical: responsive.h(20),
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
              style={{
                padding: responsive.h(10),
              }}
            >
              <MyIcon name="arrow" color="black" size={responsive.h(20)} />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                fontFamily: "Inter",
                fontSize: responsive.h(20),
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "black",
              }}
            >
              {this.props.navigation.state.params.item.towerName.toLocaleUpperCase()}
            </Text>
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
    //const url = 'https://ttc.landsoftapis.com/Images/2019/07/17/thumb/636989774307318833.jpg'
    //console.log(url);
    try {
      var date = new Date();
      var ext = this.extention(url);
      ext = "." + ext[0];
      const { config } = RNFetchBlob;
      let dirs = RNFetchBlob.fs.dirs;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          title: "Đang tải file",
          useDownloadManager: true,
          notification: true,
          description: "File",
        },
        path:
          dirs.DCIMDir +
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
    } catch (err) {
      console.log(err);
    }
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

//make this component available to the app
const mapActionToProps = {
  updateItemList,
  updateBadge,
  refreshDataHandle,
};
export default connect(
  null,
  mapActionToProps
)(NewsDetail);
