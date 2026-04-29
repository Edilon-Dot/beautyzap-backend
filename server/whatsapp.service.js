const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Para UltraMsg, a URL é algo como: https://api.ultramsg.com/INSTANCE_ID/messages/chat
// Para Z-API: https://api.z-api.io/instances/INSTANCE_ID/token/TOKEN/send-text
const API_URL = process.env.WHATSAPP_API_URL || '';
const API_TOKEN = process.env.WHATSAPP_API_TOKEN || '';

/**
 * Envia uma mensagem via API do WhatsApp
 */
async function sendText(phone, message, config = {}) {
  const url = config.apiUrl || API_URL;
  const token = config.apiToken || API_TOKEN;

  if (!url) {
    console.warn("[WhatsApp] Nenhuma URL de API configurada. Mensagem simulada apenas no log.");
    console.log(`[SIMULADO] Para: ${phone} | Mensagem: ${message}`);
    return { simulated: true, success: true, message: "Simulado no console (URL não configurada)" };
  }

  // Tratamento do número (remover não numéricos, garantir +55 ou country code)
  let cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone.startsWith('55') && cleanPhone.length === 11) {
    cleanPhone = '55' + cleanPhone; 
  }
  
  try {
    let payload = {};
    let configAxios = {};

    // Detecção básica de estrutura baseada na URL
    if (url.includes('ultramsg')) {
      // UltraMsg espera token no form/body ou query e 'to' / 'body'
      payload = {
        token: token,
        to: `+${cleanPhone}`,
        body: message
      };
    } else if (url.includes('z-api')) {
      // Z-API espera phone / message no body
      payload = {
        phone: cleanPhone,
        message: message
      };
      if (token) configAxios.headers = { 'Client-Token': token };
    } else {
      // Padrão genérico Evolution API ou outros
      payload = {
        number: cleanPhone,
        textMessage: { text: message }
      };
      if (token) configAxios.headers = { 'apikey': token };
    }

    const res = await axios.post(url, payload, configAxios);
    console.log(`[WhatsApp] Mensagem enviada para ${cleanPhone}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.error(`[WhatsApp] Falha ao enviar para ${cleanPhone}:`, err.message);
    throw new Error(err.response?.data?.error || err.message || "Erro desconhecido na API de WhatsApp");
  }
}

module.exports = {
  sendText
};
