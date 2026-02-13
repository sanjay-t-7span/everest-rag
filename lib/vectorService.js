import { index } from "./pinecone.js";

export async function upsertVector(id, values, metadata) {
  await index.upsert({
    records: [
      {
        id,
        values,
        metadata,
      },
    ],
  });
}

export async function searchVector(vector, topK = 5) {
  return await index.query({
    vector,
    topK,
    includeMetadata: true,
  });
}
