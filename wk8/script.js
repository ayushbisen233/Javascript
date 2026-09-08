document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('gymForm');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const plan = document.getElementById('plan');
    const successMessage = document.getElementById('successMessage');

    // 1. Validation Logic
    const validateName = () => {
        const value = fullName.value.trim();
        const errorSpan = document.getElementById('nameError');
        if (value.length < 3) {
            showError(fullName, errorSpan, 'Name must be at least 3 characters long');
            return false;
        }
        showSuccess(fullName, errorSpan);
        return true;
    };

    const validateEmail = () => {
        const value = email.value.trim();
        const errorSpan = document.getElementById('emailError');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            showError(email, errorSpan, 'Please enter a valid email address');
            return false;
        }
        showSuccess(email, errorSpan);
        return true;
    };

    const validatePhone = () => {
        const value = phone.value.trim();
        const errorSpan = document.getElementById('phoneError');
        const phonePattern = /^\d{10}$/; // Exactly 10 digits
        if (!phonePattern.test(value)) {
            showError(phone, errorSpan, 'Phone number must be exactly 10 digits');
            return false;
        }
        showSuccess(phone, errorSpan);
        return true;
    };

    const validatePlan = () => {
        const value = plan.value;
        const errorSpan = document.getElementById('planError');
        if (value === "") {
            showError(plan, errorSpan, 'Please select a membership plan');
            return false;
        }
        showSuccess(plan, errorSpan);
        return true;
    };

    // Helper functions for UI feedback
    const showError = (inputElement, errorElement, message) => {
        inputElement.classList.add('invalid');
        inputElement.classList.remove('valid');
        errorElement.textContent = message;
    };

    const showSuccess = (inputElement, errorElement) => {
        inputElement.classList.add('valid');
        inputElement.classList.remove('invalid');
        errorElement.textContent = '';
    };

    // --- EVENT LISTENERS ---

    // 2. FOCUS EVENTS
    // Highlight or log when user enters a field
    const inputs = [fullName, email, phone, plan];
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            console.log(`User is focused on: ${e.target.name}`);
        });
    });

    // 3. BLUR EVENTS
    // Validate when the user leaves a field
    fullName.addEventListener('blur', validateName);
    email.addEventListener('blur', validateEmail);
    phone.addEventListener('blur', validatePhone);
    plan.addEventListener('blur', validatePlan);

    // 4. LIVE INPUT EVENTS
    // Provide live feedback as they type (only if they already have an error)
    fullName.addEventListener('input', () => {
        if (fullName.classList.contains('invalid')) validateName();
    });
    email.addEventListener('input', () => {
        if (email.classList.contains('invalid')) validateEmail();
    });
    phone.addEventListener('input', () => {
        if (phone.classList.contains('invalid')) validatePhone();
    });
    plan.addEventListener('change', () => {
        if (plan.classList.contains('invalid')) validatePlan();
    });

    // 5. SUBMIT EVENT
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload
        
        // Validate all fields on submit
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isPlanValid = validatePlan();

        // If everything is valid, show success message
        if (isNameValid && isEmailValid && isPhoneValid && isPlanValid) {
            form.classList.add('hidden'); // Hide the form
            successMessage.classList.remove('hidden'); // Show success text
            console.log('Form successfully submitted!');
        } else {
            console.log('Form submission failed due to validation errors.');
        }
    });
});
