import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { updateUserLocationIntoDb } from "../../middlewares/updateUserLocation.middleware";
import { UserRole } from '../user/user.interface';
import { acceptRideRequest, cancelRideRequest, checkRideRequest, completeRide, inTransitRide, pickUpRide } from "./driver.controller";

const router = Router();

router.get( "/check-ride-request", checkAuth( UserRole.ADMIN, UserRole.DRIVER ), updateUserLocationIntoDb, checkRideRequest );

router.post( "/accept-ride-request/:id", checkAuth( UserRole.ADMIN, UserRole.DRIVER ), updateUserLocationIntoDb, acceptRideRequest );

router.post( "/cancel-ride-request/:id", checkAuth( UserRole.ADMIN, UserRole.DRIVER, UserRole.RIDER ), updateUserLocationIntoDb, cancelRideRequest );

router.patch( "/pick-up/:id", checkAuth( UserRole.DRIVER ), updateUserLocationIntoDb, pickUpRide );

router.patch( "/in-transit/:id", checkAuth(UserRole.DRIVER), updateUserLocationIntoDb, inTransitRide );

router.patch( "/complete-ride/:id", checkAuth( UserRole.DRIVER ), updateUserLocationIntoDb, completeRide );


router.patch("/driver-update/:id", checkAuth( UserRole.DRIVER, UserRole.ADMIN ))


export const driverRoutes = router;