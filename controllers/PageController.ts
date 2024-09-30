import { Application, NextFunction, Request, Response } from "express";
import { websites } from "../database/cache";

export default class PageController {
    constructor(app: Application) {
        app.get("/", this.home);
    }

    private async home(request: Request, response: Response, next: NextFunction) {
        return response.render("pages/home", { title: "Accueil", websites });
    }
}