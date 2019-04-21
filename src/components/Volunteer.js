                        
import React, { Component } from "react";
import { Text, TouchableOpacity, View, Image, Dimensions, TextInput, StyleSheet, TouchableHighlight, Keyboard, Alert } from "react-native";
import Modal from 'react-native-modal';
import Button from 'react-native-button';
import 'babel-polyfill';
import 'es6-symbol';

import app from '../config/fire';
import apiKey from '../config/apiKey';
import _ from 'lodash';

import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';

import PolyLine from '@mapbox/polyline';
var screen = Dimensions.get('window');

export default class Volunteer extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            isAccepted: false,
            isIncidentReady: false,
            destinationPlaceId: '',
            isRequestingVolunteers: '',
            incidentID: '',
            userId: '',
            originalVolunteer: false,
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
            requestVolunteers: false,
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
            console.log("SUCCESFULL LOG OUT");
        }).catch(function (error) {
            console.log(error)
        });

    }


    authListener() {
        // this._isMounted = true;
        app.auth().onAuthStateChanged(user => {
            if (user) {
                if (this._isMounted) {
                    this.setState({ user, userId: user.uid });
                    var userId = this.state.userId
                    this.getUserInfo();
                    this.incidentListener(userId);
                }

            }
        });
    }

    getUserInfo = () => {
        var userType = '';
        var firstName = '';
        var lastName = '';

        console.log("HI", this.state.userId);
        this.user2 = app.database().ref(`users/${this.state.userId}/`);
        this.user2.on('value', function (snapshot) {
            const data2 = snapshot.val() || null;
            console.log("data2", data2);

            if (data2) {
                userType = data2.user_type;
                firstName = data2.firstName;
                lastName = data2.lastName;
            }

        })
        this.setState({ userType, firstName, lastName });

    }

    changeIncidentState = (incidentType, incidentLocation, incidentID, destinationPlaceId, userId) => {

        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds

        app.database().ref(`incidents/${incidentID}`).update({
            isRespondingVolunteer: true,
            unrespondedVolunteer: false,
            volunteerResponding: this.state.userId,
            timeReceive: hours + ':' + min + ';' + sec,
        });

        app.database().ref(`mobileUsers/Volunteer/${this.state.userId}`).update({
            isAccepted: true,
        })
        this.getRouteDirection(destinationPlaceId, incidentLocation);
    }

    arrivedLocation  = () => {
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds

        let incidentID = this.state.incidentId;
        console.log("incidentID on arrived Location", incidentID);
        app.database().ref(`incidents/${incidentID}`).update({
            timeVolunteerResponded: hours + ':' + min + ';' + sec,
        });
    }


    isSettled = () => {
        // var hours = new Date().getHours(); //Current Hours
        // var min = new Date().getMinutes(); //Current Minutes
        // var sec = new Date().getSeconds(); //Current Seconds


        let incidentID = this.state.incidentId;
        let userId = this.state.userId;
        console.log("is settled?", incidentID, userId);

            this.setState({ isSettled: true })
        var volunteerListen = app.database().ref(`mobileUsers/Volunteer/${userId}`)
        volunteerListen.update({
            incidentID: '',
            isAccepted: false,
        })

        // app.database().ref(`incidents/${incidentID}`).update({
        //     // responderResponding: '',
        //     isSettled: true,
        //     // timeResponded: hours + ':' + min + ';' + sec,
        // });
    }

    
    arrivedLocationRequested = () => {
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds

        let incidentID = this.state.incidentId;
        let userId = this.state.userId;
        console.log("incidentID on arrived Location", incidentID, userId);
        app.database().ref(`incidents/${incidentID}/requestVolunteers/${userId}`).update({
            timeArrived: hours + ':' + min + ';' + sec,
        });
    }


    isRequestingVolunteers = (incidentId, userId, destinationPlaceId, incidentLocation) => {
        console.log("REQUEST", this.state.userId);
        this.setState({
            isRequestingVolunteers: true,
            isIncidentReady: true,
            requestVolunteers: true,
        })

        app.database().ref(`incidents/${incidentId}/requestVolunteers/${userId}`).update({
            timeArrived: '',
        });
        this.getRouteDirection(destinationPlaceId, incidentLocation);
    }

    incidentListener = (userId) => {
        // this._isMounted = true;
        console.log("INCIDNE LISTENER", userId);
        this.volunteerListen = app.database().ref(`mobileUsers/Volunteer/${userId}`)
        var that = this;
        var incidentDetails = '';


        this.volunteerListen.on('value', (snapshot) => {
            if (this._isMounted) {


                var data = snapshot.val();
                var incidentID = data.incidentID;
                console.log("incident ID", incidentID);

                if (incidentID !== "") {
                    console.log("hey i got here");
                    this.userIncidentId = app.database().ref(`incidents/${incidentID}`)
                    this.userIncidentId.on('value', (snapshot) => {
                        incidentDetails = snapshot.val() || null;
                        var incidentType = incidentDetails.incidentType;
                        var incidentLocation = incidentDetails.incidentLocation;
                        var destinationPlaceId = incidentDetails.destinationPlaceId;
                        var volunteerResponding = incidentDetails.volunteerResponding;
                        var isSettled = incidentDetails.isSettled;
                        var isRequestingVolunteers = incidentDetails.isRequestingVolunteers;

                        if (incidentID && volunteerResponding === "" && isSettled === false) {
                            Alert.alert(
                                "INCIDENT DETAILS ",
                                `Incident Type: ${incidentType}
                                                 Incident Location: ${incidentLocation}
                                                                         `
                                ,
                                [
                                    { text: "Respond", onPress: () => { that.changeIncidentState(incidentType, incidentLocation, incidentID, destinationPlaceId, userId) } },
                                    {
                                                                                text: 'Reject',
                                                                                onPress: () => console.log('Rejected'),
                                                                                style: 'cancel',
                                                                            },
                                ],
                                { cancelable: false }
                            );
                            if (that._isMounted) {
                                that.setState({ originalVolunteer: true, isIncidentReady: true, incidentType, incidentLocation, destinationPlaceId, userId, incidentId: incidentID });
                            }
                        }
                        else if (volunteerResponding === userId && isSettled === false) {
                            console.log("same volunteer");
                            if (that._isMounted) {
                                that.setState({ originalVolunteer: true, isIncidentReady: true, incidentType, incidentLocation, destinationPlaceId, userId,  incidentID, isSettled: false });
                                that.getRouteDirection(destinationPlaceId, incidentLocation);
                            }

                            // that.isSettled();
                        }
                        else if (volunteerResponding !== userId && isRequestingVolunteers === true && this.state.requestVolunteers === false) {
                            Alert.alert(
                                "REQUESTING ADDITIONAL VOLUNTEER ",
                                `Incident Type: ${incidentType}
                                                 Incident Location: ${incidentLocation}
                                                                         `
                                ,
                                [
                                    { text: "Respond", onPress: () => { that.isRequestingVolunteers(incidentID, userId, destinationPlaceId, incidentLocation) } },
                                    {
                                                                                text: 'Reject',
                                                                                onPress: () => console.log('Rejected'),
                                                                                style: 'cancel',
                                                                            },
                                ],
                                { cancelable: false }
                            );     
                                that.setState({incidentType, incidentLocation, destinationPlaceId, incidentId: incidentID, userId});
                        } 
                        else if (volunteerResponding === userId && isSettled === true){
                            console.log("same additional volunteer has acceted")
                            that.setState({ isIncidentReady: false, isSettled: true });
                        } 
                        else if (volunteerResponding !== userId && isRequestingVolunteers === true && this.state.requestVolunteers === true) {
                            that.setState({incidentType, incidentLocation, destinationPlaceId, incidentId: incidentID, userId});
                        }
                        else {
                            console.log("system is FLAWED")
                        }
                    })
                }
                else {
                    console.log("incident Id is not here");
                    if (that._isMounted) {
                        that.setState({ isIncidentReady: false, destinationPlaceId: '', incidentLocation: '' });
                    }
                    console.log("incident is not ready", that.state.isIncidentReady);
                }
            }
        })

    }

    componentDidMount() {
        this._isMounted = true;

        this.authListener();

        this.watchId = navigator.geolocation.watchPosition(

            position => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                // if (this.state.destinationPlaceId) {
                //     this.getRouteDirection(this.state.destinationPlaceId, this.state.incidentLocation);
                // }
                app.database().ref(`mobileUsers/Volunteer/${this.state.userId}`).update({
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
        this.user2.off();
        this.volunteerListen.off();
        this.userIncidentId.off();
    }


    async getRouteDirection(destinationPlaceId, destinationName) {

        if (this._isMounted) {
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


        let polylinemarker = null;

        polylinemarker = (
            <Polyline
                coordinates={this.state.pointCoords}
                strokeWidth={4}
                strokeColor="red"
            />
        )




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
                    {this.state.isSettled === false ? polylinemarker : null}
                    {this.state.isSettled === false ? marker : null}
                </MapView>
                <TouchableOpacity
                    style={{
                        top: screen.height - 650,
                        left: screen.width - 100,

                    }}
                    onPress={() => this.signOutUser()}
                >
                    <Image
                        style={{ width: 75, height: 75 }}
                        source={require("../images/exit.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{ top: screen.height - 200, left: screen.width - 100, paddingBottom: 30 }} onPress={this._toggleModal}>
                    <Image
                        style={{ width: 70, height: 70 }}
                        source={require('../images/waitIncident.png')}
                    />
                </TouchableOpacity>
                {this.state.isIncidentReady === true  && this.state.originalVolunteer === true ? (
                    <TouchableOpacity style={{ top: screen.height - 450, left: screen.width - 100, paddingBottom: 30 }} onPress={this.arrivedLocation}>
                        <Image
                            style={{ width: 70, height: 70 }}
                            source={require('../images/arrived.png')}
                        /> 
                    </TouchableOpacity>

                ) : (null)
                }
                 {this.state.isIncidentReady === true && this.state.isRequestingVolunteers === true ? (
                    <TouchableOpacity style={{ top: screen.height - 450, left: screen.width - 100, paddingBottom: 30 }} onPress={this.arrivedLocationRequested}>
                        <Image
                            style={{ width: 70, height: 70 }}
                            source={require('../images/arrived.png')}
                        /> 
                    </TouchableOpacity>

                ) : (null)
                }
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
                    </Text>
                    {this.state.isIncidentReady === true ? (
                        <Button
                            style={{ fontSize: 18, color: 'white' }}
                            onPress={this.isSettled}
                            containerStyle={{
                                padding: 8,
                                marginLeft: 70,
                                marginRight: 70,
                                height: 40,
                                borderRadius: 6,
                                backgroundColor: 'mediumseagreen',
                                marginTop: 20,
                            }}
                        >
                            <Text style={{ justifyContent: 'center', color: 'white' }} >Incident OK</Text>
                        </Button>
                    ) : (null)
                    }
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