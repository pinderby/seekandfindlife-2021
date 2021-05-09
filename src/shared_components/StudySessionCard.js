import React, { useState, useEffect } from 'react';
import { FirestoreCollection, FirestoreDocument } from "@react-firebase/firestore";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


function StudySessionCard(props) {
    useEffect(() => {
        console.log('StudySessionCard() props: ', props);
    },[]);
  
    return (
        <Card className="study-session-card" style={{ width: '18rem' }}>
            <Card.Body>
                <FirestoreDocument path={"/sessions/" + props.sessionInstance.session_id}>
                    {d => {
                        console.log("session d: ", d);
                        return (d.isLoading ? "Loading..." : 
                            (d.value ? <Card.Title>{d.value.title}</Card.Title> : ""));
                    }}
                </FirestoreDocument>
                <FirestoreCollection 
                    path={"sessionInstances/" + props.sessionInstanceId + "/unitInstances/"} >

                    {d => {
                    let unitInstances = [];
                    console.log('unitInstances d: ', d);
                    if(d.value) {
                        d.value.map((unitInstance, index) => {
                        console.log('unitInstance: ', unitInstance);
                        unitInstances.push(<UnitInstanceSummary key={index} unitInstance={unitInstance} />);
                        });
                    }
                    return (unitInstances);
                    }}
                </FirestoreCollection>
                <Button size="sm" variant="primary">Study Now</Button>
            </Card.Body>
        </Card>
    );
}

function UnitInstanceSummary(props) {
    useEffect(() => {
        console.log('UnitInstanceSummary() props: ', props);
    },[]);
  
    return (
        <FirestoreDocument path={"/units/" + props.unitInstance.unit_id}>
            {d => {
                console.log("unit d: ", d);
                let instanceSummary = [];
                if (d.isLoading) return "Loading...";
                if (d.value) {
                    instanceSummary.push(
                        <Card.Text>
                            {props.unitInstance.completed ? "☑" : "☐"} {d.value.title}
                        </Card.Text>);
                    return instanceSummary;
                } else {
                    return "";
                }
            }}
        </FirestoreDocument>
    );
}

export default StudySessionCard;