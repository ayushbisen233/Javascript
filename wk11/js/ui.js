/**
 * ui.js - ES6 Module for DOM updates, renders, and interface interactions
 * Demonstrates setTimeout for toast auto-dismissal and UI animations
 */

import { formatSeconds } from './timer.js';

let toastTimeoutId = null;

/**
 * Update the header live digital clock
 * @param {Object} timeInfo 
 */
export function renderHeaderClock(timeInfo) {
    const clockEl = document.getElementById('live-clock');
    const dateEl = document.getElementById('live-date');
    const dayBadgeEl = document.getElementById('day-badge');

    if (clockEl) clockEl.textContent = timeInfo.time12;
    if (dateEl) dateEl.textContent = timeInfo.dateFormatted;
    if (dayBadgeEl) dayBadgeEl.textContent = timeInfo.dayName;
}

/**
 * Display toast notification using setTimeout() for auto-removal
 * @param {string} message 
 * @param {string} type 'success' | 'warning' | 'info' | 'error'
 * @param {number} durationMs default 3500ms
 */
export function showToast(message, type = 'info', durationMs = 3500) {
    const toastEl = document.getElementById('toast-notification');
    if (!toastEl) return;

    if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
    }

    toastEl.className = `toast toast-${type} show`;
    toastEl.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <span class="toast-text">${message}</span>
    `;

    // setTimeout() to hide the toast cleanly after duration
    toastTimeoutId = setTimeout(() => {
        toastEl.classList.remove('show');
    }, durationMs);
}

/**
 * Render Current Active Class card or empty state
 * @param {Object|null} activeClass 
 * @param {number} remainingSeconds 
 * @param {number} progressPercent 
 */
export function renderCurrentClass(activeClass, remainingSeconds, progressPercent) {
    const container = document.getElementById('current-class-card');
    if (!container) return;

    if (!activeClass) {
        container.innerHTML = `
            <div class="card-status-empty">
                <div class="empty-icon">☕</div>
                <h3>No Class Currently in Session</h3>
                <p>Check the live countdown below for your next upcoming lecture.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="active-class-header">
            <span class="pulse-badge"><span class="pulse-dot"></span> LIVE IN SESSION</span>
            <span class="class-room-badge">${activeClass.room}</span>
        </div>
        <h2 class="active-class-title">${activeClass.name}</h2>
        <div class="active-class-meta">
            <span><strong>Course:</strong> ${activeClass.code}</span>
            <span><strong>Instructor:</strong> ${activeClass.instructor}</span>
            <span><strong>Time:</strong> ${activeClass.startTime} - ${activeClass.endTime}</span>
        </div>
        <div class="progress-section">
            <div class="progress-info">
                <span>Progress: ${progressPercent}%</span>
                <span>Time Remaining: <strong>${formatSeconds(remainingSeconds)}</strong></span>
            </div>
            <div class="progress-bar-track">
                <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
            </div>
        </div>
    `;
}

/**
 * Render the Next Class Countdown Card with dynamic numbers
 * @param {Object|null} nextClass 
 * @param {Object} countdownData 
 * @param {Date|null} targetDate 
 */
export function renderCountdown(nextClass, countdownData, targetDate) {
    const container = document.getElementById('countdown-display');
    const targetLabel = document.getElementById('countdown-target-label');
    
    if (!container || !targetLabel) return;

    if (!nextClass || countdownData.isCompleted) {
        targetLabel.textContent = 'No upcoming classes scheduled.';
        container.innerHTML = `
            <div class="timer-unit"><div class="unit-box">00</div><label>Days</label></div>
            <div class="timer-unit"><div class="unit-box">00</div><label>Hours</label></div>
            <div class="timer-unit"><div class="unit-box">00</div><label>Mins</label></div>
            <div class="timer-unit"><div class="unit-box">00</div><label>Secs</label></div>
        `;
        return;
    }

    const dayName = nextClass.day;
    const formattedTarget = targetDate ? targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '';
    targetLabel.innerHTML = `Upcoming: <strong>${nextClass.name}</strong> (${nextClass.code}) on <strong>${dayName}, ${formattedTarget} at ${nextClass.startTime}</strong> [${nextClass.room}]`;

    const d = countdownData.days.toString().padStart(2, '0');
    const h = countdownData.hours.toString().padStart(2, '0');
    const m = countdownData.minutes.toString().padStart(2, '0');
    const s = countdownData.seconds.toString().padStart(2, '0');

    container.innerHTML = `
        <div class="timer-unit">
            <div class="unit-box">${d}</div>
            <label>Days</label>
        </div>
        <div class="timer-sep">:</div>
        <div class="timer-unit">
            <div class="unit-box">${h}</div>
            <label>Hours</label>
        </div>
        <div class="timer-sep">:</div>
        <div class="timer-unit">
            <div class="unit-box">${m}</div>
            <label>Mins</label>
        </div>
        <div class="timer-sep">:</div>
        <div class="timer-unit">
            <div class="unit-box highlight">${s}</div>
            <label>Secs</label>
        </div>
    `;
}

/**
 * Render the schedule grid/cards
 * @param {Array} schedule 
 * @param {string} filterDay 'All' or specific day
 * @param {string|null} activeClassId 
 * @param {Function} onDeleteCallback 
 */
export function renderScheduleList(schedule, filterDay = 'All', activeClassId = null, onDeleteCallback) {
    const listContainer = document.getElementById('schedule-list');
    if (!listContainer) return;

    let filtered = schedule;
    if (filterDay !== 'All') {
        filtered = schedule.filter(item => item.day.toLowerCase() === filterDay.toLowerCase());
    }

    // Sort by day sequence and start time
    const dayOrder = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7 };
    filtered.sort((a, b) => {
        const dDiff = (dayOrder[a.day] || 8) - (dayOrder[b.day] || 8);
        if (dDiff !== 0) return dDiff;
        return a.startTime.localeCompare(b.startTime);
    });

    if (filtered.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-schedule-msg">
                <p>No classes scheduled for <strong>${filterDay}</strong>.</p>
                <small>Click "+ Add Class" to insert a new lecture.</small>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = '';

    filtered.forEach(item => {
        const isActive = activeClassId === item.id;
        const card = document.createElement('div');
        card.className = `schedule-item-card ${isActive ? 'is-active-card' : ''}`;
        
        card.innerHTML = `
            <div class="schedule-item-left">
                <div class="schedule-day-badge">${item.day.slice(0, 3).toUpperCase()}</div>
                <div class="schedule-time-block">
                    <span class="start-time">${item.startTime}</span>
                    <span class="time-sep">-</span>
                    <span class="end-time">${item.endTime}</span>
                </div>
            </div>
            <div class="schedule-item-main">
                <div class="card-top-row">
                    <span class="class-code-tag">${item.code}</span>
                    ${isActive ? '<span class="chip-in-session">IN SESSION NOW</span>' : ''}
                </div>
                <h4 class="class-card-name">${item.name}</h4>
                <div class="class-card-details">
                    <span>👨‍🏫 ${item.instructor}</span>
                    <span>📍 ${item.room}</span>
                </div>
            </div>
            <div class="schedule-item-actions">
                <button class="btn-delete" title="Delete class" data-id="${item.id}">
                    🗑️
                </button>
            </div>
        `;

        const delBtn = card.querySelector('.btn-delete');
        if (delBtn) {
            delBtn.addEventListener('click', () => {
                if (confirm(`Remove "${item.name}" from schedule?`)) {
                    onDeleteCallback(item.id);
                }
            });
        }

        listContainer.appendChild(card);
    });
}
