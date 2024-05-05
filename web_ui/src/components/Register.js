import React, { useState, useEffect } from 'react';
import Validation from './RegisterValidation';
import './styles/Register.css';

const RegisterScreen = () => {
    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})
    const handleInput = (event) => {
        const { name, value } = event.target;
        // Update the values state with the new field-value pair
        setValues(prevValues => ({ ...prevValues, [name]: value }));
    };

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Convert values object to JSON string
            const jsonData = JSON.stringify(values);

            // Send JSON data to backend
            const response = await axios.post('/API/Register', jsonData);
            console.log(response.data); // Assuming backend returns some response
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div class="login-container">
            <div className="progress-bar">
                <span className={currentStep === 1 ? "dot active" : "dot"} onClick={() => goToStep(1)}></span>
                <span className={currentStep === 2 ? "dot active" : "dot"} onClick={() => goToStep(2)}></span>
                <span className={currentStep === 3 ? "dot active" : "dot"} onClick={() => goToStep(3)}></span>
                <span className={currentStep === 4 ? "dot active" : "dot"} onClick={() => goToStep(4)}></span>
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
                            <div className='first-name'>
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" name="firstName" placeholder="John" value={values.first_name}></input>
                            </div>
                            <div className='last-name'>
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" name="lastName" placeholder="Smith" value={values.last_name}></input>
                            </div>
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
                            <label htmlFor="phone">Phone Number</label>
                            <input type="text" id="phone-number" name="phoneNumber" placeholder='555-5555-5555' value={values.phone}></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="street">Address (optional)</label>
                            <input type="text" id="street" name="street" placeholder='555 Movie Avenue' value={values.address}></input>
                            <input type="text" id="city" name="city" placeholder='Athens' value={values.city}></input>
                            <input type="text" id="state" name="state" placeholder='Georgia' value={values.state}></input>
                            <input type="text" id="zip" name="zip" placeholder='55555' value={values.zip}></input>
                        </div>
                        <button type="button" className="next-btn" onClick={handleNext}>Next</button>
                    </div>
                )}
                {currentStep === 4 && (
                    <div className="step step-3 active">
                        <div className="form-group">
                            <label htmlFor="street">Card Information (optional)</label>
                            <input type="text" id="card" name="card" placeholder='card type' value={values.card_type}></input>
                            <input type="text" id="cardNumber" name="cardNumber" placeholder='card number' value={values.card_number}></input>
                            <input type="text" id="expiration" name="expiration" placeholder='expiration date' value={values.card_expiration}></input>
                            <input type="text" id="cvv" name="cvv" placeholder='cvv' value={values.card_cvv}></input>
                            <label htmlFor="street">Billing Address</label>
                            <input type="text" id="street" name="street" placeholder='555 Movie Avenue' value={values.billing_address}></input>
                            <input type="text" id="city" name="city" placeholder='Athens' value={values.billing_city}></input>
                            <input type="text" id="state" name="state" placeholder='Georgia' value={values.billing_state}></input>
                            <input type="text" id="zip" name="zip" placeholder='55555' value={values.billing_zip}></input>
                        </div>
                        <button type="submit" className="submit-btn" onClick={handleSubmit}>Submit</button>
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