import { Router } from "express";
import { userRoute } from "../modules/user/user.route";


export const firstVersionRouter = Router();

const moduleRouter = [
    {
        path: "/user",
        route: userRoute
    }
]

moduleRouter.forEach( router =>
{
    firstVersionRouter.use( router.path, router.route )
} );