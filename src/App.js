import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
// From https://www.npmjs.com/package/react-firebaseui
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// Configure Firebase.
const config = {
  apiKey: "AIzaSyBrDn6coasn_PKyLnTqQ222G8iJ6MIVC3w",
  authDomain: "seekandfind-life.firebaseapp.com",
  projectId: "seekandfind-life",
  storageBucket: "seekandfind-life.appspot.com",
  messagingSenderId: "1058318644602",
  appId: "1:1058318644602:web:700bbc505407d23f33d2c3",
  measurementId: "G-EVJSDY4F7F"
  // ...
};
firebase.initializeApp(config);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/signedIn',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
};

function App() {
  
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/signedIn">
            <h1>My App</h1>
            {/* <Home /> */}
          </Route>
          <Route path="/">
            <div className="App">
              <header className="App-header">
              <h1>My App</h1>
              <p>Please sign-in:</p>
              <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />

                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
              </header>
            </div>
            {/* <Splash /> */}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
