import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { updateUserLocationIntoDb } from "../../middlewares/updateUserLocation.middleware";
import { validateRequest } from "../../middlewares/validateReq.middleware";
import { UserRole } from "../user/user.interface";
import { ratingOwnRide, requestRide } from "./ride.controller";
import { ratingZodSchema, zodRideRequest } from "./ride.validation";

const router = Router();

router.post( "/request", checkAuth( UserRole.RIDER, UserRole.ADMIN ), updateUserLocationIntoDb, validateRequest( zodRideRequest ), requestRide );


router.post( "/rating/:id", checkAuth( UserRole.RIDER, UserRole.ADMIN ), validateRequest(ratingZodSchema), ratingOwnRide );

export const rideRoutes = router;