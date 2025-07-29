import { Router } from "express";
import { createUser } from "./user.controller";



const route = Router();

route.post( "/create", createUser );

export const userRoute = route;