import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import React, { Component } from 'react';
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

    render() {
        return (
            <View style={styles.container}>
                {/* <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    initialRegion={{
                        latitude: this.state.lat,
                        longitude: this.state.lng,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                >

                    <MapView.Marker

                        coordinate={{
                            latitude: this.state.lat,
                            longitude: this.state.lng,
                        }}
                    //   description={marker.description}
                    />

                </MapView> */}
                <TouchableOpacity onPress={this.findCoordinates}>
                    <Text>Find My Coords?</Text>
                    <Text>Latitude: {this.state.lat}</Text>
                    <Text>longitude: {this.state.lng}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
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