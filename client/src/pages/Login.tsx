import { useNavigate } from "react-router-dom";
import '../styles/landing.css';

const Login = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="landing-content">
                <div className="logo">☕☕☕</div>
                <h1 className="app-title">Login</h1>
                <p className="app-subtitle">Coming soon...</p>

                <button
                className="secondary-btn"
                onClick={() => navigate('/')}
                style={{ marginTop: '20px' }}
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
};

export default Login;