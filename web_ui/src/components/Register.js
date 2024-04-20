import React, { useState, useEffect } from 'react';
import Validation from './RegisterValidation';
import './styles/Register.css';

const RegisterScreen = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        confirm_password: '',
        address: ''
    })
    const [errors, setErrors] = useState({})
    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => {
        setErrors(Validation(values, currentStep));
    };

    useEffect(() => {
        if (currentStep === 1 && errors.email !== "") {
            return;
        } else if (currentStep === 2 && (errors.password !== "")) {
            return;
        } else if (currentStep === 3 && (errors.address !== "")) {
            return;
        }
        setCurrentStep(currentStep + 1);
    }, [errors]);

    const goToStep = (step) => {
        setCurrentStep(step);
    };

    const togglePassword = () => {
        const password = document.getElementById('password');
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        const eyeIcon = document.getElementById('togglePassword');
        eyeIcon.classList.toggle('bi-eye');
    }

    const toggleConfirmPassword = () => {
        const password = document.getElementById('confirm-password');
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        const eyeIcon = document.getElementById('toggleConfirmPassword');
        eyeIcon.classList.toggle('bi-eye');
    }

    return (
        <div class="login-container">
            <div className="progress-bar">
                <span className={currentStep === 1 ? "dot active" : "dot"} onClick={() => goToStep(1)}></span>
                <span className={currentStep === 2 ? "dot active" : "dot"} onClick={() => goToStep(2)}></span>
                <span className={currentStep === 3 ? "dot active" : "dot"} onClick={() => goToStep(3)}></span>
            </div>
            <h2>Sign Up</h2>
            <div className='underline'></div>
            <form action="server" method="post">
                {currentStep === 1 && (
                    <div className="step step-1 active">
                        <div className="form-group">
                            <label htmlFor="email" className="header">Email</label>
                            <input type="text" id="email" name="email" placeholder="watch@movies.com" onChange={handleInput} value={values.email} ></input>
                        </div>
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                        <div className="form-group">
                            <label htmlFor="firstName">Username</label>
                            <input type="text" id="firstName" name="first-name" placeholder="moviefan"></input>
                        </div>
                        <button type="button" className="next-btn" onClick={handleNext}>Next</button>
                    </div>
                )}
                {currentStep === 2 && (
                    <div className="step step-2 active">
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-container">
                                <input type="password" id="password" name="password" onChange={handleInput} value={values.password} ></input>
                                <i className="eye-icon bi bi-eye-slash" id="togglePassword" onClick={togglePassword}></i>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm password</label>
                            <div className="password-container">
                                <input type="password" id="confirm-password" name="confirm_password" onChange={handleInput} value={values.confirm_password}></input>
                                <i className="eye-icon bi bi-eye-slash" id="toggleConfirmPassword" onClick={toggleConfirmPassword}></i>
                            </div>
                        </div>
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                        <button type="button" className="next-btn" onClick={handleNext}>Next</button>

                    </div>
                )}
                {currentStep === 3 && (
                    <div className="step step-3 active">
                        <div className="form-group">
                            <label htmlFor="bankroll">Address</label>
                            <input type="text" id="address" name="address" placeholder='555 Movie Ave'></input>
                        </div>
                        <button type="submit" className="submit-btn">Submit</button>
                    </div>
                )}
            </form>
        </div>
    );
}

function Register() {
    return (
        <div className="Login">
            <RegisterScreen />
        </div>
    );
}

export default Register;