import { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import "./AuthPage.css";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className={`auth-card ${isLogin ? "mode-login" : "mode-signup"}`}>
        {/* Sliding Image Panel */}
        <div className="sliding-image-panel">
          <img src="/loginPage.jpg" alt="Auth illustration" />
        </div>

        {/* Left Side: Signup Form */}
        <div className="form-panel signup-panel">
          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
        </div>

        {/* Right Side: Login Form */}
        <div className="form-panel login-panel">
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
