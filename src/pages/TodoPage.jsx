import { useState } from "react";
import { Container, Row, Col, Modal, Button, Toast, ToastContainer } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { deleteTodo, toggleComplete } from "../features/todos/todosSlice";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";

export default function TodoPage() {
    const [modalEditTodo, setModalEditTodo] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [modalDeleteTodo, setModalDeleteTodo] = useState(false);
    const [deletingTodo, setDeletingTodo] = useState(null);
    const [modalForceDone, setModalForceDone] = useState(false);
    const [forceDoneTodo, setForceDoneTodo] = useState(null);
    const [toasts, setToasts] = useState([]);

    const todos = useSelector((state) => state.todos);
    const dispatch = useDispatch();

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

    const confirmDelete = () => {
        if (deletingTodo) {
            const todoToDelete = todos.find((prevTodo) => prevTodo.id === deletingTodo);
            dispatch(deleteTodo(deletingTodo));
            const title = todoToDelete ? todoToDelete.title : "";   
            showToast(`Exercise "${title}" deleted successfully!`, "🗑️ Exercise Deleted", "danger");
        }

        setDeletingTodo(null);
        setModalDeleteTodo(false);
    }

    const handleCheckDone = (todo, currentTimer) => {
        if (todo.completed) {
            dispatch(toggleComplete(todo.id));
            showToast(`"${todo.title}" marked as not completed. Keep going!`, "⚠️ Exercise Incomplete", "warning");
            return;
        }

        const targetTime = (parseFloat(todo.duration) || 0) * 60;
        if (currentTimer >= targetTime && targetTime > 0) {
            dispatch(toggleComplete(todo.id));
            showToast(`Great job! You completed "${todo.title}"!`, "🎉 Exercise Completed", "success");
        } else {
            setForceDoneTodo(todo);
            setModalForceDone(true);
        }
    }

    const confirmForceDone = () => {
        if (forceDoneTodo) {
            dispatch(toggleComplete(forceDoneTodo.id));
            showToast(`Great job! You completed "${forceDoneTodo.title}"!`, "🎉 Exercise Completed", "success");
        }
        setForceDoneTodo(null);
        setModalForceDone(false);
    }

    const showToast = (message, title = "Notification", variant = "success") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, title, variant }]);
        
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

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

                    <h3 className="mt-5 mb-3">Your Exercises</h3>
                    {todos.length === 0 ? (
                        <p className="text-center text-muted">
                            No exercises added yet. Start by adding one above!
                        </p>
                    ) : (
                        todos.map((todo) => (
                            <TodoItem 
                                key={todo.id} 
                                todo={todo} 
                                setEditing={handleEditTodo}
                                showDeleteModal={handleDeleteTodo}
                                showToast={showToast}
                                handleCheckDone={handleCheckDone}
                            />
                        ))
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
