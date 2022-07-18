//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList
} from 'react-native';
import FontSize from '../../theme/fontsize';
import Color from '../../theme/colors';


// create a component
class ActionSheet extends Component {
    state = {
        isShowActionSheet: this.props.visible
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ isShowActionSheet: nextProps.visible })

    }
    render() {
        const { data, renderItem, closeAction } = this.props
        return (
            <Modal
                animationType="slide"
                transparent
                visible={this.state.isShowActionSheet}
                onRequestClose={() => console.log('onClose Modal')}
            >

                <View style={{ flex: 1, backgroundColor: Color.appOverView, justifyContent: 'center' }}>

                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <View style={{ marginBottom: 5, marginHorizontal: 5 }}>
                            <View style={{ borderRadius: 5, backgroundColor: 'white' }}>

                                <FlatList
                                    scrollEnabled={false}
                                    showsVerticalScrollIndicator={false}
                                    data={data}
                                    renderItem={renderItem}
                                    keyExtractor={(item, index) => `${index}`}
                                />
                            </View>
                            <TouchableOpacity
                                style={{ padding: 10, marginTop: 5, borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}
                                //onPress={() => { this.setState({ isShowActionSheet: false }) }}
                                onPress={() => { closeAction(); this.setState({ isShowActionSheet: false }) }}
                            >
                                <Text style={{ fontWeight: 'bold', fontSize: FontSize.larg, color: 'red' }}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>


            </Modal>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

//make this component available to the app
export default ActionSheet;
