import { ObjectId } from "mongodb";
import WebsiteHistory from "./WebsiteHistory";
import WebsiteNotification from "./WebsiteNotification";

export enum Status {
    UP = 0,
    DOWN = 1
}

export default class Website {
    constructor(public name: string, public domain: string, public interval: number, public maxTimeoutTime: number, public status: Status, public history: WebsiteHistory[] = [], public notifications: WebsiteNotification[] = [], public _id?: ObjectId) {}
}