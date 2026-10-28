/**
 * app.js - Week 12 Interactive Real-Time Web Application
 * Demonstrates:
 * 1. DOM: Element creation, traversal, class toggling, text/HTML insertion, animations (.fadeIn, .slideUp)
 * 2. Events: form submit, real-time input keyup, click, change, event delegation
 * 3. Storage: localStorage persistence, sync, export, and clearance
 * 4. AJAX Integration: $.ajax(), $.getJSON() with beforeSend, success, error, complete handling
 */

$(document).ready(function () {
    // ----------------------------------------------------
    // Application State
    // ----------------------------------------------------
    const STORAGE_KEY = 'wk12_greendesk_tasks';
    let tasks = [];
    let currentFilter = 'all';
    let searchQuery = '';
    let currentSort = 'newest';

    // ----------------------------------------------------
    // 1. Storage Operations
    // ----------------------------------------------------
    function getStoredTasks() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (err) {
            console.warn('Storage read error:', err);
        }
        return null;
    }

    function saveTasksToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            updateStorageBadge();
        } catch (err) {
            console.error('Storage write error:', err);
            showToast('Failed to save to localStorage', 'error');
        }
    }

    function updateStorageBadge() {
        const count = tasks.length;
        $('#storage-count').text(`${count} items in localStorage`);
    }

    // ----------------------------------------------------
    // 2. DOM Rendering & Stats Updates
    // ----------------------------------------------------
    function updateMetrics() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const highPriority = tasks.filter(t => t.priority.toLowerCase() === 'high' && !t.completed).length;

        // Smooth text update using jQuery
        $('#stat-total').text(total);
        $('#stat-completed').text(completed);
        $('#stat-pending').text(pending);
        $('#stat-high').text(highPriority);
    }

    function renderTasks() {
        const $container = $('#task-list');
        $container.empty();

        // Filter tasks
        let filtered = tasks.filter(function (t) {
            // Category/Status filter
            if (currentFilter === 'active' && t.completed) return false;
            if (currentFilter === 'completed' && !t.completed) return false;
            if (currentFilter === 'high' && t.priority.toLowerCase() !== 'high') return false;

            // Search query filter (matches title, category, or notes)
            if (searchQuery.trim() !== '') {
                const q = searchQuery.toLowerCase();
                const matchTitle = t.title.toLowerCase().includes(q);
                const matchCat = t.category.toLowerCase().includes(q);
                const matchNotes = (t.notes || '').toLowerCase().includes(q);
                if (!matchTitle && !matchCat && !matchNotes) return false;
            }
            return true;
        });

        // Sort tasks
        filtered.sort(function (a, b) {
            if (currentSort === 'newest') {
                return (b.id || '').localeCompare(a.id || '');
            } else if (currentSort === 'dueDate') {
                return (a.dueDate || '').localeCompare(b.dueDate || '');
            } else if (currentSort === 'priority') {
                const pMap = { high: 1, medium: 2, low: 3 };
                return (pMap[a.priority.toLowerCase()] || 4) - (pMap[b.priority.toLowerCase()] || 4);
            }
            return 0;
        });

        if (filtered.length === 0) {
            const emptyMsg = searchQuery 
                ? `No tasks match your search: "${searchQuery}"`
                : `No tasks found for "${currentFilter}" filter.`;

            const $empty = $('<div>')
                .addClass('empty-state')
                .hide()
                .html(`
                    <div class="empty-icon">🍃</div>
                    <h4>No Tasks Found</h4>
                    <p>${emptyMsg}</p>
                `);
            $container.append($empty);
            $empty.fadeIn(200);
            updateMetrics();
            return;
        }

        // Generate DOM cards
        filtered.forEach(function (task) {
            const isDone = task.completed ? 'is-completed' : '';
            const checkedAttr = task.completed ? 'checked' : '';
            const priorityClass = `priority-${task.priority.toLowerCase()}`;

            const $card = $('<div>')
                .addClass(`task-item ${isDone}`)
                .attr('data-id', task.id)
                .hide();

            const cardHtml = `
                <div class="task-checkbox-wrap">
                    <input type="checkbox" class="task-checkbox" ${checkedAttr} title="Mark as completed">
                </div>
                <div class="task-content-main">
                    <h4 class="task-title">${escapeHtml(task.title)}</h4>
                    <div class="task-meta-row">
                        <span class="task-badge-cat">📁 ${escapeHtml(task.category)}</span>
                        <span class="badge-priority ${priorityClass}">● ${escapeHtml(task.priority)}</span>
                        <span>📅 Due: ${escapeHtml(task.dueDate || 'No Date')}</span>
                    </div>
                    ${task.notes ? `<div class="task-notes">📝 ${escapeHtml(task.notes)}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn-icon btn-delete" title="Delete Task">🗑️</button>
                </div>
            `;

            $card.html(cardHtml);
            $container.append($card);
            $card.fadeIn(180);
        });

        updateMetrics();
    }

    function escapeHtml(str) {
        if (!str) return '';
        return $('<div>').text(str).html();
    }

    // ----------------------------------------------------
    // 3. Toast Notifications
    // ----------------------------------------------------
    let toastTimer = null;
    function showToast(message, type = 'success') {
        const $toast = $('#toast-notification');
        clearTimeout(toastTimer);

        $toast
            .removeClass('toast-success toast-warning toast-error')
            .addClass(`toast-${type}`)
            .html(`
                <span class="toast-icon">${type === 'success' ? '✓' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                <span>${message}</span>
            `)
            .fadeIn(200);

        toastTimer = setTimeout(function () {
            $toast.fadeOut(300);
        }, 3000);
    }

    // ----------------------------------------------------
    // 4. AJAX Integration: Remote Data, Quotes, and Books
    // ----------------------------------------------------
    
    /**
     * AJAX Feature 1: Fetch tasks from tasks.json via $.ajax
     */
    function fetchRemoteTasks(forceReload = false) {
        const stored = getStoredTasks();
        if (stored && stored.length > 0 && !forceReload) {
            tasks = stored;
            renderTasks();
            updateStorageBadge();
            showToast('Loaded tasks from localStorage.', 'success');
            return;
        }

        // jQuery AJAX call
        $.ajax({
            url: 'tasks.json',
            type: 'GET',
            dataType: 'json',
            beforeSend: function () {
                $('#ajax-sync-btn').prop('disabled', true).text('⏳ Syncing...');
            },
            success: function (data) {
                if (Array.isArray(data)) {
                    tasks = data;
                    saveTasksToStorage();
                    renderTasks();
                    showToast(`AJAX: Successfully fetched ${data.length} sample tasks!`, 'success');
                }
            },
            error: function (xhr, status, error) {
                console.warn('AJAX error loading tasks.json:', status, error);
                // Fallback default tasks if local server isn't running
                tasks = [
                    {
                        id: 'task-fallback-1',
                        title: 'Interactive jQuery & AJAX Integration Lab',
                        category: 'Coding',
                        priority: 'High',
                        dueDate: '2026-11-01',
                        completed: false,
                        notes: 'Mastered $.ajax(), event handlers, and localStorage sync.'
                    },
                    {
                        id: 'task-fallback-2',
                        title: 'DOM Manipulation & Dynamic Event Delegation',
                        category: 'Academic',
                        priority: 'Medium',
                        dueDate: '2026-11-04',
                        completed: true,
                        notes: 'Demonstrated dynamic card creation and sliding animations.'
                    }
                ];
                saveTasksToStorage();
                renderTasks();
                showToast('AJAX fallback: Loaded initial template tasks.', 'warning');
            },
            complete: function () {
                $('#ajax-sync-btn').prop('disabled', false).html('🔄 Sync AJAX');
            }
        });
    }

    /**
     * AJAX Feature 2: Fetch Live Quotes / Productivity Tips
     */
    function fetchLiveQuote() {
        const $box = $('#quote-display-area');
        const $spinner = $('#ajax-quote-spinner');

        $spinner.show();
        $box.hide();

        // Using public Quote API with $.ajax
        $.ajax({
            url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://dummyjson.com/quotes/random'),
            type: 'GET',
            dataType: 'json',
            timeout: 5000,
            success: function (res) {
                if (res && res.quote) {
                    $box.html(`
                        <p class="quote-widget-text">"${escapeHtml(res.quote)}"</p>
                        <div class="quote-author">&mdash; ${escapeHtml(res.author || 'Wise Thinker')}</div>
                    `).fadeIn(250);
                } else {
                    displayFallbackQuote();
                }
            },
            error: function () {
                displayFallbackQuote();
            },
            complete: function () {
                $spinner.hide();
            }
        });
    }

    function displayFallbackQuote() {
        const fallbackQuotes = [
            { q: "Small daily improvements over time lead to stunning results.", a: "Robin Sharma" },
            { q: "Simplicity is the soul of efficiency.", a: "Austin Freeman" },
            { q: "Action is the foundational key to all success.", a: "Pablo Picasso" },
            { q: "Clean code always looks like it was written by someone who cares.", a: "Robert C. Martin" }
        ];
        const randomItem = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        $('#quote-display-area').html(`
            <p class="quote-widget-text">"${randomItem.q}"</p>
            <div class="quote-author">&mdash; ${randomItem.a}</div>
        `).fadeIn(250);
    }

    /**
     * AJAX Feature 3: Live Academic Book Search via OpenLibrary API
     */
    function searchBooksAjax(query) {
        if (!query || query.trim() === '') return;

        const $results = $('#book-search-results');
        const $spinner = $('#book-search-spinner');

        $spinner.show();
        $results.empty();

        $.ajax({
            url: `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=3`,
            type: 'GET',
            dataType: 'json',
            timeout: 6000,
            success: function (data) {
                $spinner.hide();
                if (data && data.docs && data.docs.length > 0) {
                    data.docs.forEach(function (book) {
                        const title = book.title || 'Untitled';
                        const author = (book.author_name && book.author_name[0]) || 'Unknown Author';
                        const year = book.first_publish_year || 'N/A';

                        const $bookEl = $('<div>')
                            .addClass('stat-card')
                            .css({ 'margin-bottom': '0.5rem', 'padding': '0.75rem', 'font-size': '0.84rem' })
                            .html(`
                                <div>
                                    <strong>📖 ${escapeHtml(title)}</strong>
                                    <div style="color: var(--text-muted); font-size: 0.78rem;">By ${escapeHtml(author)} (${year})</div>
                                </div>
                                <button class="btn btn-secondary btn-sm btn-add-book-task" 
                                    data-title="${escapeHtml(title)}" 
                                    data-notes="Reference book by ${escapeHtml(author)}">
                                    + Add Task
                                </button>
                            `);
                        $results.append($bookEl);
                    });
                } else {
                    $results.html('<p style="color:var(--text-muted); font-size:0.84rem; text-align:center;">No reference results found.</p>');
                }
            },
            error: function () {
                $spinner.hide();
                $results.html('<p style="color:#b91c1c; font-size:0.84rem; text-align:center;">AJAX Search failed or offline.</p>');
            }
        });
    }

    // ----------------------------------------------------
    // 5. Event Handlers
    // ----------------------------------------------------

    // Form Submit: Add new task
    $('#task-form').on('submit', function (e) {
        e.preventDefault();

        const title = $('#task-title').val().trim();
        const category = $('#task-category').val();
        const priority = $('#task-priority').val();
        const dueDate = $('#task-due-date').val();
        const notes = $('#task-notes').val().trim();

        if (!title) {
            showToast('Please enter a task title', 'warning');
            return;
        }

        const newTask = {
            id: 'task-' + Date.now(),
            title: title,
            category: category,
            priority: priority,
            dueDate: dueDate,
            completed: false,
            notes: notes
        };

        // Add to beginning of array
        tasks.unshift(newTask);
        saveTasksToStorage();
        renderTasks();

        // Reset form & give feedback
        this.reset();
        $('#task-title').focus();
        showToast(`Added: "${title}"`, 'success');
    });

    // Delegated Event: Toggle completed state
    $(document).on('change', '.task-checkbox', function () {
        const $card = $(this).closest('.task-item');
        const id = $card.attr('data-id');
        const isChecked = $(this).is(':checked');

        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = isChecked;
            saveTasksToStorage();

            if (isChecked) {
                $card.addClass('is-completed');
                showToast(`Completed: "${task.title}"`, 'success');
            } else {
                $card.removeClass('is-completed');
                showToast(`Reopened: "${task.title}"`, 'info');
            }
            updateMetrics();
        }
    });

    // Delegated Event: Delete Task with jQuery slideUp effect
    $(document).on('click', '.btn-delete', function () {
        const $card = $(this).closest('.task-item');
        const id = $card.attr('data-id');

        $card.slideUp(200, function () {
            tasks = tasks.filter(t => t.id !== id);
            saveTasksToStorage();
            renderTasks();
            showToast('Task removed.', 'info');
        });
    });

    // Delegated Event: Add book from AJAX search directly as a task
    $(document).on('click', '.btn-add-book-task', function () {
        const title = $(this).data('title');
        const notes = $(this).data('notes');

        const newTask = {
            id: 'task-' + Date.now(),
            title: `Read: ${title}`,
            category: 'Academic',
            priority: 'Medium',
            dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            completed: false,
            notes: notes
        };

        tasks.unshift(newTask);
        saveTasksToStorage();
        renderTasks();
        showToast(`Created task from book: "${title}"`, 'success');
    });

    // Real-Time Search Input with jQuery 'input keyup'
    $('#search-input').on('input keyup', function () {
        searchQuery = $(this).val();
        renderTasks();
    });

    // Filter Tabs Click Event
    $('.filter-tab').on('click', function () {
        $('.filter-tab').removeClass('active');
        $(this).addClass('active');

        currentFilter = $(this).data('filter');
        renderTasks();
    });

    // Sort Dropdown Change Event
    $('#sort-select').on('change', function () {
        currentSort = $(this).val();
        renderTasks();
    });

    // AJAX Sync button
    $('#ajax-sync-btn').on('click', function () {
        fetchRemoteTasks(true);
    });

    // Quote Refresh button
    $('#btn-refresh-quote').on('click', function () {
        fetchLiveQuote();
    });

    // Book Search button
    $('#btn-search-books').on('click', function () {
        const query = $('#book-search-input').val().trim();
        if (query) {
            searchBooksAjax(query);
        } else {
            showToast('Please type a search query (e.g. JavaScript, Python)', 'warning');
        }
    });

    $('#book-search-input').on('keypress', function (e) {
        if (e.which === 13) {
            $('#btn-search-books').click();
        }
    });

    // Storage Actions: Clear Storage
    $('#btn-clear-storage').on('click', function () {
        if (confirm('Clear all tasks from localStorage?')) {
            tasks = [];
            saveTasksToStorage();
            renderTasks();
            showToast('LocalStorage cleared.', 'warning');
        }
    });

    // Storage Actions: Export JSON
    $('#btn-export-data').on('click', function () {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `greendesk_tasks_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Exported tasks as JSON file!', 'success');
    });

    // ----------------------------------------------------
    // 6. Application Initialization
    // ----------------------------------------------------
    fetchRemoteTasks(false);
    fetchLiveQuote();
});
