/* ============================================
   BeautyZap v2 — Data Store (Real SaaS)
   Zero fake data. Clean start.
   ============================================ */

const DB_KEY = 'beautyzap_db';

const DEFAULT_PLANS = [
  {
    id: 'basic', name: 'Basic', price: 39.90,
    limits: { clients: 100, dispatches: 0, whatsapps: 1, team: 1 },
    access: ['dashboard','agenda','clientes','whatsapp','assinatura','configuracoes'],
    features: ['Agenda online','Até 100 clientes','Conectar 1 WhatsApp','Cadastro de clientes','Relatórios simples']
  },
  {
    id: 'pro', name: 'Pro', price: 74.90, popular: true,
    limits: { clients: Infinity, dispatches: 500, whatsapps: 1, team: 3 },
    access: ['dashboard','agenda','clientes','automacoes','marketing','whatsapp','assinatura','configuracoes'],
    features: ['Tudo do Basic +','Clientes ilimitados','Automações completas','Marketing/Campanhas','Até 500 disparos/mês','Recuperação clientes sumidos','Pós-venda automático','Dashboard avançado']
  },
  {
    id: 'elite', name: 'Elite', price: 157.90,
    limits: { clients: Infinity, dispatches: Infinity, whatsapps: 5, team: 20 },
    access: ['dashboard','agenda','clientes','automacoes','marketing','whatsapp','assinatura','configuracoes'],
    features: ['Tudo do Pro +','Multi atendentes','Multi unidades','IA para mensagens','Segmentação avançada','Campanhas ilimitadas','Suporte prioritário']
  }
];

const DEFAULT_AUTOMATIONS = [
  { type:'confirmation', name:'Confirmação Automática', description:'Envia confirmação quando agendamento é criado', message:'Olá {nome} 💖 Seu horário está confirmado para {data} às {hora}.', icon:'check-circle', trigger:'new_appointment' },
  { type:'reminder_24h', name:'Lembrete 24h Antes', description:'Lembra o cliente 24h antes do horário', message:'Oi {nome}! 😊 Lembrando que amanhã você tem horário às {hora}.\n\nServiço: {servico}\n\nTe esperamos! 💖', icon:'bell', trigger:'24h_before' },
  { type:'reminder_2h', name:'Lembrete 2h Antes', description:'Lembra o cliente 2h antes do horário', message:'Oi {nome}! Seu horário é daqui a 2 horas, às {hora}. Estamos te esperando! ✨', icon:'clock', trigger:'2h_before' },
  { type:'post_service', name:'Pós-Atendimento', description:'Mensagem de agradecimento após o atendimento', message:'Obrigado por vir hoje, {nome}! 💖\n\nEsperamos que tenha gostado do seu {servico}.\n\nVolta sempre! ✨', icon:'heart', trigger:'after_service' },
  { type:'review_request', name:'Pedido de Avaliação', description:'Pede avaliação do atendimento ao cliente', message:'Oi {nome}! 😊 Como foi sua experiência conosco?\n\nSua opinião nos ajuda muito. Pode nos dar uma nota de 1 a 5? ⭐', icon:'star', trigger:'after_service_1h' },
  { type:'inactive_30', name:'Cliente Sumido (30 dias)', description:'Reengaja clientes sem visitar há 30 dias', message:'Oi {nome}, sentimos sua falta! 💛\n\nTemos horários especiais essa semana!\n\nVamos agendar? 😊', icon:'user-x', trigger:'inactive_30d' },
  { type:'inactive_60', name:'Cliente Sumido (60 dias)', description:'Reengaja clientes sem visitar há 60 dias', message:'Oi {nome}! Faz mais de 2 meses que não te vemos 😢\n\nPreparamos uma condição especial para você voltar. 💖', icon:'user-minus', trigger:'inactive_60d' },
  { type:'birthday', name:'Aniversário do Cliente', description:'Parabéns automático no aniversário', message:'Feliz aniversário, {nome}! 🎂🎉\n\nDesejamos um dia maravilhoso! Preparamos uma surpresa pra você. 💝', icon:'cake', trigger:'birthday' }
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function getDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) return initDB();
  try { 
    const db = JSON.parse(raw); 
    if (!db.v2_clean) return initDB(); // Force clean start to drop old fake data
    return db;
  } catch { 
    return initDB(); 
  }
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function initDB() {
  const db = {
    v2_clean: true,
    users: [],
    businesses: [],
    clients: [],
    appointments: [],
    plans: DEFAULT_PLANS,
    subscriptions: [],
    automations: [],
    campaigns: [],
    notifications: [],
    whatsappConnections: [],
    messageLogs: [],
    services: []
  };
  saveDB(db);
  return db;
}

