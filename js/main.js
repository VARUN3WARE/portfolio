// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = themeToggle.querySelector('.sun');
const moonIcon = themeToggle.querySelector('.moon');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeButtons(currentTheme);

function updateThemeButtons(theme) {
  if (theme === 'dark') {
    moonIcon.classList.add('active');
    sunIcon.classList.remove('active');
  } else {
    sunIcon.classList.add('active');
    moonIcon.classList.remove('active');
  }
}

themeToggle.addEventListener('click', (e) => {
  let currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeButtons(newTheme);
});

// Navigation Active Link
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
  navLinks.forEach(link => {
    link.classList.remove('active');
    
    const href = link.getAttribute('href').slice(1);
    const section = document.getElementById(href);
    
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 200 && rect.bottom > 200) {
        link.classList.add('active');
      }
    }
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

window.addEventListener('scroll', setActiveLink);
setActiveLink();
