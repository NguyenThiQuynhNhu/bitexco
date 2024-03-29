//import liraries
import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import {
    loadDataGroupProgressRating,
    ratingSetProps,
    ratingRefreshDataHandle
} from '../../../actions/reportGroupProgress';
import BarChart from '../controls/BarChart';
import fontsize from '../../../theme/fontsize';
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
                    <Text style={{ textAlign: 'center', fontSize: fontsize.small, padding: 10 }}>Có lỗi xảy ra</Text>
                </TouchableOpacity>
            )
        }
        if (data.length == 0) {
            return (
                <TouchableOpacity onPress={() => { this.props.refreshDataHandle() }}>
                    <Text style={{ textAlign: 'center', fontSize: fontsize.small, padding: 10 }}>Không có dữ liệu</Text>
                </TouchableOpacity>
            )
        } else {
            return (<BarChart dataX={this.getDataStackBarX(this.props.data)} dataY={this.getDataStackBarY(this.props.data)} />)
        }
    }
    loadDataHandle() {
        const { loadDataGroupProgressRating, towerId, dateFrom, dateTo } = this.props;
        loadDataGroupProgressRating({
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
    data: state.reportGroupProgressRating.data,
    isLoading: state.reportGroupProgressRating.isLoading,
    isRefreshing: state.reportGroupProgressRating.isRefreshing,
    error: state.reportGroupProgressRating.error,
    initComponent: state.reportGroupProgressRating.initComponent,
    towerId: state.auth.user.towerId,

})

const mapActionToProps = {
    loadDataGroupProgressRating,
    setProps: ratingSetProps,
    refreshDataHandle: ratingRefreshDataHandle
}
export default connect(mapStateToProps, mapActionToProps)(ReportGroupProgressStatus);
