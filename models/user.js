const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    username: { type: String, unique: true },
    googleid:String,
    password: String,
    email: String
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
// const userSchema = new Schema({
//     googleId: String
//     // credits: { type: Number, default: 0 }
// });

// mongoose.model('users', userSchema);