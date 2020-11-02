const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema ({
    name: String,
    classID: String,
    subject: String,
    description: String,
    quizid:String,
    players: [{
        type: Schema.Types.ObjectId,
        ref: "Player"
    }], 
    reports: [{
        type: Schema.Types.ObjectId,
        ref: "Report"
    }], 
    tutor: String,
    teacher: String,
    author: {
        id: {
            type: Schema.Types.ObjectId,
            ref: "User"
            },
        username: String
    },
    emails: [{
        type: Schema.Types.ObjectId,
        ref: "Email"
    }], 
    selectedServer: String,
    serverlink1: String,
    serverlink2: String,
    serverlink3: String
});

module.exports = mongoose.model('Course', courseSchema);