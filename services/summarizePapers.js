require("dotenv").config({ path: "../.env" });
const openai = require("openai");
const axios = require("axios");

openai.apiKey = process.env.OPENAI_API_KEY;

const fs = require("fs");
const pdfParse = require("pdf-parse");

async function extractTextFromPdf(pdfLink) {
  // Download the PDF file
  const response = await axios({
    url: pdfLink,
    method: "GET",
    responseType: "stream",
  });

  console.log(response.status);
  console.log(response.headers);

  const pdfPath = "./temp.pdf";
  const writer = fs.createWriteStream(pdfPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  })
    .then(() => {
      // Read the PDF file
      const dataBuffer = fs.readFileSync(pdfPath);

      // Extract text from the PDF file
      return pdfParse(dataBuffer);
    })
    .then((data) => {
      // Delete the temporary PDF file
      fs.unlinkSync(pdfPath);

      // Return the extracted text
      return data.text;
    });
}

module.exports = async function summarizePapers(papers) {
  const summaries = await Promise.all(
    papers.map(async (paper) => {
      // Extract text from the PDF
      const pdfText = await extractTextFromPdf(paper.pdflink);

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: [
          {
            role: "system",
            content:
              "You are an expert educator that excels at summarizing complex AI subjects in a way that an average adult who's been following AI news would understand. The user will respond with the text contents of a research paper and you will only return a summary.",
          },
          {
            role: "user",
            content: pdfText,
          },
        ],
        max_tokens: 7900,
      });
      return {
        title: paper.title,
        authors: paper.authors,
        AIsummary: response.choices[0].message.content,
        link: paper.link,
        pdflink: paper.pdflink,
      };
    })
  );
  return summaries;
};
