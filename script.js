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

    // ── Scroll Reveal (timeline + skill cards) ───────────────
    const timelineItems = document.querySelectorAll('.timeline-item');
    const skillCards    = document.querySelectorAll('.skill-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    timelineItems.forEach(item => revealObserver.observe(item));

    // Staggered reveal for skill cards
    skillCards.forEach((card, i) => {
        card.style.setProperty('--delay', `${i * 0.1}s`);
        revealObserver.observe(card);
    });

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
