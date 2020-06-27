const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.parts = require("./part.model.js")(mongoose);
db.partTypes = require("./partType.model.js")(mongoose);
db.role = require("./role.model.js")(mongoose);
db.user = require("./user.model.js")(mongoose);

db.ROLES = ["user", "customer", "admin"];

module.exports = db;
