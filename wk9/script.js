document.addEventListener('DOMContentLoaded', () => {
    const btnLight = document.getElementById('btn-light');
    const btnDark = document.getElementById('btn-dark');
    const btnClear = document.getElementById('btn-clear');

    // Function to apply a theme
    const applyTheme = (themeName) => {
        if (themeName === 'clear') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.removeItem('preferredTheme');
        } else {
            document.documentElement.setAttribute('data-theme', themeName);
            localStorage.setItem('preferredTheme', themeName);
        }
    };

    // Load saved theme on startup
    const savedTheme = localStorage.getItem('preferredTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    // Event listeners for buttons
    btnLight.addEventListener('click', () => applyTheme('light'));
    btnDark.addEventListener('click', () => applyTheme('dark'));
    
    // The "Clear" theme restores the default classic green theme
    btnClear.addEventListener('click', () => applyTheme('clear'));
});
