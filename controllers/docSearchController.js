import { generateEmbedding } from "../lib/gemini.js";
import { searchVector } from "../lib/vectorService.js";

export async function searchDocs(req, res) {
    try {
        // const { query } = req.body;

        // if (!query || query.trim().length < 5) {
        //     return res.json({ results: [] });
        // }

        const query = "why not able to fill timesheet"
        const embedding = await generateEmbedding(query);

        const pineconeResponse = await searchVector(embedding, 5);

        const results = pineconeResponse.matches
            .filter(match => match.score > 0.70) // similarity threshold
            .map(match => ({
                id: match.id,
                title: match.metadata.title_path,
                module: match.metadata.module,
                subsection: match.metadata.subsection,
                content: match.metadata.content,
                score: match.score,
            }));

        console.log(res.json({ results }));


        return res.json({ results });
    } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({ error: "Search failed" });
    }
}
