import React, { Component } from "react";
import { Text, TouchableOpacity, View, Image, Dimensions, TextInput } from "react-native";
import Modal from 'react-native-modal';
import Button from 'react-native-button'

var screen = Dimensions.get('window');

export default class ReportIncident extends Component {
    state = {
        isModalVisible: false,
    };

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
                    <TextInput
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
                        placeholder="Enter Incident"
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
                        placeholder="Enter Location"
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
                    </Button>

                    {/* </View> */}
                </Modal>
            </View>
        );
    }
}