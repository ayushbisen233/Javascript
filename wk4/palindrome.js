document.addEventListener('DOMContentLoaded', () => {
    const checkBtn = document.getElementById('check-btn');
    const textInput = document.getElementById('text-input');
    const resultElement = document.getElementById('result');

    checkBtn.addEventListener('click', checkPalindrome);

    // Allow user to press Enter to check
    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkPalindrome();
        }
    });

    function checkPalindrome() {
        const inputStr = textInput.value;

        // Reset classes
        resultElement.className = 'result';
        resultElement.innerHTML = '';

        try {
            // Error handling: Check for empty string
            if (inputStr.trim() === '') {
                throw new Error("Please enter a value to check.");
            }

            // Remove all non-alphanumeric characters and turn to lowercase
            const cleanedStr = inputStr.replace(/[^A-Za-z0-9]/g, '').toLowerCase();

            // Error handling: Check if it's empty after cleaning
            if (cleanedStr === '') {
                throw new Error("Input must contain alphanumeric characters.");
            }

            const reversedStr = cleanedStr.split('').reverse().join('');

            // Check if it's a palindrome
            if (cleanedStr === reversedStr) {
                resultElement.innerHTML = `<strong>"${inputStr}"</strong> is a palindrome.`;
                resultElement.classList.add('success');
            } else {
                resultElement.innerHTML = `<strong>"${inputStr}"</strong> is not a palindrome.`;
                resultElement.classList.add('error');
            }
        } catch (error) {
            // Handle error using catch block
            resultElement.innerHTML = `<strong>Invalid Input:</strong> ${error.message}`;
            resultElement.classList.add('invalid');
        }
    }
});
