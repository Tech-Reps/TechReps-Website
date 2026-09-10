// Theme Engine & Core Layout Manager
// Supports automatic system color scheme sync (prefers-color-scheme) with smart auto-resetting toggle

// Automatically clean legacy sticky keys from older versions to prevent stuck themes
try {
  localStorage.removeItem('techreps-theme');
} catch (e) {}

function getThemeOverride() {
  try {
    const override = localStorage.getItem('techreps-theme-override');
    return (override === 'dark' || override === 'light') ? override : null;
  } catch (e) {
    return null;
  }
}

function getSystemTheme() {
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}

function getEffectiveTheme() {
  const override = getThemeOverride();
  return override || getSystemTheme();
}

function applyTheme(theme) {
  if (theme === 'dark' || theme === 'light') {
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) {
      document.body.setAttribute('data-theme', theme);
    }
  } else {
    // In Auto mode: remove data-theme so native CSS @media (prefers-color-scheme: dark) controls colors live
    document.documentElement.removeAttribute('data-theme');
    if (document.body) {
      document.body.removeAttribute('data-theme');
    }
  }
  updateToggleUI();
}

function updateToggleUI() {
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  if (!icon || !text) return;

  const override = getThemeOverride();
  const systemIsDark = getSystemTheme() === 'dark';

  if (!override) {
    // Auto / System Mode
    if (systemIsDark) {
      icon.textContent = '🌙';
      text.textContent = 'Auto (Dark)';
    } else {
      icon.textContent = '☀️';
      text.textContent = 'Auto (Light)';
    }
  } else {
    // Manual Override Mode
    if (override === 'dark') {
      icon.textContent = '🌙';
      text.textContent = 'Dark Mode';
    } else {
      icon.textContent = '☀️';
      text.textContent = 'Light Mode';
    }
  }
}

function toggleTheme() {
  const systemTheme = getSystemTheme();
  const currentOverride = getThemeOverride();

  if (!currentOverride) {
    // Currently in Auto mode: switch to the opposite of the current system theme as an override
    const newOverride = systemTheme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('techreps-theme-override', newOverride);
    } catch (e) {}
    applyTheme(newOverride);
  } else {
    // Currently in manual override: clear override and return to Auto (System) mode
    try {
      localStorage.removeItem('techreps-theme-override');
    } catch (e) {}
    applyTheme(null);
  }
}

// Global persistent reference to prevent garbage collection in Safari / WebKit
if (window.matchMedia) {
  window.__techreps_mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystemThemeChange = function() {
    if (!getThemeOverride()) {
      applyTheme(null);
    }
  };

  if (window.__techreps_mq.addEventListener) {
    window.__techreps_mq.addEventListener('change', onSystemThemeChange);
  } else if (window.__techreps_mq.addListener) {
    window.__techreps_mq.addListener(onSystemThemeChange);
  }

  // Also sync when switching windows or tabs back into focus from macOS System Settings
  window.addEventListener('focus', onSystemThemeChange);
  document.addEventListener('visibilitychange', onSystemThemeChange);
}

// Immediate application to documentElement to avoid any flash of unstyled theme
applyTheme(getThemeOverride());

function initNavigation() {
  const burger = document.getElementById('mobile-burger');
  const navBar = document.getElementById('nav-bar');

  // Robust Path Normalization to prevent sub-page styling dropouts
  let currentPathName = window.location.pathname.split("/").pop();
  if (!currentPathName || currentPathName === "") {
    currentPathName = "index.html";
  }

  const navLinks = document.querySelectorAll('.nav-link');
  let foundActive = false;

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href').split("/").pop();
    if (linkHref === currentPathName) {
      link.classList.add('active');
      foundActive = true;
    } else {
      link.classList.remove('active');
    }
  });

  // Strict structural fallback for homepage references
  if (!foundActive && navLinks.length > 0) {
    if (currentPathName === "index.html" || currentPathName === "") {
      navLinks[0].classList.add('active');
    }
  }

  // Mobile Drawer Toggle with Max-Height Roll-Down
  if (burger && navBar) {
    const newBurger = burger.cloneNode(true);
    burger.parentNode.replaceChild(newBurger, burger);

    newBurger.addEventListener('click', (e) => {
      e.stopPropagation();
      newBurger.classList.toggle('open');
      navBar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (navBar.classList.contains('open') && !navBar.contains(e.target) && !newBurger.contains(e.target)) {
        newBurger.classList.remove('open');
        navBar.classList.remove('open');
      }
    });
  }
}

function initTheme() {
  applyTheme(getThemeOverride());
  initNavigation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}