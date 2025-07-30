import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { UserRole } from "../user/user.interface";
import { requestRide } from "./ride.controller";
import { updateUserLocationIntoDb } from "../../middlewares/updateUserLocation.middleware";


const router = Router();

router.post( "/request", checkAuth( UserRole.RIDER, UserRole.ADMIN ),updateUserLocationIntoDb, requestRide );


export const rideRoutes = router;