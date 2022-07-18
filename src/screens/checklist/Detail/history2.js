//import liraries
import React, { Component } from 'react';
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
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

import Spinner from 'react-native-loading-spinner-overlay';
import Toast, { DURATION } from 'react-native-easy-toast';
import { updatePropertyHandle } from '../../../actions/checklistDetail';
import ErrorContent from '../../../components/common/ErrorContent';
import fontsize from '../../../theme/fontsize';
import colors from '../../../theme/colors';
import { MyIcon } from '../../../theme/icons';
import Strings from '../../../utils/languages';
import NavBar from '../../../components/common/NavBar';
import ListPropertyItem from '../../../components/Checklist/Detail/ListPropertyItem';

const Devices = require('react-native-device-detection');
import Timeline from 'react-native-timeline-flatlist';
import moment from 'moment';

const initState = {
    description: '',
    valueInput: null,
    action:{
        id: 0,
        name: ''
    }
}
// create a component
class historyScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            //itemfromList: props.navigation.state.params,
            isShowModal: false,
            isShowModalItem: false,
            isShowModalProposal: false,
            showAction: false,
            description: '',
            note: '',
            moduleId: 0,
            dateComponent: null,
            images: [],
            itemSelected: null,
            dataSelect: [],
            valueInput: null,
            action:{
                id: 0,
                name: ''
            },
            property:{
                id: 0,
                name: ''
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.errorUpdate && nextProps.errorUpdate !== this.props.errorUpdate) {
            if (nextProps.errorUpdate.hasError) {
                this.refs.toast.show(`Xảy ra lỗi`, DURATION.LENGTH_LONG);
            } else {
                this.refs.toast.show(`Thao tác thành công`, DURATION.LENGTH_LONG);
            }
        }

    }

    componentDidMount() {
        const { user } = this.props
    }

    renderDetail(rowData, sectionID, rowID) {
        let time = this.props.language == 'en' ? moment(rowData.dateCreate).format('HH:mm - MMMM Do YYYY') : moment(rowData.dateCreate).format('HH:mm - DD [tháng] MM, YYYY')

        let title = rowID == '0' ?
            (<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><Text style={styles.infoTextHistory}>{time}</Text>
                <TouchableOpacity
                    style={{ padding: 4, flex: 1, alignItems: 'flex-end' }}
                    onPress={() => {
                        this.setState({ showPopupHistory: true }
                        ); ((rowData.description !== null && rowData.description !== undefined && rowData.description.length > 0) ? this.setState({ isUpdate: true }) : this.setState({ isUpdate: false }))
                    }}>
                </TouchableOpacity>
            </View>)
            : (<Text style={styles.infoTextHistory}>{time}</Text>);
        let desc = null
        if (rowData.description !== null && rowData.description !== undefined && rowData.description.length > 0) {
            desc = (
                <View style={{ alignContent: 'space-between', paddingRight: 5, paddingTop: 10}}>
                    <Text style={{fontFamily: "Inter-Regular",
                        fontSize: 13,
                        letterSpacing: 0,
                        textAlign: "left",
                        color: "#3d3d3d"}}>
                        {rowData.description}
                    </Text>
                </View>)

        }
        let info = null
        if (rowData.status !== null && rowData.status !== undefined && rowData.status.length > 0) {
            info = (
                <View style={{ paddingTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                            borderRadius: 16,
                            backgroundColor: "#fff5eb", paddingVertical: 5, paddingHorizontal: 20, flexDirection: 'row'
                        }}>
                            <Text style={{
                                fontFamily: "Inter-Regular",
                                fontSize: 12,
                                textAlign: "center",
                                color: "#ff3d00"
                            }}>
                                {rowData.status}
                            </Text>

                        </View>
                        <Text style={{
                            fontFamily: "Inter-Medium",
                            fontSize: 12,
                            textAlign: "center",
                            color: "#282828"
                        }}>
                            - {rowData.employeeName}
                        </Text>

                    </View>
                </View>
            )
        }
        
        return (
            <View style={{ flex: 1, paddingTop: 0 }}>
                <View style={{ marginTop: -5, marginBottom: 10 }}>
                    <TouchableOpacity>
                        {title}
                        {info}
                        {desc}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderContent() {
        const { error, towerId, data, isLoading } = this.props;
        const { showAction } = this.state
        //console.log(data);

        if (isLoading) {
            return (<View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator animating size="small" />
            </View>)
        }

        if (error && error.hasError) {
            return (
                <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.refreshDataHandle()} />
            )
        }
        if (data) {
            const {
                histories
            } = data;

            return (

                <View style={{ flex: 1 }}> 
                    <Timeline
                    separator={false}
                    circleSize={18}
                    circleColor='#a3cd80'
                    lineColor='#a3cd80'
                    timeContainerStyle={{ maxWidth: 0, minWidth: 0 }}
                    descriptionStyle={{ color: 'red', fontSize: 12 }}
                    titleStyle={{ fontSize: 12 }}
                    options={{
                        style: { paddingTop: 5, marginTop: 20 }
                    }}
                    lineWidth={1}
                    enableEmptySections={true}
                    keyExtractor={(item, index) => index}
                    renderDetail={this.renderDetail.bind(this)}
                    data={histories}
                />

                    <Spinner visible={this.props.isLoadingReponse} textContent={Strings.app.progressing} textStyle={{ color: '#FFF', fontSize: fontsize.small }} />
                </View >
            )
        }

    }

    render() {
        const { data } = this.props
        const { showAction, action, itemSelected, valueInput, property } = this.state;
        const leftButton = (
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => this.props.navigation.goBack(null)}
            >
                <MyIcon
                    name="arrow"
                    size={20}
                    color="#fff"
                />
            </TouchableOpacity>
        )
        return (
            <View style={styles.container}>
                
                {this.renderContent()}
                    
                <Toast ref="toast" style={{ backgroundColor: this.props.errorUpdate ? this.props.errorUpdate.hasError ? colors.toast.warning : colors.toast.success : colors.toast.warning }} />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    imageActive: {
        flex: 1,
        resizeMode: "contain"
    },
    infoTextHistory: {
        flex: 2,
        borderBottomWidth: 0,
        fontFamily: "Inter-Regular",
        fontSize: 11,
        textAlign: "left",
        color: "#6f6f6f"
    },

});
const mapStateToProps = state => ({
    user: state.auth.user,
    initList: state.checklistDetail.initList,
    data: state.checklistDetail.data,
    isLoading: state.checklistDetail.isLoading,
    error: state.checklistDetail.error,
    errorUpdate: state.checklistDetail.errorUpdate
})

const mapActionToProps = {
    updatePropertyHandle
}

//make this component available to the app
export default connect(mapStateToProps, mapActionToProps)(historyScreen);
