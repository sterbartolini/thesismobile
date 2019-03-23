// import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
// import React, { Component } from 'react';
// import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, Alert, } from 'react-native';
// import ReportIncident from './ReportIncident';
// import UserProfile from './userProfile';
// import apiKey from '../config/apiKey';

// import PolyLine from '@mapbox/polyline';
// class UserMap extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             error: "",
//             latitude: 0,
//             longitude: 0,
//             pointCoords: [],
//         };
//     }


//     componentDidMount() {
//         //Get current location and set initial region to this
//         navigator.geolocation.getCurrentPosition(
//             position => {
//                 this.setState({
//                     latitude: position.coords.latitude,
//                     longitude: position.coords.longitude
//                 });
//                 this.getRouteDirections()
//             },
//             error => this.setState({ error: error.message }),
//             { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
//         );
//     }

//     async getRouteDirections() {
//         try {
//             const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}&destination=place_id:${this.props.destinationID}&key=${apiKey}`);
//             const json = await response.json();
//             const points = PolyLine.decode(json.routes[0].overview_polyline.points);
//             const pointCoords = points.map(point => {
//                 return { latitude: point[0], longitude: point[1] };
//             });
//             this.setState({ pointCoords });
//             this.map.fitToCoordinates(pointCoords);
//             console.log("HOYYYY", this.props.destinationID)
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     // findCoordinates = () => {
//     //     navigator.geolocation.getCurrentPosition(
//     //         position => {
//     //             const lat = JSON.stringify(position.coords.latitude);
//     //             const lng = JSON.stringify(position.coords.longitude);

//     //             this.setState({ lat, lng });
//     //         },
//     //         error => Alert.alert(error.message),
//     //         { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//     //     );
//     // };


//     render() {
//         return (
//             <View style={styles.container}>
//                 {/* <TouchableOpacity onPress={this.findCoordinates}> */}
//                 <MapView
//                     ref={map => { this.map = map; }}
//                     provider={PROVIDER_GOOGLE} // remove if not using Google Maps
//                     style={styles.map}
//                     region={{
//                         latitude: this.state.latitude,
//                         longitude: this.state.longitude,
//                         latitudeDelta: 0.015,
//                         longitudeDelta: 0.0121,
//                     }}
//                     showsUserLocation={true}

//                 >
//                     <Polyline
//                         coordinates={this.state.pointCoords}
//                         strokeWidth={4}
//                         strokeColor="red"
//                     />


//                 </MapView>
//                 <ReportIncident />
//                 <UserProfile />
//                 {/* </TouchableOpacity> */}
//                 {/* <TouchableOpacity onPress={this.findCoordinates}>
//                     <Text>Find My Coords?</Text>
//                     <Text>Latitude: {this.state.lat}</Text>
//                     <Text>longitude: {this.state.lng}</Text>
//                 </TouchableOpacity> */}
//             </View >
//         );
//     }
// }


// const styles = StyleSheet.create({
//     container: {
//         ...StyleSheet.absoluteFillObject,
//         flex: 1,
//         // justifyContent: 'center',
//         // alignItems: 'center',
//     },
//     map: {
//         ...StyleSheet.absoluteFillObject,
//     },
//     welcome: {
//         fontSize: 20,
//         textAlign: "center",
//         margin: 10
//     },
// });

// UserMap.defaultProps = {
//     destinationID: '',
// }

// export default UserMap;