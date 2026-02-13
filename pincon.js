// Import the Pinecone library
import { Pinecone } from "@pinecone-database/pinecone";

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: "YOUR_API_KEY" });

// Create a dense index with integrated embedding
const indexName = "quickstart-js";
await pc.createIndexForModel({
  name: indexName,
  cloud: "aws",
  region: "us-east-1",
  embed: {
    model: "llama-text-embed-v2",
    fieldMap: { text: "text" },
  },
  waitUntilReady: true,
});
