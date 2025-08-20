"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
require("../config/auth/passport.config");
const globalError_middleware_1 = require("./middlewares/globalError.middleware");
const notFoundRoute_middleware_1 = require("./middlewares/notFoundRoute.middleware");
const home_controller_1 = require("./modules/home/home.controller");
const admin_route_1 = require("./routes/admin.route");
const module_route_1 = require("./routes/module.route");
const service_route_1 = require("./routes/service.route");
const userOfflineJob_util_1 = require("./utils/db/userOfflineJob.util");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: "my-secret",
    resave: true,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
// user set offline job --> corn
(0, userOfflineJob_util_1.scheduleUserOfflineJob)();
// professional route
app.get("/", home_controller_1.homeRoute);
app.use("/api", module_route_1.firstVersionRouter);
app.use("/api", admin_route_1.adminRouter);
app.use("/api", service_route_1.riderRouter);
// global not found routes
app.use(notFoundRoute_middleware_1.globalNotFoundResponse);
// global error handler
app.use(globalError_middleware_1.globalErrorResponse);
exports.default = app;
