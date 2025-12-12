import { useState, useEffect, useContext } from "react";
import { Card, Button, Badge, ProgressBar } from "react-bootstrap";
import { TodoContext } from "../contexts/TodoContext";

export default function TodoItem({ todo, setEditing, showDeleteModal, showToast, handleCheckDone }) {
    const {todos, setTodos} = useContext(TodoContext);
    const isRunning = todo.isRunning || false;
    const timeElapsed = todo.timeElapsed || 0;
    const startTime = todo.startTime || 0;
    const targetTime = (parseFloat(todo.duration) || 0) * 60; 

    const calculateTimer = () => {
        if (isRunning) {
            const seconds = parseInt((Date.now() - startTime) / 1000, 10);
            return timeElapsed + seconds;
        }

        return timeElapsed;
    }

    const [timer, setTimer] = useState(timeElapsed);
    const isTargetReached = timer >= targetTime && targetTime > 0;
   
    const updateTodo = (updates) => {
        const updatedTodos = todos.map((prevTodo) =>
            prevTodo.id === todo.id ? { ...prevTodo, ...updates } : prevTodo
        );
        setTodos(updatedTodos);
    }

    const startTimer = () => {
        updateTodo({isRunning: true, startTime: Date.now()});
    };

    const pauseTimer = () => {
        const seconds = parseInt((Date.now() - startTime) / 1000, 10);
        const timer = timeElapsed + seconds;
        updateTodo({isRunning: false, timeElapsed: timer});
    };

    const resetTimer = () => {
        updateTodo({isRunning: false, timeElapsed: 0, startTime: 0});
        setTimer(0);
    };

    useEffect(() => {
        setTimer(calculateTimer());
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setTimer(calculateTimer());
            }, 1000);
        }

        return () => { 
            if (interval) clearInterval(interval)
        };
    }, [isRunning, startTime, timeElapsed]);

    useEffect(() => {
        if (timer === targetTime && targetTime > 0 && isRunning) {
            showToast(`Great job! You completed "${todo.title}" exercise!`, "🎉 Goal Reached!", "success");
        } 
    }, [timer, targetTime, isRunning]);

    const formatTime = (seconds) => {
        const secs = seconds % 60;
        const mins = (seconds - secs) / 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <Card className={`mb-3 shadow-sm ${todo.completed ? "bg-light opacity-75" : isTargetReached ? "border-warning" : "border-secondary"}`}>
            {isTargetReached && !todo.completed && (
                <Card.Header className="bg-warning text-white fw-bold">
                    🎉 Target Time Reached!
                </Card.Header>
            )} 
            {todo.completed && (
                <Card.Header className="bg-success text-white fw-bold">
                    🏆 Exercise Completed!
                </Card.Header>
            )}
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <Card.Title className={todo.completed ? "text-decoration-line-through text-muted" : "h5"}>
                            {todo.title}
                            <Badge bg="info" className="ms-2">{todo.type}</Badge>
                        </Card.Title>
                        <Card.Subtitle className="text-muted">Target: {todo.duration} min(s)</Card.Subtitle>
                    </div>
                    
                    {/* Edit/Delete Buttons */}
                    {!todo.completed && (
                        <div className="d-flex gap-2">
                            <Button variant="warning" size="sm" onClick={() => setEditing(todo)}>
                                <i className="bi bi-pencil text-white"></i> Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => showDeleteModal(todo.id)}>
                                <i className="bi bi-trash"></i>
                            </Button>
                        </div>
                    )}
                </div>
                <Card.Text className="text-secondary mb-4">
                    {todo.description}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-end">
                    {!todo.completed ? (
                        <div className="flex-grow-1 me-3" style={{ maxWidth: '300px' }}>
                            <div className="d-flex align-items-center gap-3 mb-2">
                                <span className={`fw-bold fs-4 ${isTargetReached ? "text-success" : "text-dark"}`}>
                                    {formatTime(timer)}
                                </span>
                                <div className="btn-group btn-group-sm">
                                    <Button variant="light border" onClick={startTimer} disabled={isTargetReached}>▶</Button>
                                    <Button variant="light border" onClick={pauseTimer}>⏸️</Button>
                                    <Button variant="light border" onClick={resetTimer}>⟳</Button>
                                </div>
                            </div>
                            {targetTime > 0 && (
                                <ProgressBar 
                                    now={(timer / targetTime) * 100} 
                                    variant={isTargetReached ? "success" : "warning"} 
                                    style={{ height: '6px' }} 
                                />
                            )}
                        </div>
                    ) : (
                        <div></div> 
                    )}
                    <Button
                        variant={todo.completed ? "warning" : "success"}
                        className="px-4 fw-bold text-white"
                        onClick={() => handleCheckDone(todo, timer)}
                    >
                        {todo.completed ? "⚠️ Undo" : "✓ Mark Done"}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}