import { Router } from "express";
import { rideRoutes } from "../modules/ride/ride.route";

export const riderRouter = Router();

const riderRoute = [
    {
        path: "/ride",
        route: rideRoutes
    }
];

riderRoute.forEach(router => {
    riderRouter.use(router.path, router.route);
});