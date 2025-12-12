import { useState, useContext } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import useLocalStorage from "use-local-storage";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);
    const [users] = useLocalStorage("users", []);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user || (username === "user" && password === "password")) {
            login(user ? user.username : username);
            navigate("/todos");
        } else {
            setError("Invalid credentials. Try username or password");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
            <Card style={{ width: "400px" }} className="p-4 shadow">
                <Card.Body>
                    <h2 className="text-center mb-4">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                    <div className="mt-3 text-center">
                        Don't have an account? <Link to="/register">Register</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}