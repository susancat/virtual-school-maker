const mongoose = require('mongoose');
const { Schema } = mongoose;

const quizBankSchema = new Schema ({
    title: String,
    category: String,
    level: String,
    description: String,
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }], 
    author: {
        id: String,
        username: String
    },    
    public: { type: Boolean, default: false },
    dateCreated: Date,
    lastUpdated: Date 
});

module.exports = mongoose.model('Quizbank', quizBankSchema);