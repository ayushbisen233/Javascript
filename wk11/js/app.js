/**
 * app.js - Main Application Entrypoint (ES6 Module)
 * Integrates storage.js, timer.js, and ui.js
 */

import { getSchedule, addClass, removeClass, resetSchedule } from './storage.js';
import { 
    formatTimeStrings, 
    evaluateScheduleState, 
    calculateCountdown, 
    startClockInterval, 
    startFocusTimer, 
    stopFocusTimer, 
    scheduleUpcomingAlerts,
    formatSeconds
} from './timer.js';
import { 
    renderHeaderClock, 
    showToast, 
    renderCurrentClass, 
    renderCountdown, 
    renderScheduleList 
} from './ui.js';

let currentSchedule = [];
let currentFilter = 'All';
let currentActiveId = null;
let isFocusRunning = false;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load initial schedule
    currentSchedule = getSchedule();

    // 2. Setup automated reminders via setTimeout()
    setupClassAlerts();

    // 3. Start real-time digital clock and countdown loop via setInterval()
    startClockInterval(onSecondTick);

    // 4. Setup event listeners
    bindEventListeners();

    // 5. Initial render of schedule list
    renderScheduleList(currentSchedule, currentFilter, currentActiveId, handleDeleteClass);

    showToast('Scheduler & Countdown initialized with ES6 modules!', 'success', 2500);
});

/**
 * Called on every second tick of setInterval()
 */
function onSecondTick() {
    const timeInfo = formatTimeStrings();
    renderHeaderClock(timeInfo);

    // Evaluate live class and next class
    const state = evaluateScheduleState(currentSchedule);
    currentActiveId = state.activeClass ? state.activeClass.id : null;

    // Render active class card
    renderCurrentClass(state.activeClass, state.remainingActiveSeconds, state.progressPercent);

    // Calculate and render countdown to next class
    const countdown = calculateCountdown(state.nextClassDate);
    renderCountdown(state.nextClass, countdown, state.nextClassDate);

    // Highlight active card if any changes
    const activeCards = document.querySelectorAll('.schedule-item-card.is-active-card');
    if (!state.activeClass && activeCards.length > 0) {
        renderScheduleList(currentSchedule, currentFilter, null, handleDeleteClass);
    }
}

/**
 * Setup alerts with setTimeout()
 */
function setupClassAlerts() {
    scheduleUpcomingAlerts(currentSchedule, (msg, type) => {
        showToast(msg, type, 6000);
    });
}

/**
 * Handle class deletion
 * @param {string} id 
 */
function handleDeleteClass(id) {
    currentSchedule = removeClass(id);
    setupClassAlerts();
    renderScheduleList(currentSchedule, currentFilter, currentActiveId, handleDeleteClass);
    showToast('Class removed from schedule.', 'info');
}

/**
 * Bind interactive UI buttons, modals, and filters
 */
