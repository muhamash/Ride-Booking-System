import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { updateUserLocationIntoDb } from "../../middlewares/updateUserLocation.middleware";
import { validateRequest } from "../../middlewares/validateReq.middleware";
import { UserRole } from "../user/user.interface";
import { requestRide } from "./ride.controller";
import { zodRideRequest } from "./ride.validation";

const router = Router();

router.post( "/request", checkAuth( UserRole.RIDER, UserRole.ADMIN ), updateUserLocationIntoDb, validateRequest( zodRideRequest ), requestRide );


router.post( "/rating", checkAuth( UserRole.RIDER, UserRole.ADMIN ) ); //extra feature route

export const rideRoutes = router;