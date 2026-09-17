script.js

function openModal() { document.getElementById('modal').classList.add('show') }
function closeModal() { document.getElementById('modal').classList.remove('show') }
document.getElementById('modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal() })
function submitForm(e) { e.preventDefault(); document.getElementById('formBox').style.display = 'none'; document.getElementById('success').style.display = 'block' }
function risk(el) { document.querySelectorAll('.risk').forEach(x => x.classList.remove('active')); el.classList.add('active') }
document.querySelectorAll('.faq-q').forEach(q => q.addEventListener('click', () => q.parentElement.classList.toggle('open')))
const steps = document.querySelectorAll('.step'), img = document.getElementById('processImg'), title = document.getElementById('processTitle'), copy = document.getElementById('processCopy');
steps.forEach(s => s.addEventListener('click', () => { steps.forEach(x => x.classList.remove('active')); s.classList.add('active'); img.style.opacity = 0; setTimeout(() => { img.src = s.dataset.img; title.textContent = s.dataset.title; copy.textContent = s.dataset.copy; img.style.opacity = 1 }, 180) }));