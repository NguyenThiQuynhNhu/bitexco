//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ListData from '../../../components/common/ListData';
import { connect } from 'react-redux';
import { resetStateByKey } from '../../../actions/requestCreate';
import Strings from '../../../utils/languages';
import NavBar from '../../../components/common/NavBar';
import { MyIcon } from '../../../theme/icons';
import fontsize from '../../../theme/fontsize';
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
                    marginVertical: 20,
                    backgroundColor: '#fff',
                    marginHorizontal: 20
                }}
                onPress={() => this.props.onSelected(item)}
            >
                <Text>
                    {name}
                </Text>
            </TouchableOpacity>
        )
    }
}

class ListDep extends Component {
    static navigationOptions = {
        headerTitle: Strings.createRequest.placeholderGroup
    }
    onSelected = (item) => {
        const { onSelected } = this.props.navigation.state.params;
        this.props.navigation.goBack();
        onSelected(item)
        //this.props.resetStateByKey({ key: 'depSelected', path: '', value: { id: item.id, name: item.name } })
    }
    render() {
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

        const { towerId } = this.props.user;
        return (
            <View
                style={styles.container}
            >

                <NavBar

                    leftButton={leftButton}
                    body={<Text style={{
                        fontFamily: "Inter-Bold",
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#ffffff"
                    }}>{Strings.createRequest.placeholderDepartment}</Text>} rightView={null}
                    rightView={<TouchableOpacity style={{ padding: 10 }}><MyIcon name="arrow" color={colors.appTheme} size={20} /></TouchableOpacity>} />

                <ListData
                    api={{
                        url: '/Vendors/DepartmentList',
                        params: {
                            towerId
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
    vendorSelected: state.requestCreate.vendorSelected,
    user: state.auth.user
})

//make this component available to the app
export default connect(mapStateToProps, { resetStateByKey })(ListDep);
