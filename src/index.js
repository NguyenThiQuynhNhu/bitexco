import React, { Component } from 'react'
import { Provider } from 'react-redux'
import * as firebase from 'firebase';

import { StatusBar } from 'react-native';
import colors from './theme/colors';

import configureStore from './redux/store'
import ReduxNavigation from './redux/ReduxNavigation';
import codePush from "react-native-code-push";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDMlI5sMcPqqHnNbCOtj65v8Q812vP8jI8",
    authDomain: "app-building-bitexco.firebaseapp.com",
    databaseURL: "https://app-building-bitexco.firebaseio.com",
    projectId: "app-building-bitexco",
    storageBucket: "app-building-bitexco.appspot.com",
    messagingSenderId: "75650851939"
};
firebase.initializeApp(firebaseConfig);

class AppCustoms extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRehydrated: true,
            store: configureStore(() => this.setState({ isRehydrated: false }))
        }
    }
    componentWillMount() {
        console.disableYellowBox = true

        StatusBar.setBackgroundColor(colors.appTheme);

    }
    render() {
        const { isRehydrated, store } = this.state
        if (isRehydrated) {
            return null
        }
        return (
            <Provider store={store}>
                <ReduxNavigation />
            </Provider>
        )
    }
}

//export default App
let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.IMMEDIATE };
export default App = codePush(codePushOptions)(AppCustoms)