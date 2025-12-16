import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import useLocalStorage from "use-local-storage";
import { Container, Row, Col, Button, Card, Image } from 'react-bootstrap';


export default function Home() {
    const { user } = useContext(AuthContext);
    const [ users ] = useLocalStorage('users', []);

    const currentUser = user ? users.find(u => u.username === user.username) : null;
    const userImage = currentUser?.image || null;

    return (
        <Container className="py-5">
            {user ? ( 
                /* Logged in view */
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <Card className="shadow text-center border-0 bg-light">
                            <Card.Body className="p-5">
                                <div className="mb-4">
                                    {userImage ? (
                                    <Image 
                                        src={userImage} 
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
                                </div>
                                <h2 className="fw-bold mb-4">Welcome back, {user.username}!</h2>
                                <p>FitTrack member</p>
                                <p className="lead text-muted mb-4">
                                    Your fitness journey continues here. Let's hit some goals today.
                                </p>
                                <div className="d-flex justify-content-center gap-3">
                                    <Link to="/todos">
                                        <Button variant="primary" size="lg" className="px-4 rounded-pill">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                    <Link to="/profile">
                                        <Button variant="secondary" size="lg" className="px-4 rounded-pill">
                                            Profile
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : (
                /* Logged out view */
                <Row className="align-items-center mb-5">
                    <Col md={6} className="text-center text-md-start mb-4">
                        <img 
                            src="/src/assets/FitTrack-Logo.png" 
                            alt="FitTrack Logo" 
                            width="80px"
                            className="mb-3"
                        />
                    <h1 className="display-4 fw-bold mb-3 lh-1">
                        Track your Fitness
                        <br />
                        <span className="text-primary">Journey Today</span>
                    </h1>
                    <p className="lead text-muted mb-4">
                            The ultimate tool to organize your daily workouts, track your progress, 
                            and stay consistent on your fitness journey.
                        </p>
                    <div className="d-flex gap-3 justify-content-center justify-content-md-start">
                        <Link to="/login">
                            <Button 
                                variant="primary" 
                                className="px-4 rounded-pill shadow-sm" 
                                size="lg"
                            >
                                Get Started
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button 
                                variant="secondary" 
                                className="px-4 rounded-pill shadow-sm" 
                                size="lg"
                            >
                                Register
                            </Button>
                        </Link>
                    </div>

                    </Col>
                    <Col md={6}>
                        <img 
                            src="https://static.vecteezy.com/system/resources/thumbnails/069/378/692/small/gym-dumbbells-on-rack-fitness-equipment-modern-gym-photo.jpeg" 
                            className="shadow-lg"
                            rounded
                            fluid 
                            alt="Fitness image"  
                        />
                    </Col>
                </Row>
            )}
            <Row className="g-4 mt-5">
                <Col md={4}>
                    <Card className="shadow-sm text-center">
                        <Card.Body className="text-center">
                            <div className="text-primary mb-3">
                                <i className="bi bi-list-check display-4"></i>
                            </div>
                            <Card.Title className="fw-bold">Smart Planning</Card.Title>
                            <Card.Text className="text-muted">
                                Organize your daily routines and stay focused on your training.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm text-center">
                        <Card.Body className="text-center">
                            <div className="text-success mb-3">
                                <i className="bi bi-graph-up-arrow display-4"></i>
                            </div>
                            <Card.Title className="fw-bold">Track Progress</Card.Title>
                            <Card.Text className="text-muted">
                                Visualize your consistency over time. See your completion rates improve day by day.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm text-center">
                        <Card.Body className="text-center">
                            <div className="text-warning mb-3">
                                <i className="bi bi-trophy-fill display-4"></i>
                            </div>
                            <Card.Title className="fw-bold">Achieve Goals</Card.Title>
                            <Card.Text className="text-muted">
                                Stay motivated by turning your daily routine into a winning streak.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>



            
            <footer className="text-center mt-5 pt-5 text-muted small">
                © FitTrack 2025. All rights reserved.
            </footer>
        </Container>
        
    )
}