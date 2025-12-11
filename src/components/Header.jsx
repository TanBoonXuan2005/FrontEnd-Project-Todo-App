import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button, Modal } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useState } from "react";

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleClose = () => setShowLogoutModal(false);
    const handleShow = () => setShowLogoutModal(true);

    const handleLogout = () => {
        logout();
        handleClose();
        navigate("/login");
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand href="/">FitTrack</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            {user && (
                                <Nav.Link href="/todos">Dashboard</Nav.Link>
                            )}
                        </Nav>
                        <Nav className="ms-auto">
                            {user ? (
                                <div className="d-flex align-items-center gap-3">
                                    <Navbar.Text>
                                        Hi, {user.username || "User"}
                                    </Navbar.Text>
                                    <Button onClick={handleShow} size="sm" variant="danger">
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
            <Modal
                show={showLogoutModal}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure want to logout?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleLogout}>
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container>
                <Outlet />
            </Container>
        </>
    );
}