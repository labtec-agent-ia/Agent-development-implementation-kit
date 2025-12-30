# Agent-development-implementation-kit
Agente para desenvolvimento de identidade de máquina. Para diferenciar arquivos gerados por ia

## WhatsApp API Proxy Server

This project provides a proxy server for the Serpro WhatsApp API, handling OAuth2 authentication automatically.

### Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables in `.env`:
   - `TARGET_BASE`: https://whatsapp.serpro.gov.br
   - `AUTH_URL`: The authentication endpoint URL from the Swagger docs (e.g., https://whatsapp.serpro.gov.br/oauth/token)
   - `CLIENT_ID`: Your client ID
   - `CLIENT_SECRET`: Your client secret
   - `PORT`: 3000 (default)

3. Run the server:
   ```
   node server.js
   ```

### Testing

Make requests to `http://localhost:3000/api/<endpoint>`, and the proxy will fetch the token and forward the request.

### Deployment with Docker

Build the image:
```
docker build -t whatsapp-proxy .
```

Run the container:
```
docker run -p 3000:3000 --env-file .env whatsapp-proxy
```
