
import React, { Component } from 'react';
import {
  StyleSheet, Text, View,
  TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import {Input} from 'react-native-elements';
import {Button} from 'react-native-paper';
import app from '../config/fire';
import { Actions } from 'react-native-router-flux';

import Logo from './Logo';


// import db, { app } from '../config/fire';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      user: {},
    }
  }


  loginUserAccount() {
    console.log("loog", this.state.email, this.state.password);
    Keyboard.dismiss();
    app.auth()
      .signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
      .catch(error => {
        console.log(error);
      });
    console.log("Login");


  };

  signUp() {
    Actions.signup()
  }

  Volunteer() {
    Actions.Volunteer()
  }

  Responder() {
    Actions.Responder()
  }

  userMaps() {

    Actions.RegularUser()
  }


  render() {
    return (
      <View style={styles.container}>
        <Logo />
        <Input
        placeholder='E-mail Address'
        inputContainerStyle={styles.inputBox}
        value={this.state.email}
        onChangeText={(email) => this.setState({ email })}
        />

        <Input
        inputContainerStyle={styles.inputBox}
        placeholder='Password'
        value={this.state.password}
        secureTextEntry={true}
        onChangeText={(password) => this.setState({ password })}
        />

        <Button mode='contained'
          color='rgba(255, 255,255,0.75)'
          onPress={this.loginUserAccount.bind(this)}>
          Log In
        </Button>

        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}>Don't have an account yet?</Text>
          <TouchableOpacity onPress={this.signUp}><Text style={styles.signupButton}> Signup</Text></TouchableOpacity>
        </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#833030',
  },
  signupTextCont: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row'
  },
  signupText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16
  },
  signupButton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500'
  },
  
  inputBox: {
    width: 300,
    borderColor: 'rgba(255, 255,255,0.3)',
    backgroundColor: 'rgba(255, 255,255,0.3)',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginVertical: 10,
    marginHorizontal: 45,
    position: 'relative'
  },

  button: {
    width: 300,
    backgroundColor: '#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center'
  }

});

export default Login;