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

/** Tokenize English + Devanagari + currency for lexical RAG. */
function tokenize(query: string): string[] {
  const lower = query.toLowerCase();
  const parts = lower.split(/[^\p{L}\p{N}₹]+/u).filter((t) => t.length > 1);
  return [...new Set(parts)];
}

function lexicalScore(query: string, text: string, title: string): number {
  const tokens = tokenize(query);
  if (!tokens.length) return 0;
  const titleLower = title.toLowerCase();
  const hay = `${titleLower} ${text}`.toLowerCase();
  let hits = 0;
  for (const t of tokens) {
    if (titleLower.includes(t)) hits += 2.5;
    else if (hay.includes(t)) hits += 1;
  }
  const q = query.toLowerCase();
  if (
    (/return|refund|exchange|vapas|wapas/.test(q) || /वापस|वापिसी/.test(query)) &&
    /return|refund|exchange/.test(titleLower)
  ) {
    hits += 2;
  }
  if (
    (/ship|delivery|dispatch/.test(q) || /डिलीवरी|पहुंच/.test(query)) &&
    /ship|delivery|dispatch/.test(titleLower)
  ) {
    hits += 2;
  }
  return hits / Math.max(tokens.length, 1);
}

function normalize01(score: number, min: number, max: number): number {
  if (max <= min) return score > 0 ? 1 : 0;
  return Math.max(0, Math.min(1, (score - min) / (max - min)));
}

/**
 * Hybrid retrieval: mix vector + lexical when embeddings exist;
 * lexical-only otherwise. Supports Hindi tokens.
 */
export async function searchKnowledge(query: string, topK = 4): Promise<KnowledgeHit[]> {
  const chunks = await KnowledgeChunk.find().lean();
  if (!chunks.length) return [];

  const lexicalRaw = chunks.map((c) => ({
    title: c.title,
    source: c.source,
    text: c.text,
    lexical: lexicalScore(query, c.text, c.title),
  }));

  const lexMax = Math.max(...lexicalRaw.map((c) => c.lexical), 0.0001);

  let vectorScores: number[] | null = null;
  if (hasLlmKey()) {
    try {
      const qVec = await embedQuery(query);
      vectorScores = chunks.map((c) => cosineSimilarity(qVec, c.embedding));
    } catch (err) {
      console.warn("[RAG] embedding search failed, using lexical only", err);
    }
  }

  return lexicalRaw
    .map((c, i) => {
      const lexN = normalize01(c.lexical, 0, lexMax);
      if (vectorScores) {
        const vec = vectorScores[i];
        const vecN = vec > 0 ? vec : 0;
        const score = vecN > 0 ? 0.65 * vecN + 0.35 * lexN : lexN;
        return { title: c.title, source: c.source, text: c.text, score };
      }
      return { title: c.title, source: c.source, text: c.text, score: lexN };
    })
    .filter((c) => c.score > 0.08)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
