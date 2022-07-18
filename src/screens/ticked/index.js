import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '../../components/common/NavBar';
import IconButton from '../../components/common/IconButton';
import { titleStyle } from '../../theme/styles'
import { Screen } from '../../utils/device'
import colors from '../../theme/colors';
import fontsize from '../../theme/fontsize';
import { MyIcon } from '../../theme/icons';
import Strings from '../../utils/languages';

import {
    loadDataHandle,
    setProps
} from '../../actions/home'
import ErrorContent from '../../components/common/ErrorContent';
import ImageProgress from '../../components/common/ImageProgress';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {

            menus: [
                {
                    id: 1,
                    name: 'ca trực',
                    icon: 'calendar-clock'
                },
                {
                    id: 2,
                    name: 'công việc',
                    icon: 'clock'
                },
                {
                    id: 3,
                    name: 'checklist',
                    icon: 'clipboard-check-outline'
                },
                {
                    id: 4,
                    name: 'phiếu đề xuất',
                    icon: 'message-settings-variant'
                },
                {
                    id: 5,
                    name: 'kiểm tra định kỳ',
                    icon: 'settings-box'
                },
                {
                    id: 6,
                    name: 'thông báo',
                    icon: 'volume-low'
                }
            ]
        };
    }
    componentDidMount() {
        this.props.loadDataHandle()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isRefreshing && nextProps.isRefreshing !== this.props.isRefreshing) {
            this.props.loadDataHandle();
        }
    }
    componentWillUnmount() {
        // this.props.setProps({ key: 'state' });
    }
    renderContent = () => {
        const { emptyData, error, data, isRefreshing, isLoading } = this.props;
        if (isLoading && !isRefreshing) {
            return (<View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator />
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
                refreshing={isRefreshing}
                onRefresh={() => this.props.setProps({ isRefreshing: true, data: [] })}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
                data={data || []}
                renderItem={this.renderItem}
            // canNavigate={this.props.canNavigate}
            // navigation={this.props.navigation}
            />
        );
    }
    renderItemMenu = ({ item, index }) => {
        const { id, name, icon } = item
        const size = Screen.width / 3
        return (
            <TouchableOpacity style={{
                width: size,
                flex: 1,
                height: Screen.width / 4,
                padding: 2.5
            }}
                onPress={() => {
                    switch (id) {
                        case 2: {
                            return this.props.navigation.navigate('wordList')
                        }
                        case 3: {
                            return this.props.navigation.navigate('checklist')
                        }
                        default: break
                    }
                }}
            >
                <View style={{
                    flex: 1,
                    borderColor: colors.grayBorder,
                    borderWidth: 1,
                }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name={icon} size={40} color={colors.appTheme} />
                    </View>
                    <View style={{ width: '100%', height: 20, backgroundColor: colors.grayBorder, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: fontsize.micro }}>{name.toLocaleUpperCase()}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    renderItem = ({ item, index }) => {
        const {
            id,
            title,
            system,
            imageUrl,
            employeeName,
            status,
            dateAction,
            typeId,
        } = item
        return (
            <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => { }}
            >
                <View
                    style={{
                        flex: 1,
                        padding: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#fff'
                    }}
                >

                    <ImageProgress
                        circle={true}
                        style={{
                            height: 60,
                            width: 60
                        }}

                        source={{ uri: imageUrl }}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between', marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: fontsize.larg, fontWeight: 'bold' }} numberOfLines={2}>{title}</Text>
                                <Text style={{ fontWeight: 'bold' }}>{employeeName}</Text>
                            </View>
                            <View>
                                <Text style={{ color: colors.gray1 }} numberOfLines={2} lineBreakMode="tail">{moment(dateAction).format('[lúc] HH:mm')}</Text>
                                <Text style={{ color: colors.gray1, alignSelf: 'flex-end' }} numberOfLines={2} lineBreakMode="tail">{moment(dateAction).format('DD/MM')}</Text>
                            </View>
                        </View>
                        <Text style={{ marginVertical: 5 }} numberOfLines={2} lineBreakMode="tail">{system}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    render() {

        const { menus } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>

                <NavBar
                    leftButton={<IconButton materialIcon="arrow-left" size={30}
                        onPress={() => this.props.navigation.navigate('DrawerOpen')}
                        color="#fff" />}
                    body={<Text style={titleStyle}>PHIẾU ĐỀ XUẤT</Text>}

                />
                <View style={{ flex: 1 }}>


                    {this.renderContent()}

                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    emptyData: state.home.emptyData,
    isLoading: state.home.isLoading,
    data: state.home.data,
    error: state.home.error,
    isRefreshing: state.home.isRefreshing,

    canNavigate: true,//state.requestDetail.data == null,
    language: state.app.language,

});

const mapActionToState = {
    loadDataHandle,
    setProps
};
export default connect(mapStateToProps, mapActionToState)(HomeScreen)
