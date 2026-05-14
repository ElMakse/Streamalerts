# 🎮 Stream Alerts - Mercado Pago

Sistema de alertas para OBS que muestra donaciones de Mercado Pago en tiempo real.

## Archivos

- `server.js` — Servidor Node.js que recibe webhooks de MP
- `public/index.html` — Página de alertas para agregar en OBS como Browser Source
- `package.json` — Dependencias del proyecto

## Variables de entorno (Railway)

| Variable | Valor |
|---|---|
| `MP_ACCESS_TOKEN` | Tu Access Token de Mercado Pago (producción) |

## Configurar OBS

1. Agrega un **Browser Source** en OBS
2. URL: `https://TU-APP.railway.app`
3. Tamaño: 800x200 (o el que prefieras)
4. Activa **"Transparent background"**

## Configurar Webhook en Mercado Pago

1. Ve a Mercado Pago Developers → Tu app → Webhooks
2. URL: `https://TU-APP.railway.app/webhook`
3. Evento: `payment`

## Probar sin pago real

```bash
curl -X POST https://TU-APP.railway.app/test-alert \
  -H "Content-Type: application/json" \
  -d '{"nombre":"TestUser","monto":5000,"moneda":"CLP"}'
```
