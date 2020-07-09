const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to the database!");
        initial();
    })
    .catch((err) => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count == 0) {
            new Role({
                name: "user",
            }).save((err) => {
                if (err) {
                    console.log("error", err);
                }
                console.log("Added 'user' to roles collection");
            });

            new Role({
                name: "customer",
            }).save((err) => {
                if (err) {
                    console.log("error", err);
                }
                console.log("Added 'customer' to roles collection");
            });

            new Role({
                name: "admin",
            }).save((err) => {
                if (err) {
                    console.log("error", err);
                }
                console.log("Added 'admin' to roles collection");
            });
        }
    });
}

require("./routes/index.routes")(app);
require("./routes/auth.routes")(app);
require("./routes/part.routes")(app);
require("./routes/partType.routes")(app);

const PORT = process.env.PORT || 1025;
app.listen(PORT, () => {
    console.log(`LIVE ON ${PORT}`);
});
