"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeaves = exports.getSareeBySlug = exports.getFacets = exports.listSarees = void 0;
const Saree_1 = require("../models/Saree");
const asyncHandler_1 = require("../utils/asyncHandler");
const error_middleware_1 = require("../middleware/error.middleware");
function buildCatalogFilter(query, exclude) {
    const filter = { isPublished: true };
    if (query.weave && exclude !== "weave")
        filter.weave = query.weave;
    if (query.occasion && exclude !== "occasion")
        filter.occasion = query.occasion;
    if (query.color && exclude !== "color") {
        filter["colors.primary"] = new RegExp(String(query.color), "i");
    }
    if (query.fabric && exclude !== "fabric")
        filter.fabric = query.fabric;
    if (exclude !== "price" && (query.minPrice || query.maxPrice)) {
        filter.price = {};
        if (query.minPrice)
            filter.price.$gte = Number(query.minPrice);
        if (query.maxPrice)
            filter.price.$lte = Number(query.maxPrice);
    }
    if (query.newArrival === "true")
        filter.isNewArrival = true;
    if (query.inStock === "true")
        filter.inventory = { $gt: 0 };
    if (query.blouseIncluded === "true")
        filter.blouseIncluded = true;
    if (query.search) {
        filter.$text = { $search: String(query.search) };
    }
    return filter;
}
function buildSearchMatch(query, exclude) {
    const filter = buildCatalogFilter({ ...query, search: undefined }, exclude);
    if (query.search) {
        const term = String(query.search).trim();
        if (term) {
            const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            filter.$or = [{ name: regex }, { description: regex }];
        }
    }
    return filter;
}
const sortMap = {
    featured: { isNewArrival: -1, createdAt: -1 },
    newest: { createdAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
};
exports.listSarees = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { weave, occasion, minPrice, maxPrice, color, fabric, sort = "featured", page = "1", limit = "12", search, newArrival, inStock, blouseIncluded, } = req.query;
    const catalogQuery = {
        weave: weave,
        occasion: occasion,
        minPrice: minPrice,
        maxPrice: maxPrice,
        color: color,
        fabric: fabric,
        search: search,
        newArrival: newArrival,
        inStock: inStock,
        blouseIncluded: blouseIncluded,
    };
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(48, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;
    const sortKey = String(sort);
    const sortOption = sortMap[sortKey] || sortMap.featured;
    let filter = buildCatalogFilter(catalogQuery);
    let sarees = await Saree_1.Saree.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean();
    let total = await Saree_1.Saree.countDocuments(filter);
    if (catalogQuery.search && total === 0) {
        filter = buildSearchMatch(catalogQuery);
        sarees = await Saree_1.Saree.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean();
        total = await Saree_1.Saree.countDocuments(filter);
    }
    res.json({
        success: true,
        data: sarees,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
        },
    });
});
exports.getFacets = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { weave, occasion, minPrice, maxPrice, color, fabric, search, newArrival, inStock, blouseIncluded, } = req.query;
    const catalogQuery = {
        weave: weave,
        occasion: occasion,
        minPrice: minPrice,
        maxPrice: maxPrice,
        color: color,
        fabric: fabric,
        search: search,
        newArrival: newArrival,
        inStock: inStock,
        blouseIncluded: blouseIncluded,
    };
    const baseMatch = catalogQuery.search
        ? buildSearchMatch(catalogQuery)
        : buildCatalogFilter(catalogQuery);
    const [weaves, occasions, colors, fabrics, priceStats] = await Promise.all([
        Saree_1.Saree.aggregate([
            { $match: catalogQuery.search ? buildSearchMatch(catalogQuery, "weave") : buildCatalogFilter(catalogQuery, "weave") },
            { $group: { _id: "$weave", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        Saree_1.Saree.aggregate([
            { $match: catalogQuery.search ? buildSearchMatch(catalogQuery, "occasion") : buildCatalogFilter(catalogQuery, "occasion") },
            { $unwind: "$occasion" },
            { $group: { _id: "$occasion", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        Saree_1.Saree.aggregate([
            { $match: catalogQuery.search ? buildSearchMatch(catalogQuery, "color") : buildCatalogFilter(catalogQuery, "color") },
            { $group: { _id: "$colors.primary", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        Saree_1.Saree.aggregate([
            { $match: catalogQuery.search ? buildSearchMatch(catalogQuery, "fabric") : buildCatalogFilter(catalogQuery, "fabric") },
            { $group: { _id: "$fabric", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        Saree_1.Saree.aggregate([
            { $match: baseMatch },
            {
                $group: {
                    _id: null,
                    min: { $min: "$price" },
                    max: { $max: "$price" },
                },
            },
        ]),
    ]);
    res.json({
        success: true,
        data: {
            weaves: weaves.map((w) => ({ value: w._id, count: w.count })),
            occasions: occasions.map((o) => ({ value: o._id, count: o.count })),
            colors: colors.map((c) => ({ value: c._id, count: c.count })),
            fabrics: fabrics.map((f) => ({ value: f._id, count: f.count })),
            priceRange: {
                min: priceStats[0]?.min ?? 0,
                max: priceStats[0]?.max ?? 0,
            },
        },
    });
});
exports.getSareeBySlug = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const saree = await Saree_1.Saree.findOne({ slug: req.params.slug, isPublished: true }).lean();
    if (!saree)
        throw new error_middleware_1.AppError("Saree not found", 404);
    const similar = await Saree_1.Saree.find({
        isPublished: true,
        weave: saree.weave,
        _id: { $ne: saree._id },
    })
        .limit(4)
        .lean();
    res.json({ success: true, data: { saree, similar } });
});
exports.getWeaves = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const weaves = await Saree_1.Saree.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: "$weave", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data: weaves });
});
//# sourceMappingURL=sarees.controller.js.map