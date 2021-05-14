import React, { useState, useEffect, useReducer } from 'react';
import { FirestoreCollection } from "@react-firebase/firestore";
import { useParams } from "react-router-dom";
import StudyUnit from './shared_components/StudyUnit';
import firebase from 'firebase';

const initialState = {unitIndex: 0};

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return {
                sessionInstance: {
                    currentUnitIndex: state.sessionInstance.currentUnitIndex + 1
                }
            };
        case 'decrement':
            return {
                sessionInstance: {
                    currentUnitIndex: state.sessionInstance.currentUnitIndex - 1
                }
            };
        default:
            throw new Error();
    }
}

function StudySession(props) {
    // const [unitIndex, setUnitIndex] = useState(0);
    const [state, dispatch] = useReducer(reducer, initialState);
    const [sessionInstance, setSessionInstance] = useState({});

    let { sessionInstanceId } = useParams();
    firebase.analytics().logEvent('study_session_started',{
        user_uid: (firebase.auth().currentUser ? firebase.auth().currentUser.uid : ""),
        sessionInstanceId: sessionInstanceId
    });

    useEffect(() => {
        console.log('StudySession() props: ', props);
        // console.log('StudySession() state: ', state);

        getSessionInstance();
    },[]);

    function getSessionInstance() {
        var sessionInstanceRef = firebase.firestore().collection("sessionInstances").doc(sessionInstanceId);

        // TODO --DTM-- Figure out listening to changes
        // sessionInstanceRef.onSnapshot((sessionInstance) => {
        //     if (sessionInstance.exists) {
        //         console.log("sessionInstance: ", sessionInstance.data());
        //         setSessionInstance(sessionInstance.data());
        //     } else {
        //         // doc.data() will be undefined in this case
        //         console.log("No such sessionInstance!");
        //     }
        // });
        sessionInstanceRef.get().then((sessionInstance) => {
            if (sessionInstance.exists) {
                console.log("sessionInstance: ", sessionInstance.data());
                setSessionInstance(sessionInstance.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such sessionInstance!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
  
    // console.log("sessionInstance: ", sessionInstance);
    let sessionInstanceContent = "";
    console.log("sessionInstance2: ", sessionInstance);
    if (sessionInstance.currentUnitIndex >= 0) {
        console.log("sessionInstance2: ", sessionInstance.currentUnitIndex);
        let currentUnitIndex = sessionInstance.currentUnitIndex;
        sessionInstanceContent = (
            <FirestoreCollection 
                path={"sessionInstances/" + sessionInstanceId + "/unitInstances/"}
                orderBy={[{field: "instance_index", type: "asc"}]} >
    
                {d => {
                    console.log('unitInstances d: ', d);
                    if(d.value) {
                        return (
                            <StudyUnit 
                                key={d.ids[currentUnitIndex]}
                                sessionInstanceId={sessionInstanceId}
                                unitInstanceId={d.ids[currentUnitIndex]}
                                unitIndex={currentUnitIndex} 
                                getSessionInstance={getSessionInstance} 
                                unitInstances={d.value} />);
                    } else {
                        return "Loading...";
                    }
                }}
            </FirestoreCollection>
        );
    }

    return (
        <div className="App">
            <header className="App-header">
            {sessionInstanceContent}
          </header>
        </div>
    );
}

export default StudySession;