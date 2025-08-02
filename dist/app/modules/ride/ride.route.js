"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideRoutes = void 0;
const express_1 = require("express");
const checkAuth_middleware_1 = require("../../middlewares/checkAuth.middleware");
const updateUserLocation_middleware_1 = require("../../middlewares/updateUserLocation.middleware");
const validateReq_middleware_1 = require("../../middlewares/validateReq.middleware");
const user_interface_1 = require("../user/user.interface");
const ride_controller_1 = require("./ride.controller");
const ride_validation_1 = require("./ride.validation");
const router = (0, express_1.Router)();
router.post("/request", (0, checkAuth_middleware_1.checkAuth)(user_interface_1.UserRole.RIDER, user_interface_1.UserRole.ADMIN), updateUserLocation_middleware_1.updateUserLocationIntoDb, (0, validateReq_middleware_1.validateRequest)(ride_validation_1.zodRideRequest), ride_controller_1.requestRide);
router.post("/rating", (0, checkAuth_middleware_1.checkAuth)(user_interface_1.UserRole.RIDER, user_interface_1.UserRole.ADMIN)); //extra feature route
exports.rideRoutes = router;