function bindEventListeners() {
    // Filter buttons (All, Today, Mon, Tue, Wed, Thu, Fri)
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            let selected = e.currentTarget.dataset.day;
            if (selected === 'Today') {
                const nowInfo = formatTimeStrings();
                selected = nowInfo.dayName;
            }
            currentFilter = selected;
            renderScheduleList(currentSchedule, currentFilter, currentActiveId, handleDeleteClass);
        });
    });

    // Add Class Modal toggles
    const addModal = document.getElementById('add-class-modal');
    const openAddBtn = document.getElementById('open-add-btn');
    const closeAddBtn = document.getElementById('close-add-modal');
    const cancelAddBtn = document.getElementById('cancel-add-btn');
    const addForm = document.getElementById('add-class-form');

    if (openAddBtn && addModal) {
        openAddBtn.addEventListener('click', () => {
            addModal.classList.add('show-modal');
        });
    }

    const hideModal = () => {
        if (addModal) addModal.classList.remove('show-modal');
        if (addForm) addForm.reset();
    };

    if (closeAddBtn) closeAddBtn.addEventListener('click', hideModal);
    if (cancelAddBtn) cancelAddBtn.addEventListener('click', hideModal);

    // Form submit
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('class-name').value.trim();
            const code = document.getElementById('class-code').value.trim();
            const instructor = document.getElementById('class-instructor').value.trim();
            const room = document.getElementById('class-room').value.trim();
            const day = document.getElementById('class-day').value;
            const startTime = document.getElementById('class-start-time').value;
            const endTime = document.getElementById('class-end-time').value;

            if (startTime >= endTime) {
                showToast('End time must be after start time!', 'error');
                return;
            }

            const newClass = {
                name,
                code,
                instructor,
                room,
                day,
                startTime,
                endTime
            };

            currentSchedule = addClass(newClass);
            setupClassAlerts();
            renderScheduleList(currentSchedule, currentFilter, currentActiveId, handleDeleteClass);
            hideModal();
            showToast(`Added "${name}" successfully!`, 'success');
        });
    }

    // Reset Demo Schedule Button
    const resetBtn = document.getElementById('btn-reset-demo');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset to default timetable schedule?')) {
                currentSchedule = resetSchedule();
                setupClassAlerts();
                renderScheduleList(currentSchedule, currentFilter, currentActiveId, handleDeleteClass);
                showToast('Schedule reset to default demo data.', 'info');
            }
        });
    }

    // Quick Test Demo Class (Starts Now) - Demonstrates live active class & countdown immediately
    const demoNowBtn = document.getElementById('btn-test-now');
    if (demoNowBtn) {
        demoNowBtn.addEventListener('click', () => {
            const now = new Date();
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const today = dayNames[now.getDay()];
            
            // Format start time as current time - 5 mins, end time as current time + 25 mins
            const startH = now.getHours().toString().padStart(2, '0');
            const startM = now.getMinutes().toString().padStart(2, '0');
            
            const endD = new Date(now.getTime() + 30 * 60000);
            const endH = endD.getHours().toString().padStart(2, '0');
            const endM = endD.getMinutes().toString().padStart(2, '0');

            const testClass = {
                name: 'Live Interactive Session (Testing)',
                code: 'DEMO-101',
                instructor: 'Prof. Timer Specialist',
                room: 'Virtual Room Alpha',
                day: today,
                startTime: `${startH}:${startM}`,
                endTime: `${endH}:${endM}`
            };

            currentSchedule = addClass(testClass);
            setupClassAlerts();
            renderScheduleList(currentSchedule, currentFilter, currentActiveId, handleDeleteClass);
            showToast('Live test class added for right now! Check the active session above.', 'success');
        });
    }

    // Quick Focus / Break Timer Controls (Uses setTimeout & setInterval)
    const startFocusBtn = document.getElementById('btn-start-focus');
    const stopFocusBtn = document.getElementById('btn-stop-focus');
    const focusDurationSelect = document.getElementById('focus-duration');
    const focusDisplayEl = document.getElementById('focus-timer-digits');
    const focusStatusEl = document.getElementById('focus-status-text');

    if (startFocusBtn && focusDurationSelect && focusDisplayEl) {
        startFocusBtn.addEventListener('click', () => {
            const mins = parseInt(focusDurationSelect.value, 10) || 5;
            isFocusRunning = true;
            startFocusBtn.disabled = true;
            stopFocusBtn.disabled = false;
            if (focusStatusEl) focusStatusEl.textContent = `Focusing for ${mins} minutes...`;

            showToast(`Focus timer started for ${mins} min (using setTimeout + setInterval)`, 'info');

            startFocusTimer(
                mins,
                (remainingSec, totalSec) => {
                    const m = Math.floor(remainingSec / 60).toString().padStart(2, '0');
                    const s = (remainingSec % 60).toString().padStart(2, '0');
                    focusDisplayEl.textContent = `${m}:${s}`;
                },
                () => {
                    // setTimeout completion handler!
                    isFocusRunning = false;
                    startFocusBtn.disabled = false;
                    stopFocusBtn.disabled = true;
                    focusDisplayEl.textContent = '00:00';
                    if (focusStatusEl) focusStatusEl.textContent = 'Session complete! Take a break.';
                    showToast('⏰ Focus session complete! setTimeout() fired!', 'success', 7000);
                }
            );
        });
    }

    if (stopFocusBtn) {
        stopFocusBtn.addEventListener('click', () => {
            stopFocusTimer();
            isFocusRunning = false;
            startFocusBtn.disabled = false;
            stopFocusBtn.disabled = true;
            if (focusDisplayEl) focusDisplayEl.textContent = '--:--';
            if (focusStatusEl) focusStatusEl.textContent = 'Timer paused / stopped.';
            showToast('Focus timer stopped.', 'warning');
        });
    }
}
