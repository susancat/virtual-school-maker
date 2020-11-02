const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const QuestionBank = require("../models/questionbank");
const Quiz = require("../models/quiz");
const Course = require("../models/course");
const Report = require("../models/report");
const middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, async function(req, res){
    Course.find({}, function(err,allCourses){
        if (err) {
            console.log(err)
        } else {
           Quiz.find({}, function(err,allQuizzes){
                if(err){
                    console.log(err);
                }else {
                    res.render("landing", { courses: allCourses, quizzes: allQuizzes})
                }
            }) 
        }       
    })
});

//sign up page
router.get("/register", function(req, res){
    res.render("register");
});

//get sign up
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.render("register");
       }passport.authenticate("local")(req, res, function(){
        req.flash("success","Welcome to Quiz Trivia! " + user.username);   
        res.redirect("/");
       });
   });
});
//login
router.get("/login", function(req, res){
    res.render("login");
});
// the below equals to app.post("/login", middleware, callback),middleware will call localstrategy
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res){
//it did nothing, just let us aware the middleware
});

//log out
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out")
    res.redirect("/login");
});

router.get("/questionbank/:category", async function(req,res){
    await QuestionBank.find({category: `${req.params.category}`}, function(err,allQuestions){
        if(err) {
            console.log(err)
        } else {
            res.json(allQuestions)
        }
    })
})

router.get("/reports", middleware.isLoggedIn, async function(req,res){
    await Report.find({}, function(err,allReports){
        if(err) {
            console.log(err)
        } else {
            res.render("reports/list", {reports:allReports})
        }
    })
})

router.get("/reports/:id", middleware.isLoggedIn, async function(req,res){
    await Report.findById(req.params.id, function(err,report){
        if(err) {
            console.log(err)
        } else {
            res.render("reports/show2", {report:report})
        }
    })
})

router.get("/reports/:id/data", middleware.isLoggedIn, async function(req,res){
    await Report.findById(req.params.id, function(err,report){
        if(err) {
            console.log(err)
        } else {
            res.json(report)
        }
    })
})
module.exports = router;
