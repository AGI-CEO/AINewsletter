const axios = require("axios");

module.exports = async function fetchPapers() {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const response = await axios.get("http://export.arxiv.org/api/query", {
    params: {
      search_query: "cat:cs.AI",
      start: 0,
      max_results: 10,
      sortBy: "submittedDate",
      sortOrder: "descending",
    },
  });
  return response.data;
};
