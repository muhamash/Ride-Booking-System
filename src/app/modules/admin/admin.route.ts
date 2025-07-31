import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { UserRole } from "../user/user.interface";
import { getAllUsers, getUserById } from "./admin.controller";


const router = Router();

router.get( "/user/all", checkAuth( UserRole.ADMIN ), getAllUsers );
router.get( "/user/:id", checkAuth( UserRole.ADMIN ), getUserById );

router.patch( "/suspend-driver/:d", checkAuth( UserRole.ADMIN ) );

export const adminRoutes = router;