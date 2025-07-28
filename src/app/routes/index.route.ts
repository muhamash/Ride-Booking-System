import { Router } from "express";


export const firstVersionRouter = Router();

const moduleRouter = [
    {
        path: "/user"
    }
]

moduleRouter.forEach( router =>
{
    firstVersionRouter.use( router.path, router.route )
} );