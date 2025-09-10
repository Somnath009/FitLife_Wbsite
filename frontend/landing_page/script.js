// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  const open = links.style.display === 'flex';
  links.style.display = open ? 'none' : 'flex';
});

// Simple theme toggle (dark only visual tweak)
const themeBtn = document.getElementById('themeToggle');
themeBtn?.addEventListener('click', () => {
  document.body.classList.toggle('alt-theme');
});

// Fake demo handler
document.getElementById('watchDemo')?.addEventListener('click', () => {
  alert('Playing demo… (replace with modal/video player)');
});

// Optional: close menu on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth < 980) links.style.display = 'none';
  });
});
