// ===== Função scrollToService (migrada de servicos.html) =====
window.scrollToService = function scrollToService(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}
// ===== Funções do Menu Lateral e Ajuda (migradas de menu.html) =====
window.toggleMenu = function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if (!sidebar || !overlay) return;
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

window.addEventListener('DOMContentLoaded', () => {
  // Modal de ajuda (já existe função global showHelpForm, mas garantir compatibilidade)
  window.showHelpForm = function showHelpForm() {
    const modal = document.getElementById('helpModal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.getElementById('helpName').value = '';
    document.getElementById('helpDescription').value = '';
    document.getElementById('helpLat').value = '';
    document.getElementById('helpLng').value = '';
    document.getElementById('shareLocation').checked = false;
    document.getElementById('locationStatus').textContent = 'Nenhuma localização';
  }
  const closeBtn = document.getElementById('closeHelpModal');
  if (closeBtn) closeBtn.addEventListener('click', () => { document.getElementById('helpModal').style.display = 'none'; });
  const cancelBtn = document.getElementById('cancelHelp');
  if (cancelBtn) cancelBtn.addEventListener('click', () => { document.getElementById('helpModal').style.display = 'none'; });
  const share = document.getElementById('shareLocation');
  if (share) {
    share.addEventListener('change', async function() {
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
          document.getElementById('helpLat').value = lat;
          document.getElementById('helpLng').value = lng;
          status.textContent = `Local capturado: ${lat}, ${lng}`;
          const link = document.getElementById('locationLink');
          if (link) {
            link.href = `https://www.google.com/maps?q=${lat},${lng}`;
            link.style.display = 'inline';
          }
        }, (err) => {
          status.textContent = 'Permissão negada';
          this.checked = false;
          const link = document.getElementById('locationLink');
          if (link) link.style.display = 'none';
        }, { timeout:10000 });
      } else {
        status.textContent = 'Nenhuma localização';
        document.getElementById('helpLat').value = '';
        document.getElementById('helpLng').value = '';
        const link = document.getElementById('locationLink');
        if (link) link.style.display = 'none';
      }
    });
  }
  window.submitHelpForm = function submitHelpForm() {
    const nome = document.getElementById('helpName').value.trim();
    const descricao = document.getElementById('helpDescription').value.trim();
    const lat = document.getElementById('helpLat').value;
    const lng = document.getElementById('helpLng').value;
    if (!descricao) {
      alert('Por favor, preencha a descrição.');
      return;
    }
    let msg = 'Mensagem de Ajuda enviada com sucesso\n\n';
    msg += `Nome: ${nome || '(não informado)'}\n`;
    msg += `Descrição: ${descricao}\n`;
    if (lat && lng) {
      msg += `Localização: ${lat}, ${lng}\n`;
    }
    alert(msg);
    document.getElementById('helpModal').style.display = 'none';
  }
});
// ===== Funções de Agendamento (migradas de agendamento.html) =====
window.addEventListener('DOMContentLoaded', () => {
  // MENU lateral já está em toggleMenu()

  // Calendário de agendamento
  const calendar = document.getElementById("calendar");
  if (calendar) {
    const diasNoMes = 30;
    const diasIndisponiveis = [2, 5, 10, 15, 16, 20, 21, 30, 11, 3];
    let diaSelecionado = null;
    for (let i = 1; i <= diasNoMes; i++) {
      const day = document.createElement("div");
      day.textContent = i;
      day.classList.add("day");
      if (diasIndisponiveis.includes(i)) {
        day.classList.add("unavailable");
      } else {
        day.addEventListener("click", () => {
          document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
          day.classList.add("selected");
          window.diaSelecionado = i;
        });
      }
      calendar.appendChild(day);
    }
    window.diaSelecionado = null;
  }

  // Horários
  const horariosDiv = document.getElementById("horarios");
  if (horariosDiv) {
    const horarios = ["09h", "10h", "11h", "13h", "14h", "15h", "16h", "17h"];
    horarios.forEach(h => {
      const btn = document.createElement("div");
      btn.textContent = h;
      btn.classList.add("hora");
      btn.addEventListener("click", () => {
        document.querySelectorAll(".hora").forEach(h => h.classList.remove("selecionada"));
        btn.classList.add("selecionada");
        window.horaSelecionada = h;
      });
      horariosDiv.appendChild(btn);
    });
    window.horaSelecionada = null;
  }

  // Confirmação do agendamento
  const formAgendamento = document.getElementById("form-agendamento");
  if (formAgendamento) {
    formAgendamento.addEventListener("submit", (event) => {
      event.preventDefault();
      const nome = document.getElementById("nome").value;
      const telefone = document.getElementById("telefone").value;
      if (!window.diaSelecionado) {
        alert("Por favor, selecione um dia disponível 💅");
        return;
      }
      if (!window.horaSelecionada) {
        alert("Por favor, escolha um horário disponível ⏰");
        return;
      }
      alert(`✨ Agendamento confirmado! ✨\n\n👤 Nome: ${nome}\n📞 Telefone: ${telefone}\n📅 Dia: ${window.diaSelecionado}\n🕒 Horário: ${window.horaSelecionada}`);
    });
  }

  // Modal de ajuda (já existe função global showHelpForm, mas garantir compatibilidade)
  window.showHelpForm = function showHelpForm() {
    const modal = document.getElementById('helpModal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.getElementById('helpName').value = '';
    document.getElementById('helpDescription').value = '';
    document.getElementById('helpLat').value = '';
    document.getElementById('helpLng').value = '';
    document.getElementById('shareLocation').checked = false;
    document.getElementById('locationStatus').textContent = 'Nenhuma localização';
  }
  const closeBtn = document.getElementById('closeHelpModal');
  if (closeBtn) closeBtn.addEventListener('click', () => { document.getElementById('helpModal').style.display = 'none'; });
  const cancelBtn = document.getElementById('cancelHelp');
  if (cancelBtn) cancelBtn.addEventListener('click', () => { document.getElementById('helpModal').style.display = 'none'; });
  const share = document.getElementById('shareLocation');
  if (share) {
    share.addEventListener('change', async function() {
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
          document.getElementById('helpLat').value = lat;
          document.getElementById('helpLng').value = lng;
          status.textContent = `Local capturado: ${lat}, ${lng}`;
        }, (err) => {
          status.textContent = 'Permissão negada';
          this.checked = false;
        }, { timeout:10000 });
      } else {
        status.textContent = 'Nenhuma localização';
        document.getElementById('helpLat').value = '';
        document.getElementById('helpLng').value = '';
      }
    });
  }
  window.submitHelpForm = function submitHelpForm() {
    const nome = document.getElementById('helpName').value.trim();
    const descricao = document.getElementById('helpDescription').value.trim();
    const lat = document.getElementById('helpLat').value;
    const lng = document.getElementById('helpLng').value;
    if (!descricao) {
      alert('Por favor, preencha a descrição.');
      return;
    }
    let msg = 'Mensagem de Ajuda enviada com sucesso\n\n';
    msg += `Nome: ${nome || '(não informado)'}\n`;
    msg += `Descrição: ${descricao}\n`;
    if (lat && lng) {
      msg += `Localização: ${lat}, ${lng}\n`;
    }
    alert(msg);
    document.getElementById('helpModal').style.display = 'none';
  }
});
// ===== Funções de Perfil (migradas de perfil.html) =====
window.addEventListener('DOMContentLoaded', () => {
  // Upload de foto de perfil
  const uploadInput = document.getElementById('upload-photo');
  const profilePic = document.getElementById('profilePic');
  const usernameEl = document.getElementById('username');
  if (uploadInput && profilePic) {
    uploadInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          profilePic.style.backgroundImage = `url('${e.target.result}')`;
        }
        reader.readAsDataURL(file);
      }
    });
  }
  // Função para editar nome do perfil
  window.editarPerfil = function editarPerfil() {
    if (!usernameEl) return;
    const novoNome = prompt("Digite o novo nome de usuário:");
    if (novoNome && novoNome.trim() !== "") {
      usernameEl.textContent = novoNome;
    }
  }
  // Função para alternar abas do perfil
  window.showTab = function showTab(index) {
    const tabs = document.querySelectorAll(".tab");
    const feed = document.getElementById("feed");
    const avaliacoes = document.getElementById("avaliacoes");
    if (!tabs.length || !feed || !avaliacoes) return;
    tabs.forEach(tab => tab.classList.remove("active"));
    tabs[index].classList.add("active");
    if (index === 0) {
      feed.style.display = "block";
      avaliacoes.style.display = "none";
    } else {
      feed.style.display = "none";
      avaliacoes.style.display = "block";
    }
  }
});
// ===== Funções de Login e Cadastro (migradas de login.html) =====
const MAX_TENTATIVAS = 3;
const BLOQUEIO_MS = 5 * 60 * 1000; // 5 minutos
let timerInterval = null;

