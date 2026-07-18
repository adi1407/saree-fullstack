import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { AppError } from "./error.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authRequired(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.token;
  if (!token) {
    next(new AppError("Authentication required", 401));
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}

export function adminRequired(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== "admin") {
    next(new AppError("Admin access required", 403));
    return;
  }
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.token;
  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      // ignore invalid token
    }
  }
  next();
}
