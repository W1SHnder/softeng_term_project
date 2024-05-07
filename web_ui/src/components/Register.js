import React, { useState, useEffect } from 'react';
import { json } from 'react-router-dom';
import Validation from './RegisterValidation';
import axios from 'axios';
import './styles/Register.css';

const RegisterScreen = () => {
    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        const { name, value, type, checked } = event.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setValues(prevValues => ({ ...prevValues, [name]: inputValue }));
    };

    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => {
        const validationErrors = Validation(values, currentStep);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setCurrentStep(currentStep + 1);
        }
    };

    const sendEmail = async (event) => {
        setCurrentStep(currentStep + 1);
        event.preventDefault();
        try {
            const response = await axios.get(`http://127.0.0.1:8000/Verify/${values.email}`);
        } catch (error) {
            console.error('Error fetching data:', error.response.data.message);
        }
    };

    const goToStep = (step) => {
        const validationErrors = Validation(values, currentStep);
        setErrors(validationErrors);
        console.log(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setCurrentStep(step);
        }
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

        const payment_card = {
            "card_type": values.card_type,
            "card_number": values.card_number,
            "expiration_date": values.card_expiration,
            "address1": values.billing_address1,
            "address2": values.billing_address2,
            "city": values.billing_city,
            "state": values.billing_state,
            "zipcode": values.billing_zip
        }

        const shipping_addr = {
            "address1": values.address1,
            "address2": values.address2,
            "city": values.city,
            "state": values.state,
            "zipcode": values.zip
        }

        const registrationData = {
            "email": values.email,
            "first_name": values.first_name,
            "last_name": values.last_name,
            "phone": values.phone,
            "password": values.password,
            "promotions_opt_in": values.promotions,
            "code": values.reg_code,
            "payment_card": payment_card,
            "shipping_address": shipping_addr
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/Register/', registrationData);
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error.response.data.message);
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
            <form>
                {currentStep === 1 && (
                    <div className="step step-1 active">
                        <div className="form-group">
                            <label htmlFor="email" className="header">Email</label>
                            <input type="text" id="email" name="email" placeholder="watch@movies.com" onChange={handleInput} value={values.email} ></input>
                        </div>
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                        <div className="form-group">
                                <label htmlFor="first_name">First Name</label>
                                <input type="text" id="first_name" name="first_name" placeholder="John" onChange={handleInput} value={values.first_name}></input>
                        </div>
                        {errors.first_name && <span className="text-danger">{errors.first_name}</span>}
                        <div className='form-group'>
                                <label htmlFor="last_name">Last Name</label>
                                <input type="text" id="first_name" name="last_name" placeholder="Smith" onChange={handleInput} value={values.last_name}></input>
                        </div>
                        {errors.last_name && <span className="text-danger">{errors.last_name}</span>}
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
                            <input type="text" id="phone" name="phone" placeholder='555-5555-5555' onChange={handleInput} value={values.phone}></input>
                        </div>
                        {errors.phone && <span className="text-danger">{errors.phone}</span>}
                        <div className="form-group">
                            <label htmlFor="street">Address (optional)</label>
                            <input type="text" id="address1" name="address1" placeholder='Address 1' onChange={handleInput} value={values.address1}></input>
                            <input type="text" id="address2" name="address2" placeholder='Address 2' onChange={handleInput} value={values.address2}></input>
                            <input type="text" id="city" name="city" placeholder='Athens' onChange={handleInput} value={values.city}></input>
                            <input type="text" id="state" name="state" placeholder='Georgia' onChange={handleInput} value={values.state}></input>
                            <input type="text" id="zip" name="zip" placeholder='55555' onChange={handleInput} value={values.zip}></input>
                        </div>
                        <button type="button" className="next-btn" onClick={handleNext}>Next</button>
                    </div>
                )}
                {currentStep === 4 && (
                    <div className="step step-4 active">
                        <div className="form-group">
                            <label htmlFor="street">Card Information (optional)</label>
                            <input type="text" id="card" name="card" placeholder='card type' onChange={handleInput} value={values.card_type}></input>
                            <input type="text" id="cardNumber" name="cardNumber" placeholder='card number' onChange={handleInput} value={values.card_number}></input>
                            <input type="text" id="expiration" name="expiration" placeholder='expiration date' onChange={handleInput} value={values.card_expiration}></input>
                            <input type="text" id="cvv" name="cvv" placeholder='cvv' onChange={handleInput} value={values.card_cvv}></input>
                            <label htmlFor="street">Billing Address</label>
                            <input type="text" id="billing_address1" name="billing_address1" placeholder='Address 1' onChange={handleInput} value={values.billing_address1}></input>
                            <input type="text" id="billing_address2" name="billing_address2" placeholder='Address 2' onChange={handleInput} value={values.billing_address2}></input>
                            <input type="text" id="city" name="city" placeholder='Athens' onChange={handleInput} value={values.billing_city}></input>
                            <input type="text" id="state" name="state" placeholder='Georgia' onChange={handleInput} value={values.billing_state}></input>
                            <input type="text" id="zip" name="zip" placeholder='55555' onChange={handleInput} value={values.billing_zip}></input>
                        </div>
                        <button type="button" className="next-btn" onClick={sendEmail}>Submit</button>
                    </div>
                )}
                {currentStep === 5 && (
                    <div className="step step-5 active">
                        <div className="form-group">
                            <label htmlFor="reg_code" className="header">Code</label>
                            <input type="text" id="reg_code" name="reg_code" placeholder="Code" onChange={handleInput} value={values.reg_code} ></input>
                        </div>
                        <input type="checkbox" id="promotions" name="promotions" onChange={handleInput} value={values.promotions}></input>
                        <label htmlFor="promotions">Do you want to receive promotions?</label>
                        <button type="submit" className="submit-btn" onClick={handleSubmit}>Verify</button>
                    </div>
                )}
            </form>
        </div>
    );
}

function Register() {
    return (
        <div className="Register">
            <RegisterScreen />
        </div>
    );
}

export default Register;
