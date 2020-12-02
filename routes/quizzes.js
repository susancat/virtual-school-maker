const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");
const middleware = require("../middleware");
// const shortid = require("shortid");
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

router.get("/", middleware.isLoggedIn, async function(req, res){
    if (req.query.search) {
        var noMatch = null;
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        await Quiz.find({title: regex}, function(err,allQuizzes){
            if(err){
                console.log(err);
            }else {
                if(allQuizzes.length < 1){
                    noMatch = 'No quiz match that query, please try again!';
                }// console.log("found quizzes");
                res.render("./quizzes/index", {quizzes: allQuizzes, noMatch: noMatch}); //if we want to pass any var, can add inside {}
            }
        });
    } else { 
        await Quiz.find({}, function(err,allQuizzes){
            if(err){
                console.log(err);
            }else {
                // console.log("found quizzes");
                res.render("./quizzes/index", {quizzes: allQuizzes, noMatch: noMatch}); //if we want to pass any var, can add inside {}
            }
        });
    }
    //get all quizzes from DB by find(), the following :quizzes are not from params anymore
    
});

//route principle: better to name the post page name the same with the above
router.post("/", upload.single('image'), middleware.isLoggedIn, async function(req, res){
    const { title, level, category, description, public } = req.body;
    let image = null;
    if (req.file) {
        image = { 
        data: (fs.readFileSync(path.join('./uploads/' + req.file.filename))).toString('base64'),
        contentType: 'image/jpg'
        }
    }else {
        image = null
    } 
    
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newQuiz = {title: title, level: level, category: category, image: image, description: description, author: author, public: public};
    // create a new Quiz and save to DB
    await Quiz.create(newQuiz, function(err, newly){
            if (err) {
                console.log(err);
            }else {
                const id = newly._id
                req.flash("success", "Quiz added successfully!")
                res.redirect("/quizzes/" + id);
            }
    });
});
// quizzes.push({title: site, image: image});

router.post("/:id/image", upload.single('image'), middleware.isLoggedIn, async function(req, res){
    let image = null;
    if (req.file) {
        image = { 
        data: (fs.readFileSync(path.join('./uploads/' + req.file.filename))).toString('base64'),
        contentType: 'image/jpg'
        }
    }else {
        image = null
    } 
    await Quiz.findById(req.params.id).populate("questions"). exec(function(err, foundQuiz) {
            if (err) {
                console.log(err);
            }else {
                foundQuiz.image = image
                foundQuiz.save()
                res.render("./quizzes/show", { quiz: foundQuiz });
            }
    });
});
//new gain the data and send
router.get("/new", middleware.isLoggedIn, function(req, res){ //notice about "/" important!!
    res.render("./quizzes/new", {baseUrl: req.baseUrl}); // the form
});

//not ask for login for roblox fetching data temporarily
router.get("/:id", middleware.isLoggedIn, async function(req, res){
    //provide id for the item by req.params.id
    await Quiz.findById(req.params.id).populate("questions"). exec(function(err, foundQuiz){
        if(err) {
            console.log(err);
        }else{
            res.render("./quizzes/show", { quiz: foundQuiz });
        }
    });
});

router.get("/play", async function(req, res){
    await Quiz.find({}, function(err,allQuizzes){
        if(err){
            console.log(err);
        }else {
            res.json(allQuizzes)
        }
    }) 
});

router.get("/play/:id", async function(req, res){
    await Quiz.findById(req.params.id).populate("questions"). exec(function(err, foundQuiz){
        if(err) {
            console.log(err);
        }else{
            res.json(foundQuiz)
        }
    });
});

//EDIT Quiz ROUTE
router.get("/:id/edit", middleware.checkOwnership, function(req,res){
    Quiz.findById(req.params.id, function(err, foundQuiz){
        res.render("quizzes/edit", {quiz: foundQuiz});
    }); //the above is the next()
});

//UPDATE quiz ROUTE, it moved to quizbank routes
// router.put("/:id", async function(req,res){
//     await Quiz.findByIdAndUpdate(req.params.id, req.body.quiz, function(err,updatedQuiz){
//         if(err){
//             res.redirect("/quizzes");
//         }else {
//             res.redirect("/quizzes/" + req.params.id)
//         }
//     });
// });

//DELETE ROUTE
router.delete("/:id", middleware.checkOwnership, async function(req, res){
    await Quiz.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/quizzes");
        }else {
            res.redirect("/quizzes");
        }
    });
});

//DELETE ROUTE
router.delete("/:id/image", middleware.checkOwnership, async function(req, res){
    await Quiz.findById(req.params.id, function(err,foundQuiz){
        if(err){
            res.redirect("/quizzes/" + req.params.id);
        }else {
            foundQuiz.image = undefined;
            foundQuiz.save()
            res.redirect("/quizzes/" + req.params.id);
        }
    });
});

//fuzzy search in mongoDB
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;

