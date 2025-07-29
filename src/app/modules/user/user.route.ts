import { Router } from "express";
import { validateRequest } from "../../middlewares/validateReq.middleware";
import { createUser } from "./user.controller";
import { zodUserSchema } from "./user.validation";

const route = Router();

route.post( "/create", validateRequest(zodUserSchema), createUser );

export const userRoute = route;