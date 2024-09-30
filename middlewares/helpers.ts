import { NextFunction, Request, Response } from "express";
import FormatHelper from "../helpers/FormatHelper";
import UserHelper from "../helpers/UserHelper";

export default function locals(request: Request, response: Response, next: NextFunction) {
    response.locals = {
        noNavbar: false,
        title: "Titre"
    };

    Object.assign(response.locals, FormatHelper);
    Object.assign(response.locals, UserHelper);
    next();
}