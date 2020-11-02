const express = require("express");
const router = express.Router({mergeParams: true});
const Quiz = require("../models/quiz");
const Question = require("../models/question");
const QuestionBank = require("../models/questionbank");
const middleware = require("../middleware");

router.get("/:question_id", middleware.isLoggedIn, async function(req, res){
    await QuestionBank.findById(req.params.question_id).lean().exec(function(err,foundQuestion){
        if (err) {
            console.log(err)
        } else {
            Quiz.findById(req.params.id, async function(err, quiz){
                if(err){
                    console.log(err);
                    res.redirect("/quizzes");
                }else {
                    foundQuestion.author = {
                        id: quiz.author.id,
                        username: quiz.author.id.username
                    };
                    Question.findById(req.params.question_id, function(err,existQuestion){
                        if(err){
                            console.log(err)
                        } else {
                            //if question collcection already has this question, just save it under this quiz
                            if (existQuestion) {
                                existQuestion.author = {
                                    id: quiz.author.id,
                                    username: quiz.author.id.username
                                }
                                quiz.questions.push(existQuestion);
                                quiz.save()
                            } else {
                                //else create in question collcection and save
                                Question.create(foundQuestion,function(err,question){
                                    if(err){
                                        console.log(err)
                                    }else {
                                        question.save()
                                        quiz.questions.push(question);
                                        quiz.save()
                                    }
                                    
                                })
                            }
                            req.flash("success", "Question imported successfully!");
                            res.redirect("/quizzes/"+quiz._id);
                        }
                    })
                    
                }
            })
        }   
        
    })
})

router.get("/", middleware.isLoggedIn, async function(req, res){
    var search = '';
    await Quiz.findById(req.params.id, async function(err, foundQuiz){
        if(err){
            console.log(err);
        }else {
            if (req.query.search) {
                var noMatch = null;
                const regex = new RegExp(escapeRegex(req.query.search), 'gi');
                await QuestionBank.find({text: regex}, function(err,allQuestions){
                    if(err){
                        console.log(err);
                    }else {
                        if(allQuestions.length < 1){
                            noMatch = 'No question match that query, please try again!';
                        }
                        res.render("./questionbanks/list", {quiz:foundQuiz, questions: allQuestions, noMatch: noMatch, search: req.query.search}); //if we want to pass any var, can add inside {}
                    }
                });
            } else { 
                await QuestionBank.find({text: ''}, function(err,allQuestions){
                    if(err){
                        console.log(err);
                    }else {
                        // console.log("found quizzes");
                        res.render("./questionbanks/list", {quiz:foundQuiz,questions: allQuestions, noMatch: "Find and add questions", search:search}); //if we want to pass any var, can add inside {}
                    }
                });
            }
        }    
    });
});

//fuzzy search in mongoDB
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;