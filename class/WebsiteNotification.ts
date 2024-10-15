import { ObjectId } from "mongodb";

export enum NotificationType {
    WEBHOOK = 0,
    MAIL = 1
}

export enum EntryStatus {
    ACTIVE = 0,
    DELETED = 1
}

export default class WebsiteNotification {
    constructor(public websiteId: ObjectId, public name: string, public description: string, public type: NotificationType, public data: object, public creatorId: ObjectId, public createdAt: Date, public entryStatus: EntryStatus = EntryStatus.ACTIVE, public _id: ObjectId = new ObjectId()) {}
}