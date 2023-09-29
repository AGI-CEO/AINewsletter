require("dotenv").config({ path: "../.env" });
/* const { OpenAI } = require("langchain/llms/openai");
 */ const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { loadSummarizationChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { TextLoader } = require("langchain/document_loaders/fs/text");

const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");

const pdfParse = require("pdf-parse");

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function summarizePapers(papers, callback) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  for (const paper of papers) {
    try {
      // Skip the paper if pdflink is null
      if (!paper.pdflink) {
        console.log(`Skipping paper ${paper.title} because pdflink is null`);
        continue;
      }

      console.log(
        `Downloading PDF for paper ${paper.title} from ${paper.pdflink}`
      );

      /*  // Download the PDF file
      const response = await axios.get(paper.pdflink, {
        responseType: "arraybuffer",
      });

      const pdfPath = path.join(
        __dirname,
        `${paper.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`
      );

      // Write the PDF file
      await fs.promises.writeFile(pdfPath, response.data);
 */

      // Download the PDF file
      const response = await axios.get(paper.pdflink, {
        responseType: "arraybuffer",
      });

      const pdfPath = path.join(
        __dirname,
        `${paper.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`
      );

      // Write the PDF file
      await fs.promises.writeFile(pdfPath, response.data);

      // Parse the PDF file
      const data = await pdfParse(response.data);

      // Write the extracted text to a .txt file
      const txtPath = path.join(
        __dirname,
        `${paper.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`
      );
      await fs.promises.writeFile(txtPath, data.text);
      console.log(txtPath);
      //console.log(data.text);

      /* // Load the PDF file
      const loader = new PDFLoader(pdfPath, {
        pdfjs: () => Promise.resolve(pdfjs),
      });

      // Get the text content of the PDF
      const documents = await loader.load();
      const pdfText = documents.map((doc) => doc.text).join("\n");
      console.log("PDF Text: ", pdfText);

      // Create documents by splitting the PDF text
      const docs = await textSplitter.createDocuments([pdfText]);
      console.log("Docs: ", docs); */

      // Load the text file
      const loader = new TextLoader(txtPath);

      // Get the text content of the file
      // await loader.load();
      const text = data.text;
      //console.log("Text: ", text);

      // Create documents by splitting the text
      const docs = await textSplitter.createDocuments([text]);
      //console.log("Docs: ", docs);

      // Load the summarization chain
      const chain = loadSummarizationChain(model, {
        type: "map_reduce",
        verbose: true,
      });

      // Call the summarization chain
      const res = await chain.call({
        input_documents: docs,
      });

      console.log("Summarization Result: ", res);

      const summary = {
        title: paper.title,
        authors: paper.authors,
        AIsummary: res.text,
        link: paper.link,
        pdflink: paper.pdflink,
      };

      // Call the callback function with the summary
      console.log(
        "About to call callback with summary for paper:",
        paper.title
      );
      callback(summary);

      // Delete the PDF file
      fs.unlinkSync(pdfPath);
    } catch (error) {
      console.error(`Error processing paper ${paper.title}:`, error);
    }
    console.log("Finished processing paper:", paper.title);
  }
};
