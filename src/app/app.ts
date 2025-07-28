import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from "express";
import expressSession from "express-session";
import passport from 'passport';
// import "./config/passport/passport.config";
import { globalNotFoundResponse } from './middlewares/notFoundRoute.middleware';
import { homeRoute } from './modules/home/home.controller';

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


// global not found routes
app.use(globalNotFoundResponse)


export default app;