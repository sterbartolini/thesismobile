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
  Platform, StyleSheet, Text, View,
} from 'react-native';
import Login from './src/components/Login';
// import Register from './src/components/Register';
import Map from './src/components/Map';
<<<<<<< HEAD
import ReportIncident from './src/components/ReportIncident';
=======
import Header from './src/components/Header';
>>>>>>> ef66af1adc0a1e8de11bd76d1a3cfac8b077fd10

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        {/* <Login /> */}
        {/* <Register /> */}
        <Map />
<<<<<<< HEAD
        <ReportIncident />
=======
        <Header />

>>>>>>> ef66af1adc0a1e8de11bd76d1a3cfac8b077fd10
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // alignItems: 'center',
    backgroundColor: '#455a64',
  },
});
