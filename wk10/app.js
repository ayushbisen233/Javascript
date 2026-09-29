document.addEventListener('DOMContentLoaded', () => {
    const studentGrid = document.getElementById('student-grid');
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');

    // Fetch the JSON file
    // Note: This requires a web server (like VS Code Live Server) to work due to CORS policies
    fetch('student.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Remove loading message
            loadingEl.style.display = 'none';

            // Create cards for each student with a slight stagger effect
            data.forEach((student, index) => {
                createStudentCard(student, index * 0.05);
            });
        })
        .catch(error => {
            console.error('Error fetching student data:', error);
            loadingEl.style.display = 'none';
            errorEl.style.display = 'block';
            errorEl.innerHTML = `
                <strong>Connection Error</strong><br><br>
                Failed to load student.json.<br>
                Please make sure you are running this through a Local Server (like the VS Code Live Server extension).
            `;
        });

    const addStudentForm = document.getElementById('add-student-form');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('student-id-input').value;
            const name = document.getElementById('student-name-input').value;
            const dept = document.getElementById('student-dept-input').value;
            const marks = document.getElementById('student-marks-input').value;

            const newStudent = { id, name, dept, marks };
            createStudentCard(newStudent, 0);
            addStudentForm.reset();
        });
    }

    function createStudentCard(student, delay = 0) {
        const card = document.createElement('div');
        card.className = 'student-card';
        if (delay > 0) {
            card.style.animationDelay = `${delay}s`;
        }

        card.innerHTML = `
            <span class="student-id">ID: #${student.id.toString().padStart(3, '0')}</span>
            <h2 class="student-name">${student.name}</h2>
            <div class="student-dept">${student.dept}</div>
            <div class="student-marks">
                <span class="marks-label">Total Marks</span>
                <span class="marks-value">${student.marks}</span>
            </div>
        `;

        studentGrid.appendChild(card);
    }
});
