const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
  //res.send('Index');
});

router.get('/about', (req, res) => {
  res.render('about');
    //res.send('About');
});

module.exports = router;