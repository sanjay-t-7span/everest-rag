import fs from "fs";
import { generateEmbedding } from "../lib/gemini.js";
import { upsertVector } from "../lib/vectorService.js";
import { log } from "console";

async function run() {
  const chunks = JSON.parse(fs.readFileSync("./chunks.json", "utf-8"));

  console.log(`Embedding ${chunks.length} chunks...`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    const enrichedText = `
Module: ${chunk.module}
Subsection: ${chunk.subsection || ""}
Content:
${chunk.content}
`;

    const embedding = await generateEmbedding(enrichedText);

    log(
      `Chunk ${i + 1}/${chunks.length} embedded. Vector length: ${embedding.length}`,
    );


    await upsertVector(chunk.id, embedding, {
      module: chunk.module,
      subsection: chunk?.subsection,
      title_path: chunk.title_path,
      content: chunk.content,
    });

    console.log(`Uploaded ${i + 1}/${chunks.length}`);
  }

  console.log("Done.");
}

run();
