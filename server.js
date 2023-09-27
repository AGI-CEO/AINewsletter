const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const fetchPapers = require("./services/fetchPapers");
const summarizePapers = require("./services/summarizePapers");
const sendNewsletter = require("./services/sendNewsletter");
const subscribe = require("./routes/subscribe");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/subscribe", subscribe);

/* old subscribe endpoint
app.post("/subscribe", (req, res) => {
  const {
    email,
    utm_source = "AIResearcher",
    utm_medium = "organic",
    reactivate_existing = false,
    send_welcome_email = true,
    double_opt_override,
  } = req.body;
  res.status(200).send("Subscription successful");
});
*/

app.get("/fetch-papers", async (req, res) => {
  try {
    const papers = await fetchPapers();
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch, summarize and send newsletter every weekday at 8am Eastern Time
cron.schedule(
  "0 8 * * 1-5",
  async () => {
    const papers = await fetchPapers();
    const summaries = await summarizePapers(papers);
    await sendNewsletter(summaries);
  },
  {
    timezone: "America/New_York",
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
