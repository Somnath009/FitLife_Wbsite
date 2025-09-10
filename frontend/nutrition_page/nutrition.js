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

// Tabs (Weight Gain / Loss / Cutting)
const pills = document.querySelectorAll('.pill');
const panels = document.querySelectorAll('.panel');
pills.forEach(p => {
  p.addEventListener('click', () => {
    pills.forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    panels.forEach(panel => panel.classList.remove('visible'));
    const target = document.querySelector(p.dataset.target);
    target?.classList.add('visible');
    target?.scrollIntoView({behavior:'smooth', block:'start'});
  });
});
