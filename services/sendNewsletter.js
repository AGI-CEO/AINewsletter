const axios = require('axios');

module.exports = async function sendNewsletter(summaries) {
  const newsletter = summaries.map(summary => `
    <h2>${summary.title}</h2>
    <h3>${summary.authors.join(', ')}</h3>
    <p>${summary.summary}</p>
    <a href="${summary.link}">Read More</a>
  `).join('');
  await axios.post('https://api.beehiiv.com/newsletters', {
    content: newsletter
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
    }
  });
};
