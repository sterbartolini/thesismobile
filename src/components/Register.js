import React, { Component } from 'react';
import {
    StyleSheet, Text, View, TextInput,
    TouchableOpacity
} from 'react-native';
import RadioGroup from "react-native-radio-buttons-group";
import app, { db, fire2 } from '../config/fire';

import Logo from './Logo';


class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            contactNumber: '',
            isMobile: true,
            user_type: '',
            user: {},
            userId: '',
            data: [
                {
                    label: "Responder",
                    value: "Responder",
                    color: "white",
                },
                {
                    label: "Regular User",
                    value: "Regular User",
                    color: "white",
                },
                {
                    label: "Volunteer",
                    value: "Volunteer",
                    color: "white",
                },
            ]
        };
    }

    userType = data => {
        this.setState({ data });

        let selectedButton = this.state.data.find(e => e.selected == true);
        selectedButton = selectedButton
            ? selectedButton.value
            : this.state.data[0].label;
        this.setState({ user_type: selectedButton });
        console.log("what did i select", selectedButton);
    };

    createUserAccount() {

        var email = this.state.email;
        var password = this.state.password;
        const auth = fire2.auth();
        const promise = auth.createUserWithEmailAndPassword(email.trim(), password.trim());

        promise.then(user => {
            console.log('account created');
            let app = db.ref('users/' + user.user.uid);
            console.log('user type here', this.state.user_type);
            app.update({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                contactNumber: this.state.contactNumber,
                isMobile: true,
                user_type: this.state.user_type,
            });

        });
        promise.catch(e => {
            var err = e.message;
            console.log(err);
        })
        console.log("loog", this.state.email, this.state.password);
    };


    render() {
        return (
            <View style={styles.container}>
                {/* <Logo /> */}
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="First Name"
                    placeholderTextColor="#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onChangeText={(firstName) => this.setState({ firstName })}
                />
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Last Name"
                    placeholderTextColor="#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onChangeText={(lastName) => this.setState({ lastName })}
                />
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Email Address"
                    placeholderTextColor="#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Contact Number"
                    placeholderTextColor="#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onChangeText={(contactNumber) => this.setState({ contactNumber })}
                />
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor="#ffffff"
                    onChangeText={(password) => this.setState({ password })}
                />
                <RadioGroup radioButtons={this.state.data} onPress={this.userType} />
                <TouchableOpacity style={styles.button}
                    onPress={this.createUserAccount.bind(this)}>
                    <Text style={styles.buttonText}>
                        Register
                    </Text>
                </TouchableOpacity>
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

export default Register;