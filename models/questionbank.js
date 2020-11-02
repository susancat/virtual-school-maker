//the sub-doc collection retrieve from google sheets
const mongoose = require('mongoose');
const { Schema } = mongoose;

const sheetsSchema = new Schema({
    text: String,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    level: String,
    category: String, 
    public: { type: Boolean, default: true },
    author: {
        id: String,
        username: String
    }    
});

module.exports = mongoose.model("QuestionBank",sheetsSchema);