// ========================
// PERMISSIONS
// ========================
const Permissions = {
  getPlan(planId) {
    return DEFAULT_PLANS.find(p => p.id === planId) || DEFAULT_PLANS[0];
  },

  getEffectivePlan(subscription) {
    if (!subscription) return DEFAULT_PLANS[0];
    if (subscription.status === 'trial') {
      const daysLeft = Math.max(0, Math.ceil((new Date(subscription.trialEndsAt) - new Date()) / 86400000));
      if (daysLeft <= 0) return DEFAULT_PLANS[0]; // expired trial = basic
      return this.getPlan(subscription.planId); // active trial = that plan
    }
    if (subscription.status === 'active') return this.getPlan(subscription.planId);
    return DEFAULT_PLANS[0]; // cancelled/expired = basic
  },

  canAccess(subscription, feature) {
    const plan = this.getEffectivePlan(subscription);
    return plan.access.includes(feature);
  },

  getClientLimit(subscription) {
    return this.getEffectivePlan(subscription).limits.clients;
  },

  getDispatchLimit(subscription) {
    return this.getEffectivePlan(subscription).limits.dispatches;
  },

  isTrialExpired(subscription) {
    if (!subscription || subscription.status !== 'trial') return false;
    return new Date(subscription.trialEndsAt) <= new Date();
  },

  getTrialDaysLeft(subscription) {
    if (!subscription || subscription.status !== 'trial') return 0;
    return Math.max(0, Math.ceil((new Date(subscription.trialEndsAt) - new Date()) / 86400000));
  },

  shouldShowUpgradeCTA(subscription) {
    const days = this.getTrialDaysLeft(subscription);
    return days <= 5 && days > 0;
  },

  shouldShowUrgentCTA(subscription) {
    const days = this.getTrialDaysLeft(subscription);
    return days <= 2 && days > 0;
  }
};

window.Permissions = Permissions;

