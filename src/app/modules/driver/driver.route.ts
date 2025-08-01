import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { updateUserLocationIntoDb } from "../../middlewares/updateUserLocation.middleware";
import { validateRequest } from "../../middlewares/validateReq.middleware";
import { UserRole } from '../user/user.interface';
import { acceptRideRequest, cancelRideRequest, checkRideRequest, completeRide, inTransitRide, pickUpRide, updateVehicleInfo } from "./driver.controller";
import { vehicleInfoZodSchema } from "./driver.validation";

const router = Router();

router.post( "/check-ride-request", checkAuth(  UserRole.DRIVER ), updateUserLocationIntoDb, checkRideRequest );

router.post( "/accept-ride-request/:id", checkAuth( UserRole.DRIVER ), updateUserLocationIntoDb, acceptRideRequest );

router.post( "/cancel-ride-request/:id", checkAuth( UserRole.ADMIN, UserRole.DRIVER, UserRole.RIDER ), updateUserLocationIntoDb, cancelRideRequest );

router.patch( "/pick-up/:id", checkAuth( UserRole.DRIVER ), updateUserLocationIntoDb, pickUpRide );

router.patch( "/in-transit/:id", checkAuth(UserRole.DRIVER), updateUserLocationIntoDb, inTransitRide );

router.patch( "/complete-ride/:id", checkAuth( UserRole.DRIVER ), updateUserLocationIntoDb, completeRide );

router.patch( "/driver-update-vehicle/:id", checkAuth( UserRole.DRIVER, UserRole.ADMIN ), validateRequest( vehicleInfoZodSchema ), updateVehicleInfo );


router.get( "/driver-state/:id", checkAuth( UserRole.DRIVER, UserRole.ADMIN ) ); 
//extra feature route

export const driverRoutes = router;