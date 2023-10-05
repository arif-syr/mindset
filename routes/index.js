const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/dashboard.html'));
});

router.get('/focus', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/focus.html'));
});

router.get('/startTask', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/startTask.html'));
});

module.exports = router;