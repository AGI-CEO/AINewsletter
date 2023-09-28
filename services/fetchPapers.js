const axios = require("axios");
const xml2js = require("xml2js");

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

  // Parse the XML data to JSON
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(response.data);

  // Extract the papers
  const papers = result.feed.entry.map((entry) => {
    const title = entry.title[0];
    const authors = entry.author.map((author) => author.name[0]);
    const summary = entry.summary[0];
    const link = entry.link.find((link) => link.$.rel === "alternate").$.href;

    // Convert the link to the abstract page into a link to the PDF
    const pdflink = link.replace("/abs/", "/pdf/") + ".pdf";
    console.log(pdflink);
    return { title, authors, summary, link, pdflink };
  });

  return papers;
};
