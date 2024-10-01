import { Request } from "express";

export default {
    success: (request: Request, message: string) => {
        registerMessage(request, FlashMessageColor.SUCCESS, message);
    },

    warning: (request: Request, message: string) => {
        registerMessage(request, FlashMessageColor.WARNING, message);
    },

    error: (request: Request, message: string) => {
        registerMessage(request, FlashMessageColor.ERROR, message);
    },

    loadFlashMessage: (request: Request) => {
        if (!request.session.flash)
            return null;

        const flash = request.session.flash;
        request.session.flash = null;
        return flash; 
    }
}

export enum FlashMessageColor {
    SUCCESS = "success", WARNING = "warning", ERROR = "danger"
}

function registerMessage(request: Request, color: FlashMessageColor, message: string) {
    request.session.flash = {
        color, message
    };
}