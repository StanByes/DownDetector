const { Db, MongoClient } = require("mongodb");

module.exports = {
  /**
   * 
   * @param {Db} db 
   * @param {MongoClient} client 
   */
  async up(db, client) {
    const userCollection = await db.createCollection("user");
    await userCollection.createIndex({ "pseudo": 1 }, { unique: true });

    const websiteCollection = await db.createCollection("website");
    await websiteCollection.createIndex({ "name": 1 }, { unique: true });

    const websiteHistoryCollection = await db.createCollection("website_history");
    await websiteHistoryCollection.createIndex({ "websiteId": 1, "status": 1 });

    const websiteNotificationCollection = await db.createCollection("website_notification");
    await websiteNotificationCollection.createIndex({ "websiteId": 1});
  },

  /**
   * 
   * @param {Db} db 
   * @param {MongoClient} client 
   */
  async down(db, client) {
    await db.dropCollection("user");
    await db.dropCollection("website");
    await db.dropCollection("website_history");
    await db.dropCollection("website_notification");
  }
};
