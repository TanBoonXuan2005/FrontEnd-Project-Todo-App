import { useContext, useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import { TodoContext } from "../contexts/TodoContext";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";

export default function TodoPage() {
    const { todos, deleteTodo } = useContext(TodoContext);
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

    const handleDeleteTodo = (id) => {
        setDeletingTodo(id);
        setModalDeleteTodo(true);
    }

    const confirmDelete = () => {
        if (deletingTodo) {
            deleteTodo(deletingTodo)
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
                    <Modal.Title>Edit Workout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TodoForm
                        currentTodo={editingTodo}
                        setEditing={handleEditClose}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleEditClose}>
                        Close
                    </Button>
                    <Button variant="success" type="submit" onClick={handleEditTodo}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
