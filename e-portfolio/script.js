/**
 * Ayush Sunil Bisen — E-Portfolio Core Script
 * Clean, Simple & Elegant Portfolio
 * - Asynchronously loads and simultaneously displays all projects (wk10 Fetch API with embedded fallback)
 * - Interactive Official Resume Dossier Viewer
 * - Responsive Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================================================
    // 1. Theme Management (Dark [Emerald + Graphite] primary & Light [Mint Slate])
    // =========================================================================
    const themeButtons = {
        'dark': document.getElementById('btn-dark'),
        'light': document.getElementById('btn-light')
    };

    /**
     * Applies the selected theme and persists it to localStorage
     * @param {string} themeName - 'dark' | 'light'
     */
    function applyTheme(themeName) {
        const validTheme = (themeName === 'light') ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', validTheme);
        
        try {
            localStorage.setItem('preferredTheme', validTheme);
        } catch (e) {
            console.warn('localStorage not accessible for theme persistence');
        }

        // Update active state on toggle buttons
        Object.entries(themeButtons).forEach(([key, btn]) => {
            if (btn) {
                const isActive = (key === validTheme);
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive.toString());
            }
        });
    }

    // Initialize saved theme or default to Dark mode (primary experience)
    const savedTheme = (function () {
        try {
            const stored = localStorage.getItem('preferredTheme');
            if (stored && ['dark', 'light'].includes(stored)) return stored;
            return 'dark';
        } catch (e) {
            return 'dark';
        }
    })();
    applyTheme(savedTheme);

    // Bind theme switcher event listeners
    Object.entries(themeButtons).forEach(([key, btn]) => {
        if (btn) {
            btn.addEventListener('click', () => {
                applyTheme(key);
            });
        }
    });

    // =========================================================================
    // 2. Mobile Navigation Toggle
    // =========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen.toString());
        });

        // Close mobile nav when clicking any nav link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // =========================================================================
    // 2. Portfolio Projects Dataset & Asynchronous Loader (wk10)
    // =========================================================================
    // Fallback array ensures zero failure if opened directly via file:// protocol
    const fallbackProjects = [
        {
            id: "mateq",
            title: "MateQ — Full-Stack Web3 Competitive Coding Platform",
            subtitle: "Live competitive coding platform with verifiable on-chain credentials",
            period: "2025 – Present",
            categoryLabel: "Web3 & Cloud",
            badge: "Team Project (3 Members)",
            role: "Lead Backend Architect & Smart Contract Designer",
            github: "https://github.com/SmokerTobi/MateQ",
            tags: ["Next.js 14", "Node.js", "Express", "TypeScript", "Solidity", "Polygon", "Web3"],
            description: "Full-stack competitive coding platform where developers compete in synchronized live coding matches to earn recruiter-verifiable skill credentials.",
            highlights: [
                "Built full-stack architecture using Next.js 14, Node.js/Express, and TypeScript.",
                "Designed and deployed Solidity smart contracts on Polygon to mint non-transferable, ELO-style skill tokens as an on-chain, recruiter-verifiable alternative to self-reported skill claims.",
                "Engineered wallet-free demo mode with simulated bot opponents, enabling instant end-to-end product onboarding without requiring crypto setup."
            ],
            metrics: "Polygon Mainnet Contracts • Simulated Bot Matchmaking • ELO Credential Minting"
        },
        {
            id: "mira6g",
            title: "MIRA6G — RIS-Assisted mmWave 6G Simulation Framework",
            subtitle: "Modular Python framework for RIS-assisted 6G/mmWave networks",
            period: "2025",
            categoryLabel: "AI/ML & Patents",
            badge: "Patent Filed",
            patentNumber: "App. No. 202621048318 A (Indian Patent Office)",
            github: "https://github.com/ayushbisen233",
            tags: ["Python", "TensorFlow", "6G/mmWave", "RIS", "Digital Twin", "Simulation"],
            description: "Modular Python framework simulating Reconfigurable Intelligent Surface (RIS) assisted 6G/mmWave wireless networks across 4 system configurations.",
            highlights: [
                "Incorporated AI-driven latency prediction, digital-twin environment modelling, and an automated pipeline generating 14 IEEE-style SVG evaluation plots.",
                "Benchmarked AI + digital-twin against no-DT/no-AI baseline: achieved +23% throughput, -11% latency, and +12% fairness improvement in dense wireless environments.",
                "Extended with learning-based consistency constraints for adaptive RIS configuration and cross-layer (PHY/MAC/network) coordination across multi-RIS THz scenarios."
            ],
            metrics: "+23% Throughput • -11% Latency • +12% Fairness • 14 IEEE Plots"
        },
        {
            id: "temple-security",
            title: "Digital Twin for Temple Security & Management",
            subtitle: "Real-time automated computer-vision security and crowd telemetry",
            period: "2024",
            categoryLabel: "AI/ML & Patents",
            badge: "Patent Filed",
            patentNumber: "App. No. 202521124784 A (Indian Patent Office)",
            github: "https://github.com/ayushbisen233",
            tags: ["Computer Vision", "Python", "Deep Learning", "Real-Time Telemetry", "Surveillance"],
            description: "Real-time edge computer-vision pipeline tailored for large-scale sacred sites and crowded venues to monitor safety and security autonomously.",
            highlights: [
                "Built real-time computer-vision pipeline for crowd density estimation, violence detection, and abandoned-object identification from live multi-camera feeds.",
                "Implemented automated instant alerting to notify security personnel of detected hazards or anomalies, significantly cutting manual feed-monitoring burden."
            ],
            metrics: "Live Video Analytics • Instant Threat Dispatch • Multi-Class Incident Detection"
        },
        {
            id: "doctranx",
            title: "DocTranx — AI-Powered Document Transformation Platform",
            subtitle: "Event-driven microservices platform for structured UDOM conversion",
            period: "Jul 2026",
            categoryLabel: "Backend Systems",
            badge: "AEIV Global Internship",
            role: "Backend Engineering Intern",
            github: "https://github.com/ayushbisen233",
            tags: ["Apache Kafka", "PostgreSQL", "Redis", "AWS S3", "Docker", "Kubernetes", "Microservices"],
            description: "Enterprise event-driven microservices pipeline that parses, OCR-processes, and converts high-volume documents into structured Universal DOM.",
            highlights: [
                "Architected distributed event-driven microservices pipeline with Apache Kafka, PostgreSQL, Redis, and AWS S3 running in Docker & Kubernetes.",
                "Engineered parsing and OCR pipeline converting raw documents into structured Universal DOM (JSON/XML) allowing arbitrary in-browser edits and seamless re-export to PDF, DOCX, and PPTX."
            ],
            metrics: "High-Throughput UDOM Pipeline • Multi-Format Export • Kafka Event Stream"
        }
    ];

    let allProjects = [];
    const projectsGrid = document.getElementById('projects-grid');
    let currentProjectFilter = 'all';

    // Global Scroll Observer for entrance animations (comes up from side)
    let scrollObserver = null;

    /**
     * Initializes IntersectionObserver for scroll-reveal animations across all sections
     */
    function initScrollReveal() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('in-view'));
            return;
        }

        if (scrollObserver) {
            scrollObserver.disconnect();
        }

        scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            scrollObserver.observe(el);
        });
    }

    /**
     * Simultaneously renders projects in a dynamic grid with side-reveal animation,
     * interactive 3D cursor tilt, and luminous spotlight follower
     */
    function renderAllProjects(filterCategory = 'all') {
        if (!projectsGrid) return;
        currentProjectFilter = filterCategory;
        projectsGrid.innerHTML = '';

        const filtered = (filterCategory === 'all')
            ? allProjects
            : allProjects.filter(p => p.categoryLabel.toLowerCase() === filterCategory.toLowerCase());

        filtered.forEach((project, index) => {
            const card = document.createElement('article');
            // Alternating side-reveal: even cards come up from left, odd cards come up from right!
            const sideClass = (index % 2 === 0) ? 'reveal-from-left' : 'reveal-from-right';
            card.className = `project-card reveal-on-scroll ${sideClass}`;
            card.style.transitionDelay = `${(index % 2) * 0.12}s`;

            const tagsHtml = project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('');

            card.innerHTML = `
                <div class="project-card-header">
                    <span class="project-cat-pill">${project.categoryLabel}</span>
                    <span class="project-badge-pill">${project.badge || project.period}</span>
                </div>

                <h3 class="project-title">${project.title}</h3>
                <div class="project-subtitle">${project.subtitle}</div>
                <p class="project-description">${project.description}</p>

                <div class="project-metrics-banner">${project.metrics}</div>

                <div class="project-tags-row">
                    ${tagsHtml}
                </div>

                ${project.github ? `
                    <div class="project-card-actions">
                        <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" title="View repository">
                            <svg viewBox="0 0 24 24" class="icon-inline" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                            <span>View Repository</span>
                        </a>
                    </div>
                ` : ''}
            `;

            // Dynamic 3D Cursor Tilt & Luminous Spotlight Follower
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Update luminous spotlight CSS custom properties
                card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
                card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);

                // Subtle 3D tilt (max ~4.5 degrees)
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotX = ((centerY - y) / centerY) * 4.5;
                const rotY = ((x - centerX) / centerX) * 4.5;

                card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });

            projectsGrid.appendChild(card);

            // Register card with scroll observer
            if (scrollObserver) {
                scrollObserver.observe(card);
            } else {
                card.classList.add('in-view');
            }
        });
    }

    /**
     * Initializes project category filter tabs with dynamic count updates
     */
    function initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-tab-btn');
        if (!filterButtons.length) return;

        // Calculate and update category counts
        const counts = {
            'all': allProjects.length,
            'AI/ML & Patents': allProjects.filter(p => p.categoryLabel.toLowerCase() === 'ai/ml & patents').length,
            'Web3 & Cloud': allProjects.filter(p => p.categoryLabel.toLowerCase() === 'web3 & cloud').length,
            'Backend Systems': allProjects.filter(p => p.categoryLabel.toLowerCase() === 'backend systems').length
        };

        const countAll = document.getElementById('count-all');
        const countAiml = document.getElementById('count-aiml');
        const countWeb3 = document.getElementById('count-web3');
        const countBackend = document.getElementById('count-backend');

        if (countAll) countAll.textContent = counts['all'];
        if (countAiml) countAiml.textContent = counts['AI/ML & Patents'];
        if (countWeb3) countWeb3.textContent = counts['Web3 & Cloud'];
        if (countBackend) countBackend.textContent = counts['Backend Systems'];

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                const category = btn.getAttribute('data-filter') || 'all';
                renderAllProjects(category);
            });
        });
    }

    /**
     * Asynchronously loads projects JSON with fallback support
     */
    async function loadPortfolioData() {
        try {
            const response = await fetch('projects.json');
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            const data = await response.json();
            allProjects = Array.isArray(data) && data.length > 0 ? data : fallbackProjects;
        } catch (err) {
            console.info('Using fallback project dataset:', err.message);
            allProjects = fallbackProjects;
        } finally {
            initProjectFilters();
            renderAllProjects('all');
            initScrollReveal();
        }
    }

    // =========================================================================
    // 4. Official Resume Dossier Modal & Print Resume
    // =========================================================================
    const resumeModal = document.getElementById('resume-modal');
    const openResumeButtons = document.querySelectorAll('.open-resume-btn');
    const printResumeButtons = document.querySelectorAll('.print-resume-btn');
    const resumeCloseBtn = document.getElementById('resume-modal-close');
    const resumeDismissBtn = document.getElementById('resume-dismiss-btn');

    function openResume() {
        if (!resumeModal) return;
        resumeModal.classList.add('open');
        resumeModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeResume() {
        if (!resumeModal) return;
        resumeModal.classList.remove('open');
        resumeModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function printResume() {
        // Open resume modal so DOM elements are mounted and ready for printing
        openResume();
        setTimeout(() => {
            window.print();
        }, 150);
    }

    openResumeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openResume();
        });
    });

    printResumeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            printResume();
        });
    });

    if (resumeCloseBtn) resumeCloseBtn.addEventListener('click', closeResume);
    if (resumeDismissBtn) resumeDismissBtn.addEventListener('click', closeResume);
    if (resumeModal) {
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) closeResume();
        });
    }

    // Global ESC key listener to close resume modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeResume();
        }
    });

    // =========================================================================
    // 5. Interactive Form Validation (Live Input, Blur, Regex & Submission)
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectSelect = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const charCounter = document.getElementById('char-counter');
    const formAlert = document.getElementById('form-alert');
    const alertText = document.getElementById('alert-text');
    const submitBtn = document.getElementById('submit-btn');

    // Email regex validation pattern
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function validateName() {
        const group = document.getElementById('group-name');
        if (!nameInput) return false;
        const val = nameInput.value.trim();
        const isValid = val.length >= 3;
        setFieldState(group, isValid);
        return isValid;
    }

    function validateEmail() {
        const group = document.getElementById('group-email');
        if (!emailInput) return false;
        const val = emailInput.value.trim();
        const isValid = emailRegex.test(val);
        setFieldState(group, isValid);
        return isValid;
    }

    function validateSubject() {
        const group = document.getElementById('group-subject');
        if (!subjectSelect) return false;
        const isValid = subjectSelect.value !== '';
        setFieldState(group, isValid);
        return isValid;
    }

    function validateMessage() {
        const group = document.getElementById('group-message');
        if (!messageInput) return false;
        const val = messageInput.value.trim();
        const isValid = val.length >= 15;
        setFieldState(group, isValid);
        return isValid;
    }

    function setFieldState(groupElement, isValid) {
        if (!groupElement) return;
        if (isValid) {
            groupElement.classList.add('success');
            groupElement.classList.remove('error');
        } else {
            groupElement.classList.add('error');
            groupElement.classList.remove('success');
        }
    }

    function clearFieldState(groupElement) {
        if (!groupElement) return;
        groupElement.classList.remove('success', 'error');
    }

    // Live validation event listeners (input & blur)
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            if (nameInput.value.length > 0) validateName();
            else clearFieldState(document.getElementById('group-name'));
        });
        nameInput.addEventListener('blur', validateName);
    }

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (emailInput.value.length > 0) validateEmail();
            else clearFieldState(document.getElementById('group-email'));
        });
        emailInput.addEventListener('blur', validateEmail);
    }

    if (subjectSelect) {
        subjectSelect.addEventListener('change', validateSubject);
        subjectSelect.addEventListener('blur', validateSubject);
    }

    if (messageInput) {
        messageInput.addEventListener('input', () => {
            const currentLen = messageInput.value.length;
            if (charCounter) {
                charCounter.textContent = `${currentLen} / 500`;
                charCounter.style.color = currentLen > 450 ? 'var(--status-error)' : 'var(--text-subtle)';
            }
            if (currentLen > 0) validateMessage();
            else clearFieldState(document.getElementById('group-message'));
        });
        messageInput.addEventListener('blur', validateMessage);
    }

    // Form submit listener
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isSubjectValid = validateSubject();
            const isMessageValid = validateMessage();

            if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
                if (formAlert) {
                    formAlert.style.display = 'flex';
                    formAlert.style.backgroundColor = 'var(--status-error-bg)';
                    formAlert.style.color = 'var(--status-error)';
                    alertText.textContent = 'Please review and resolve the flagged input errors above.';
                }
                return;
            }

            // Simulate message transmission
            if (submitBtn) {
                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = `<span>Transmitting...</span>`;

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;

                    if (formAlert) {
                        formAlert.style.display = 'flex';
                        formAlert.style.backgroundColor = 'var(--status-success-bg)';
                        formAlert.style.color = 'var(--status-success)';
                        alertText.textContent = `Thank you, ${nameInput.value.trim()}! Your communication has been dispatched. Ayush will follow up shortly.`;
                    }

                    // Reset form and validation styles
                    contactForm.reset();
                    ['group-name', 'group-email', 'group-subject', 'group-message'].forEach(id => {
                        clearFieldState(document.getElementById(id));
                    });

                    if (charCounter) charCounter.textContent = '0 / 500';

                    // Auto dismiss alert after 6 seconds
                    setTimeout(() => {
                        if (formAlert) formAlert.style.display = 'none';
                    }, 6000);
                }, 750);
            }
        });

        // Form reset listener
        contactForm.addEventListener('reset', () => {
            setTimeout(() => {
                ['group-name', 'group-email', 'group-subject', 'group-message'].forEach(id => {
                    clearFieldState(document.getElementById(id));
                });
                if (charCounter) charCounter.textContent = '0 / 500';
                if (formAlert) formAlert.style.display = 'none';
            }, 50);
        });
    }

    // =========================================================================
    // 6. Active Navigation State on Scroll
    // =========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // =========================================================================
    // 7. Hero Portrait Dynamic 3D Tilt & Specular Lighting Interaction
    // =========================================================================
    const portraitFrame = document.getElementById('portrait-frame');
    const portraitSheen = document.getElementById('portrait-sheen');

    if (portraitFrame && portraitSheen) {
        let isHovering = false;

        portraitFrame.addEventListener('mouseenter', () => {
            isHovering = true;
            portraitFrame.style.transition = 'transform 0.12s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
        });

        portraitFrame.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            const rect = portraitFrame.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Constrain 3D tilt to elegant angle (max ~7.5 degrees)
            const rotateX = ((centerY - y) / centerY) * 7.5;
            const rotateY = ((x - centerX) / centerX) * 7.5;

            portraitFrame.style.transform = `perspective(700px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;

            const pctX = ((x / rect.width) * 100).toFixed(1);
            const pctY = ((y / rect.height) * 100).toFixed(1);
            portraitSheen.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255, 255, 255, 0.28) 0%, rgba(54, 168, 120, 0.14) 35%, transparent 70%)`;
        });

        portraitFrame.addEventListener('mouseleave', () => {
            isHovering = false;
            portraitFrame.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease';
            portraitFrame.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            portraitSheen.style.background = '';
        });

        // Clicking portrait opens official resume / credentials modal
        portraitFrame.addEventListener('click', () => {
            openResume();
        });

        portraitFrame.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openResume();
            }
        });
    }

    // Initialize scroll reveal observer immediately for static sections
    initScrollReveal();

    // Initialize portfolio data and dynamic project cards
    loadPortfolioData();
});
