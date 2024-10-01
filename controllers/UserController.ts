import { Application, NextFunction, Request, Response } from "express";
import { isNullOrEmpty } from "../utils";
import { collections } from "../database/db";
import { compareSync } from "bcrypt";
import FlashHelper from "../helpers/FlashHelper";

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
                FlashHelper.error(request, "Tous les champs doivent être remplis");
                return response.redirect("/");
            }

            const pseudo = request.body.pseudo;
            const rawPass = request.body.password;
            
            const user = await collections.user!.findOne({pseudo});
            if (!user) {
                FlashHelper.warning(request, "Ce compte n'existe pas. Merci de vous adresser à l'administrateur du site.");
                return response.redirect("/login");
            }

            if (!compareSync(rawPass, user.password)) {
                FlashHelper.error(request, "Mot de passe incorrect");
                return response.redirect("/login");
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