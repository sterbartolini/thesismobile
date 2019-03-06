/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Logo from "../components/Logo";

class Main extends Component {
    render() {
        return (
            <View>
                <Logo />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#455a64',
    },
    LogoContainer: {
        alignItems: 'center'
    },
    Logo: {
        width: 120,
        height: 120
    }

});

export default Main;