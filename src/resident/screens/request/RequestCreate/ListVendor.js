//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ListData from '../../../components/common/ListData';
import { connect } from 'react-redux';
import { resetStateByKey, onVendorSelected } from '../../../actions/requestCreate';
import Strings from '../../../utils/languages';
// create a component

class ListItem extends PureComponent {
    render() {
        const { data, onPress } = this.props;
        const { id, towerName, logo } = data;
        return (
            <TouchableOpacity
                style={{
                    paddingVertical: 20,
                    backgroundColor: '#fff',
                    paddingHorizontal: 10
                }}
                onPress={onPress}
            >
                <Text>
                    {towerName}
                </Text>
            </TouchableOpacity>
        )
    }
}

class ListVendor extends Component {
    static navigationOptions = {
        headerTitle: Strings.createRequest.placeholderVendor,
        headerStyle: {
            elevation: 0,
            shadowOpacity: 0
        }
    }

    onSelected = (item) => {
        this.props.navigation.goBack();
        this.props.navigation.state.params.onSelected({ id: item.id, name: item.towerName, logo: item.logo })
    }
    render() {
        return (
            <View
                style={styles.container}
            >
                <ListData
                    api={{
                        url: '/Residents/TowerList',
                        params: {
                            typeId: 20
                        },
                        loadmore: true
                    }}
                    renderItem={({ item }) => <ListItem
                        data={item}
                        navigation={this.props.navigation}
                        onPress={() => this.onSelected(item)}
                    />}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});

//make this component available to the app
export default connect(null, { resetStateByKey, onVendorSelected })(ListVendor);
