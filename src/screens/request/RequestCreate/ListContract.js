//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ListData from '../../../components/common/ListData';
import { connect } from 'react-redux';
import { resetStateByKey } from '../../../actions/requestCreate';
import Strings from '../../../utils/languages';
import responsive from "../../../resources/responsive";
// create a component

class ListItem extends PureComponent {
    render() {
        const { data } = this.props;
        const { item, index } = data;
        const { id, name } = item;
        return (
            <TouchableOpacity
                key={index}
                style={{
                    marginVertical: responsive.h(20),
                    backgroundColor: '#fff',
                    marginHorizontal: responsive.h(20)
                }}
                onPress={() => this.props.onSelected(item)}
            >
                <Text style={{fontSize: responsive.h(14)}}>
                    {name}
                </Text>
            </TouchableOpacity>
        )
    }
}

class ListContract extends Component {
    static navigationOptions = {
        headerTitle: Strings.createRequest.contract
    }
    onSelected = (item) => {
        this.props.navigation.goBack();
        this.props.resetStateByKey({ key: 'contractSelected', path: '', value: { id: item.id, name: item.name } })
    }
    render() {
        const { id } = this.props.navigation.state.params;
        return (
            <View
                style={styles.container}
            >
                <ListData
                    api={{
                        url: '/Residents/ContractList',
                        params: {
                            towerId: id
                        },
                        loadmore: false
                    }}
                    renderItem={(item) => <ListItem data={item} navigation={this.props.navigation} onSelected={this.onSelected} />}
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
const mapStateToProps = state => ({
    vendorSelected: state.requestCreate.vendorSelected
})

//make this component available to the app
export default connect(mapStateToProps, { resetStateByKey })(ListContract);
