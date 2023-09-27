const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Request body:", req.body);

  try {
    const response = await axios.post(
      "https://api.beehiiv.com/v2/publications/pub_7d8e4451-d1af-4f72-858e-2742f9cdc06e/subscriptions",
      {
        email: req.body.email,
        utm_source: "AIResearcher",
        utm_medium: "organic",
        reactivate_existing: false,
        send_welcome_email: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
        },
      }
    );

    //console.log("Beehiiv response:", response.data);

    res.status(200).send("Subscription successful");
  } catch (err) {
    //console.error("Error subscribing:", err);
    res.status(500).send("Error subscribing");
  }
});

module.exports = router;
