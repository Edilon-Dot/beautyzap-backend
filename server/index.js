const express = require('express');
const cors = require('cors');
const db = require('./db');
const waService = require('./whatsapp.service');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

/* =========================================
   AUTH ROUTES
========================================= */

// Sync / Register a locally logged in User (For seamless integration)
app.post('/api/auth/sync', (req, res) => {
  const { user, business } = req.body;
  if (!user || !user.id || !business || !business.id) {
    return res.status(400).json({ error: 'Missing user or business data' });
  }

  // Insert or ignore user
  db.run(`INSERT OR IGNORE INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`, 
    [user.id, user.name, user.email, user.password], 
    function(err) {
      if (err) console.error("Error syncing user", err);
      
      // Insert or ignore business
      db.run(`INSERT OR IGNORE INTO businesses (id, user_id, name, whatsapp) VALUES (?, ?, ?, ?)`,
        [business.id, user.id, business.name, business.phone || business.whatsapp || ''],
        function(err2) {
          if (err2) console.error("Error syncing business", err2);
          res.json({ success: true, message: 'User synced with backend DB' });
        });
  });
});

/* =========================================
   WHATSAPP API ROUTES (UltraMsg / Z-API)
========================================= */

// Envia mensagem imediatamente (Confirmação)
app.post('/api/messages/send', async (req, res) => {
  const { phone, message, apiUrl, apiToken } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: 'Faltando telefone ou mensagem' });
  }

  try {
    const result = await waService.sendText(phone, message, { apiUrl, apiToken });
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agenda uma mensagem para depois (Ex: 2h antes do agendamento)
app.post('/api/messages/schedule', (req, res) => {
  const { phone, message, targetTimeISO, apiUrl, apiToken } = req.body;

  if (!phone || !message || !targetTimeISO) {
    return res.status(400).json({ error: 'Faltando dados de agendamento' });
  }

  const targetDate = new Date(targetTimeISO);
  const now = new Date();
  let delayMs = targetDate.getTime() - now.getTime();

  if (delayMs <= 0) {
     // Se o horário já passou, não agenda, ou manda agora se for recente (mas por segurança ignoramos)
     return res.json({ success: false, message: 'Horário alvo já passou' });
  }

  // MVP: usando setTimeout em memória. (Num sistema real usaríamos Redis/BullMQ ou node-cron)
  // Como é MVP para testar "hoje", isso funcionará enquanto o servidor estiver online.
  setTimeout(async () => {
    try {
      console.log(`[Agendado] Disparando lembrete programado para ${phone}`);
      await waService.sendText(phone, message, { apiUrl, apiToken });
    } catch (err) {
      console.error(`[Agendado] Erro ao enviar lembrete para ${phone}:`, err.message);
    }
  }, delayMs);

  console.log(`[Scheduler] Mensagem agendada para ${phone} em ${Math.round(delayMs/60000)} minutos.`);
  res.json({ success: true, scheduled: true, delayMs });
});

// Desconectar / Limpar (Apenas frontend no MVP)
app.post('/api/whatsapp/disconnect', (req, res) => {
   res.json({ success: true, message: "Removido localmente" });
});

app.listen(PORT, () => {
  console.log(`BeautyZap Backend rodando na porta ${PORT}`);
  if(process.env.WHATSAPP_API_URL) {
    console.log(`API WhatsApp Primária: ${process.env.WHATSAPP_API_URL}`);
  } else {
    console.log(`⚠️ Nenhuma WHATSAPP_API_URL global no .env. Mensagens serão enviadas apenas pelo console, a menos que o cliente passe as credenciais na tela de WhatsApp.`);
  }
});
