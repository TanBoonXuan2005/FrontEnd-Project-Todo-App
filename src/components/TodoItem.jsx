import { useState, useEffect } from "react";
import { Card, Button, Badge, ProgressBar } from "react-bootstrap";

export default function TodoItem({ todo, setEditing, showDeleteModal, showToast, handleCheckDone }) {
    const [timer, setTimer] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);

    const targetTime = (parseFloat(todo.duration) || 0) * 60; 
    const isTargetReached = timer >= targetTime && targetTime > 0;
    
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

    useEffect(() => {
        if (timer === targetTime && targetTime > 0) {
            showToast(`Great job! You completed "${todo.title}" exercise!`, "🎉 Goal Reached!", "success");
        } 
    }, [timer, targetTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
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