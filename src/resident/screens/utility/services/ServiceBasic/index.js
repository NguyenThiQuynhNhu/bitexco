//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import ListItem from "./ListItem";

import Toast, { DURATION } from "react-native-easy-toast";
//components
import SearchBar from "../../../../components/common/SearchBar";
import ErrorContent from "../../../../components/common/ErrorContent";

import ButtonFilter from "../../../../components/service/basic/ButtonFilter";
import Spinner from "react-native-loading-spinner-overlay";
//style
import colors from "../../../../theme/colors";
import fontsize from "../../../../theme/fontsize";

//data
import {
  converStatusToColor,
  converStatusToString,
} from "../../../../utils/serviceBasic";
import {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  deleteServicedHandle,
} from "../../../../actions/utilitiesServicesBasic";

import Strings from "../../../../utils/languages";
import NavBar from "../../../../components/common/NavBar";
import { MyIcon } from "../../../../theme/icons";
import responsive from "../../../../../resources2/responsive";

// create a component
class ServiceBasic extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      searchKey: "",
      isApplySearchKey: false,
      filter: [
        {
          statusId: 1,
          isFilter: false,
        },
        {
          statusId: 2,
          isFilter: false,
        },
        {
          statusId: 3,
          isFilter: false,
        },
        {
          statusId: 4,
          isFilter: false,
        },
      ],
      status: 0,
      isShowSearch: false,
      dataStatus: this.props.dataStatus,
    };
  }
  componentDidMount() {
    this.props.resetStateByKey({ key: "initList", path: "", value: true });
    //console.log(this.props.navigation.state.params)
  }
  async componentWillReceiveProps(nextProps) {
    if (
      nextProps.isRefreshing &&
      nextProps.isRefreshing !== this.props.isRefreshing
    ) {
      const data = {
        towerId: this.props.towerId,
        statusId: this.state.status,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
        serviceId: this.props.navigation.state.params
          ? this.props.navigation.state.params.id
          : 0,
      };
      this.props.loadDataHandle(data);
      setTimeout(() => {
        //const ar = [];
        this.props.dataStatus.forEach((element) => {
          element.currentValue = this.state.status;
          //ar.push(element)
        });
        this.setState({ dataStatus: this.props.dataStatus });
      }, 500);
    }
    if (nextProps.initList && nextProps.initList !== this.props.initList) {
      const data = {
        towerId: this.props.towerId,
        keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
        currentPage: nextProps.currentPage + 1,
        rowPerPage: this.props.rowPerPage,
        serviceId: this.props.navigation.state.params
          ? this.props.navigation.state.params.id
          : 0,
      };
      await this.props.loadDataHandle(data);
      await this.setState({ dataStatus: this.props.dataStatus });
    }
    if (
      nextProps.errorCreate &&
      this.props.errorCreate !== nextProps.errorCreate
    ) {
      if (!nextProps.errorCreate.hasError) {
        this.props.refreshDataHandle();
        this.refs.toast.show(Strings.message.bookSuccess, DURATION.LENGTH_LONG);
      }
    }
    if (nextProps.towerId && nextProps.towerId !== this.props.towerId) {
      this.props.refreshDataHandle();
    }

    //
    if (nextProps.errorDe && nextProps.errorDe !== this.props.errorDe) {
      if (!nextProps.errorDe.hasError) {
        //this.props.navigation.goBack();
        //this.props.refreshDataHandle()
      } else {
        this.refs.toast.show(nextProps.errorDe.message, DURATION.LENGTH_LONG);
      }
    }
  }
  componentWillUnmount() {
    //this.props.resetStateByKey({ key: 'state' });
  }
  deleteService(id) {
    Alert.alert("Thông báo", "Bạn có chắc chắn muốn hủy phiếu!", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          return this.props.deleteServicedHandle({
            bookingId: id,
            description: "Hủy phiếu",
          });
        },
      },
    ]);
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
          onTouchScreen={() => {
            this.props.refreshDataHandle(),
              this.setState({ dataStatus: this.props.dataStatus });
          }}
        />
      );
    }
    if (error && error.hasError) {
      return (
        <ErrorContent
          title={Strings.app.error}
          onTouchScreen={() => {
            this.props.refreshDataHandle(),
              this.setState({ dataStatus: this.props.dataStatus });
          }}
        />
      );
    }
    return (
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        refreshing={isRefreshing}
        onRefresh={() => this._onRefresh()}
        //onRefresh={() => this.setState({dataStatus: this.props.dataStatus}), () => this.props.refreshDataHandle()}
        data={data}
        numColumns={2}
        contentContainerStyle={{
          marginVertical: 10,
        }}
        //ItemSeparatorComponent={() => <View style={{ backgroundColor: colors.grayBorder, height: 1 }} />}
        renderItem={this.renderItem}
        ListFooterComponent={this.renderFooter}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        onEndReached={() => {
          if (
            !this.onEndReachedCalledDuringMomentum &&
            !this.props.outOfStock &&
            this.props.currentPage > 0 &&
            !this.props.isLoading
          ) {
            const data = {
              towerId: this.props.towerId,
              statusId: this.state.status,
              keyword: this.state.isApplySearchKey ? this.state.searchKey : "",
              currentPage: this.props.currentPage + 1,
              rowPerPage: this.props.rowPerPage,
              serviceId: this.props.navigation.state.params
                ? this.props.navigation.state.params.id
                : 0,
            };
            this.props.loadDataHandle(data);
          }
        }}
      />
    );
  }
  async _onRefresh() {
    await this.props.refreshDataHandle();
    setTimeout(() => {
      this.props.dataStatus.forEach((element) => {
        element.currentValue = this.state.status;
        //ar.push(element)
      });
      this.setState({ dataStatus: this.props.dataStatus });
    }, 500);
  }
  renderItem = ({ item }) => {
    return (
      <ListItem
        item={item}
        deleteService={(id) => this.deleteService(id)}
        //onPress={() => this.props.canNavigate ? this.props.navigation.navigate('serviceBasicDetailResident', item) : null
        onPress={() =>
          this.props.navigation.navigate("serviceBasicDetailResident", item)
        }
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
    const { searchKey, isApplySearchKey } = this.state;
    const { isShowSearch, dataStatus } = this.state;
    return (
      <View style={styles.container}>
        {isShowSearch ? (
          <NavBar
            body={
              <SearchBar
                autofocus={true}
                value={searchKey}
                onChangeText={(searchKey) => {
                  this.setState({ searchKey }, () => {
                    if (searchKey.length === 0) {
                      if (this.state.isApplySearchKey) {
                        this.setState(
                          { searchKey: "", isApplySearchKey: false },
                          () => this.props.refreshDataHandle()
                        );
                      }
                    }
                  });
                }}
                onSubmitEditing={() =>
                  this.setState({ isApplySearchKey: true }, () =>
                    this.props.refreshDataHandle()
                  )
                }
                onClearText={() => {
                  const isApplySearchKeyOld = this.state.isApplySearchKey;
                  this.setState(
                    { searchKey: "", isApplySearchKey: false },
                    () => {
                      if (isApplySearchKeyOld) {
                        this.props.refreshDataHandle();
                      }
                    }
                  );
                }}
                style={{
                  flex: 1,
                  // margin: Platform.OS == "ios" ? 5 : 10,
                  marginHorizontal: 10,
                }}
              />
            }
            rightView={
              <TouchableOpacity
                onPress={() => {
                  const isApplySearchKeyOld = this.state.isApplySearchKey;
                  this.setState(
                    {
                      isShowSearch: false,
                      searchKey: "",
                      isApplySearchKey: false,
                    },
                    () => {
                      if (isApplySearchKeyOld) {
                        this.props.refreshDataHandle();
                      }
                    }
                  );
                }}
                style={{ padding: 10 }}
              >
                <Text style={{ color: "#fff" }}>{Strings.app.cancel}</Text>
              </TouchableOpacity>
            }
          />
        ) : (
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
                  fontFamily: "Inter-Bold",
                  fontSize: 20,
                  fontWeight: "bold",
                  fontStyle: "normal",
                  letterSpacing: 0,
                  textAlign: "center",
                  color: "black",
                }}
              >
                {this.props.navigation.state.params
                  ? this.props.navigation.state.params.name
                  : Strings.serviceBasic.title}
              </Text>
            }
            rightView={
              <TouchableOpacity
                onPress={() => this.setState({ isShowSearch: true })}
                style={{ padding: 10 }}
              >
                <MyIcon size={24} name="search" color="black" />
              </TouchableOpacity>
            }
          />
        )}

        <View>
          {/* <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{
                            backgroundColor: '#fff',
                        }}
                    >
                        <ButtonFilter value={1} currentValue={this.state.status} onSelectedChange={this._onSelectedChange} style={{ paddingHorizontal: 5 }} />
                        <ButtonFilter value={2} currentValue={this.state.status} onSelectedChange={this._onSelectedChange} />
                        <ButtonFilter value={3} currentValue={this.state.status} onSelectedChange={this._onSelectedChange} />
                        <ButtonFilter value={4} currentValue={this.state.status} onSelectedChange={this._onSelectedChange} />

                    </ScrollView> */}
          <FlatList
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: 1,
                  backgroundColor: colors.grayBorder,
                  marginVertical: 10,
                }}
              />
            )}
            data={dataStatus}
            keyExtractor={(item, index) => `${index}`}
            horizontal={true}
            //pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              marginVertical: 10,
            }}
            //legacyImplementation={false}
            style={{ borderTopRightRadius: 20, marginTop: -15 }}
            renderItem={(item) => {
              //console.log('item',item)
              return (
                <View>
                  <ButtonFilter
                    value={item.item.statusId}
                    currentValue={item.item.currentValue}
                    title={item.item.statusName}
                    total={item.item.total}
                    onSelectedChange={this._onSelectedChange}
                    style={{ paddingHorizontal: 5 }}
                  />
                </View>
              );
            }}
            onEndReachedThreshold={0.5}
          />
        </View>
        <View
          style={{
            backgroundColor: "#f5f5f5",
            height: 15,
            width: "100%",
          }}
        />
        {this._renderContent()}
        {/* <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('requestCreate')}
                    style={{
                        backgroundColor: colors.appTheme,
                        width: 50,
                        height: 50,
                        borderRadius: 35,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: 20,
                        right: 20
                    }}>
                    <MyIcon name="plus" size={20} color="#fff" />
                </TouchableOpacity> */}
        <Spinner
          visible={this.props.isLoadingDe}
          color={colors.primaryKeyColor}
        />
        <Toast
          ref="toast"
          style={{
            backgroundColor: colors.toast.success,
            opacity: 1,
            borderRadius: 5,
            padding: 10,
          }}
        />
      </View>
    );
  }
  _onSelectedChange = async (value) => {
    // if (value == this.state.status) {
    //     this.setState({ status: 0 }, () => this.props.refreshDataHandle())
    // } else {
    //     this.setState({ status: value }, () => this.props.refreshDataHandle())
    // }
    if (value == this.state.status) {
      const ar = [];
      await this.props.dataStatus.forEach((element) => {
        element.currentValue = 0;
        ar.push(element);
      });
      await this.setState({ dataStatus: ar });
      this.setState({ status: 0 }, () => this.props.refreshDataHandle());
    } else {
      const ar = [];
      await this.props.dataStatus.forEach((element) => {
        element.currentValue = value;
        ar.push(element);
      });
      await this.setState({ dataStatus: ar });
      this.setState({ status: value }, () => this.props.refreshDataHandle());
    }
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({
  towerId: state.auth.user ? state.auth.user.towerId : 0,
  initList: state.utilitiesServicesBasic.initList,
  currentPage: state.utilitiesServicesBasic.currentPage,
  rowPerPage: state.utilitiesServicesBasic.rowPerPage,
  emptyData: state.utilitiesServicesBasic.emptyData,
  outOfStock: state.utilitiesServicesBasic.outOfStock,
  isLoading: state.utilitiesServicesBasic.isLoading,
  data: state.utilitiesServicesBasic.data,
  error: state.utilitiesServicesBasic.error,
  isRefreshing: state.utilitiesServicesBasic.isRefreshing,
  isApplySearchKey: state.utilitiesServicesBasic.isApplySearchKey,
  searchKey: state.utilitiesServicesBasic.searchKey,
  dataStatus: state.utilitiesServicesBasic.dataStatus,
  canNavigate: state.utilitiesServicesBasicDetail.data == null,
  language: state.app.language,
  //
  isLoadingDe: state.utilitiesServicesBasic.isLoadingDe,
  errorDe: state.utilitiesServicesBasic.errorDe,
});

const mapActionToState = {
  loadDataHandle,
  refreshDataHandle,
  resetStateByKey,
  deleteServicedHandle,
};

//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionToState
)(ServiceBasic);
