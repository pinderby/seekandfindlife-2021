import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import moment from 'moment';
import axios from 'axios';
import { FirestoreCollection } from "@react-firebase/firestore";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import JournalReview from './JournalReview';
import {
    Link,
    useHistory
  } from "react-router-dom";


function StudyUnit(props) {
    let history = useHistory();
    var db = firebase.firestore();
    const [unitStarted, setUnitStarted] = useState(false);
    const [unitStartedAt, setUnitStartedAt] = useState(moment());
    const [unitId, setUnitId] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [unit, setUnit] = useState({
        unit_type: "",
        content: ""
    });

    useEffect(() => {
        console.log('StudyUnit() props: ', props);

        console.log('inputValue: ', inputValue);
        if (!unitStarted) {
            console.log('unitStarted2: ', unitStarted);
            // Get unitInstanceRef
            let unitInstanceRef = db.collection("sessionInstances")
                .doc(props.sessionInstanceId)
                .collection("unitInstances")
                .doc(props.unitInstanceId);

            // Start unitInstance (set started_at)
            unitInstanceRef.update({
                started_at: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                console.log("UnitInstance successfully started!");
                setUnitStarted(true);
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
        }

        var unitRef = firebase.firestore().collection("units").doc(props.unitInstances[props.unitIndex].unit_id);

        unitRef.get().then((unit) => {
            if (unit.exists) {
                console.log("Unit: ", unit.data());
                setUnit(unit.data());
                setUnitId(unit.id);
                firebase.analytics().logEvent('study_unit_started',{
                    user_uid: (firebase.auth().currentUser ? firebase.auth().currentUser.uid : ""),
                    sessionInstanceId: props.sessionInstanceId,
                    unitInstanceId: props.unitInstanceId,
                    unit: JSON.stringify(unit.data()),
                    unitTitle: unit.data().title,
                    unitId: unit.id
                });
            } else {
                // doc.data() will be undefined in this case
                console.log("No such unit!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
            });
    },[]);

    function goToNextUnit() {
        // Get a new write batch
        var batch = db.batch();
        console.log("input: ", inputValue);
        let completion_time = moment().diff(unitStartedAt, 'seconds');

        if (unit.unit_type === 'journal_entry') {
            let journalEntryRef = db.collection("journalEntries").doc();
            batch.set(journalEntryRef, {
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                prompt: unit.content,
                uid: firebase.auth().currentUser.uid,
                entry: inputValue
            });
            
        }

        // Complete unitInstance
        let unitInstanceRef = db.collection("sessionInstances")
            .doc(props.sessionInstanceId)
            .collection("unitInstances")
            .doc(props.unitInstanceId);
        batch.update(unitInstanceRef, {
            completed: true,
            completed_at: firebase.firestore.FieldValue.serverTimestamp(),
            completion_time: completion_time,
            content: inputValue
        });

        // Update currentUnitIndex
        let sessionInstanceRef = db.collection("sessionInstances")
            .doc(props.sessionInstanceId);
        batch.update(sessionInstanceRef, {currentUnitIndex: props.unitIndex + 1});

        // Commit the batch
        batch.commit().then(() => {
            console.log("UnitInstance successfully completed!");

            firebase.analytics().logEvent('study_unit_started',{
                user_uid: (firebase.auth().currentUser ? firebase.auth().currentUser.uid : ""),
                sessionInstanceId: props.sessionInstanceId,
                unitInstanceId: props.unitInstanceId,
                unit: JSON.stringify(unit),
                unitTitle: unit.title,
                unitId: unitId,
                completion_time: completion_time
            });

            props.getSessionInstance();
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    function finishLater() {
        firebase.analytics().logEvent('study_session_finish_later',{
            user_uid: (firebase.auth().currentUser ? firebase.auth().currentUser.uid : ""),
            sessionInstanceId: props.sessionInstanceId
        });

        history.push("/home");
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
            firebase.analytics().logEvent('study_session_completed',{
                user_uid: (firebase.auth().currentUser ? firebase.auth().currentUser.uid : ""),
                sessionInstanceId: props.sessionInstanceId
            });

            // send a POST request to Slack
            let name = (firebase.auth().currentUser ? firebase.auth().currentUser.displayName : "");
            axios({
                method: 'post',
                url: 'https://hooks.slack.com/services/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',
                // FOR DEVELOPMENT
                // url: 'https://peaceful-hamlet-19785.herokuapp.com/https://hooks.slack.com/services/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',
                data: {
                    text: ('*' + name + '* just finished today\'s study session!')
                }
            })
            .then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });

            history.push("/home");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    let nextButton = [];

    if(props.unitInstances.length - 1 === props.unitIndex){
        nextButton.push(
            <Button 
                key={props.unitIndex}
                size="md" 
                variant="success"
                onClick={completeSession}>
                    Complete
            </Button>
        );
    } else {
        nextButton.push(
            <Button 
                key={props.unitIndex}
                size="md" 
                variant="primary" 
                onClick={goToNextUnit}>
                    Next
            </Button>
        );
    }
  
    let studyUnit = "";

    if (unit && unit.unit_type !== "") {
        let textInput = "";
        let studyUnitContent = "";
            
        if (unit.unit_type && 
            (
                (unit.unit_type === 'journal_entry') || 
                (unit.unit_type === 'study_question') ||
                (unit.unit_type === 'report_progress')
            )
        ) {
            textInput = (
                <Form>
                    <br/>
                    <Form.Group controlId="inputTextarea">
                        {/* <Form.Label>Example textarea</Form.Label> */}
                        <Form.Control as="textarea" rows={3} 
                            onChange={(e) => setInputValue(e.target.value)} />
                    </Form.Group>
                </Form>);
        }

        if (unit.unit_type && unit.unit_type === 'journal_review') {
            studyUnitContent = (
                <span className="study-unit-content">
                    <JournalReview unit={unit} />
                </span>);
        } else {
            studyUnitContent = (
                <span className="study-unit-content" 
                    dangerouslySetInnerHTML={{ 
                         __html: unit.content}}>
                </span>
            );
        }

        studyUnit = (
            <div className="study-unit-body">
                <h3>{unit.title}</h3>
                <span className="study-unit-instructions">
                    {unit.instructions}
                </span>
                <br/><br/>
                {studyUnitContent}
                {textInput}
            </div>
        );
    }

    return (
        <div className="study-unit-container">
            {studyUnit}
            <div className="study-unit-btns">
                <Button 
                    size="md" 
                    variant="light" 
                    onClick={finishLater}>
                        Finish Later
                </Button>
                {nextButton}
            </div>
        </div>
    );
}

export default StudyUnit;