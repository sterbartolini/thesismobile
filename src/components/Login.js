
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity,Alert
} from 'react-native';
import app from '../config/fire';
import { Formik } from 'formik'
import * as yup from 'yup'

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
      emailError:'',
      passwordError:'',
      error:''
    }
  }


  loginUserAccount(values) {
      app.auth()
        .signInWithEmailAndPassword(values.email.trim(), values.password)
        .catch(e => {
          var err = e.message;
          console.log(err);
          this.setState({err: 'Username or Password is Incorrect'});
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
<Formik initialValues={{ email:'',password:''}}
            onSubmit={values=>{
                this.loginUserAccount(values);
            }}
            validationSchema={
                yup.object().shape({
                  
                    email: yup
                    .string()
                    .email('Invalid Email Format')
                    .required('Email Address is Required'),
                    password: yup
                    .string()
                    .strict(true)
                    .matches(/[a-zA-Z0-9]/, 'Password contains Special Characte')
                    .trim('Password contains Special Characters')
                    .required('Password is Required'),
                })
            }>
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (          

      <View style={styles.container}>
       
        <Logo />
        <TextInput style={styles.inputBox}
          underlineColorAndroid='rgba(0,0,0,0)'
          placeholder="Email"
          placeholderTextColor="#ffffff"
          selectionColor="#fff"
          keyboardType="email-address"
          value={values.email}
          onBlur={() => setFieldTouched('email')}
          onChangeText={handleChange('email')}
        />
        {touched.email && errors.email &&
          <Text style={{ fontSize: 15, color: 'red' }}>{errors.email}</Text>
        }          
        <TextInput style={styles.inputBox}
          underlineColorAndroid='rgba(0,0,0,0)'
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#ffffff"
          value={values.password}
          onBlur={() => setFieldTouched('password')}
          onChangeText={handleChange('password')}
        />
        {touched.password && errors.password &&
          <Text style={{ fontSize: 15, color: 'red' }}>{errors.password}</Text>
        }             
         <Text style={{ fontSize: 15, color: 'red' }} className='catchError'>{this.state.err}</Text>

        <TouchableOpacity style={styles.button}
          disabled={!isValid}
          onPress={handleSubmit}
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
            )}
            </Formik>
     
     
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