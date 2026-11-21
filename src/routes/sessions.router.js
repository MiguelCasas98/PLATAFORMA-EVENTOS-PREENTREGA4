import { Router } from "express";
import passport from "passport";
import {
    registerController,
    loginController,
    currentController,
    logoutController,
    createSessionController,
    getAllSessionsController,
    getSessionByIdController,
    getSessionsByEventController,
    deleteSessionController
} from "../controllers/sessions.controller.js";

const router = Router();

router.post(
    "/register", passport.authenticate("register", {
        session: false
    }),
    registerController
);

router.post(
    "/login", passport.authenticate("login", {
        session: false
    }),
    loginController
);

router.post("/logout", logoutController);

router.get("/current", passport.authenticate("current", {
        session: false
    }),
    currentController
);
router.post("/", createSessionController);

router.get("/", getAllSessionsController);

router.get("/event/:eventId", getSessionsByEventController);

router.get("/:id", getSessionByIdController);

router.delete("/:id", deleteSessionController);

export default router;