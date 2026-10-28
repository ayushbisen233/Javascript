/**
 * timer.js - ES6 Module for JavaScript Timers and Real-Time Calculations
 * Demonstrates:
 * 1. setInterval() for live clock & real-time countdown updates
 * 2. setTimeout() for scheduled alerts, quick focus/break notifications, and auto-dismissals
 */

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let clockIntervalId = null;
let countdownIntervalId = null;
let focusTimeoutId = null;
let focusIntervalId = null;
let alertTimeoutIds = [];

/**
 * Format date into readable strings
 * @param {Date} date 
 */
export function formatTimeStrings(date = new Date()) {
    const dayName = DAYS_OF_WEEK[date.getDay()];
    const hours24 = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    // 12-hour format with AM/PM
    let h12 = date.getHours();
    const ampm = h12 >= 12 ? 'PM' : 'AM';
    h12 = h12 % 12;
    h12 = h12 ? h12 : 12; // 0 should be 12
    const time12 = `${h12}:${minutes}:${seconds} ${ampm}`;
    const time24 = `${hours24}:${minutes}:${seconds}`;

    const dateFormatted = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return { dayName, time12, time24, dateFormatted, hours24, minutes, seconds };
}

/**
 * Parse time string "HH:MM" into minutes from midnight
 * @param {string} timeStr 
 * @returns {number}
 */
export function timeStrToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

/**
 * Convert minutes from midnight into Date object for a given day offset
 * @param {string} timeStr "HH:MM"
 * @param {number} dayOffset 0 for today, 1 for tomorrow, etc.
 * @returns {Date}
 */
export function timeToDate(timeStr, dayOffset = 0) {
    const now = new Date();
    const [h, m] = timeStr.split(':').map(Number);
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, h, m, 0, 0);
    return target;
}

/**
 * Find current active class or next upcoming class from schedule
 * @param {Array} schedule 
 * @returns {Object} { activeClass, nextClass, nextClassDate, progressPercent, remainingSeconds }
 */
export function evaluateScheduleState(schedule) {
    const now = new Date();
    const currentDayName = DAYS_OF_WEEK[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();
    const totalCurrentSeconds = currentMinutes * 60 + currentSeconds;

    let activeClass = null;
    let nextClass = null;
    let nextClassDate = null;
    let progressPercent = 0;
    let remainingActiveSeconds = 0;

    // 1. Check if any class is ACTIVE today right now
    const todayClasses = schedule.filter(c => c.day.toLowerCase() === currentDayName.toLowerCase());

    for (const item of todayClasses) {
        const startSec = timeStrToMinutes(item.startTime) * 60;
        const endSec = timeStrToMinutes(item.endTime) * 60;

        if (totalCurrentSeconds >= startSec && totalCurrentSeconds < endSec) {
            activeClass = item;
            const totalDurationSec = endSec - startSec;
            const elapsedSec = totalCurrentSeconds - startSec;
            progressPercent = Math.min(100, Math.max(0, Math.round((elapsedSec / totalDurationSec) * 100)));
            remainingActiveSeconds = endSec - totalCurrentSeconds;
            break;
        }
    }

    // 2. Find next upcoming class in the next 7 days
    const upcomingCandidates = [];
    const currentDayIndex = now.getDay();

    schedule.forEach(item => {
        const itemDayIndex = DAYS_OF_WEEK.findIndex(d => d.toLowerCase() === item.day.toLowerCase());
        if (itemDayIndex === -1) return;

        let dayDiff = itemDayIndex - currentDayIndex;
        if (dayDiff < 0) {
            dayDiff += 7; // Wraps to next week
        }

        const startMin = timeStrToMinutes(item.startTime);
        
        // If it's today, it must start after now
        if (dayDiff === 0 && startMin <= currentMinutes) {
            dayDiff = 7; // Already started or passed today, next occurrence is in 7 days
        }

        const targetDate = timeToDate(item.startTime, dayDiff);
        upcomingCandidates.push({
            item,
            targetDate,
            diffMs: targetDate.getTime() - now.getTime()
        });
    });

    if (upcomingCandidates.length > 0) {
        upcomingCandidates.sort((a, b) => a.diffMs - b.diffMs);
        nextClass = upcomingCandidates[0].item;
        nextClassDate = upcomingCandidates[0].targetDate;
    }

    return {
        activeClass,
        nextClass,
        nextClassDate,
        progressPercent,
        remainingActiveSeconds
    };
}

/**
 * Calculate countdown breakdown between now and target date
 * @param {Date} targetDate 
 * @returns {Object} { days, hours, minutes, seconds, isCompleted, totalSeconds }
 */
export function calculateCountdown(targetDate) {
    if (!targetDate) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true, totalSeconds: 0 };
    }

    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true, totalSeconds: 0 };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        days,
        hours,
        minutes,
        seconds,
        isCompleted: false,
        totalSeconds
    };
}

