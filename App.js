/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, StatusBar
} from 'react-native';
import Login from './src/components/Login';
import Register from './src/components/Register';
import Map from './src/components/Map';
import ReportIncident from './src/components/ReportIncident';
import 'babel-polyfill';
import 'es6-symbol'
import { YellowBox } from 'react-native';
import _ from 'lodash';


import Routes from './src/Routes';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#1c313a"
          barStyle="light-content"
        />
        {/* <Login /> */}
        {/* <Register /> */}
        <Routes />
        {/* <Map />
        <ReportIncident /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // alignItems: 'center',
    // backgroundColor: '#455a64',
  },
});
