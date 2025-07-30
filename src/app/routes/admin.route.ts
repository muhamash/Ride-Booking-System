import { Router } from "express";
import { adminRoutes } from "../modules/admin/admin.route";

export const adminRouter = Router();

const moduleRouter = [
    {
        path: "/",
        route: adminRoutes
    }
];

moduleRouter.forEach(router => {
    adminRouter.use(router.path, router.route);
});