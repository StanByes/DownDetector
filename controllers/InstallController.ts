import { Application, NextFunction, Request, Response, Router } from "express";
import { hash } from "bcrypt";
import { collections } from "../database/db";
import User, { Role } from "../class/User";
import { isNullOrEmpty } from "../utils";
import Website, { Status } from "../class/Website";
import FlashHelper from "../helpers/FlashHelper";

export default class InstallController {
    constructor (app: Application) {
        const router = Router();

        router.post("/:step", this.registerStep);

        app.use("/install", router);
    }

    private async registerStep(request: Request, response: Response, next: NextFunction) {
        if (!request.params.step) {
            return response.status(400).json({
                message: "Bad request"
            });
        }

        if (request.params.step == "1") {
            if (isNullOrEmpty(request.body.pseudo) || isNullOrEmpty(request.body.password)) {
                FlashHelper.error(request, "Tous les champs doivent être remplis");
                return response.redirect("/");
            }

            const pseudo = request.body.pseudo;
            const password = await hash(request.body.password, 10);
            await collections.user?.insertOne(new User(pseudo, password, Role.OWNER, new Date()));

            response.redirect("/");
        } else if (request.params.step == "2") {
            const body = request.body;
            if (isNullOrEmpty(body.name) || isNullOrEmpty(body.domain) || isNullOrEmpty(body.interval) || isNullOrEmpty(body.maxTimeoutTime)) {
                FlashHelper.error(request, "Tous les champs doivent être remplis");
                return response.redirect("/");
            }

            const name = body.name;
            const { interval, maxTimeoutTime } = body;
            if (Number.isNaN(interval) || Number.isNaN(maxTimeoutTime)) {
                FlashHelper.error(request, "Les valeurs de l'interval et du temps de timeout maximum doivent être numériques");
                return response.redirect("/");
            }

            await collections.website?.insertOne(new Website(name, body.domain, parseInt(interval), parseInt(maxTimeoutTime), Status.UP));

            response.redirect("/");
        }
    }
}