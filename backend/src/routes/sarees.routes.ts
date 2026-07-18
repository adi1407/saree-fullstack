import { Router } from "express";
import { listSarees, getSareeBySlug, getWeaves, getFacets } from "../controllers/sarees.controller";

const router = Router();

router.get("/", listSarees);
router.get("/weaves", getWeaves);
router.get("/facets", getFacets);
router.get("/:slug", getSareeBySlug);

export default router;
