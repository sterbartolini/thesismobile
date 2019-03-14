import React, { Component } from "react";
import { Text, TouchableOpacity, View, Image, Dimensions, TextInput, StyleSheet, TouchableHighlight } from "react-native";
import Modal from 'react-native-modal';
import Button from 'react-native-button'
import 'babel-polyfill';
import 'es6-symbol';
import { db } from '../config/fire';

// let addLong = item => {
//     db.ref('/userLocation').push({
//         longtitude: item,
//     });
// };

// let addLat = item => {
//     db.ref('/userLocation').push({
//         latitude: item,
//     });
// };


var screen = Dimensions.get('window');

export default class ReportIncident extends Component {
    state = {
        isModalVisible: false,
        longtitude: '',
        latitude: ''
    };


    findCoordinates = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = JSON.stringify(position.coords.latitude);
                const longtitude = JSON.stringify(position.coords.longitude);

                this.setState({ latitude, longtitude });
                // addLat(this.state.latitude);
                // addLong(this.state.longtitude);
                let firebaseRef = db.ref('/userLocation');
                firebaseRef.push({
                    coordinates: { longtitude: this.state.longtitude, latitude: this.state.latitude }
                });

            },
            error => Alert.alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    // handleChangeLng = e => {
    //     this.setState({
    //         longtitude: e.nativeEvent.text,

    //     });
    // };
    // handleChangeLat = e => {
    //     this.setState({
    //         latitude: e.nativeEvent.text,
    //     });
    // };

    // handleSubmit = () => {
    //     addLat(this.state.latitude);
    //     addLong(this.state.longtitude);

    // };

    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    render() {
        return (
            <View>
                <TouchableOpacity style={{ top: screen.height - 120, paddingLeft: 20, paddingBottom: 30 }} onPress={this._toggleModal}>
                    <Image
                        style={{ width: 65, height: 65 }}
                        source={require('../images/addLogo.png')}
                    />
                </TouchableOpacity>
                <Modal isVisible={this.state.isModalVisible}
                    style={{
                        justifyContent: 'center',
                        borderRadius: 20,
                        shadowRadius: 10,
                        width: screen.width - 50,
                        backgroundColor: 'white'
                    }}
                >
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginTop: 40
                    }}>Input Incident
                    </Text>
                    {/* <TextInput
                        style={{
                            height: 40,
                            borderBottomColor: 'gray',
                            marginLeft: 30,
                            marginRight: 30,
                            marginTop: 20,
                            marginBottom: 10,
                            borderBottomWidth: 1
                        }}
                        // onChangeText={(text) => this.setState({ newFoodName: text })}
                        placeholder="Enter Latitude"
                    // value={this.state.newFoodName}                 
                    />
                    <TextInput
                        style={{
                            height: 40,
                            borderBottomColor: 'gray',
                            marginLeft: 30,
                            marginRight: 30,
                            marginTop: 10,
                            marginBottom: 20,
                            borderBottomWidth: 1
                        }}

                        // onChangeText={(text) => this.setState({ newFoodDescription: text })}
                        placeholder="Enter Longtitude"
                    // value={this.state.newFoodDescription}
                    />
                    <Button
                        style={{ fontSize: 18, color: 'white' }}
                        onPress={this._toggleModal}
                        containerStyle={{
                            padding: 8,
                            marginLeft: 70,
                            marginRight: 70,
                            height: 40,
                            borderRadius: 6,
                            backgroundColor: 'mediumseagreen'
                        }}
                    >
                        Report Incident
                    </Button> */}



                    <TouchableOpacity onPress={this.findCoordinates}>
                        <Text style={styles.title}>Touch to find your location</Text>
                        <Text>Latitude: {this.state.latitude}</Text>
                        <Text>longitude: {this.state.longtitude}</Text>
                    </TouchableOpacity>
                    <Button
                        style={{ fontSize: 18, color: 'white' }}
                        onPress={this._toggleModal}
                        containerStyle={{
                            padding: 8,
                            marginLeft: 70,
                            marginRight: 70,
                            height: 40,
                            borderRadius: 6,
                            backgroundColor: 'mediumseagreen'
                        }}
                    >
                        <Text>Back</Text>
                    </Button>

                    {/* <TextInput style={styles.itemInput} onChange={this.handleChangeLat} />
                    <TextInput style={styles.itemInput} onChange={this.handleChangeLng} />
                    <TouchableHighlight
                        style={styles.button}
                        underlayColor="white"
                        onPress={this.handleSubmit}
                    >
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableHighlight> */}

                    {/* </View> */}
                </Modal>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 30,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#6565fc'
    },
    title: {
        marginBottom: 20,
        fontSize: 25,
        textAlign: 'center'
    },
    itemInput: {
        height: 50,
        padding: 4,
        marginRight: 5,
        fontSize: 23,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        color: 'black'
    },
    buttonText: {
        fontSize: 18,
        color: '#111',
        alignSelf: 'center'
    },
    button: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
});