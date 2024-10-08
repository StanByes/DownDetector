import { NextFunction, Request, Response } from "express";
import { collections } from "../database/db";

export default async function install(request: Request, response: Response, next: NextFunction) {
    if (await collections.user?.countDocuments() == 0 && !request.url.startsWith("/install")) {
        response.render("pages/install", { title: "Installation", step: 1, noNavbar: true });
    } else if (await collections.website?.countDocuments() == 0 && !request.url.startsWith("/install")) {
        response.render("pages/install", { title: "Installation", step: 2, noNavbar: true });
    } else {
        next();
    }
}