// script.js - common functions for navigation and UI

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if (!sidebar) return;
  const isOpen = sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active', isOpen);
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
  }
});

// Help modal functions if present
function showHelpForm() {
  const modal = document.getElementById('helpModal');
  if (!modal) return;
  modal.style.display = 'flex';
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
}

function hideHelpForm() {
  const modal = document.getElementById('helpModal');
  if (!modal) return;
  modal.style.display = 'none';
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

// Initialize handlers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  addHelpFormHandlers();
});