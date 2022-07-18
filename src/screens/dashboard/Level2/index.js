import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import NavBar from '../../../components/common/NavBar';
import { titleStyle } from '../../../theme/styles'
import colors from '../../../theme/colors';
import fontsize from '../../../theme/fontsize';
import Strings from '../../../utils/languages';

import { MyIcon } from '../../../theme/icons';
//style
import fontSize from '../../../theme/fontsize';

import ImageProgress from '../../../components/common/ImageProgress';
import _ from 'lodash';

import {
    loadDataHandle,
    setProps
} from '../../../actions/dashboardLevel2'
import ErrorContent from '../../../components/common/ErrorContent';

class DashboardLevel2Screen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: props.navigation.state.params.startDate,
            endDate: props.navigation.state.params.endDate,
            towerId: props.navigation.state.params.towerId
        };
    }

    componentDidMount() {
        const request = {
            towerId: this.state.towerId,
            dateFrom: moment(this.state.startDate).format('DD/MM/YYYY'),
            dateTo: moment(this.state.endDate).format('DD/MM/YYYY')
        }
        this.props.loadDataHandle(request);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing) {
            const request = {
                towerId: this.state.towerId,
                dateFrom: moment(this.state.startDate).format('DD/MM/YYYY'),
                dateTo: moment(this.state.endDate).format('DD/MM/YYYY')
            }
            this.props.loadDataHandle(request);
        }
    }

    componentWillUnmount() {
        this.props.setProps({ key: 'state' });
    }
    
    renderContent = () => {
        const { emptyData, error, data, isRefreshing, isLoading } = this.props;
        if (isLoading && !isRefreshing) {
            return (<View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator  color={colors.appTheme}/>
            </View>)
        }
        if (error && error.hasError) {
            return (
                <ErrorContent title={Strings.app.error} onTouchScreen={() => this.props.setProps({ isRefreshing: true, data: [] })} />
            )
        }
        if (emptyData) {
            return <ErrorContent title={Strings.app.emptyData} onTouchScreen={() => this.props.setProps({ isRefreshing: true, data: [] })} />
        }

        return (
            <FlatList
                ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: colors.grayBorder }} />}
                data={data || []}
                renderItem={this.renderItem}
                numColumns={ 1 }
            />
        );
    }

    renderItem = ({ item }) => {
        const { name } = item
        const size = '100%'

        const { startDate, endDate } = this.state

        return (
            <TouchableOpacity style={{
                width: size,
                flex: 1,
                padding: 10,
                paddingVertical: 20, 
                borderLeftWidth: 5,
                borderLeftColor: item.amount > 0 ? 'red' : '#fff'
            }}
                onPress={() => {
                    return this.props.navigation.navigate('dashboardChecklist', { startDate, endDate, towerId: this.props.navigation.state.params.towerId, towerName: this.props.navigation.state.params.towerName, systemId: item.id, systemName: item.name, towerImageUrl: this.props.navigation.state.params.towerImageUrl })
                }}
            >
                <View style={{ width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: Platform.isPad ? fontsize.medium : fontsize.micro, fontWeight: 'bold' }}>{name.toLocaleUpperCase()}</Text>

                        { item.amount > 0 ? <Text style={{ fontSize: Platform.isPad ? fontsize.medium : fontsize.micro, fontWeight: 'bold', color: 'red',  }}>{ item.amount }</Text>
                    : null}
                    </View>
            </TouchableOpacity>
        )
    }

    render() {

        
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>

                <NavBar
                    leftButton={<TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <MyIcon
                            name="arrow"
                            size={22}
                            color="#fff"
                        />
                    </TouchableOpacity>}
                    body={<Text style={titleStyle}>{this.props.user.towerName.toLocaleUpperCase()}</Text>}

                    rightView={<View style={{paddingRight: 5,
                        paddingTop: 5}}>
                            <ImageProgress
                            style={{
                                height: 30,
                                width: 30,
                            }}
                            circle={true}
                            resizeMode="stretch"
                            source={{ uri: this.props.navigation.state.params.towerImageUrl }}
                    /></View>}
                />
                <View style={{ flexDirection: 'row', padding: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: colors.grayBorder, }}>
                        <Text style={{ fontSize: fontSize.medium, color: '#111' }}>Kỳ báo cáo: {moment(this.props.navigation.state.params.startDate).format('DD-MM-YYYY')} - </Text>

                        <Text style={{ fontSize: fontSize.medium, color: '#111' }}>{moment(this.props.navigation.state.params.endDate).format('DD-MM-YYYY')}</Text>
                    </View>

                <View style={{ flex: 1 }}>
                        {this.renderContent()}
                </View>

            </View>
        );
    }

    refreshDataHandle(){
        const request = {
            towerId: this.props.user.towerId,
            dateFrom: moment(this.state.startDate).format('DD/MM/YYYY'),
            dateTo: moment(this.state.endDate).format('DD/MM/YYYY')
        }
        this.props.loadDataHandle(request);
    }
}

const mapStateToProps = (state) => ({
    emptyData: state.dashboardLevel2.emptyData,
    isLoading: state.dashboardLevel2.isLoading,
    data: state.dashboardLevel2.data,
    error: state.dashboardLevel2.error,
    isRefreshing: state.dashboardLevel2.isRefreshing,
    user: state.auth.user,
    canNavigate: true,
    language: state.app.language,
});

const mapActionToState = {
    loadDataHandle,
    setProps
};
export default connect(mapStateToProps, mapActionToState)(DashboardLevel2Screen)
