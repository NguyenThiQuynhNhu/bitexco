//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ListItem from './ListItem';

// create a component
class ListData extends Component {

    renderItem = ({ item, index }) => {
        const {onRefresh, canNavigate, navigation } = this.props;
        //console.log('this.props', this.props)
        return (index === 0 ? <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 7 }}><Text style={{ fontFamily: "Inter-Bold", fontSize: 18 }}>{ item.total } công việc</Text></View>
        <ListItem onRefresh={onRefresh} item={item} onPress={() => canNavigate ? navigation.navigate('checklistDetail', item) : null} /></View> 
        : <ListItem onRefresh={onRefresh} item={item} onPress={() => canNavigate ? navigation.navigate('checklistDetail', item) : null} />)
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
        //console.log('this.props', this.props)
        return (
            <FlatList
                //ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grayBorder }} />}
                refreshing={refreshing}
                onRefresh={onRefresh}
                data={data}
                keyExtractor={(item, index) => `${index.toString()}`}
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


