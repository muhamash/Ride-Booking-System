"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleUserOfflineJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const driver_model_1 = require("../../modules/driver/driver.model");
const river_interface_1 = require("../../modules/driver/river.interface");
const user_interface_1 = require("../../modules/user/user.interface");
const user_model_1 = require("../../modules/user/user.model");
const scheduleUserOfflineJob = () => {
    node_cron_1.default.schedule("0 * * * *", async () => {
        const cutoff = new Date(Date.now() - 4 * 60 * 60 * 1000);
        // Find users who are online but inactive
        const inactiveUsers = await user_model_1.User.find({
            isOnline: true,
            lastOnlineAt: { $lt: cutoff },
        });
        for (const user of inactiveUsers) {
            user.isOnline = false;
            await user.save();
            // If driver
            if (user.role === user_interface_1.UserRole.DRIVER && user.driver) {
                await driver_model_1.Driver.findByIdAndUpdate(user.driver, {
                    driverStatus: river_interface_1.DriverStatus.UNAVAILABLE,
                });
            }
        }
        console.log(`[CRON] User offline sync complete. Total: ${inactiveUsers.length}`);
    });
};
exports.scheduleUserOfflineJob = scheduleUserOfflineJob;
