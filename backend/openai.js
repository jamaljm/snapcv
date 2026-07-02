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

// Turn raw GitHub repos (name + description + language + README excerpt) into
// recruiter-legible project cards: one short line saying what it does / what was
// built, plus the real tech stack. Batched into one call.
const generateRepoCards = async (repos) => {
  const input = (repos || []).slice(0, 8).map((r) => ({
    name: String(r?.name || "").slice(0, 80),
    description: String(r?.description || "").slice(0, 300),
    language: String(r?.language || "").slice(0, 40),
    readme: String(r?.readme || "").slice(0, 1500),
  }));
  if (input.length === 0) return [];

  const prompt = `You are helping a job-seeking developer make their GitHub projects legible to a recruiter who spends ~90 seconds scanning.

For EACH repository below, write a concise, factual card. Rules:
- "description": ONE or TWO sentences, plain and specific — what the project does and what was built. No hype, no "leveraging/seamless/robust", no first person, no emojis. If the repo is clearly a tutorial/config/fork with little substance, keep it to one honest sentence.
- "technologies": an array of the real tools/frameworks/languages actually used (from the README + language). 2–6 items. Do NOT invent tech that isn't evidenced.
- Never fabricate features or metrics that aren't in the input.

Return ONLY JSON: {"cards":[{"name":"<repo name exactly>","description":"...","technologies":["..."]}]}

Repositories:
${JSON.stringify(input, null, 2)}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You write short, honest, recruiter-legible descriptions of GitHub projects. Output strict JSON only.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.2,
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenAI returned an empty response.");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed?.cards) ? parsed.cards : [];
  } catch (error) {
    console.error("Error generating repo cards:", error);
    throw error;
  }
};

export { getCompletionFromOpenAI, generateRepoCards };
