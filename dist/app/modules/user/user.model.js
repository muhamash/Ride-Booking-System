"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = exports.locationSchema = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const env_config_1 = require("../../../config/env.config");
const helperr_util_1 = require("../../utils/helperr.util");
const driver_model_1 = require("../driver/driver.model");
const user_interface_1 = require("./user.interface");
exports.locationSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
    },
    coordinates: {
        type: [Number],
        default: [0, 0]
    },
    address: {
        type: String
    }
});
exports.userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [5, 'Password must be at least 5 characters long'],
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(user_interface_1.UserRole),
        default: user_interface_1.UserRole.RIDER
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    driver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Driver",
        default: null
    },
    lastOnlineAt: {
        type: Date,
        default: Date.now,
    },
    location: exports.locationSchema,
    vehicleInfo: {
        type: mongoose_1.Schema.Types.Mixed,
        default: null,
        required: function () {
            return this.role === user_interface_1.UserRole.DRIVER;
        },
    }
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcryptjs_1.default.hash(this.password, Number(env_config_1.envStrings.BCRYPT_SALT));
    }
    if (this.isModified("email") || this.isNew) {
        this.username = (0, helperr_util_1.generateSlug)(this.email, this.role);
    }
    next();
});
exports.userSchema.pre("findOneAndDelete", async function (next) {
    const userId = this.getQuery()._id;
    if (userId) {
        await driver_model_1.Driver.deleteMany({ user: userId });
    }
    next();
});
exports.User = (0, mongoose_1.model)("User", exports.userSchema);
