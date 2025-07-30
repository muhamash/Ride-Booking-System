import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { UserRole } from "../user/user.interface";
import { getAllUsers, getUserById } from "./admin.controller";


const router = Router();

router.get( "/user/all", checkAuth( UserRole.ADMIN ), getAllUsers );
router.get( "/user/:id", checkAuth( UserRole.ADMIN ), getUserById );

export const adminRoutes = router;