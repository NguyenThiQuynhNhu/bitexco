//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ListItem from './ListItem';

// create a component
class ListData extends Component {

    renderItem = ({ item }) => {
        const {canNavigate, navigation } = this.props
        return <ListItem item={item} onPress={() => canNavigate ? navigation.navigate('checklistDetail', { id : item.id }) : null} />
    }

    renderFooter = () => {
        if (!this.props.isLoading || this.props.isRefreshing) return null;
        return (
            <View
                style={{
                    paddingVertical: 20,
                }}
            >
                <ActivityIndicator animating size="small" />
            </View>
        );
    };

    render() {
        const { refreshing, onRefresh, data, renderItem, onEndReached } = this.props
        return (
            <FlatList
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
                refreshing={refreshing}
                onRefresh={onRefresh}
                data={data}
                keyExtractor={(item, index) => `${index}`}
                renderItem={this.renderItem}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
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



export default ListData


