import { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Modal, Button, Toast, ToastContainer, 
         Card, Form, InputGroup, Dropdown, Spinner } from "react-bootstrap";
import { TodoContext } from "../contexts/TodoContext";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";

export default function TodoPage() {
    const [modalEditTodo, setModalEditTodo] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [modalDeleteTodo, setModalDeleteTodo] = useState(false);
    const [deletingTodo, setDeletingTodo] = useState(null);
    const [modalForceDone, setModalForceDone] = useState(false);
    const [forceDoneTodo, setForceDoneTodo] = useState(null);
    const [forceDoneTimer, setForceDoneTimer] = useState(0);
    const [toasts, setToasts] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setfilterStatus] = useState('all');
    const { todos, setTodos } = useContext(TodoContext);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); 
        return () => clearTimeout(timer);
    }, [searchTerm, filterStatus]);

    const handleEditTodo = (todo) => {
        setEditingTodo(todo);
        setModalEditTodo(true);
    }

    const handleEditClose = () => {
        setEditingTodo(null);
        setModalEditTodo(false);
    }

    const handleClose = () => setModalEditTodo(false);

    const handleDeleteTodo = (id) => {
        setDeletingTodo(id);
        setModalDeleteTodo(true);
    }

    const toggleComplete = (id, finalTime = null) => {
        const updatedTodos = todos.map((todo) => {
            if (todo.id === id) {
                const completed = !todo.completed;
                let updates = { completed };
                if (completed) {
                    updates.isRunning = false;
                    if (finalTime !== null && finalTime !== undefined) {
                        updates.timeElapsed = finalTime;
                        updates.startTime = 0;
                    }
                } else {
                        updates.isRunning = true;
                        updates.startTime = Date.now();
                }
                return { ...todo, ...updates };
            }
            return todo;
        });
        setTodos(updatedTodos);
    }

    const confirmDelete = () => {
        if (deletingTodo) {
            const todoToDelete = todos.find((prevTodo) => prevTodo.id === deletingTodo);
            setTodos(todos.filter((todo) => todo.id !== deletingTodo));
            const title = todoToDelete ? todoToDelete.title : "";   
            showToast(`Exercise "${title}" deleted successfully!`, "🗑️ Exercise Deleted", "danger");
        }

        setDeletingTodo(null);
        setModalDeleteTodo(false);
    }

    const handleCheckDone = (todo, currentTimer) => {
        if (todo.completed) {
            toggleComplete(todo.id);
            showToast(`"${todo.title}" marked as not completed. Keep going!`, "⚠️ Exercise Incomplete", "warning");
            return;
        }

        const targetTime = (parseFloat(todo.duration) || 0) * 60;
        if (currentTimer >= targetTime && targetTime > 0) {
            toggleComplete(todo.id, currentTimer);
            showToast(`Great job! You completed "${todo.title}"!`, "🎉 Exercise Completed", "success");
        } else {
            setForceDoneTodo(todo);
            setForceDoneTimer(currentTimer);
            setModalForceDone(true);
        }
    }

    const confirmForceDone = () => {
        if (forceDoneTodo) {
            toggleComplete(forceDoneTodo.id, forceDoneTimer);
            showToast(`Great job! You completed "${forceDoneTodo.title}"!`, "🎉 Exercise Completed", "success");
        }
        setForceDoneTodo(null);
        setForceDoneTimer(0);
        setModalForceDone(false);
    }

    const showToast = (message, title = "Notification", variant = "success") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, title, variant }]);
        
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    const filterTodos = todos.filter(todo => {
        const matchTitle = todo.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) || 
                           todo.description.toLowerCase().includes(searchTerm.toLowerCase().trim());
        const matchStatus = filterStatus === "all" ? true :
                            filterStatus === "completed" ? todo.completed : !todo.completed;
        return matchTitle && matchStatus;
    });

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4 text-primary fw-bold">
                Fitness Goals & Routines
            </h1>

            <Row className="justify-content-center">
                <Col md={10}>
                    <div className="mb-4">
                        <TodoForm 
                            setEditing={() => {}} 
                            showToast={showToast}
                        />
                    </div>
                    <Card className="mb-4 shadow-sm border-0 bg-light">
                        <Card.Body>
                            <Row className="g-2">
                                <Col md={8}>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-white border-end-0">
                                            <i className="bi bi-search text-muted"></i>
                                        </InputGroup.Text>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Search exercises..." 
                                            className="border-start-0"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col md={4} className="d-flex justify-content-end">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="w-100">
                                            Filter: {
                                                filterStatus === "all" ? "All" : 
                                                filterStatus === "completed" ? "Completed" : "Incomplete"
                                            }
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setfilterStatus("all")}>All</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setfilterStatus("completed")}>Completed</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setfilterStatus("incomplete")}>Incomplete</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <h3 className="mt-5 mb-3">Your Exercises</h3>
                    {isLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            <p className="text-muted mt-2">Loading...</p>
                        </div>
                    ) : (
                        todos.length === 0 ? (
                            <p className="text-center text-muted">
                                No exercises added yet. Start by adding one above!
                            </p>
                        ) :  filterTodos.length === 0 ? (
                            <div className="text-center text-muted" py-4>
                                <p>No exercises match your search or filter criteria.</p>
                                <Button variant="outline-primary" onClick={() => { setSearchTerm(""); setfilterStatus("all"); }}>
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            filterTodos.map((todo) => (
                                <TodoItem 
                                    key={todo.id} 
                                    todo={todo} 
                                    setEditing={handleEditTodo}
                                    showDeleteModal={handleDeleteTodo}
                                    showToast={showToast}
                                    handleCheckDone={handleCheckDone}
                                />
                            ))
                        )
                    )}
                </Col>
            </Row>

            {/* Target time reached notification */}
            <ToastContainer 
                position="top-end" 
                className="p-3" 
                style={{ 
                    position: 'fixed', 
                    top: 20, 
                    right: 20, 
                    zIndex: 9999 
                }}
            >
                {toasts.map((toast) => (
                    <Toast 
                        key={toast.id} 
                        onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} 
                        show={true} 
                        delay={4000} 
                        autohide
                        bg={toast.variant}
                    >
                        <Toast.Header>
                            <strong className="me-auto">{toast.title}</strong>
                            <small>Just now</small>
                        </Toast.Header>
                        <Toast.Body className="text-white">{toast.message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>

            {/* Edit Modal */}
            <Modal show={modalEditTodo} onHide={handleEditClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Workout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TodoForm
                        currentTodo={editingTodo}
                        setEditing={handleEditClose}
                        formId="edit-todo"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleEditClose}>
                        Cancel
                    </Button>
                    <Button 
                        variant="success" 
                        type="submit" 
                        form="edit-todo"  
                        onClick={handleClose}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            <Modal
                show={modalDeleteTodo}
                onHide={handleDeleteTodo}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure want to delete this exercise?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalDeleteTodo(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Force Done Modal */}
            <Modal
                show={modalForceDone}
                onHide={() => setModalForceDone(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Mark as Done</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You haven't reached the target time for this exercise. Are you sure want to mark it as done?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setModalForceDone(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={confirmForceDone}>
                        Yes, Mark as Done
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
