const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

let token = null;
let tokenExpiresAt = 0;

async function fetchToken() {
  const now = Date.now();
  if (token && tokenExpiresAt > now + 5000) return token;

  // Ajuste o body/headers conforme o que o endpoint de autenticação espera
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.CLIENT_ID);
  params.append('client_secret', process.env.CLIENT_SECRET);

  const resp = await axios.post(process.env.AUTH_URL, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  token = resp.data.access_token;
  tokenExpiresAt = now + (resp.data.expires_in || 3600) * 1000;
  return token;
}

app.all('/api/*', async (req, res) => {
  try {
    const t = await fetchToken();
    const proxiedPath = req.originalUrl.replace(/^\/api/, '');
    const targetUrl = process.env.TARGET_BASE + proxiedPath;

    const headers = { ...req.headers, Authorization: `Bearer ${t}` };
    delete headers.host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers,
      data: req.body,
      params: req.query,
      validateStatus: () => true
    });

    // Repasse do status e body (pode filtrar headers se quiser)
    res.status(response.status).set(response.headers).send(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`MCP proxy rodando na porta ${process.env.PORT || 3000}`);
});