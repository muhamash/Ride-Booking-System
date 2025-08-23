"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const admin_route_1 = require("../modules/admin/admin.route");
exports.adminRouter = (0, express_1.Router)();
const moduleRouter = [
    {
        path: "/admin",
        route: admin_route_1.adminRoutes
    }
];
moduleRouter.forEach(router => {
    exports.adminRouter.use(router.path, router.route);
});
