import { Application, NextFunction, Request, Response, Router } from "express";
import { websites, websitesNotifications } from "../database/cache";
import { isNullOrEmpty } from "../utils";
import WebsiteNotification, { EntryStatus, NotificationType } from "../class/WebsiteNotification";
import { collections } from "../database/db";
import FlashHelper from "../helpers/FlashHelper";
import { ObjectId } from "mongodb";

export default class WebsiteController {
    constructor(app: Application) {
        const router = Router();

        router.get("/:id", this.show);

        router.get("/:id/notifications", this.notificationsNew);
        router.post("/:id/notifications", this.notificationsCreate);

        router.get("/:id/notifications/:notification_id/edit", this.notificationsEdit);
        router.post("/:id/notifications/:notification_id/edit", this.notificationsUpdate);

        router.get("/:id/notifications/:notification_id/delete", this.notificationsDelete);

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
        response.render("websites/notifications/new", { title: "Notification" });
    }

    private async notificationsCreate(request: Request, response: Response, next: NextFunction) {
        if (request.method == "POST") {
            const website = websites.find(w => w._id.equals(request.params.id));

            if (!website) {
                return response.status(404).json({
                    message: "Not found"
                });
            }

            const { name, description, type, webhook_url, webhook_token, email } = request.body;

            if (isNullOrEmpty(name) || isNullOrEmpty(description) || isNullOrEmpty(type)) {
                FlashHelper.error(request, "Tous les champs doivent être remplis");
                return response.redirect(`/websites/${request.params.id}/notifications`);
            }

            if (website.notifications.find(n => n.name == name) != undefined) {
                FlashHelper.error(request, "Ce nom de notification est déjà enregistré");
                return response.redirect(`/websites/${request.params.id}/notifications`);
            }

            if (type == NotificationType.MAIL && isNullOrEmpty(email)) {
                FlashHelper.error(request, "Une adresse email doit être fournie");
                return response.redirect(`/websites/${request.params.id}/notifications`);
            } else if (type == NotificationType.WEBHOOK && (isNullOrEmpty(webhook_token) || isNullOrEmpty(webhook_url))) {
                FlashHelper.error(request, "L'URL et le token du Webhook doivent être fournis");
                return response.redirect(`/websites/${request.params.id}/notifications`);
            }

            const notification = new WebsiteNotification(website._id, name, description, type, type == NotificationType.MAIL ? email : {
                url: webhook_url,
                token: webhook_token
            }, request.session.user!._id, new Date());
            await collections.website_notification?.insertOne(notification);
            website.notifications.push(notification);
            websitesNotifications.push(notification)

            response.redirect("/websites/" + website._id);
        }
    }

    private async notificationsEdit(request: Request, response: Response, next: NextFunction) {
        const website = websites.find(w => w._id.equals(request.params.id));

        if (!website) {
            return response.status(404).json({
                message: "Not found"
            });
        }

        const notificationId = request.params["notification_id"];
        const notification = websitesNotifications.find(n => n._id.equals(notificationId));
        if (!notification)
            return response.status(404).json({message: "Not found"});

        response.render("websites/notifications/edit", { title: "Edition", notification });
    }

    private async notificationsUpdate(request: Request, response: Response, next: NextFunction) {
        if (request.method == "POST") {
            const website = websites.find(w => w._id.equals(request.params.id));

            if (!website) {
                return response.status(404).json({
                    message: "Not found"
                });
            }

            const notificationId = request.params["notification_id"];
            const notification = websitesNotifications.find(n => n._id.equals(notificationId));
            if (!notification)
                return response.status(404).json({message: "Not found"});

            const { name, description, type, webhook_url, webhook_token, email } = request.body;

            if (isNullOrEmpty(name) || isNullOrEmpty(description) || isNullOrEmpty(type)) {
                FlashHelper.error(request, "Tous les champs doivent être remplis");
                return response.redirect(`/websites/${request.params.id}/notifications/${notificationId}/edit`);
            }

            const checkNotification = website.notifications.find(n => n.name == name);
            if (checkNotification != undefined && !checkNotification._id!.equals(notificationId)) {
                FlashHelper.error(request, "Ce nom de notification est déjà enregistré");
                return response.redirect(`/websites/${request.params.id}/notifications/${notificationId}/edit`);
            }

            if (type == NotificationType.MAIL && isNullOrEmpty(email)) {
                FlashHelper.error(request, "Une adresse email doit être fournie");
                return response.redirect(`/websites/${request.params.id}/notifications/${notificationId}/edit`);
            } else if (type == NotificationType.WEBHOOK && (isNullOrEmpty(webhook_token) || isNullOrEmpty(webhook_url))) {
                FlashHelper.error(request, "L'URL et le token du Webhook doivent être fournis");
                return response.redirect(`/websites/${request.params.id}/notifications/${notificationId}/edit`);
            }

            notification.name = name;
            notification.description = description;
            notification.type = type;
            notification.data = type == NotificationType.MAIL ? email : {
                url: webhook_url,
                token: webhook_token
            };
            await collections.website_notification?.updateOne({ _id: ObjectId.createFromHexString(notificationId)}, { $set: notification });

            response.redirect("/websites/" + website._id);
        }
    }

    private async notificationsDelete(request: Request, response: Response, next: NextFunction) {
        const website = websites.find(w => w._id.equals(request.params.id));

        if (!website) {
            return response.status(404).json({
                message: "Not found"
            });
        }

        const notificationId = request.params["notification_id"];
        const notification = websitesNotifications.find(n => n._id.equals(notificationId));
        if (!notification)
            return response.status(404).json({message: "Not found"});

        website.notifications.splice(website.notifications.indexOf(notification), 1);
        websitesNotifications.splice(websitesNotifications.indexOf(notification), 1);
        collections.website_notification?.updateOne({ _id: notification._id }, { $set: { entryStatus: EntryStatus.DELETED } });
        response.redirect("/websites/" + request.params["id"]);
    }
}