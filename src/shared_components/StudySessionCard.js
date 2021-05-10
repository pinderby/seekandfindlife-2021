import React, { useState, useEffect } from 'react';
import { FirestoreCollection, FirestoreDocument } from "@react-firebase/firestore";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";


function StudySessionCard(props) {
    useEffect(() => {
        console.log('StudySessionCard() props: ', props);
    },[]);
  
    return (
        <Card className="study-session-card">
            <Card.Body>
                <FirestoreDocument path={"/sessions/" + props.sessionInstance.session_id}>
                    {d => {
                        console.log("session d: ", d);
                        if (d.isLoading) {
                            return "Loading...";
                        }

                        if (d.value) {
                            return (
                                <Card.Title>
                                    {d.value.title}
                                    {props.sessionInstance.completed ? " ☑" : " ☐"}
                                </Card.Title>
                            );
                        } else {
                            return "";
                        }
                    }}
                </FirestoreDocument>
                <FirestoreCollection 
                    path={"sessionInstances/" + props.sessionInstanceId + "/unitInstances/"}
                    orderBy={[{field: "instance_index", type: "asc"}]} >

                    {d => {
                    let unitInstances = [];
                    console.log('unitInstances d: ', d);
                    if (d.value) {
                        d.value.map((unitInstance, index) => {
                        console.log('unitInstance: ', unitInstance);
                        unitInstances.push(<UnitInstanceSummary key={index} unitInstance={unitInstance} />);
                        });
                    }
                    return (unitInstances);
                    }}
                </FirestoreCollection>
                { props.sessionInstance.completed ? "" :
                    (
                        <Link to={"/study/" + props.sessionInstanceId}>
                            <Button size="sm" variant="primary">Study Now</Button>
                        </Link>
                    )
                }
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