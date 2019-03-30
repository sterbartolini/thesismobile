// import React, { Component } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity
// } from "react-native";
// import db, { app } from "../config/fire";
// import Button from "react-native-button";

// import { Actions } from "react-native-router-flux";

// import Logo from "./Logo";
// // import * as firebase from '../config/fire';
// class Login extends Component {
//   constructor(props) {
//     super(props);
//     // this.handleChange = this.handleChange.bind(this);
//     // this.loginUserAccount = this.handleChange.bind(this);
//     this.state = {
//       email: "",
//       password: "",
//       user: {}
//     };
//   }

//   componentDidMount() {
//     this.authListener();
//   }

//   authListener() {
//     app.auth().onAuthStateChanged(user => {
//       if (user) {
//         this.setState({ user });
//       } else {
//         this.setState({ user: null });
//       }
//     });
//   }

//   loginUserAccount = e => {
//     e.preventDefault();
//     console.log("loog", this.state.email);
//     app
//       .auth()
//       .signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
//       .catch(error => {
//         console.log(error);
//       });
//     console.log("Login");
//     // <Login/>
//     // {
//     //   this.state.user ? Actions.userMap() : Actions.login();
//     // }
//   };

//   Volunteer() {
//     Actions.Volunteer();
//   }

//   Responder() {
//     Actions.Responder();
//   }

//   userMaps() {
//     // app.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
//     //     // Actions.userMap()
//     //     console.log("LOGIN", u)
//     // }).catch((error) => {
//     //     console.log(error);
//     // })
//     Actions.userMap();
//   }

//   //   handleChange(e) {
//   //     this.setState({ [e.target.name]: e.target.value });
//   //   }

//   //   handleEmail = email => {
//   //     this.setState(email);
//   //     console.log("hoeee", email)
//   //   };

//   //   handlePassword = password => {
//   //       console.log("eheh", password)
//   //     this.setState(password);
//   //   };

//   //   login(e) {
//   //     e.preventDefault();
//   //   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <Logo />
//         <TextInput
//           style={styles.inputBox}
//           underlineColorAndroid="rgba(0,0,0,0)"
//           placeholder="Email"
//           placeholderTextColor="#ffffff"
//           selectionColor="#fff"
//           keyboardType="email-address"
//           // onSubmitEditing={() => this.password.focus()}
//           //   value={this.state.email}
//           onChangeText={email => this.setState({ email })}
//         />
//         <TextInput
//           style={styles.inputBox}
//           underlineColorAndroid="rgba(0,0,0,0)"
//           placeholder="Password"
//           secureTextEntry={true}
//           placeholderTextColor="#ffffff"
//           // ref={(input) => this.password = input}
//           //   value={this.state.password}
//           onChangeText={password => this.setState({ password })}
//         />
//         {console.log("hiii", this.state.email, this.state.password)}
//         <Button
//           style={styles.button}
//           onPress={this.loginUserAccount.bind(this)}
//         >
//           <Text style={styles.buttonText}>Login</Text>
//         </Button>
//         <TouchableOpacity style={styles.button} onPress={this.Responder}>
//           <Text style={styles.buttonText}>Responder</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={this.Volunteer}>
//           <Text style={styles.buttonText}>Volunteer</Text>
//         </TouchableOpacity>
//         <View style={styles.signupTextCont}>
//           <Text style={styles.signupText}>Don't have an account yet?</Text>
//           <TouchableOpacity onPress={this.signUp}>
//             <Text style={styles.signupButton}> Signup</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#455a64"
//   },
//   signupTextCont: {
//     flexGrow: 1,
//     alignItems: "flex-end",
//     justifyContent: "center",
//     paddingVertical: 16,
//     flexDirection: "row"
//   },
//   signupText: {
//     color: "rgba(255,255,255,0.6)",
//     fontSize: 16
//   },
//   signupButton: {
//     color: "#ffffff",
//     fontSize: 16,
//     fontWeight: "500"
//   },
//   inputBox: {
//     width: 300,
//     backgroundColor: "rgba(255, 255,255,0.2)",
//     borderRadius: 25,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     color: "#ffffff",
//     marginVertical: 10
//   },
//   button: {
//     width: 300,
//     backgroundColor: "#1c313a",
//     borderRadius: 25,
//     marginVertical: 10,
//     paddingVertical: 13
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#ffffff",
//     textAlign: "center"
//   }
// });

// export default Login;

import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity
} from 'react-native';



import { Actions } from 'react-native-router-flux';

import Logo from './Logo';
// import * as firebase from '../config/fire';

import db, { app } from '../config/fire';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      user: {},
    }
  }


  // componentDidMount() {
  //     this.authListener();
  // }

  // authListener() {
  //     app.auth().onAuthStateChanged(user => {
  //         if (user) {
  //             this.setState({ user });
  //             console.log("naksud ka diri?",user);
  //             this.signUp()
  //         } else {
  //             this.setState({ user: null });

  //             // Actions.login();
  //         }
  //     });
  // }

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
    Actions.userMap()
  }

  Volunteer() {
    Actions.Volunteer()
  }

  Responder() {
    Actions.Responder()
  }

  userMaps() {
    // app.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
    //     // Actions.userMap()
    //     console.log("LOGIN", u)
    // }).catch((error) => {
    //     console.log(error);
    // })
    Actions.userMap()
  }

  // handleChange = (e) => {
  //     this.setState({ [e.target.name]: e.target.value });
  // }

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
          // onSubmitEditing={() => this.password.focus()}
          // value={this.state.email}
          // onChange={this.handleChange}
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput style={styles.inputBox}
          underlineColorAndroid='rgba(0,0,0,0)'
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#ffffff"
          // ref={(input) => this.password = input}
          // value={this.state.password}
          // onChange={this.handleChange}
          onChangeText={(password) => this.setState({ password })}
        />
        <TouchableOpacity style={styles.button}
          // onPress={this.signUp}
          onPress={this.loginUserAccount.bind(this)}
        >
          <Text style={styles.buttonText}>
            Login
              </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.Responder}>
          <Text style={styles.buttonText}>
            Responder
              </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.Volunteer}>
          <Text style={styles.buttonText}>
            Volunteer
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