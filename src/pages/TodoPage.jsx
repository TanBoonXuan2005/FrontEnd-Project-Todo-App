import { useContext, useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import { TodoContext } from "../contexts/TodoContext";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";

export default function TodoPage() {
    const { todos, setTodos } = useContext(TodoContext);
    const [modalEditTodo, setModalEditTodo] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [modalDeleteTodo, setModalDeleteTodo] = useState(false);
    const [deletingTodo, setDeletingTodo] = useState(null);

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
            setTodos((prevTodos) => 
                prevTodos.filter((prevTodo) => prevTodo.id != deletingTodo)
            )
        }

        setDeletingTodo(null);
        setModalDeleteTodo(false);
    }

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4 text-primary fw-bold">
                Fitness Goals & Routines
            </h1>

            <Row className="justify-content-center">
                <Col md={10}>
                    <div className="mb-4">
                        <TodoForm setEditing={() => {}} />
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
                            />
                        ))
                    )}
                </Col>
            </Row>
            <Modal show={modalEditTodo} onHide={handleEditClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit</Modal.Title>
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
        </Container>
    );
}
