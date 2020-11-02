const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const Player = require("../models/player");
const middleware = require("../middleware");

router.get("/", (req, res) => {
    res.send("First steps on Fetching Player Data!")
    // res.render("./players/show");
  })

  router.get("/:id", async (req, res) => {
    async function playerDataCheck() {
        const playerData = await Player.findOne({ userID: `${req.params.id}` })
        // We use the mongoose findOne method to check if a record exists
       // with the given ID, so use "get" here
    
        if (playerData) {
         // If exists return the data
          return playerData
        } else {
          
          const newPlayerData = new Player({
            userID: `${req.params.id}`,
            points: 0,
            name:"",
            studentID:"",
            classID: "",
            quizID: "",
            remark: ""
          })
          
          // const newPlayer = await newPlayerData.save()
          const newPlayer = await newPlayerData.save()
          // If not exists, we save a new record and return that
          return newPlayer
        }
      }
      res.json(await playerDataCheck());
  })

  //student new by teacher--routes conflict
// router.get("/new", function(req, res){
//   Course.findById(req.params.id, function(err, course){
//       if(err){
//           console.log(err);
//       }else {
//           res.render("./players/new", {course: course});
//           // means quiz used in question (find matched) equals to quiz found by findById method
//       }
//   })
  
// })

  router.post("/update-info/:id", async(req,res) => {
    const { name, studentID, classID, points, quizID, remark } = req.body;

    await Player.findOneAndUpdate(
      { userID: `${req.params.id}` },
        { $set: 
          { points: points }}
    );
    res.send("Updated points.");
    await Player.findOneAndUpdate({
      userID: `${req.params.id}` },
      { $set: 
        { name: name }
      },
      { overwrite:true }
    )
    await Player.findOneAndUpdate({
      userID: `${req.params.id}`},
      { $set:
      {studentID: studentID}
    }
    )
    await Player.findOneAndUpdate({
      userID: `${req.params.id}` },
      { $set: 
        { classID: classID }
      }
    )
    await Player.findOneAndUpdate({
      userID: `${req.params.id}` },
      { $set: 
        { quizID: quizID }
      }
    )
    await Player.findOneAndUpdate({
      userID: `${req.params.id}` },
      { $set: 
        { remark: remark }
      }
    )
    // const newStudent = { name: name, studentID: studentID, classID: classID, points: points, remark: remark };
    await Course.findOne( { classID: classID }, async function(err, course){
      if(err){
          console.log(err);
          res.redirect("/courses");
      }else {
        await Player.findOne( { userID: `${req.params.id}`}, async function(err, player){
          if (err){
              req.flash("error", "Something went wrong!");
              console.log(err);
          }else {
            player.name = name;
            player.studentID = studentID;
            player.classID = classID;
            player.quizID = quizID;
            player.points = points;
            player.remark = remark;
            await player.save();
              //add something to delete duplicated 
            await course.players.addToSet(player);
            await course.save();
          }
      })
      }
  });
});

//EDIT student ROUTE
router.get("/:player_id/edit", async function(req,res){
  //need to find the question id
  await Player.findById(req.params.player_id, function(err, foundPlayer){
      if(err) {
          res.redirect("back");
      } else {
          res.render("players/edit", { course_id: req.params.id, player: foundPlayer });
      }
  })
});
//UPDATE student ROUTE, in this code, one player only one record
router.put("/:player_id", async function(req, res){
  await Player.findOneAndUpdate( req.body.userID, req.body.player, function (err,updatedPlayer){
      if(err) {
          res.redirect("back");
      }else {
          req.flash("success", "Student's record updated successfully!")
          res.redirect("/courses/" + req.params.id);
      }
  });
});

//DELETE student ROUTE
router.delete("/:player_id", function(req, res){
  Player.findByIdAndRemove( req.params.player_id, function(err){
      if(err) {
          res.redirect("back");
      } else {
          req.flash("success", "Student deleted successfully!")
          res.redirect("/courses/" + req.params.id);
      }
  });
});

module.exports = router;