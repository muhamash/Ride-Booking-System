import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { UserRole } from "../user/user.interface";
import { blockUserById, deleteBlockedUser, deleteRide, getAllDrivers, getAllRides, getAllUsers, getDriverById, getRideById, getUserById, suspendDriverById } from "./admin.controller";


const router = Router();

router.get( "/user/all", checkAuth( UserRole.ADMIN ), getAllUsers );
router.get( "/user/:id", checkAuth( UserRole.ADMIN ), getUserById );

router.get( "/driver/:id", checkAuth( UserRole.ADMIN ), getDriverById );
router.get( "/driver/all", checkAuth( UserRole.ADMIN ), getAllDrivers );

router.get( "/all-rides", checkAuth( UserRole.ADMIN ), getAllRides );
router.get( "/ride/:id", checkAuth( UserRole.ADMIN ), getRideById );

router.patch( "/suspend-driver/:id/:suspendParam", checkAuth( UserRole.ADMIN ), suspendDriverById );

router.patch( "/block-user/:id/:blockParam", checkAuth( UserRole.ADMIN ), blockUserById );

router.delete( "/delete-blocked-user/:id", checkAuth( UserRole.ADMIN ), deleteBlockedUser );
router.delete("/ride/:id", checkAuth( UserRole.ADMIN ), deleteRide)

export const adminRoutes = router;