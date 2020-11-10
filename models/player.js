const mongoose = require('mongoose')
const { Schema } = mongoose;

const playerSchema = new Schema({
   userID: { type: String, unique: true },
   points: { type: Number, default: 0 },
   cash: { type: Number, default: 0 },
   name: { type: String, default: "" },
   studentID:{ type: String, default: "" },
   classID: { type: String,default: "" },
   quizID: { type: String,default: "" },
   remark: { type: String, default: "" }
})

module.exports = mongoose.model('Player', playerSchema)