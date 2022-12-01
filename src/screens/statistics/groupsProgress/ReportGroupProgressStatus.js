//import liraries
import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    View
} from 'react-native';
import { connect } from 'react-redux';
import {
    loadDataGroupProgressStatus,
    statusSetProps,
    statusRefreshDataHandle
} from '../../../actions/reportGroupProgress';
import StackedBarChart from '../controls/StackedBarChart';
import fontsize from '../../../theme/fontsize';
import responsive from "../../../resources/responsive";
import Strings from "../../../utils/languages";
// create a component
class ReportGroupProgressStatus extends Component {
    componentDidMount() {
        this.loadDataHandle()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing) {
            this.loadDataHandle()
        }
    }
    componentWillUnmount() {
        this.props.setProps({ key: 'state' });
    }
    render() {
        console.log('2', this.props)
        const { data, isLoading, error, dataStatus } = this.props;
        if (isLoading) {
            return <ActivityIndicator color='blue' />
        }
        if (error && error.hasError) {
            return (
                <TouchableOpacity
                    onPress={() => { this.props.refreshDataHandle() }}
                >
                    <Text style={{ textAlign: 'center', fontSize: fontsize.small, padding: responsive.h(10) }}>{Strings.app.error}</Text>
                </TouchableOpacity>
            )
        }
        if (data.length == 0) {
            return (
                <TouchableOpacity onPress={() => { this.props.refreshDataHandle() }}>
                    <Text style={{ textAlign: 'center', fontSize: fontsize.small, padding: responsive.h(10) }}>{Strings.app.emptyData}</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <View>
                    <StackedBarChart dataStatus={this.props.dataStatus} dataStackX={this.getDataStackBarX(this.props.data)} dataStackY={this.getDataStackBarY(this.props.data)} />
                </View>
            )
        }
    }
    loadDataHandle() {
        const { loadDataGroupProgressStatus, towerId, dateFrom, dateTo } = this.props;
        loadDataGroupProgressStatus({
            towerId,
            dateFrom,
            dateTo,
            langId: this.props.langId
        });
    }
    getDataStackBarX(data) {
        return data.map(o => o.name)
    }
    getDataStackBarY(data) {
        return data.map(a => ({ y: a.statuses.map(y => y.value), marker: a.statuses.map(m => m.value) }))
    }
}

// define your styles


//make this component available to the app
const mapStateToProps = (state) => ({
    data: state.reportGroupProgressStatus.data,
    isLoading: state.reportGroupProgressStatus.isLoading,
    isRefreshing: state.reportGroupProgressStatus.isRefreshing,
    error: state.reportGroupProgressStatus.error,
    initComponent: state.reportGroupProgressStatus.initComponent,
    towerId: state.auth.user.towerId,
    langId: state.app.language == "vi" ? 1 : 2,
})

const mapActionToProps = {
    setProps: statusSetProps,
    refreshDataHandle: statusRefreshDataHandle,
    loadDataGroupProgressStatus
}
export default connect(mapStateToProps, mapActionToProps)(ReportGroupProgressStatus);
