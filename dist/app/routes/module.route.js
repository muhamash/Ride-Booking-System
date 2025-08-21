"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstVersionRouter = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
exports.firstVersionRouter = (0, express_1.Router)();
const moduleRouter = [
    {
        path: "/user",
        route: user_route_1.userRoute
    },
    {
        path: "/auth",
        route: auth_route_1.authRoute
    }
];
moduleRouter.forEach(router => {
    exports.firstVersionRouter.use(router.path, router.route);
});
