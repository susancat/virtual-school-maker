const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./recipient');

const emailSchema = new Schema({
    to: [RecipientSchema],
    from: String,
    subject:String,
    text: String,
    html: String
});

module.exports = mongoose.model("Email",emailSchema);