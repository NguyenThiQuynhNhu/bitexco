//import liraries
import React, { Component } from 'react';
import _ from 'lodash';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Switch } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationActions } from 'react-navigation';
import colors from '../../../theme/colors';
import { MyIcon } from '../../../theme/icons';
import Lookup from '../../../components/Request/RequestCreate/Lookup';
import { connect } from 'react-redux';
import { resetStateByKey, createRequestHandle } from '../../../actions/requestCreate';
import fontsize from '../../../theme/fontsize';
import Strings from '../../../utils/languages';
import responsive from "../../../resources/responsive";
// create a component
class CreateCompleteScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerTitle: Strings.createRequest.navTitle,
            headerBackTitle: null,
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: colors.appTheme,
                elevation: 0,
                borderBottomColor: 'transparent',
                borderBottomWidth: 0
            },
            headerRight: (

                <TouchableOpacity
                    onPress={params.onSend}
                    style={{ flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 10, alignItems: 'center' }}
                >
                    <MyIcon name="paperplane" color="#fff" size={30} />
                </TouchableOpacity>

            )
        }

    }
    constructor(props) {
        super(props);
        this.state = {
            isShowTime: false,
            isToggleDate: false,
            isToggleTimeFrom: false,
            isToggleTimeTo: false,
            userContact: props.user.fullName,
            phoneContact: props.user.phoneNumber
        };
        moment.locale(props.language)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.error && nextProps.error !== this.props.error) {
            if (nextProps.error.status === 200) {
                const backAction = NavigationActions.back({
                    key: this.props.navigationkey,
                });
                this.props.navigation.dispatch(backAction);
            }
        }
    }
    componentDidMount() {
        this.props.navigation.setParams({ onSend: this._onSend });
    }
    render() {
        const { time, day } = this.props
        const { isShowTime, userContact, phoneContact } = this.state
        const { fullName, phoneNumber } = this.props.user
        return (
            <View style={styles.container}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 20,

                    borderBottomWidth: 1,
                    borderBottomColor: colors.grayBorder
                }}>
                    <Text style={{ color: colors.blue }}>{Strings.createRequest.from.toLocaleUpperCase()}</Text>
                    <TextInput
                        style={{ flex: 1, marginLeft: 20, paddingHorizontal: 0, paddingVertical: 0 }}
                        placeholder={Strings.createRequest.placeholderSender}
                        placeholderTextColor="#9e9e9e"
                        value={userContact}
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => { this.setState({ userContact: text }) }}
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 20,

                    borderBottomWidth: 1,
                    borderBottomColor: colors.grayBorder
                }}>
                    <Text style={{ color: colors.blue }}>{Strings.createRequest.phone.toLocaleUpperCase()}</Text>
                    <TextInput

                        style={{ flex: 1, marginLeft: 20, paddingHorizontal: 0, paddingVertical: 0 }}
                        placeholder={Strings.createRequest.placeholderPhone}
                        placeholderTextColor="#9e9e9e"
                        value={phoneContact}
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => { this.setState({ phoneContact: text }) }}
                    />

                </View>
                {/* <View style={{

                    justifyContent: 'center',
     
                    paddingVertical: 20,

                    borderBottomWidth: 1,
                    borderBottomColor: colors.grayBorder
                }}>
                    <Text style={{ color: colors.blue }}>ĐỊA CHỈ</Text>
                    <TextInput
                        style={{ flex: 1, marginLeft: 20, paddingHorizontal: 0, paddingVertical: 0 }}
                        placeholder="Tên người gửi"
                        placeholderTextColor="#9e9e9e"
                        value={userContact}
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => { this.props.resetStateByKey({ key: 'userContact', path: '', value: text }); }}
                    />

                </View> */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.grayBorder
                }}>
                    <Text style={{ color: colors.blue }}>{Strings.createRequest.date.toLocaleUpperCase()}</Text>
                    <Switch
                        style={{ flex: 0, paddingHorizontal: 0, paddingVertical: 0 }}
                        value={this.state.isShowTime}
                        onValueChange={() => { this.setState({ isShowTime: !this.state.isShowTime }); }}
                    />
                </View>

                {isShowTime &&
                    <View>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingVertical: 20,
                                borderBottomWidth: 1,
                                borderBottomColor: colors.grayBorder
                            }}
                            onPress={() => { this.setState({ isToggleDate: true }); }}
                        >
                            <MyIcon
                                name="calendar"
                                size={20}
                            />
                            {this.props.language == 'en' ?
                                <Text
                                    style={{
                                        marginLeft: 20,
                                        fontSize: fontsize.larg,
                                        flex: 1,
                                    }}>{day ? moment(day).format('MMMM Do YYYY') : moment().format('MMMM Do YYYY')}</Text> :
                                <Text
                                    style={{
                                        marginLeft: 20,
                                        fontSize: fontsize.larg,
                                        flex: 1,
                                    }}>{day ? moment(day).format('[Ngày] DD [tháng] MM[,] YYYY') : moment().format('[Ngày] DD [tháng] MM[,] YYYY')}</Text>}

                            <DateTimePicker
                                cancelTextIOS={Strings.createRequest.cancel}
                                titleIOS={Strings.createRequest.titlePicker}
                                confirmTextIOS={Strings.createRequest.chose}
                                mode="date"
                                minimumDate={new Date()}
                                isVisible={this.state.isToggleDate}
                                onConfirm={(date) => {
                                    this.props.resetStateByKey({ key: 'day', path: '', value: date });
                                    this.setState({ isToggleDate: false });
                                }}
                                onCancel={() => { this.setState({ isToggleDate: false }); }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { this.setState({ isToggleTimeFrom: true }); }}
                            style={{ paddingVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
                            <MyIcon
                                name="clock"
                                size={20}
                            />
                            <Text style={{
                                marginLeft: 20,
                                fontSize: fontsize.larg,
                                flex: 1,
                            }}>{Strings.createRequest.at}    {time ? moment(time).format('HH:mm') : moment().format('HH:mm')}</Text>
                            <DateTimePicker
                                cancelTextIOS={Strings.app.cancel}
                                titleIOS={Strings.createRequest.at}
                                confirmTextIOS={Strings.app.chose}
                                mode="time"
                                isVisible={this.state.isToggleTimeFrom}
                                onConfirm={(time) => {
                                    this.props.resetStateByKey({ key: 'time', path: '', value: time });
                                    this.setState({ isToggleTimeFrom: false });
                                }}
                                onCancel={() => { this.setState({ isToggleTimeFrom: false }); }}
                            />
                        </TouchableOpacity>
                    </View>
                }
                <Spinner visible={this.props.isLoading} textContent={Strings.app.progress} textStyle={{ color: '#FFF', fontSize: fontsize.small }} />
            </View >
        );
    }
    _onSend = () => {
        // this.props.vendorSelected.id !== 0 ? this.props.navigation.navigate('requestCreateComplete') : null
        const { phoneContact, userContact } = this.state;
        const { vendorSelected, contractSelected, depSelected, title, content, time, day, imagesInformation } = this.props;
        this.props.createRequestHandle({
            vendorSelected,
            contractSelected,
            depSelected,
            title,
            content,
            time,
            day,
            userContact,
            phoneContact,
            imagesInformation
        })
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
});

const mapStateToProps = state => ({
    user: state.auth.user,
    userContact: state.requestCreate.userContact,
    phoneContact: state.requestCreate.phoneContact,
    time: state.requestCreate.time,
    day: state.requestCreate.day,
    vendorSelected: state.requestCreate.vendorSelected,
    depSelected: state.requestCreate.depSelected,
    contractSelected: state.requestCreate.contractSelected,
    title: state.requestCreate.title,
    content: state.requestCreate.content,
    imagesInformation: state.requestCreate.imagesInformation,
    error: state.requestCreate.error,
    isLoading: state.requestCreate.isLoading,
    navigationkey: state.request.navigationkey,
    language: state.app.language
})

//make this component available to the app
export default connect(mapStateToProps, { resetStateByKey, createRequestHandle })(CreateCompleteScreen);
