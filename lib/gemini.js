import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateEmbedding(text) {
  const response = await genAI.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });

  // const embeddingLength = response.embedding.values.length;

  // console.log(`Embedding length: ${embeddingLength}`);
  console.log("Response", response.embeddings[0].values);


  const values = response.embeddings[0].values;
  return Array.from(values);
}
