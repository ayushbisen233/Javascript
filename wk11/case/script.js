/**
 * script.js - Smart India Hackathon Portal Interactivity
 * Provides:
 * 1. Live Countdown ticker to SIH Grand Finale
 * 2. Active navigation link highlighter
 * 3. Interactive problem theme filter
 * 4. Registration modal / toast alert
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Live Countdown to Grand Finale
    initCountdown();

    // 2. Active Nav Link Highlighting
    highlightActiveNav();

    // 3. Register button click handler
    setupRegisterButton();
});

/**
 * Real-time countdown to SIH Grand Finale
 */
function initCountdown() {
    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-mins');
    const secsEl = document.getElementById('count-secs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    // Set target date 45 days in the future
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 45);
    targetDate.setHours(9, 0, 0, 0);

    function update() {
        const now = new Date().getTime();
        const diff = targetDate.getTime() - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minsEl.textContent = '00';
            secsEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minsEl.textContent = mins.toString().padStart(2, '0');
        secsEl.textContent = secs.toString().padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

/**
 * Highlight active page in navigation bar
 */
function highlightActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath.endsWith(href) || (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('case/')))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Handle quick registration trigger
 */
function setupRegisterButton() {
    const btn = document.getElementById('btn-register-action');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('🎉 Thank you for your interest in Smart India Hackathon!\n\nOnline team nominations are open for college SPOCs and registered innovators.');
        });
    }
}
