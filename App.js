import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, StatusBar } from "react-native";
import Login from "./src/components/Login";
import ReportIncident from "./src/components/ReportIncident";
import "babel-polyfill";
import "es6-symbol";
import { YellowBox } from "react-native";
import _ from "lodash";
import db, { app } from "../thesismobile/src/config/fire";

import Routes from "./src/Routes";

YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userId: "",
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    app.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user, userId: user.uid });
      } else {
        this.setState({ user: null });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#1c313a" barStyle="light-content" />
        <Routes />
        {/* {this.state.user ? <ReportIncident userId={this.state.userId} /> : <Login />} */}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1

    // alignItems: 'center',
    // backgroundColor: '#455a64',
  }
});
