import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import {
    ActivityIndicator,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Modal,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import AxisLineChartScreen from '../controls/LineStatistics';

import DateTimePicker from 'react-native-modal-datetime-picker';
import NavBar from '../../../components/common/NavBar';
import { MyIcon } from '../../../theme/icons';
import fontSize from '../../../theme/fontsize';
import colors from '../../../theme/colors';
import PrimaryButton from '../../../components/common/PrimaryButton';
import ModalPicker from '../../../components/common/ModalPicker';
import PieSurvey from '../controls/PieSurvey';
import FilterType from '../../../components/statistics/FilterType';
import ButtonFilter from '../../../components/statistics/ButtonFilter';
import fontsize from '../../../theme/fontsize';
import Icon from 'react-native-vector-icons/Entypo'
import { Screen } from '../../../utils/device';
import ErrorContent from '../../../components/common/ErrorContent';
//
import { loadDataHandle, resetStateByKey, refreshDataHandle } from '../../../actions/reportSurvey';

class SurveyChartScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemSelect: null,
            showAnswerText: false
        };
    }
    componentDidMount() {
        this.props.resetStateByKey({ key: 'initList', path: '', value: true });
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing) {
            const data = {
                idSurvey: this.props.navigation.state.params.id
            };
            await this.props.loadDataHandle(data);

        }
        if (nextProps.initList && nextProps.initList !== this.props.initList) {
            const data = {
                idSurvey: this.props.navigation.state.params.id
            };
            await this.props.loadDataHandle(data);
        }
    }
    componentWillUnmount() {
        this.props.resetStateByKey({ key: 'state' });
    }
    _renderContent() {
        const { emptyData, error, initList, data, isRefreshing, outOfStock, refreshDataHandle, loadDataHandle, isLoading } = this.props;
        if (initList) {
            return (
                <View
                    style={{
                        paddingVertical: 20,
                    }}
                >
                    <ActivityIndicator animating size="small" />
                </View>
            )
        }
        if (emptyData) {
            return <ErrorContent title="Không có dữ liệu" onTouchScreen={() => this.props.refreshDataHandle()} />
        }
        if (error && error.hasError) {
            return (
                <ErrorContent title="Lỗi kết nối" onTouchScreen={() => this.props.refreshDataHandle()} />
            )
        }
        return (
            <FlatList
                keyExtractor={(item, index) => `${index}`}
                refreshing={isRefreshing}
                onRefresh={() => this.props.refreshDataHandle()}
                data={data}
                renderItem={this.renderItem}
                onEndReachedThreshold={0.5}
                style={{ paddingHorizontal: 10, marginBottom: 20 }}
            />
        );
    }
    renderItem = ({ item }) => {
        return (
            <View
                style={{
                    marginBottom: 10, borderRadius: 12,
                    backgroundColor: "#ffffff",
                    shadowColor: "rgba(0, 0, 0, 0.1)",
                    elevation: 2,
                    shadowOffset: {
                        width: 0,
                        height: 4
                    },
                    shadowRadius: 10,
                    shadowOpacity: 1,
                    marginHorizontal: 10,
                    padding: 10
                }}
            >
                <Text lineBreakMode="tail" numberOfLines={2} style={{
                    flexDirection: 'row', flex: 1, width: (Screen.width) - 60,
                    fontFamily: "Inter-SemiBold",
                    fontSize: 16,
                    fontWeight: "600",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#282828"
                }}>{item.questionName}</Text>
                {item.answerType == 1 ?
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}
                        onPress={async () => item.listAnswer && item.listAnswer.length > 0 ? this.setState({ itemSelect: item, showAnswerText: true }) : null}
                    >
                        <Text style={{ flex: 1, fontStyle: 'italic', marginTop: 5 }}>
                            {item && item.listAnswer && item.listAnswer.length > 0 ? 'Chọn để xem chi tiết' : 'Chưa có dữ liệu'}
                        </Text>

                    </TouchableOpacity>
                    :
                    <View>
                        {item && item.listAnswer && item.listAnswer.length > 0 ? <PieSurvey dataX={item.listAnswer.map(o => ({ value: o.count, label: o.answerName })).filter(e => e.count !== 0)} /> :
                            <Text style={{ flex: 1, fontStyle: 'italic', marginTop: 5 }}>'Chưa có dữ liệu'</Text>
                        }
                    </View>

                }
            </View>
        )
    }
    renderItemAnswer = ({ item }) => {
        return (
            <View
                style={{
                    marginBottom: 10, borderRadius: 12,
                    backgroundColor: "#ffffff",
                    shadowColor: "rgba(0, 0, 0, 0.1)",
                    elevation: 2,
                    shadowOffset: {
                        width: 0,
                        height: 4
                    },
                    shadowRadius: 10,
                    shadowOpacity: 1,
                    marginHorizontal: 10,
                    padding: 10
                }}
            >
                <Text style={{
                    flex: 1, width: (Screen.width) - 60,
                    fontFamily: "Inter-Medium",
                    fontSize: 16,
                    textAlign: "left",
                    color: "#282828"
                }}>{item.answerName}</Text>

            </View>
        )


    }
    render() {

        return (
            <View style={{ flex: 1 }}>
                <NavBar
                    leftButton={<TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={() => this.props.navigation.goBack(null)}
                    >
                        <MyIcon
                            name="arrow"
                            size={20}
                            color="#fff"
                        />
                    </TouchableOpacity>}
                    body={<Text style={{
                        fontFamily: "Inter-Bold",
                        fontSize: 18,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#ffffff"
                    }}>Danh sách câu hỏi chi tiết</Text>}
                    rightView={<TouchableOpacity
                        style={{ padding: 10 }}
                    >
                        <MyIcon
                            name="arrow"
                            size={20}
                            color={colors.appTheme}
                        />
                    </TouchableOpacity>}
                />
                {this._renderContent()}
                <Modal
                    visible={this.state.showAnswerText}
                    onRequestClose={() => { }}
                    transparent={true}
                >
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.appOverView }}>

                        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#fff', marginVertical: 60, marginHorizontal: 20, borderRadius: 10 }}>

                            <View style={{ width: (Screen.width) - 40, height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appTheme, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ showAnswerText: false })}
                                    style={{ position: 'absolute', top: 0, right: 0 }} >
                                    <MyIcon
                                        name="delete"
                                        size={30}
                                        color='#ffffff80'
                                        style={{ margin: 5 }}
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, fontWeight: "600", color: "#fff" }}>
                                    Danh sách câu trả lời
                                </Text>
                            </View>
                            <FlatList
                                keyExtractor={(item, index) => `${index}`}
                                data={this.state.itemSelect ? this.state.itemSelect.listAnswer : []}
                                renderItem={this.renderItemAnswer}
                                onEndReachedThreshold={0.5}
                                style={{ paddingHorizontal: 10, marginVertical: 10 }}
                            />
                        </View>
                    </View>
                </Modal>
            </View>

        )
    }
}
const mapStateToProps = (state) => ({
    user: state.auth.user,
    towerId: state.auth.user ? state.auth.user.towerId : 0,
    data: state.reportSurvey.data,
    isLoading: state.reportSurvey.isLoading,
    error: state.reportSurvey.error,
    emptyData: state.reportSurvey.emptyData,
    initList: state.reportSurvey.initList,
    isRefreshing: state.reportSurvey.isRefreshing,
})
const mapActionToProps = {
    loadDataHandle,
    resetStateByKey,
    refreshDataHandle
}
export default connect(mapStateToProps, mapActionToProps)(SurveyChartScreen);