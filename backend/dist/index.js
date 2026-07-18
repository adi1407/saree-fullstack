"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const connect_1 = require("./db/connect");
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const sarees_routes_1 = __importDefault(require("./routes/sarees.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const checkout_routes_1 = __importDefault(require("./routes/checkout.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const webhook_routes_1 = __importDefault(require("./routes/webhook.routes"));
const razorpay_service_1 = require("./services/razorpay.service");
const shiprocket_service_1 = require("./services/shiprocket.service");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
// Razorpay webhook needs raw body for signature verification
app.use("/api/webhooks/razorpay", express_1.default.raw({ type: "application/json" }), (req, _res, next) => {
    req.rawBody = req.body?.toString("utf8");
    try {
        req.body = JSON.parse(req.rawBody || "{}");
    }
    catch {
        req.body = {};
    }
    next();
});
app.use(express_1.default.json({ limit: "2mb" }));
app.use((0, cookie_parser_1.default)());
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.get("/health", (_req, res) => {
    res.json({ success: true, message: "API is running" });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/sarees", sarees_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/checkout", checkout_routes_1.default);
app.use("/api/orders", order_routes_1.default);
app.use("/api/webhooks", webhook_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/admin/upload", upload_routes_1.default);
app.use(error_middleware_1.errorHandler);
async function start() {
    await (0, connect_1.connectDB)();
    if (razorpay_service_1.RAZORPAY_MOCK) {
        console.log("[Razorpay] MOCK MODE — set RAZORPAY_KEY_ID to enable real payments");
    }
    if (shiprocket_service_1.SHIPROCKET_MOCK) {
        console.log("[Shiprocket] MOCK MODE — set SHIPROCKET_EMAIL to enable real shipping");
    }
    app.listen(env_1.env.PORT, () => {
        console.log(`Server running on http://localhost:${env_1.env.PORT}`);
    });
}
start().catch(console.error);
//# sourceMappingURL=index.js.map