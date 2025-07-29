import { Router } from "express";
import { validateRequest } from "../../middlewares/validateReq.middleware";
import { userLogin } from "./auth.controller";
import { authLogin } from "./auth.validation";


const router = Router();

router.post( "/login", validateRequest(authLogin), userLogin );

export const authRoute = router;