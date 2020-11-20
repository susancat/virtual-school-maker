const express = require("express"),
      app = express(),
      mongoose = require("mongoose"),
      flash = require ("connect-flash"),
      passport = require("passport"),
      methodOverride = require("method-override"),
      logger = require('morgan'),
    //   createError = require('http-errors'),
      cookieParser = require('cookie-parser');
      
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
      reportRoutes = require("./routes/reports"),
      shareRoutes = require("./routes/assignments")

//extract data from request body and turn to JSON
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use('/static', express.static(__dirname+"/src"));
app.use(methodOverride("_method"));
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });

app.set("view engine", "ejs");

const DATABASEURL="mongodb+srv://daltonlearninglab:cpFtJEN4u37dR7r@quiz-trivia.7h3bm.mongodb.net/quiz-trivia?retryWrites=true&w=majority";
const LOCALDB="mongodb://localhost:27017/Quiz"
mongoose.connect(DATABASEURL || LOCALDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: true
});

//passport configuration
app.use(require("express-session")({
    secret: "One again rusty wins",
    resave: false,
    saveUninitialized: false,
    httpOnly: true,  // Don't let browser javascript access cookies.
    secure: true // Only use cookies over https.
}));

app.use(passport.initialize());
app.use(passport.session());

//put "currentUser: req.user" in res.locals make it's in all templates
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); //if no next, it will stop at middleware
});

//HTTPS redirect middleware
function ensureSecure(req, res, next) {
    //Heroku stores the origin protocol in a header variable. The app itself is isolated within the dyno and all request objects have an HTTP protocol.
    if (req.get('X-Forwarded-Proto')=='https' || req.hostname == 'localhost') {
        //Serve App by passing control to the next middleware
        next();
    } else if(req.get('X-Forwarded-Proto')!='https' && req.get('X-Forwarded-Port')!='443'){
        //Redirect if not HTTP with original request URL
        // res.redirect('https://' + req.hostname + req.url);
        res.redirect('https://' + req.hostname + req.originalUrl);
    }
}

app.use('/', ensureSecure);
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
app.use("/courses/:id/assignments", shareRoutes);

app.listen(process.env.PORT || 3000, function(){
    console.log("Virtual School Maker has started");
});