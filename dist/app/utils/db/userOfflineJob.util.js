"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleUserOfflineJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const user_model_1 = require("../../modules/user/user.model");
const scheduleUserOfflineJob = () => {
    node_cron_1.default.schedule("0 * * * *", async () => {
        const cutoff = new Date(Date.now() - 4 * 60 * 60 * 60 * 1000);
        await user_model_1.User.updateMany({ isOnline: true, lastOnlineAt: { $lt: cutoff } }, { isOnline: false });
        console.log("User offline check complete.");
    });
};
exports.scheduleUserOfflineJob = scheduleUserOfflineJob;
