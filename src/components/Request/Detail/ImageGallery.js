//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import ImageProgress from '../../common/ImageProgress';
import Lightbox from 'react-native-lightbox';
import colors from '../../../theme/colors';

// create a component
const ImageGallery = (props) => {
    const { data, title } = props
    return (
        <View style={{ marginTop: 10 }} >
            {title && <Text style={{
                fontFamily: "Inter-SemiBold",
                fontSize: 14,
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#282828"
            }}>{title}</Text>}

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                {data.map((eachImage, y) => {
                    return (
                        <View key={y}>
                            <Lightbox
                                style={{ marginTop: 10, marginRight: 10, borderRadius: 5, backgroundColor: '#eeeeee' }}
                                activeProps={{
                                    style: styles.imageActive
                                }}

                            >
                                <Image source={{ uri: eachImage.url }} style={{ width: 90, height: 120, borderRadius: 0 }} />
                            </Lightbox>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    imageActive: {
        flex: 1,
        resizeMode: "contain"
    }
});

//make this component available to the app
export default ImageGallery;
