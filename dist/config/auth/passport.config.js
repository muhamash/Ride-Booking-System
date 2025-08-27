"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const driver_model_1 = require("../../app/modules/driver/driver.model");
const river_interface_1 = require("../../app/modules/driver/river.interface");
const user_interface_1 = require("../../app/modules/user/user.interface");
const user_model_1 = require("../../app/modules/user/user.model");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
}, async (req, email, password, done) => {
    try {
        const userLocation = req.userLocation;
        const user = await user_model_1.User.findOne({ email }).populate("driver");
        let response;
        if (!user) {
            return done(null, false, { message: "Invalid email or password" });
        }
        if (user.isBlocked) {
            return done(null, false, { message: "Your account is blocked", flag: "BLOCKED", userId: user._id });
        }
        if (user?.driver?.driverStatus === river_interface_1.DriverStatus.SUSPENDED) {
            return done(null, false, { message: "Your driver account is SUSPENDED", flag: "SUSPENDED", userId: user._id });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: "Invalid email or password" });
        }
        response = await user_model_1.User.findOneAndUpdate({ _id: user._id }, {
            $set: {
                isOnline: true,
                location: userLocation,
                lastOnlineAt: new Date(),
            },
        }, { new: true })
            .populate("driver")
            .select("-password");
        if (response?.role === user_interface_1.UserRole.DRIVER) {
            response = await driver_model_1.Driver.findOneAndUpdate({ user: user._id }, { $set: { driverStatus: river_interface_1.DriverStatus.AVAILABLE } }, { new: true }).populate("user", "email name role location lastOnlineAt username");
        }
        if (!response) {
            return done(null, false, { message: "User not found" });
        }
        // console.log("User logged in:", response, req.userLocation);
        return done(null, response);
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.serializeUser((user, done) => {
    console.log("serializing the user", user);
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        console.log(id);
        const user = await user_model_1.User.findById(id);
        done(null, user || false);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
});
