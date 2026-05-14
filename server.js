const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Cola de alertas pendientes
let alertQueue = [];

// Webhook de Mercado Pago
app.post("/webhook", async (req, res) => {
  const { type, data } = req.body;

  if (type === "payment") {
    const paymentId = data?.id;
    if (!paymentId) return res.sendStatus(400);

    try {
      // Consultar detalles del pago a MP
      const mpRes = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );
      const payment = await mpRes.json();

      if (payment.status === "approved") {
        const nombre =
          payment.payer?.first_name ||
          payment.additional_info?.payer?.first_name ||
          "Anónimo";
        const monto = payment.transaction_amount;
        const moneda = payment.currency_id || "CLP";

        alertQueue.push({ nombre, monto, moneda, id: Date.now() });
        console.log(`✅ Pago aprobado: ${nombre} - ${monto} ${moneda}`);
      }
    } catch (err) {
      console.error("Error consultando pago:", err.message);
    }
  }

  res.sendStatus(200);
});

// OBS polling: obtener siguiente alerta
app.get("/next-alert", (req, res) => {
  if (alertQueue.length > 0) {
    const alert = alertQueue.shift();
    res.json(alert);
  } else {
    res.json(null);
  }
});

// Ruta de prueba para testear alertas sin pago real
app.post("/test-alert", (req, res) => {
  const { nombre = "TestUser", monto = 1000, moneda = "CLP" } = req.body;
  alertQueue.push({ nombre, monto, moneda, id: Date.now() });
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
