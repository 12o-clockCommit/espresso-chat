import { useNavigate } from "react-router-dom";
import '../styles/landing.css';

const Landing = () => {
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        // generate random room id
        const roomId = Math.random().toString(36).substring(2, 9);
        console.log('Create anonymous room clicked');
        navigate(`/room/${roomId}`);
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    return (
        <div className="landing-container">
            <div className="landing-content">
                {/* Logo/Brand */}
                <div className="logo">☕☕☕</div>
                <h1 className="app-title">Espresso Chat</h1>
                <p className="app-subtitle">Quick chats, instant connections</p>

                {/* Main Options */}
                <div className="options-container">
                    {/* Option 1: Anonymous Chat */}
                    <div className="option-section">
                        <p className="section-title">Start Chatting Instantly</p>
                        <button className="primary-btn" onClick={handleCreateRoom}>
                            Start Anonymous Chat Room
                        </button>
                    </div>

                    {/* Option 2: Login/Sign up */}
                    <div className="option-section">
                        <p className="section-title">Already Have an account?</p>
                        <div className="secondary-buttons">
                            <button className="secondary-btn" onClick={handleLogin}>
                                Login
                            </button>
                            <button className="secondary-btn" onClick={handleSignup}>
                                Sign Up
                            </button>
                        </div>
                    </div>   
                </div>

                <p className="footer-text">
                    No registration required for anonymous rooms
                </p>
            </div>
        </div>
    );
};

export default Landing;