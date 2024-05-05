import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Login.css';

const LoginScreen = () => {
    const togglePassword = () => {
        const password = document.getElementById('password');
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        const eyeIcon = document.getElementById('togglePassword');
        eyeIcon.classList.toggle('bi-eye');
    }

    return (
        <div class="login-container">
            <h2>Sign In</h2>
            <div className='underline'></div>
            <form action="server" method="post">
                <input type="text" id="email" name="email" placeholder="Email" />
                <div class="password-container">
                    <input type="password" id="password" name="password" placeholder="Password" />
                    <i class="eye-icon bi bi-eye-slash" id="togglePassword" onClick={() => togglePassword()}></i>
                </div>
                <button type="submit">Sign in</button>
                <br></br>
                <div className="remember">
                    <input type="checkbox" name="remember" />
                    <label htmlFor="remember">Remember me</label>
                </div>
                <div><Link to="/forgotPassword" id="forgot-password">Forgot Password?</Link></div>
                <span id="no-account">No account? <Link to="/register" id="sign-up">Sign up now</Link></span>
            </form>
        </div>
    );
}

function Login() {
    return (
        <div className="Login">
            <LoginScreen />
        </div>
    );
}

export default Login;