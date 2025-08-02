"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserService = exports.getUserByIdService = exports.createUserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("../../../config/env.config");
const App_error_1 = require("../../../config/errors/App.error");
const driver_model_1 = require("../driver/driver.model");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const createUserService = async (payload) => {
    const session = await mongoose_1.default.startSession();
    await session.startTransaction();
    const { email, ...rest } = payload;
    const existingUser = await user_model_1.User.findOne({ email }).session(session);
    if (existingUser) {
        throw new App_error_1.AppError(http_status_codes_1.default.CONFLICT, "User already exists with this email");
    }
    const userDocs = await user_model_1.User.create([{ email, ...rest }], { session });
    const createdUser = userDocs[0].toObject();
    delete createdUser.password;
    let createdDriver = null;
    if (createdUser.role === user_interface_1.UserRole.DRIVER) {
        const driverDocs = await driver_model_1.Driver.create([{
                user: createdUser._id,
                username: createdUser.username,
                vehicleInfo: payload.vehicleInfo,
            }], { session });
        if (!driverDocs?.length) {
            throw new App_error_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, "Failed to create driver");
        }
        // Link the driver to the user
        const updatedUser = await user_model_1.User.findByIdAndUpdate(createdUser._id, { driver: driverDocs[0]._id }, { new: true, session }).populate({ path: "driver", select: "-password" });
        createdDriver = updatedUser?.toObject();
        delete createdDriver.password;
    }
    await session.commitTransaction();
    session.endSession();
    return createdUser.role === user_interface_1.UserRole.DRIVER
        ? createdDriver
        : createdUser;
};
exports.createUserService = createUserService;
const getUserByIdService = async (userId) => {
    // console.log("Fetching user by ID:", userId);
    const user = await user_model_1.User.findById(userId).select("-password").populate("driver").populate('rideDetails')
        .populate('driverDetails').lean();
    if (!user) {
        // console.log("User not found with ID:", userId);
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return user;
};
exports.getUserByIdService = getUserByIdService;
const updateUserService = async (userId, payload) => {
    if (payload.password) {
        payload.password = await bcryptjs_1.default.hash(payload.password, env_config_1.envStrings.BCRYPT_SALT);
    }
    const newUpdatedUser = await user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }).lean();
    delete newUpdatedUser?.password;
    return newUpdatedUser;
};
exports.updateUserService = updateUserService;
