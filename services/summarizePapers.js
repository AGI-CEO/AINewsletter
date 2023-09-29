require("dotenv").config({ path: "../.env" });
/* const { OpenAI } = require("langchain/llms/openai");
 */ const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { loadSummarizationChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function summarizePapers(papers, callback) {
  for (const paper of papers) {
    try {
      // Download the PDF file
      const response = await axios.get(paper.pdflink, {
        responseType: "arraybuffer",
      });
      const pdfPath = path.join(
        __dirname,
        `${paper.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`
      );
      fs.writeFileSync(pdfPath, response.data);

      // Load the PDF file
      const loader = new PDFLoader(pdfPath, {
        splitPages: true, // Set to true if you want one document per page
      });

      // Create documents from the PDF text
      const docs = await loader.load();

      // Load the summarization chain
      const chain = loadSummarizationChain(model, { type: "map_reduce" });

      // Call the summarization chain
      const res = await chain.call({
        input_documents: docs,
      });

      const summary = {
        title: paper.title,
        authors: paper.authors,
        AIsummary: res.text,
        link: paper.link,
        pdflink: paper.pdflink,
      };

      // Call the callback function with the summary
      callback(summary);

      // Delete the PDF file
      fs.unlinkSync(pdfPath);
    } catch (error) {
      console.error(`Error processing paper ${paper.title}:`, error);
    }
  }
};
