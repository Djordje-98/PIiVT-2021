import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EventRegister from '../../api/EventRegister';

class TopMenuState {
    currentMenuType: "administrator" | "visitor" = "visitor";
}

export default class TopMenu extends React.Component {
    state: TopMenuState;

    constructor(props: any) {
        super(props);

        this.state = {
            currentMenuType: "visitor",
        }
    }

    componentDidMount() {
        EventRegister.on("AUTH_EVENT", this.authEvenntHandler.bind(this));
    }

    componentWillUnmount() {
        EventRegister.off("AUTH_EVENT", this.authEvenntHandler.bind(this));
    }

    private authEvenntHandler(message: string) {
        if (message === "force_login" || message === "administrator_logout") {
            return this.setState({
                currentMenuType: "visitor",
            })
        }
        if (message === "administrator_login") {
            return this.setState({
                currentMenuType: "administrator",
            })
        }
    }

    render() {
        if (this.state.currentMenuType === "visitor") {
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
        if (this.state.currentMenuType === "administrator") {
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
