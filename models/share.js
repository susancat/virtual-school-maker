const mongoose = require('mongoose')
const { Schema } = mongoose;


const shareSchema = new Schema({
   title: String,
   text: String,
   author: {
      id: {
          type: Schema.Types.ObjectId,
          ref: "User"
          },
      username: String
  }
})

module.exports = mongoose.model('Share', shareSchema)