//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { connect } from "react-redux";
import moment from "moment";
import Toast, { DURATION } from "react-native-easy-toast";
import {
  loadDataHandle,
  resetStateByKey,
  createBookingHandle,
} from "../../actions/utilitiesServicesDetail";
import { refreshDataHandle } from "../../actions/utilitiesServicesExtension";
import ErrorContent from "../../components/common/ErrorContent";
import PrimaryButton from "../../components/common/PrimaryButton";
import colors from "../../theme/colors";
import ImageProgress from "../../components/common/ImageProgress";
import NavBar from "../../components/common/NavBar";
import fontsize from "../../theme/fontsize";
import { MyIcon } from "../../theme/icons";
import BookingModal from "./BookingModal";
import Strings from "../../utils/languages";
import RNFetchBlob from "rn-fetch-blob";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Screen } from "../../utils/device";
import responsive from "../../../resources/responsive";
// create a component
class ServicesScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      spaceMainCode: "",
      isLoadingWeb: false,
      isLoadDesign: false,
    };
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    this.props.loadDataHandle({
      towerId: this.props.towerId,
      serviceId: id,
    });

    setTimeout(() => {
      this.setState({ isLoadDesign: true });
    }, 500);
  }
  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errorProgress &&
      nextProps.errorProgress !== this.props.errorProgress
    ) {
      if (nextProps.errorProgress.hasError) {
        this.refs.toast.show(
          nextProps.errorProgress.message,
          DURATION.LENGTH_LONG
        );
      } else {
        this.setState({ showModal: false }, () => {
          this.props.refreshDataHandle();
          this.refs.toast.show(
            Strings.message.bookSuccess,
            DURATION.LENGTH_LONG
          );
          this.props.navigation.navigate("serviceExtensionResident");
        });
      }
    }
  }
  renderContent() {
    const {
      initComponent,
      isLoading,
      error,
      data,
      createBookingHandle,
    } = this.props;
    if (initComponent || isLoading) {
      return (
        <View
          style={{
            paddingVertical: responsive.h(20),
          }}
        >
          <ActivityIndicator animating size="small" />
        </View>
      );
    } else if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => this.props.refreshDataHandle()}
        />
      );
    } else if (data) {
      const {
        id,
        description,
        logo,
        unit,
        price,
        amount,
        deposit,
        dateLimited,
        departmentId,
      } = data;
      const { name } = this.props.navigation.state.params;
      return (
        <View style={{ flex: 1, marginTop: responsive.h(-10) }}>
          <ImageProgress
            source={{ uri: logo }}
            style={{
              height: responsive.h(194),
              width: Screen.width - responsive.w(40),
              margin: responsive.h(20),
              borderColor: colors.grayBorder,
              borderRadius: responsive.h(12),
            }}
          />
          {/* <WebView
                        style={{ flex: 1 }}
                        startInLoadingState={Platform.OS === 'ios' ? false : this.state.isLoadingWeb}
                        source={{ html: `<html xmlns="http://www.w3.org/1999/xhtml"><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /></head><style>img{ width: 100%  !important; height:auto !important} iframe{ width: 100%  !important; height:auto !important}</style><body>${description}</body></html>` }}
                        scrollEnabled
                        javaScriptEnabled
                        domStorageEnabled
                        onNavigationStateChange={this.handleNavigationChange}
                        ref="webView"
                    /> */}

          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: responsive.h(18),
              fontWeight: "600",
              fontStyle: "normal",
              marginHorizontal: responsive.h(20),
              marginTop: responsive.h(20),
              letterSpacing: 0,
              textAlign: "left",
              color: "#3d3d3d",
            }}
          >
            {name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginHorizontal: responsive.h(20),
              marginTop: responsive.h(20),
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(14),
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#ff3d00",
              }}
            >
              {deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Text>
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: responsive.h(12),
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#6f6f6f",
                marginLeft: responsive.h(5),
              }}
            >
              VNĐ
            </Text>
          </View>
          <View
            style={{
              height: "60%",
              width: Screen.width,
              paddingHorizontal: responsive.h(20),
              paddingBottom: responsive.h(600),
            }}
          >
            <WebView
              source={{
                html: `<html xmlns="http://www.w3.org/1999/xhtml"><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /></head><style>img{ width: 100%  !important; height:auto !important} iframe{ width: 100%  !important; height:auto !important}</style><body>${description}</body></html>`,
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
          </View>
          <BookingModal
            title={name}
            visible={this.state.showModal}
            data={{
              departmentId,
              price,
              id,
              name,
              logo,
              unit,
              dateLimited,
            }}
            onClose={() => this.setState({ showModal: false })}
          />
          <PrimaryButton
            text={Strings.serviceExtension.bookService}
            onPress={() => {
              this.setState({ showModal: true });
            }}
            style={{
              position: "absolute",
              bottom: responsive.h(20),
              alignSelf: "center",
              borderRadius: responsive.h(12),
            }}
          />
        </View>
      );
    }
  }
  render() {
    const { navigation, isProgress, data } = this.props;

    if (!this.state.isLoadDesign) {
      return (
        <View style={styles.container}>
          <NavBar
            leftButton={
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{ paddingVertical: responsive.h(10) }}
              >
                <MyIcon name="arrow" color="black" size={responsive.h(20)} />
              </TouchableOpacity>
            }
            body={
              <Text
                style={{
                  alignSelf: "center",
                  color: "black",
                  fontSize: responsive.h(fontsize.larg),
                }}
              >
                {this.props.navigation.state.params.name}
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
                padding: responsive.h(10), paddingHorizontal: responsive.h(12),
              }}
            >
              <MyIcon name="arrow" color="black" size={responsive.h(20)} />
            </TouchableOpacity>
          }
          body={
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(18),
                fontWeight: "bold",
                textAlign: "center",
                color: "black",
              }}
            >
              {this.props.navigation.state.params.name}
            </Text>
          }
          rightView={
            <TouchableOpacity
              style={{
                padding: responsive.h(10), paddingHorizontal: responsive.h(12),
              }}
              onPress={() =>
                this.props.navigation.navigate("serviceExtensionResident", {
                  id: data.id,
                  name: this.props.navigation.state.params.name,
                })
              }
            >
              <Icon
                name="history"
                size={responsive.h(24)}
                color="black"
                //style={{marginHorizontal: 20}}
              />
            </TouchableOpacity>
          }
        />
        {this.renderContent()}

        <Toast
          ref="toast"
          style={{
            backgroundColor:
              this.props.errorProgress && this.props.errorProgress.hasError
                ? colors.toast.warning
                : colors.toast.success,
            opacity: 1,
            borderRadius: 5,
            padding: responsive.h(10),
          }}
        />
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
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

//make this component available to the app
const mapStateToProps = (state) => ({
  user: state.auth.user,
  towerId: state.auth.user.towerId,
  langId: state.app.language == "vi" ? 1 : 2,
  data: state.utilitiesServicesDetail.data,
  isLoading: state.utilitiesServicesDetail.isLoading,
  error: state.utilitiesServicesDetail.error,
  initComponent: state.utilitiesServicesDetail.initComponent,
  errorProgress: state.utilitiesServicesDetail.errorProgress,
  isProgress: state.utilitiesServicesDetail.isProgress,
});
const mapActionToProps = {
  loadDataHandle,
  resetStateByKey,
  createBookingHandle,
  refreshDataHandle,
};
export default connect(
  mapStateToProps,
  mapActionToProps
)(ServicesScreen);
