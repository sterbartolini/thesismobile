

import React, { Component } from "react";
import { Text, TouchableOpacity, View, Image, Dimensions, TextInput, StyleSheet, TouchableHighlight, Keyboard, Alert } from "react-native";
import Modal from 'react-native-modal';
import Button from 'react-native-button';
import 'babel-polyfill';
import 'es6-symbol';
import RadioGroup from 'react-native-radio-buttons-group';
import apiKey from '../config/apiKey';
import _ from 'lodash';

import app from '../config/fire';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';

import PolyLine from '@mapbox/polyline';



var screen = Dimensions.get('window');

export default class RegularUser extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            hasResponderAlerted: false,
            hasVolunteerAlerted: false,
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
            incidentID: '',
            incidentUserKey: '',
            incidentPhoto: '',
            reportedBy: '',
            timeReceive: '',
            timeResponded: '',
            responderResponding: '',
            volunteerResponding: '',
            userId: '',
            destinationPlaceId: '',
            responderLat: null,
            responderLng: null,
            volunteerLat: null,
            volunteerLng: null,
            isRequestingResponders: false,
            isRequestingVolunteers: false,
            responderRespondingID: '',
            coordinates: {
                lng: null,
                lat: null
            },
            markerCoords: {
                lng: null,
                lat: null
            },
            pointCoords: [],
            markerCoordsLat: null,
            markerCoordsLng: null,
            error: "",
            latitude: null,
            longitude: null,
            locationPredictions: [],
            data: [
                {
                    label: "Vehicular Accident",
                    value: "Vehicular Accident"
                },
                {
                    label: "Physical Injury",
                    value: "Physical Injury"
                }
            ]
        };
        this.onChangeDestinationDebounced = _.debounce(
            this.onChangeDestination,
            1000
        );
    }
    onPress = data => {
        this.setState({ data });

        let selectedButton = this.state.data.find(e => e.selected == true);
        selectedButton = selectedButton ? selectedButton.value : this.state.data[0].label;
        this.setState({ incidentType: selectedButton });

    }

    authListener() {
        this._isMounted = true;
        app.auth().onAuthStateChanged(user => {
            if (user) {
                if (this._isMounted) {
                    this.setState({ user, userId: user.uid });
                    this.getUserInfo();
                    this.incidentState(this.state.userId);
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
        console.log("USER TYPE", this.state.userType, this.state.firstName, this.state.lastName, this.state.userId)

    }

    componentDidMount() {

        this.authListener();



        this.watchId = navigator.geolocation.watchPosition(

            position => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });

                app.database().ref(`mobileUsers/Regular User/${this.state.userId}`).update({
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



    responderCoordinates = () => {

        console.log("Welcome RESPONDER", this.state.responderRespondingID);
        this.userIncidentId = app.database().ref(`mobileUsers/Responder/${this.state.responderRespondingID}`)
        var latitude = '';
        var longitude = '';
        var that = this;
        if (this.state.responderRespondingID) {
            this.userIncidentId.on('value', function (snapshot) {
                incidentDetails = snapshot.val() || null;
                latitude = incidentDetails.coordinates.lat;
                longitude = incidentDetails.coordinates.lng;
                console.log("LAT AND LONG OF RESPONDER USERSS", incidentDetails.coordinates.lat);
                that.setState({
                    responderLat: latitude,
                    responderLng: longitude,
                })
            })
        }
    }

    volunteerCoordinates = () => {

        console.log("Welcome Volunteer", this.state.volunteerRespondingID);
        var userIncidentId = app.database().ref(`mobileUsers/Volunteer/${this.state.volunteerRespondingID}`)
        var latitude = '';
        var longitude = '';
        var that = this;
        if (this.state.volunteerRespondingID) {
            userIncidentId.on('value', function (snapshot) {
                incidentDetails = snapshot.val() || null;
                latitude = incidentDetails.coordinates.lat;
                longitude = incidentDetails.coordinates.lng;
                console.log("LAT AND LONG OF VOLUNTEER USERSSS", incidentDetails.coordinates.lat);
                that.setState({
                    volunteerLat: latitude,
                    volunteerLng: longitude,
                })
            })
        }
    }

    incidentState = (userId) => {
        console.log("user id here", this.state.userId);
        // var regularUserListen = app.database().ref(`mobileUsers/Regular User/${this.state.userId}/`);

        var that = this;

        console.log("this state", this.state.userId)
        console.log("user bit not state", userId);
        this.regularUserListen = app.database().ref(`mobileUsers/Regular User/${userId}`);
        this.regularUserListen.on('value', function (snapshot) {

            const snap = snapshot.val() || null;
            console.log("user data mobile regular", snap);
            var incidentID = snap.incidentID;
            console.log("INCIDENt", incidentID);
            // if (incidentID) {
            //     that.incidentResponderListener(incidentID);
            //     that.incidentVolunteerListener(incidentID);
            //     that.setState({ incidentID })
            // }
            if (incidentID !== "") {
                console.log("hey i got here");
                this.incidentIDListen = app.database().ref(`incidents/${incidentID}`)
                this.incidentIDListen.on('value', (snapshot) => {
                    incidentDetails = snapshot.val() || null;

                    var markerCoordsLat = incidentDetails.coordinates.lat;
                    var markerCoordsLng = incidentDetails.coordinates.lng;
                    console.log("COORDINATES", markerCoordsLat, markerCoordsLng);
                    var reportedBy = incidentDetails.reportedBy
                    var isSettled = incidentDetails.isSettled;
                    var incidentType = incidentDetails.incidentType;
                    var incidentLocation = incidentDetails.incidentLocation;
                    if (reportedBy === userId && isSettled === false) {

                        that.incidentResponderListener(incidentID);
                        that.incidentVolunteerListener(incidentID);
                        that.setState({ markerCoordsLat, markerCoordsLng, isSettled: false });



                    }
                    else if (reportedBy === userId && isSettled === true) {
                        that.incidentSettled(userId, incidentType, incidentLocation);

                    }
                })
            }
            else {
                console.log("incident Id is not here");
                // if (that._isMounted) {
                //     that.setState({ destinationPlaceId: '', incidentLocation: '' });
                // }
                console.log("incident is not ready", that.state.isIncidentReady);
            }
        })
    }

    incidentSettled = (userId, incidentType, incidentLocation) => {


        this.setState({ isSettled: true })
        this.setState({ markerCoords: null });

        Alert.alert(
            "INCIDENT HAS BEEN RESPONDED!! ",
            `Incident Type: ${incidentType}
                             Incident Location: ${incidentLocation}
                                                     `
            ,
            [
                { text: "Ok", onPress: () => { console.log("ok") } },
            ],
            { cancelable: false }
        );

        var responderListen = app.database().ref(`mobileUsers/Regular User/${userId}`)
        responderListen.update({
            incidentID: '',
        })

    }

    hasResponderAlert = () => {
        var hasResponderAlerted = true;
        this.setState({ hasResponderAlerted });
        console.log("ALERT HAS BEEN TRIGGERED");
    }

    incidentResponderListener = (incidentID) => {
        console.log("naa ka diri?", incidentID)
        console.log("hi there", this.state.incidentID);
        this.responderListen = app.database().ref(`incidents/${incidentID}`)
        var that = this;
        var responderRespondingID = '';
        var hasResponderAlerted = this.state.hasResponderAlerted;

        this.responderListen.on('value', function (snapshot) {
            const data2 = snapshot.val() || null;
            console.log("data2222222222222222", data2);

            if (data2) {
                responderRespondingID = data2.responderResponding;
                // var destinationPlaceId = data2.destinationPlaceId;
                if (responderRespondingID) {
                    if (hasResponderAlerted === false) {
                        Alert.alert(
                            "A Responder has accepted an incident "
                            , `${responderRespondingID}`,
                            [
                                {
                                    text: "Ok", onPress: () => {
                                        that.hasResponderAlert
                                    }
                                },
                            ],
                            { cancelable: false }
                        );
                    }
                    console.log("responder responding", responderRespondingID);
                    that.setState({ responderRespondingID });
                    that.responderCoordinates(responderRespondingID)
                }
                else {
                    console.log("responder NOT responding", responderRespondingID);
                    that.setState({ responderRespondingID });
                    that.responderCoordinates(responderRespondingID)
                }

            }

        })
    }

    hasVolunteerAlert = () => {
        var hasVolunteerAlerted = true;
        this.setState({ hasVolunteerAlerted });
        console.log("ALERT HAS BEEN TRIGGERED");
    }

    incidentVolunteerListener = (incidentID) => {
        console.log("naa ka diri?", incidentID)
        console.log("hi there", this.state.incidentID);
        this.volunteerListen = app.database().ref(`incidents/${incidentID}`)
        var that = this;
        let volunteerRespondingID = '';

        let hasVolunteerAlerted = this.state.hasVolunteerAlerted;
        this.volunteerListen.on('value', function (snapshot) {
            const data2 = snapshot.val() || null;
            console.log("data333333", data2);

            if (data2) {
                volunteerRespondingID = data2.volunteerResponding;

                if (volunteerRespondingID) {
                    if (hasVolunteerAlerted === false) {
                        Alert.alert(
                            "A Volunteer has accepted an incident "
                            , `${volunteerRespondingID}`,
                            [
                                { text: "Ok", onPress: () => { that.hasVolunteerAlert } },
                            ],
                            { cancelable: false }
                        );

                    }
                    console.log("volunteer responding", volunteerRespondingID);
                    that.setState({ volunteerRespondingID });
                    that.volunteerCoordinates(volunteerRespondingID)
                } else {
                    console.log("volunteer responding", volunteerRespondingID);
                    that.setState({ volunteerRespondingID });
                    that.volunteerCoordinates(volunteerRespondingID)
                }

            }

        })
    }

    componentWillUnmount() {
        this._isMounted = false;
        navigator.geolocation.clearWatch(this.watchId);
        this.volunteerListen.off();
        this.responderListen.off()
        this.regularUserListen.off();
        this.user2.off();
        this.userIncidentId.off();
        this.incidentIDListen.off();
    }



    async getRouteDirection(destinationPlaceId, destinationName) {
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
                destinationPlaceId,
            });
            Keyboard.dismiss();
            this.map.fitToCoordinates(pointCoords);
        } catch (error) {
            console.error(error);
        }
    }

    async onChangeDestination(incidentLocation) {
        this.setState({ incidentLocation });
        const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input={${incidentLocation}}&location=${
            this.state.latitude
            },${this.state.longitude}&radius=2000`;
        const result = await fetch(apiUrl);
        const jsonResult = await result.json();
        this.setState({
            locationPredictions: jsonResult.predictions
        });
        console.log(jsonResult);
    }

    _toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    setIncidentID = () => {
        app.database().ref(`mobileUsers/Regular User/${this.state.userId}`).update({
            incidentID: this.state.incidentUserKey,
        });

    }

    submitIncidentHandler = () => {
        var time = new Date();
        var date = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });


        var coords = this.state.pointCoords;
        var coords2 = this.state.pointCoords[coords.length - 1];
        var coordLat = coords2.latitude;
        var coordLng = coords2.longitude;
        app.database().ref("/incidents").push({
            incidentType: this.state.incidentType,
            incidentLocation: this.state.incidentLocation,
            unresponded: true,
            isResponding: false,
            isSettled: false,
            incidentPhoto: '',
            reportedBy: this.state.userId,
            timeReceive: date,
            timeResponded: '',
            responderResponding: '',
            volunteerResponding: '',
            coordinates: {
                lat: coordLat,
                lng: coordLng
            },
            destinationPlaceId: this.state.destinationPlaceId,
            isRequestingResponders: false,
            isRequestingVolunteers: false,
        }).then((snap) => {
            const incidentUserKey = snap.key
            this.setState({ incidentUserKey })
            console.log("INCIDENT USER KEY HEREEEEE: ", this.state.userId);
        })
        this.setState({
            incidentType: '',
            incidentLocation: '',
            unresponded: null,
            isResponding: null,
            isSettled: null,
            incidentPhoto: '',
            reportedBy: '',
            timeReceive: '',
            timeResponded: '',
            responderResponding: '',
            volunteerResponding: '',
            coordinates: {
                lat: null,
                lng: null
            },
            markerCoords: {
                lat: null,
                lng: null
            },
            destinationPlaceId: '',
            isRequestingResponders: false,
            isRequestingVolunteers: false,


        });
        console.log(this.state.incidentsList);
        Alert.alert(
            'Attention: ',
            'Report has been sent',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.setIncidentID() },
            ],
            { cancelable: false },
        );
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

    render() {
        console.log("marekr coords", this.state.markerCoordsLat, this.state.markerCoordsLng, this.state.isSettled);
        let marker = null;
        if (this.state.coordinates.lat) {
            marker = (
                <Marker
                    coordinate={
                        {
                            latitude: this.state.markerCoordsLat,
                            longitude: this.state.markerCoordsLng
                        }
                    }
                />

            )
        }
        var markerResponder = null;
        if (this.state.responderLat) {
            markerResponder = (
                <Marker
                    coordinate={{
                        latitude: this.state.responderLat,
                        longitude: this.state.responderLng,
                    }}
                />
            );
        }

        var markerVolunteer = null;
        if (this.state.volunteerLat) {
            markerVolunteer = (
                <Marker
                    coordinate={{
                        latitude: this.state.volunteerLat,
                        longitude: this.state.volunteerLng,
                    }}
                />
            );
        }
        if (this.state.latitude === null) return null;

        const locationPredictions = this.state.locationPredictions.map(
            prediction => (
                <TouchableHighlight
                    key={prediction.id}
                    onPress={() =>
                        this.getRouteDirection(
                            prediction.place_id,
                            prediction.description
                        )
                    }
                >

                    <Text style={styles.locationSuggestion}>
                        {prediction.description}
                    </Text>
                </TouchableHighlight>
            )
        );


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
                    {/* <Polyline
                        coordinates={this.state.pointCoords}
                        strokeWidth={4}
                        strokeColor="red"
                    /> */}
                    {this.state.isSettled === true ? null : marker}
                    {this.state.isSettled === true ? null : markerResponder}
                    {this.state.isSettled === true ? null : markerVolunteer}

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
                <TouchableOpacity style={{ top: screen.height - 200, right: screen.width - 450, paddingBottom: 30 }} onPress={this._toggleModal}>
                    <Image
                        style={{ width: 70, height: 70 }}
                        source={require('../images/send.png')}
                    />
                </TouchableOpacity>
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
                            source={require('../images/cancel.png')}
                        />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginTop: 20,
                        marginBottom: 15
                    }}>INPUT INCIDENT
                    </Text>
                    <RadioGroup radioButtons={this.state.data} onPress={this.onPress} />
                    <TextInput
                        placeholder="Enter location.."
                        style={styles.destinationInput}
                        onChangeText={incidentLocation => {
                            this.setState({ incidentLocation });
                            this.onChangeDestinationDebounced(incidentLocation);
                        }}
                        value={this.state.incidentLocation}

                    />
                    {locationPredictions}
                    <Button
                        style={{ fontSize: 18, color: 'white' }}
                        onPress={this.submitIncidentHandler}
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
                        <Text style={{ justifyContent: 'center', color: 'white' }} >Submit Incident</Text>
                    </Button>
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
