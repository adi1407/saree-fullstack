"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sarees_controller_1 = require("../controllers/sarees.controller");
const router = (0, express_1.Router)();
router.get("/", sarees_controller_1.listSarees);
router.get("/weaves", sarees_controller_1.getWeaves);
router.get("/facets", sarees_controller_1.getFacets);
router.get("/:slug", sarees_controller_1.getSareeBySlug);
exports.default = router;
//# sourceMappingURL=sarees.routes.js.map