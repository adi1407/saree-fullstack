/**
 * Ingest curated markdown from backend/content/knowledge into KnowledgeChunk.
 * With LLM_API_KEY: stores real embeddings. Without: empty embeddings (lexical RAG still works).
 *
 * Usage: npm run ingest-knowledge
 */
import fs from "fs";
import path from "path";
import { connectDB } from "../db/connect";
import { KnowledgeChunk } from "../models/KnowledgeChunk";
import { embedTexts, hasLlmKey } from "../services/chat/llm";

type ParsedChunk = {
  source: string;
  title: string;
  text: string;
};

function parseMarkdownFile(filePath: string): ParsedChunk[] {
  const source = path.basename(filePath, ".md");
  const raw = fs.readFileSync(filePath, "utf8");
  const parts = raw.split(/\n(?=## )/);
  const chunks: ParsedChunk[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const lines = trimmed.split("\n");
    const first = lines[0].trim();
    if (first.startsWith("# ") && !first.startsWith("## ")) {
      // file-level H1 — skip as standalone unless it has body without ##
      const body = lines.slice(1).join("\n").trim();
      if (body && !body.includes("## ")) {
        chunks.push({
          source,
          title: first.replace(/^#\s+/, ""),
          text: body,
        });
      }
      continue;
    }

    if (first.startsWith("## ")) {
      const title = first.replace(/^##\s+/, "").trim();
      const text = lines.slice(1).join("\n").trim();
      if (title && text) {
        chunks.push({ source, title, text });
      }
    }
  }

  return chunks;
}

async function main() {
  await connectDB();

  const dir = path.resolve(process.cwd(), "content/knowledge");
  if (!fs.existsSync(dir)) {
    throw new Error(`Knowledge directory not found: ${dir}`);
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const parsed: ParsedChunk[] = [];
  for (const file of files) {
    parsed.push(...parseMarkdownFile(path.join(dir, file)));
  }

  console.log(`Parsed ${parsed.length} chunks from ${files.length} files`);

  let embeddings: number[][] = parsed.map(() => []);
  if (hasLlmKey()) {
    console.log("Embedding chunks via LLM provider…");
    const batchSize = 32;
    embeddings = [];
    for (let i = 0; i < parsed.length; i += batchSize) {
      const batch = parsed.slice(i, i + batchSize);
      const vecs = await embedTexts(batch.map((c) => `${c.title}\n${c.text}`));
      embeddings.push(...vecs);
    }
  } else {
    console.log("No LLM_API_KEY — storing chunks with empty embeddings (lexical search only)");
  }

  await KnowledgeChunk.deleteMany({});
  await KnowledgeChunk.insertMany(
    parsed.map((c, i) => ({
      source: c.source,
      title: c.title,
      text: c.text,
      embedding: embeddings[i] ?? [],
      metadata: {},
    }))
  );

  console.log(`Ingested ${parsed.length} knowledge chunks`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
