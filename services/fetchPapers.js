const axios = require('axios');

module.exports = async function fetchPapers() {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const response = await axios.get('https://api.arxiv.org', {
    params: {
      category: 'AI',
      since: yesterday.toISOString()
    }
  });
  return response.data;
};
