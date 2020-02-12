const mongoose              = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose"),

userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;