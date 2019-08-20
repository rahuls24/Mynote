const express = require('express');
const router = express.Router();

// testing router
router.get('/', (req, res) => {
  res.json({ msg: 'msg from notes router' });
});

module.exports = router;
