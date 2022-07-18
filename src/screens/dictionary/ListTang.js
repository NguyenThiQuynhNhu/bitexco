//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import ListData from '../../components/common/ListData';
import { connect } from 'react-redux';
import { resetStateByKey } from '../../actions/requestCreate';
import Strings from '../../utils/languages';
import NavBar from '../../components/common/NavBar';
import { MyIcon } from '../../theme/icons';
import fontsize from '../../theme/fontsize';

class ListTang extends Component {
    onSelected = (item) => {
        const { onSelected } = this.props.navigation.state.params;
        this.props.navigation.goBack();
        onSelected(item)
        //this.props.resetStateByKey({ key: 'depSelected', path: '', value: { id: item.id, name: item.name } })
    }
    render() {
        const data = this.props.navigation.state.params.tang;
        const leftButton = (
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => this.props.navigation.goBack()}
            >
                <MyIcon
                    name="arrow"
                    size={20}
                    color="#fff"
                />
            </TouchableOpacity>
        )
        return (

            <View style={styles.container}>
                <NavBar leftButton={leftButton} body={<Text style={{ color: '#fff', fontSize: fontsize.medium, fontWeight: 'bold', alignSelf: 'center' }}>CHỌN ĐƠN VỊ</Text>} rightView={null} />

                <FlatList
                    //refreshing={isRefreshing}
                    //onRefresh={() => this.refreshDataHandle()}
                    data={data || []}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                //key={index}
                                style={{
                                    marginVertical: 20,
                                    backgroundColor: '#fff',
                                    marginHorizontal: 20
                                }}
                                onPress={() => this.onSelected(item)}
                            >
                                <Text>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>)
                    }}
                    ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: colors.grayBorder }} />}
                //ListFooterComponent={this.renderFooter}
                />
            </View>
        )

    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
const mapStateToProps = state => ({
    user: state.auth.user,
    //blockSelected: state.water.blockSelected
})

//make this component available to the app
export default connect(mapStateToProps)(ListTang);
