import moment from "moment";
import { Status } from "../class/Website";
import { NotificationType } from "../class/WebsiteNotification";

export default {
    formatDate: (date: Date) => {
        return moment(date).format("DD/MM/YYYY [à] HH[h]mm");
    },

    formatStatus: (status: Status) => {
        return status == Status.UP ? "Actif" : "Inactif";
    },
    
    formatNotificationType: (type: NotificationType) => {
        return type == NotificationType.MAIL ? "Mail" : "Webhook";
    }
}