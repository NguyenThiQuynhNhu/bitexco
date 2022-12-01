//import liraries
import React, { Component } from "react";
import {
    Alert,
    View,
    Text,
    StyleSheet,
    TextInput,
    ImageBackground,
    Image,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    TouchableOpacity,
} from "react-native";
import firebase from "firebase";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";
import _ from "lodash";
import PrimaryButton from "../../components/common/PrimaryButton";
import colors from "../../theme/colors";
import { logo } from "../../theme/images";
import { Screen } from "../../utils/device";
import Strings from "../../resident/utils/languages";
import { navHome } from "../../actions/nav";
import fontsize from "../../theme/fontsize";
import ErrorContent from "../../components/common/ErrorContent";
import ImageProgress from "../../components/common/ImageProgress";
import NavBar from "../../resident/components/common/NavBar";
import { MyIcon } from "../../theme/icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { WebView } from 'react-native-webview';
import {
    loadDataHandle,
    refreshDataHandle,
    resetStateByKey
} from "../../actions/buildingDetail";
import responsive from "../../resources/responsive";
// create a component
class BuildingDetailScreen extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            password: "",
            otpCode: "",
            isPass: false,
            isRegister: false,
            passwordRetype: "",
            choiceType: false,
            //isType: false
        };
    }
    componentDidMount() {
        this.props.loadDataHandle({
            towerId: this.props.navigation.state.params.id,
            langId: this.props.langId
        });
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing) {
            this.props.loadDataHandle({
                towerId: this.props.navigation.state.params.id,
                langId: this.props.langId
            })
        }
    }
    // componentWillUnmount() {
    //     console.log('componentWillUnmount')
    //     this.props.resetStateByKey({ key: 'state' })
    // }
    render() {
        const { isLoading, data } = this.props;
        console.log(this.props)
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#ffffff",
                }}
            >
                <NavBar
                    body={
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
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
                                {this.props.navigation.state.params.name}
                            </Text>
                        </View>
                    }
                    leftButton={
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{ padding: responsive.h(10) }}
                        >
                            <MyIcon name="arrow" color="black" size={responsive.h(20)} />
                        </TouchableOpacity>
                    }
                    rightView={
                        <TouchableOpacity
                            style={{ padding: responsive.h(10), paddingHorizontal: responsive.h(12) }}
                        >
                            <MyIcon name="arrow" color="transparent" size={responsive.h(20)} />
                        </TouchableOpacity>
                    }
                />
                {this.renderContent()}
            </View>
        );
    }
    renderContent() {
        const { data, isLoading, error, initComponent, user } = this.props;
        if (initComponent || isLoading) {
            return <View
                style={{
                    paddingVertical: responsive.h(20),
                }}
            >
                <ActivityIndicator animating size='small' />
            </View>;
        } else if (error && error.hasError) {
            return <ErrorContent
                title={Strings.app.error}
                onTouchScreen={() => this.props.loadDataHandle()}
            />;
        } else if (data == null || (data != null && data.description == '')) {
            return <ErrorContent title={Strings.app.emptyData} />;
        } else {
            return (
                <WebView
                    style={{ flex: 1 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    source={{
                        html: `<html xmlns="http://www.w3.org/1999/xhtml">
                            <head>
                            <link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet'>
                            <meta name="viewport" content="width=device-width" />
                            </head>
                            <style>
                            img{ width: 100%  !important; height:auto !important} 
                            iframe{ width: 100%  !important; height:auto !important}
                            div {
                                font-family: 'Inter'
                            }
                            </style>
                            <body>
                            <div style='font-size: 14px; font-weight: bold'>
                            <div style="border-radius: 20px">
                            </div>
                            </div>${data.description}</body>
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
            );
        }
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: "#fff",
    },
});
const mapStateToProps = (state) => ({
    initComponent: state.buildingDetail.initComponent,
    data: state.buildingDetail.data,
    error: state.buildingDetail.error,

    isLoading: state.buildingDetail.isLoading,
    isRefreshing: state.buildingDetail.isRefreshing,
    auth: state.auth,
    langId: state.app.language == "vi" ? 1 : 2,
    towerId: state.auth.user ? state.auth.user.towerId : 0,
});
const mapActionToProps = {
    loadDataHandle,
    refreshDataHandle
};

//make this component available to the app
export default connect(
    mapStateToProps,
    mapActionToProps
)(BuildingDetailScreen);
