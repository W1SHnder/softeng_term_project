import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './styles/ForgotPassword.css';

const ForgotScreen = () => {
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [buttonText, setButtonText] = useState('Send Code');
    const [values, setValues] = useState({});
    const navigate = useNavigate();

    const handleSendCode = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`http://127.0.0.1:8000/Verify/${values.email}`);
            console.log(response);
        } catch (error) {
            console.error('Error fetching data:', error.response.data.message);
        }
        setShowCodeInput(true);
        setButtonText('Submit');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            "email": values.email,
            "password": values.password,
            "code": values.code
        }
        axios.post('http://127.0.0.1:8000/RecoverPassword/', data, { withCredentials: true })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setErrors({ error: 'Invalid email or password. Please try again.' });
            });
            navigate('/login');
        setShowCodeInput(true);
        setButtonText('Submit');
    };

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prevValues => ({ ...prevValues, [name]: value }));
    };

    return (
        <div className="forgot-container">
            <h2>Recover</h2>
            <div className='underline'></div>
            <form action="server" method="post">
                <input type="text" id="email" name="email" placeholder="Email" value={values.email} onChange={handleInput}/>
                <input type="password" id="password" name="password" placeholder='Password' value={values.password} onChange={handleInput}/>
                {showCodeInput && (
                    <input type="text" id="code" name="code" placeholder="Code" value={values.code} onChange={handleInput}/>
                )}
                <button type="button" onClick={showCodeInput ? handleSubmit : handleSendCode}>{buttonText}</button>
            </form>
        </div>
    );
}

function ForgotPassword() {
    return (
        <div className="ForgotPassword">
            <ForgotScreen />
        </div>
    );
}

export default ForgotPassword;
