import { Application, NextFunction, Request, Response, Router } from "express";
import { hash } from "bcrypt";
import { collections } from "../database/db";
import User, { Role } from "../class/User";
import { isNullOrEmpty } from "../utils";
import Website, { Status } from "../class/Website";

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
                return response.status(400).json({
                    message: "Bad request"
                });
            }

            const pseudo = request.body.pseudo;
            if (await collections.user?.findOne({ pseudo }) != null) {
                return response.status(400).json({
                    message: "Pseudo already used"
                });
            }

            const password = await hash(request.body.password, 10);
            await collections.user?.insertOne(new User(pseudo, password, Role.OWNER, new Date()));

            response.redirect("/");
        } else if (request.params.step == "2") {
            const body = request.body;
            if (isNullOrEmpty(body.name) || isNullOrEmpty(body.domain) || isNullOrEmpty(body.interval) || isNullOrEmpty(body.maxTimeoutTime)) {
                return response.status(400).json({
                    message: "Bad request"
                });
            }

            const name = body.name;
            if (await collections.website?.findOne({ name }) != null) {
                return response.status(400).json({
                    message: "Name already used"
                });
            }

            const { interval, maxTimeoutTime } = body;
            if (Number.isNaN(interval) || Number.isNaN(maxTimeoutTime)) {
                return response.status(400).json({
                    message: "Interval or max timeout time values are not numbers"
                });
            }

            await collections.website?.insertOne(new Website(name, body.domain, parseInt(interval), parseInt(maxTimeoutTime), Status.UP));

            response.redirect("/");
        }
    }
}