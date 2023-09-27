const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const fetchPapers = require('./services/fetchPapers');
const summarizePapers = require('./services/summarizePapers');
const sendNewsletter = require('./services/sendNewsletter');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/subscribe', require('./routes/subscribe'));

// Fetch, summarize and send newsletter every weekday at 8am Eastern Time
cron.schedule('0 8 * * 1-5', async () => {
  const papers = await fetchPapers();
  const summaries = await summarizePapers(papers);
  await sendNewsletter(summaries);
}, {
  timezone: "America/New_York"
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
