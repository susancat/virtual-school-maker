// Schema for each individual game with an ID

const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSchema = new Schema({
    pin: {type: String, required: true},
    name: {type: String, required: true},
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz"
        }
})

module.exports = mongoose.model('Game', gameSchema);