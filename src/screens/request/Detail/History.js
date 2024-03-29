//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import { connect } from 'react-redux';
import moment from 'moment';
import fontSize from '../../../theme/fontsize';
import { MyIcon } from '../../../theme/icons';
import { converStatusToColor, converStatusToString } from '../../../utils/request';



// create a component
class History extends Component {
    renderStar(active, rate) {
        return (
            <MyIcon
                name="star"
                size={20}
                color={colors.appTheme}
                style={active ? styles.iconStarActive : styles.iconStarDeactive}
            />
        )
    }

    renderRateView(ratingMark) {
        const listStar = []
        for (let i = 0; i < 5; i += 1) {
            const active = i < ratingMark
            listStar.push(this.renderStar(active, i + 1))
        }
        return listStar
    }

    renderDetail(rowData, sectionID, rowID) {
        let time = this.props.language == 'en' ? moment(rowData.dateActive).format('HH:mm - MMMM Do YYYY') : moment(rowData.dateActive).format('HH:mm - DD [tháng] MM, YYYY')

        let title = rowID == '0' ?
            (<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><Text style={styles.infoTextHistory}>{time}</Text>
                <TouchableOpacity
                    style={{ padding: 4, flex: 1, alignItems: 'flex-end' }}
                    onPress={() => {
                        this.setState({ showPopupHistory: true }
                        ); ((rowData.content !== null && rowData.content !== undefined && rowData.content.length > 0) ? this.setState({ isUpdate: true }) : this.setState({ isUpdate: false }))
                    }}>
                </TouchableOpacity>
            </View>)
            : (<Text style={styles.infoTextHistory}>{time}</Text>);
        let desc = null
        if (rowData.content !== null && rowData.content !== undefined && rowData.content.length > 0) {
            desc = (
                <View style={{ alignContent: 'space-between', paddingRight: 5, paddingTop: 10 }}>
                    <Text style={{
                        fontFamily: "Inter-Regular",
                        fontSize: 13,
                        letterSpacing: 0,
                        textAlign: "left",
                        color: "#3d3d3d"
                    }}>
                        {rowData.content}
                    </Text>
                </View>)

        }
        let info = null
        if (rowData.statusName !== null && rowData.statusName !== undefined && rowData.statusName.length > 0) {
            info = (
                <View style={{ paddingTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                            borderRadius: 16,
                            backgroundColor: "#fff5eb", paddingVertical: 5, paddingHorizontal: 20, flexDirection: 'row'
                        }}>
                            <Text style={{
                                fontFamily: "Inter-Regular",
                                fontSize: 12,
                                textAlign: "center",
                                color: "#ff3d00"
                            }}>
                                {rowData.statusName}
                            </Text>

                        </View>
                        <Text style={{
                            fontFamily: "Inter-Medium",
                            fontSize: 12,
                            textAlign: "center",
                            color: "#282828"
                        }}>
                            - {rowData.isCustomer ? this.props.data.residentName : rowData.userName}
                        </Text>
                        {rowData.isCustomer ? <View style={{ borderRadius: 15, paddingHorizontal: 5, marginLeft: 10, backgroundColor: colors.appTheme, justifyContent: 'center' }}>
                            <Text style={{ fontSize: fontSize.micro, color: '#fff' }}>Cư dân</Text></View> : <View />}

                    </View>
                    { (rowData.ratingMark === 0 || rowData.ratingMark === undefined) ? <View /> :
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                paddingTop: 10
                            }}>
                            {this.renderRateView(rowData.ratingMark)}
                        </View>
                    }
                </View>
            )
        }

        return (
            <View style={{ flex: 1, paddingTop: 0 }}>
                <View style={{ marginTop: -5, marginBottom: 10 }}>
                    {title}
                    {info}
                    {desc}
                </View>
            </View>
        )
    }
    render() {
        const { historyContent } = this.props.data
        return (
            <Timeline
                separator={false}
                circleSize={18}
                circleColor='#a3cd80'
                lineColor='#a3cd80'
                timeContainerStyle={{ maxWidth: 0, minWidth: 0 }}
                descriptionStyle={{ color: 'red', fontSize: 12 }}
                titleStyle={{ fontSize: 12 }}
                options={{
                    style: { paddingTop: 5, marginTop: 20 }
                }}
                lineWidth={1}
                enableEmptySections={true}
                keyExtractor={(item, index) => index}
                renderDetail={this.renderDetail.bind(this)}
                data={historyContent}
            />
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    infoTextHistory: {
        flex: 2,
        borderBottomWidth: 0,
        fontFamily: "Inter-Regular",
        fontSize: 11,
        textAlign: "left",
        color: "#6f6f6f"
    },
});

const mapStateToProps = state => ({
    user: state.auth.user,
    data: state.requestDetail.data,
    language: state.app.language

})

//make this component available to the app
export default connect(mapStateToProps)(History);;
