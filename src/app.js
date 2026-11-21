import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Servidor activo",
  });
});

import eventsRouter from "./routes/events.router.js";
import sessionsRouter from "./routes/sessions.router.js";


app.use("/api/events", eventsRouter);
app.use("/api/sessions", sessionsRouter);

export default app;