import SessionService from "../services/Sessions.service.js";
import { generateToken } from "../utils/jwt.js";

export const registerController = async (req, res) => {
    try {
        const { first_name, last_name, password } = req.body;
        const email = req.body.email?.trim();

        if (
            typeof first_name !== "string" ||
            typeof last_name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                status: "error",
                message: "Datos inválidos"
            });
        }

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Todos los campos son obligatorios: first_name, last_name, email y password"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: "error",
                message: "El formato del email no es válido"
            });
        }

        const result = req.user;

        return res.status(201).json({
            status: "success",
            payload: result
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.message
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                status: "error",
                message: "Datos inválidos"
            });
        }

        if (!email || !password) {
            return res.status(401).json({
                status: "error",
                message: "Credenciales inválidas"
            });
        }

        const token = generateToken(req.user);

        res.cookie("currentUser", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 3600000,
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({
            status: "success",
            message: "Login correcto"
        });

    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "Credenciales inválidas"
        });
    }
};

export const currentController = (req, res) => {
    return res.status(200).json({
        status: "success",
        payload: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    });
};

export const logoutController = (req, res) => {
    res.clearCookie("currentUser");

    return res.status(200).json({
        status: "success",
        message: "Sesión cerrada"
    });
};

export const createSessionController = async (req, res) => {
    try {
        const result = await SessionService.createSession(req.body);

        return res.status(201).json({
            status: "success",
            payload: result
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getAllSessionsController = async (req, res) => {
    try {
        const result = await SessionService.getSessions();

        return res.status(200).json({
            status: "success",
            payload: result
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getSessionByIdController = async (req, res) => {
    try {
        const result = await SessionService.getSessionById(req.params.id);

        if (!result) {
            return res.status(404).json({
                status: "error",
                message: "Session not found"
            });
        }

        return res.status(200).json({
            status: "success",
            payload: result
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getSessionsByEventController = async (req, res) => {
    try {
        const result = await SessionService.getSessionsByEvent(req.params.eventId);

        return res.status(200).json({
            status: "success",
            payload: result
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const deleteSessionController = async (req, res) => {
    try {
        const result = await SessionService.deleteSession(req.params.id);

        if (!result) {
            return res.status(404).json({
                status: "error",
                message: "Session not found"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Session deleted successfully",
            payload: result
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};