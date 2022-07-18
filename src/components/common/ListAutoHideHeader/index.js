
import React, { Component } from 'react';
import { ActivityIndicator, RefreshControl, TextInput, Animated, Image, ImageBackground, Platform, StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

import ErrorContent from '../ErrorContent';
import { MyIcon } from '../../../theme/icons';
import colors from '../../../theme/colors';
import fontSize from '../../../theme/fontsize';
import Device from '../../../utils/device';


const NAVBAR_HEIGHT = Device.select({ ipX: 88, ios: 64, android: 56 });;
const STATUS_BAR_HEIGHT = Device.select({ ipX: 44, ios: 20, android: 0 });

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);



export default class ListAutoHideHeader extends Component {

    constructor(props) {
        super(props);
        const scrollAnim = new Animated.Value(0);
        const offsetAnim = new Animated.Value(0);

        this.state = {
            scrollAnim,
            offsetAnim,
            clampedScroll: Animated.diffClamp(
                Animated.add(
                    scrollAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                        extrapolateLeft: 'clamp',
                    }),
                    offsetAnim,
                ),
                0,
                NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
            ),
        };
    }

    _clampedScrollValue = 0;
    _offsetValue = 0;
    _scrollValue = 0;

    componentDidMount() {
        this.state.scrollAnim.addListener(({ value }) => {
            const diff = value - this._scrollValue;
            this._scrollValue = value;
            this._clampedScrollValue = Math.min(
                Math.max(this._clampedScrollValue + diff, 0),
                NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
            );
        });
        this.state.offsetAnim.addListener(({ value }) => {
            this._offsetValue = value;
        });
    }

    componentWillUnmount() {
        this.state.scrollAnim.removeAllListeners();
        this.state.offsetAnim.removeAllListeners();
    }

    _onScrollEndDrag = () => {
        this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
    };

    _onMomentumScrollBegin = () => {
        clearTimeout(this._scrollEndTimer);
    };

    _onMomentumScrollEnd = () => {
        const toValue = this._scrollValue > NAVBAR_HEIGHT &&
            this._clampedScrollValue > (NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
            ? this._offsetValue + NAVBAR_HEIGHT
            : this._offsetValue - NAVBAR_HEIGHT;

        Animated.timing(this.state.offsetAnim, {
            toValue,
            duration: 350,
            useNativeDriver: true,
        }).start();
    };

    _keyExtractor = (item, index) => `${item.id}`;

    _header = (navbarOpacity) => {
        return (
            <Animated.View style={[
                {
                    alignItems: 'center',
                    borderRadius: 5,
                    marginBottom: 10,
                    marginTop: Platform.OS == 'ios' ? 0 : 10,
                    marginHorizontal: 10,
                    flex: 1,
                    backgroundColor: colors.blueTextInput,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }, { opacity: navbarOpacity }]}>

                <MyIcon
                    name="search"
                    size={30}
                    color="#7A95CF"
                    style={{ margin: 10 }}
                />

                <TextInput
                    placeholderTextColor="#BFCBCB"
                    placeholder="Tìm kiếm"
                    underlineColorAndroid="transparent"
                    autoCorrect={false}
                    style={{
                        color: '#fff',
                        flex: 1,
                        paddingVertical: 0,
                        justifyContent: 'flex-start'
                    }}
                />
                <TouchableOpacity >
                    <MyIcon
                        name="cancel-circle"
                        size={20}
                        color="#7A95CF"
                        style={{ margin: 10 }}
                    />
                </TouchableOpacity>
            </Animated.View>
        )
    }
    _renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large"  color={colors.appTheme}/>
            </View>
        );
    };
    _renderContent() {
        const { initList, emptyData, errorComponent, emptyComponent, isLoading, error, data, renderItem, renderHeader, isRefreshing, onRefresh, onEndReached } = this.props
        if (initList) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator  color={colors.appTheme}/>
                    <Text>Đang tải dữ liệu</Text>
                </View>
            )
        }
        if (error && error.hasError) {
            if (errorComponent) {
                return errorComponent
            } else {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <MyIcon name='layers' size={150} />
                        <Text style={{ fontSize: 48, marginTop: 20 }}>Lỗi kết nối</Text>
                    </View>
                );
            }

        }
        if (emptyData) {
            if (emptyComponent) {
                return emptyComponent
            } else {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <MyIcon name='layers' size={150} />
                        <Text style={{ fontSize: 48, marginTop: 20 }}>Không có dữ liệu</Text>
                    </View>
                );
            }
        }
        else {
            return (
                <View style={{ paddingTop: isRefreshing ? 0 : NAVBAR_HEIGHT, flex: 1 }}>
                    <AnimatedFlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                            />
                        }

                        data={data}
                        keyExtractor={this._keyExtractor}
                        renderItem={renderItem}
                        // scrollEventThrottle={1}
                        // onMomentumScrollBegin={this._onMomentumScrollBegin}
                        // onMomentumScrollEnd={this._onMomentumScrollEnd}
                        // onScrollEndDrag={this._onScrollEndDrag}
                        // onScroll={Animated.event(
                        //     [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
                        //     { useNativeDriver: true },
                        // )}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => onEndReached()}
                        ListFooterComponent={
                            isLoading && <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator  color={colors.appTheme}/>
                            </View>
                        }

                    />

                </View>

            );
        }
        return null
    }
    render() {

        const { clampedScroll } = this.state;
        const navbarTranslate = clampedScroll.interpolate({
            inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
            outputRange: [0, -(NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
            extrapolate: 'clamp',
        });
        const navbarOpacity = clampedScroll.interpolate({
            inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        const { initList, error, data, renderItem, renderHeader, isRefreshing, onRefresh, onEndReached } = this.props

        return (
            <View style={styles.fill}>
                {this._renderContent()}
                {renderHeader !== null ? <Animated.View style={[styles.navbar, { transform: [{ translateY: navbarTranslate }] }]}>
                    {renderHeader(navbarOpacity)}
                </Animated.View> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
    },
    navbar: {
        zIndex: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        //alignItems: 'center',
        backgroundColor: '#2055D0',
        borderBottomColor: '#dedede',
        borderBottomWidth: 1,
        height: NAVBAR_HEIGHT,
        paddingTop: STATUS_BAR_HEIGHT
    },
    contentContainer: {
        paddingTop: NAVBAR_HEIGHT,
    }


});

