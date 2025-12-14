import { Outlet, useNavigate, Link } from "react-router-dom";
import { Navbar, Container, Nav, Button, Modal, NavDropdown, Image } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useState } from "react";
import useLocalStorage from "use-local-storage";

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const [ users ] = useLocalStorage("users", []);
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleClose = () => setShowLogoutModal(false);
    const handleShow = () => setShowLogoutModal(true);

    const currentUser = user ? users.find(u => u.username === user.username) : null;
    const userProfileImage = currentUser?.image || null;

    const handleLogout = () => {
        logout();
        handleClose();
        navigate("/login");
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand href="/">
                        <img src="/src/assets/FitTrack-Logo.png" width={'60px'} />FitTrack
                    </Navbar.Brand>
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
                                <NavDropdown
                                    align="end"
                                    title={
                                        userProfileImage ? (
                                            <img 
                                                src={userProfileImage}
                                                alt="Profile"
                                                className="rounded-circle"
                                                style={{ width: "35px", height: "35px", objectFit: "cover", border: "2px solid white" }}
                                            />
                                        ) : (
                                            <div
                                                className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: "35px", height: "35px", fontSize: "1.2rem", border: "2px solid white" }}
                                            >
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                        )
                                    }
                                    id="profile-dropdown"
                                >
                                    <div className="text-center p-3" style={{ minWidth: "300px" }}>
                                        <div className="mb-3">
                                            {userProfileImage ? (
                                                <Image 
                                                    src={userProfileImage} 
                                                    roundedCircle 
                                                    style={{ width: "80px", height: "80px", objectFit: "cover", border: "2px solid #e9ecef" }} 
                                                />
                                            ) : (
                                                <div 
                                                    className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
                                                    style={{ width: "80px", height: "80px", fontSize: "2.5rem" }}
                                                >
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <h5 className="fw-bold mb-3">Hi, {user.username}!</h5>
                                        
                                        <Link 
                                            to="/profile" 
                                            className="btn btn-outline-secondary rounded-pill px-4"
                                            style={{ fontSize: "0.9rem" }}
                                        >
                                            Manage your Profile
                                        </Link>
                                    </div>

                                    <NavDropdown.Divider />

                                    <NavDropdown.Item onClick={handleShow} className="text-danger fw-bold ">
                                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
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