/**
 * storage.js - ES6 Module for Schedule Data Persistence
 * Handles LocalStorage saving, retrieving, and default schedule setup.
 */

const STORAGE_KEY = 'wk11_class_scheduler_data';

export const DEFAULT_SCHEDULE = [
    {
        id: 'cls-1',
        name: 'Web Development & ES6',
        code: 'CS-301',
        instructor: 'Dr. Alan Vance',
        room: 'Lab 402',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        color: '#2d6a4f'
    },
    {
        id: 'cls-2',
        name: 'Data Structures & Algorithms',
        code: 'CS-305',
        instructor: 'Prof. Sarah Jenkins',
        room: 'Hall B',
        day: 'Monday',
        startTime: '11:00',
        endTime: '12:30',
        color: '#1b4332'
    },
    {
        id: 'cls-3',
        name: 'Database Management Systems',
        code: 'CS-308',
        instructor: 'Dr. Michael Chen',
        room: 'Room 205',
        day: 'Tuesday',
        startTime: '10:00',
        endTime: '11:30',
        color: '#40916c'
    },
    {
        id: 'cls-4',
        name: 'Computer Networks',
        code: 'CS-312',
        instructor: 'Prof. Elena Rostova',
        room: 'Lab 101',
        day: 'Wednesday',
        startTime: '13:00',
        endTime: '14:30',
        color: '#2d6a4f'
    },
    {
        id: 'cls-5',
        name: 'UI/UX Interface Design',
        code: 'CS-318',
        instructor: 'Prof. David Miller',
        room: 'Design Studio',
        day: 'Thursday',
        startTime: '14:00',
        endTime: '15:30',
        color: '#52b788'
    },
    {
        id: 'cls-6',
        name: 'Cloud Computing & DevOps',
        code: 'CS-320',
        instructor: 'Dr. Emily Watson',
        room: 'Seminar Hall',
        day: 'Friday',
        startTime: '15:00',
        endTime: '16:30',
        color: '#1b4332'
    }
];

/**
 * Load classes from localStorage or fallback to default
 * @returns {Array} List of class objects
 */
export function getSchedule() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (err) {
        console.warn('Could not read from localStorage, using default schedule:', err);
    }
    // Default fallback
    saveSchedule(DEFAULT_SCHEDULE);
    return [...DEFAULT_SCHEDULE];
}

/**
 * Save classes to localStorage
 * @param {Array} schedule
 */
export function saveSchedule(schedule) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    } catch (err) {
        console.error('Error saving to localStorage:', err);
    }
}

/**
 * Add a new class to schedule
 * @param {Object} classItem 
 * @returns {Array} Updated schedule
 */
export function addClass(classItem) {
    const current = getSchedule();
    const newItem = {
        id: 'cls-' + Date.now(),
        ...classItem
    };
    current.push(newItem);
    saveSchedule(current);
    return current;
}

/**
 * Delete a class by ID
 * @param {string} id 
 * @returns {Array} Updated schedule
 */
export function removeClass(id) {
    const current = getSchedule().filter(c => c.id !== id);
    saveSchedule(current);
    return current;
}

/**
 * Reset schedule to initial demo values
 * @returns {Array} Default schedule
 */
export function resetSchedule() {
    saveSchedule(DEFAULT_SCHEDULE);
    return [...DEFAULT_SCHEDULE];
}
