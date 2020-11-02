//the sub-doc collection
const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    text: String,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    answer: String,
    level: String,
    category: String,
    public: { type: Boolean, default: false },
    author: {
        id: {
            type: Schema.Types.ObjectId,
            ref: "User"
            },
        username: String
    }    
});

module.exports = mongoose.model("Question",questionSchema);