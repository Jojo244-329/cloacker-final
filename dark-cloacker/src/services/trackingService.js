const { redisClient } = require('../config');

async function trackClick(slug, data) {
  try {
    const key = `clicks:${slug}`;
    await redisClient.lPush(key, JSON.stringify(data));
    await redisClient.lTrim(key, 0, 49);
  } catch (err) {
    console.error('Erro ao rastrear clique:', err);
  }
}

module.exports = { trackClick };
