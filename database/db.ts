import { Collection, MongoClient, ServerApiVersion } from "mongodb";
import { up } from "migrate-mongo";
import Website from "../class/Website";
import WebsiteHistory from "../class/WebsiteHistory";
import User from "../class/User";

const client = new MongoClient("mongodb+srv://stanbyes:1234@data.mpaci.mongodb.net/down_detector?retryWrites=true&w=majority&appName=Data", {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

export const collections: {
    user?: Collection<User>
    website?: Collection<Website>
    website_history?: Collection<WebsiteHistory>
} = {};

export async function connect() {
    await client.connect()
        .catch((err) => {
            throw new Error("Erreur de connexion à la base de données : " + err);
        });

    const db = client.db();
    collections.user = db.collection("user");
    collections.website = db.collection("website");
    collections.website_history = db.collection("website_history");
}

export async function runMigrations() {
    const migrated = await up(client.db(), client);
    return migrated.length;
}