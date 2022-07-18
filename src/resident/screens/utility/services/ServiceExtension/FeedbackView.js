import React from 'react'
import {
    View,
    Text,
    Alert,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform

} from 'react-native'
import { connect } from 'react-redux';
import ElevatedView from 'react-native-elevated-view'
import { MyIcon } from '../../../../theme/icons'
import colors from '../../../../theme/colors'

import Strings from '../../../../utils/languages';

class FeedbackView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            rate: 5,
            description: Strings.detailRequest.ratingContentDefault,
        }
    }

    renderRateText = () => {
        const { rate } = this.state
        let rateText = ''
        switch (rate) {
            case 1: rateText = 'Chưa Hoàn Thành'; break;
            case 2: rateText = 'Hoàn Thành'; break;
            case 3: rateText = 'Hoàn Thành Tốt'; break;
            default: break;
        }
        return <Text style={{ alignSelf: 'center' }}>{rateText}</Text>
    }

    renderStar(active, rate) {
        return (
            <TouchableOpacity
                key={rate}
                activeOpacity={1}
                onPress={() => this.setState({ rate: rate })}
            >
                <MyIcon
                    name="star"
                    size={30}
                    color="#2699FB"
                    style={active ? styles.iconStarActive : styles.iconStarDeactive}
                />
            </TouchableOpacity>
        )
    }

    renderRateView() {
        const { rate } = this.state
        const listStar = []
        for (let i = 0; i < 5; i += 1) {
            const active = i < rate
            listStar.push(this.renderStar(active, i + 1))
        }
        return listStar
    }

    render() {
        const { onClose, onSubmit, onChangeText } = this.props
        const { rate, description } = this.state;

        return (
            <View style={{
                width: '90%',
                borderRadius: 5,
            }}>
                <View
                    style={{
                        borderRadius: 10,
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        padding: 10
                    }}
                >

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            //backgroundColor: 'white'
                        }}
                    >
                        {this.renderRateView()}
                    </View>
                    {/* {this.renderRateText()} */}

                    <ElevatedView
                        elevation={5}
                        style={styles.cardView}>
                        <TextInput
                            value={description}
                            style={styles.textMultiRow}
                            placeholder={Strings.detailRequest.typeContent}
                            underlineColorAndroid="transparent"
                            multiline
                            onSubmitEditing={() => onSubmit({ rate, description })}
                            returnKeyLabel="send"
                            numberOfLines={6}
                            onChangeText={(text) => this.setState({ description: text })}
                    />
                    </ElevatedView>
                    <TouchableOpacity onPress={() => onSubmit({ rate, description })} style={{ borderRadius: 5, padding: 10, marginTop: 20, alignItems: 'center', backgroundColor: colors.appTheme }} >
                        <Text style={{ color: '#fff' }}>Gửi đánh giá</Text>
                    </TouchableOpacity>
                    {/* <PrimaryButton text="Gửi đánh giá" onPress={this.commentRequest} /> */}
                </View>
                <TouchableOpacity
                    onPress={onClose}
                    style={{ borderRadius: 45, position: 'absolute', backgroundColor: '#505c5c5c', padding: 10, top: -10, right: -10 }}>

                    <MyIcon
                        name="no"
                        size={20}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    gridView: {
        //backgroundColor: 'white',
        margin: 26,
        justifyContent: 'center'
    },
    wrapperView: {
        flex: 1,
        backgroundColor: colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bodyView: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'

    },
    blackText: {
        color: '#000',
        fontSize: 12
    },
    cardView: {
        borderRadius: 5,
        flexDirection: 'row',
        margin: 5,
        padding: 2,
        borderColor: '#fafafa',
        borderWidth: 1,
        backgroundColor: 'white'
    },
    textMultiRow: {
        flex: 1,
        padding: 5,
        height: 90,
        borderRadius: 5,
        textAlignVertical: 'top'
    },
    iconStarDeactive: {
        margin: 5,
        opacity: 0.5
    },
    iconStarActive: {
        margin: 5
    },
    wrapperTextIcon: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10
    },
    swiperImage: {
        margin: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
})

const mapDispatchToProps = {
    // navListRequest: payload => dispatch(actions.navListRequest(payload)),
    // changeStateLoading: payload => dispatch(actions.changeStateLoading(payload)),
    // resetStateByKey: payload => dispatch(actions.resetStateByKey(payload))
}

export default connect(null, mapDispatchToProps)(FeedbackView) 
