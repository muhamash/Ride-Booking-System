import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { validateRequest } from "../../middlewares/validateReq.middleware";
import { UserRole } from "../user/user.interface";
import { getActiveDrivers, ratingOwnRide, requestRide } from "./ride.controller";
import { ratingZodSchema, zodRideRequest } from "./ride.validation";

const router = Router();

router.post( "/request", checkAuth( UserRole.RIDER, UserRole.ADMIN ), validateRequest( zodRideRequest ), requestRide );

router.post( "/rating/:id", checkAuth( UserRole.RIDER, UserRole.ADMIN ), validateRequest( ratingZodSchema ), ratingOwnRide );

router.get( "/get-active-drivers", checkAuth( UserRole.RIDER, UserRole.ADMIN ), getActiveDrivers );


export const rideRoutes = router;