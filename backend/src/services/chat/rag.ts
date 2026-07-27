import { KnowledgeChunk } from "../../models/KnowledgeChunk";
import { embedQuery, hasLlmKey } from "./llm";

export type KnowledgeHit = {
  title: string;
  source: string;
  text: string;
  score: number;
};

function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || !b.length || a.length !== b.length) return -1;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return -1;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/** Simple lexical fallback when embeddings are unavailable (mock / empty key). */
function lexicalScore(query: string, text: string, title: string): number {
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9₹]+/)
    .filter((t) => t.length > 2);
  if (!tokens.length) return 0;
  const titleLower = title.toLowerCase();
  const hay = `${titleLower} ${text}`.toLowerCase();
  let hits = 0;
  for (const t of tokens) {
    if (titleLower.includes(t)) hits += 2.5;
    else if (hay.includes(t)) hits += 1;
  }
  // Synonym boosts for common store questions
  if (/\breturn|refund|exchange\b/.test(query.toLowerCase()) && /return|refund|exchange/.test(titleLower)) {
    hits += 2;
  }
  if (/\bship|delivery|dispatch\b/.test(query.toLowerCase()) && /ship|delivery|dispatch/.test(titleLower)) {
    hits += 2;
  }
  return hits / Math.max(tokens.length, 1);
}

export async function searchKnowledge(query: string, topK = 4): Promise<KnowledgeHit[]> {
  const chunks = await KnowledgeChunk.find().lean();
  if (!chunks.length) {
    return [];
  }

  if (hasLlmKey()) {
    try {
      const qVec = await embedQuery(query);
      return chunks
        .map((c) => ({
          title: c.title,
          source: c.source,
          text: c.text,
          score: cosineSimilarity(qVec, c.embedding),
        }))
        .filter((c) => c.score > 0.15)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
    } catch (err) {
      console.warn("[RAG] embedding search failed, falling back to lexical", err);
    }
  }

  return chunks
    .map((c) => ({
      title: c.title,
      source: c.source,
      text: c.text,
      score: lexicalScore(query, c.text, c.title),
    }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
