import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class TopMenuProperties {
    currentMenuType: "administrator" | "visitor" = "visitor";
}

export default class TopMenu extends React.Component<TopMenuProperties> {

    render() {
        if (this.props.currentMenuType === "visitor") {
            return (
        <Nav className="justify-content-center">
            <Nav.Item>
                <Link className="nav-link" to="/">Home</Link>
            </Nav.Item>

            <Nav.Item>
                <Link className="nav-link" to="contact">Contact</Link>
            </Nav.Item>

            <Nav.Item>
                <Link className="nav-link" to="/administrator/login">Administrator login</Link>
            </Nav.Item>

            <Nav.Item>
                <Link className="nav-link" to="/administrator/register">Register</Link>
            </Nav.Item>
        </Nav>
            );
        }
        if (this.props.currentMenuType === "administrator") {
            return (
        <Nav className="justify-content-center">
            
            <Nav.Item>
                <Link className="nav-link" to="/dashboard/category">Categories</Link>
            </Nav.Item>

            <Nav.Item>
                <Link className="nav-link" to="/dashboard/laptop">Laptops</Link>
            </Nav.Item>

            <Nav.Item>
                <Link className="nav-link" to="/dashboard/administrator">Administrators</Link>
            </Nav.Item>

            <Nav.Item>
                <Link className="nav-link" to="/administrator/logout">logout</Link>
            </Nav.Item>
        </Nav>
            );
        }
    }
}
