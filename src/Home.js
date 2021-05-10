import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import StudySessionCard from './shared_components/StudySessionCard';
import { FirestoreCollection } from "@react-firebase/firestore";
import firebase from 'firebase';
import config from './firebase-config';
import {
  Redirect
} from "react-router-dom";

if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app(); // if already initialized, use that one
};

var authUser = firebase.auth().currentUser;
var db = firebase.firestore();

// TODO --DTM-- REMOVE
console.log("authUser: ", authUser);
if (authUser != null) {
  authUser.providerData.forEach(function (profile) {
    console.log("Profile: ", profile);
    console.log("Sign-in provider: " + profile.providerId);
    console.log("  Provider-specific UID: " + profile.uid);
    console.log("  Name: " + profile.displayName);
    console.log("  Email: " + profile.email);
    console.log("  Photo URL: " + profile.photoURL);
  });
}

function Home() {
  const [authUser, setAuthUser] = useState({});
  const [user, setUser] = useState({});
  const [redirect, setRedirect] = useState(false);
  const [sessionInstanceList, setSessionInstanceList] = useState([]);

  console.log("sessionInstanceList: ", sessionInstanceList);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(authUser) {
      if (authUser) {
        console.log("authUser2: ", authUser);
        // User is signed in.
        setAuthUser(authUser);
        // TODO --DTM-- Create user if they don't exist
        let userRef = db.collection("users").doc(authUser.uid);
        userRef.get().then((user) => {
            if (user.exists) {
                console.log("User:", user.data());
                setUser(user.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such user!");

                // Create user
                let userObj = {
                  name: authUser.displayName,
                  email: authUser.email,
                  photoURL: authUser.photoURL,
                  uid: authUser.uid
                };
        
                userRef.set(userObj, { merge: true })
                .then(() => {
                  setUser(userObj);
                  console.log("User successfully created!");
                })
                .catch((error) => {
                  console.error("Error writing document: ", error);
                });
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        
      } else {
        // No user is signed in.
        setRedirect(true);
      }
    });

  }, [])

  function signOut(e) {
    e.preventDefault();
    console.log('The link was clicked.');
    firebase.auth().signOut();
    // TODO --DTM-- figure out redirect
  }

  // If not logged in, redirect
  if (redirect) {
    // No user is signed in, redirect to Splash
    return (<Redirect
      to={{
        pathname: "/",
      }}
    />);
  } else {
    if (user) {
      console.log("sessionInstanceList2: ", sessionInstanceList.length);
      return(
        // User is signed in.
        <div className="App">
          <header className="App-header">
            <h1>Home</h1>
            {/* // TODO --DTM-- dynamic userId */}
            <FirestoreCollection 
              path="/sessionInstances/" 
              where={{field: "user_id", operator: "==", value: user.uid
              }}>

              {d => {
                let sessionInstances = [];
                console.log('d: ', d);
                if(d.value) {
                  d.value.map((sessionInstance, index) => {
                    console.log('sessionInstance3: ', sessionInstance);
                    sessionInstances.push(<StudySessionCard 
                      key={index} 
                      sessionInstance={sessionInstance}
                      sessionInstanceId={d.ids[index]} />);
                  });
                }
                return (sessionInstances);
              }}
            </FirestoreCollection>
            <a 
              className="App-link"
              href="#"
              onClick={(e) => signOut(e)}>Sign out</a>
          </header>
        </div>
      );
    } else {
      // User is signed in.
      return(
        <div className="App">
          <header className="App-header">
          <h1>Loading...</h1>
          </header>
        </div>
      );
    }

  };

}

export default Home;
