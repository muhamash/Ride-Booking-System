import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { UserRole } from "../user/user.interface";
import { getAllUsers } from "./admin.controller";


const router = Router();

router.get( "/user/all", checkAuth(UserRole.ADMIN), getAllUsers );

export const adminRoutes = router;