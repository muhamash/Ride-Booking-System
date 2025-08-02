"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riderRouter = void 0;
const express_1 = require("express");
const driver_route_1 = require("../modules/driver/driver.route");
const ride_route_1 = require("../modules/ride/ride.route");
exports.riderRouter = (0, express_1.Router)();
const riderRoute = [
    {
        path: "/ride",
        route: ride_route_1.rideRoutes
    },
    {
        path: "/driver",
        route: driver_route_1.driverRoutes
    }
];
riderRoute.forEach(router => {
    exports.riderRouter.use(router.path, router.route);
});
