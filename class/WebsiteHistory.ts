import { ObjectId } from "mongodb";
import { Status } from "./Website";

export default class WebsiteHistory {
    constructor(public websiteId: ObjectId, public status: Status, public createdAt: Date) {}
}