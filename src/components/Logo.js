import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';


class Logo extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.Logo} source={require('../images/logo.png')} />
                <Text>Mobile Development</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding, 20px;
        alignItems: 'center',
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#455a64',
    },
    Logo: {
        width: 120,
        height: 120
    }

});

export default Logo;