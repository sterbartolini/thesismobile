
import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, StatusBar
} from 'react-native';
import Login from './src/components/Login';
import Register from './src/components/Register';
import ReportIncident from './src/components/ReportIncident';
import 'babel-polyfill';
import 'es6-symbol'
import { YellowBox } from 'react-native';
import _ from 'lodash';
import app from './src/config/fire';

import { Actions } from 'react-native-router-flux';

import Routes from './src/Routes';

YellowBox.ignoreWarnings(['Setting a timer']);
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
      userType: [],
      userAccount: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        user_type: '',
        isMobile: null,
        contactNumber: ''
      }
    };
  }

  componentDidMount() {
    this.authListener();
  }



  authListener() {
    app.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user, userId: user.uid });
        this.userDetails();
      } else {
        this.setState({ user: null, userId: null });
      }
    });
  }

  userDetails = () => {
    let userValue = "";
    console.log("userr", this.state.userId);
    app.database().ref(`users/${this.state.userId}`).once("value").then(snapshot => {
      userValue = snapshot.val();
      // console.log("uservalues", userValue);
      this.setState({ userType: userValue.user_type });
      this.setState({ userAccount: userValue });
      this.rerouteUserAccess();
      // this.props.logUser(this.state.userAccount);
    }).catch(err => console.log(err));

  }

  rerouteUserAccess = () => {
    // console.log("thisss", this.state.userType);
    switch (this.state.userType) {
      case 'Regular User':
        // console.log('Regular User');
        Actions.RegularUser();
        // browserHistory.push('/administrator');
        //this.props.logUser();
        break;
      case 'Responder':
        // console.log('Responder');
        // browserHistory.push('/ccpersonnel');
        Actions.Responder();
        break;
      case 'Volunteer':
        // console.log('Volunteer');
        Actions.Volunteer();
        // browserHistory.push('/ccpersonnel');
        break;
      default: Actions.login();
        break;
    }
  }

  Volunteer() {
    Actions.userMap();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#1c313a"
          barStyle="light-content"
        />
        <Routes />
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
