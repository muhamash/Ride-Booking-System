import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { updateUserLocationIntoDb } from "../../middlewares/updateUserLocation.middleware";
import { validateRequest } from "../../middlewares/validateReq.middleware";
import { UserRole } from '../user/user.interface';
import { acceptRideRequest, cancelRideRequest, checkRideRequest, completeRide, driverState, inTransitRide, pickUpRide, updateVehicleInfo } from "./driver.controller";
import { vehicleInfoZodSchema } from "./driver.validation";

const router = Router();

router.post( "/check-ride-request", checkAuth(  UserRole.DRIVER ), checkRideRequest );

router.post( "/accept-ride-request/:id", checkAuth( UserRole.DRIVER, UserRole.ADMIN ), acceptRideRequest );

router.post( "/cancel-ride-request/:id", checkAuth( UserRole.ADMIN, UserRole.DRIVER, UserRole.RIDER ), cancelRideRequest );

router.patch( "/pick-up/:id", checkAuth( UserRole.DRIVER ), pickUpRide );

router.patch( "/in-transit/:id", checkAuth(UserRole.DRIVER), inTransitRide );

router.patch( "/complete-ride/:id", checkAuth( UserRole.DRIVER ), completeRide );

router.patch( "/driver-update-vehicle/:id", checkAuth( UserRole.DRIVER, UserRole.ADMIN ), validateRequest( vehicleInfoZodSchema ), updateVehicleInfo );

router.get( "/driver-state/:id", checkAuth( UserRole.DRIVER, UserRole.ADMIN ) , driverState); 

export const driverRoutes = router;