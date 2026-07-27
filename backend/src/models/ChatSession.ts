import mongoose, { Schema, Document, Types } from "mongoose";

export type ChatMessageRole = "system" | "user" | "assistant" | "tool";

export interface IChatMessage {
  role: ChatMessageRole;
  content: string;
  toolCallId?: string;
  toolName?: string;
  name?: string;
  toolCalls?: Array<{
    id: string;
    name: string;
    arguments: string;
  }>;
  createdAt: Date;
}

export interface IChatSession extends Document {
  sessionId: string;
  userId?: Types.ObjectId;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  /** TTL: Mongo removes the document once this passes. */
  expiresAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    role: {
      type: String,
      enum: ["system", "user", "assistant", "tool"],
      required: true,
    },
    content: { type: String, default: "" },
    toolCallId: String,
    toolName: String,
    name: String,
    toolCalls: [
      {
        id: String,
        name: String,
        arguments: String,
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const chatSessionSchema = new Schema<IChatSession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    messages: { type: [chatMessageSchema], default: [] },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

chatSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ChatSession = mongoose.model<IChatSession>("ChatSession", chatSessionSchema);

/** Default session lifetime: 7 days */
export const CHAT_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
