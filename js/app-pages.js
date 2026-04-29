/* BeautyZap v2 — All Page Renderers */
(function(){
const I = BZ.I;

// === DASHBOARD ===
BZ.renderDashboard = function() {
  const s = BZ.session, stats = Store.getDashboardStats(s.business.id);
  const sub = s.subscription, plan = Permissions.getEffectivePlan(sub);
  const pc = $('#pageContent');
  const wa = Store.getWhatsApp(s.business.id);

  pc.innerHTML = `
    <div class="page-header"><div><h1>Dashboard</h1><p>Visão geral do seu negócio</p></div></div>
    ${!wa?`<div class="setup-banner"><span>📱</span><div><strong>Conecte seu WhatsApp</strong><p>Para enviar mensagens automáticas, conecte seu número.</p></div><a href="#whatsapp" class="btn-primary btn-sm">Conectar</a></div>`:''}
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon blue">${I.calendar}</div><div class="stat-info"><span class="stat-label">Agendamentos hoje</span><span class="stat-value">${stats.todayTotal}</span></div></div>
      <div class="stat-card"><div class="stat-icon green">${I.check}</div><div class="stat-info"><span class="stat-label">Confirmados</span><span class="stat-value">${stats.confirmed}</span></div></div>
      <div class="stat-card"><div class="stat-icon ${wa?'green':'red'}">${I.whatsapp}</div><div class="stat-info"><span class="stat-label">WhatsApp</span><span class="stat-value">${wa?'Conectado':'Desconectado'}</span></div></div>
      <div class="stat-card"><div class="stat-icon yellow">${I.users}</div><div class="stat-info"><span class="stat-label">Total clientes</span><span class="stat-value">${stats.totalClients}</span></div></div>
    </div>
    <div class="stats-grid" style="margin-top:-8px">
      <div class="stat-card"><div class="stat-icon blue">${I.send}</div><div class="stat-info"><span class="stat-label">Msgs enviadas (mês)</span><span class="stat-value">${stats.messagesSentMonth}</span></div></div>
      <div class="stat-card"><div class="stat-icon green">${I.check}</div><div class="stat-info"><span class="stat-label">Taxa de resposta</span><span class="stat-value">${stats.responseRate}%</span></div></div>
      <div class="stat-card"><div class="stat-icon yellow">${I.users}</div><div class="stat-info"><span class="stat-label">Clientes recuperados</span><span class="stat-value">${stats.clientsRecovered}</span></div></div>
      <div class="stat-card"><div class="stat-icon green">${I.calendar}</div><div class="stat-info"><span class="stat-label">Faltas evitadas</span><span class="stat-value">${stats.noShowsAvoided}</span></div></div>
    </div>
    <div class="dashboard-grid">
      <div class="card"><div class="card-header"><h3>Receita estimada (mês)</h3></div><div class="card-body"><div class="revenue-value">${fmt$(stats.revenue)}</div></div></div>
      <div class="card"><div class="card-header"><h3>Agendamentos (7 dias)</h3></div><div class="card-body"><div class="mini-chart">${stats.weekData.map(d=>`<div class="mc-col"><div class="mc-bar-wrap"><div class="mc-bar" style="height:${Math.max(8,(d.total/Math.max(...stats.weekData.map(x=>x.total),1))*100)}%"></div></div><span class="mc-label">${d.day}</span><span class="mc-value">${d.total}</span></div>`).join('')}</div></div></div>
    </div>
    <div class="card"><div class="card-header"><h3>Próximos horários</h3><a href="#agenda" class="card-link">Ver agenda →</a></div><div class="card-body">
      ${stats.nextAppointments.length===0?'<p class="empty-state">Nenhum agendamento para hoje.<br><a href="#agenda">Criar agendamento</a></p>':`<div class="appt-list">${stats.nextAppointments.map(a=>`<div class="appt-item"><span class="appt-time">${a.time}</span><div class="appt-info"><strong>${a.clientName}</strong><span>${a.service}</span></div><span class="status-badge status-${a.status}">${a.status==='confirmed'?'Confirmado':a.status==='pending'?'Pendente':'Cancelado'}</span></div>`).join('')}</div>`}
    </div></div>`;
};

// === WHATSAPP ===
BZ.renderWhatsApp = function() {
  const s = BZ.session, pc = $('#pageContent');
  const wa = Store.getWhatsApp(s.business.id);

  function render() {
    const conn = Store.getWhatsApp(s.business.id);
    pc.innerHTML = `
      <div class="page-header"><div><h1>WhatsApp</h1><p>Gerencie sua conexão WhatsApp Business</p></div></div>
      ${conn?`
        <div class="wa-status-card connected"><div class="wa-status-dot green"></div><div class="wa-info"><h3>Conectado</h3><p>Número: <strong>${conn.phone}</strong></p><p>Método: ${conn.method==='qrcode'?'QR Code':conn.method==='api'?'API Oficial':'Token Externo'}</p><p>Última sincronização: ${new Date(conn.lastSync).toLocaleString('pt-BR')}</p></div>
        <div class="action-btns"><button class="btn-primary btn-sm" id="testWa">Testar Envio</button><button class="btn-outline btn-danger btn-sm" id="disconnectWa">Desconectar</button></div></div>
      `:`
        <div class="wa-status-card disconnected"><div class="wa-status-dot red"></div><div><h3>Desconectado</h3><p>Conecte seu WhatsApp para enviar mensagens automáticas.</p></div></div>
        <h3 style="margin:24px 0 16px">Escolha como conectar</h3>
        <div class="wa-options-grid">
          <div class="wa-opt-card" id="waQr"><span class="wa-opt-icon">📱</span><h4>QR Code</h4><p>Escaneie com o WhatsApp do celular. Rápido e fácil.</p><button class="btn-primary btn-sm">Conectar</button></div>
          <div class="wa-opt-card" id="waApi"><span class="wa-opt-icon">🔗</span><h4>API Oficial (Meta)</h4><p>WhatsApp Business API oficial. Para empresas verificadas.</p><button class="btn-outline btn-sm">Configurar</button></div>
          <div class="wa-opt-card" id="waToken"><span class="wa-opt-icon">🔑</span><h4>Token / API Externa</h4><p>UltraMsg, Evolution API, Z-API.</p><button class="btn-outline btn-sm">Configurar</button></div>
        </div>`}`;

    if (conn) {
      $('#testWa').onclick = async () => {
        const phone = prompt('Digite o número para o teste (com DDD, ex: 11999999999):', conn.phone);
        if (phone) {
          BZ.toast('Enviando teste...');
          try {
             const result = await BZ.API.post('/messages/send', { phone, message: "Mensagem de Teste BeautyZap! 🚀🚀 Se chegou, a integração está funcionando perfeitamente.", apiUrl: conn.apiUrl, apiToken: conn.apiToken });
             if (result.success) BZ.toast('Teste enviado com sucesso! ✅');
             else BZ.toast('Erro no envio: ' + (result.error||'Desconhecido'), 'error');
          } catch(e) {
             BZ.toast('Falha ao conectar com servidor', 'error');
          }
        }
      };

      $('#disconnectWa').onclick = async () => { 
        if(confirm('Desconectar WhatsApp?')){ 
          const result = await BZ.API.post('/whatsapp/disconnect', { businessId: s.business.id });
          if(result.success) {
            Store.disconnectWhatsApp(s.business.id); 
            BZ.toast('WhatsApp desconectado', 'warning'); 
            render(); 
          } else {
             BZ.toast('Erro ao desconectar no backend', 'error');
          }
        }
       };
    } else {
      ['waQr','waApi','waToken'].forEach(id => {
        const el = $('#'+id);
        if(el) el.onclick = () => connectWa(id==='waQr'?'qrcode':id==='waApi'?'api':'token');
      });
    }
  }

  async function connectWa(method) {
    if (method === 'qrcode') {
      BZ.openModal(`<div class="modal-header"><h2>Leitor de QR Code</h2><button class="btn-icon" onclick="clearInterval(window.waPollTimer); BZ.closeModal()">${I.x}</button></div>
        <div class="qr-placeholder" id="qrContainer">
          <p style="margin-bottom: 16px;">Para usar o WhatsApp no BeautyZap:</p>
          <ol style="text-align: left; max-width: 250px; margin: 0 auto 24px; font-size: 0.85rem; color: var(--text-2);">
            <li>Abra o WhatsApp no seu celular</li>
            <li>Toque em <strong>Aparelhos conectados</strong></li>
            <li>Toque em <strong>Conectar um aparelho</strong></li>
            <li>Aponte seu celular para essa tela</li>
          </ol>
          <div style="background: var(--surface-2); padding: 16px; border-radius: 16px; display: inline-block; min-width:250px; min-height:250px; display:flex; align-items:center; justify-content:center;" id="qrImgBox">
            <span style="color:var(--gold);">Carregando QR Code do backend...</span>
          </div>
          <p id="qrWaitMsg" style="margin-top: 16px; font-size: 0.88rem; color: var(--gold);">Solicitando sessão real (${s.business.id})...</p>
        </div>`);

      // 1. Ask backend for session/QR
      const connData = await BZ.API.post('/whatsapp/connect', { businessId: s.business.id });
      
      if (connData.success && connData.data && connData.data.qrcode && connData.data.qrcode.base64) {
        document.getElementById('qrImgBox').innerHTML = `<img src="${connData.data.qrcode.base64}" alt="QR Code" style="border-radius: 8px; width: 250px; height: 250px;">`;
        document.getElementById('qrWaitMsg').innerHTML = `Aponte a câmera. Aguardando sincronização... <span id="pwdLoader">⏳</span>`;
        
        // 2. Poll Status
        window.waPollTimer = setInterval(async () => {
           const statData = await BZ.API.get('/whatsapp/status/' + s.business.id);
           if (statData.success && statData.status === 'connected') {
             clearInterval(window.waPollTimer);
             const qrC = $('#qrWaitMsg');
             if (qrC) {
                qrC.innerHTML = "✅ Conectado com sucesso! Redirecionando...";
                qrC.style.color = "var(--green)";
                setTimeout(() => {
                  Store.connectWhatsApp(s.business.id, { method: 'qrcode', phone: statData.data.instance?.owner || s.business.whatsapp || 'Desconhecido' });
                  BZ.closeModal();
                  BZ.toast('WhatsApp conectado via Backend! ✅');
                  render();
                }, 1500);
             }
           }
        }, 3000);
      } else {
        document.getElementById('qrImgBox').innerHTML = `<span style="color:var(--red);">Falha ao gerar QR Code. Tente novamente mais tarde.</span>`;
        document.getElementById('qrWaitMsg').innerHTML = `Erro Backend: Evolution API offline ou não configurada.`;
      }
    } else {
      BZ.openModal(`<div class="modal-header"><h2>Conectar WhatsApp</h2><button class="btn-icon" onclick="BZ.closeModal()">${I.x}</button></div>
        <form id="waConnForm" class="modal-form"><div class="form-group"><label>Número WhatsApp</label><input type="tel" id="waPhoneIn" placeholder="(11) 99999-9999" required></div>
        ${method==='token'?'<div class="form-group"><label>URL da API (Opcional)</label><input type="url" id="waUrlIn" placeholder="https://api.ultramsg..."></div><div class="form-group"><label>Token / API Key</label><input type="text" id="waTokenIn" placeholder="Seu token" required></div>':''}
        ${method==='api'?'<div class="form-group"><label>App ID (Meta)</label><input type="text" id="waAppId" placeholder="App ID"></div><div class="form-group"><label>Access Token</label><input type="text" id="waAccessToken" placeholder="Token"></div>':''}
        <div class="form-actions"><button type="button" class="btn-outline" onclick="BZ.closeModal()">Cancelar</button><button type="submit" class="btn-primary">Conectar</button></div></form>`);
      $('#waConnForm').onsubmit = e => { 
        e.preventDefault(); 
        const payload = { method, phone:$('#waPhoneIn').value };
        if(method==='token'){ payload.apiUrl=$('#waUrlIn')?.value; payload.apiToken=$('#waTokenIn')?.value; }
        Store.connectWhatsApp(s.business.id, payload); 
        BZ.closeModal(); BZ.toast('WhatsApp conectado! ✅'); render(); 
      };
    }
  }
  render();
};

// === AGENDA ===
BZ.renderAgenda = function() {
  const s = BZ.session; let vd = new Date();
  function render() {
    const ds = vd.toISOString().split('T')[0], appts = Store.getAppointments(s.business.id, ds);
    const dn=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'], mn=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const ws=new Date(vd); ws.setDate(ws.getDate()-ws.getDay()); const wd=[]; for(let i=0;i<7;i++){const d=new Date(ws);d.setDate(d.getDate()+i);wd.push(d);}
    const hrs=[]; for(let h=7;h<=20;h++){hrs.push(String(h).padStart(2,'0')+':00');hrs.push(String(h).padStart(2,'0')+':30');}

    $('#pageContent').innerHTML = `
      <div class="page-header"><div><h1>Agenda</h1><p>${['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'][vd.getDay()]}, ${vd.getDate()} de ${mn[vd.getMonth()]}</p></div><button class="btn-primary" id="newAppt">${I.plus} Novo Agendamento</button></div>
      <div class="agenda-nav"><button class="btn-icon" id="prev">${I.chevL}</button><button class="btn-today" id="todayB">Hoje</button><button class="btn-icon" id="next">${I.chevR}</button>
        <div class="week-pills">${wd.map(d=>`<button class="week-pill ${d.toISOString().split('T')[0]===ds?'active':''}" data-d="${d.toISOString().split('T')[0]}"><span class="wp-day">${dn[d.getDay()]}</span><span class="wp-num">${d.getDate()}</span></button>`).join('')}</div></div>
      <div class="agenda-timeline">${hrs.map(h=>{const ha=appts.filter(a=>a.time===h);return`<div class="timeline-row"><span class="timeline-hour">${h}</span><div class="timeline-slot">${ha.map(a=>`<div class="timeline-appt status-bg-${a.status}" data-id="${a.id}"><strong>${a.clientName}</strong><span>${a.service} — ${a.duration}min</span></div>`).join('')||'<div class="timeline-empty"></div>'}</div></div>`;}).join('')}</div>`;

    $('#prev').onclick=()=>{vd.setDate(vd.getDate()-1);render();};$('#next').onclick=()=>{vd.setDate(vd.getDate()+1);render();};$('#todayB').onclick=()=>{vd=new Date();render();};
    $$('.week-pill').forEach(p=>p.onclick=()=>{vd=new Date(p.dataset.d+'T12:00:00');render();});
    $('#newAppt').onclick=()=>openAppt(ds);
    $$('.timeline-appt').forEach(el=>el.onclick=()=>{const a=appts.find(x=>x.id===el.dataset.id);if(a)showAppt(a);});
  }

  function openAppt(date) {
    const clients = Store.getClients(s.business.id), svcs = Store.getServices(s.business.id);
    BZ.openModal(`<div class="modal-header"><h2>Novo Agendamento</h2><button class="btn-icon" onclick="BZ.closeModal()">${I.x}</button></div>
      <form id="aF" class="modal-form"><div class="form-group"><label>Cliente</label><select id="aC" required><option value="">Selecione...</option>${clients.map(c=>`<option value="${c.id}" data-n="${c.name}" data-p="${c.phone}">${c.name}</option>`).join('')}</select></div>
      <div class="form-row"><div class="form-group"><label>Data</label><input type="date" id="aD" value="${date}" required></div><div class="form-group"><label>Horário</label><input type="time" id="aT" required></div></div>
      <div class="form-row"><div class="form-group"><label>Serviço</label><select id="aS">${svcs.length>0?svcs.map(s=>`<option value="${s.name}" data-dur="${s.duration}" data-price="${s.price}">${s.name}</option>`).join(''):'<option value="">Nenhum cadastrado</option>'}</select></div><div class="form-group"><label>Duração (min)</label><input type="number" id="aDur" value="60" min="15" step="15"></div></div>
      <div class="form-group"><label>Preço</label><input type="number" id="aP" step="0.01"></div>
      <div class="form-actions"><button type="button" class="btn-outline" onclick="BZ.closeModal()">Cancelar</button><button type="submit" class="btn-primary">Salvar</button></div></form>`);
    const aSel=$('#aS'); if(aSel) aSel.onchange=()=>{const o=aSel.options[aSel.selectedIndex]; if(o.dataset.dur)$('#aDur').value=o.dataset.dur; if(o.dataset.price)$('#aP').value=o.dataset.price;};
    if(aSel&&aSel.options.length>0){const o=aSel.options[aSel.selectedIndex>0?aSel.selectedIndex:0];if(o&&o.dataset.dur){$('#aDur').value=o.dataset.dur;$('#aP').value=o.dataset.price;}}
    $('#aF').onsubmit=async e=>{
      e.preventDefault();
      const sel=$('#aC'),o=sel.options[sel.selectedIndex];
      const clientPhone=o.dataset.p, clientName=o.dataset.n;
      const apptDate=$('#aD').value, apptTime=$('#aT').value, serviceName=$('#aS')?$('#aS').value:'';
      
      const appt = Store.createAppointment({businessId:s.business.id,clientId:sel.value,clientName,clientPhone,service:serviceName,date:apptDate,time:apptTime,duration:parseInt($('#aDur').value),price:parseFloat($('#aP').value)||0,status:'confirmed'});
      BZ.closeModal(); BZ.toast('Agendamento criado!'); render();

      // Disparo automático de mensagens (MVP)
      const wa = Store.getWhatsApp(s.business.id);
      const confAuto = Store.getAutomations(s.business.id).find(a => a.trigger === 'new_appointment');
      const rem2h = Store.getAutomations(s.business.id).find(a => a.trigger === '2h_before');

      // Se WhatsApp estiver conectado (ou usando global default) e automação ativa
      if (confAuto && confAuto.active) {
         let msg = confAuto.message.replace('{nome}', clientName).replace('{data}', fmtDate(apptDate)).replace('{hora}', apptTime).replace('{servico}', serviceName);
         BZ.API.post('/messages/send', { phone: clientPhone, message: msg, apiUrl: wa?.apiUrl, apiToken: wa?.apiToken }).then(r => {
            if(r.success) {
               BZ.toast('Confirmação enviada! 📱');
               Store.logMessage({ businessId: s.business.id, clientId: sel.value, clientName, phone: clientPhone, message: msg, type: 'automation', campaignId: confAuto.id, status: 'sent' });
            } else {
               BZ.toast('Erro no envio: ' + (r.error||'Desconhecido'), 'error');
               Store.logMessage({ businessId: s.business.id, clientId: sel.value, clientName, phone: clientPhone, message: msg, type: 'automation', campaignId: confAuto.id, status: 'failed' });
            }
         }).catch(err => {
            BZ.toast('Falha ao conectar com servidor de WhatsApp', 'error');
            Store.logMessage({ businessId: s.business.id, clientId: sel.value, clientName, phone: clientPhone, message: msg, type: 'automation', campaignId: confAuto.id, status: 'failed' });
         });
      }

      if (rem2h && rem2h.active) {
         let rmsg = rem2h.message.replace('{nome}', clientName).replace('{data}', fmtDate(apptDate)).replace('{hora}', apptTime).replace('{servico}', serviceName);
         const targetDate = new Date(`${apptDate}T${apptTime}:00`);
         targetDate.setHours(targetDate.getHours() - 2); // 2h antes
         
         BZ.API.post('/messages/schedule', { phone: clientPhone, message: rmsg, targetTimeISO: targetDate.toISOString(), apiUrl: wa?.apiUrl, apiToken: wa?.apiToken }).then(r => {
             if(r.success && r.scheduled) console.log('Lembrete agendado para 2h antes.');
         });
      }
    };
  }

  function showAppt(a) {
    BZ.openModal(`<div class="modal-header"><h2>Detalhes</h2><button class="btn-icon" onclick="BZ.closeModal()">${I.x}</button></div>
      <div class="detail-grid"><div class="detail-item"><span>Cliente</span><strong>${a.clientName}</strong></div><div class="detail-item"><span>Serviço</span><strong>${a.service}</strong></div><div class="detail-item"><span>Data</span><strong>${fmtDate(a.date)}</strong></div><div class="detail-item"><span>Horário</span><strong>${a.time}</strong></div><div class="detail-item"><span>Valor</span><strong>${fmt$(a.price)}</strong></div><div class="detail-item"><span>Status</span><span class="status-badge status-${a.status}">${{confirmed:'Confirmado',pending:'Pendente',cancelled:'Cancelado',completed:'Concluído'}[a.status]}</span></div></div>
      <div class="form-actions" style="margin-top:24px">${a.status!=='cancelled'?`<button class="btn-outline btn-danger" id="cxA">Cancelar</button>`:''} ${a.status==='pending'?`<button class="btn-primary" id="cfA">Confirmar</button>`:''}</div>`);
    if($('#cxA'))$('#cxA').onclick=()=>{Store.updateAppointment(a.id,{status:'cancelled'});BZ.closeModal();BZ.toast('Cancelado','warning');render();};
    if($('#cfA'))$('#cfA').onclick=()=>{Store.updateAppointment(a.id,{status:'confirmed'});BZ.closeModal();BZ.toast('Confirmado!');render();};
  }
  render();
};

// === CLIENTES ===
BZ.renderClientes = function() {
  const s = BZ.session; let filter='all',search='';
  function render() {
    let cl = Store.getClients(s.business.id);
    if(filter==='active')cl=cl.filter(c=>c.status==='active'); if(filter==='inactive')cl=cl.filter(c=>c.status==='inactive');
    if(search)cl=cl.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.phone.includes(search));
    const limit = Permissions.getClientLimit(s.subscription), atLimit = cl.length >= limit && limit !== Infinity;

    $('#pageContent').innerHTML = `
      <div class="page-header"><div><h1>Clientes</h1><p>${cl.length} cliente${cl.length!==1?'s':''}</p></div><button class="btn-primary" id="newCl" ${atLimit?'disabled':''}>${I.plus} Novo Cliente</button></div>
      ${atLimit?`<div class="limit-banner">⚠️ Você atingiu o limite de ${limit} clientes do Plano Basic. <a href="#assinatura">Fazer upgrade</a></div>`:''}
      <div class="filters-bar"><div class="search-box">${I.search}<input type="text" id="clSearch" placeholder="Buscar..." value="${search}"></div>
      <div class="filter-pills"><button class="filter-pill ${filter==='all'?'active':''}" data-f="all">Todos</button><button class="filter-pill ${filter==='active'?'active':''}" data-f="active">Ativos</button><button class="filter-pill ${filter==='inactive'?'active':''}" data-f="inactive">Inativos</button></div></div>
      <div class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>Nome</th><th>Telefone</th><th>Último Atend.</th><th>Serviço</th><th>Visitas</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>${cl.length===0?`<tr><td colspan="7" class="empty-state">Nenhum cliente cadastrado ainda.<br>Clique em "Novo Cliente" para começar.</td></tr>`:cl.map(c=>`<tr><td><strong>${c.name}</strong></td><td>${c.phone}</td><td>${fmtDate(c.lastVisit)}</td><td>${c.lastService||'—'}</td><td>${c.visits}</td><td><span class="status-badge status-${c.status==='active'?'confirmed':'cancelled'}">${c.status==='active'?'Ativo':'Inativo'}</span></td><td><div class="action-btns"><button class="btn-icon-sm ec" data-id="${c.id}">${I.edit}</button><button class="btn-icon-sm dc" data-id="${c.id}">${I.trash}</button></div></td></tr>`).join('')}</tbody></table></div></div>`;

    $('#clSearch').oninput=e=>{search=e.target.value;render();}; $$('.filter-pill').forEach(p=>p.onclick=()=>{filter=p.dataset.f;render();});
    if(!atLimit)$('#newCl').onclick=()=>editClient();
    $$('.ec').forEach(b=>b.onclick=()=>{const c=Store.getClient(b.dataset.id);if(c)editClient(c);});
    $$('.dc').forEach(b=>b.onclick=()=>{if(confirm('Excluir?')){Store.deleteClient(b.dataset.id);BZ.toast('Excluído','warning');render();}});
  }

  function editClient(c) {
    const e=!!c;
    BZ.openModal(`<div class="modal-header"><h2>${e?'Editar':'Novo'} Cliente</h2><button class="btn-icon" onclick="BZ.closeModal()">${I.x}</button></div>
      <form id="cF" class="modal-form"><div class="form-group"><label>Nome</label><input type="text" id="cN" value="${e?c.name:''}" required></div>
      <div class="form-row"><div class="form-group"><label>Telefone</label><input type="tel" id="cP" value="${e?c.phone:''}" required></div><div class="form-group"><label>E-mail</label><input type="email" id="cE" value="${e?(c.email||''):''}"></div></div>
      <div class="form-group"><label>Nascimento</label><input type="date" id="cB" value="${e?(c.birthday||''):''}"></div>
      <div class="form-group"><label>Observações</label><textarea id="cO" rows="2">${e?(c.notes||''):''}</textarea></div>
      <div class="form-actions"><button type="button" class="btn-outline" onclick="BZ.closeModal()">Cancelar</button><button type="submit" class="btn-primary">${e?'Salvar':'Cadastrar'}</button></div></form>`);
    $('#cF').onsubmit=ev=>{ev.preventDefault();const d={name:$('#cN').value,phone:$('#cP').value,email:$('#cE').value,birthday:$('#cB').value,notes:$('#cO').value};if(e){Store.updateClient(c.id,d);BZ.toast('Atualizado!');}else{d.businessId=s.business.id;Store.createClient(d);BZ.toast('Cadastrado!');}BZ.closeModal();render();};
  }
  render();
};

// === AUTOMACOES ===
BZ.renderAutomacoes = function() {
  const s = BZ.session, autos = Store.getAutomations(s.business.id), wa = Store.getWhatsApp(s.business.id);
  const iconMap={'check-circle':I.check,'bell':I.bell,'clock':I.calendar,'heart':'❤️','star':'⭐','user-x':'👻','user-minus':'😢','cake':'🎂'};

  $('#pageContent').innerHTML = `
    <div class="page-header"><div><h1>Automações</h1><p>Gatilhos automáticos de WhatsApp</p></div></div>
    ${!wa?'<div class="setup-banner warn"><span>⚠️</span><div><strong>WhatsApp não conectado</strong><p>Conecte para que as automações funcionem.</p></div><a href="#whatsapp" class="btn-outline btn-sm">Conectar</a></div>':''}
    <div class="automations-grid">${autos.map(a=>`
      <div class="automation-card ${a.active?'active':''}"><div class="auto-header"><span class="auto-icon">${iconMap[a.icon]||'⚡'}</span><div class="auto-toggle"><label class="toggle"><input type="checkbox" ${a.active?'checked':''} data-id="${a.id}" ${!wa?'disabled':''}><span class="toggle-slider"></span></label></div></div>
      <h3>${a.name}</h3><p class="auto-desc">${a.description}</p><p class="auto-trigger">Gatilho: <strong>${a.trigger}</strong></p>
      <div class="auto-preview"><span class="preview-label">Preview:</span><div class="message-bubble">${a.message.replace(/\n/g,'<br>')}</div></div></div>`).join('')}</div>`;

  $$('.toggle input').forEach(t=>t.onchange=()=>{Store.updateAutomation(t.dataset.id,{active:t.checked});t.closest('.automation-card').classList.toggle('active',t.checked);BZ.toast(t.checked?'Ativada!':'Desativada','success');});
};

// === MARKETING ===
BZ.renderMarketing = function() {
  const s = BZ.session, wa = Store.getWhatsApp(s.business.id);
  const limit = Permissions.getDispatchLimit(s.subscription), used = Store.getDispatchesUsed(s.business.id);

  function render() {
    const camps = Store.getCampaigns(s.business.id);
    $('#pageContent').innerHTML = `
      <div class="page-header"><div><h1>Marketing</h1><p>Campanhas de WhatsApp</p></div><button class="btn-primary" id="newCamp">${I.plus} Nova Campanha</button></div>
      ${!wa?'<div class="setup-banner warn"><span>⚠️</span><div><strong>WhatsApp não conectado</strong><p>Conecte para enviar campanhas.</p></div><a href="#whatsapp" class="btn-outline btn-sm">Conectar</a></div>':''}
      <div class="dispatch-meter"><div class="dm-info"><span>Disparos este mês</span><strong>${used} / ${limit===Infinity?'∞':limit}</strong></div><div class="dm-bar"><div class="dm-fill" style="width:${limit===Infinity?5:Math.min(100,(used/limit)*100)}%"></div></div></div>
      ${camps.length===0?'<div class="empty-state-card"><h3>Nenhuma campanha ainda</h3><p>Crie sua primeira campanha para engajar seus clientes.</p></div>':
      `<div class="campaigns-grid">${camps.map(c=>`
        <div class="campaign-card"><div class="camp-header"><h3>${c.name}</h3><span class="status-badge status-${c.status==='sent'?'confirmed':'pending'}">${c.status==='sent'?'Enviada':'Rascunho'}</span></div>
        <div class="message-bubble camp-preview">${c.message.replace(/\n/g,'<br>')}</div>
        <div class="camp-meta"><span>Público: ${c.targetAudience==='all'?'Todos':c.targetAudience==='active'?'Ativos':'Inativos'}</span></div>
        ${c.status==='sent'?`<div class="camp-report"><div class="cr-item"><span class="cr-num">${c.sentCount}</span><span>Enviadas</span></div><div class="cr-item green"><span class="cr-num">${c.deliveredCount}</span><span>Entregues</span></div><div class="cr-item blue"><span class="cr-num">${c.readCount}</span><span>Lidas</span></div><div class="cr-item red"><span class="cr-num">${c.failedCount}</span><span>Falhas</span></div></div>`:''}
        <div class="camp-actions">${c.status!=='sent'?`<button class="btn-outline btn-sm sc" data-id="${c.id}" ${!wa?'disabled':''}>${I.send} Enviar</button>`:''}<button class="btn-icon-sm dcamp" data-id="${c.id}">${I.trash}</button></div></div>`).join('')}</div>`}`;

    $('#newCamp').onclick=()=>{
      BZ.openModal(`<div class="modal-header"><h2>Nova Campanha</h2><button class="btn-icon" onclick="BZ.closeModal()">${I.x}</button></div>
        <form id="campF" class="modal-form"><div class="form-group"><label>Nome</label><input type="text" id="cpN" required></div><div class="form-group"><label>Mensagem</label><textarea id="cpM" rows="5" required></textarea></div>
        <div class="form-group"><label>Público</label><select id="cpT"><option value="all">Todos</option><option value="active">Ativos</option><option value="inactive">Inativos</option></select></div>
        <div class="form-actions"><button type="button" class="btn-outline" onclick="BZ.closeModal()">Cancelar</button><button type="submit" class="btn-primary">Criar</button></div></form>`);
      $('#campF').onsubmit=e=>{e.preventDefault();Store.createCampaign({businessId:s.business.id,name:$('#cpN').value,message:$('#cpM').value,targetAudience:$('#cpT').value});BZ.closeModal();BZ.toast('Campanha criada!');render();};
    };
    $$('.sc').forEach(b=>b.onclick=()=>{const r=Store.sendCampaign(b.dataset.id);if(r)BZ.toast(`Enviada para ${r.sentCount} clientes! 📩`);render();});
    $$('.dcamp').forEach(b=>b.onclick=()=>{Store.deleteCampaign(b.dataset.id);BZ.toast('Excluída','warning');render();});
  }
  render();
};

// === ASSINATURA ===
BZ.renderAssinatura = function() {
  const s = BZ.session, sub = s.subscription, plans = Store.getPlans();
  const plan = Permissions.getEffectivePlan(sub), trialDays = Permissions.getTrialDaysLeft(sub);

  $('#pageContent').innerHTML = `
    <div class="page-header"><div><h1>Assinatura</h1><p>Gerencie seu plano</p></div></div>
    ${trialDays>0?`<div class="trial-info-card"><span class="trial-icon">⏳</span><div><strong>Teste grátis do Plano Pro</strong><p>Você tem <strong>${trialDays} dias</strong> restantes. Assine para não perder acesso às automações e campanhas.</p></div></div>`:''}
    ${sub.status==='expired'?`<div class="trial-info-card expired"><span class="trial-icon">⚠️</span><div><strong>Seu teste expirou</strong><p>Você foi movido para o Plano Basic. Seus dados estão salvos. Faça upgrade para recuperar acesso total.</p></div></div>`:''}
    <div class="current-plan-card"><div class="cp-info"><span class="cp-label">Plano atual</span><h2>${plan.name}</h2><span class="cp-status ${sub.status==='trial'?'trial':sub.status==='active'?'active':'expired'}">${sub.status==='trial'?'Trial':sub.status==='active'?'Ativo':'Expirado'}</span></div><div class="cp-price">${fmt$(plan.price)}/mês</div></div>
    <h3 style="margin:32px 0 16px">Escolha seu plano</h3>
    <div class="plans-grid-app">${plans.map(p=>`
      <div class="plan-card-app ${p.id===plan.id?'current':''} ${p.popular?'popular':''}">
        ${p.popular?'<span class="pop-badge">Mais vendido</span>':''}
        <h3>${p.name}</h3><div class="plan-price-app"><span class="pp-val">${fmt$(p.price)}</span><span>/mês</span></div>
        <ul>${p.features.map(f=>'<li>'+I.check+' '+f+'</li>').join('')}</ul>
        <button class="btn-primary btn-block planSel" data-p="${p.id}" ${p.id===plan.id&&sub.status==='active'?'disabled':''}>${p.id===plan.id&&sub.status==='active'?'Plano atual':'Assinar '+p.name}</button></div>`).join('')}</div>
    <div class="cancel-section"><button class="btn-text" id="cancelSub">Cancelar assinatura</button></div>`;

  $$('.planSel').forEach(b=>b.onclick=()=>{Store.updateSubscription(sub.id,{planId:b.dataset.p,status:'active'});BZ.toast('Plano atualizado! 🎉');BZ.session=Store.getSession();BZ.renderAppShell(BZ.renderAssinatura);});
  $('#cancelSub').onclick=()=>{
    BZ.openModal(`<div class="modal-header"><h2>Tem certeza?</h2><button class="btn-icon" onclick="BZ.closeModal()">${I.x}</button></div>
      <div class="cancel-content"><p class="cancel-msg">Sentiremos sua falta! 😢</p><p>Ao cancelar você perderá:</p><ul class="cancel-list"><li>Automações de WhatsApp</li><li>Campanhas de marketing</li><li>Recuperação de clientes</li></ul>
      <div class="cancel-offer"><strong>Última chance!</strong><p>50% de desconto nos próximos 3 meses?</p><button class="btn-primary btn-block" id="accOff">Aceitar oferta</button></div>
      <div class="form-actions"><button class="btn-outline btn-danger" id="confCx">Cancelar mesmo assim</button><button class="btn-primary" onclick="BZ.closeModal()">Manter</button></div></div>`);
    $('#accOff').onclick=()=>{BZ.closeModal();BZ.toast('Desconto aplicado! 💖');};
    $('#confCx').onclick=()=>{Store.updateSubscription(sub.id,{status:'cancelled',planId:'basic'});BZ.closeModal();BZ.toast('Cancelada.','warning');BZ.session=Store.getSession();BZ.renderAppShell(BZ.renderAssinatura);};
  };
};

// === CONFIGURACOES ===
BZ.renderConfiguracoes = function() {
  const s = BZ.session, b = s.business;
  const days={mon:'Segunda',tue:'Terça',wed:'Quarta',thu:'Quinta',fri:'Sexta',sat:'Sábado',sun:'Domingo'};

  $('#pageContent').innerHTML = `
    <div class="page-header"><div><h1>Configurações</h1><p>Configure seu negócio</p></div></div>
    <div class="settings-grid">
      <div class="card"><div class="card-header"><h3>Dados do Negócio</h3></div><div class="card-body"><form id="bizForm" class="settings-form">
        <div class="form-group"><label>Nome</label><input type="text" id="sN" value="${b.name}"></div>
        <div class="form-row"><div class="form-group"><label>WhatsApp</label><input type="tel" id="sW" value="${b.whatsapp||''}"></div><div class="form-group"><label>Telefone</label><input type="tel" id="sP" value="${b.phone||''}"></div></div>
        <div class="form-group"><label>Endereço</label><input type="text" id="sA" value="${b.address||''}"></div>
        <button type="submit" class="btn-primary">Salvar</button></form></div></div>
      <div class="card"><div class="card-header"><h3>Horários</h3></div><div class="card-body">
        <div class="hours-grid">${Object.entries(days).map(([k,v])=>{const h=b.workingHours[k];return`<div class="hour-row"><label class="toggle-sm"><input type="checkbox" ${h.active?'checked':''} data-day="${k}" class="dt"><span class="toggle-slider-sm"></span></label><span class="hour-day">${v}</span><input type="time" value="${h.start}" class="h-start" data-day="${k}" ${!h.active?'disabled':''}><span>até</span><input type="time" value="${h.end}" class="h-end" data-day="${k}" ${!h.active?'disabled':''}>`;}).join('')}</div>
        <button class="btn-primary" id="saveH" style="margin-top:16px">Salvar Horários</button></div></div>
      <div class="card"><div class="card-header"><h3>Serviços</h3></div><div class="card-body">
        <div id="svcListCfg">${Store.getServices(b.id).map(s=>`<div class="svc-item"><span>${s.name}</span><span>${s.duration}min</span><span>${fmt$(s.price)}</span><button class="btn-icon-sm delSvc" data-id="${s.id}">${I.trash}</button></div>`).join('')||'<p class="empty-state">Nenhum serviço.</p>'}</div>
        <form id="addSvcCfg" class="svc-form" style="margin-top:12px"><input type="text" id="svcN2" placeholder="Serviço" required><input type="number" id="svcD2" placeholder="Min" value="60"><input type="number" id="svcP2" placeholder="Preço" step="0.01"><button type="submit" class="btn-outline btn-sm">${I.plus}</button></form></div></div>
    </div>`;

  $('#bizForm').onsubmit=e=>{e.preventDefault();Store.updateBusiness(b.id,{name:$('#sN').value,whatsapp:$('#sW').value,phone:$('#sP').value,address:$('#sA').value});BZ.toast('Salvo!');BZ.session=Store.getSession();};
  $$('.dt').forEach(t=>t.onchange=()=>{t.closest('.hour-row').querySelectorAll('input[type=time]').forEach(i=>i.disabled=!t.checked);});
  $('#saveH').onclick=()=>{const h={};Object.keys(b.workingHours).forEach(d=>{const t=$(`.dt[data-day="${d}"]`);h[d]={active:t.checked,start:$(`.h-start[data-day="${d}"]`).value,end:$(`.h-end[data-day="${d}"]`).value};});Store.updateBusiness(b.id,{workingHours:h});BZ.toast('Horários salvos!');};
  $('#addSvcCfg').onsubmit=e=>{e.preventDefault();Store.addService({businessId:b.id,name:$('#svcN2').value,duration:parseInt($('#svcD2').value)||60,price:parseFloat($('#svcP2').value)||0});BZ.toast('Serviço adicionado!');BZ.renderAppShell(BZ.renderConfiguracoes);};
  $$('.delSvc').forEach(b=>b.onclick=()=>{Store.deleteService(b.dataset.id);BZ.toast('Removido','warning');BZ.renderAppShell(BZ.renderConfiguracoes);});
};
})();
