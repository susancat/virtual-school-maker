const express = require("express");
const router = express.Router({mergeParams: true});
const Course = require("../models/course");
const Email = require("../models/email");
const middleware = require("../middleware");
const keys = require('../config/keys');

// const Mailer = require('../services/Mailer');
// const emailTemplate = require('../services/emailTemplates/emailTemplate');
const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(keys.sendGridKey);
sgMail.setApiKey('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');
router.get("/new", middleware.isLoggedIn, function(req, res){
    Course.findById(req.params.id, function(err, course){
        if(err){
            console.log(err);
        }else {
            res.render("./emails/new", {course: course});
        }
    })    
})

router.post("/", middleware.isLoggedIn, function(req, res){
    const { subject,from,text,to,html } = req.body;
    const newEmail = {
        to: to.split(',').map(email => ({ email: email.trim() })),
        from,
        subject,
        text,
        html
      };
    Course.findById(req.params.id, function(err, course){
        if(err){
            console.log(err);
            res.redirect("/courses");
        }else {
            Email.create(newEmail, async function(err, email){
                if (err){
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                }else {
                    try {
                        // const mailer = new Mailer(email, emailTemplate(email));
                        await sgMail.send(email);
                        await email.save();
                        await course.emails.push(email);
                        await course.save();
                        req.flash("success", "Email sent successfully!")
                        res.redirect("/courses/"+course._id);
                    } catch {
                        res.status(422).send(err);
                    }
                }
            })
        }
    });
});

router.get("/:email_id/edit", function(req,res){

    Email.findById(req.params.email_id, function(err, foundEmail){
        if(err) {
            res.redirect("back");
        } else {
            res.render("emails/edit", {course_id: req.params.id, email: foundEmail});
        }
    }) 
});

router.put("/:email_id", function(req, res){
    Email.findByIdAndUpdate(req.params.email_id, req.body.email, function (err,updatedEmail){
        if(err) {
            res.redirect("back");
        }else {
            res.redirect("/courses/" + req.params.id);
        }
    });
});

router.delete("/:email_id", function(req, res){
    Email.findByIdAndRemove(req.params.email_id, function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Email deleted successfully!")
            res.redirect("/courses/" + req.params.id);
        }
    });
});

module.exports = router;