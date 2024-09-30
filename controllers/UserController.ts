import { Application, NextFunction, Request, Response } from "express";
import { isNullOrEmpty } from "../utils";
import { collections } from "../database/db";
import { compareSync } from "bcrypt";

export default class UserController {
    constructor(app: Application) {
        app.all("/login", this.login)
    }

    private async login(request: Request, response: Response, next: NextFunction) {
        if (request.session.user != null) {
            response.redirect("/");
            return;
        }

        if (request.method == "POST") {
            if (isNullOrEmpty(request.body.pseudo) || isNullOrEmpty(request.body.password)) {
                return response.status(400).json({
                    message: "Bad request"
                });
            }

            const pseudo = request.body.pseudo;
            const rawPass = request.body.password;
            
            const user = await collections.user!.findOne({pseudo});
            if (!user) {
                return response.status(404).json({
                    message: "Unknown user"
                });
            }

            if (!compareSync(rawPass, user.password)) {
                return response.status(401).json({
                    message: "Bad password"
                });
            }

            request.session.user = user;
            request.session.regenerate(() => {
                request.session.save();
            });
            
            response.redirect("/");
            return;
        }

        response.render("users/login", { title: "Connexion", noNavbar: true });
    }
}