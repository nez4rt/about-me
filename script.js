document.addEventListener('DOMContentLoaded', () => {

    // ── Loading Screen ───────────────────────────────────────
    const loadingScreen = document.getElementById('loading-screen');
    const loaderText = document.querySelector('.loader-text');
    const messages = ['Initializing...', 'Loading assets...', 'Almost ready...'];
    let msgIndex = 0;

    // Cycle through loader messages
    const msgInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        if (loaderText) loaderText.textContent = messages[msgIndex];
    }, 600);

    // Hide loader after bar animation finishes (1.8s) + small buffer
    setTimeout(() => {
        clearInterval(msgInterval);
        if (loadingScreen) loadingScreen.classList.add('hidden');
    }, 2200);

    // ── Scroll Reveal (OS cards + skills dashboard) ──────────
    const revealCards = document.querySelectorAll('.os-card, .game-card');
    const skillsDashboard = document.querySelector('.skills-dashboard-wrapper');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealCards.forEach(card => revealObserver.observe(card));
    if (skillsDashboard) revealObserver.observe(skillsDashboard);



    // Expandable system specs toggle
    const expandToggles = document.querySelectorAll('.os-expand-toggle');

    expandToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const card = e.currentTarget.closest('.os-card');
            const isExpanded = card.classList.contains('expanded');
            
            card.classList.toggle('expanded');
            
            const label = toggle.querySelector('span');
            if (label) {
                label.textContent = isExpanded ? 'View System Specifications' : 'Hide System Specifications';
            }
        });
    });

    // ── Skills Dashboard Terminal Interaction ────────────────
    const SKILLS_DATA = {
        linux: {
            title: 'Linux',
            command: 'neofetch --distro "Arch Linux"',
            systemStatus: 'Loading skill profile: Linux... OK',
            progress: 90,
            description: 'Penggunaan sistem operasi Linux sebagai sistem utama sehari-hari. Terbiasa mengelola repositori, konfigurasi dotfiles, optimasi kinerja, serta manajemen sistem modular.',
            tags: ['Arch Linux', 'Ubuntu', 'ZSH', 'System Admin'],
            consoleOutput: [
                '<span class="console-line text-cyan">OS: Arch Linux x86_64</span>',
                '<span class="console-line text-cyan">Shell: zsh 5.9</span>',
                '<span class="console-line text-cyan">WM: Hyprland (Wayland)</span>',
                '<span class="console-line text-green">[OK] All configurations loaded. Enjoy scripting!</span>'
            ]
        },
        'web-basic': {
            title: 'Web Basic',
            command: 'cat web-basic.html',
            systemStatus: 'Loading skill profile: Web Basic... OK',
            progress: 85,
            description: 'Membangun website yang cepat, responsif, dan interaktif menggunakan standar web modern. Berpengalaman dalam memanipulasi DOM dan styling kustom tanpa library tambahan.',
            tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
            consoleOutput: [
                '<span class="console-line text-purple">&lt;div class="heart"&gt;❤️&lt;/div&gt; loaded successfully.</span>',
                '<span class="console-line text-cyan">DOM Tree: parsed in 0.04ms</span>',
                '<span class="console-line text-green">[OK] Frontend assets compiled & running in hot-reload mode.</span>'
            ]
        },
        python: {
            title: 'Python',
            command: 'python automate.py',
            systemStatus: 'Loading skill profile: Python... OK',
            progress: 75,
            description: 'Mengotomatiskan tugas berulang, web scraping, dan memproses data menggunakan pustaka Python. Suka menulis skrip yang efisien dan bersih.',
            tags: ['Scripting', 'Automation', 'APIs', 'Web Scraping'],
            consoleOutput: [
                '<span class="console-line text-yellow">&gt;&gt;&gt; import os, sys</span>',
                '<span class="console-line text-yellow">&gt;&gt;&gt; run_automation()</span>',
                '<span class="console-line text-green">[OK] Automation completed: 154 files organized in 0.42s.</span>'
            ]
        },
        github: {
            title: 'GitHub',
            command: 'git push origin main',
            systemStatus: 'Loading skill profile: GitHub... OK',
            progress: 80,
            description: 'Mengelola versi kode, berkolaborasi dengan pengembang lain, dan memelihara repositori open-source dengan git workflow yang rapi.',
            tags: ['Git', 'Collaboration', 'CI/CD', 'Open Source'],
            consoleOutput: [
                '<span class="console-line text-purple">Enumerating objects: 5, done.</span>',
                '<span class="console-line text-cyan">To github.com:nez4rt/about-me.git</span>',
                '<span class="console-line text-cyan">   a3f4b6c..9f7e8d2  main -> main</span>',
                '<span class="console-line text-green">[OK] Push successful. CI/CD Pipeline passed.</span>'
            ]
        },
        cli: {
            title: 'CLI & Shell',
            command: 'bash deploy.sh',
            systemStatus: 'Loading skill profile: CLI... OK',
            progress: 85,
            description: 'Sangat nyaman bekerja di terminal. Mampu menulis skrip shell yang kompleks untuk mengotomatiskan alur kerja sistem dan pemeliharaan server.',
            tags: ['Bash', 'ZSH', 'Fish', 'Shell Scripting'],
            consoleOutput: [
                '<span class="console-line text-yellow">[DEPLOY] Starting deployment script v1.0.4</span>',
                '<span class="console-line text-cyan">[SYSTEM] Copying builds to public_html... done</span>',
                '<span class="console-line text-green">[OK] deployment successful to production_server.</span>'
            ]
        },
        vscode: {
            title: 'VSCode',
            command: 'code --list-extensions',
            systemStatus: 'Loading skill profile: VSCode... OK',
            progress: 80,
            description: 'Mengoptimalkan lingkungan kerja dengan ekstensi produktivitas, snippet kustom, dan integrasi terminal untuk alur pengembangan super cepat.',
            tags: ['Extensions', 'Customization', 'Shortcuts', 'Efficiency'],
            consoleOutput: [
                '<span class="console-line text-cyan">Extensions Active: Prettier, ESLint, GitLens, Live Server</span>',
                '<span class="console-line text-cyan">Vim Keybindings: Enabled</span>',
                '<span class="console-line text-green">[OK] Development environment fully operational. Ready to code!</span>'
            ]
        }
    };

    const skillBtns = document.querySelectorAll('.skill-btn');
    const terminalCommand = document.getElementById('terminal-command');
    const systemOutput = document.getElementById('system-output');
    const skillTitle = document.getElementById('skill-title');
    const skillDescription = document.getElementById('skill-description');
    const skillTags = document.getElementById('skill-tags');
    const consoleOutput = document.getElementById('terminal-console-output');
    const outputContainer = document.getElementById('terminal-output-container');

    let typingInterval = null;
    let transitionTimeout = null;

    function switchSkill(skillKey) {
        // Clear any ongoing animations
        clearInterval(typingInterval);
        clearTimeout(transitionTimeout);

        const data = SKILLS_DATA[skillKey];
        if (!data) return;

        // Reset output container visibility
        if (outputContainer) outputContainer.classList.add('faded-out');

        // Start command line typing simulation
        if (terminalCommand) {
            terminalCommand.textContent = '';
            let charIndex = 0;
            const fullCommand = data.command;
            
            typingInterval = setInterval(() => {
                if (charIndex < fullCommand.length) {
                    terminalCommand.textContent += fullCommand.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    
                    // Show terminal content with delay for realism
                    transitionTimeout = setTimeout(() => {
                        if (outputContainer) outputContainer.classList.remove('faded-out');
                        
                        // Update contents
                        if (systemOutput) systemOutput.textContent = data.systemStatus;
                        if (skillTitle) skillTitle.textContent = data.title;
                        if (skillDescription) skillDescription.textContent = data.description;
                        
                        // Rebuild tags
                        if (skillTags) {
                            skillTags.innerHTML = '';
                            data.tags.forEach(tag => {
                                const span = document.createElement('span');
                                span.textContent = tag;
                                skillTags.appendChild(span);
                            });
                        }
                        
                        // Rebuild console output
                        if (consoleOutput) {
                            consoleOutput.innerHTML = '';
                            data.consoleOutput.forEach(line => {
                                consoleOutput.innerHTML += line;
                            });
                        }
                    }, 250);
                }
            }, 30); // 30ms per character typing speed
        }
    }

    // Attach click listeners to buttons
    skillBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const clickedBtn = e.currentTarget;
            if (clickedBtn.classList.contains('active')) return;

            // Update button active states
            skillBtns.forEach(b => b.classList.remove('active'));
            clickedBtn.classList.add('active');

            const skillKey = clickedBtn.getAttribute('data-skill');
            switchSkill(skillKey);
        });
    });

    // Initialize with default skill (Linux)
    if (skillsDashboard) {
        // Animate the initial default progress bar once section is visible
        const initialObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger the switch to default skill (which is already active in HTML)
                    // but we do it programmatically to fire the neat typing and loading animations!
                    switchSkill('linux');
                    initialObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        initialObserver.observe(skillsDashboard);
    }

    // ── Header shrink on scroll ──────────────────────────────
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ── Mobile Menu Toggle ───────────────────────────────────
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks    = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            icon.classList.toggle('fa-bars',  !navLinks.classList.contains('active'));
            icon.classList.toggle('fa-times',  navLinks.classList.contains('active'));
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    // ── Active nav link on scroll ────────────────────────────
    const sections    = document.querySelectorAll('section, footer');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop    = section.offsetTop - 120;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        navLinksAll.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
});
