const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('🔒 Rota cloak reservada.');
});

module.exports = router;
