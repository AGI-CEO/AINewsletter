const axios = require('axios');

module.exports = async function summarizePapers(papers) {
  const summaries = await Promise.all(papers.map(async (paper) => {
    const response = await axios.post('https://api.openai.com/v4/engines/davinci-codex/completions', {
      prompt: paper.abstract,
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    return {
      title: paper.title,
      authors: paper.authors,
      summary: response.data.choices[0].text,
      link: paper.link
    };
  }));
  return summaries;
};
