function Validation(values, currentStep) {
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if (currentStep === 1) {
        if (values.email === "") {
            error.email = "Email should not be empty";
        } else if (!email_pattern.test(values.email)) {
            error.email = "Invalid email";
        }

        if (!values.first_name) {
            error.first_name = "First name should not be empty";
        }
        if (!values.last_name) {
            error.last_name = "Last name should not be empty";
        }

    } else if (currentStep === 2) {
        if (values.password === "") {
            error.password = "Password should not be empty";
        } else if (!password_pattern.test(values.password)) {
            error.password = "Invalid password";
        } else if (values.password !== values.confirm_password) {
            error.password = "Passwords do not match";
        }
    } else if (currentStep === 3) {
        if (!values.phone) {
            error.phone = "Phone should not be empty";
        }
    }

    return error;
}

export default Validation;