require("dotenv").config(); // Load environment variables from .env file
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY, // Use the environment variable
});

async function getCompletionFromOpenAI(text) {
  try {
    const prompt = `
You are a helpful assistant. Given the following text extracted from a PDF, format the response according to the provided JSON schema. Include appropriate entries for the roll, about,hackathone description and project descriptiony fields. Do not add fields without information, except for those within inner arrays.roll means like full stack developer.

### Text:
${text}

### JSON Schema:
{
  "fullName": "",
  "roll": "",
  "about": "",
  "email": "",
  "phone": "",
  "skills": [],
  "contact": {
    "GitHub": "",
    "LinkedIn": "",
    "X": "",
    "Youtube": "",
    "dribbble": ""
  },
  "workExperience": [
    {
      "company": "",
      "title": "",
      "logoUrl": "",
      "start": "",
      "end": "",
      "description": "",
      "link": ""
    }
  ],
  "education": [
    {
      "school": "",
      "degree": "",
      "logoUrl": "",
      "start": "",
      "end": "",
      "link": ""
    }
  ],
  "hackathonDescription": "",
  "projects": [
    {
      "title": "",
      "href": "",
      "dates": "",
      "description": "",
      "technologies": [],
      "links": {
        "website": "",
        "source": ""
      },
      "image": ""
    }
  ],
  "projectDescription": "",
  "hackathons": [
    {
      "title": "",
      "dates": "",
      "location": "",
      "description": "",
      "image": "",
      "win": "",
      "links": {
        "website": "",
        "github": ""
      }
    }
  ]
}

Please format your response according to this JSON schema.
`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching completion:", error);
  }
}

module.exports = getCompletionFromOpenAI;
