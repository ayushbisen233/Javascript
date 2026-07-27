function validateForm() {
    var loginId = document.getElementById('loginId').value.trim();
    var password = document.getElementById('password').value;

    var loginIdError = document.getElementById('loginIdError');
    var passwordError = document.getElementById('passwordError');
    var successMessage = document.getElementById('successMessage');

    // Reset
    loginIdError.innerHTML = '';
    passwordError.innerHTML = '';
    successMessage.innerHTML = '';

    var isValid = true;

    // Validate Login ID
    if (loginId === '') {
        loginIdError.innerHTML = 'Login ID is required.';
        isValid = false;
    } else if (loginId.length < 3) {
        loginIdError.innerHTML = 'Login ID must be at least 3 characters.';
        isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(loginId)) {
        loginIdError.innerHTML = 'Login ID can only contain letters and spaces.';
        isValid = false;
    }

    // Validate Password
    if (password === '') {
        passwordError.innerHTML = 'Password is required.';
        isValid = false;
    } else {
        var pwdErrors = [];
        if (password.length < 8) pwdErrors.push('at least 8 characters');
        if (!/[A-Z]/.test(password)) pwdErrors.push('one uppercase letter');
        if (!/[a-z]/.test(password)) pwdErrors.push('one lowercase letter');
        if (!/[0-9]/.test(password)) pwdErrors.push('one integer');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) pwdErrors.push('one special character');

        if (pwdErrors.length > 0) {
            passwordError.innerHTML = 'Password must contain: ' + pwdErrors.join(', ') + '.';
            isValid = false;
        }
    }

    if (isValid) {
        successMessage.innerHTML = 'Login Successful!';
    }

    return false;
}
