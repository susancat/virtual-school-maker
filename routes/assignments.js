const express = require("express");
const router = express.Router({mergeParams: true});
const Course = require("../models/course");
const Share = require("../models/share");
const middleware = require("../middleware");

router.get("/", async (req, res) => {
    await Course.findById(req.params.id).populate("assignments"). exec(function(err, foundCourse){
        if(err){
            console.log(err);
        }else {
            res.render("./assignments/index", {course: foundCourse}); //if we want to pass any var, can add inside {}
        }
    });
})

router.get("/new", middleware.isLoggedIn, function(req, res){
    Course.findById(req.params.id, function(err, foundCourse){
        if(err){
            console.log(err);
        }else {
            res.render("assignments/new", {course: foundCourse});
        }
    })    
})

router.post("/", async function(req, res){ 
    const { title,text } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    await Course.findById(req.params.id, async function(err, course){
        if(err){
            console.log(err);
        }else {
            const newAssignment = { title: title, text: text, author: author };
            await Share.create(newAssignment, async function(err, assignment){
                if (err){
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                }else {
                    try {
                        await assignment.save();
                        await course.assignments.push(assignment);
                        await course.save();
                        req.flash("success", "Successfully created!")
                        res.redirect("/courses/" + course._id);
                    }catch (err) {
                        console.log(err)
                    }
                }
            })
        }
    });
});

router.get("/:assignment_id/edit", function(req,res){
    Share.findById(req.params.assignment_id, function(err, foundAssignment){
        if(err) {
            res.redirect("back");
        } else {
            res.render("assignments/edit", {course_id: req.params.id, assignment: foundAssignment});
        }
    }) 
});

module.exports = router;

