import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './styles/Login.css';

const Login = () => {
    const apiUrl = env.API_URL;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const handleSubmit = async(e) => {
        e.preventDefault();
	try {
	    const response = await axios.post(`${apiUrl}/login`, {
		method: 'POST',
		headers: {
		    'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password })
	    });

	    const data = await response.json();
	    if (response.ok) {
		localStorage.setItem('token', data.token);
	    } else {
		console.log(data.message);
	    }
	} catch (error) {
	    console.error('Error:', error);
	}
    };

    return (
	<div class="login-container">
            <h2>Sign In</h2>
            <form action="your_server_endpoint" method="post">
            	<input type="text" id="username" name="username" placeholder="Email" required>

            	<div class="password-container">
                	<input type="password" id="password" name="password" placeholder="Password" required>
                	<i class="eye-icon bi bi-eye-slash" id="togglePassword"></i>
            	</div>

            	<br>
            	<button type="submit">Sign in</button>
            	<br><br>
            	<span id="no-account">No account? <a href="register.html" id="sign-up">Sign up now</a></span>
            </form>
    	</div>
    );
	
}
  


