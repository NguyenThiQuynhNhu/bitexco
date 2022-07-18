//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import colors from '../../../theme/colors';
import fontSize from '../../../theme/fontsize';
import RowItem from '../../common/RowItem';
// create a component
class ListItem extends PureComponent {
    render() {
        const { item, onPress } = this.props

        const {
            serviceName,
            dateOfPayment,
            amountIncurred,
            amountPaid,
            amountOwed,
            description,
            isPaid
        } = item
        const month = moment().format('MM/YYYY')
        return (
            <View
                style={styles.container}
                onPress={onPress}
            >

                <View >
                    <Text>{serviceName}</Text>
                    <Text style={{ color: 'gray', marginVertical: 10 }}>{serviceName} {month}</Text>
                    <Text style={{ color: isPaid ? "green" : 'red' }}>{isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</Text>
                </View>
                <Text style={{ color: colors.appTheme, fontSize: fontSize.larg }}>{amountOwed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
            </View >
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
});

//make this component available to the app
export default ListItem;
