// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  const open = links.style.display === 'flex';
  links.style.display = open ? 'none' : 'flex';
});

// Theme toggle
document.getElementById('themeToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('alt-theme');
});

// Category filter
const pills = document.querySelectorAll('.pill');
const cards = document.querySelectorAll('.post');
pills.forEach(p => {
  p.addEventListener('click', () => {
    pills.forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    const f = p.dataset.filter;
    cards.forEach(c => {
      c.style.display = (f === 'all' || c.dataset.cat === f) ? '' : 'none';
    });
  });
});

// Newsletter mock
document.querySelector('.signup')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thanks for subscribing! New posts every week.');
});
