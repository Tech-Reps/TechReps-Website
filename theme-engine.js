// Theme Engine & Core Layout Manager

function initTheme() {
  const savedTheme = localStorage.getItem('techreps-theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  updateToggleUI(savedTheme);
  initNavigation();
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('techreps-theme', newTheme);
  updateToggleUI(newTheme);
}

function updateToggleUI(theme) {
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  if (!icon || !text) return;

  if (theme === 'dark') {
    icon.textContent = '☀️';
    text.textContent = 'Light Mode';
  } else {
    icon.textContent = '🌙';
    text.textContent = 'Dark Mode';
  }
}

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
    // Get only the trailing filename from the href attribute
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

document.addEventListener('DOMContentLoaded', initTheme);