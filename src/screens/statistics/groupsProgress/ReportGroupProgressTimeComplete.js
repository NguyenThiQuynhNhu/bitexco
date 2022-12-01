//import liraries
import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import {
    loadDataGroupProgressTimeComplete,
    timeRefreshDataHandle,
    timeSetProps
} from '../../../actions/reportGroupProgress';
import BarChart from '../controls/BarChart';
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
        const { data, isLoading, error } = this.props;
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
            return (<BarChart dataX={this.getDataStackBarX(this.props.data)} dataY={this.getDataStackBarY(this.props.data)} />)
        }
    }
    loadDataHandle() {
        const { loadDataGroupProgressTimeComplete, towerId, dateFrom, dateTo } = this.props;
        loadDataGroupProgressTimeComplete({
            towerId,
            dateFrom,
            dateTo
        });
    }
    getDataStackBarX(data) {
        return data.map(o => o.name)
    }
    getDataStackBarY(data) {
        return data.map(a => ({ y: a.value }))
    }
}

// define your styles


//make this component available to the app
const mapStateToProps = (state) => ({
    data: state.reportGroupProgressTimeComplete.data,
    isLoading: state.reportGroupProgressTimeComplete.isLoading,
    isRefreshing: state.reportGroupProgressTimeComplete.isRefreshing,
    error: state.reportGroupProgressTimeComplete.error,
    initComponent: state.reportGroupProgressTimeComplete.initComponent,
    towerId: state.auth.user.towerId,

})

const mapActionToProps = {
    setProps: timeSetProps,
    refreshDataHandle: timeRefreshDataHandle,
    loadDataGroupProgressTimeComplete
}
export default connect(mapStateToProps, mapActionToProps)(ReportGroupProgressStatus);
