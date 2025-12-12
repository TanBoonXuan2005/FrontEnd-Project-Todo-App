import { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { createTodo, updateTodo } from "../features/todos/todosSlice";

export default function TodoForm({ currentTodo, setEditing, formId, showToast }) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("Cardio");
    const [duration, setDuration] = useState("");
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (currentTodo) {
            setTitle(currentTodo.title);
            setDescription(currentTodo.description);
            setType(currentTodo.type);
            setDuration(currentTodo.duration);
        } else {
            setTitle("");
            setDescription("");
            setType("Cardio");
            setDuration("");
        }
    }, [currentTodo]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const todoData = { title, description, type, duration };
        if (currentTodo) {
            dispatch(updateTodo({ id: currentTodo.id, completed: currentTodo.completed, ...todoData }));
            if (showToast) {
                showToast(`Exercise "${title}" updated successfully!`, "✅ Exercise Updated", "success");
            }
            setEditing(null);
            
        } else {
            dispatch(createTodo(todoData));
            if (showToast) {
                showToast(`Exercise "${title}" added successfully!`, "✅ Exercise Added", "success");
            }
            setTitle("");
            setDescription("");
            setType("Cardio");
            setDuration("");
        }
    };

    return (
        <Card className="mb-4 shadow-sm border-0" style={{ backgroundColor: "#f8f9fa" }}>
            <Card.Body>
                <Card.Title className="text-primary mb-3">{currentTodo ? "Edit Exercise" : "Add New Exercise"}</Card.Title>
                <Form id={formId} onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Exercise Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g., Morning Run"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Type</Form.Label>
                                <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                                    <option>Cardio</option>
                                    <option>Strength</option>
                                    <option>Flexibility</option>
                                    <option>Balance</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Duration</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="e.g., 30 mins"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    min="1"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Details..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    {!currentTodo && (
                        <Button variant="primary" type="submit" className="w-100">
                            Add Exercise
                        </Button>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
}
