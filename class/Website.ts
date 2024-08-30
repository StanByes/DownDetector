import { ObjectId } from "mongodb";
import WebsiteHistory from "./WebsiteHistory";

export enum Status {
    UP = 0,
    DOWN = 1
}

export default class Website {
    constructor(public name: string, public domain: string, public interval: number, public maxTimeoutTime: number, public status: Status, public history: WebsiteHistory[] = [], public _id?: ObjectId) {}
}