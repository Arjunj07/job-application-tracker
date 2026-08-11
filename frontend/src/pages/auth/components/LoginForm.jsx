import "./LoginForm.css";

function LoginForm({ onSwitchToSignup }) {
  return (
    <div className="login-form-content">
      <h2 className="form-title">Login</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="input-field">
          <input type="text" placeholder="Email" />
        </div>
        <div className="input-field">
          <input type="password" placeholder="Password" />
        </div>
        <div className="input-field">
          <button type="submit" className="submit-btn">Login</button>
        </div>
        <div className="form-links">
          <a href="#" className="forgot-pass">Forgot Password ?</a>
          <p className="signup-text">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onSwitchToSignup) onSwitchToSignup();
              }}
            >
              Create account
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
