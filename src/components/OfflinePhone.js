import React, { PureComponent } from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet, Alert } from 'react-native';

const { width } = Dimensions.get('window');


class OfflinePhone extends PureComponent {
    state = {
        isConnected: true
    };

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = isConnected => {
        if (isConnected) {
            this.setState({ isConnected: true });
            console.log("connected ba?");
        } else {
            this.setState({ isConnected: false });
            console.log("di connected", isConnected);
        }
    };

    render() {
        let connection;
        if (this.state.isConnected === false) {
            connection = (

                Alert.alert(
                    "No internet connection! ",
                    `Please turn on your mobile data, or connect to a wifi or disable flight mode 
                    ,`,
                    [
                        { text: "Ok", onPress: () => { console.log("ok") } },
                    ],
                    { cancelable: false }
                )

            )
        }

        return (
            <View >
                {connection}
            </View>
        );

    }
}


export default OfflinePhone;