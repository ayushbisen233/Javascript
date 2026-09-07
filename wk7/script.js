document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');

    // 1. Add Task feature
    addBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (text !== '') {
            addTask(text);
            taskInput.value = '';
        }
    });

    // 2. Handle Edit and Delete using Event Delegation (DOM Traversal)
    taskList.addEventListener('click', (e) => {
        const target = e.target;
        
        // DOM Traversal: find the closest list item parent
        const li = target.closest('li');
        if (!li) return;

        // DELETE feature
        if (target.classList.contains('delete-btn')) {
            // DOM Updates: remove the element
            li.remove();
        } 
        // EDIT feature
        else if (target.classList.contains('edit-btn')) {
            const isEditing = li.classList.contains('edit-mode');
            const taskTextSpan = li.querySelector('.task-text');
            const editInput = li.querySelector('.edit-input');

            if (isEditing) {
                // Save the changes and update DOM
                const newText = editInput.value.trim();
                if (newText !== '') {
                    taskTextSpan.textContent = newText;
                }
                li.classList.remove('edit-mode');
                target.textContent = 'Edit';
            } else {
                // Enter edit mode
                li.classList.add('edit-mode');
                editInput.value = taskTextSpan.textContent;
                editInput.focus();
                target.textContent = 'Save';
            }
        }
    });

    // Helper function to create DOM elements and update the list
    function addTask(text) {
        // Create elements
        const li = document.createElement('li');

        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = text;

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';

        // DOM Updates: assemble the elements
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(taskTextSpan);
        li.appendChild(editInput);
        li.appendChild(actionsDiv);

        // Add the task to the list
        taskList.appendChild(li);
    }
});
