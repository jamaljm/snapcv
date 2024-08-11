require("dotenv").config();
const express = require("express");
const { createWriteStream, readFileSync, unlink } = require("fs");
const axios = require("axios");
const pdf = require("pdf-parse");
const getCompletionFromOpenAI = require("./openai.js");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

// CORS configuration options
const corsOptions = {
  origin: ["https://www.snapcv.me", "http://localhost:3000"], // Allow both production and localhost origins
  methods: ["GET", "POST"], // Allow only these methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow only these headers
};

const app = express();
app.use(cors(corsOptions)); // Enable CORS with specific options
app.use(express.json());

async function downloadPDF(url, outputPath) {
  const response = await axios({
    method: "get",
    url: url,
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const stream = createWriteStream(outputPath);
    response.data.pipe(stream);
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

async function extractTextFromPDF(filePath) {
  const dataBuffer = readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

app.post("/extract-pdf", async (req, res) => {
  const { pdfUrl } = req.body;
  const pdfPath = `${uuidv4()}.pdf`; // Generate a random file name

  try {
    await downloadPDF(pdfUrl, pdfPath);
    const text = await extractTextFromPDF(pdfPath);
    const result = { text: text };
    const json = await getCompletionFromOpenAI(JSON.stringify(result, null, 2));

    // Delete the downloaded PDF file
    unlink(pdfPath, (err) => {
      if (err) {
        console.error("Failed to delete the file:", err);
      }
    });

    res.json(JSON.parse(json));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
