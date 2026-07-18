"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequired = authRequired;
exports.adminRequired = adminRequired;
exports.optionalAuth = optionalAuth;
const jwt_1 = require("../utils/jwt");
const error_middleware_1 = require("./error.middleware");
function authRequired(req, _res, next) {
    const token = req.cookies?.token;
    if (!token) {
        next(new error_middleware_1.AppError("Authentication required", 401));
        return;
    }
    try {
        req.user = (0, jwt_1.verifyToken)(token);
        next();
    }
    catch {
        next(new error_middleware_1.AppError("Invalid or expired token", 401));
    }
}
function adminRequired(req, _res, next) {
    if (!req.user || req.user.role !== "admin") {
        next(new error_middleware_1.AppError("Admin access required", 403));
        return;
    }
    next();
}
function optionalAuth(req, _res, next) {
    const token = req.cookies?.token;
    if (token) {
        try {
            req.user = (0, jwt_1.verifyToken)(token);
        }
        catch {
            // ignore invalid token
        }
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map