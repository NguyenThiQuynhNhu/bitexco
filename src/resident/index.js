import React, { Component } from 'react'
import { Provider } from 'react-redux'
import * as firebase from 'firebase';

import AppNavigatorWithState from './navigators/AppNavigators'
import configureStore from './redux/store'
import ReduxNavigation from './redux/ReduxNavigation';

import { StatusBar, View } from 'react-native';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBf6qgR_hZAw6oat2rDx0-x4g4YNqSJUM0",
    authDomain: "app-bd-xuan-mai-v2.firebaseapp.com",
    databaseURL: "https://app-bd-xuan-mai-v2.firebaseio.com",
    projectId: "app-bd-xuan-mai-v2",
    storageBucket: "app-bd-xuan-mai-v2.appspot.com",
    messagingSenderId: "699764566128"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRehydrated: true,
            store: configureStore(() => this.setState({ isRehydrated: false }))
        }
    }
    componentDidMount() {
        console.disableYellowBox = true
        StatusBar.setBackgroundColor('#6a961f');  
    }
    render() {
        const { isRehydrated, store } = this.state
        if (isRehydrated) {
            return null
        }
        return (
            <Provider store={store}>
                {/* <AppNavigatorWithState /> */}
                <ReduxNavigation />
            </Provider>
        )
    }
}

export default App
