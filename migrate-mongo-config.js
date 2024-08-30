const config = {
  mongodb: {
    url: "mongodb+srv://stanbyes:1234@data.mpaci.mongodb.net",

    databaseName: "down_detector",

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  migrationsDir: "database/migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",

  useFileHash: false,

  moduleSystem: 'commonjs',
};

module.exports = config;
