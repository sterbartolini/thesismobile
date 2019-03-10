import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import React, { Component } from 'react';
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

    render() {
        return (
            <View style={styles.container}>
                {/* <Header /> */}
                <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                >

                    <MapView.Marker
                        coordinate={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                        }}
                    />
                </MapView>

                <ModalTester />
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
});

export default Map;