import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

interface MongoLikeError extends Error {
  name: string;
  code?: number;
  keyValue?: Record<string, unknown>;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues,
    });
    return;
  }

  const mongoErr = err as MongoLikeError;

  // Invalid ObjectId / type coercion (e.g. bad :id param).
  if (mongoErr.name === "CastError") {
    res.status(400).json({ success: false, message: "Invalid identifier" });
    return;
  }

  // Mongoose schema validation.
  if (mongoErr.name === "ValidationError") {
    res.status(400).json({ success: false, message: "Validation failed" });
    return;
  }

  // Duplicate unique key (e.g. email/phone already registered).
  if (mongoErr.code === 11000) {
    const field = mongoErr.keyValue ? Object.keys(mongoErr.keyValue)[0] : "value";
    res.status(409).json({ success: false, message: `That ${field} is already in use` });
    return;
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
}
