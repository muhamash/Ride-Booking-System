"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const checkAuth_middleware_1 = require("../../middlewares/checkAuth.middleware");
const checkUpdatePermission_middleware_1 = require("../../middlewares/checkUpdatePermission.middleware");
const user_interface_1 = require("../user/user.interface");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
router.get("/user/all", (0, checkAuth_middleware_1.checkAuth)(user_interface_1.UserRole.ADMIN), admin_controller_1.getAllUsers);
router.get("/user/:id", (0, checkAuth_middleware_1.checkAuth)(user_interface_1.UserRole.ADMIN), admin_controller_1.getUserById);
router.get("/driver/all", (0, checkAuth_middleware_1.checkAuth)(user_interface_1.UserRole.ADMIN), admin_controller_1.getAllDrivers);
router.get("/driver/:id", (0, checkAuth_middleware_1.checkAuth)(user_interface_1.UserRole.ADMIN), admin_controller_1.getDriverById);
router.get("/all-rides", (0, checkAuth_middleware_1.checkAuth)(user_interface_1.UserRole.ADMIN), admin_controller_1.getAllRides); //not tested
router.get("/ride/:id", (0, checkAuth_middleware_1.checkAuth)(user_interface_1.UserRole.ADMIN), admin_controller_1.getRideById); //not tested
router.patch("/suspend-driver/:id/:suspendParam", (0, checkAuth_middleware_1.checkAuth)(user_interface_1.UserRole.ADMIN), checkUpdatePermission_middleware_1.checkUpdatePermission, admin_controller_1.suspendDriverById);
router.patch("/block-user/:id/:blockParam", (0, checkAuth_middleware_1.checkAuth)(user_interface_1.UserRole.ADMIN), checkUpdatePermission_middleware_1.checkUpdatePermission, admin_controller_1.blockUserById);
router.patch("/approve-driver/:id/:approveParam", (0, checkAuth_middleware_1.checkAuth)(user_interface_1.UserRole.ADMIN), checkUpdatePermission_middleware_1.checkUpdatePermission, admin_controller_1.approvalDriver);
router.delete("/delete-blocked-user/:id", (0, checkAuth_middleware_1.checkAuth)(user_interface_1.UserRole.ADMIN), checkUpdatePermission_middleware_1.checkUpdatePermission, admin_controller_1.deleteBlockedUser);
router.delete("/ride/:id", (0, checkAuth_middleware_1.checkAuth)(user_interface_1.UserRole.ADMIN), checkUpdatePermission_middleware_1.checkUpdatePermission, admin_controller_1.deleteRide);
exports.adminRoutes = router;
