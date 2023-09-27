const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    await axios.post('https://api.beehiiv.com/subscribers', {
      email: req.body.email
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
      }
    });
    res.status(200).send('Subscription successful');
  } catch (err) {
    res.status(500).send('Error subscribing');
  }
});

module.exports = router;
