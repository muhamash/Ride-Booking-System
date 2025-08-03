"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeRouter = void 0;
const express_1 = require("express");
const home_controller_1 = require("./home.controller");
exports.homeRouter = (0, express_1.Router)();
exports.homeRouter.get("/", home_controller_1.homeRoute);
