const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./recipient');

const emailSchema = new Schema({
    title: String,
    classID: String,
    text: String,
    recipients: [RecipientSchema],
});

module.exports = mongoose.model("Email",emailSchema);