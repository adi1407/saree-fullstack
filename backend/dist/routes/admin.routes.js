"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authRequired, auth_middleware_1.adminRequired);
router.get("/stats", admin_controller_1.getStats);
router.get("/sarees", admin_controller_1.listAllSarees);
router.post("/sarees", admin_controller_1.createSaree);
router.patch("/sarees/:id", admin_controller_1.updateSaree);
router.delete("/sarees/:id", admin_controller_1.deleteSaree);
router.patch("/sarees/:id/toggle-publish", admin_controller_1.togglePublish);
router.get("/orders", admin_controller_1.listOrders);
router.get("/orders/:id", admin_controller_1.getOrder);
router.patch("/orders/:id/status", admin_controller_1.updateOrderStatus);
router.post("/orders/:id/ship", admin_controller_1.createOrderShipment);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map