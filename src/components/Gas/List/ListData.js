//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ListItem from './ListItem';
import {
    onSetItem
} from '../../../actions/gas'
import { connect } from 'react-redux';
import responsive from "../../../resources/responsive";
// create a component
class ListData extends Component {

    renderItem = ({ item }) => {
        return <ListItem item={item} onPress={() => this.onPressItem(item)} onLongPress={() => this.onPressLongItem(item)} />
    }

    onPressItem(item){
        this.props.onSetItem({ itemSelected: item });
        this.props.navigation.navigate('gasDetail', { data: item })
    }

    onPressLongItem(item){
        this.props.onSetItem({ itemSelected: item });
        this.props.onPress();
    }

    renderFooter = () => {
        if (!this.props.isLoading || this.props.isRefreshing) return null;
        return (
            <View
                style={{
                    paddingVertical: responsive.h(20),
                }}
            >
                <ActivityIndicator animating size="small" />
            </View>
        );
    };

    render() {
        const { refreshing, onRefresh, data, renderItem, onEndReached, onPress } = this.props
        return (
            <FlatList
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#c8c8c8", marginHorizontal: responsive.h(20), }} />}
                refreshing={refreshing}
                onRefresh={onRefresh}
                data={data}
                keyExtractor={(item, index) => `${index}`}
                renderItem={this.renderItem}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
                style={{margin: responsive.h(20),}}
            />
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});


const mapStateToProps = (state) => ({
    itemSelected: state.gas.itemSelected
});

const mapActionToState = {
    onSetItem
};

export default connect(mapStateToProps, mapActionToState)(ListData);