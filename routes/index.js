const express = require("express");
const router = express.Router({mergeParams: true});
const passport = require("passport");
const User = require("../models/user");
const QuestionBank = require("../models/questionbank");
const Quiz = require("../models/quiz");
const Course = require("../models/course");
const Player = require("../models/player");
const Report = require("../models/report");
const Share = require("../models/share");
const middleware = require("../middleware");
const butter = require('buttercms')('c50ea105ed2cdc44abe084a42fe997bca3ae187e');
//85b519dc8cff91e5df1cf632ba73d4b92a420506
router.get('/', function(req, res, next) {
    butter.page.retrieve('*','home_page').then(function(resp){
      var page = resp.data.data;
      res.render('landingPage/index', { title: 'Virtual School Maker' , page_name: 'home', homepage: page.fields});
    }).catch(function(resp){
      console.log('failed');
    });
})

router.get('/games', function(req, res){
    butter.page.retrieve('*','games').then(function(resp){
      var page = resp.data.data;
      res.render('landingPage/games', {page_name:'games', page: page.fields});
    }).catch(function(resp){
      console.log('failed');
    });
});
  
router.get('/testamonials', function(req, res){
    butter.page.retrieve('*', 'testimonials').then(function(resp){
      var page = resp.data.data;
      res.render('landingPage/testamonials', {page_name: 'testamonials', page: page.fields});
    }).catch(function(resp){
      console.log('failed');
    });
});

router.get("/dashboard", middleware.isLoggedIn, async function(req, res){
    Course.find({}, function(err,allCourses){
        if (err) {
            console.log(err)
        } else {
           Quiz.find({}, function(err,allQuizzes){
                if(err){
                    console.log(err);
                }else {
                    res.render("dashboard", { courses: allCourses, quizzes: allQuizzes})
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
    const { username, email } = req.body
    const newUser = new User({username: username, email: email.trim()});
    User.findOne({ email }, function(err, foundUser) {
        if(foundUser){
            req.flash("error"," The email you have entered is already associated with another account.");
            res.redirect("/register");
        } else {
            User.register(newUser, req.body.password, function(err, user){
                if(err){
                    // req.flash("error", err.message);
                    req.flash("error","User name is already used!")
                    return res.render("register");
                }passport.authenticate("local")(req, res, function(){
                    req.flash("success","Welcome to Quiz Trivia! " + user.username);   
                    res.redirect("/dashboard");
                });
            });
        }
    })   
});
//login
router.get("/login", function(req, res){
    res.render("login");
});

// the below equals to app.post("/login", middleware, callback),middleware will call localstrategy
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res){
//it did nothing, just let us aware the middleware
});

//log out
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out")
    res.redirect("/");
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
router.get("/assignments/:id", async function(req,res){
    await Share.findById(req.params.id, function(err,assignment){
        if(err) {
            console.log(err)
        } else {
            res.json(assignment)
        }
    })
})

router.get("/players/:id",async function(req,res){
    await Player.findOne({ userID: `${req.params.id}`}, function(err,player){
        if(err) {
            console.log(err)
        } else {
            res.json(player)
        }
    })
})

module.exports = router;