function validarSenha(pwd) {
  if (!pwd) return { ok: false, msg: 'Digite uma senha.' };
  if (pwd.length < 6 || pwd.length > 8) return { ok: false, msg: 'A senha deve ter 6 a 8 caracteres.' };
  if (!/[A-Z]/.test(pwd)) return { ok: false, msg: 'Inclua pelo menos uma letra maiúscula.' };
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return { ok: false, msg: 'Inclua pelo menos um caractere especial.' };
  return { ok: true };
}

function criarConta() {
  const nome = document.getElementById('nomeCompleto').value.trim();
  const gmail = document.getElementById('gmail').value.trim();
  const usuario = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value;
  const senhaError = document.getElementById('senhaError');
  senhaError.classList.add('hidden');

  if (!gmail.endsWith('@gmail.com')) {
    senhaError.classList.remove('hidden');
    senhaError.textContent = 'Use um e-mail que termine com @gmail.com';
    return;
  }
  const check = validarSenha(senha);
  if (!check.ok) {
    senhaError.classList.remove('hidden');
    senhaError.textContent = check.msg;
    return;
  }

  if (!nome || !usuario) {
    senhaError.classList.remove('hidden');
    senhaError.textContent = 'Preencha todos os campos corretamente';
    return;
  }

  // Armazena no localStorage
  localStorage.setItem('auroraEmail', gmail);
  localStorage.setItem('auroraSenha', senha);

  alert('Conta criada com sucesso! Bem-vinda à Aurora, ' + nome + '!');
  mostrarLogin();
}

