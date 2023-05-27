var PORT = process.env.PORT || 5000;

const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

require("./app/routes/task.routes")(app);

const dbConfig = require("./config/database.config");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("successfully conneted to the database");
  })
  .catch((err) => {
    console.log("Could not connected to the database.", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ "message:": "welcome to crud application." });
});

app.listen(PORT, () => {
  console.log("Server is listening port " + PORT);
});
