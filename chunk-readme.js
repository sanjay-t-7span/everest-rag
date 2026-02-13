import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// ========== CONFIG ==========
const INPUT_FILE = "./data.md"; // your markdown file
const OUTPUT_FILE = "./chunks.json";
// ============================

// Utility to clean extra whitespace
function cleanText(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Main chunking logic
function chunkMarkdown(markdown) {
  const chunks = [];
  const modules = markdown.split("\n## ");

  modules.forEach((moduleBlock, moduleIndex) => {
    if (moduleIndex === 0) return;

    const lines = moduleBlock.split("\n");
    const moduleTitle = lines[0].trim();
    const moduleContent = lines.slice(1).join("\n");

    // SPECIAL HANDLING FOR ESCALATION
    if (moduleTitle === "Escalation Policies") {
      const escalationParts = moduleContent.split("\n- **");

      escalationParts.forEach((part, index) => {
        if (index === 0) return; // skip intro text

        const splitIndex = part.indexOf("**");
        const policyTitle = part.substring(0, splitIndex).trim();
        const policyContent = part.substring(splitIndex + 2).trim();

        chunks.push({
          id: uuidv4(),
          module: moduleTitle,
          subsection: policyTitle,
          title_path: `${moduleTitle} > ${policyTitle}`,
          content: cleanText(policyContent),
        });
      });

      return;
    }

    // NORMAL H3 SPLIT
    const sections = moduleContent.split("\n### ");

    if (sections.length === 1) {
      const content = cleanText(sections[0]);
      if (content.length > 50) {
        chunks.push({
          id: uuidv4(),
          module: moduleTitle,
          subsection: null,
          title_path: moduleTitle,
          content,
        });
      }
      return;
    }

    sections.forEach((sectionBlock, sectionIndex) => {
      if (sectionIndex === 0) return;

      const sectionLines = sectionBlock.split("\n");
      const sectionTitle = sectionLines[0].trim();
      const sectionContent = cleanText(sectionLines.slice(1).join("\n"));

      if (sectionContent.length > 50) {
        chunks.push({
          id: uuidv4(),
          module: moduleTitle,
          subsection: sectionTitle,
          title_path: `${moduleTitle} > ${sectionTitle}`,
          content: sectionContent,
        });
      }
    });
  });

  return chunks;
}

// ========== RUN SCRIPT ==========

try {
  const filePath = path.resolve(INPUT_FILE);
  const markdown = fs.readFileSync(filePath, "utf-8");

  const chunks = chunkMarkdown(markdown);

  fs.writeFileSync(path.resolve(OUTPUT_FILE), JSON.stringify(chunks, null, 2));

  console.log("✅ Chunking complete!");
  console.log(`📦 Total chunks created: ${chunks.length}`);
  console.log(`📁 Output saved to: ${OUTPUT_FILE}`);
} catch (error) {
  console.error("❌ Error while chunking:", error);
}