function entrar() {
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;
  const erro = document.getElementById('loginError');
  const timer = document.getElementById('loginTimer');
  const btn = document.getElementById('btnEntrar');
  erro.classList.add('hidden');
  timer.classList.add('hidden');

  const bloqueioAte = localStorage.getItem('auroraBloqueio');
  const agora = Date.now();

  // Verifica se ainda está bloqueado
  if (bloqueioAte && agora < parseInt(bloqueioAte)) {
    iniciarContagem(parseInt(bloqueioAte));
    erro.classList.remove('hidden');
    erro.textContent = 'Conta bloqueada. Aguarde o tempo acabar.';
    btn.disabled = true;
    return;
  }

  // Limpa bloqueio se expirou
  if (bloqueioAte && agora > parseInt(bloqueioAte)) {
    localStorage.removeItem('auroraBloqueio');
    localStorage.removeItem('auroraTentativas');
    btn.disabled = false;
  }

  if (!email.endsWith('@gmail.com')) {
    erro.classList.remove('hidden');
    erro.textContent = 'Use um Gmail válido.';
    registrarTentativa();
    return;
  }
  if (!senha) {
    erro.classList.remove('hidden');
    erro.textContent = 'Digite sua senha.';
    registrarTentativa();
    return;
  }

  const emailSalvo = localStorage.getItem('auroraEmail');
  const senhaSalva = localStorage.getItem('auroraSenha');

  if (email === emailSalvo && senha === senhaSalva) {
    alert('Login realizado com sucesso!');
    localStorage.removeItem('auroraTentativas');
    localStorage.removeItem('auroraBloqueio');
    btn.disabled = false;
  } else {
    erro.classList.remove('hidden');
    erro.textContent = 'E-mail ou senha incorretos.';
    registrarTentativa();
  }
}

function registrarTentativa() {
  let tentativas = parseInt(localStorage.getItem('auroraTentativas')) || 0;
  tentativas++;
  localStorage.setItem('auroraTentativas', tentativas);

  if (tentativas >= MAX_TENTATIVAS) {
    const bloqueioAte = Date.now() + BLOQUEIO_MS;
    localStorage.setItem('auroraBloqueio', bloqueioAte);
    localStorage.removeItem('auroraTentativas');
    const erro = document.getElementById('loginError');
    erro.classList.remove('hidden');
    erro.textContent = 'Você excedeu o número de tentativas. Bloqueado por 5 minutos.';
    document.getElementById('btnEntrar').disabled = true;
    iniciarContagem(bloqueioAte);
  }
}

function iniciarContagem(fim) {
  const timer = document.getElementById('loginTimer');
  const btn = document.getElementById('btnEntrar');
  timer.classList.remove('hidden');

  if (timerInterval) clearInterval(timerInterval);

  function atualizar() {
    const agora = Date.now();
    const restante = fim - agora;
    if (restante <= 0) {
      clearInterval(timerInterval);
      timer.textContent = '';
      timer.classList.add('hidden');
      btn.disabled = false;
      localStorage.removeItem('auroraBloqueio');
      return;
    }

    const minutos = Math.floor(restante / 60000);
    const segundos = Math.floor((restante % 60000) / 1000);
    timer.textContent = `Tente novamente em ${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  }

  atualizar();
  timerInterval = setInterval(atualizar, 1000);
}

function mostrarCadastro() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('cadastroForm').classList.remove('hidden');
  document.getElementById('formTitle').textContent = 'Criar conta';
  document.getElementById('formSubtitle').textContent = 'Cadastre-se na Aurora';
}

function mostrarLogin() {
  document.getElementById('cadastroForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('formTitle').textContent = 'Entrar';
  document.getElementById('formSubtitle').textContent = 'Acesse sua conta Aurora';

  // Ao voltar para o login, se ainda estiver bloqueado, exibe o contador
  const bloqueioAte = localStorage.getItem('auroraBloqueio');
  if (bloqueioAte && Date.now() < parseInt(bloqueioAte)) {
    document.getElementById('btnEntrar').disabled = true;
    iniciarContagem(parseInt(bloqueioAte));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const bloqueioAte = localStorage.getItem('auroraBloqueio');
  if (bloqueioAte && Date.now() < parseInt(bloqueioAte)) {
    document.getElementById('btnEntrar').disabled = true;
    iniciarContagem(parseInt(bloqueioAte));
  }
});
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