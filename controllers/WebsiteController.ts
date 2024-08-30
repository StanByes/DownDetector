import { Application, NextFunction, Request, Response, Router } from "express";
import { websites } from "../database/cache";
import { ObjectId } from "mongodb";

export default class WebsiteController {
    constructor(app: Application) {
        const router = Router();

        router.get("/:id", this.show);

        app.use("/websites", router);
    }

    private async show(request: Request, response: Response, next: NextFunction) {
        let website = websites.find(w => w._id.equals(request.params.id));

        if (!website) {
            return response.status(404).json({
                message: "Not found"
            });
        }

        response.render("website", { title: "Site", website });
    }
}