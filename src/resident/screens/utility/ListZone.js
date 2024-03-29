//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ListData from '../../components/common/ListData';
import { connect } from 'react-redux';
import { resetStateByKey } from '../../actions/utilitiesBasicBooking';
import Strings from '../../utils/languages';
import NavBar from '../../components/common/NavBar';
import fontsize from '../../theme/fontsize';
import { MyIcon } from '../../theme/icons';
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
                    paddingVertical: 20,
                    backgroundColor: '#fff',
                    paddingHorizontal: 10
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

class ListZone extends Component {
    static navigationOptions = {
        header: null
    }
    onSelected = (item) => {
        this.props.navigation.goBack();
        this.props.resetStateByKey({ key: 'zoneSelected', path: '', value: { id: item.id, name: item.name } })
    }
    render() {
        const { serviceId, towerId } = this.props.navigation.state.params;
        return (
            <View
                style={styles.container}
            >
                <NavBar
                    leftButton={<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ padding: 10 }}><MyIcon name="arrow" color="#fff" size={20} /></TouchableOpacity>}
                    body={<Text style={{
                        alignSelf: 'center', color: '#fff', fontFamily: "Inter-Bold",
                        fontSize: 20,
                        fontWeight: "bold",
                    }}>{Strings.serviceBasicBooking.zoneSelect}</Text>}
                    rightView={<View style={{ margin: 10 }}><MyIcon name="arrow" color={colors.appTheme} size={20} /></View>}
                />
                <ListData
                    api={{
                        url: '/Residents/ServiceBasic/Zone/List',
                        params: {
                            towerId,
                            serviceId,
                            langId: this.props.langId
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
    serviceId: state.utilitiesBasicBooking.data.id,
    towerId: state.auth.user.towerId,
    langId: state.app.language == 'vi' ? 1 : 2
})

//make this component available to the app
export default connect(mapStateToProps, { resetStateByKey })(ListZone);
