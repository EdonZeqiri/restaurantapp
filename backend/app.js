const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const User = require("./models/user");
const crypto = require("crypto");
const config = require("./config");
const port = process.env.PORT || 8000;
const app = express();

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// print the request log on console
app.use(morgan("dev"));

// set the secret key variable for jwt
app.set("jwt-secret", config.secret);

// configure api router
app.use("/api", require("./routes/api"));

// open the server
app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});

// CONNECT TO MONGODB SERVER
mongoose.connect(config.mongodbUri).then(async () => {
  // if admin user doesn't exist, create Admin user
  if ((await User.count({ role: "admin" })) == 0) {
    const encrypted = crypto
      .createHmac("sha1", config.secret)
      .update("123456")
      .digest("base64");

    const user = new User({
      name: "admin",
      email: "admin@example.com",
      password: encrypted,
      role: "admin",
      admin: true,
    });
    await user.save();
  }
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log("connected to mongodb server");
});
