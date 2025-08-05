const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { redisClient } = require('../config');
const requestIp = require('request-ip');
const useragent = require('useragent');
const { trackClick } = require('../services/trackingService');
const gatekeeper = require('../middlewares/gatekeeper');

// POST /gerar-slug
router.post('/', async (req, res) => {
  const destino = "https://alfaconsulbrasil.com/";


  if (!destino) {
    return res.status(400).json({ erro: 'Destino obrigatório' });
  }

  const slug = crypto.randomBytes(6).toString('hex');

  await redisClient.set(`slug:${slug}`, JSON.stringify({ destino }));

  res.json({
    slug,
    link: `https://dark-cloacker.up.railway.app/${slug}`,
    destino
  });
});

// GET /:slug
router.get('/:slug', async (req, res) => {
  const slugData = await redisClient.get(`slug:${req.params.slug}`);
  if (!slugData) return res.status(404).send('Link expirado ou inválido');

  const ip = requestIp.getClientIp(req);
  const ua = req.headers['user-agent'] || 'unknown';
  const ref = req.get('referer') || 'direct';
  const time = new Date().toISOString();
  const parsedUA = useragent.parse(ua);
  const device = parsedUA.device.toString();

  const data = JSON.parse(slugData);
  const { destino } = data;

  const utmParams = new URLSearchParams(req.query).toString();
  const finalUrl = utmParams ? `${destino}?${utmParams}` : destino;

  await trackClick(req.params.slug, {
    ip, ua, ref, time, utm: utmParams, device
  });

  // 🔥 OPCIONAL: se não quiser deletar o slug depois, comenta a linha abaixo
  // await redisClient.del(`slug:${req.params.slug}`);

  res.send(`
    <script>
      sessionStorage.setItem('approved', 'ok');
      window.location.href = '${finalUrl}';
    </script>
  `);
});

module.exports = router;
