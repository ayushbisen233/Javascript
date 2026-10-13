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
    // 1. Mobile Navigation Toggle
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

    /**
     * Simultaneously renders all projects in a clean, elegant grid
     */
    function renderAllProjects() {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = '';

        allProjects.forEach((project, index) => {
            const card = document.createElement('article');
            card.className = 'project-card';
            card.style.animationDelay = `${index * 0.08}s`;

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

            projectsGrid.appendChild(card);
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
            renderAllProjects();
        }
    }

    // =========================================================================
    // 3. Official Resume Dossier Modal
    // =========================================================================
    const resumeModal = document.getElementById('resume-modal');
    const openResumeButtons = document.querySelectorAll('.open-resume-btn');
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

    openResumeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openResume();
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
    // 4. Active Navigation State on Scroll
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

    // Initialize portfolio data
    loadPortfolioData();
});
