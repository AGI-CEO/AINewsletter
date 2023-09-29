require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const fetchPapers = require("./services/fetchPapers");
const summarizePapers = require("./services/summarizePapers");
const sendNewsletter = require("./services/sendNewsletter");
const subscribe = require("./routes/subscribe");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.use("/subscribe", subscribe);

app.get("/fetch-papers", async (req, res) => {
  try {
    const papers = await fetchPapers();
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

app.get("/summarize-papers", async (req, res) => {
  try {
    const papers = await fetchPapers();
    await summarizePapers(papers, (summary) => {
      res.write(JSON.stringify(summary) + "\n");
    });
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to summarize papers" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
