import React, { useState, useEffect, useReducer } from 'react';
import { FirestoreCollection, FirestoreDocument } from "@react-firebase/firestore";
import { useParams } from "react-router-dom";
import StudyUnit from './shared_components/StudyUnit';

const initialState = {unitIndex: 0};

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return {unitIndex: state.unitIndex + 1};
        case 'decrement':
            return {unitIndex: state.unitIndex - 1};
        default:
            throw new Error();
    }
}

function StudySession(props) {
    // const [unitIndex, setUnitIndex] = useState(0);
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        console.log('StudySession() props: ', props);
        // console.log('StudySession() state: ', state);
    },[]);
  
    let { sessionInstanceId } = useParams();

    return (
        <div className="App">
            <header className="App-header">
            {/* TODO --DTM-- REMOVE */}
            {console.log('StudySession() state: ', state)}
            <FirestoreDocument path={"/sessionInstances/" + sessionInstanceId}>
                {sessionInstance => {
                    console.log("sessionInstance: ", sessionInstance);
                    if (!sessionInstance.value) return;
                    
                    let currentUnitIndex = sessionInstance.value.currentUnitIndex;
                    return (
                        <FirestoreCollection 
                            path={"sessionInstances/" + sessionInstanceId + "/unitInstances/"} >

                            {d => {
                                let unitInstances = [];
                                console.log('unitInstances d: ', d);
                                if(d.value) {
                                    return (
                                        <StudyUnit 
                                            sessionInstanceId={sessionInstanceId}
                                            unitInstanceId={d.ids[currentUnitIndex]}
                                            unitIndex={currentUnitIndex} 
                                            dispatch={dispatch} 
                                            unitInstances={d.value} />);
                                } else {
                                    return "Loading...";
                                }
                            }}
                        </FirestoreCollection>
                    );
                }}
            </FirestoreDocument>
          </header>
        </div>
    );
}

export default StudySession;