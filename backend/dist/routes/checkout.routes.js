"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_controller_1 = require("../controllers/checkout.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/config", checkout_controller_1.getCheckoutConfig);
router.get("/quote", auth_middleware_1.authRequired, checkout_controller_1.getCheckoutQuote);
router.post("/create", auth_middleware_1.authRequired, checkout_controller_1.createCheckout);
router.post("/verify", auth_middleware_1.authRequired, checkout_controller_1.verifyPayment);
router.post("/mock-pay", auth_middleware_1.authRequired, checkout_controller_1.mockPay);
exports.default = router;
//# sourceMappingURL=checkout.routes.js.map