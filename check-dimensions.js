import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

async function checkDimension() {
  const model = await genAI.models.embedContent({
    model: "gemini-embedding-001", // or whichever embedding model you're using
    contents: "What is the meaning of life?",
  });

  const embedding = model.embeddings[0].values;

  console.log("model", model);

  console.log("Vector length:", embedding.length);
}

checkDimension();
