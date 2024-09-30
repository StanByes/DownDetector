import { Application, NextFunction, Request, Response, Router } from "express";
import { websites } from "../database/cache";
import { isNullOrEmpty } from "../utils";
import WebsiteNotification, { NotificationType } from "../class/WebsiteNotification";
import { collections } from "../database/db";

export default class WebsiteController {
    constructor(app: Application) {
        const router = Router();

        router.get("/:id", this.show);
        router.all("/:id/notifications", this.notificationsNew);

        app.use("/websites", router);
    }

    private async show(request: Request, response: Response, next: NextFunction) {
        const website = websites.find(w => w._id.equals(request.params.id));

        if (!website) {
            return response.status(404).json({
                message: "Not found"
            });
        }

        response.render("websites/show", { title: "Site", website });
    }

    private async notificationsNew(request: Request, response: Response, next: NextFunction) {
        if (request.method == "POST") {
            const website = websites.find(w => w._id.equals(request.params.id));

            if (!website) {
                return response.status(404).json({
                    message: "Not found"
                });
            }

            const { name, description, type, webhook_url, webhook_token, email } = request.body;

            if (isNullOrEmpty(name) || isNullOrEmpty(description) || isNullOrEmpty(type)) {
                return response.status(400).json({
                    message: "Bad request"
                });
            }

            if (website.notifications.find(n => n.name == name) != undefined) {
                return response.status(409).json({
                    message: "Name already used"
                });
            }

            if (type == NotificationType.MAIL && isNullOrEmpty(email)) {
                return response.status(400).json({
                    message: "Bad request"
                });
            } else if (type == NotificationType.WEBHOOK && (isNullOrEmpty(webhook_token) || isNullOrEmpty(webhook_url))) {
                return response.status(400).json({
                    message: "Bad request"
                });
            }

            const notification = new WebsiteNotification(website._id, name, description, type, type == NotificationType.MAIL ? email : {
                url: webhook_url,
                token: webhook_token
            }, request.session.user!._id, new Date());
            await collections.website_notification?.insertOne(notification);
            website.notifications.push(notification);

            return response.redirect("/websites/" + website._id);
        }

        response.render("websites/notifications/new", { title: "Notification" });
    }
}