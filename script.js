/* ==========================================================================
   Modern Personal Digital Identity Script — Nazwar
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNoiseCanvas();
  initScrollReveal();
  initNavHighlighting();
  initLiveClock();
  initInteractiveCLI();
  initMobileMenu();
  initMouseGlow();
});

/* --------------------------------------------------------------------------
   1. Subtle Procedural Noise Canvas
   -------------------------------------------------------------------------- */
function initNoiseCanvas() {
  const canvas = document.getElementById('noise-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generateNoise();
  });

  function generateNoise() {
    const imgData = ctx.createImageData(width, height);
    const buffer = new Uint32Array(imgData.data.buffer);
    const len = buffer.length;

    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.15) {
        const val = Math.floor(Math.random() * 255);
        buffer[i] = (255 << 24) | (val << 16) | (val << 8) | val;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  generateNoise();
}

/* --------------------------------------------------------------------------
   2. IntersectionObserver Scroll Reveal
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   3. Active Section Navigation Highlighting
   -------------------------------------------------------------------------- */
function initNavHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Live Clock (Indonesia Local Time Indicator - UTC+7)
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    clockEl.textContent = `UTC+7 • ${timeString} local`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   5. Interactive Terminal CLI Simulation
   -------------------------------------------------------------------------- */
function initInteractiveCLI() {
  const input = document.getElementById('cli-input');
  const output = document.getElementById('cli-output');
  const chips = document.querySelectorAll('.cli-chip');

  if (!input || !output) return;

  const commands = {
    help: `Available commands:
  • <span class="code-keyword">fetch</span>    : Display system info banner
  • <span class="code-keyword">tools</span>    : List core technologies
  • <span class="code-keyword">games</span>    : Show favorite games list
  • <span class="code-keyword">whoami</span>   : Display identity overview
  • <span class="code-keyword">contact</span>  : Display social links
  • <span class="code-keyword">clear</span>    : Clear terminal buffer`,

    fetch: `OS: CachyOS Linux x86_64
Host: Nazwar Desktop
WM: Hyprland (Wayland)
Shell: zsh / fish
Editor: Neovim / VS Code
Status: Active & Exploring Systems`,

    tools: `Core Tooling Ecosystem:
  [Systems]     Linux, System Administration, Display Config, System Config
  [Dev Tools]   GitHub, CLI, Shell, VS Code, Neovim
  [Workflow]    Terminal, Git, Command-line utilities, Config tools`,

    games: `Favorite Games Rotation:
  1. Skyrim Special Edition (Open World RPG & Nord Atmosphere)
  2. Stardew Valley (Cozy Farming & Relaxation)
  3. Roblox (Sandbox & Community Experiences)`,

    whoami: `Nazwar — Electrical engineering student & System explorer interested in Linux, CLI tools, system administration, and gaming.`,

    contact: `GitHub   : https://github.com/nazwar
Telegram : https://t.me/nazwar_sys
Roblox   : https://www.roblox.com/users/nazwar_dev`
  };

  function executeCommand(cmdStr) {
    const cleanCmd = cmdStr.trim().toLowerCase();
    
    // Echo command
    const cmdLine = document.createElement('div');
    cmdLine.className = 'cli-line';
    cmdLine.innerHTML = `<span class="prompt-user">nezart@cachyos:~$</span> ${escapeHTML(cmdStr)}`;
    output.appendChild(cmdLine);

    if (cleanCmd === 'clear') {
      output.innerHTML = '';
      return;
    }

    const resLine = document.createElement('div');
    resLine.className = 'cli-line';

    if (commands[cleanCmd]) {
      resLine.innerHTML = commands[cleanCmd].replace(/\n/g, '<br>');
    } else if (cleanCmd === '') {
      resLine.innerHTML = '';
    } else {
      resLine.innerHTML = `<span style="color:#ef4444;">zsh: command not found: ${escapeHTML(cleanCmd)}</span>. Type <span class="code-keyword">'help'</span> for options.`;
    }

    output.appendChild(resLine);
    output.scrollTop = output.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      executeCommand(val);
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

/* --------------------------------------------------------------------------
   6. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav-links');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  });
}

/* --------------------------------------------------------------------------
   7. Subtle Ambient Glow Mouse Tracker
   -------------------------------------------------------------------------- */
function initMouseGlow() {
  const glow = document.querySelector('.ambient-glow');
  if (!glow || window.innerWidth < 768) return;

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    glow.style.transform = `translate(${x - window.innerWidth / 2}px, ${y - 300}px)`;
  });
}
