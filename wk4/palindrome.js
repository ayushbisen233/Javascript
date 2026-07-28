document.addEventListener('DOMContentLoaded', () => {
    const checkBtn = document.getElementById('check-btn');
    const textInput = document.getElementById('text-input');
    const resultElement = document.getElementById('result');

    checkBtn.addEventListener('click', checkPalindrome);

    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkPalindrome();
        }
    });

    function checkPalindrome() {
        const inputStr = textInput.value;

        resultElement.className = 'result';
        resultElement.innerHTML = '';

        try {
            if (inputStr.trim() === '') {
                throw new Error("Please enter a value to check.");
            }

            const cleanedStr = inputStr.replace(/[^A-Za-z0-9]/g, '').toLowerCase();

            if (cleanedStr === '') {
                throw new Error("Input must contain alphanumeric characters.");
            }

            const reversedStr = cleanedStr.split('').reverse().join('');

            if (cleanedStr === reversedStr) {
                resultElement.innerHTML = `<strong>"${inputStr}"</strong> is a palindrome.`;
                resultElement.classList.add('success');
            } else {
                resultElement.innerHTML = `<strong>"${inputStr}"</strong> is not a palindrome.`;
                resultElement.classList.add('error');
            }
        } catch (error) {
            resultElement.innerHTML = `<strong>Invalid Input:</strong> ${error.message}`;
            resultElement.classList.add('invalid');
        }
    }
});
