import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

const LoginScreen = () => {
    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})
    const navigate = useNavigate();

    const togglePassword = () => {
        const password = document.getElementById('password');
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        const eyeIcon = document.getElementById('togglePassword');
        eyeIcon.classList.toggle('bi-eye');
    }

    const handleInput = (event) => {
        const { name, value, type, checked } = event.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setValues(prevValues => ({ ...prevValues, [name]: inputValue }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const loginData = {
            "email": values.email,
            "password": values.password,
            "long_session": values.remember
        }
    
        axios.post('http://127.0.0.1:8000/Login/', loginData, {withCredentials:true})
            .then(response => {
                console.log(response.data);
                navigate('/profile');
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setErrors({ error: 'Invalid email or password. Please try again.' });
            });
    }

    return (
        <div class="login-container">
            <h2>Sign In</h2>
            <div className='underline'></div>
            <form action="server" method="post">
                <input type="text" id="email" name="email" placeholder="Email" onChange={handleInput} value={values.email} />
                <div className="password-container">
                    <input type="password" id="password" name="password" placeholder="Password" onChange={handleInput} value={values.password} />
                    <i className="eye-icon bi bi-eye-slash" id="togglePassword" onClick={() => togglePassword()}></i>
                </div>
                <button type="submit" onClick={handleSubmit}>Sign in</button>
                <br></br>
                <div className="remember">
                    <input type="checkbox" name="remember" value={values.remember}/>
                    <label htmlFor="remember">Remember me</label>
                </div>
                <div><Link to="/forgotPassword" id="forgot-password">Forgot Password?</Link></div>
                <span id="no-account">No account? <Link to="/register" id="sign-up">Sign up now</Link></span>
            </form>
            {errors.error && <span className="text-danger">{errors.error}</span>}
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