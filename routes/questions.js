const express = require("express");
const router = express.Router({mergeParams: true});
const Quiz = require("../models/quiz");
const Question = require("../models/question");
const QuestionBank = require("../models/questionbank");
const middleware = require("../middleware");

const fs = require("fs");
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, './uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.originalname) 
    } 
}); 
  
const upload = multer({ storage: storage }); 

//Questions new
router.get("/new", middleware.isLoggedIn, function(req, res){
    Quiz.findById(req.params.id, function(err, quiz){
        if(err){
            console.log(err);
        }else {
            res.render("./questions/new", {quiz: quiz});
            // means quiz used in question (find matched) equals to quiz found by findById method
        }
    })    
})
//questions create, if public equals to true, and not exist in bank, create a copy
router.post("/", upload.single('image'), async function(req, res){
    const { text, option1, option2, option3, option4, category, level, public } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newQuestion = { text: text, level: level, category: category, option1: option1, option2: option2, option3: option3, option4: option4, public: public,author: author };
    const newQuestionBank = { text: text, level: level, category: category, option1: option1, option2: option2, option3: option3, option4: option4, public: public };
    await Quiz.findById(req.params.id, async function(err, quiz){
        if(err){
            console.log(err);
            res.redirect("/quizzes");
        }else {
            await Question.create(newQuestion, async function(err, question){
                if (err){
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                }else {
                    await question.save();
                    await quiz.questions.push(question);
                    await quiz.save();
                    if (public === 'true') {
                        //no idea why here public is string rather than boolean
                        QuestionBank.findById(question._id, function(err, question){
                            if (err) {
                                console.log(err)
                            } else {
                                if (question){
                                    console.log("Question exists in bank")
                                }else {
                                    QuestionBank.create(newQuestionBank, function(err, questionPublic){
                                        if (err){
                                            // req.flash("error", "Something went wrong!");
                                            console.log(err);
                                        }else {
                                            questionPublic.save();
                                            req.flash("success", "Question added successfully!")
                                            res.redirect("/quizzes/"+quiz._id);
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        req.flash("success", "Question added successfully!")
                        res.redirect("/quizzes/"+quiz._id);
                    }
                }
            })
       }
    });
});
router.get("/:question_id",async function(req,res){
    await Quiz.findById( req.params.id, async function(err,foundQuiz){
        if(err){
            console.log(err);
        }else {
            await Question.findById(req.params.question_id, function(err,foundQuestion){
                res.render("./quizzes/show", { quiz: foundQuiz, question: foundQuestion });
            })
        }
    });
})

router.post("/:question_id/image", upload.single('image'), middleware.isLoggedIn, async function(req, res){
    let image = null;
    if (req.file) {
        image = { 
        data: (fs.readFileSync(path.join('./uploads/' + req.file.filename))).toString('base64'),
        contentType: 'image/jpg'
        }
    }else {
        image = null
    } 
    await Quiz.findById(req.params.id, async function(err, foundQuiz){
        if (err) {
            console.log(err);
        }else {
            await Question.findById(req.params.question_id, function(err, foundQuestion){
                if (err) {
                    console.log(err);
                }else {
                    foundQuestion.image = image
                    foundQuestion.save()
                    // foundQuiz.save()
                    // res.render("quizzes/show", { quiz: foundQuiz, quiz_id: req.params.id, question: foundQuestion });
                    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                    res.redirect("/quizzes/" + req.params.id);
                }
            });
        }
    });    
});

//edit question ROUTE
router.get("/:question_id/edit", middleware.checkQuestionOwnership, function(req,res){
    //need to find the question id
    Question.findById(req.params.question_id, function(err, foundQuestion){
        if(err) {
            res.redirect("back");
        } else {
            res.render("questions/edit", {quiz_id: req.params.id, question: foundQuestion});
        }
    }) 
});
//UPDATE question ROUTE
router.put("/:question_id", middleware.checkQuestionOwnership, function(req, res){
    Question.findByIdAndUpdate(req.params.question_id, req.body.question, function (err,updatedQuestion){
        if(err) {
            res.redirect("back");
        }else {
            res.redirect("/quizzes/" + req.params.id);
        }
    });
});

//DELETE question ROUTE
router.delete("/:question_id", middleware.checkQuestionOwnership, function(req, res){
    Question.findByIdAndRemove(req.params.question_id, function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Question deleted successfully!")
            res.redirect("/quizzes/" + req.params.id);
        }
    });
});

router.delete("/:question_id/image", middleware.checkQuestionOwnership, async function(req, res){
    await Question.findById(req.params.question_id, function(err,foundQuestion){
        if(err){
            res.redirect("/quizzes/" + req.params.id);
        }else {
            foundQuestion.image = undefined;
            foundQuestion.save()
            res.redirect("/quizzes/" + req.params.id);
        }
    });
});

module.exports = router;