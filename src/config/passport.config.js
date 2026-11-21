import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import UsersRepository from "../repositories/users.repository.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { JWT_SECRET } from "./config.js";

const cookieExtractor = (req) => {
    let token = null;

    if (req && req.cookies) {
        token = req.cookies.currentUser;
    }

    return token;
};

const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async (req, email, password, done) => {
                try {
                    const { first_name, last_name } = req.body;

                    const normalizedEmail = email.trim().toLowerCase();

                    const existing = await UsersRepository.findByEmail(
                        normalizedEmail
                    );

                    if (existing) {
                        return done(null, false, {
                            message: "El email ya está registrado"
                        });
                    }

                    const hashed = await hashPassword(password);

                    const newUser = await UsersRepository.create({
                        first_name,
                        last_name,
                        email: normalizedEmail,
                        password: hashed
                    });

                    return done(null, {
                        id: newUser._id,
                        first_name: newUser.first_name,
                        last_name: newUser.last_name,
                        email: newUser.email,
                        role: newUser.role
                    });
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy(
            {
                usernameField: "email"
            },
            async (email, password, done) => {
                try {
                    const normalizedEmail = email.trim().toLowerCase();

                    const user = await UsersRepository.findByEmail(
                        normalizedEmail
                    );

                    if (!user) {
                        return done(null, false, {
                            message: "Credenciales inválidas"
                        });
                    }

                    const isValidPassword = await comparePassword(
                        password,
                        user.password
                    );

                    if (!isValidPassword) {
                        return done(null, false, {
                            message: "Credenciales inválidas"
                        });
                    }

                    return done(null, user);

                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "current",
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([
                    cookieExtractor
                ]),
                secretOrKey: JWT_SECRET
            },
            async (jwt_payload, done) => {
                return done(null, jwt_payload);
            }
        )
    );
};

export default initializePassport;