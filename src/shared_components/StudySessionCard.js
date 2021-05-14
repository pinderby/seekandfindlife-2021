import React, { useState, useEffect } from 'react';
import { FirestoreCollection, FirestoreDocument } from "@react-firebase/firestore";
import firebase from 'firebase';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";


function StudySessionCard(props) {
    useEffect(() => {
        console.log('StudySessionCard() props: ', props);
    },[]);
  
    return (
        <Accordion defaultActiveKey={props.sessionInstance.completed ? "" : "0"}>
            <Card className="study-session-card">
                <Accordion.Toggle as={Card.Header} eventKey="0">
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
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
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
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
}

function UnitInstanceSummary(props) {
    const [unit, setUnit] = useState({});

    useEffect(() => {
        console.log('UnitInstanceSummary() props: ', props);

        var unitRef = firebase.firestore().collection("units").doc(props.unitInstance.unit_id);

        unitRef.get().then((unit) => {
            if (unit.exists) {
                console.log("Unit: ", unit.data());
                setUnit(unit.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    },[]);
  
    if (unit.title) {
        return(
            <Card.Text>
                {props.unitInstance.completed ? "☑" : "☐"} {unit.title}
            </Card.Text>);
    } else {
        return "";
    }
}

export default StudySessionCard;