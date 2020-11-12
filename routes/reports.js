const express = require("express");
const router = express.Router({mergeParams: true});
const Course = require("../models/course");
const Report = require("../models/report");
const Player = require("../models/player");
const middleware = require("../middleware");
const { Promise } = require("mongoose");

router.get("/", middleware.isLoggedIn, async function(req,res){
    Course.findById(req.params.id).populate("reports"). exec(function(err, course){
        if(err) {
            console.log(err);
        }else{
            res.render("./reports/index", { course: course });
        }
    });
})

router.post("/", middleware.isLoggedIn, async function(req, res){ 
    // console.log(req.body)
    const { quizname,quizid } = req.body.report;
    const players = [];
    const dateCreated = new Date();
    // const deadline = new CalendarDates();
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    await Course.findById(req.params.id, async function(err, course){
        if(err){
            console.log(err);
        }else {
            const newReport = { quizname:quizname, quizid: quizid, players: players, dateCreated: dateCreated, author:author }
            await Report.create(newReport, async function(err, report){
                if (err){
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                }else {
                    try {
                        await report.save();
                        await course.reports.push(report);
                        await course.save();
                        req.flash("success", "New record created, now share the PIN and class ID with your students!")
                        res.redirect("/courses/" + course._id);
                    }catch (err) {
                        console.log(err)
                    }
                }
            })
        }
    });
});

router.get("/:report_id", middleware.isLoggedIn, async function(req, res){
    await Report.findById(req.params.report_id, function(err, foundReport){
        if(err) {
            res.redirect("back");
        } else {
            res.render('reports/show', { course_id: req.params.id, report: foundReport });
        }
    }) 
});

router.get("/:report_id/edit", middleware.isLoggedIn, async function(req, res){
    await Report.findById(req.params.report_id, function(err, foundReport){
        if(err) {
            res.redirect("back");
        } else {
            res.render('reports/edit', { course_id: req.params.id, report: foundReport });
        }
    }) 
});

router.put("/:report_id", middleware.isLoggedIn, async function(req,res){
    const id = req.params.report_id;
    await Course.findById(req.params.id, async function(err, course){
        if(err) {
            res.redirect("back");
        } else {
            await Report.findById(id, async function(err,report) {
                if(err) {
                    console.log(err);
                } else {
                    const players1 = course.players;
                    const players2 = report.players.filter(x => x._id)
                    const difference = players1.filter(x => !players2.includes(x));
                    await Promise.all(difference.map(async (player) => {
                        await Player.findById(player, async function(err, foundPlayer){
                            if(err){
                                console.log(err)
                            } else {
                                if (foundPlayer && (foundPlayer.quizID === report.quizid)) {
                                    try {
                                        await report.players.addToSet(foundPlayer);
                                        // await report.save(); should not be there cause .save will save item paralellly
                                    } catch (err) {
                                        console.log(err)
                                    }                           
                                }
                            }                            
                        })
                    }))
                    report.quizname = req.body.report.quizname;
                    await report.save();
                    res.render("reports/show", {course:course, course_id: req.params.id, report: report });
                }
            })
        }
    }) 
});

router.get("/:report_id/data", middleware.isLoggedIn, async function(req, res){
    await Report.findById(req.params.report_id).populate("players.Object").exec(function(err, foundReport){
        if(err) {
            console.log(err);
        }else{
            res.json(foundReport)
        }
    });
});

router.delete("/:report_id", middleware.isLoggedIn, function(req, res){
    Report.findByIdAndRemove( req.params.report_id, function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Report deleted successfully!")
            res.redirect("back");
        }
    });
  });
module.exports = router;














