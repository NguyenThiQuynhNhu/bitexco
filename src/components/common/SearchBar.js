//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, TextInput, TouchableOpacity, Platform } from 'react-native';
import { MyIcon } from '../../theme/icons';
import colors from '../../theme/colors';
import Strings from '../../utils/languages';

// create a component
const SearchBar = (props) => {
    const { navbarOpacity, style, onChangeText, onClearText, onSubmitEditing, value } = props;
    return (
        <Animated.View style={[
            {
                alignItems: 'center',
                borderRadius: 5,
                backgroundColor: '#a3cd80',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
            }, style, { opacity: navbarOpacity }]}>

            <MyIcon
                name="search"
                size={20}
                color="#fff"
                style={{ margin: 5 }}
            />

            <TextInput
                value={value}
                onSubmitEditing={onSubmitEditing}
                onChangeText={(text) => onChangeText(text)}
                placeholderTextColor="#fff"
                placeholder={Strings.app.placeholderSearchBar}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                autoFocus={false}
                style={{
                    color: '#fff',
                    flex: 1,
                    paddingVertical: 0,
                    justifyContent: 'flex-start'
                }}
            />
            <TouchableOpacity onPress={onClearText}>
                <MyIcon
                    name="delete"
                    size={20}
                    color="#fff"
                    style={{ margin: 5 }}
                />
            </TouchableOpacity>
        </Animated.View>
    )
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default SearchBar;
