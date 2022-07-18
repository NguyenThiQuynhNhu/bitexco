//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { default_image } from '../../theme/images';
import colors from '../../theme';
import fontSize from '../../theme/fontsize';


// create a component
const BannerInfo = (props) => {
    const { logo, towerName, serviceName, address } = props.data
    return (
        <View style={{ flexDirection: 'row', padding: 10, backgroundColor:'#fff' }}>
            <Image
                style={{ height: 100, width: 100, borderRadius: 50, borderWidth: 0.5, borderColor: colors.grayBorder }}
                source={{
                    uri: `${logo || default_image}`
                }}
            />
            <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                <Text style={{ fontSize: fontSize.larg, color: 'black', fontWeight: 'bold' }}>{towerName}</Text>
                <Text style={{ marginVertical: 10 }}>{serviceName}</Text>
                <Text numberOfLines={2} lineBreakMode="tail">{address}</Text>
            </View>

        </View>
    );
};

// define your styles

const mapStateToProps = state => ({
    data: state.vendorDetail.data
})
//make this component available to the app
export default BannerInfo;
