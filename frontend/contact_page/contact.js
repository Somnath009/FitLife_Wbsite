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

// Basic client-side validation using HTML5 validity API
const form = document.getElementById('contactForm');
const fields = ['name','email','phone','topic','message'];

function setError(id, msg){
  const el = document.getElementById(id);
  el?.parentElement.querySelector('.error')?.replaceChildren(document.createTextNode(msg || ''));
}

function validateField(id){
  const el = document.getElementById(id);
  if(!el) return true;
  if(el.checkValidity()){
    setError(id,'');
    el.parentElement.classList.remove('invalid');
    return true;
  }else{
    setError(id, el.validationMessage);
    el.parentElement.classList.add('invalid');
    return false;
  }
}

fields.forEach(id=>{
  document.getElementById(id)?.addEventListener('input', ()=>validateField(id));
});

form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const ok = fields.every(validateField) && document.getElementById('consent')?.checked;
  const msg = document.getElementById('formMsg');
  if(ok){
    msg.textContent = 'Thanks! Message received. We will reply within 24 hours.';
    form.reset();
  }else{
    msg.textContent = 'Please fix the highlighted fields and accept the privacy consent.';
  }
});
