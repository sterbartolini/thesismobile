import React, { Component } from 'react';
import { Router, Stack, Scene } from 'react-native-router-flux';

import Login from './components/Login';
import Register from './components/Register';
import userMap from './components/Map';

export default class Routes extends Component {
    render() {
        return (
            <Router>
                <Stack key="root" hideNavBar={true}>
                    <Scene key="login" component={Login} title="Login" initial={true} />
                    <Scene key="signup" component={Register} title="Register" />
                    <Scene key="userMap" component={userMap} title="maps" />
                </Stack>
            </Router>
        )
    }
}