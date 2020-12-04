const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema ({
    name: String,
    classID: { type: String, unique: true },
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
    assignments: [{
        type: Schema.Types.ObjectId,
        ref: "Share"
    }],
    emails: [{
        type: Schema.Types.ObjectId,
        ref: "Email"
    }], 
    selectedServer: String,
    gamelink1: { type: String, default: "https://www.roblox.com/games/6033864818/Beta-Quiz-Trivia"},
    gamelink2: { type: String, default: "https://www.roblox.com/games/5887877906/Lobby-test-1" },
    gamelink3: String,
    serverlink1: String,
    serverlink2: String,
    serverlink3: String
});

module.exports = mongoose.model('Course', courseSchema);