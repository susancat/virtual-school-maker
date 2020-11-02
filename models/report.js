const mongoose = require('mongoose')
const { Schema } = mongoose;
// const { playerSchema } = require("./player")

const reportSchema = new Schema({
    quizname:String,
    quizid:String,
    players: Array,
    dateCreated:Date,
    deadline:Date,
    author: {
        id: {
            type: Schema.Types.ObjectId,
            ref: "User"
            },
        username: String
    }   
})

module.exports = mongoose.model('Report', reportSchema)