"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.post("/logout", auth_controller_1.logout);
router.get("/me", auth_middleware_1.authRequired, auth_controller_1.me);
router.get("/addresses", auth_middleware_1.authRequired, auth_controller_1.listAddresses);
router.post("/addresses", auth_middleware_1.authRequired, auth_controller_1.addAddress);
router.patch("/addresses/:id", auth_middleware_1.authRequired, auth_controller_1.updateAddress);
router.delete("/addresses/:id", auth_middleware_1.authRequired, auth_controller_1.deleteAddress);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map