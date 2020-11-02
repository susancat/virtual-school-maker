const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");
const Course = require("../models/course");
const middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
    if (req.query.search) {
        var noMatch = null;
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Course. find({name: regex}, function(err,allCourse){
            if(err){
                console.log(err);
            }else {
                if(allCourse.length < 1){
                    noMatch = 'No class match that query, please try again!';
                }
                res.render("./courses/index", {courses: allCourse, noMatch: noMatch}); //if we want to pass any var, can add inside {}
            }
        });
    } else { 
        Course.find({}, function(err, allCourse){
            if(err){
                console.log(err);
            }else {
                res.render("./courses/index", {courses: allCourse, noMatch: noMatch}); //if we want to pass any var, can add inside {}
            }
        });
    }
    
});

//route principle: better to name the post page name the same with the above
router.post("/", middleware.isLoggedIn, function(req, res){
    const { name, teacher, tutor, classID, subject, description, serverlink1} = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCourse = {name: name, teacher: teacher, tutor: tutor, classID: classID, subject: subject, description: description, author: author, serverlink1: serverlink1};
    // create a new class and save to DB
    Course.create(newCourse, function(err, newly){
            if (err) {
                console.log(err);
            }else {
                const id = newly._id
                req.flash("success", "Class added successfully!")
                res.redirect("/courses/" + id);
            }
        });
    });
    // classes.push({name: site, image: image});

//new gain the data and send
router.get("/new", middleware.isLoggedIn, function(req, res){ //notice about "/" important!!
    res.render("./courses/new"); // the form
});

//show certain particular class with more details
router.get("/:id", middleware.isLoggedIn, function(req, res){
    Course.findById(req.params.id).populate({path:"players", options: {sort:'-points'}}).exec(function(err, foundCourse){
        if(err) {
            console.log(err);
        }else{
            Quiz.find({}, function(err,allQuizzes){
                if(err){
                    console.log(err);
                }else {
                    res.render("./courses/show", { course: foundCourse, quizzes: allQuizzes });
                }
            });
        }
    });
});

//EDIT classes ROUTE
router.get("/:id/edit", middleware.checkCourseOwnership, function(req,res){
    Course.findById(req.params.id, function(err, foundCourse){
        res.render("courses/edit", {course: foundCourse});
    }); //the above is the next()
});

//UPDATE classes ROUTE
router.put("/:id", middleware.checkCourseOwnership, function(req,res){
    Course.findByIdAndUpdate(req.params.id, req.body.course, function(err,updatedCourse){
        if(err){
            res.redirect("/courses");
        }else {
            res.redirect("/courses/" + req.params.id)
        }
    });
});

//DELETE ROUTE
router.delete("/:id", middleware.checkCourseOwnership, function(req, res){
    Course.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/courses");
        }else {
            res.redirect("/courses");
        }
    });
});

//fuzzy search in mongoDB
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;

