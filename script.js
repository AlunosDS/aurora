// script.js - common functions for navigation and UI

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if (!sidebar) return;
  const isOpen = sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active', isOpen);
  // Update aria-expanded on menu-toggle buttons
  const toggles = document.querySelectorAll('.menu-toggle');
  toggles.forEach(btn => btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false'));
  if (sidebar) sidebar.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  if (overlay) overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
}

// Close sidebar when clicking overlay
document.addEventListener('click', (e) => {
  const overlay = document.getElementById('overlay');
  const sidebar = document.getElementById('sidebar');
  if (!overlay || !sidebar) return;
  if (e.target === overlay) {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }
});

// Add keyboard support to close sidebar on Esc
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    // hide modal if open
    const modal = document.getElementById('helpModal');
    if (modal && modal.style.display !== 'none') hideHelpForm();
  }
});

// Help modal functions if present
function showHelpForm() {
  const modal = document.getElementById('helpModal');
  if (!modal) return;
  // show modal and mark accessible state
  modal.style.display = 'flex';
  modal.removeAttribute('aria-hidden');
  const name = document.getElementById('helpName');
  const desc = document.getElementById('helpDescription');
  if (name) name.value = '';
  if (desc) desc.value = '';
  const lat = document.getElementById('helpLat');
  const lng = document.getElementById('helpLng');
  if (lat) lat.value = '';
  if (lng) lng.value = '';
  const share = document.getElementById('shareLocation');
  if (share) share.checked = false;
  const status = document.getElementById('locationStatus');
  if (status) status.textContent = 'Nenhuma localização';
  // Focus management
  const first = modal.querySelector('input, textarea, button');
  if (first) {
    modal._previousActive = document.activeElement;
    first.focus();
  }
  trapFocus(modal);
}

function hideHelpForm() {
  const modal = document.getElementById('helpModal');
  if (!modal) return;
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  releaseFocusTrap(modal);
  try { if (modal._previousActive) modal._previousActive.focus(); } catch(e) {}
}

function addHelpFormHandlers() {
  const closeBtn = document.getElementById('closeHelpModal');
  const cancelBtn = document.getElementById('cancelHelp');
  const share = document.getElementById('shareLocation');
  if (closeBtn) closeBtn.addEventListener('click', hideHelpForm);
  if (cancelBtn) cancelBtn.addEventListener('click', hideHelpForm);
  if (share) {
    share.addEventListener('change', function() {
      const status = document.getElementById('locationStatus');
      if (this.checked) {
        if (!navigator.geolocation) {
          status.textContent = 'Geolocalização não suportada';
          return;
        }
        status.textContent = 'Aguardando permissão…';
        navigator.geolocation.getCurrentPosition((pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lng = pos.coords.longitude.toFixed(6);
          const latEl = document.getElementById('helpLat');
          const lngEl = document.getElementById('helpLng');
          if (latEl) latEl.value = lat;
          if (lngEl) lngEl.value = lng;
          status.textContent = `Local capturado: ${lat}, ${lng}`;
        }, (err) => {
          status.textContent = 'Permissão negada';
          this.checked = false;
        }, { timeout: 10000 });
      } else {
        status.textContent = 'Nenhuma localização';
        const latEl = document.getElementById('helpLat');
        const lngEl = document.getElementById('helpLng');
        if (latEl) latEl.value = '';
        if (lngEl) lngEl.value = '';
      }
    });
  }

  // Attach submit listener
  const submitBtn = document.querySelector('#helpModal button[onclick^="submitHelpForm"]');
  if (submitBtn) submitBtn.addEventListener('click', (e) => {
    submitHelpForm();
  });
}

function submitHelpForm() {
  const nome = document.getElementById('helpName') ? document.getElementById('helpName').value.trim() : '';
  const descricao = document.getElementById('helpDescription') ? document.getElementById('helpDescription').value.trim() : '';
  const lat = document.getElementById('helpLat') ? document.getElementById('helpLat').value : '';
  const lng = document.getElementById('helpLng') ? document.getElementById('helpLng').value : '';
  if (!descricao) {
    alert('Por favor, preencha a descrição.');
    return;
  }
  let msg = 'Mensagem de Ajuda enviada com sucesso\n\n';
  msg += `Nome: ${nome || '(não informado)'}\n`;
  msg += `Descrição: ${descricao}\n`;
  if (lat && lng) msg += `Localização: ${lat}, ${lng}\n`;
  alert(msg);
  hideHelpForm();
}

// Focus trapping utilities for modal dialogs
function trapFocus(modal) {
  if (!modal) return;
  const focusable = modal.querySelectorAll('a[href], area[href], input:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  function handle(e){
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  modal._focusTrapHandler = handle;
  modal.addEventListener('keydown', handle);
}

function releaseFocusTrap(modal){
  if (!modal) return;
  const h = modal._focusTrapHandler;
  if (h) modal.removeEventListener('keydown', h);
  modal._focusTrapHandler = null;
}

// Initialize handlers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadMenuFragment().then(() => {
    addHelpFormHandlers();
  }).catch(() => {
    addHelpFormHandlers();
  });
});

// Load menu fragment into pages that have #menu-root (inserts sidebar, overlay and help modal)
async function loadMenuFragment(){
  const root = document.getElementById('menu-root');
  if (!root) return;
  try{
    const res = await fetch('/menu-fragment.html');
    if (!res.ok) throw new Error('Failed to fetch menu fragment');
    const html = await res.text();
    root.innerHTML = html;
    // after inserting, we rebind overlay/close events
    addHelpFormHandlers();
  } catch(err){ console.error('menu fragment load failed', err); }
}