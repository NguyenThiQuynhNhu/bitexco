//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { connect } from "react-redux";
import Toast, { DURATION } from "react-native-easy-toast";
import {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
} from "../../actions/utilitiesServices";
import ErrorContent from "../../components/common/ErrorContent";
import PrimaryButton from "../../components/common/PrimaryButton";
import colors from "../../theme/colors";
import ImageProgress from "../../components/common/ImageProgress";
import NavBar from "../../components/common/NavBar";
import fontsize from "../../theme/fontsize";
import { MyIcon } from "../../theme/icons";
import BookingModal from "./BookingModal";
import Strings from "../../utils/languages";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// create a component
class ServicesScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      dataRequest: null,
    };
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    this.props.loadDataHandle({
      towerId: this.props.towerId,
      cateId: id,
      langId: this.props.langId,
    });
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
        this.setState(
          { showModal: false },
          () =>
            this.refs.toast.show(
              Strings.message.bookSuccess,
              DURATION.LENGTH_LONG
            ),
          this.props.navigation.navigate("serviceExtensionResident")
        );
      }
    }
  }
  componentWillUnmount() {
    this.props.resetStateByKey({ key: "state" });
  }
  renderItem = ({ item }) => {
    const {
      id,
      name,
      logo,
      unit,
      amount,
      price,
      deposit,
      dateLimited,
      departmentId,
    } = item;
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate("servicesDetail", item)}
        style={{
          marginHorizontal: responsive.h(20),
          marginBottom: responsive.h(20),
          backgroundColor: "#fff",
          borderRadius: responsive.h(12),
          //backgroundColor: "#ffffff",
          shadowColor: "rgba(0, 0, 0, 0.1)",
          elevation: 2,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowRadius: 10,
          shadowOpacity: 1,
        }}
      >
        <ImageProgress
          source={{ uri: logo }}
          style={{
            height: responsive.h(150),
            width: "100%",
            borderTopRightRadius: responsive.h(12),
            borderTopLeftRadius: responsive.h(12),
          }}
        />
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            fontSize: responsive.h(16),
            fontWeight: "600",
            fontStyle: "normal",
            lineHeight: responsive.h(24),
            letterSpacing: 0,
            textAlign: "left",
            color: "#3d3d3d",
            margin: responsive.h(10),
          }}
        >
          {name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: responsive.h(10),
            paddingBottom: responsive.h(10),
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{}}>
            {price > 0 ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: responsive.h(16),
                    fontWeight: "500",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "right",
                    color: "#ff624d",
                  }}
                >
                  {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: responsive.h(11),
                    fontWeight: "500",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "right",
                    color: "#6f6f6f",
                    marginLeft: responsive.h(5),
                  }}
                >
                  VNĐ
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: responsive.h(16),
                  fontWeight: "500",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "right",
                  color: "#ff624d",
                }}
              >
                {Strings.serviceExtension.negotiable}
              </Text>
            )}
          </View>
          <View>
            <PrimaryButton
              text={Strings.serviceExtension.bookService}
              onPress={() =>
                this.setState({
                  showModal: true,
                  dataRequest: {
                    departmentId,
                    price,
                    id,
                    name,
                    logo,
                    unit,
                    dateLimited,
                  },
                })
              }
              style={{
                backgroundColor: colors.appTheme,
                borderRadius: responsive.h(24),
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderContent() {
    const { initComponent, isLoading, error, data } = this.props;
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
      return (
        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `${index}`}
        />
      );
    }
  }
  render() {
    const { data } = this.props;
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
                fontFamily: "Inter-Bold",
                fontSize: responsive.h(20),
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
            //onPress={() => this.props.navigation.navigate('serviceExtensionResident', {name: this.props.navigation.state.params.name, dataId: data})}
            >
              <Icon
                name="history"
                size={responsive.h(24)}
                color="transparent"
              />
            </TouchableOpacity>
          }
        />
        {this.renderContent()}
        {this.state.dataRequest && (
          <BookingModal
            title={this.state.dataRequest.name}
            visible={this.state.showModal}
            data={this.state.dataRequest}
            onClose={() => this.setState({ showModal: false })}
          />
        )}
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
  data: state.utilitiesServices.data,
  isLoading: state.utilitiesServices.isLoading,
  error: state.utilitiesServices.error,
  initComponent: state.utilitiesServices.initComponent,
  canNavigate: state.utilitiesServicesDetail.data == null,
  isProgress: state.utilitiesServicesDetail.isProgress,
  errorProgress: state.utilitiesServicesDetail.errorProgress,
});
const mapActionToProps = {
  loadDataHandle,
  resetStateByKey,
  refreshDataHandle,
};
export default connect(
  mapStateToProps,
  mapActionToProps
)(ServicesScreen);
