const mongoose = require('mongoose')
const { Schema } = mongoose;
//First we require mongoose in our player.js file

// Then we define Schema as the mongoose.Schema method
// mongoose Schemas define the structure of the data records (also known as documents // in MongoDB)


const playerSchema = new Schema({
   userID: { type: String, unique: true },
   points: { type: Number, default: 0 },
   name: { type: String, default: "" },
   studentID:{ type: String, default: "" },
   classID: { type: String,default: "" },
   quizID: { type: String,default: "" },
   remark: { type: String, default: "" }
})

//maybe points and other admin-related properties
module.exports = mongoose.model('Player', playerSchema)
// Now we create a new mongoose model with the name and the schema
// Finally we export the Model and the Schema so we can use it in our other files!