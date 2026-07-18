"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authRequired);
router.get("/", order_controller_1.listMyOrders);
router.get("/:id", order_controller_1.getMyOrder);
exports.default = router;
//# sourceMappingURL=order.routes.js.map