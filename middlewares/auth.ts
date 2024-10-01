import { NextFunction, Request, Response } from "express";

export default function auth(request: Request, response: Response, next: NextFunction) {
    if (request.session.user == null) {
        if (request.url.startsWith("/login") || request.url.startsWith("/install"))
            return next();

        response.redirect("/login");
        return;
    }

    next();
}