import OpenAI from "openai";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

if (!process.env.OPENAI_KEY) {
  console.warn("Warning: OPENAI_KEY is not set. OpenAI requests will fail.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY, // Use the environment variable
});

const getCompletionFromOpenAI = async (text) => {
  try {
    const prompt = `
You are a helpful assistant. Given the following text extracted from a PDF, please analyze it and return data formatted according to the provided JSON schema. Include ALL fields from the schema, even if no relevant information is found in the text - in such cases, use empty strings ("") or empty arrays ([]) as appropriate. For object fields like location, include the object with empty string values for all its properties. For array fields like profiles, include the full array structure with empty strings for all properties of each object. The goal is to maintain the complete schema structure while populating only the fields where information can be extracted from the provided text. Do not omit any fields from the schema, and ensure all nested objects and arrays are properly represented even when empty.

### PDF:
${text}

### JSON Schema:
 {
        basics: {
          name: "",
          phone: "",
          label: "",
          about: "",
          website: "",
          resumeUrl: "",
          email: "",
          avatarUrl: "",
          skills: [],
          location: {
            city: "",
            countryCode: "",
          },
          profiles: [
            {
              username: "",
              url: "",
              network: "LinkedIn",
            },
            {
              username: "",
              url: "",
              network: "X",
            },
            {
              username: "",
              url: "",
              network: "GitHub",
            },
            {
              username: "",
              url: "",
              network: "Youtube",
            },
            {
              username: "",
              url: "",
              network: "Dribbble",
            },
          ],
        },
        certificates: [
          {
            name: "",
            date: "",
            issuer: "",
            url: "",
          },
        ],
        education: [
          {
            endDate: "",
            startDate: "",
            area: "",
            studyType: "",
            institution: "",
            url: "",
            logo: "",
            score: "",
            courses: [""],
          },
        ],
        skills: [
          {
            name: "",
            keywords: [""],
          },
        ],
        awards: [
          {
            title: "",
            awarder: "",
            date: "",
            summary: "",
          },
        ],
        hackathons: {
          description: "",
          hackathons: [
            {
              title: "",
              dates: "",
              location: "",
              description: "",
              image: "",
              win: "",
              url: "",
            },
          ],
        },
        
        volunteer: [
          {
            organization: "",
            position: "",
            url: "",
            startDate: "",
            summary: "",
            highlights: [""],
          },
        ],
        work: [
          {
            summary: "",
            website: "",
            name: "",
            location: "",
            position: "",
            startDate: "",
            endDate: "",
            logo: "",
            highlights: [""],
          },
        ],
        projects: {
          description: "",
          projects: [
            {
              title: "",
              description: "",
              website: "",
              duration: "",
              technologies: [""],
              highlights: [""],
              image: "",
              source: "",
            },
          ],
        },
        languages: [
          {
            language: "",
            fluency: "",
          },
        ],
        interests: [
          {
            name: "",
            keywords: [""],
          },
        ],
        references: [
          {
            reference: "",
            name: "",
          },
        ],
      }

Please format your response according to this JSON schema.return this full json object even if no data is found.
`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant and you are given a text and you need to extract the data and return it in json format." },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      max_tokens: 4000,
      temperature: 0, // deterministic extraction — avoid fabricated fields
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI returned an empty response.");
    }
    return content;
  } catch (error) {
    console.error("Error fetching completion:", error);
    throw error; // propagate so callers can return a proper HTTP error
  }
};

export { getCompletionFromOpenAI };
