document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.topic-input');
    const topicCells = document.querySelectorAll('.topic-cell');

    const btnLocal = document.getElementById('btn-local');
    const btnSession = document.getElementById('btn-session');
    const btnClear = document.getElementById('btn-clear');

    // Default requested topics to optionally fall back to if storage is completely empty, 
    // but users can primarily type their own.
    const defaultTopics = [
        "Web Development Basics",
        "Introduction to Artificial Intelligence",
        "Database Management",
        "Cloud Computing",
        "Cyber Security Fundamentals",
        "Machine Learning Concepts"
    ];

    // Function to update the background color of a cell based on content
    const updateCellState = (input) => {
        const cell = input.closest('.topic-cell');
        if (input.value.trim() !== '') {
            cell.classList.add('filled');
        } else {
            cell.classList.remove('filled');
        }
    };

    // Save current inputs to a given storage (local or session)
    const saveToStorage = (storage) => {
        const data = Array.from(inputs).map(input => input.value.trim());
        storage.setItem('scheduleTopicsData', JSON.stringify(data));
    };

    // Load inputs from a given storage
    const loadFromStorage = (storage) => {
        const savedData = storage.getItem('scheduleTopicsData');
        if (savedData) {
            const data = JSON.parse(savedData);
            inputs.forEach((input, index) => {
                input.value = data[index] || '';
                updateCellState(input);
            });
        } else {
            // Optional fallback: load defaults if nothing is saved
            inputs.forEach((input, index) => {
                input.value = defaultTopics[index] || '';
                updateCellState(input);
            });
        }
    };

    // Listeners for inputs to update color on typing
    inputs.forEach(input => {
        input.addEventListener('input', () => updateCellState(input));
    });

    const areInputsEmpty = () => {
        return Array.from(inputs).every(input => input.value.trim() === '');
    };

    // --- Button Event Listeners ---
    btnLocal.addEventListener('click', () => {
        if (areInputsEmpty()) {
            loadFromStorage(localStorage);
            alert('Data loaded from Local Storage!');
        } else {
            saveToStorage(localStorage);
            alert('Data saved to Local Storage!');
        }
    });

    btnSession.addEventListener('click', () => {
        if (areInputsEmpty()) {
            loadFromStorage(sessionStorage);
            alert('Data loaded from Session Storage!');
        } else {
            saveToStorage(sessionStorage);
            alert('Data saved to Session Storage!');
        }
    });

    btnClear.addEventListener('click', () => {
        inputs.forEach(input => {
            input.value = '';
            updateCellState(input);
        });
    });

    // Check Local storage on arrival. If present, load it.
    if (localStorage.getItem('scheduleTopicsData')) {
        loadFromStorage(localStorage);
    } 

    // Click event for alert on cell background (but not when clicking the input to type)
    topicCells.forEach(cell => {
        cell.addEventListener('click', (event) => {
            // Check if they clicked the cell padding/border, not the input itself
            if (event.target.tagName.toLowerCase() !== 'input') {
                const input = cell.querySelector('.topic-input');
                const topicName = input ? input.value.trim() : '';
                if (topicName !== '') {
                    alert(`You clicked: ${topicName}`);
                }
            }
        });
    });

    // Click event for alert on day cells
    const dayCells = document.querySelectorAll('.day-cell');
    dayCells.forEach(cell => {
        cell.addEventListener('click', (event) => {
            const dayName = event.target.textContent.trim();
            alert(`You clicked the day: ${dayName}`);
        });
    });
    
    // To fulfill the requirement "if session storage clicked then after refresh gone",
    // standard sessionStorage survives refresh, so we explicitly remove it.
    window.addEventListener('beforeunload', () => {
        sessionStorage.removeItem('scheduleTopicsData');
    });
});
