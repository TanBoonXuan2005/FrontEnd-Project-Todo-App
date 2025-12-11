import { useState, useEffect, useContext } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { TodoContext } from "../contexts/TodoContext";

export default function TodoItem({ todo, setEditing, showDeleteModal }) {
    const [timer, setTimer] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);
    const { setTodos } = useContext(TodoContext);

    const updatedTodo = () => {
        setTodos((prevTodos) => {
            return prevTodos.map((prevTodo) => 
                prevTodo.id === todo.id ? {...prevTodo, completed: !prevTodo.completed} : prevTodo
            )
        })
    }

    const startTimer = () => {
        if (timerInterval === null) {
            const intervalID = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
            setTimerInterval(intervalID);
        }
    };

    const pauseTimer = () => {
        clearInterval(timerInterval);
        setTimerInterval(null);
    };

    const resetTimer = () => {
        clearInterval(timerInterval);
        setTimerInterval(null);
        setTimer(0);
    };

    useEffect(() => {
        return () => clearInterval(timerInterval);
    }, [timerInterval]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <Card className={`mb-3 shadow-sm ${todo.completed ? "bg-light opacity-75" : "border-primary"}`}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <Card.Title className={todo.completed ? "text-decoration-line-through text-muted" : ""}>
                            {todo.title}
                            <Badge bg="info" className="ms-2">{todo.type}</Badge>
                        </Card.Title>
                        <Card.Text className="text-muted mb-2">{todo.description}</Card.Text>
                        
                        <div className="mb-2">
                            <small className="text-secondary fw-bold">
                                🎯 Target: {todo.duration}
                            </small>
                        </div>

                        {!todo.completed && (
                            <div className="d-flex align-items-center gap-2 mb-3 p-2 border rounded bg-white" style={{width: 'fit-content'}}>
                                <i className="bi bi-stopwatch text-primary"></i>
                                <span className="fw-bold fs-5 font-monospace">{formatTime(timer)}</span>
                                <div className="btn-group btn-group-sm ms-2">
                                    <Button variant="outline-success" onClick={startTimer} title="Start">
                                        ▶
                                    </Button>
                                    <Button variant="outline-warning" onClick={pauseTimer} title="Pause">
                                        ⏸️
                                    </Button>
                                    <Button variant="outline-danger" onClick={resetTimer} title="Reset">
                                        ⟳
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="d-flex flex-column gap-2">
                        <Button
                            variant={todo.completed ? "warning" : "success"}
                            size="sm"
                            onClick={updatedTodo}
                        >
                            {todo.completed ? "⚠️ Undo" : "✅ Done"}
                        </Button>
                        {!todo.completed && (
                            <>
                                <Button variant="primary" size="sm" onClick={() => setEditing(todo)}>
                                    ✏ Edit
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => showDeleteModal(todo.id)}>
                                    🗑 Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}