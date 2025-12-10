import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand href="/">FitTrack</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                            <Nav.Link href="/">Home</Nav.Link>
                            {user && (
                                <Nav.Link href="/todos">Dashboard</Nav.Link>
                            )}
                        </Nav>
                        <Nav>
                            {user ? (
                                <div className="d-flex align-items-center gap-3">
                                    <Navbar.Text>
                                        Hi, {user.username || "User"}
                                    </Navbar.Text>
                                    <Button onClick={handleLogout} className="btn-danger">
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Nav.Link href="/login">Login</Nav.Link>
                                    <Nav.Link href="/register">Register</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Outlet />
            </Container>
        </>
    );
}