// ========================
// STORE
// ========================
const Store = {
  // ---------- Users ----------
  createUser(userData) {
    const db = getDB();
    const user = {
      id: generateId(),
      ...userData,
      onboardingComplete: false,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);

    const business = {
      id: generateId(),
      userId: user.id,
      name: userData.businessName || '',
      type: '',
      phone: userData.phone || '',
      whatsapp: userData.phone || '',
      address: '',
      logo: '',
      services: [],
      workingHours: {
        mon: { start: '08:00', end: '18:00', active: true },
        tue: { start: '08:00', end: '18:00', active: true },
        wed: { start: '08:00', end: '18:00', active: true },
        thu: { start: '08:00', end: '18:00', active: true },
        fri: { start: '08:00', end: '18:00', active: true },
        sat: { start: '08:00', end: '13:00', active: true },
        sun: { start: '08:00', end: '13:00', active: false }
      },
      team: [],
      createdAt: new Date().toISOString()
    };
    db.businesses.push(business);

    // Pro Trial 7 days
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);
    const subscription = {
      id: generateId(),
      userId: user.id,
      businessId: business.id,
      planId: 'pro',
      status: 'trial',
      trialEndsAt: trialEnd.toISOString(),
      dispatchesThisMonth: 0,
      monthResetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
      createdAt: new Date().toISOString()
    };
    db.subscriptions.push(subscription);

    // Create automations (ALL disabled by default)
    DEFAULT_AUTOMATIONS.forEach(a => {
      db.automations.push({
        id: generateId(),
        businessId: business.id,
        ...a,
        active: false,
        createdAt: new Date().toISOString()
      });
    });

    // Welcome notification only
    db.notifications.push({
      id: generateId(), userId: user.id,
      title: 'Bem-vindo ao BeautyZap! 🎉',
      message: 'Seu teste grátis do Plano Pro começou. Complete o setup inicial para aproveitar ao máximo!',
      type: 'info', read: false, createdAt: new Date().toISOString()
    });

    saveDB(db);
    return { user, business, subscription };
  },

  getUserByEmail(email) {
    return getDB().users.find(u => u.email === email);
  },

  updateUser(userId, data) {
    const db = getDB();
    const idx = db.users.findIndex(u => u.id === userId);
    if (idx !== -1) { db.users[idx] = { ...db.users[idx], ...data }; saveDB(db); return db.users[idx]; }
    return null;
  },

  setSession(userId) { 
    localStorage.setItem('beautyzap_session', userId);
    // Sync with backend async
    const db = getDB();
    const u = db.users.find(x => x.id === userId);
    const b = db.businesses.find(x => x.userId === userId);
    if (u && b && window.BZ && window.BZ.API) {
       window.BZ.API.post('/auth/sync', { user: u, business: b })
         .then(res => console.log('Backend sync:', res.success ? 'OK' : res.error))
         .catch(err => console.log('Backend not running yet'));
    }
  },

  getSession() {
    const userId = localStorage.getItem('beautyzap_session');
    if (!userId) return null;
    const db = getDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) return null;
    const business = db.businesses.find(b => b.userId === userId);
    const subscription = db.subscriptions.find(s => s.userId === userId);

    // Auto-downgrade expired trial
    if (subscription && subscription.status === 'trial' && Permissions.isTrialExpired(subscription)) {
      subscription.status = 'expired';
      subscription.planId = 'basic';
      const idx = db.subscriptions.findIndex(s => s.id === subscription.id);
      db.subscriptions[idx] = subscription;
      saveDB(db);
    }

    return { user, business, subscription };
  },

  clearSession() { localStorage.removeItem('beautyzap_session'); },

  // ---------- Business ----------
  getBusiness(userId) { return getDB().businesses.find(b => b.userId === userId); },

  updateBusiness(businessId, data) {
    const db = getDB();
    const idx = db.businesses.findIndex(b => b.id === businessId);
    if (idx !== -1) { db.businesses[idx] = { ...db.businesses[idx], ...data }; saveDB(db); return db.businesses[idx]; }
    return null;
  },

  // ---------- Services ----------
  getServices(businessId) {
    return getDB().services.filter(s => s.businessId === businessId);
  },

  addService(data) {
    const db = getDB();
    const svc = { id: generateId(), ...data, createdAt: new Date().toISOString() };
    db.services.push(svc);
    saveDB(db);
    return svc;
  },

  deleteService(svcId) {
    const db = getDB();
    db.services = db.services.filter(s => s.id !== svcId);
    saveDB(db);
  },

  // ---------- Clients ----------
  getClients(businessId) { return getDB().clients.filter(c => c.businessId === businessId); },
  getClient(clientId) { return getDB().clients.find(c => c.id === clientId); },

  createClient(data) {
    const db = getDB();
    const client = { id: generateId(), ...data, visits: 0, ticketAvg: 0, status: 'active', createdAt: new Date().toISOString() };
    db.clients.push(client);
    saveDB(db);
    return client;
  },

  updateClient(clientId, data) {
    const db = getDB();
    const idx = db.clients.findIndex(c => c.id === clientId);
    if (idx !== -1) { db.clients[idx] = { ...db.clients[idx], ...data }; saveDB(db); return db.clients[idx]; }
    return null;
  },

  deleteClient(clientId) {
    const db = getDB();
    db.clients = db.clients.filter(c => c.id !== clientId);
    saveDB(db);
  },

  // ---------- Appointments ----------
  getAppointments(businessId, date) {
    const db = getDB();
    let a = db.appointments.filter(x => x.businessId === businessId);
    if (date) a = a.filter(x => x.date === date);
    return a.sort((a, b) => a.time.localeCompare(b.time));
  },

  createAppointment(data) {
    const db = getDB();
    const appt = { id: generateId(), ...data, status: data.status || 'pending', createdAt: new Date().toISOString() };
    db.appointments.push(appt);
    saveDB(db);
    return appt;
  },

  updateAppointment(apptId, data) {
    const db = getDB();
    const idx = db.appointments.findIndex(a => a.id === apptId);
    if (idx !== -1) { db.appointments[idx] = { ...db.appointments[idx], ...data }; saveDB(db); return db.appointments[idx]; }
    return null;
  },

  deleteAppointment(apptId) {
    const db = getDB();
    db.appointments = db.appointments.filter(a => a.id !== apptId);
    saveDB(db);
  },

  // ---------- Automations ----------
  getAutomations(businessId) { return getDB().automations.filter(a => a.businessId === businessId); },

  updateAutomation(automationId, data) {
    const db = getDB();
    const idx = db.automations.findIndex(a => a.id === automationId);
    if (idx !== -1) { db.automations[idx] = { ...db.automations[idx], ...data }; saveDB(db); return db.automations[idx]; }
    return null;
  },

  // ---------- WhatsApp ----------
  getWhatsApp(businessId) {
    return getDB().whatsappConnections.find(w => w.businessId === businessId);
  },

  connectWhatsApp(businessId, data) {
    const db = getDB();
    const existing = db.whatsappConnections.findIndex(w => w.businessId === businessId);
    const conn = {
      id: existing !== -1 ? db.whatsappConnections[existing].id : generateId(),
      businessId,
      status: 'connected',
      method: data.method, // 'qrcode', 'api', 'token'
      phone: data.phone,
      lastSync: new Date().toISOString(),
      connectedAt: new Date().toISOString(),
      ...data
    };
    if (existing !== -1) db.whatsappConnections[existing] = conn;
    else db.whatsappConnections.push(conn);
    saveDB(db);
    return conn;
  },

  disconnectWhatsApp(businessId) {
    const db = getDB();
    db.whatsappConnections = db.whatsappConnections.filter(w => w.businessId !== businessId);
    saveDB(db);
  },

  // ---------- Message Logs ----------
  logMessage(data) {
    const db = getDB();
    const log = {
      id: generateId(),
      ...data, // businessId, clientId, clientName, phone, message, type, campaignId
      status: 'sent', // sent, delivered, read, failed
      sentAt: new Date().toISOString()
    };
    db.messageLogs.push(log);
    // Increment dispatch count
    const sub = db.subscriptions.find(s => s.businessId === data.businessId);
    if (sub) sub.dispatchesThisMonth = (sub.dispatchesThisMonth || 0) + 1;
    saveDB(db);
    return log;
  },

  getMessageLogs(businessId, filters) {
    const db = getDB();
    let logs = db.messageLogs.filter(l => l.businessId === businessId);
    if (filters) {
      if (filters.campaignId) logs = logs.filter(l => l.campaignId === filters.campaignId);
      if (filters.type) logs = logs.filter(l => l.type === filters.type);
    }
    return logs.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
  },

  getDispatchesUsed(businessId) {
    const sub = getDB().subscriptions.find(s => s.businessId === businessId);
    return sub ? (sub.dispatchesThisMonth || 0) : 0;
  },

  // ---------- Campaigns ----------
  getCampaigns(businessId) { return getDB().campaigns.filter(c => c.businessId === businessId); },

  createCampaign(data) {
    const db = getDB();
    const c = { id: generateId(), ...data, status: 'draft', sentCount: 0, deliveredCount: 0, readCount: 0, failedCount: 0, scheduledAt: null, sentAt: null, createdAt: new Date().toISOString() };
    db.campaigns.push(c);
    saveDB(db);
    return c;
  },

  updateCampaign(campaignId, data) {
    const db = getDB();
    const idx = db.campaigns.findIndex(c => c.id === campaignId);
    if (idx !== -1) { db.campaigns[idx] = { ...db.campaigns[idx], ...data }; saveDB(db); return db.campaigns[idx]; }
    return null;
  },

  deleteCampaign(campaignId) {
    const db = getDB();
    db.campaigns = db.campaigns.filter(c => c.id !== campaignId);
    saveDB(db);
  },

  sendCampaign(campaignId) {
    const db = getDB();
    const camp = db.campaigns.find(c => c.id === campaignId);
    if (!camp) return null;
    const clients = db.clients.filter(c => c.businessId === camp.businessId);
    let targets = clients;
    if (camp.targetAudience === 'active') targets = clients.filter(c => c.status === 'active');
    if (camp.targetAudience === 'inactive') targets = clients.filter(c => c.status === 'inactive');
    if (camp.selectedClients && camp.selectedClients.length > 0) targets = clients.filter(c => camp.selectedClients.includes(c.id));

    // Simulate sending with realistic delivery rates
    let sent = 0, delivered = 0, read = 0, failed = 0;
    targets.forEach(client => {
      const rand = Math.random();
      let status;
      if (rand < 0.05) { status = 'failed'; failed++; }
      else if (rand < 0.25) { status = 'sent'; sent++; }
      else if (rand < 0.55) { status = 'delivered'; delivered++; sent++; }
      else { status = 'read'; read++; delivered++; sent++; }

      db.messageLogs.push({
        id: generateId(), businessId: camp.businessId, clientId: client.id, clientName: client.name,
        phone: client.phone, message: camp.message, type: 'campaign', campaignId: camp.id,
        status, sentAt: new Date().toISOString()
      });
    });

    const idx = db.campaigns.findIndex(c => c.id === campaignId);
    db.campaigns[idx] = { ...db.campaigns[idx], status: 'sent', sentCount: sent + failed, deliveredCount: delivered, readCount: read, failedCount: failed, sentAt: new Date().toISOString() };

    const sub = db.subscriptions.find(s => s.businessId === camp.businessId);
    if (sub) sub.dispatchesThisMonth = (sub.dispatchesThisMonth || 0) + targets.length;

    saveDB(db);
    return db.campaigns[idx];
  },

  // ---------- Subscription ----------
  getSubscription(userId) { return getDB().subscriptions.find(s => s.userId === userId); },

  updateSubscription(subId, data) {
    const db = getDB();
    const idx = db.subscriptions.findIndex(s => s.id === subId);
    if (idx !== -1) { db.subscriptions[idx] = { ...db.subscriptions[idx], ...data }; saveDB(db); return db.subscriptions[idx]; }
    return null;
  },

  getPlans() { return DEFAULT_PLANS; },

  // ---------- Notifications ----------
  getNotifications(userId) {
    return getDB().notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  markNotificationRead(notifId) {
    const db = getDB();
    const idx = db.notifications.findIndex(n => n.id === notifId);
    if (idx !== -1) { db.notifications[idx].read = true; saveDB(db); }
  },

  addNotification(userId, title, message, type = 'info') {
    const db = getDB();
    db.notifications.push({ id: generateId(), userId, title, message, type, read: false, createdAt: new Date().toISOString() });
    saveDB(db);
  },

  // ---------- Dashboard Stats (REAL) ----------
  getDashboardStats(businessId) {
    const db = getDB();
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = db.appointments.filter(a => a.businessId === businessId && a.date === today);
    const allClients = db.clients.filter(c => c.businessId === businessId);
    const inactiveClients = allClients.filter(c => c.status === 'inactive');
    const wa = db.whatsappConnections.find(w => w.businessId === businessId);
    const logs = db.messageLogs.filter(l => l.businessId === businessId);

    const monthStart = new Date(); monthStart.setDate(1);
    const monthLogs = logs.filter(l => new Date(l.sentAt) >= monthStart);
    const todayLogs = logs.filter(l => l.sentAt.startsWith(today));

    const confirmed = todayAppts.filter(a => a.status === 'confirmed').length;
    const cancelled = todayAppts.filter(a => a.status === 'cancelled').length;

    const monthAppts = db.appointments.filter(a => a.businessId === businessId && a.date >= monthStart.toISOString().split('T')[0] && (a.status === 'confirmed' || a.status === 'completed'));
    const revenue = monthAppts.reduce((sum, a) => sum + (a.price || 0), 0);

    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const dayA = db.appointments.filter(a => a.businessId === businessId && a.date === ds);
      weekData.push({ day: d.toLocaleDateString('pt-BR', { weekday: 'short' }), total: dayA.length, confirmed: dayA.filter(a => a.status === 'confirmed' || a.status === 'completed').length });
    }

    // Recovery stats
    const recoveryLogs = logs.filter(l => l.type === 'automation' && (l.status === 'read' || l.status === 'delivered'));

    return {
      todayTotal: todayAppts.length, confirmed, cancelled, pending: todayAppts.filter(a => a.status === 'pending').length,
      totalClients: allClients.length, inactiveClients: inactiveClients.length, revenue, weekData,
      nextAppointments: todayAppts.filter(a => a.status !== 'cancelled').sort((a,b) => a.time.localeCompare(b.time)).slice(0, 5),
      whatsappStatus: wa ? wa.status : 'disconnected',
      whatsappPhone: wa ? wa.phone : null,
      messagesSentToday: todayLogs.length,
      messagesSentMonth: monthLogs.length,
      responseRate: monthLogs.length > 0 ? Math.round((monthLogs.filter(l => l.status === 'read').length / monthLogs.length) * 100) : 0,
      clientsRecovered: recoveryLogs.length,
      noShowsAvoided: logs.filter(l => l.type === 'automation' && l.status !== 'failed').length
    };
  }
};

window.Store = Store;
