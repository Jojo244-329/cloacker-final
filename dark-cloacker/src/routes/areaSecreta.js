const express = require('express');
const router = express.Router();
const requestIp = require('request-ip');
const useragent = require('useragent');

// Middleware adicional anti-clone
router.use((req, res, next) => {
  const ip = requestIp.getClientIp(req);
  const ua = req.headers['user-agent'] || '';
  const referer = req.get('referer') || '';
  const bait = req.query._ || ''; // honeypot

  const parsed = useragent.parse(ua);
  const device = parsed.device.toString().toLowerCase();
  const isDesktop = /(windows|macintosh|x11|linux)/i.test(ua);
  const isBot = /bot|crawler|spider|crawling/i.test(ua);

  const devToolsOpen = ua.includes('HeadlessChrome') || ua.includes('puppeteer');

  if (isBot || isDesktop || bait === 'trap' || devToolsOpen) {
    console.warn(`🧠 BLOQUEIO: IP ${ip} - UA: ${ua} - Device: ${device}`);
    return res.status(403).send('⛔ Você não tem permissão pra acessar isso aqui, maluco.');
  }

  next();
});

// Página protegida
router.get('/', (req, res) => {
  const token = req.headers.cookie && req.headers.cookie.includes('approved=ok');

  if (!token) {
    return res.status(403).send(`
      <h1>Acesso Restrito</h1>
      <p>Você caiu aqui sem autorização. Vai rodar no limbo.</p>
      <script>setTimeout(() => window.location.href = "https://google.com", 3000)</script>
    `);
  }

  res.send(`
    <html>
      <head><title>🔥 Área Secreta</title></head>
      <body>
        <h1>🛡️ Conteúdo Protegido</h1>
        <p>Você passou pelas defesas e chegou onde poucos conseguem.</p>
        <p>Agora é hora de converter.</p>
      </body>
    </html>
  `);
});

module.exports = router;
