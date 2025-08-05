const asyncHandler = require('express-async-handler');

module.exports = asyncHandler(async (req, res, next) => {
  const userAgent = req.headers['user-agent']?.toLowerCase() || '';
  const referer = req.headers['referer'] || '';

  const isBot = /(bot|crawler|spider|facebook|preview|whatsapp|telegram|discord|slack|python|go-http-client)/i.test(userAgent);
  const isDesktop = /Windows NT|Macintosh|X11|Ubuntu/i.test(userAgent);
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);

  if (isBot) {
  return res.send('Acesso negado (bot detectado).');
  }

  if (!isMobile) {
  return res.send('Acesso negado (desktop).');
  }

  next();
});
