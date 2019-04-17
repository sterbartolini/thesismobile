
import React, { Component } from "react";
import { Text, TouchableOpacity, View, Image, Dimensions, TextInput, StyleSheet, TouchableHighlight, Keyboard, Alert } from "react-native";
import Modal from 'react-native-modal';
import 'babel-polyfill';
import 'es6-symbol';
import { FloatingAction } from 'react-native-floating-action';
import Icon from 'react-native-vector-icons/FontAwesome';

import app from '../config/fire';
import apiKey from '../config/apiKey';
import _ from 'lodash';

import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';

import PolyLine from '@mapbox/polyline';
var screen = Dimensions.get('window');

export default class Responder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            isIncidentReady: false,
            destinationPlaceId: '',
            userKey: "",
            userType: '',
            incidentType: "",
            incidentLocation: "",
            firstName: "",
            lastName: "",
            user: null,
            unresponded: true,
            isResponding: false,
            isSettled: false,
            incidentPhoto: '',
            reportedBy: '',
            timeReceive: '',
            timeResponded: '',
            responderResponding: '',
            volunteerResponding: '',
            userId: '',
            // userID: '',
            coordinates: {
                lng: null,
                lat: null
            },
            pointCoords: [],
            error: "",
            latitude: null,
            longitude: null,
            locationPredictions: [],
        };

    }

    signOutUser() {
        app.auth().signOut().then(function () {
            // Sign-out successful.
            console.log("SUCCESFULL LOG OUT");

        }).catch(function (error) {
            // An error happened.
            console.log(error)
        });

    }


    authListener() {
        this._isMounted = true;
        app.auth().onAuthStateChanged(user => {
            if (user) {
                if (this._isMounted) {
                    this.setState({ user, userId: user.uid });
                    this.getUserInfo();
                }
            }
        });
    }

    getUserInfo = () => {
        var userType = '';
        var firstName = '';
        var lastName = '';

        console.log("HI", this.state.userId);
        var user2 = app.database().ref(`users/${this.state.userId}/`);
        user2.on('value', function (snapshot) {
            const data2 = snapshot.val() || null;
            console.log("data2", data2);

            if (data2) {
                userType = data2.user_type;
                firstName = data2.firstName;
                lastName = data2.lastName;
            }

        })
        this.setState({ userType, firstName, lastName });
        console.log("USER TYPE", this.state.userType, this.state.firstName, this.state.lastName, this.state.userId)

    }

    changeIncidentState = (incidentType, incidentLocation, incidentID, destinationPlaceId) => {
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds



        app.database().ref(`incidents/${incidentID}`).update({
            isResponding: true,
            unresponded: false,
            timeResponded: hours + ':' + min + ':' + sec,
            // responderCoords: this.state.pointCoords,
            responderResponding: this.state.userId,
            timeResponded: hours + ':' + min + ':' + sec,
        });

        this.setState({
            isIncidentReady: true,
            incidentLocation,
            incidentType,
            destinationPlaceId,
        })
        // this.getRouteDirection();

        // console.log("NAPASAKA DIRI INCIDNET ID", incidentID);
        this.getRouteDirection(destinationPlaceId, incidentLocation);
    }

    incidentListener = () => {

        var responderListen = app.database().ref(`mobileUsers/Responder/${this.state.userId}`)
        var that = this;
        var incidentDetails = '';
        var incidentID = '';
        responderListen.on('value', (snapshot) => {
            snapshot.forEach(function (childSnapshot) {
                var data = childSnapshot.key;
                console.log("data", data)
                var childData = childSnapshot.val();
                incidentID = childData.incidentID;
                var data2;
                if (incidentID) {
                    console.log("WLECOME", incidentID);
                    var userIncidentId = app.database().ref(`incidents/${incidentID}`)
                    var incidentType = '';
                    var incidentLocation = '';
                    var destinationPlaceId = '';
                    var responderResponding='';
                    var incidentUserId = incidentID;
                    userIncidentId.on('value', function (snapshot) {
                        incidentDetails = snapshot.val() || null;
                        console.log("incident Detials", incidentDetails)
                        incidentType = incidentDetails.incidentType;
                        incidentLocation = incidentDetails.incidentLocation;
                        destinationPlaceId = incidentDetails.destinationPlaceId;
                        if(responderResponding===""){
                        Alert.alert(
                            "INCIDENT DETAILS ",
                            `Incident Type: ${incidentType}
                         Incident Location: ${incidentLocation}
                                                 `
                            ,
                            [
                                { text: "Respond", onPress: () => { that.changeIncidentState(incidentType, incidentLocation, incidentUserId, destinationPlaceId) } },
                            ],
                            { cancelable: false }
                        );}
                        // that.getRouteDirection(destinationPlaceId, incidentLocation);
                    })

                }
                // console.log("NACHANGE", data2, data, childData);
            })

            // this.setState({ incidentID })
            // console.log("hithereeeeee", this.state.incidentID);


            // var userIncidentId = app.database().ref(`incidents/${this.state.incidentID}`);
            // var incidentType = "";
            // var incidentLocation = "";
            // var incidentPhoto = "";
            // userIncidentId.on('value', function (snapshot) {
            //     incidentDetails = snapshot.val() || null;
            //     console.log("incident 222222222222222222", incidentDetails)
            //     incidentType = incidentDetails.incidentType;
            //     incidentLocation = incidentDetails.incidentLocation;
            //     incidentPhoto = incidentDetails.incidentPhoto;
            // })
            // this.setState({ incidentType, incidentLocation, incidentPhoto });
            // this.incidentIsResponded();
            // console.log("incident LOCATION AND TYPE", this.state.incidentType, this.state.incidentLocation)

        })
    }

    componentDidMount() {
        this.authListener();

        this.incidentListener();


        this.watchId = navigator.geolocation.watchPosition(

            position => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });

                this.getRouteDirection(this.state.destinationPlaceId, this.state.incidentLocation);
                app.database().ref(`mobileUsers/Responder/${this.state.userId}`).update({
                    coordinates: {
                        lng: this.state.longitude,
                        lat: this.state.latitude
                    },
                });

            },
            error => this.setState({ error: error.message }),
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
        );
    }


    componentWillUnmount() {
        this._isMounted = false;
        navigator.geolocation.clearWatch(this.watchId);
    }


    async getRouteDirection(destinationPlaceId, destinationName) {
        console.log("HIIII DESTINATION PLACE IS", destinationPlaceId);
        // destinationPlaceId = this.state.incidentPhoto;
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${
                this.state.latitude
                },${
                this.state.longitude
                }&destination=place_id:${destinationPlaceId}&key=${apiKey}`
            );
            const json = await response.json();
            console.log(json);
            const points = PolyLine.decode(json.routes[0].overview_polyline.points);
            const pointCoords = points.map(point => {
                return { latitude: point[0], longitude: point[1] };
            });
            this.setState({
                pointCoords,
                locationPredictions: [],
                incidentLocation: destinationName,
            });
            Keyboard.dismiss();
            this.map.fitToCoordinates(pointCoords);
        } catch (error) {
            console.log(error);
        }
    }


    _toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }


    render() {

        let marker = null;

        if (this.state.pointCoords.length > 1) {
            marker = (
                <Marker
                    coordinate={this.state.pointCoords[this.state.pointCoords.length - 1]}
                />
            );
        }


        if (this.state.latitude === null) return null;

        return (
            <View style={styles.container}>
                <MapView
                    ref={map => { this.map = map; }}
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                    showsUserLocation={true}

                >
                    <Polyline
                        coordinates={this.state.pointCoords}
                        strokeWidth={4}
                        strokeColor="red"
                    />
                    {marker}
                </MapView>
                <TouchableOpacity
                    style={{
                        top: screen.height - 650,
                        paddingLeft: 100
                    }}
                    onPress={() => this.signOutUser()}
                >
                    <Image
                        style={{ width: 65, height: 65 }}
                        source={require("../images/logout.png")}
                    />
                </TouchableOpacity>
                <FloatingAction
        visible={!this.state.isIncidentReady}
        position='left'
        distanceToEdge={20}
        color='#833030'
        overlayColor='rgba(68, 68, 68, 0)'
        floatingIcon={<Icon name='paper-plane' color='white' size={20} />}
        onPressMain={this._toggleModal}
      />
                <Modal isVisible={this.state.isModalVisible}
                    style={{
                        justifyContent: 'center',
                        borderRadius: 20,
                        shadowRadius: 10,
                        width: screen.width - 50,
                        backgroundColor: 'white',

                    }}
                >
                    <TouchableOpacity onPress={this._toggleModal}>
                        <Image
                            style={{ width: 45, height: 45, marginLeft: 240 }}
                            source={require('../images/close.jpg')}
                        />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginTop: 20,
                        marginBottom: 15
                    }}> INCIDENT DESCRIPTION
                    </Text>
                    <Text style={{
                        fontSize: 20,
                        textAlign: 'center',
                        marginTop: 20,
                        marginBottom: 15
                    }}>  {this.state.isIncidentReady === true ? (
                        <Text>
                            Incident Type: {this.state.incidentType}
                            Incident Location: {this.state.incidentLocation}
                        </Text>
                    ) : (<Text> No Incident Yet</Text>)
                        }
                        {/* Incident Type: {this.state.incidentType}
                        Incident Location: {this.state.incidentLocation} */}
                    </Text>
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
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
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
    },
    valueText: {
        fontSize: 18,
        marginBottom: 50,
    },
    destinationInput: {
        borderWidth: 0.5,
        borderColor: "grey",
        height: 40,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        padding: 5,
        backgroundColor: "white"
    },
    locationSuggestion: {
        backgroundColor: "white",
        padding: 3,
        fontSize: 15,
        borderWidth: 0.5
    },
});
