import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Home() {
    const {user} = useContext(AuthContext)
    return (
        <div className="container text-center mt-5">
            <h1 className="display-4 fw-bold">🏋️ Welcome to FitTrack</h1>
            <p className="lead mt-3">
                Your ultimate partner for managing your daily routine and achieving 
                your fitness goals 🏆
            </p>
            
            <div className="mt-5">
                {user ? (
                    <>
                        <h2>Continue editing your FitTrack</h2>
                        <Link to="/todos" className="btn btn-primary">
                            Back to Dashboard
                        </Link>
                    </>
                ) : (
                    <>
                        <h3>Ready to get started?</h3>
                        <div className="d-flex justify-content-center gap-3 mt-3">
                            <Link to="/login" className="btn btn-primary btn-lg">Login</Link>
                            <Link to="/register" className="btn btn-secondary btn-lg">Register</Link>
                        </div>
                    </>
                )}
            </div>

            <div className="row mt-5">
                <div className="col-md-4">
                    <div className="card p-3 shadow-sm">
                        <h5>📝 Plan</h5>
                        <p>Create your daily workout todo list.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-3 shadow-sm">
                        <h5>🔥 Track</h5>
                        <p>Record your workout duration & generate statistics</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-3 shadow-sm">
                        <h5>🏆 Achieve</h5>
                        <p>Hit your fitness goals consistently.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}