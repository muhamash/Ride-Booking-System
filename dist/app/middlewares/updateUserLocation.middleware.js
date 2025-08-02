"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserLocationIntoDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const river_interface_1 = require("../modules/driver/river.interface");
const ride_model_1 = require("../modules/ride/ride.model");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const controller_util_1 = require("../utils/controller.util");
exports.updateUserLocationIntoDb = (0, controller_util_1.asyncHandler)(async (req, res, next) => {
    const userLocation = req.userLocation;
    const user = req.user;
    if (!user || !userLocation) {
        return next();
    }
    // Type guard to ensure user has required properties
    if (!('username' in user)) {
        throw new Error("User object is missing required properties");
    }
    const activeDrivers = await user_model_1.User.find({ isOnline: true, role: user_interface_1.UserRole.DRIVER }, { location: 1, username: 1, _id: 1, name: 1, email: 1 })
        .select("-password")
        .populate("driver", "driverStatus isApproved vehicleInfo rating _id")
        .lean();
    // Filter for AVAILABLE drivers only
    const availableDrivers = activeDrivers.filter((user) => user.driver?.driverStatus === river_interface_1.DriverStatus.AVAILABLE);
    // Create final payload with proper typing
    const activeDriverPayload = availableDrivers.map((user) => ({
        driverId: user.driver._id.toString(),
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
        location: user.location,
        isApproved: user.driver.isApproved,
        avgRating: user.driver.rating?.averageRating || 0,
        vehicleInfo: user.driver.vehicleInfo || {},
    }));
    req.activeDriverPayload = activeDriverPayload;
    await user_model_1.User.findOneAndUpdate({ username: user.username }, { $set: { location: userLocation } }, { new: true });
    if (!('_id' in user) || !('username' in user) || !('role' in user)) {
        throw new Error("User object is missing required properties");
    }
    ;
    if (user.role === user_interface_1.UserRole.DRIVER) {
        await ride_model_1.Ride.findOneAndUpdate({ driver: new mongoose_1.default.Types.ObjectId(user?._id) }, { $set: { driverLocation: userLocation } }, { new: true });
    }
    return next();
});
