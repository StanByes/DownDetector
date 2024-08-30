import { NextFunction, Request, Response } from "express";

export default function auth(request: Request, response: Response, next: NextFunction) {
    if (request.session.user == null && !request.url.startsWith("/login")) {
        response.redirect("/login");
        return;
    }

    next();
}