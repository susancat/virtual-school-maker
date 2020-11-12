
const express = require("express");
const router = express.Router({mergeParams: true});
const Quiz = require("../models/quiz");
const middleware = require("../middleware");
const mongoose = require('mongoose');

router.get("/quizbank", async function(req, res){
        if (req.query.search) {
            var noMatch = null;
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            await Quiz.find({title: regex, 'public': "true"}, function(err,allQuizzes){
                if(err){
                    console.log(err);
                }else {
                    if(allQuizzes.length < 1){
                        noMatch = 'No quiz match that query, please try again!';
                    }
                    res.render("./quizbanks/index", { quizzes: allQuizzes, noMatch: noMatch }); 
                }
            });
        } else { 
            await Quiz.find({'public': "true"}, function(err,allQuizzes){
                if(err){
                    console.log(err);
                }else {
                    res.render("./quizbanks/index", {quizzes: allQuizzes, noMatch: noMatch}); //if we want to pass any var, can add inside {}
                }
            });
        } 
    });

//show certain particular Quiz with more details
router.get("/quizbank/:id", async function(req, res){
    await Quiz.findById(req.params.id).populate("questions"). exec(function(err, foundQuiz){
        if(err) {
            console.log(err);
        }else{
            res.render("./quizbanks/show", {quiz: foundQuiz});
        }
    });      
});

router.get("/quizbank/:id/edit", middleware.isLoggedIn, function(req,res){
    Quiz.findById(req.params.id, function(err, foundQuiz){
        res.render("quizbanks/edit", {quiz: foundQuiz});
    }); 
});

router.put("/quizzes/:id", middleware.isLoggedIn, async function(req,res){
    //if no identical quiz under current user,clone the public quiz 
    //otherwise just update it
    const updateQuiz = await (Quiz.findOne({ 'author.id': req.user._id, '_id': req.params.id}))
    if (updateQuiz) {
        await updateQuiz.updateOne(req.body.quiz, function(err,updatedQuiz){
            if(err){
                res.redirect("/quizzes");
            }else {
                res.redirect("/quizzes/" + req.params.id)
            }
        });
    } else {
        await Quiz.findById(req.params.id).exec(async function(err,foundQuiz){
            if (err) {
                console.log(err)
            } else {
                const quiz = foundQuiz;
                //assign the cloned quiz a new id
                quiz._id = mongoose.Types.ObjectId();
                quiz.author = {
                    id: req.user._id,
                    username: req.user.username
                }
                quiz.public = false;
                quiz.isNew = true;
                await foundQuiz.save();
                res.redirect("/quizzes");
            }
        });
    }
})

//fuzzy search in mongoDB
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;