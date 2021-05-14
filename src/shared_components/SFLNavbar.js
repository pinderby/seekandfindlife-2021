import React, { useState, useEffect } from 'react';
import square_logo from '../SFL_Logo_Square.png';
import firebase from 'firebase';
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