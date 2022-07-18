//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

// create a component
class ListData extends Component {
    render() {
        const { refreshing, onRefresh, data, renderItem, onEndReached, ListFooterComponent } = this.props
        return (
            <FlatList
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
                refreshing={refreshing}
                onRefresh={onRefresh}
                data={data}
                keyExtractor={(item, index) => `${index}`}
                renderItem={renderItem}
                ListFooterComponent={ListFooterComponent}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
            />
        );
    }
}



//make this component available to the app
export default ListData;
