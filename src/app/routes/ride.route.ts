import { Router } from "express";
import { adminRoutes } from "../modules/admin/admin.route";

export const riderRouter = Router();

const riderRoute = [
    {
        path: "/ride",
        route: adminRoutes
    }
];

riderRoute.forEach(router => {
    riderRouter.use(router.path, router.route);
});