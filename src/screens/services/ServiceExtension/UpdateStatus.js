//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { connect } from 'react-redux';
import { MyIcon } from '../../../theme/icons';
import NavBar from '../../../components/common/NavBar';
import Strings from '../../../utils/languages'
import Lookup from '../../../components/Request/RequestCreate/Lookup';
import fontsize from '../../../theme/fontsize';
import colors from '../../../theme/colors';
import { updateRequestHandle } from '../../../actions/servicesExtensionDetail';



// create a component
class RequestUpdateStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            day: moment().format('DD/MM/YYYY'),
            time: moment().format('HH:mm'),
            isToggleDate: false,
            showModalLevel: false,
            statuspSelected: {
                id: 0
            },
            content: '',
            reason: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.errorResponse && nextProps.errorResponse !== this.props.errorResponse) {
            if (nextProps.errorResponse.hasError) {
                // this.refs.toast.show(`Xảy ra lỗi  ${nextProps.errorResponse.statusText}`, DURATION.LENGTH_LONG);
            } else {
                this.props.navigation.goBack()
                // this.refs.toast.show('Xử lý thành công', DURATION.LENGTH_LONG);
            }
        }
    }
    renderContent() {
        const { user } = this.props
        const {
            statuspSelected,
            content,
            day,
            time,
            reason } = this.state
        return (

            <View style={{
                flex: 1, paddingHorizontal: 20
            }}>

                <Lookup
                    fielName={`Trạng thái (*)`}
                    text={statuspSelected.id != 0 ? statuspSelected.name : Strings.createRequest.placeholderStatus}
                    onPress={() => this.props.navigation.navigate('statusDictionary', { id: user.towerId, onSelected: (statuspSelected) => this.setState({ statuspSelected }) })}
                />
                <View style={{
                    borderColor: colors.grayBorder,
                    borderBottomWidth: 1,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Text style={{
                            fontFamily: "Inter-SemiBold",
                            fontSize: 16,
                            fontWeight: "600",
                            textAlign: "left",
                            color: "#282828"
                        }}>{Strings.createRequest.content}</Text>

                        <Text style={{
                            fontFamily: "Inter-Regular",
                            fontSize: 10,
                            textAlign: "left",
                            color: "#6f6f6f"
                        }}>{content.length}/3000</Text>
                    </View>
                    <View style={{
                        marginTop: 10
                    }}>
                        <TextInput
                            maxLength={3000}
                            underline={false}
                            multiline
                            underlineColorAndroid='transparent'
                            style={{
                                backgroundColor: '#fff',
                                height: 120,
                                textAlignVertical: 'top',
                                borderRadius: 8,
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderColor: "#cbcbcb",
                                padding: 10
                            }}
                            placeholder={Strings.createRequest.placeholderContent}
                            placeholderTextColor="#9e9e9e"
                            value={this.props.content}
                            onChangeText={(content) => this.setState({ content })}

                        />

                    </View>
                </View>



                {/* <Spinner visible={this.props.isLoadingReponse} textContent={Strings.app.progressing} textStyle={{ color: '#FFF', fontSize: fontsize.small }} /> */}
                {/* <ActionSheet visible={showAction} data={methodProcess} renderItem={this.renderActionSheetItem} /> */}
            </View >

        )

    }

    render() {

        const {
            reason,
            content,
            statuspSelected } = this.state
        const leftButton = (
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => this.props.navigation.goBack()}
            >
                <MyIcon
                    name="arrow"
                    size={20}
                    color="#fff"
                />
            </TouchableOpacity>
        )
        const rightButton = (
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={this._onRequest}
            >
                <MyIcon
                    name="paperplane"
                    size={24}
                    color="#fff"
                />
            </TouchableOpacity>
        )

        return (

            <View style={styles.container}>
                <NavBar leftButton={leftButton} body={<Text style={{
                    fontFamily: "Inter-Bold",
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#ffffff"
                }}>Đổi trạng thái yêu cầu</Text>} rightView={rightButton} />
                {this.renderContent()}
                <Toast ref="toast" style={{ backgroundColor: colors.toast.warning }} />
            </View>
        );
    }
    _onRequest = () => {
        const { id, employeeName, serviceName } = this.props.data;
        const { statuspSelected, content, reason } = this.state
        if (statuspSelected.id == 0) {
            return this.refs.toast.show(`Vui lòng chọn trạng thái mới`, DURATION.LENGTH_LONG);
        }
        return this.props.updateRequestHandle({
            bookingId: id,
            statusId: statuspSelected.id,
            description: content,
            towerName: this.props.user.towerName,
            employeeName,
            serviceName
        })
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

const mapStateToProps = state => ({
    user: state.auth.user,
    data: state.servicesExtensionDetail.data.seviceBasic,
    isLoading: state.servicesExtensionDetail.isLoading,
    errorResponse: state.servicesExtensionDetail.errorResponse,
    error: state.servicesExtensionDetail.error,
    language: state.app.language
})

const mapActionToProps = {
    updateRequestHandle
}

//make this component available to the app
export default connect(mapStateToProps, mapActionToProps)(RequestUpdateStatus);
