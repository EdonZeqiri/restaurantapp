const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const config = require("../config");

const User = new Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

User.statics.create = function (name, email, password, role) {
  const encrypted = crypto
    .createHmac("sha1", config.secret)
    .update(password)
    .digest("base64");

  const user = new this({
    name,
    email,
    password: encrypted,
    role,
  });

  return user.save();
};

// find one user by using email

User.statics.findOneByUsername = function (email) {
  return this.findOne({
    email,
  }).exec();
};

// verify the password of the User documment

User.methods.verify = function (password) {
  const encrypted = crypto
    .createHmac("sha1", config.secret)
    .update(password)
    .digest("base64");

  return this.password === encrypted;
};

User.methods.assignAdmin = function () {
  this.admin = true;

  return this.save();
};

module.exports = mongoose.model("User", User);
