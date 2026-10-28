/* ==========================================================================
   RYOKU INTERACTIVE CORE SCRIPT — NAZWAR 1.0 AMATERASU
   Hand-crafted for power and beauty. / 力と美のために
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProceduralNoise();
  initHeaderScroll();
  initSpineNavigation();
  initInteractiveDossier();
  initCopyTriggers();
  initLiveClock();
  initInteractiveCLI();
  initMobileDrawer();
});

/* --------------------------------------------------------------------------
   1. Procedural Film Grain / Noise Overlay
   -------------------------------------------------------------------------- */
function initProceduralNoise() {
  const canvas = document.getElementById('noise-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    renderNoise();
  });

  function renderNoise() {
    const imgData = ctx.createImageData(w, h);
    const buffer = new Uint32Array(imgData.data.buffer);
    const len = buffer.length;

    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.12) {
        const val = Math.floor(Math.random() * 255);
        buffer[i] = (255 << 24) | (val << 16) | (val << 8) | val;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  renderNoise();
}

/* --------------------------------------------------------------------------
   2. Header Backdrop Blur on Scroll
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.hdr');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('solid');
    } else {
      header.classList.remove('solid');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. Ryoku Spine Navigation & ScrollSpy
   -------------------------------------------------------------------------- */
function initSpineNavigation() {
  const spineTabs = document.querySelectorAll('.spine-tab');
  const sections = document.querySelectorAll('section[id]');
  const hdrLinks = document.querySelectorAll('.hdr-link');

  if (!sections.length) return;

  // Click on spine tab
  spineTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ScrollSpy with IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        setActiveSection(id);
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  function setActiveSection(id) {
    // Spine update
    spineTabs.forEach(tab => {
      if (tab.getAttribute('data-target') === id) {
        tab.classList.add('active');
        tab.setAttribute('aria-current', 'true');
      } else {
        tab.classList.remove('active');
        tab.removeAttribute('aria-current');
      }
    });

    // Header nav update
    hdrLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. Interactive Dossier Sheet Data & Switcher (Hero Right Panel)
   -------------------------------------------------------------------------- */
function initInteractiveDossier() {
  const dossierData = {
    cachyos: {
      badge: "Edition 01 // Primary Driver",
      title: "CachyOS x86-64-v3",
      summary: "High-performance Arch-based distribution with optimized Linux-cachyos kernel, BORE (Burst-Oriented Response Enhancer) CPU scheduler, and x86-64-v3 compiled packages.",
      command: "fastfetch --config ~/.config/fastfetch/nezart.jsonc",
      specs: [
        { k: "Kernel", v: "Linux 6.11-cachyos-bore" },
        { k: "Compiler", v: "Clang / LTO optimized" },
        { k: "Init & Daemon", v: "systemd v256" },
        { k: "File System", v: "Btrfs with zstd:3 compression" },
        { k: "Status", v: "Main Workstation [ONLINE]" }
      ]
    },
    hyprland: {
      badge: "Edition 02 // Wayland Compositor",
      title: "Hyprland Amaterasu",
      summary: "Dynamic tiling Wayland compositor engineered for fluid animation, zero latency, and keyboard-centric efficiency. Paired with Waybar, Rofi-Wayland, and Dunst.",
      command: "git clone https://github.com/nez4rt/hyprland-config.git ~/.config/hypr",
      specs: [
        { k: "Compositor", v: "Hyprland (wlroots / aquamarine)" },
        { k: "Status Bar", v: "Waybar custom CSS modules" },
        { k: "App Launcher", v: "Rofi-Wayland / Fuzzel" },
        { k: "Terminal Emus", v: "Foot & Kitty (GPU accelerated)" },
        { k: "Animation Curve", v: "Bezier (0.16, 1, 0.3, 1)" }
      ]
    },
    neovim: {
      badge: "Edition 03 // Modal Codecraft",
      title: "Neovim Lua Ide",
      summary: "Tailored modal editing environment built on Neovim with Lazy.nvim package manager, Treesitter AST syntax parsing, and native LSP for Rust, C, Python, and Shell.",
      command: "git clone https://github.com/nez4rt/nvim-config.git ~/.config/nvim",
      specs: [
        { k: "Editor Core", v: "Neovim 0.10+ (Lua 5.1)" },
        { k: "Package Mgr", v: "folke/lazy.nvim" },
        { k: "Language Serv", v: "rust-analyzer, clangd, pyright" },
        { k: "Color Palette", v: "Gruvbox / Amaterasu Void" },
        { k: "Startup Time", v: "18.4ms (72 plugins loaded)" }
      ]
    },
    hardware: {
      badge: "Edition 04 // Hardware Rig",
      title: "Engineering Workstation",
      summary: "Desktop rig tuned for fast compiling, simulation tools (MATLAB / Multisim), system virtualization, and smooth gaming sessions.",
      command: "lshw -short -sanitize | grep -E 'memory|processor|display'",
      specs: [
        { k: "Processor", v: "AMD Ryzen 5 High-Efficiency" },
        { k: "Graphics", v: "Dedicated Vulkan GPU" },
        { k: "Memory", v: "16GB Dual-Channel DDR4" },
        { k: "Storage", v: "NVMe PCIe Gen4 M.2 SSD" },
        { k: "Discipline", v: "Electrical Engineering" }
      ]
    }
  };

  const tabs = document.querySelectorAll('.edition-tab');
  const badgeEl = document.getElementById('sheet-badge');
  const titleEl = document.getElementById('sheet-title');
  const summaryEl = document.getElementById('sheet-summary');
  const specsContainer = document.getElementById('sheet-specs');

  if (!tabs.length || !badgeEl || !titleEl) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const editionKey = tab.getAttribute('data-edition');
      const data = dossierData[editionKey];
      if (!data) return;

      // Active tab styling
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update contents
      badgeEl.textContent = data.badge;
      titleEl.textContent = data.title;
      summaryEl.textContent = data.summary;

      // Update specs
      if (specsContainer) {
        specsContainer.innerHTML = data.specs.map(s => `
          <div class="spec-row">
            <span class="spec-k">${s.k}</span>
            <span class="spec-v">${s.v}</span>
          </div>
        `).join('');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Copy to Clipboard Triggers & Toast Notice
   -------------------------------------------------------------------------- */
function initCopyTriggers() {
  const toast = document.getElementById('toast-notice');
  const toastMsg = document.getElementById('toast-msg');

  function showToast(text) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = text;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Copy buttons with [data-copy]
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = el.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied: "${textToCopy}"`);
      }).catch(() => {
        showToast(`Copied to clipboard`);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Live Local Clock (Indonesia / Jakarta UTC+7)
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    clockEl.textContent = `ID (UTC+7) ${timeStr}`;
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   7. Interactive Wayland CLI Terminal Simulation
   -------------------------------------------------------------------------- */
function initInteractiveCLI() {
  const input = document.getElementById('term-input');
  const output = document.getElementById('term-output');
  const chips = document.querySelectorAll('.term-chip');

  if (!input || !output) return;

  const asciiLogo = `
<span style="color:#e5a93c;">  __  __                               </span>
<span style="color:#e5a93c;"> |  \\|  | ___  ___ __      __ __ _ _ __ </span>
<span style="color:#f2f2f0;"> | . \`  |/ _ \\|_  /\\ \\ /\\ / // _\` | '__|</span>
<span style="color:#f2f2f0;"> | |\\   |  __/ / /  \\ V  V /| (_| | |   </span>
<span style="color:#9da1ab;"> |_| \\_|\\___|/___|  \\_/\\_/  \\__,_|_|   </span>
  <span style="color:#e5a93c;">力と美のために</span> · <em>Nazwar 1.0 Amaterasu</em>
`;

  const commands = {
    help: `
<span style="color:#e5a93c;">Available commands:</span>
  • <span style="color:#f2f2f0;font-weight:600;">fetch</span>     : Display full system fastfetch summary & ASCII art
  • <span style="color:#f2f2f0;font-weight:600;">whoami</span>    : Personal identity & engineering background
  • <span style="color:#f2f2f0;font-weight:600;">tools</span>     : Detailed list of operating systems & dev tools
  • <span style="color:#f2f2f0;font-weight:600;">games</span>     : Favorite games & atmospheric worlds
  • <span style="color:#f2f2f0;font-weight:600;">contact</span>   : Direct links (GitHub, Telegram, Roblox)
  • <span style="color:#f2f2f0;font-weight:600;">matrix</span>    : Trigger digital rain sequence
  • <span style="color:#f2f2f0;font-weight:600;">clear</span>     : Flush terminal buffer`,

    fetch: `${asciiLogo}
<span style="color:#6a6f7b;">--------------------------------------------------</span>
<span style="color:#e5a93c;">User</span>       : nezart@cachyos
<span style="color:#e5a93c;">OS</span>         : CachyOS Linux x86_64 (Arch-based)
<span style="color:#e5a93c;">Kernel</span>     : 6.11.5-cachyos-bore
<span style="color:#e5a93c;">Compositor</span> : Hyprland 0.44 (Wayland)
<span style="color:#e5a93c;">Shell</span>      : fish 3.7.1 / starship
<span style="color:#e5a93c;">Editor</span>     : Neovim 0.10 & VS Code
<span style="color:#e5a93c;">Terminal</span>   : Foot / Kitty (GPU-accelerated)
<span style="color:#e5a93c;">Discipline</span> : Electrical Engineering
<span style="color:#e5a93c;">Location</span>   : Indonesia [UTC+7]
<span style="color:#e5a93c;">Uptime</span>     : Active & Fine-tuning Systems`,

    whoami: `
<span style="color:#e5a93c;">Nazwar (@Nez4rt)</span>
Electrical Engineering student and Linux systems enthusiast.
Focused on understanding computing mechanisms from the ground up:
low-level tuning, Wayland compositors, custom CLI utilities, and dotfiles craft.`,

    tools: `
<span style="color:#e5a93c;">[Systems & Kernel]</span>
  • CachyOS / Arch Linux, Linux Kernel tuning (BORE Scheduler)
  • Dynamic Wayland compositors (Hyprland, Niri)
  • Modular dotfiles and systemd automation

<span style="color:#e5a93c;">[Development]</span>
  • Neovim (Lua-configured modal editing), VS Code
  • Git / GitHub version control & signed commits
  • Shell Scripting (Bash, Zsh, Fish), Rust & C

<span style="color:#e5a93c;">[Workflow & Terminal]</span>
  • Foot & Kitty GPU terminal emulators
  • Tmux multiplexer, Fzf fuzzy finder, Ripgrep, Btop`,

    games: `
<span style="color:#e5a93c;">[Recreation & Atmospheric Worlds]</span>
  1. <span style="color:#f2f2f0;">Skyrim Special Edition</span> — Open-world exploration, modding mastery, and Nord atmosphere.
  2. <span style="color:#f2f2f0;">Stardew Valley</span> — Cozy simulation, charming pixel art, and relaxing soundtrack.
  3. <span style="color:#f2f2f0;">Roblox</span> — Creative sandboxes, community mechanics, and Lua engine experiments.`,

    contact: `
<span style="color:#e5a93c;">[Direct Transmission Channels]</span>
  • GitHub   : <a href="https://github.com/nez4rt" target="_blank" style="color:#e5a93c;text-decoration:underline;">https://github.com/nez4rt</a>
  • Telegram : <a href="https://t.me/Nez4rt" target="_blank" style="color:#e5a93c;text-decoration:underline;">https://t.me/Nez4rt</a>
  • Roblox   : <a href="https://www.roblox.com/share?code=22fd7833ae80f74790ec0d9e07d7d381&type=Profile&source=ProfileShare&stamp=1788659872501" target="_blank" style="color:#e5a93c;text-decoration:underline;">@DE4DB33F Profile</a>`
  };

  function execute(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();

    // Echo input
    const echoLine = document.createElement('div');
    echoLine.className = 'term-line';
    echoLine.innerHTML = `<span class="prompt-prefix">nezart@cachyos:~$</span> ${escapeHTML(rawCmd)}`;
    output.appendChild(echoLine);

    if (cmd === 'clear') {
      output.innerHTML = '';
      return;
    }

    if (cmd === 'matrix') {
      runMatrixEffect();
      return;
    }

    const resLine = document.createElement('div');
    resLine.className = 'term-line';

    if (commands[cmd]) {
      resLine.innerHTML = commands[cmd].trim().replace(/\n/g, '<br>');
    } else if (cmd === '') {
      resLine.innerHTML = '';
    } else {
      resLine.innerHTML = `<span style="color:#df5449;">zsh: command not found: ${escapeHTML(cmd)}</span>. Type <span style="color:#e5a93c;">'help'</span> to see available commands.`;
    }

    output.appendChild(resLine);
    output.scrollTop = output.scrollHeight;
  }

  function runMatrixEffect() {
    const matrixLine = document.createElement('div');
    matrixLine.className = 'term-line';
    matrixLine.style.color = '#52b788';
    matrixLine.innerHTML = 'Connecting to Amaterasu core stream...<br>';
    output.appendChild(matrixLine);

    let count = 0;
    const glyphs = '0123456789ABCDEFﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ力技美天照';
    const interval = setInterval(() => {
      let row = '';
      for (let i = 0; i < 48; i++) {
        row += glyphs[Math.floor(Math.random() * glyphs.length)] + ' ';
      }
      matrixLine.innerHTML += row + '<br>';
      output.scrollTop = output.scrollHeight;
      count++;
      if (count >= 8) {
        clearInterval(interval);
        matrixLine.innerHTML += '<span style="color:#e5a93c;">Stream synchronised with CachyOS kernel.</span>';
        output.scrollTop = output.scrollHeight;
      }
    }, 90);
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      execute(val);
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      execute(cmd);
    });
  });

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

/* --------------------------------------------------------------------------
   8. Mobile Drawer Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.mobile-drawer');
  const links = document.querySelectorAll('.mobile-link');

  if (!burger || !drawer) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    drawer.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      drawer.classList.remove('open');
    });
  });
}
