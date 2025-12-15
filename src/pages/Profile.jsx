import { useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col, Form, Button, Alert, Image, InputGroup, Modal } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { TodoContext } from "../contexts/TodoContext";
import useLocalStorage from "use-local-storage";

export default function Profile() {
    const { todos } = useContext(TodoContext);
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useLocalStorage("users", []);

    // Imaege States
    const [profileImage, setProfileImage] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);

    // Input States for Modals
    const [imageUrl, setImageUrl] = useState('');
    const [backgroundUrl, setBackgroundUrl] = useState('');

    const [showMsgModal, setShowMsgModal] = useState(false);

    // Modal vibility states
    const [showProfileImageModal, setShowProfileImageModal] = useState(false);
    const [showBackgroundImageModal, setShowBackgroundImageModal] = useState(false);

    // Validation & Message
    const [invalidUrl, setInvalidUrl] = useState(false);
    const [message, setMessage] = useState({  text: "", type: "" });

    // Password Change States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // Fitness Stats
    const totalTodos = todos.length;
    const completedTodos = todos.filter(todo => todo.completed).length;
    const pendingTodos = totalTodos - completedTodos;
    const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    const showNotification = (text, type) => {
        setMessage({ text, type });
        setShowMsgModal(true);
    };

    const handleCloseModals = () => {
        setShowBackgroundImageModal(false);
        setShowProfileImageModal(false);
        setImageUrl('');
        setBackgroundUrl('');
        setInvalidUrl(false);
    }

    const handleImageChange = () => {
        if (!imageUrl.trim()) return;

        const updatedUsers = users.map(u =>
            u.username === user.username ? { ...u, image: imageUrl.trim() } : u
        );
        setUsers(updatedUsers);
        handleCloseModals();
        showNotification("Profile picture updated!", "success");
    }

    const handleBackgroundChange = () => {
        if (!backgroundUrl.trim()) return;
        const updatedUsers = users.map(u =>
            u.username === user.username ? { ...u, background: backgroundUrl.trim() } : u
        );
        setUsers(updatedUsers);
        handleCloseModals();
        showNotification("Background image updated!", "success");
    }

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });

        const currentUser = users.find(
            currUser => currUser.username === user.username && currUser.password === currentPassword
        );

        if (!currentUser) {
            setMessage({ text: "Current password is incorrect.", type: "danger" });
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setMessage({ text: "New passwords do not match.", type: "danger" });
            return;
        }
        const updatedUsers = users.map(u =>
            u.username === user.username ? { ...u, password: newPassword } : u
        );
        setUsers(updatedUsers);
        showNotification("Password updated successfully!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
    }

    useEffect(() => {
        const currentUser = users.find(u => u.username === user.username);
        if (currentUser) {
            if (currentUser.image) {
                setProfileImage(currentUser.image);
            } 

            if (currentUser.background) {
                setBackgroundImage(currentUser.background);
            }
        }
    }, [user, users]);


    return (
        <Container className="py-3">
            <div className="container text-center mb-5">
                <h1 className="display-4 fw-bold">👤 User Profile</h1>
            </div>
            <Row className="justify-content-center mb-5">
                <Col md={8}>
                    <Card className="shadow-sm border-1 overflow-hidden">
                        <div
                            style={{ 
                                height: "200px", 
                                backgroundColor: "rgba(222, 226, 230, 1)",
                                backgroundImage: `url(${backgroundImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                position: "relative"
                            }}
                        >
                            <Button 
                                variant="light" 
                                size="sm"
                                className="position-absolute top-0 end-0 m-3 opacity-75"
                                onClick={() => setShowBackgroundImageModal(true)}
                            >
                                <i className="bi bi-pencil-fill me-1"></i> Edit
                            </Button>
                        </div>
                        <Card.Body className="text-center p-4 pt-0">
                            <div className="position-relative d-inline-block" style={{marginTop: '-70px'}}>
                                <div>
                                    {profileImage ? (
                                    <Image 
                                        src={profileImage} 
                                        roundedCircle 
                                        style={{ width: "140px", height: "140px", objectFit: "cover", border: "5px solid white" }}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                    ) : (
                                        <div 
                                            className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
                                            style={{ width: "140px", height: "140px", fontSize: "3rem", border: "5px solid white" }}
                                        >
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="position-absolute bottom-0 end-0 rounded-circle border-white"
                                        style={{ width: '40px', height: '40px', border: '3px solid white' }}
                                        onClick={() => setShowProfileImageModal(true)}
                                    >
                                        <i className="bi bi-camera-fill"></i>
                                    </Button>
                                </div>            
                            </div>

                            <h3 className="fw-bold">{user.username}</h3>
                            <p className="text-muted mb-4">FitTrack Member</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <h3>Your Fitness Stats</h3>
            <Row className="mb-5 g-4">
                <Col md={3} sm={6}>
                    <Card className="text-center h-100 shadow-sm border-primary">
                        <Card.Body>
                            <h1 className="display-4 fw-bold text-primary">{totalTodos}</h1>
                            <Card.Text className="text-muted fw-semibold">Total Exercises</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} sm={6}>
                    <Card className="text-center h-100 shadow-sm border-success">
                        <Card.Body>
                            <h1 className="display-4 fw-bold text-success">{completedTodos}</h1>
                            <Card.Text className="text-muted fw-semibold">Completed</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} sm={6}>
                    <Card className="text-center h-100 shadow-sm border-warning">
                        <Card.Body>
                            <h1 className="display-4 fw-bold text-warning">{pendingTodos}</h1>
                            <Card.Text className="text-muted fw-semibold">Pending</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} sm={6}>
                    <Card className="text-center h-100 shadow-sm border-info">
                        <Card.Body>
                            <h1 className="display-4 fw-bold text-info">{completionRate}%</h1>
                            <Card.Text className="text-muted fw-semibold">Completion Rate</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* --- Change Password Section --- */}
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-light py-3">
                            <h4 className="mb-0">🔒 Change Password</h4>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form onSubmit={handlePasswordChange}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Current Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Confirm New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Confirm new password"
                                                value={confirmNewPassword}
                                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-grid mt-3">
                                    <Button variant="primary" size="lg" type="submit">
                                        Update Password
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal Edit Profile Picture */}
            <Modal show={showProfileImageModal} onHide={() => setShowProfileImageModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Profile Picture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* URL Input Section */}
                    <Form.Group>
                        {imageUrl && (
                            <div>
                                <Form.Label>Preview: </Form.Label>
                                <div className="text-center my-2 p-4 bg-light rounded">
                                    <Image
                                        src={imageUrl}
                                        roundedCircle
                                        style={{ width: "120px", height: "120px", objectFit: "cover", border: "3px solid white" }}
                                        onError={() => setInvalidUrl(true)} 
                                        onLoad={() => setInvalidUrl(false)}
                                    />
                                    {invalidUrl && (
                                        <div className="text-danger mt-2">
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            Invalid image URL. Please try again.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <Form.Label>Image URL</Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="bg-white">
                                <i className="bi bi-link-45deg"></i>
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Paste an image URL..."
                                value={imageUrl}
                                onChange={(e) => {
                                    setImageUrl(e.target.value)
                                    setInvalidUrl(false);
                                }}
                            /> 
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Paste a direct link to an image (format: jpg, png, etc).
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowProfileImageModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleImageChange} disabled={!imageUrl.trim() || invalidUrl}>
                        Save Change
                    </Button>
                </Modal.Footer>    
            </Modal>

            {/* Modal Edit Background Picture */}
            <Modal show={showBackgroundImageModal} onHide={() => setShowBackgroundImageModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Background Picture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* URL Input Section */}
                    <Form.Group>
                        {backgroundUrl && (
                            <div>
                                <Form.Label>Preview: </Form.Label>
                                <div className="text-center my-2 p-4 bg-light rounded">
                                    <Image
                                        src={backgroundUrl}
                                        fluid
                                        style={{ maxHeight: "150px", width: "100%", objectFit: "cover", borderRadius: "8px" }}
                                        onError={() => setInvalidUrl(true)} 
                                        onLoad={() => setInvalidUrl(false)}
                                    />
                                    {invalidUrl && (
                                        <div className="text-danger mt-2">
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            Invalid image URL. Please try again.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <Form.Label>Image URL</Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="bg-white">
                                <i className="bi bi-link-45deg"></i>
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Paste an image URL..."
                                value={backgroundUrl}
                                onChange={(e) => {
                                    setBackgroundUrl(e.target.value)
                                    setInvalidUrl(false);
                                }}
                            /> 
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Paste a direct link to an image (format: jpg, png, etc).
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowBackgroundImageModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleBackgroundChange} disabled={!backgroundUrl.trim() || invalidUrl}>
                        Save Change
                    </Button>
                </Modal.Footer>    
            </Modal>

            <Modal show={showMsgModal} onHide={() => setShowMsgModal(false)} centered>
                <Modal.Header closeButton className={message.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}>
                    <Modal.Title>
                        {message.type === 'success' ? 'Success' : 'Error'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center p-4">
                    <div className="mb-3">
                        {message.type === 'success' ? (
                            <i className="bi bi-check-circle-fill text-success display-3"></i>
                        ) : (
                            <i className="bi bi-exclamation-triangle-fill text-danger display-3"></i>
                        )}
                    </div>
                    <h5 className="mb-0">{message.text}</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={message.type === 'success' ? 'success' : 'danger'} onClick={() => setShowMsgModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}