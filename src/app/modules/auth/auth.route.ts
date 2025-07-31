import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { updateUserLocationIntoDb } from "../../middlewares/updateUserLocation.middleware";
import { validateRequest } from "../../middlewares/validateReq.middleware";
import { UserRole } from "../user/user.interface";
import { getNewAccessToken, userLogin, userLogout } from "./auth.controller";
import { authLogin } from "./auth.validation";


const router = Router();

router.post( "/login", validateRequest( authLogin ), updateUserLocationIntoDb, userLogin );

router.post( "/logout", checkAuth( UserRole.ADMIN, UserRole.DRIVER, UserRole.RIDER ), updateUserLocationIntoDb, userLogout );

router.post( "/refresh-token", checkAuth( UserRole.ADMIN, UserRole.DRIVER, UserRole.RIDER ), updateUserLocationIntoDb, getNewAccessToken );


export const authRoute = router;