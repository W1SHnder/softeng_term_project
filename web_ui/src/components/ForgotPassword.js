import React from 'react';
import { Link } from 'react-router-dom';
import './styles/ForgotPassword.css';

const ForgotScreen = () => {
    return (
        <div className="forgot-container">
            <h2>Recover</h2>
            <div className='underline'></div>
            <form action="server" method="post">
                <input type="text" id="email" name="email" placeholder="Email" />
                <button type="submit">Send Code</button>
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