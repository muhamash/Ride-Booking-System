import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { UserRole } from "../user/user.interface";
import { getAllDrivers, getAllUsers, getDriverById, getUserById, suspendDriverById } from "./admin.controller";


const router = Router();

router.get( "/user/all", checkAuth( UserRole.ADMIN ), getAllUsers );
router.get( "/user/:id", checkAuth( UserRole.ADMIN ), getUserById );
router.get( "/driver/:id", checkAuth( UserRole.ADMIN ), getDriverById );
router.get( "/driver/all", checkAuth( UserRole.ADMIN ), getAllDrivers );

router.patch( "/suspend-driver/:id", checkAuth( UserRole.ADMIN ), suspendDriverById );

router.patch( "/block-user/:id", checkAuth( UserRole.ADMIN ) );

router.get( "/all-rides", checkAuth( UserRole.ADMIN ) );

router.get( "/ride/:id", checkAuth( UserRole.ADMIN ) );

export const adminRoutes = router;