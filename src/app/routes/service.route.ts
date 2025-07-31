import { Router } from "express";
import { driverRoutes } from "../modules/driver/driver.route";
import { rideRoutes } from "../modules/ride/ride.route";

export const riderRouter = Router();

const riderRoute = [
    {
        path: "/ride",
        route: rideRoutes
    },
    {
        path: "/driver",
        route: driverRoutes
    }
];

riderRoute.forEach(router => {
    riderRouter.use(router.path, router.route);
});