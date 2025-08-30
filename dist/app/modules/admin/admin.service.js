"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveDriverService = exports.deleteRideService = exports.deleteBlockedUserService = exports.blockUserByIdService = exports.suspendDriverIdService = exports.getRideByIdService = exports.allRideService = exports.getDriverByIdService = exports.getAllDriversServices = exports.getUserByIdService = exports.getAllUsersService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const App_error_1 = require("../../../config/errors/App.error");
const queybuilder_util_1 = require("../../utils/db/queybuilder.util");
const driver_model_1 = require("../driver/driver.model");
const river_interface_1 = require("../driver/river.interface");
const ride_interface_1 = require("../ride/ride.interface");
const ride_model_1 = require("../ride/ride.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const admin_constrain_1 = require("./admin.constrain");
const getAllUsersService = async (query) => {
    const modelQuery = new queybuilder_util_1.QueryBuilder(user_model_1.User.find().populate("driver").select("-password"), query);
    const users = modelQuery.searchableField(admin_constrain_1.searchableFields).filter(admin_constrain_1.excludeField).sort().fields().pagination();
    const [data, meta] = await Promise.all([
        users.modelQuery.exec(),
        modelQuery.getMeta()
    ]);
    console.log(query);
    return {
        data,
        meta,
    };
};
exports.getAllUsersService = getAllUsersService;
const getUserByIdService = async (userId) => {
    const user = await user_model_1.User.findById(userId)
        .populate([
        { path: "driver", populate: { path: "rides", select: "fare createdAt status" } },
        { path: "rideDetails", select: "fare status createdAt" },
        { path: "driverDetails", select: "name email" },
    ])
        .select("-password")
        .lean();
    if (!user)
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "User not found");
    let stats = {};
    if (user.role === "DRIVER" && user.driver && typeof user.driver !== "string") {
        const driverData = user.driver;
        stats = {
            totalRides: driverData.totalRides,
            totalEarnings: driverData.totalEarnings,
            averageRating: driverData.rating?.averageRating || 0,
            ratingsCount: driverData.rating?.totalRatings || 0,
            earningsChart: driverData.rides?.map((ride) => ({
                date: ride.createdAt,
                fare: ride.fare,
            })),
        };
    }
    else {
        stats = {
            totalTrips: Array.isArray(user.ridings) ? user.ridings.length : 0,
            totalSpent: user.rideDetails?.reduce((acc, r) => acc + (r.fare || 0), 0) || 0,
            tripHistoryChart: user.rideDetails?.map((r) => ({
                date: r.createdAt,
                fare: r.fare,
            })),
        };
    }
    return { user, stats };
};
exports.getUserByIdService = getUserByIdService;
const getAllDriversServices = async (query) => {
    const modelQuery = new queybuilder_util_1.QueryBuilder(driver_model_1.Driver.find().populate("user"), query);
    const users = modelQuery.searchableField(admin_constrain_1.driverSearchableFields).filter(admin_constrain_1.excludeField).sort().fields().pagination();
    const [data, meta] = await Promise.all([
        users.modelQuery.exec(),
        modelQuery.getMeta()
    ]);
    console.log(data);
    return {
        data,
        meta,
    };
};
exports.getAllDriversServices = getAllDriversServices;
const getDriverByIdService = async (userId) => {
    // console.log( userId );
    const user = await driver_model_1.Driver.findOne({ user: new mongoose_1.default.Types.ObjectId(userId) }).populate("user");
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "driver not found");
    }
    return user;
};
exports.getDriverByIdService = getDriverByIdService;
const allRideService = async (query) => {
    // console.log(query)
    const modelQuery = new queybuilder_util_1.QueryBuilder(ride_model_1.Ride.find().populate("driver").populate("rider").select("-password"), query);
    const rides = modelQuery.searchableField(["riderUserName", "driverUserName", "status"]).filter(admin_constrain_1.excludeField).sort().fields().pagination();
    const [data, meta] = await Promise.all([
        rides.modelQuery.exec(),
        modelQuery.getMeta()
    ]);
    // console.log(users)
    return {
        data,
        meta,
    };
};
exports.allRideService = allRideService;
const getRideByIdService = async (rideId) => {
    const ride = await ride_model_1.Ride.findById(rideId).populate("rider").populate("driver").select("-password");
    console.log(rideId, ride);
    if (!ride) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "ride not found");
    }
    console.log(ride);
    return ride;
};
exports.getRideByIdService = getRideByIdService;
const suspendDriverIdService = async (userId, param) => {
    // console.log( userId , param !== 'suspend', param, param !== 'rollback');
    const user = await driver_model_1.Driver.findOne({ user: new mongoose_1.default.Types.ObjectId(userId) });
    if (!param || (param !== 'suspend' && param !== 'rollback')) {
        throw new App_error_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, `invalid suspendParam: ${param}`);
    }
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "driver not found");
    }
    if (param === "suspend" && user.driverStatus === river_interface_1.DriverStatus.SUSPENDED) {
        throw new App_error_1.AppError(http_status_codes_1.default.CONFLICT, " driver already suspended!!");
    }
    if (param === "rollback" && user.driverStatus === river_interface_1.DriverStatus.AVAILABLE) {
        throw new App_error_1.AppError(http_status_codes_1.default.CONFLICT, " driver already available!!");
    }
    if (param === "suspend" && user.driverStatus === river_interface_1.DriverStatus.RIDING) {
        throw new App_error_1.AppError(http_status_codes_1.default.CONFLICT, " driver already working!! wait to be available first!!");
    }
    console.log(user, param, user.driverStatus !== river_interface_1.DriverStatus.AVAILABLE);
    let updateDriver;
    if (param === "rollback" && user.driverStatus !== river_interface_1.DriverStatus.AVAILABLE) {
        updateDriver = await driver_model_1.Driver
            .findOneAndUpdate({ user: new mongoose_1.default.Types.ObjectId(userId) }, { $set: { driverStatus: river_interface_1.DriverStatus.AVAILABLE } }, { new: true }).populate("user");
        console.log(updateDriver, "dfasfsdf");
        if (updateDriver) {
            const updatedTheUser = await user_model_1.User.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(userId), {
                $set: { isBlocked: false }
            }, { new: true }).populate("driver");
            return updatedTheUser;
        }
        else {
            throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Failed to update  the driver");
        }
    }
    if (param === "suspend" && user.driverStatus !== river_interface_1.DriverStatus.SUSPENDED) {
        updateDriver = await driver_model_1.Driver
            .findOneAndUpdate({ user: new mongoose_1.default.Types.ObjectId(userId) }, { $set: { driverStatus: river_interface_1.DriverStatus.SUSPENDED } }, { new: true }).populate("user");
        if (updateDriver) {
            const updatedTheUser = await user_model_1.User.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(userId), {
                $set: { isBlocked: true }
            }, { new: true }).populate("driver");
            console.log(updateDriver, updatedTheUser);
            return updatedTheUser;
        }
        else {
            throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Failed to update  the driver");
        }
    }
};
exports.suspendDriverIdService = suspendDriverIdService;
const blockUserByIdService = async (userId, param) => {
    // console.log( param, !param || param !== 'block' || param !== 'rollback' );
    const user = await user_model_1.User.findById(new mongoose_1.default.Types.ObjectId(userId));
    if (!param || (param !== 'block' && param !== 'rollback')) {
        throw new App_error_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, `invalid blockParam: ${param}`);
    }
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, " user not found");
    }
    if (param === "block" && user.isBlocked) {
        throw new App_error_1.AppError(http_status_codes_1.default.CONFLICT, " user already blocked!!");
    }
    if (param === "rollback" && !user.isBlocked) {
        throw new App_error_1.AppError(http_status_codes_1.default.CONFLICT, " user already unblocked!!");
    }
    let updatedTheUser;
    if (param === "rollback" && user.isBlocked) {
        updatedTheUser = await user_model_1.User.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(userId), {
            $set: { isBlocked: false }
        }, { new: true }).populate("driver");
    }
    if (param === "block" && !user.isBlocked) {
        updatedTheUser = await user_model_1.User.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(userId), {
            $set: { isBlocked: true }
        }, { new: true }).populate("driver");
    }
    if (updatedTheUser?.role === user_interface_1.UserRole.DRIVER) {
        updatedTheUser = await driver_model_1.Driver.findOneAndUpdate({ user: new mongoose_1.default.Types.ObjectId(userId) }, {
            $set: { driverStatus: river_interface_1.DriverStatus.SUSPENDED }
        }, { new: true }).populate("user");
        return updatedTheUser;
    }
};
exports.blockUserByIdService = blockUserByIdService;
const deleteBlockedUserService = async (userId) => {
    const findUser = await user_model_1.User.findById(userId);
    if (!findUser) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "user not found");
    }
    if (findUser?.isBlocked) {
        await user_model_1.User.findOneAndDelete({ _id: userId });
        return findUser;
    }
    else {
        throw new App_error_1.AppError(http_status_codes_1.default.UNPROCESSABLE_ENTITY, "User is not blocked!! to delete a user please block the user!");
    }
};
exports.deleteBlockedUserService = deleteBlockedUserService;
const deleteRideService = async (rideId) => {
    const findRide = await ride_model_1.Ride.findOne({ _id: rideId });
    if (!findRide) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "ride not found");
    }
    if (findRide.status !== ride_interface_1.RideStatus.COMPLETED) {
        throw new App_error_1.AppError(http_status_codes_1.default.FORBIDDEN, `Cannot delete ride with status: ${findRide.status}. Only COMPLETED rides can be deleted.`);
    }
    if (findRide) {
        await ride_model_1.Ride.deleteOne({ _id: rideId });
        return findRide;
    }
    else {
        throw new App_error_1.AppError(http_status_codes_1.default.UNPROCESSABLE_ENTITY, "can not delete the ride");
    }
};
exports.deleteRideService = deleteRideService;
const approveDriverService = async (driverId, param) => {
    // console.log( userId );
    const driver = await driver_model_1.Driver.findOne({ user: new mongoose_1.default.Types.ObjectId(driverId) });
    if (!param || (param !== 'approved' && param !== 'notApproved')) {
        throw new App_error_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, `invalid approvalParam: ${param}`);
    }
    if (!driver) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, " driver not found");
    }
    if (param === "notApproved" && !driver.isApproved) {
        throw new App_error_1.AppError(http_status_codes_1.default.CONFLICT, " driver already notApproved!!");
    }
    if (param === "approved" && driver.isApproved) {
        throw new App_error_1.AppError(http_status_codes_1.default.CONFLICT, " driver already approved!!");
    }
    let updatedTheDriver;
    if (param === "notApproved" && driver.isApproved) {
        updatedTheDriver = await driver_model_1.Driver.findOneAndUpdate({ user: new mongoose_1.default.Types.ObjectId(driverId) }, {
            $set: { isApproved: false, driverStatus: river_interface_1.DriverStatus.NOTAPPROVED }
        }, { new: true });
    }
    if (param === "approved" && !driver.isApproved) {
        updatedTheDriver = await driver_model_1.Driver.findOneAndUpdate({ user: new mongoose_1.default.Types.ObjectId(driverId) }, {
            $set: { isApproved: true, driverStatus: river_interface_1.DriverStatus.APPROVED }
        }, { new: true });
    }
    // console.log( driver, updatedTheDriver, driver.isApproved, param === "approved", param )
    return updatedTheDriver;
};
exports.approveDriverService = approveDriverService;
