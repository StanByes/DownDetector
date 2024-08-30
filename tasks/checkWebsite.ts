import { ObjectId } from "mongodb";
import { collections } from "../database/db";
import Website, { Status } from "../class/Website";
import WebsiteHistory from "../class/WebsiteHistory";
import { websites } from "../database/cache";

const tasks: Map<ObjectId, NodeJS.Timeout> = new Map();

async function checkWebsite(website: Website) {
    fetch("https://" + website.domain)
        .catch(() => {
            fetch("http://" + website.domain)
                .catch(() => {
                    if (website.status == Status.DOWN)
                        return;

                    const websiteHistory = new WebsiteHistory(website._id!, Status.DOWN, new Date());
                    collections.website_history?.insertOne(websiteHistory);

                    website.history.push(websiteHistory);
                    website.status = Status.DOWN;
                })
                .then((res) => {
                    if (!res)
                        return;

                    if (website.status == Status.UP)
                        return;
        
                    const websiteHistory = new WebsiteHistory(website._id!, Status.UP, new Date());
                    collections.website_history?.insertOne(websiteHistory);

                    website.history.push(websiteHistory);
                    website.status = Status.UP;
                });
        })
        .then((res) => {
            if (!res)
                return;

            if (website.status == Status.UP)
                return;

            const websiteHistory = new WebsiteHistory(website._id!, Status.UP, new Date());
            collections.website_history?.insertOne(websiteHistory);

            website.history.push(websiteHistory);
            website.status = Status.UP;
        });
}

export function updateWebsite(website: Website) {
    if (!website._id || !tasks.has(website._id))
        return;

    const interval = tasks.get(website._id)!;
    clearInterval(interval);

    tasks.set(website._id, setInterval(() => {
        checkWebsite(website);
    }, website.interval * 1000));
}

export async function registerCheckWebsites() {
    for (const website of websites) {
        tasks.set(website._id, setInterval(() => {
            checkWebsite(website);
        }, website.interval * 1000))
    }
}