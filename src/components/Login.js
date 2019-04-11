
import React, { Component } from 'react';
import {
    StyleSheet, Text, View, TextInput,
    TouchableOpacity
} from 'react-native';
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
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Email"
                    placeholderTextColor="#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor="#ffffff"
                    onChangeText={(password) => this.setState({ password })}
                />
                <TouchableOpacity style={styles.button}
                    onPress={this.loginUserAccount.bind(this)}
                >
                    <Text style={styles.buttonText}>
                        Login
              </Text>
                </TouchableOpacity>
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
        backgroundColor: '#455a64',
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
        backgroundColor: 'rgba(255, 255,255,0.2)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 10
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