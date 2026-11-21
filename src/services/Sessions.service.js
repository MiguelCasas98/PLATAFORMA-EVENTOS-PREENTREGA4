import UsersRepository from "../repositories/users.repository.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

class SessionsService {

    async register(data) {
        const { first_name, last_name, email, password } = data;

        const normalizedEmail = email.trim().toLowerCase();

        const existing = await UsersRepository.findByEmail(normalizedEmail);
        if (existing) {
            const error = new Error("El email ya está registrado");
            error.status = 409;
            throw error;
        }

        const hashed = await hashPassword(password);

        const newUser = await UsersRepository.create({
            first_name,
            last_name,
            email: normalizedEmail,
            password: hashed
        });

        return {
            id: newUser._id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            role: newUser.role
        };
    }

    async login(email, password) {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await UsersRepository.findByEmail(normalizedEmail);

        if (!user) {
        throw new Error("Credenciales inválidas");
        }

        const isValidPassword = await comparePassword(
        password,
        user.password
        );

        if (!isValidPassword) {
        throw new Error("Credenciales inválidas");
        }

        const token = generateToken(user);

        return { token };
    }

    async createSession(data) {
        throw new Error("SessionRepository no está implementado en este proyecto");
    }

    async getSessions() {
        throw new Error("SessionRepository no está implementado en este proyecto");
    }

    async getSessionById(id) {
        throw new Error("SessionRepository no está implementado en este proyecto");
    }

    async getSessionsByEvent(eventId) {
        throw new Error("SessionRepository no está implementado en este proyecto");
    }

    async deleteSession(id) {
        throw new Error("SessionRepository no está implementado en este proyecto");
    }
}

export default new SessionsService();