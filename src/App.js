import React, { useState, useEffect } from 'react';
import logo from './SFL Logo Transparent.png';
import './App.css';
import config from './firebase-config';
import Home from './Home';
import StudySession from './StudySession';
// From https://www.npmjs.com/package/react-firebaseui
import firebase from 'firebase';
import { FirestoreProvider } from "@react-firebase/firestore";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app(); // if already initialized, use that one
};

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /home after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/home',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
};

function App() {
  
  return (
    <FirestoreProvider {...config} firebase={firebase}>
      <Router>
        <div>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/study/:sessionInstanceId">
              <StudySession />
            </Route>
            <Route path="/home">
              {/* <h1>My App</h1> */}
              <Home />
            </Route>
            <Route path="/">
              <div className="App">
                <header className="App-header">
                <h1>Welcome to SeekandFind.Life!</h1>
                <img src={logo} alt="logo" style={{width: "300px"}}/>
                <p>Please sign-in:</p>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                </header>
              </div>
              {/* <Splash /> */}
            </Route>
          </Switch>
        </div>
      </Router>
    </FirestoreProvider>
  );
}

export default App;
