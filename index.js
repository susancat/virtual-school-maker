const express = require("express"),
      app = express(),
      mongoose = require("mongoose"),
      flash = require ("connect-flash"),
      passport = require("passport"),
      // LocalStrategy = require("passport-local"),
      // GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
      methodOverride = require("method-override")

// const Quiz = require("./models/quiz"),
//       Question = require("./models/question"),
//       User = require("./models/user"),
//       Course = require("./models/course"),
//       Player = require('./models/player'),
//       Email = require("./models/email"),
//       Recipient = require("./models/recipient"),
//       QuizBank = require("./models/quizbank"),
//       QuestionBank = require("./models/questionbank")

require('./services/passport');

const questionRoutes = require("./routes/questions"),
      quizRoutes = require("./routes/quizzes"),
      indexRoutes = require("./routes/index"),
      authRoutes = require("./routes/authRoutes"),
      courseRoutes = require ('./routes/courses'),
      playerRoutes = require("./routes/players"),
      emailRoutes = require("./routes/emails"),
      quizbankRoutes = require("./routes/quizbanks"),
      questionBankRoutes = require("./routes/questionbanks"),
      reportRoutes = require("./routes/reports")

//extract data from request body and turn to JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use('/static', express.static(__dirname+"/src"));
app.use(methodOverride("_method"));


app.set("view engine", "ejs");

const DATABASEURL="mongodb+srv://daltonlearninglab:cpFtJEN4u37dR7r@quiz-trivia.7h3bm.mongodb.net/quiz-trivia?retryWrites=true&w=majority";
const LOCALDB="mongodb://localhost:27017/Quiz"
mongoose.connect(DATABASEURL || LOCALDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

//passport configuration
app.use(require("express-session")({
    secret: "One again rusty wins",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//put "currentUser: req.user" in res.locals make it's in all templates
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); //if no next, it will stop at middleware
});

app.use(indexRoutes);
app.use(authRoutes);
app.use("/", quizbankRoutes);
app.use("/quizzes", quizRoutes);
app.use("/quizzes/:id/questions", questionRoutes);
app.use("/quizzes/:id/questionbank", questionBankRoutes);
app.use("/courses", courseRoutes);
app.use("/courses/:id/player-data", playerRoutes);
app.use("/courses/:id/emails", emailRoutes);
app.use("/courses/:id/reports", reportRoutes);

app.listen(process.env.PORT || 3000, function(){
    console.log("Quiz Trivia has started");
});