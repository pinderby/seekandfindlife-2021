import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import { FirestoreCollection, FirestoreDocument } from "@react-firebase/firestore";
import Button from 'react-bootstrap/Button';
import {
    Link,
    useHistory
  } from "react-router-dom";


function StudyUnit(props) {
    let history = useHistory();
    var db = firebase.firestore();

    useEffect(() => {
        console.log('StudyUnit() props: ', props);
    },[]);

    function goToNextUnit() {
        // Get a new write batch
        var batch = db.batch();

        // Complete unitInstance
        let unitInstanceRef = db.collection("sessionInstances")
            .doc(props.sessionInstanceId)
            .collection("unitInstances")
            .doc(props.unitInstanceId);
        batch.update(unitInstanceRef, {completed: true});

        // Update currentUnitIndex
        let sessionInstanceRef = db.collection("sessionInstances")
            .doc(props.sessionInstanceId);
        batch.update(sessionInstanceRef, {currentUnitIndex: props.unitIndex + 1});
        
        // Commit the batch
        batch.commit().then(() => {
            console.log("UnitInstance successfully completed!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    function completeSession() {
        // Get a new write batch
        var batch = db.batch();

        // Complete unitInstance
        let unitInstanceRef = db.collection("sessionInstances")
            .doc(props.sessionInstanceId)
            .collection("unitInstances")
            .doc(props.unitInstanceId);
        batch.update(unitInstanceRef, {completed: true});

        // Update currentUnitIndex
        let sessionInstanceRef = db.collection("sessionInstances")
            .doc(props.sessionInstanceId);
        batch.update(sessionInstanceRef, {
            completed: true
        });
        
        // Commit the batch
        batch.commit().then(() => {
            console.log("SessionInstance successfully completed!");
            history.push("/home");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    let nextButton = [];

    if(props.unitInstances.length - 1 == props.unitIndex){
        nextButton.push(
            <Button 
                size="md" 
                variant="success"
                onClick={completeSession}>
                    Complete
            </Button>
        );
    } else {
        nextButton.push(
            <Button 
                size="md" 
                variant="primary" 
                onClick={goToNextUnit}>
                    Next
            </Button>
        );
    }
  
    return (
        <div className="study-unit-container">
            <FirestoreDocument path={"/units/" + props.unitInstances[props.unitIndex].unit_id}>
                {d => {
                    console.log("unit d: ", d);
                    let instanceSummary = [];
                    if (d.isLoading) return "Loading...";
                    if (d.value) {
                        return (
                            <div className="study-unit-body">
                                <h3>{d.value.title}</h3>
                                <span className="study-unit-instructions">
                                    {d.value.instructions}
                                </span>
                                <br/><br/>
                                <span className="study-unit-content" 
                                    dangerouslySetInnerHTML={{ 
                                         __html: d.value.content}}>
                                </span>
                            </div>
                        );
                    } else {
                        return "";
                    }
                }}
            </FirestoreDocument>
            <div className="study-unit-btns">
                <Link to="/home">
                    <Button size="md" variant="light">Finish Later</Button>
                </Link>
                {nextButton}
            </div>
        </div>
    );
}

export default StudyUnit;