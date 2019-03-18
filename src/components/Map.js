import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import React, { Component } from 'react';
<<<<<<< HEAD
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, Alert, } from 'react-native';


class Map extends Component {
    state = {
        location: 0,
        lat: 0,
        lng: 0,
    };

    findCoordinates = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = JSON.stringify(position.coords.latitude);
                const lng = JSON.stringify(position.coords.longitude);

                this.setState({ lat, lng });
            },
            error => Alert.alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };
=======
import { StyleSheet, View, TouchableHighlight, Image, Dimensions } from 'react-native';
// import Modal from 'react-native-modalbox';
// import Button from 'react-native-button';
// import AddModal from './AddIncidentModal';
import ModalTester from './AddIncidentModal';
import Header from './Header';

var screen = Dimensions.get('window');


class Map extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = ({
    //         deletedRowKey: null,
    //     });
    //     this._onPressAdd = this._onPressAdd.bind(this);
    // }

    // _onPressAdd() {
    //     // alert("You add Item");
    //     this.refs.addModal.showAddModal();
    // }
>>>>>>> ef66af1adc0a1e8de11bd76d1a3cfac8b077fd10

    render() {
        return (
            <View style={styles.container}>
<<<<<<< HEAD
                {/* <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    initialRegion={{
                        latitude: this.state.lat,
                        longitude: this.state.lng,
=======
                {/* <Header /> */}
                <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={{
                        latitude: 37.78825,
                        longitude: -122.4324,
>>>>>>> ef66af1adc0a1e8de11bd76d1a3cfac8b077fd10
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                >

                    <MapView.Marker

                        coordinate={{
                            latitude: this.state.lat,
                            longitude: this.state.lng,
                        }}
                    />
<<<<<<< HEAD

                </MapView> */}
                <TouchableOpacity onPress={this.findCoordinates}>
                    <Text>Find My Coords?</Text>
                    <Text>Latitude: {this.state.lat}</Text>
                    <Text>longitude: {this.state.lng}</Text>
                </TouchableOpacity>
=======
                </MapView>

                <ModalTester />
>>>>>>> ef66af1adc0a1e8de11bd76d1a3cfac8b077fd10
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        width: screen.width,
        height: screen.height - 20,
        // justifyContent: 'center',
        // alignItems: 'center',

    },
    map: {
        ...StyleSheet.absoluteFillObject,

    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
});

export default Map;