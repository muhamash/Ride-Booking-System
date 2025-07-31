import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { updateUserLocationIntoDb } from "../../middlewares/updateUserLocation.middleware";
import { validateRequest } from "../../middlewares/validateReq.middleware";
import { createUser, getMe } from "./user.controller";
import { UserRole } from "./user.interface";
import { zodUserSchema } from "./user.validation";

const router = Router();

router.post( "/create", validateRequest( zodUserSchema ), createUser );

router.get( "/me", checkAuth( UserRole.ADMIN, UserRole.DRIVER, UserRole.RIDER ), updateUserLocationIntoDb, getMe );

router.patch( "update-user/:id", checkAuth( UserRole.ADMIN, UserRole.DRIVER, UserRole.RIDER ) );

export const userRoute = router;