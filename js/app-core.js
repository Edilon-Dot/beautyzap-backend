/* BeautyZap v2 — Core (Router, Helpers, Icons, Auth, Shell) */
window.BZ = {};

// === ICONS ===
const I = {
  dashboard:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
  calendar:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  users:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  zap:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  megaphone:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
  creditCard:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  settings:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  whatsapp:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  logout:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  bell:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  plus:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  check:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
  x:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  chevL:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
  chevR:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
  edit:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  send:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  menu:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  lock:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  wifi:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>',
  crown:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M5 16h14v4H5z"/></svg>'
};
BZ.I = I;

// === HELPERS ===
function $(s) { return document.querySelector(s); }
function $$(s) { return document.querySelectorAll(s); }
function fmt$(v) { return 'R$ ' + Number(v).toFixed(2).replace('.',','); }
function fmtDate(d) { if(!d) return '—'; const p=d.split('-'); return p[2]+'/'+p[1]+'/'+p[0]; }
function today() { return new Date().toISOString().split('T')[0]; }

function toast(msg, type='success') {
  const t = document.createElement('div');
  t.className = 'toast toast-'+type;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}
BZ.toast = toast;

// --- BACKEND API LAYER ---
BZ.API = {
  baseUrl: 'http://localhost:3001/api',
  async post(path, body) {
    try {
      const res = await fetch(this.baseUrl + path, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
      return await res.json();
    } catch(e) { console.error('API Error:', e); return { error: e.message }; }
  },
  async get(path) {
    try {
      const res = await fetch(this.baseUrl + path);
      return await res.json();
    } catch(e) { console.error('API Error:', e); return { error: e.message }; }
  }
};
// -------------------------


function openModal(html) {
  const o = $('#modalOverlay');
  o.innerHTML = '<div class="modal">'+html+'</div>';
  o.style.display = 'flex';
  requestAnimationFrame(() => o.classList.add('show'));
  o.onclick = e => { if(e.target === o) BZ.closeModal(); };
}
function closeModal() {
  const o = $('#modalOverlay');
  o.classList.remove('show');
  setTimeout(() => { o.style.display='none'; o.innerHTML=''; }, 200);
}
BZ.openModal = openModal;
BZ.closeModal = closeModal;

// Upgrade modal for locked features
function showUpgradeModal(featureName) {
  const plans = Store.getPlans();
  openModal(`
    <div class="upgrade-modal">
      <div class="upgrade-icon">${I.crown}</div>
      <h2>Recurso Premium</h2>
      <p class="upgrade-desc"><strong>${featureName}</strong> está disponível no Plano Pro.</p>
      <p class="upgrade-sub">Faça upgrade para automatizar seu negócio e aumentar seu faturamento.</p>
      <div class="upgrade-compare">
        <div class="uc-plan basic"><h4>Basic</h4><span class="uc-price">${fmt$(plans[0].price)}/mês</span><ul>${plans[0].features.map(f=>'<li>'+I.check+' '+f+'</li>').join('')}</ul></div>
        <div class="uc-plan pro"><span class="uc-badge">Recomendado</span><h4>Pro</h4><span class="uc-price">${fmt$(plans[1].price)}/mês</span><ul>${plans[1].features.map(f=>'<li>'+I.check+' '+f+'</li>').join('')}</ul><a href="#assinatura" class="btn-primary btn-block" onclick="BZ.closeModal()">Fazer Upgrade</a></div>
      </div>
      <button class="btn-text" onclick="BZ.closeModal()">Agora não</button>
    </div>
  `);
}
BZ.showUpgradeModal = showUpgradeModal;

// === AUTH ===
function renderLogin() {
  $('#app').innerHTML = `
    <div class="auth-page"><div class="auth-left"><div class="auth-brand"><a href="index.html" class="logo"><span class="logo-icon">⚡</span><span>Beauty<span class="gold">Zap</span></span></a></div><div class="auth-hero"><h1>Bem-vindo de volta</h1><p>Acesse sua conta e gerencie seu negócio.</p></div><div class="auth-stats"><div class="auth-stat"><strong>2.400+</strong><span>Profissionais</span></div><div class="auth-stat"><strong>98%</strong><span>Satisfação</span></div><div class="auth-stat"><strong>-60%</strong><span>Menos faltas</span></div></div></div>
    <div class="auth-right"><div class="auth-form-wrapper"><h2>Entrar</h2><p class="auth-subtitle">Entre com seus dados para acessar o painel.</p>
      <form id="loginForm" class="auth-form"><div class="form-group"><label>E-mail</label><input type="email" id="loginEmail" placeholder="seu@email.com" required></div><div class="form-group"><label>Senha</label><input type="password" id="loginPassword" placeholder="••••••••" required></div><button type="submit" class="btn-primary btn-block">Entrar</button></form>
      <p class="auth-switch">Não tem conta? <a href="#register">Criar conta grátis</a></p></div></div></div>`;
  $('#loginForm').onsubmit = e => {
    e.preventDefault();
    const u = Store.getUserByEmail($('#loginEmail').value);
    if (u && u.password === $('#loginPassword').value) { Store.setSession(u.id); nav('dashboard'); }
    else toast('E-mail ou senha incorretos.', 'error');
  };
}
BZ.renderLogin = renderLogin;

function renderRegister() {
  $('#app').innerHTML = `
    <div class="auth-page"><div class="auth-left"><div class="auth-brand"><a href="index.html" class="logo"><span class="logo-icon">⚡</span><span>Beauty<span class="gold">Zap</span></span></a></div><div class="auth-hero"><h1>Comece agora</h1><p>7 dias grátis do Plano Pro completo. Sem cartão.</p></div><div class="auth-stats"><div class="auth-stat"><strong>7 dias</strong><span>Teste grátis</span></div><div class="auth-stat"><strong>0</strong><span>Compromisso</span></div><div class="auth-stat"><strong>100%</strong><span>Funcional</span></div></div></div>
    <div class="auth-right"><div class="auth-form-wrapper"><h2>Criar Conta</h2><p class="auth-subtitle">Preencha seus dados para começar o teste grátis.</p>
      <form id="regForm" class="auth-form"><div class="form-group"><label>Seu nome</label><input type="text" id="rName" required placeholder="Maria Silva"></div><div class="form-group"><label>Nome do negócio</label><input type="text" id="rBiz" required placeholder="Studio Maria"></div><div class="form-group"><label>WhatsApp</label><input type="tel" id="rPhone" required placeholder="(11) 99999-9999"></div><div class="form-group"><label>E-mail</label><input type="email" id="rEmail" required placeholder="seu@email.com"></div><div class="form-group"><label>Senha</label><input type="password" id="rPass" required minlength="6" placeholder="Mínimo 6 caracteres"></div><button type="submit" class="btn-primary btn-block">Criar conta e testar grátis</button></form>
      <p class="auth-switch">Já tem conta? <a href="#login">Fazer login</a></p></div></div></div>`;
  $('#regForm').onsubmit = e => {
    e.preventDefault();
    if (Store.getUserByEmail($('#rEmail').value)) { toast('E-mail já cadastrado.','error'); return; }
    const r = Store.createUser({ name:$('#rName').value, businessName:$('#rBiz').value, phone:$('#rPhone').value, email:$('#rEmail').value, password:$('#rPass').value });
    Store.setSession(r.user.id);
    toast('Conta criada! Bem-vindo ao BeautyZap! 🎉');
    nav('onboarding');
  };
}
BZ.renderRegister = renderRegister;

// === ONBOARDING ===
function renderOnboarding() {
  const s = BZ.session;
  let step = 1;
  const data = { type:'', services:[], hours: s.business.workingHours };

  function render() {
    const steps = ['Tipo','Serviços','Horários','WhatsApp'];
    $('#app').innerHTML = `
      <div class="onboarding-page"><div class="onb-container">
        <div class="onb-header"><a href="index.html" class="logo"><span class="logo-icon">⚡</span><span>Beauty<span class="gold">Zap</span></span></a><span class="onb-step">Passo ${step} de 4</span></div>
        <div class="onb-progress"><div class="onb-bar" style="width:${step*25}%"></div></div>
        <div class="onb-steps">${steps.map((s,i)=>`<span class="onb-dot ${i+1<=step?'active':''}">${i+1}</span>`).join('')}</div>
        <div class="onb-body" id="onbBody"></div>
      </div></div>`;
    renderStep();
  }

  function renderStep() {
    const body = $('#onbBody');
    if (step === 1) {
      const types = ['Salão de Beleza','Barbearia','Clínica Estética','Nail Designer','Lash Designer','Massagem','Sobrancelha','Autônomo'];
      body.innerHTML = `<h2>Qual é o tipo do seu negócio?</h2><p class="onb-desc">Isso nos ajuda a personalizar sua experiência.</p>
        <div class="type-grid">${types.map(t=>`<button class="type-card ${data.type===t?'selected':''}" data-type="${t}"><span>${t}</span></button>`).join('')}</div>
        <div class="onb-actions"><button class="btn-primary" id="onbNext" ${!data.type?'disabled':''}>Continuar</button></div>`;
      $$('.type-card').forEach(c => c.onclick = () => { data.type=c.dataset.type; render(); });
    } else if (step === 2) {
      body.innerHTML = `<h2>Quais serviços você oferece?</h2><p class="onb-desc">Adicione seus principais serviços com preço e duração.</p>
        <div class="svc-list" id="svcList">${data.services.map((s,i)=>`<div class="svc-item"><span>${s.name}</span><span>${s.duration}min</span><span>${fmt$(s.price)}</span><button class="btn-icon-sm" data-idx="${i}">${I.trash}</button></div>`).join('')}</div>
        <form id="addSvc" class="svc-form"><input type="text" id="svcName" placeholder="Nome do serviço" required><input type="number" id="svcDur" placeholder="Duração (min)" value="60" min="15" step="15"><input type="number" id="svcPrice" placeholder="Preço" step="0.01"><button type="submit" class="btn-outline btn-sm">${I.plus} Adicionar</button></form>
        <div class="onb-actions"><button class="btn-outline" id="onbPrev">Voltar</button><button class="btn-primary" id="onbNext">Continuar</button></div>`;
      $('#addSvc').onsubmit = e => { e.preventDefault(); data.services.push({name:$('#svcName').value,duration:parseInt($('#svcDur').value)||60,price:parseFloat($('#svcPrice').value)||0}); render(); };
      $$('.svc-item button').forEach(b => b.onclick = () => { data.services.splice(parseInt(b.dataset.idx),1); render(); });
    } else if (step === 3) {
      const days = {mon:'Segunda',tue:'Terça',wed:'Quarta',thu:'Quinta',fri:'Sexta',sat:'Sábado',sun:'Domingo'};
      body.innerHTML = `<h2>Horário de funcionamento</h2><p class="onb-desc">Configure os dias e horários de atendimento.</p>
        <div class="hours-grid">${Object.entries(days).map(([k,v])=>{const h=data.hours[k];return`<div class="hour-row"><label class="toggle-sm"><input type="checkbox" ${h.active?'checked':''} data-day="${k}" class="day-toggle"><span class="toggle-slider-sm"></span></label><span class="hour-day">${v}</span><input type="time" value="${h.start}" class="h-start" data-day="${k}" ${!h.active?'disabled':''}><span>até</span><input type="time" value="${h.end}" class="h-end" data-day="${k}" ${!h.active?'disabled':''}>`;}).join('')}</div>
        <div class="onb-actions"><button class="btn-outline" id="onbPrev">Voltar</button><button class="btn-primary" id="onbNext">Continuar</button></div>`;
      $$('.day-toggle').forEach(t => t.onchange = () => { data.hours[t.dataset.day].active=t.checked; const r=t.closest('.hour-row'); r.querySelectorAll('input[type=time]').forEach(i=>i.disabled=!t.checked); });
    } else if (step === 4) {
      body.innerHTML = `<h2>Conectar WhatsApp</h2><p class="onb-desc">Conecte seu WhatsApp para enviar mensagens automáticas.</p>
        <div class="wa-options"><div class="wa-option" data-method="qrcode"><span class="wa-icon">📱</span><h4>QR Code</h4><p>Escaneie com seu celular</p></div><div class="wa-option" data-method="api"><span class="wa-icon">🔗</span><h4>API Oficial</h4><p>Meta Business API</p></div><div class="wa-option" data-method="token"><span class="wa-icon">🔑</span><h4>Token/API Externa</h4><p>Evolution, Baileys, etc.</p></div></div>
        <div class="onb-actions"><button class="btn-outline" id="onbPrev">Voltar</button><button class="btn-outline" id="onbSkip">Pular por agora</button><button class="btn-primary" id="onbFinish" style="display:none">Finalizar</button></div>`;
      $$('.wa-option').forEach(o => o.onclick = () => openWaConnect(o.dataset.method));
      if($('#onbSkip')) $('#onbSkip').onclick = finishOnboarding;
    }
    if($('#onbNext')) $('#onbNext').onclick = () => { saveStepData(); step++; render(); };
    if($('#onbPrev')) $('#onbPrev').onclick = () => { step--; render(); };
  }

  async function openWaConnect(method) {
    if (method === 'qrcode') {
      openModal(`<div class="modal-header"><h2>Leitor de QR Code</h2><button class="btn-icon modal-close" onclick="clearInterval(window.waPollTimer2); BZ.closeModal()">${I.x}</button></div>
        <div class="wa-connect-body" style="text-align: center;">
          <p style="margin-bottom: 16px;">Para usar o WhatsApp no BeautyZap:</p>
          <ol style="text-align: left; max-width: 250px; margin: 0 auto 24px; font-size: 0.85rem; color: var(--text-2);">
            <li>Abra o WhatsApp no celular</li>
            <li>Vá em <strong>Aparelhos conectados</strong></li>
            <li>Toque em <strong>Conectar um aparelho</strong></li>
            <li>Aponte a câmera para esta tela</li>
          </ol>
          <div style="background: var(--surface-2); padding: 16px; border-radius: 16px; display: inline-block; min-width:250px; min-height:250px; display:flex; align-items:center; justify-content:center;" id="qrImgBox2">
             <span style="color:var(--gold);">Carregando da Evolution API...</span>
          </div>
          <p id="qrWaitMsg2" style="margin-top: 16px; font-size: 0.88rem; color: var(--gold);">Solicitando QR Code Real...</p>
        </div>`);

      const connData = await BZ.API.post('/whatsapp/connect', { businessId: s.business.id });
      
      if (connData.success && connData.data && connData.data.qrcode && connData.data.qrcode.base64) {
        document.getElementById('qrImgBox2').innerHTML = `<img src="${connData.data.qrcode.base64}" alt="QR Code" style="border-radius: 8px; width: 250px; height: 250px;">`;
        document.getElementById('qrWaitMsg2').innerHTML = `Aponte a câmera. Aguardando conexão... <span id="pwdLoader">⏳</span>`;
        
        window.waPollTimer2 = setInterval(async () => {
           const statData = await BZ.API.get('/whatsapp/status/' + s.business.id);
           if (statData.success && statData.status === 'connected') {
             clearInterval(window.waPollTimer2);
             const qrC = $('#qrWaitMsg2');
             if (qrC) {
                qrC.innerHTML = "✅ WhatsApp conectado com sucesso!";
                qrC.style.color = "var(--green)";
                setTimeout(() => {
                  Store.connectWhatsApp(s.business.id, { method: 'qrcode', phone: statData.data.instance?.owner || s.business.whatsapp || 'Meu WhatsApp' });
                  BZ.closeModal();
                  toast('WhatsApp conectado via Backend! ✅');
                  finishOnboarding();
                }, 1500);
             }
           }
        }, 3000);
      } else {
        document.getElementById('qrImgBox2').innerHTML = `<span style="color:var(--red);">Falha ao gerar QR Code. Tente novamente mais tarde.</span>`;
        document.getElementById('qrWaitMsg2').innerHTML = `Erro Backend: Evolution API offline ou não configurada.`;
      }
    } else {
      openModal(`<div class="modal-header"><h2>Conectar WhatsApp</h2><button class="btn-icon modal-close" onclick="BZ.closeModal()">${I.x}</button></div>
        <div class="wa-connect-body">
          ${method==='api'?`<p>Configure sua API do Meta Business Platform.</p>`:''}
          ${method==='token'?`<p>Insira o token da sua API externa (Evolution, Baileys, etc.)</p>`:''}
          <form id="waForm" class="modal-form"><div class="form-group"><label>Número WhatsApp</label><input type="tel" id="waPhone" placeholder="(11) 99999-9999" required></div>
          ${method==='token'?'<div class="form-group"><label>Token/API Key</label><input type="text" id="waToken" placeholder="Seu token" required></div>':''}
          <div class="form-actions"><button type="button" class="btn-outline" onclick="BZ.closeModal()">Cancelar</button><button type="submit" class="btn-primary">Conectar</button></div></form>
        </div>`);
      $('#waForm').onsubmit = e => {
        e.preventDefault();
        Store.connectWhatsApp(BZ.session.business.id, { method, phone:$('#waPhone').value, token: method==='token'?($('#waToken')?$('#waToken').value:''):'' });
        closeModal();
        toast('WhatsApp conectado com sucesso! ✅');
        finishOnboarding();
      };
    }
  }

  function saveStepData() {
    if (step === 1) Store.updateBusiness(s.business.id, { type: data.type });
    if (step === 2) data.services.forEach(svc => Store.addService({ businessId: s.business.id, ...svc }));
    if (step === 3) Store.updateBusiness(s.business.id, { workingHours: data.hours });
  }

  function finishOnboarding() {
    saveStepData();
    Store.updateUser(s.user.id, { onboardingComplete: true });
    BZ.session = Store.getSession();
    nav('dashboard');
  }

  render();
}
BZ.renderOnboarding = renderOnboarding;

// === APP SHELL ===
function renderAppShell(contentFn) {
  const s = BZ.session;
  const sub = s.subscription;
  const plan = Permissions.getEffectivePlan(sub);
  const trialDays = Permissions.getTrialDaysLeft(sub);
  const isTrial = sub && sub.status === 'trial' && trialDays > 0;
  const showCTA = Permissions.shouldShowUpgradeCTA(sub);
  const urgent = Permissions.shouldShowUrgentCTA(sub);
  const notifs = Store.getNotifications(s.user.id);
  const unread = notifs.filter(n => !n.read).length;
  const route = BZ.currentRoute;

  const navItems = [
    {r:'dashboard',icon:I.dashboard,label:'Dashboard'},
    {r:'agenda',icon:I.calendar,label:'Agenda'},
    {r:'clientes',icon:I.users,label:'Clientes'},
    {r:'whatsapp',icon:I.whatsapp,label:'WhatsApp'},
    {r:'automacoes',icon:I.zap,label:'Automações',pro:true},
    {r:'marketing',icon:I.megaphone,label:'Marketing',pro:true},
    {r:'assinatura',icon:I.creditCard,label:'Assinatura'},
    {r:'configuracoes',icon:I.settings,label:'Configurações'}
  ];

  let trialBar = '';
  if (isTrial) {
    if (urgent) trialBar = `<div class="trial-bar urgent">⚠️ Seu teste grátis expira em <strong>${trialDays} dia${trialDays>1?'s':''}</strong> — <a href="#assinatura">Assinar agora para não perder acesso</a></div>`;
    else if (showCTA) trialBar = `<div class="trial-bar cta">⚡ Faltam <strong>${trialDays} dias</strong> do seu teste Pro — <a href="#assinatura">Garanta seu plano</a></div>`;
    else trialBar = `<div class="trial-bar">✨ Você está testando o <strong>Plano Pro</strong> gratuitamente — ${trialDays} dias restantes</div>`;
  }

  $('#app').innerHTML = `${trialBar}
    <div class="app-layout"><aside class="sidebar" id="sidebar">
      <div class="sidebar-brand"><a href="index.html" class="logo"><span class="logo-icon">⚡</span><span>Beauty<span class="gold">Zap</span></span></a></div>
      <div class="sidebar-business"><div class="sb-avatar">${s.business.name?s.business.name[0]:'B'}</div><div class="sb-info"><strong>${s.business.name||'Meu Negócio'}</strong><span class="plan-badge">${plan.name.toUpperCase()}${isTrial?' TRIAL':''}</span></div></div>
      <nav class="sidebar-nav">${navItems.map(n=>`<a href="#${n.r}" class="nav-item ${route===n.r?'active':''} ${n.pro&&plan.id==='basic'?'locked':''}">${n.icon}<span>${n.label}</span>${n.pro&&plan.id==='basic'?'<span class="lock-icon">'+I.lock+'</span>':''}</a>`).join('')}</nav>
      <div class="sidebar-footer"><button class="nav-item" id="logoutBtn">${I.logout}<span>Sair</span></button></div>
    </aside>
    <main class="main-content"><header class="topbar"><button class="topbar-menu" id="sidebarToggle">${I.menu}</button><div class="topbar-right">
      <button class="topbar-icon" id="notifBtn">${I.bell}${unread>0?`<span class="notif-badge">${unread}</span>`:''}</button>
      <div class="topbar-user"><div class="user-avatar">${s.user.name[0]}</div><span class="user-name">${s.user.name.split(' ')[0]}</span></div>
    </div></header><div class="page-content" id="pageContent"></div></main></div>
    <div class="notif-panel" id="notifPanel"><div class="notif-header"><h3>Notificações</h3><button id="closeNotif">${I.x}</button></div><div class="notif-list">${notifs.length===0?'<p class="notif-empty">Nenhuma notificação</p>':notifs.map(n=>`<div class="notif-item ${n.read?'':'unread'}"><strong>${n.title}</strong><p>${n.message}</p></div>`).join('')}</div></div>
    <div class="modal-overlay" id="modalOverlay" style="display:none"></div>`;

  $('#logoutBtn').onclick = () => { Store.clearSession(); nav('login'); };
  $('#notifBtn').onclick = () => { const p=$('#notifPanel'); p.classList.toggle('open'); if(p.classList.contains('open')) notifs.forEach(n=>{if(!n.read)Store.markNotificationRead(n.id);}); };
  $('#closeNotif').onclick = () => $('#notifPanel').classList.remove('open');
  $('#sidebarToggle').onclick = () => $('#sidebar').classList.toggle('open');

  // Check plan access for locked routes
  const lockedRoutes = ['automacoes','marketing'];
  if (lockedRoutes.includes(route) && !Permissions.canAccess(sub, route)) {
    const labels = {automacoes:'Automações',marketing:'Marketing / Campanhas'};
    $('#pageContent').innerHTML = `<div class="locked-page"><div class="locked-content">${I.lock}<h2>Recurso bloqueado</h2><p><strong>${labels[route]}</strong> está disponível no Plano Pro.</p><p class="locked-sub">Faça upgrade para automatizar seu negócio e aumentar seu faturamento.</p><a href="#assinatura" class="btn-primary">Fazer Upgrade para Pro</a></div></div>`;
    return;
  }

  contentFn();
}
BZ.renderAppShell = renderAppShell;

// === ROUTER ===
let currentRoute = '';
BZ.currentRoute = '';
BZ.session = null;

function nav(route) { window.location.hash = route; }
BZ.nav = nav;

function handleRoute() {
  const route = window.location.hash.slice(1) || 'login';
  if (route === currentRoute) return;
  currentRoute = route;
  BZ.currentRoute = route;
  BZ.session = Store.getSession();

  const pub = ['login','register'];
  if (!pub.includes(route) && !BZ.session) { nav('login'); return; }
  if (pub.includes(route) && BZ.session) {
    if (!BZ.session.user.onboardingComplete) { nav('onboarding'); return; }
    nav('dashboard'); return;
  }
  if (route === 'onboarding') { renderOnboarding(); return; }
  if (!pub.includes(route) && BZ.session && !BZ.session.user.onboardingComplete && route !== 'onboarding') { nav('onboarding'); return; }

  const routes = { login:renderLogin, register:renderRegister, dashboard:BZ.renderDashboard, agenda:BZ.renderAgenda, clientes:BZ.renderClientes, automacoes:BZ.renderAutomacoes, marketing:BZ.renderMarketing, whatsapp:BZ.renderWhatsApp, assinatura:BZ.renderAssinatura, configuracoes:BZ.renderConfiguracoes };
  const fn = routes[route] || BZ.renderDashboard;
  if (pub.includes(route)) fn();
  else renderAppShell(fn);
}
BZ.handleRoute = handleRoute;
