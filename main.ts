import express from "express";
import { collections, connect, runMigrations } from "./database/db";
import expressEjsLayouts from "express-ejs-layouts";
import auth from "./middlewares/auth";
import install from "./middlewares/install";
import InstallController from "./controllers/InstallController";
import User from "./class/User";
import session from "express-session";
import UserController from "./controllers/UserController";
import helpers from "./middlewares/helpers";
import PageController from "./controllers/PageController";
import { registerCheckWebsites } from "./tasks/checkWebsite";
import { load } from "./database/cache";
import WebsiteController from "./controllers/WebsiteController";
import { WithId } from "mongodb";

declare module "express-session" {

    interface SessionData {
        flash: {
            error: boolean,
            message: string
        } | null,
        user: WithId<User>
    }
}

(async () => {
    console.log("\n---- CONNECTING DATABASE ----")
    await connect()
    console.log("Database connected")
    for (const [k, v] of Object.entries(collections)) {
        if (!v)
            continue;

        console.log("Collection " + k + " found and load");
    }

    const migrated = await runMigrations();
    if (migrated != 0)
        console.log(migrated + " migrations executed");

    await load();
    

    console.log("\n---- WEB SERVER CREATION ----");
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use(expressEjsLayouts);

    app.set("layout", "layouts/layout");
    app.set("view engine", "ejs");

    // SESSION CONFIGURATION //
    app.use(session({secret: "DN[o:7X%31.8", resave: true, saveUninitialized: false, cookie: { secure: process.env.NODE_ENV == "production" }}));

    // MIDDLEWARES //
    app.use(helpers);
    app.use(install);
    app.use(auth);

    // CONTROLLERS //
    new InstallController(app);
    new PageController(app);
    new UserController(app);
    new WebsiteController(app);

    app.listen(3000, () => {
        console.log("Web server started on port 3000");
    });

    // TEST //
    registerCheckWebsites();
})();