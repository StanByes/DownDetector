import { WithId } from "mongodb";
import User from "../class/User";
import Website, { Status } from "../class/Website";
import WebsiteHistory from "../class/WebsiteHistory";
import { collections } from "./db";

let users: WithId<User>[] = [];
let websites: WithId<Website>[] = [];
let websitesHistories: WithId<WebsiteHistory>[] = [];

export {
    users, websites, websitesHistories,
}

export async function load() {
    const collectedUsers = await collections.user?.find().toArray();
    if (collectedUsers != undefined)
        users = collectedUsers;
    
    const collectedWebsites = await collections.website?.find().toArray();
    if (collectedWebsites != undefined) {
        for (const website of collectedWebsites) {
            const websiteHistories = await collections.website_history?.find({ websiteId: website._id })
                .sort("createdAt", "desc")
                .toArray();

            if (websiteHistories != undefined) {
                website.history = websiteHistories;
                
                if (websiteHistories.length > 0)
                    website.status = websiteHistories[0].status;
                else
                    website.status = Status.UP;
            }

            websites.push(website);
        }
    }
}