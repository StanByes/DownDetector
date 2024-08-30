import { NextFunction, Request, Response } from "express";

export default function locals(request: Request, response: Response, next: NextFunction) {
    response.locals = {
        noNavbar: false
    };
    next();
}