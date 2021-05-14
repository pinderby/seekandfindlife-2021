import React, { useState, useEffect } from 'react';
import square_logo from '../SFL_Logo_Square.png';
import firebase from 'firebase';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function SFLNavbar(props) {
    useEffect(() => {
        console.log('SFLNavbar() props: ', props);
    },[]);

    function signOut(e) {
        e.preventDefault();
        firebase.auth().signOut();
    }

    function postToSlack(e) {
        console.log("postToSlack!");
        e.preventDefault();
        // send a POST request to Slack
        axios({
            method: 'post',
            url: 'https://peaceful-hamlet-19785.herokuapp.com/https://hooks.slack.com/services/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',
            data: {
                text: 'Praise the Lord!'
            }
        })
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        });
    }
    
    return (
        <Navbar className="sfl-navbar" bg="light" variant="light">
            <Navbar.Brand href="#">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <img
                    alt=""
                    src={square_logo}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                SeekandFind.Life
            </Navbar.Brand>
            
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link href="#" onClick={(e) => postToSlack(e)}>
                        Post to Slack!
                    </Nav.Link>
                    <Nav.Link href="#" onClick={(e) => signOut(e)}>
                        Sign out
                    </Nav.Link>
                    {/* <Nav.Link href="#link">Link</Nav.Link>
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown> */}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default SFLNavbar;