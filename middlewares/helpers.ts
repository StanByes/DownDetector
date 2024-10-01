import { NextFunction, Request, Response } from "express";
import FormatHelper from "../helpers/FormatHelper";
import UserHelper from "../helpers/UserHelper";
import FlashHelper from "../helpers/FlashHelper";

export default function locals(request: Request, response: Response, next: NextFunction) {
    response.locals = {
        noNavbar: false,
        flash: FlashHelper.loadFlashMessage(request),
        title: "Titre"
    };

    Object.assign(response.locals, FormatHelper);
    Object.assign(response.locals, UserHelper);
    next();
}