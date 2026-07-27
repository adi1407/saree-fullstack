import mongoose, { Schema, Document } from "mongoose";

export interface IKnowledgeChunk extends Document {
  source: string;
  title: string;
  text: string;
  embedding: number[];
  metadata: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const knowledgeChunkSchema = new Schema<IKnowledgeChunk>(
  {
    source: { type: String, required: true, index: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    metadata: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

knowledgeChunkSchema.index({ source: 1, title: 1 });

export const KnowledgeChunk = mongoose.model<IKnowledgeChunk>(
  "KnowledgeChunk",
  knowledgeChunkSchema
);
