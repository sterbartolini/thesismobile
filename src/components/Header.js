import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, Text, View, Image, Alert, Platform, TouchableHighlight } from 'react-native';

class Header extends Component {
    render() {
        return (
            <View style={{
                backgroundColor: 'Tomato',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: 20,

            }}>
                <TouchableHighlight
                    style={{ marginRight: 10 }}
                    underlayColor='tomato'
                    onPress={this._onPressAdd}
                >
                    <Image
                        style={{ width: 60, height: 60 }}
                        source={require('../images/user.png')}
                    />
                </TouchableHighlight>
            </View>

        );
    }
}

export default Header;