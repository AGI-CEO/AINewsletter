require("dotenv").config({ path: "../.env" });
const { OpenAI } = require("langchain/llms/openai");
const { loadSummarizationChain } = require("langchain/chains");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const axios = require("axios");

console.log(openai);

const fs = require("fs");
const pdfParse = require("pdf-parse");

async function extractTextFromPdf(pdfLink) {
  let response;
  try {
    // Download the PDF file
    response = await axios({
      url: pdfLink,
      method: "GET",
      responseType: "stream",
    });
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }

  const pdfPath = "./temp.pdf";
  const writer = fs.createWriteStream(pdfPath);
  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  // Read the PDF file
  const dataBuffer = fs.readFileSync(pdfPath);

  // Extract text from the PDF file
  let data;
  try {
    data = await pdfParse(dataBuffer);
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw error;
  }

  // Delete the temporary PDF file
  fs.unlinkSync(pdfPath);

  // Return the extracted text
  return data.text;
}

module.exports = async function summarizePapers(papers) {
  const summaries = [];
  const model = new OpenAI({ temperature: 0 });
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });

  for (const paper of papers) {
    try {
      // Extract text from the PDF
      const pdfText = await extractTextFromPdf(paper.pdflink);

      // Create documents from the PDF text
      const docs = await textSplitter.createDocuments([pdfText]);

      // Load the summarization chain
      const chain = loadSummarizationChain(model, { type: "map_reduce" });

      // Call the summarization chain
      const res = await chain.call({
        input_documents: docs,
      });

      summaries.push({
        title: paper.title,
        authors: paper.authors,
        AIsummary: res.text,
        link: paper.link,
        pdflink: paper.pdflink,
      });
    } catch (error) {
      console.error(`Error processing paper ${paper.title}:`, error);
      // You could push a placeholder summary here if you want
    }
  }
  return summaries;
  console.log(summaries);
};
