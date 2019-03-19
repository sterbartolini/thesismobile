import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, Alert, } from 'react-native';



class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            latitude: 0,
            longitude: 0,
        };
    }


    componentDidMount() {
        //Get current location and set initial region to this
        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            error => this.setState({ error: error.message }),
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
        );
    }

    // findCoordinates = () => {
    //     navigator.geolocation.getCurrentPosition(
    //         position => {
    //             const lat = JSON.stringify(position.coords.latitude);
    //             const lng = JSON.stringify(position.coords.longitude);

    //             this.setState({ lat, lng });
    //         },
    //         error => Alert.alert(error.message),
    //         { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    //     );
    // };

    render() {
        return (
            <View style={styles.container}>
                {/* <TouchableOpacity onPress={this.findCoordinates}> */}
                <MapView
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

                    {/* <MapView.Marker

                        coordinate={{
                            latitude: 37.7882,
                            longitude: -122.432,
                        }}
                    //   description={marker.description}
                    /> */}

                </MapView>
                {/* </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={this.findCoordinates}>
                    <Text>Find My Coords?</Text>
                    <Text>Latitude: {this.state.lat}</Text>
                    <Text>longitude: {this.state.lng}</Text>
                </TouchableOpacity> */}
            </View >
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