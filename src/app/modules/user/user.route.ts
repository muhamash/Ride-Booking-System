import { Router } from "express";
import { validateRequest } from "../../middlewares/validateReq.middleware";
import { createUser } from "./user.controller";
import { zodUserSchema } from "./user.validation";

const route = Router();

route.post( "/create", validateRequest( zodUserSchema ), createUser );
// Router.get( "/me" );

export const userRoute = route;