/**
 * Start the main real-time ticker using setInterval()
 * Ticks every 1000ms (1 second)
 * @param {Function} tickCallback Called on every second tick
 */
export function startClockInterval(tickCallback) {
    if (clockIntervalId) {
        clearInterval(clockIntervalId);
    }
    // Run immediately first
    tickCallback();
    clockIntervalId = setInterval(() => {
        tickCallback();
    }, 1000);
    return clockIntervalId;
}

/**
 * Stop clock interval
 */
export function stopClockInterval() {
    if (clockIntervalId) {
        clearInterval(clockIntervalId);
        clockIntervalId = null;
    }
}

/**
 * Setup a Focus / Study timer using setTimeout() for completion and setInterval() for remaining countdown
 * @param {number} minutesDuration Duration in minutes
 * @param {Function} onTick Callback with remaining seconds
 * @param {Function} onComplete Callback when setTimeout fires
 */
export function startFocusTimer(minutesDuration, onTick, onComplete) {
    // Clear any previous focus timers
    stopFocusTimer();

    const totalSeconds = minutesDuration * 60;
    let remaining = totalSeconds;

    onTick(remaining, totalSeconds);

    // setInterval() for real-time second updates
    focusIntervalId = setInterval(() => {
        remaining -= 1;
        if (remaining > 0) {
            onTick(remaining, totalSeconds);
        } else {
            clearInterval(focusIntervalId);
            focusIntervalId = null;
        }
    }, 1000);

    // setTimeout() scheduled precisely for timer completion
    focusTimeoutId = setTimeout(() => {
        stopFocusTimer();
        if (typeof onComplete === 'function') {
            onComplete();
        }
    }, totalSeconds * 1000);

    return { focusIntervalId, focusTimeoutId };
}

/**
 * Cancel active focus timer
 */
export function stopFocusTimer() {
    if (focusIntervalId) {
        clearInterval(focusIntervalId);
        focusIntervalId = null;
    }
    if (focusTimeoutId) {
        clearTimeout(focusTimeoutId);
        focusTimeoutId = null;
    }
}

/**
 * Schedule automated class reminders using setTimeout()
 * @param {Array} schedule 
 * @param {Function} notificationCallback 
 */
export function scheduleUpcomingAlerts(schedule, notificationCallback) {
    // Clear old scheduled alert timeouts
    alertTimeoutIds.forEach(id => clearTimeout(id));
    alertTimeoutIds = [];

    const now = new Date();
    const currentDayName = DAYS_OF_WEEK[now.getDay()];

    schedule
        .filter(c => c.day.toLowerCase() === currentDayName.toLowerCase())
        .forEach(item => {
            const classStartTime = timeToDate(item.startTime, 0);
            const msUntilClass = classStartTime.getTime() - now.getTime();

            // 5 minutes warning (or 300000 ms)
            const warningMs = msUntilClass - (5 * 60 * 1000);
            if (warningMs > 0 && warningMs < 24 * 60 * 60 * 1000) {
                const id = setTimeout(() => {
                    notificationCallback(`🔔 Reminder: "${item.name}" starts in 5 minutes! (${item.room})`, 'warning');
                }, warningMs);
                alertTimeoutIds.push(id);
            }

            // Exactly at class start time
            if (msUntilClass > 0 && msUntilClass < 24 * 60 * 60 * 1000) {
                const id = setTimeout(() => {
                    notificationCallback(`🟢 Class Started: "${item.name}" is now in session!`, 'success');
                }, msUntilClass);
                alertTimeoutIds.push(id);
            }
        });
}

/**
 * Format seconds into mm:ss or hh:mm:ss
 * @param {number} sec 
 */
export function formatSeconds(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    if (h > 0) {
        return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
    }
    return `${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
}
