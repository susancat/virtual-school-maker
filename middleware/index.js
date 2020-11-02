const Quiz = require("../models/quiz");
const Question = require("../models/question");
const Course = require("../models/course")

const middlewareObj = {};

middlewareObj.checkOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Quiz.findById(req.params.id, function(err, foundQuiz){
                if(err) {
                    req.flash("error", "Quiz not found");
                    res.redirect("back");
                }else {
                    if(foundQuiz.author.id.equals(req.user._id)) {
                        next(); 
                    //maybe want to update or delete, next thing user want to do
                    }
                    else {
                        req.flash("error", "You don't have permission!");
                        res.redirect("back");
                    }
                }
            });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }   
}

middlewareObj.checkQuestionOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
        Question.findById(req.params.question_id, function(err, foundQuestion){
                if(err) {
                    res.redirect("back");
                }else {
                    if(foundQuestion.author.id.equals(req.user._id)) {
                        next(); 
                    //maybe want to update or delete, next thing user want to do
                    }
                    else {
                        req.flash("error", "You don't have permission!");
                        res.redirect("back");
                    }
                }
            });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }   
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if(req. isAuthenticated()){ //if logged in, show the next page
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login"); //otherwise go back to login
}

middlewareObj.checkCourseOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
        Course.findById(req.params.id, function(err, foundCourse){
                if(err) {
                    res.redirect("back");
                }else {
                    if(foundCourse.author.id.equals(req.user._id)) {
                        next(); 
                    //maybe want to update or delete, next thing user want to do
                    }
                    else {
                        req.flash("error", "You don't have permission!");
                        res.redirect("back");
                    }
                }
            });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }   
}

module.exports = middlewareObj;