import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from "express";
import expressSession from "express-session";
import passport from 'passport';
// import "./config/passport/passport.config";
import { globalErrorResponse } from './middlewares/globalError.middleware';
import { globalNotFoundResponse } from './middlewares/notFoundRoute.middleware';
import { homeRoute } from './modules/home/home.controller';
import { firstVersionRouter } from './routes/index.route';

const app: Application = express();

app.use( expressSession( {
    secret: "my-secret",
    resave: true,
    saveUninitialized:false
} ) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( cookieParser() );
app.use( express.json() );
app.use( cors() );

// professional route
app.get( "/", homeRoute )
app.use("/api", firstVersionRouter)

// global not found routes
app.use( globalNotFoundResponse )

// global error handler
app.use(globalErrorResponse)


export default app;